# Parallel Transcription Plan

## Context

The current implementation splits large audio files into 3-minute chunks (25 MB limit)
and then transcribes them **sequentially**. For a 60-minute file that's 20 API calls
made back to back — pure dead time.

OpenAI's Batch API (`/v1/batch`) does **not** support `/v1/audio/transcriptions`, so
the async 24-hour batch path is not available. Client-side parallel requests are the
only option.

---

## Changes

### 1. Switch transcription model: `whisper-1` → `gpt-4o-mini-transcribe`

File: `cli/src/transcriber.ts:100`

| | whisper-1 | gpt-4o-mini-transcribe |
|-|-----------|------------------------|
| Price | $0.006/min | $0.003/min |
| Speed | slower | faster |

No output format changes needed — both return plain text when `response_format: "text"`.

---

### 2. Replace sequential loop with a bounded concurrency pool

File: `cli/src/transcriber.ts` — `transcribe()` function, currently lines 123–129.

**Concurrency default: 4** (safe for Tier 1, ~50 RPM limit on whisper endpoints).

Approach — a simple queue-based pool (no extra dependency):

```ts
async function transcribeChunks(
  client: OpenAI,
  chunks: string[],
  concurrency = 4,
  onProgress: (done: number, total: number) => void
): Promise<string[]> {
  const results: string[] = new Array(chunks.length);
  let nextIndex = 0;
  let completed = 0;

  async function worker() {
    while (nextIndex < chunks.length) {
      const i = nextIndex++;
      results[i] = await transcribeFileWithRetry(client, chunks[i]);
      onProgress(++completed, chunks.length);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}
```

- Results are written by index, so `join(" ")` order is preserved.
- Workers drain a shared queue; no idle slots.

---

### 3. Retry with exponential backoff on 429 / 5xx

New helper `transcribeFileWithRetry()` wraps the existing `transcribeFile()`:

- Up to **3 retries**.
- Backoff: 2 s → 4 s → 8 s.
- Only retries on 429 (rate limit) and 5xx status codes.
- Throws immediately on 4xx client errors (bad key, unsupported format, etc.).

---

### 4. Update progress spinner

The current spinner shows `Transcribing chunk i/N` which breaks with parallelism.
Replace with a completion counter: `Transcribing... (X/N complete)`, updated on each
chunk finishing.

---

## What does NOT change

- Chunk splitting logic (ffmpeg, 3-min chunks, temp dir cleanup) — untouched.
- CLI flags and public API surface (`transcribe(filePath, apiKey)`).
- The 25 MB per-chunk size guard.

---

## Files touched

| File | Change |
|------|--------|
| `cli/src/transcriber.ts` | Model name, pool function, retry helper, spinner text |

No new dependencies required.

---

## Expected outcome

For a 60-minute file (20 chunks), wall-clock time drops from ~20× serial latency to
roughly ~5× chunk latency (4 parallel workers). Cost drops 50% from the model switch.

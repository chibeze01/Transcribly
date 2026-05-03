# Transcribly

Transcribe YouTube videos and local audio/video files from your terminal using the OpenAI Whisper API.

```bash
npx transcribly https://www.youtube.com/watch?v=VIDEO_ID
```

Transcript prints to your terminal and saves to `./text/`.

## Prerequisites

- **Node.js 18+**
- **FFmpeg** — must be available in your `PATH`
- **Python 3.8+** — required by `yt-dlp` for YouTube downloads
- **OpenAI API key** — get one at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

Run `transcribly --doctor` to verify everything is set up correctly.

### Install FFmpeg

```bash
# macOS
brew install ffmpeg

# Linux (Debian/Ubuntu)
sudo apt install ffmpeg

# Windows (Chocolatey)
choco install ffmpeg

# Windows (winget)
winget install ffmpeg
```

## API Key Setup

```bash
# Environment variable
export OPENAI_API_KEY="sk-..."

# Or pass it directly
npx transcribly <url> --api-key sk-...

# Or add to a .env file in your working directory
OPENAI_API_KEY=sk-...
```

Run `transcribly --setup` for an interactive setup prompt.

## Usage

### Transcribe a YouTube video

```bash
npx transcribly https://www.youtube.com/watch?v=VIDEO_ID
```

### Transcribe a local file

```bash
npx transcribly file ./interview.mp3
```

### Use the transcript with an AI agent

Each agent CLI handles piped stdin a little differently. Use whichever pattern matches your tool — they all end with the agent processing the transcript.

**Codex** — pipe directly, stdin becomes the prompt:

```bash
npx transcribly https://www.youtube.com/watch?v=VIDEO_ID | codex exec --skip-git-repo-check
```

**GitHub Copilot CLI** — pipe directly without a `-p` flag:

```bash
npx transcribly https://www.youtube.com/watch?v=VIDEO_ID | copilot
```

**Claude** — Claude's CLI bails on slow stdin (3-second timeout), so write the transcript to a file first, then feed it in. Use the `--out-file` flag for a clean one-liner:

```bash
npx transcribly https://www.youtube.com/watch?v=VIDEO_ID --out-file /tmp/t.txt && \
  claude -p "Summarise this" < /tmp/t.txt
```

The file-based pattern also works as a universal fallback for any agent or downstream tool (grep, jq, your own scripts, etc.).

### Save as JSON

```bash
npx transcribly https://www.youtube.com/watch?v=VIDEO_ID --format json
```

### Pipe output to a file

```bash
npx transcribly https://www.youtube.com/watch?v=VIDEO_ID > transcript.txt
```

## Options

| Option | Description | Default |
|---|---|---|
| `-o, --output <dir>` | Output directory for transcript files | `./text` |
| `--out-file <path>` | Write transcript to a specific file (overrides `--output`) | — |
| `-f, --format <format>` | Output format: `txt` or `json` | `txt` |
| `-k, --api-key <key>` | OpenAI API key (overrides env var) | — |
| `--doctor` | Check all system dependencies | — |
| `--setup` | Set up OpenAI API key interactively | — |

## Output Format

**Text (default)** — plain transcript saved to `./text/<video-id>.txt`

**JSON** — structured output saved to `./text/<video-id>.json`:

```json
{
  "audioFile": "/path/to/audio.mp3",
  "transcript": "The full transcript text..."
}
```

## Supported File Formats

`mp3` `mp4` `wav` `webm` `m4a` `ogg` `flac` `mpeg` `mpga`

Files larger than 24 MB are automatically split into chunks before transcription.

## Global Install

```bash
npm install -g transcribly
transcribly https://www.youtube.com/watch?v=VIDEO_ID
```

## Programmatic Usage

```js
const { transcribe } = require("transcribly/dist/transcriber");

(async () => {
  const result = await transcribe("./audio.mp3", process.env.OPENAI_API_KEY);
  console.log(result.transcript);
})();
```

## Links

- Website: [transcribly.dev](https://transcribly.dev)
- npm: [npmjs.com/package/transcribly](https://www.npmjs.com/package/transcribly)

## License

[MIT](../LICENSE.md)

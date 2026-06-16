import * as fs from "fs";
import * as path from "path";
import OpenAI from "openai";
import ffmpeg from "fluent-ffmpeg";
import { createSpinner, createTempDir } from "./utils";

// Whisper API has a 25MB file size limit
const MAX_CHUNK_SIZE_MB = 24;
const CHUNK_DURATION_SECONDS = 180; // 3 minutes per chunk
const CONCURRENCY = 4;
const MAX_RETRIES = 3;
// atempo max is 2.0 per filter instance; chain filters if raising above 2.0
const SPEED_FACTOR = 2.0;

export interface TranscriptionResult {
  transcript: string;
  audioFile: string;
}

function getOpenAIClient(apiKey: string): OpenAI {
  return new OpenAI({ apiKey });
}

function getFileSizeMB(filePath: string): number {
  const stats = fs.statSync(filePath);
  return stats.size / (1024 * 1024);
}

function getAudioDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(new Error(`Failed to probe audio file: ${err.message}`));
        return;
      }
      resolve(metadata.format.duration || 0);
    });
  });
}

function splitAudioChunk(
  inputPath: string,
  outputPath: string,
  startSeconds: number,
  durationSeconds: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(startSeconds)
      .setDuration(durationSeconds)
      .output(outputPath)
      .audioCodec("libmp3lame")
      .on("end", () => resolve())
      .on("error", (err: Error) =>
        reject(new Error(`Failed to split audio: ${err.message}`))
      )
      .run();
  });
}

function speedUpAudio(
  inputPath: string,
  outputPath: string,
  speed: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .noVideo()
      .audioFilter(`atempo=${speed}`)
      .audioCodec("libmp3lame")
      .output(outputPath)
      .on("end", () => resolve())
      .on("error", (err: Error) =>
        reject(new Error(`Failed to speed up audio: ${err.message}`))
      )
      .run();
  });
}

async function splitAudio(filePath: string): Promise<string[]> {
  const sizeMB = getFileSizeMB(filePath);

  // If file is small enough, no splitting needed
  if (sizeMB <= MAX_CHUNK_SIZE_MB) {
    return [filePath];
  }

  const spinner = createSpinner("Splitting audio into chunks...");
  spinner.start();

  try {
    const duration = await getAudioDuration(filePath);
    const chunkDir = createTempDir();
    const chunks: string[] = [];
    let start = 0;
    let index = 0;

    while (start < duration) {
      const chunkDuration = Math.min(
        CHUNK_DURATION_SECONDS,
        duration - start
      );
      const chunkPath = path.join(chunkDir, `chunk_${index}.mp3`);
      await splitAudioChunk(filePath, chunkPath, start, chunkDuration);
      chunks.push(chunkPath);
      start += chunkDuration;
      index++;
    }

    spinner.succeed(`Split into ${chunks.length} chunks`);
    return chunks;
  } catch (error) {
    spinner.fail("Failed to split audio");
    throw error;
  }
}

async function transcribeFile(
  client: OpenAI,
  filePath: string
): Promise<string> {
  const fileStream = fs.createReadStream(filePath);
  const response = await client.audio.transcriptions.create({
    model: "gpt-4o-mini-transcribe",
    file: fileStream,
    response_format: "text",
  });
  return response as unknown as string;
}

async function transcribeFileWithRetry(
  client: OpenAI,
  filePath: string
): Promise<string> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await transcribeFile(client, filePath);
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      const isRetryable = status === 429 || (status !== undefined && status >= 500);
      if (!isRetryable || attempt === MAX_RETRIES) throw err;
      const jitter = 0.5 + Math.random() * 0.5;
      await new Promise((res) => setTimeout(res, 2 ** attempt * 1000 * jitter));
    }
  }
  // TypeScript control flow — loop above always returns or throws
  throw new Error("unreachable");
}

async function transcribeChunks(
  client: OpenAI,
  chunks: string[],
  onProgress: (done: number, total: number) => void
): Promise<string[]> {
  const results: string[] = new Array(chunks.length);
  let nextIndex = 0;
  let completed = 0;

  async function worker() {
    while (nextIndex < chunks.length) {
      const i = nextIndex++;
      results[i] = (await transcribeFileWithRetry(client, chunks[i])).trim();
      onProgress(++completed, chunks.length);
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, chunks.length) }, worker));
  return results;
}

export async function transcribe(
  filePath: string,
  apiKey: string
): Promise<TranscriptionResult> {
  const client = getOpenAIClient(apiKey);

  const speedSpinner = createSpinner(`Speeding up audio ${SPEED_FACTOR}x...`);
  speedSpinner.start();
  const speedTempDir = createTempDir();
  const speededFilePath = path.join(speedTempDir, "speeded.mp3");
  try {
    await speedUpAudio(filePath, speededFilePath, SPEED_FACTOR);
    speedSpinner.succeed(`Audio sped up ${SPEED_FACTOR}x`);
  } catch (error) {
    speedSpinner.fail("Failed to speed up audio");
    fs.rmSync(speedTempDir, { recursive: true, force: true });
    throw error;
  }

  const chunks = await splitAudio(speededFilePath);

  const spinner = createSpinner(
    `Transcribing${chunks.length > 1 ? ` 0/${chunks.length} chunks` : ""}...`
  );
  spinner.start();

  try {
    const transcripts = await transcribeChunks(client, chunks, (done, total) => {
      if (total > 1) {
        spinner.text = `Transcribing ${done}/${total} chunks...`;
      }
    });

    spinner.succeed("Transcription complete");

    if (chunks.length > 1) {
      fs.rmSync(path.dirname(chunks[0]), { recursive: true, force: true });
    }
    fs.rmSync(speedTempDir, { recursive: true, force: true });

    return {
      transcript: transcripts.join(" "),
      audioFile: filePath,
    };
  } catch (error) {
    spinner.fail("Transcription failed");
    fs.rmSync(speedTempDir, { recursive: true, force: true });
    throw error;
  }
}

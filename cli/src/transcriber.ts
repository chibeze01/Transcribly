import * as fs from "fs";
import * as path from "path";
import OpenAI from "openai";
import ffmpeg from "fluent-ffmpeg";
import { createSpinner, createTempDir } from "./utils";

// Whisper API has a 25MB file size limit
const MAX_CHUNK_SIZE_MB = 24;
const CHUNK_DURATION_SECONDS = 180; // 3 minutes per chunk

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
    model: "whisper-1",
    file: fileStream,
    response_format: "text",
  });
  return response as unknown as string;
}

export async function transcribe(
  filePath: string,
  apiKey: string
): Promise<TranscriptionResult> {
  const client = getOpenAIClient(apiKey);
  const chunks = await splitAudio(filePath);

  const spinner = createSpinner(
    `Transcribing${chunks.length > 1 ? ` ${chunks.length} chunks` : ""}...`
  );
  spinner.start();

  try {
    const transcripts: string[] = [];

    for (let i = 0; i < chunks.length; i++) {
      if (chunks.length > 1) {
        spinner.text = `Transcribing chunk ${i + 1}/${chunks.length}...`;
      }
      const text = await transcribeFile(client, chunks[i]);
      transcripts.push(text.trim());
    }

    spinner.succeed("Transcription complete");

    // Clean up chunk temp directory if we created chunks
    if (chunks.length > 1 && chunks[0] !== filePath) {
      const chunkDir = path.dirname(chunks[0]);
      fs.rmSync(chunkDir, { recursive: true, force: true });
    }

    return {
      transcript: transcripts.join(" "),
      audioFile: filePath,
    };
  } catch (error) {
    spinner.fail("Transcription failed");
    throw error;
  }
}

#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { Command } from "commander";
import chalk from "chalk";
import { config } from "dotenv";
import { transcribe, TranscriptionResult } from "./transcriber";
import { downloadYouTubeAudio, isYouTubeUrl } from "./youtube";
import {
  validateFilePath,
  createTempDir,
  cleanupTempDir,
  ensureOutputDir,
  getOutputFilePath,
  checkFfmpeg,
  createSpinner,
} from "./utils";

// Load .env from CLI directory or current working directory
config({ path: path.resolve(process.cwd(), ".env") });
config({ path: path.resolve(__dirname, "..", ".env") });

const program = new Command();

program
  .name("transcribly")
  .description(
    "Transcribe YouTube videos and local audio/video files using OpenAI Whisper API"
  )
  .version("1.0.0");

program
  .command("url <youtube-url>")
  .description("Transcribe a YouTube video")
  .option("-o, --output <dir>", "Output directory", "./text")
  .option("-f, --format <format>", "Output format (txt or json)", "txt")
  .option("-k, --api-key <key>", "OpenAI API key")
  .action(async (url: string, options) => {
    await handleTranscribeUrl(url, options);
  });

program
  .command("file <path>")
  .description("Transcribe a local audio/video file")
  .option("-o, --output <dir>", "Output directory", "./text")
  .option("-f, --format <format>", "Output format (txt or json)", "txt")
  .option("-k, --api-key <key>", "OpenAI API key")
  .action(async (filePath: string, options) => {
    await handleTranscribeFile(filePath, options);
  });

// Default command: auto-detect URL vs file path
program
  .argument("[input]", "YouTube URL or local file path")
  .option("-o, --output <dir>", "Output directory", "./text")
  .option("-f, --format <format>", "Output format (txt or json)", "txt")
  .option("-k, --api-key <key>", "OpenAI API key")
  .action(async (input: string | undefined, options) => {
    if (!input) {
      program.help();
      return;
    }
    if (isYouTubeUrl(input)) {
      await handleTranscribeUrl(input, options);
    } else {
      await handleTranscribeFile(input, options);
    }
  });

interface CommandOptions {
  output: string;
  format: string;
  apiKey?: string;
}

function getApiKey(options: CommandOptions): string {
  const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error(
      chalk.red(
        "Error: OpenAI API key is required. Set OPENAI_API_KEY in your environment or use --api-key flag."
      )
    );
    process.exit(1);
  }
  return apiKey;
}

async function handleTranscribeUrl(
  url: string,
  options: CommandOptions
): Promise<void> {
  const apiKey = getApiKey(options);

  if (!isYouTubeUrl(url)) {
    console.error(chalk.red("Error: Invalid YouTube URL."));
    process.exit(1);
  }

  const hasFfmpeg = await checkFfmpeg();
  if (!hasFfmpeg) {
    console.error(
      chalk.red(
        "Error: ffmpeg is required but not found. Please install ffmpeg and ensure it is in your PATH."
      )
    );
    process.exit(1);
  }

  const tempDir = createTempDir();

  try {
    const downloadResult = await downloadYouTubeAudio(url, tempDir);
    const result = await transcribe(downloadResult.filePath, apiKey);

    console.log("\n" + chalk.green("--- Transcript ---"));
    console.log(result.transcript);
    console.log(chalk.green("--- End ---\n"));

    saveOutput(result, downloadResult.videoId, options);
  } finally {
    cleanupTempDir(tempDir);
  }
}

async function handleTranscribeFile(
  filePath: string,
  options: CommandOptions
): Promise<void> {
  const apiKey = getApiKey(options);
  const resolvedPath = validateFilePath(filePath);

  const hasFfmpeg = await checkFfmpeg();
  if (!hasFfmpeg) {
    console.error(
      chalk.red(
        "Error: ffmpeg is required but not found. Please install ffmpeg and ensure it is in your PATH."
      )
    );
    process.exit(1);
  }

  const result = await transcribe(resolvedPath, apiKey);
  const baseName = path.basename(resolvedPath, path.extname(resolvedPath));

  console.log("\n" + chalk.green("--- Transcript ---"));
  console.log(result.transcript);
  console.log(chalk.green("--- End ---\n"));

  saveOutput(result, baseName, options);
}

function saveOutput(
  result: TranscriptionResult,
  baseName: string,
  options: CommandOptions
): void {
  const format = options.format as "txt" | "json";
  ensureOutputDir(options.output);
  const outputPath = getOutputFilePath(options.output, baseName, format);

  if (format === "json") {
    const jsonOutput = {
      audioFile: result.audioFile,
      transcript: result.transcript,
    };
    fs.writeFileSync(outputPath, JSON.stringify(jsonOutput, null, 2));
  } else {
    fs.writeFileSync(outputPath, result.transcript);
  }

  console.log(chalk.blue(`Transcript saved to: ${outputPath}`));
}

program.parseAsync(process.argv).catch((error) => {
  console.error(chalk.red(`Error: ${error.message}`));
  process.exit(1);
});

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
  createSpinner,
} from "./utils";
import { checkFfmpeg, checkPython, getFfmpegInstallMessage, getPythonInstallMessage, runDoctor } from "./dependencies";
import { readConfig, writeConfig } from "./config";
import * as readline from "readline";
import OpenAI from "openai";

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
  .option("--setup", "Set up OpenAI API key interactively")
  .option("--doctor", "Check all system dependencies and report status")
  .action(async (input: string | undefined, options) => {
    if (options.doctor) {
      await runDoctor();
      return;
    }
    if (options.setup) {
      await runSetup();
      return;
    }
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
  // 1. --api-key flag
  if (options.apiKey) return options.apiKey;

  // 2. Real OPENAI_API_KEY env var (before loading .env)
  const envKey = process.env.OPENAI_API_KEY;
  if (envKey) return envKey;

  // 3. ~/.transcribly/config.json
  const configKey = readConfig().apiKey;
  if (configKey) return configKey;

  // 4. .env file in current working directory
  config({ path: path.resolve(process.cwd(), ".env"), override: false });
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;

  // 5. .env in CLI directory
  config({ path: path.resolve(__dirname, "..", ".env"), override: false });
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;

  // No key found — show helpful error
  console.error(
    chalk.red("Error: OpenAI API key required for transcription.\n")
  );
  console.error("Set it up in one of these ways:");
  console.error("  1. Run: transcribly --setup");
  console.error('  2. Set env var: export OPENAI_API_KEY="sk-..."');
  console.error("  3. Add to .env file: OPENAI_API_KEY=sk-...");
  console.error(
    "\nGet your API key at: https://platform.openai.com/api-keys"
  );
  process.exit(1);
}

async function promptApiKey(): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write("Enter your OpenAI API key: ");

    if (process.stdin.isTTY) {
      // Mask input in interactive terminals
      const stdin = process.stdin;
      stdin.setRawMode!(true);
      stdin.resume();
      stdin.setEncoding("utf8");

      let input = "";
      const onData = (char: string) => {
        const code = char.charCodeAt(0);
        if (char === "\r" || char === "\n") {
          stdin.setRawMode!(false);
          stdin.pause();
          stdin.removeListener("data", onData);
          process.stdout.write("\n");
          resolve(input.trim());
        } else if (code === 3) {
          // Ctrl+C
          stdin.setRawMode!(false);
          process.stdout.write("\n");
          process.exit(1);
        } else if (code === 127 || code === 8) {
          // Backspace
          if (input.length > 0) {
            input = input.slice(0, -1);
            process.stdout.write("\b \b");
          }
        } else {
          input += char;
          process.stdout.write("*");
        }
      };

      stdin.on("data", onData);
    } else {
      // Non-TTY fallback (piped input)
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question("", (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    }
  });
}

async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const client = new OpenAI({ apiKey });
    await client.models.list();
    return true;
  } catch {
    return false;
  }
}

async function runSetup(): Promise<void> {
  console.log(chalk.bold("\nTranscribly — API Key Setup\n"));

  const apiKey = await promptApiKey();

  if (!apiKey) {
    console.error(chalk.red("No API key entered. Setup cancelled."));
    process.exit(1);
  }

  const spinner = createSpinner("Validating API key...");
  spinner.start();

  const valid = await validateApiKey(apiKey);
  if (!valid) {
    spinner.fail(
      "API key validation failed. Please check the key and try again."
    );
    process.exit(1);
  }

  spinner.succeed("API key validated.");

  writeConfig({ apiKey });

  console.log(
    chalk.green(
      "\nAPI key saved to ~/.transcribly/config.json\n" +
        "You can now run transcribly without setting OPENAI_API_KEY manually."
    )
  );
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
    console.error(chalk.red("Error: FFmpeg is required but not found."));
    console.error(chalk.yellow(getFfmpegInstallMessage()));
    console.error(chalk.gray("\nRun 'transcribly --doctor' to check all dependencies."));
    process.exit(1);
  }

  const pythonResult = await checkPython();
  if (!pythonResult.ok) {
    if (pythonResult.version) {
      console.error(chalk.red(`Error: Python ${pythonResult.version} found, but 3.8+ is required.`));
    } else {
      console.error(chalk.red("Error: Python 3.8+ is required but not found."));
    }
    console.error(chalk.yellow(getPythonInstallMessage()));
    console.error(chalk.gray("\nRun 'transcribly --doctor' to check all dependencies."));
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
    console.error(chalk.red("Error: FFmpeg is required but not found."));
    console.error(chalk.yellow(getFfmpegInstallMessage()));
    console.error(chalk.gray("\nRun 'transcribly --doctor' to check all dependencies."));
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

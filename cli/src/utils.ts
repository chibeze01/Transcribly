import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import ora, { Ora } from "ora";

const SUPPORTED_EXTENSIONS = new Set([
  ".mp3",
  ".mp4",
  ".wav",
  ".webm",
  ".m4a",
  ".ogg",
  ".flac",
  ".mpeg",
  ".mpga",
]);

export function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "transcribly-"));
}

export function cleanupTempDir(tempDir: string): void {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

export function isSupportedAudioFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return SUPPORTED_EXTENSIONS.has(ext);
}

export function validateFilePath(filePath: string): string {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`File not found: ${resolved}`);
  }
  if (!isSupportedAudioFile(resolved)) {
    const ext = path.extname(resolved);
    throw new Error(
      `Unsupported file type "${ext}". Supported: ${[...SUPPORTED_EXTENSIONS].join(", ")}`
    );
  }
  return resolved;
}

export function createSpinner(text: string): Ora {
  return ora({ text, spinner: "dots" });
}

export function ensureOutputDir(outputDir: string): void {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
}

export function getOutputFilePath(
  outputDir: string,
  baseName: string,
  format: "txt" | "json"
): string {
  return path.join(outputDir, `${baseName}.${format}`);
}


import { exec } from "child_process";
import * as path from "path";
import chalk from "chalk";
import { config } from "dotenv";

const MIN_PYTHON_MAJOR = 3;
const MIN_PYTHON_MINOR = 8;

export function checkFfmpeg(): Promise<boolean> {
  return new Promise((resolve) => {
    exec("ffmpeg -version", (error) => {
      resolve(!error);
    });
  });
}

export interface PythonCheckResult {
  ok: boolean;
  version?: string;
}

export function parsePythonVersion(output: string): { major: number; minor: number } | null {
  const match = output.match(/Python\s+(\d+)\.(\d+)/);
  if (!match) return null;
  return { major: parseInt(match[1], 10), minor: parseInt(match[2], 10) };
}

function meetsMinVersion(ver: { major: number; minor: number }): boolean {
  return ver.major > MIN_PYTHON_MAJOR ||
    (ver.major === MIN_PYTHON_MAJOR && ver.minor >= MIN_PYTHON_MINOR);
}

export function checkPython(): Promise<PythonCheckResult> {
  return new Promise((resolve) => {
    exec("python3 --version", (error, stdout, stderr) => {
      const output = (stdout || "") + (stderr || "");
      if (!error) {
        const ver = parsePythonVersion(output);
        if (ver && meetsMinVersion(ver)) {
          return resolve({ ok: true, version: output.trim().replace(/^Python\s*/, "") });
        }
        return resolve({ ok: false, version: output.trim().replace(/^Python\s*/, "") });
      }
      exec("python --version", (error2, stdout2, stderr2) => {
        const output2 = (stdout2 || "") + (stderr2 || "");
        if (!error2) {
          const ver = parsePythonVersion(output2);
          if (ver && meetsMinVersion(ver)) {
            return resolve({ ok: true, version: output2.trim().replace(/^Python\s*/, "") });
          }
          return resolve({ ok: false, version: output2.trim().replace(/^Python\s*/, "") });
        }
        resolve({ ok: false });
      });
    });
  });
}

export function getFfmpegInstallMessage(): string {
  const platform = process.platform;
  switch (platform) {
    case "darwin":
      return "Install FFmpeg: brew install ffmpeg";
    case "linux":
      return "Install FFmpeg: sudo apt install ffmpeg (Debian/Ubuntu) or sudo dnf install ffmpeg (Fedora)";
    case "win32":
      return "Install FFmpeg: choco install ffmpeg (Chocolatey) or winget install ffmpeg (winget)";
    default:
      return "Install FFmpeg: https://ffmpeg.org/download.html";
  }
}

export function getPythonInstallMessage(): string {
  const platform = process.platform;
  switch (platform) {
    case "darwin":
      return "Install Python: brew install python3";
    case "linux":
      return "Install Python: sudo apt install python3 (Debian/Ubuntu) or sudo dnf install python3 (Fedora)";
    case "win32":
      return "Install Python: https://www.python.org/downloads/ or winget install Python.Python.3";
    default:
      return "Install Python 3.8+: https://www.python.org/downloads/";
  }
}

export async function runDoctor(): Promise<void> {
  console.log(chalk.bold("\nTranscribly — Dependency Check\n"));

  let allPassed = true;

  // Check FFmpeg
  const hasFfmpeg = await checkFfmpeg();
  if (hasFfmpeg) {
    console.log(chalk.green("  ✓ FFmpeg found"));
  } else {
    console.log(chalk.red("  ✗ FFmpeg not found"));
    console.log(chalk.yellow(`    ${getFfmpegInstallMessage()}`));
    allPassed = false;
  }

  // Check Python with version validation
  const pythonResult = await checkPython();
  if (pythonResult.ok) {
    console.log(chalk.green(`  ✓ Python ${pythonResult.version ?? ""} (${MIN_PYTHON_MAJOR}.${MIN_PYTHON_MINOR}+ required)`));
  } else if (pythonResult.version) {
    console.log(chalk.red(`  ✗ Python ${pythonResult.version} found, but ${MIN_PYTHON_MAJOR}.${MIN_PYTHON_MINOR}+ is required`));
    console.log(chalk.yellow(`    ${getPythonInstallMessage()}`));
    allPassed = false;
  } else {
    console.log(chalk.red("  ✗ Python not found"));
    console.log(chalk.yellow(`    ${getPythonInstallMessage()}`));
    allPassed = false;
  }

  // Load .env files to match runtime key resolution order
  config({ path: path.resolve(process.cwd(), ".env"), override: false });
  config({ path: path.resolve(__dirname, "..", ".env"), override: false });

  // Check OpenAI API key availability
  const hasApiKey = !!(
    process.env.OPENAI_API_KEY ||
    tryReadConfigApiKey()
  );
  if (hasApiKey) {
    console.log(chalk.green("  ✓ OpenAI API key configured"));
  } else {
    console.log(chalk.red("  ✗ OpenAI API key not configured"));
    console.log(chalk.yellow("    Run: transcribly --setup"));
    allPassed = false;
  }

  console.log();
  if (allPassed) {
    console.log(chalk.green("All dependencies satisfied. You're good to go!"));
  } else {
    console.log(chalk.red("Some dependencies are missing. See above for install instructions."));
  }
}

function tryReadConfigApiKey(): string | undefined {
  try {
    const { readConfig } = require("./config");
    return readConfig().apiKey;
  } catch {
    return undefined;
  }
}

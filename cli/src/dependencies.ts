import { exec } from "child_process";
import chalk from "chalk";

export function checkFfmpeg(): Promise<boolean> {
  return new Promise((resolve) => {
    exec("ffmpeg -version", (error) => {
      resolve(!error);
    });
  });
}

export function checkPython(): Promise<boolean> {
  return new Promise((resolve) => {
    exec("python3 --version", (error) => {
      if (!error) return resolve(true);
      exec("python --version", (error2) => {
        resolve(!error2);
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

  const checks: { name: string; check: () => Promise<boolean>; installMsg: string }[] = [
    { name: "FFmpeg", check: checkFfmpeg, installMsg: getFfmpegInstallMessage() },
    { name: "Python 3", check: checkPython, installMsg: getPythonInstallMessage() },
  ];

  let allPassed = true;

  for (const { name, check, installMsg } of checks) {
    const ok = await check();
    if (ok) {
      console.log(chalk.green(`  ✓ ${name} found`));
    } else {
      console.log(chalk.red(`  ✗ ${name} not found`));
      console.log(chalk.yellow(`    ${installMsg}`));
      allPassed = false;
    }
  }

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

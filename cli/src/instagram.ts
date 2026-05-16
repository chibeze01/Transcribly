import * as path from "path";
import { createSpinner } from "./utils";

export interface InstagramDownloadResult {
  filePath: string;
  videoId: string;
  title: string;
}

export async function downloadInstagramAudio(
  url: string,
  outputDir: string
): Promise<InstagramDownloadResult> {
  const spinner = createSpinner("Downloading audio from Instagram...");
  spinner.start();

  try {
    const ytDlpModule = await import("yt-dlp-exec");
    const ytDlp = ytDlpModule.default || ytDlpModule;

    const info = await ytDlp(url, {
      dumpSingleJson: true,
      skipDownload: true,
      noWarnings: true,
    });

    const videoId: string = info.id || "unknown";
    const title: string = info.title || "untitled";
    const outputPath = path.join(outputDir, `${videoId}.webm`);

    await ytDlp(url, {
      format: "bestaudio/best",
      output: outputPath,
      noWarnings: true,
    });

    spinner.succeed("Audio downloaded successfully");

    return {
      filePath: outputPath,
      videoId,
      title,
    };
  } catch (error) {
    spinner.fail("Failed to download audio from Instagram");
    throw error;
  }
}

export function isInstagramUrl(url: string): boolean {
  return /^(https?:\/\/)?(www\.)?instagram\.com\/(p|reel|tv)\/.+/.test(url);
}

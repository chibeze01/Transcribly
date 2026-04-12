import * as path from "path";
import { createSpinner } from "./utils";

export interface YouTubeDownloadResult {
  filePath: string;
  videoId: string;
  title: string;
}

export async function downloadYouTubeAudio(
  url: string,
  outputDir: string
): Promise<YouTubeDownloadResult> {
  const spinner = createSpinner("Downloading audio from YouTube...");
  spinner.start();

  try {
    const ytDlpModule = await import("yt-dlp-exec");
    const ytDlp = ytDlpModule.default || ytDlpModule;

    // Get video info without downloading
    const info = await ytDlp(url, {
      dumpSingleJson: true,
      skipDownload: true,
      noWarnings: true,
    });

    const videoId: string = info.id || "unknown";
    const title: string = info.title || "untitled";
    const outputPath = path.join(outputDir, `${videoId}.webm`);

    // Download audio
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
    spinner.fail("Failed to download audio from YouTube");
    throw error;
  }
}

export function isYouTubeUrl(url: string): boolean {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(url);
}

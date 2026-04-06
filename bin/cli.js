#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { Command } = require('commander');

// Load .env from current working directory
require('dotenv').config();

// ── Helpers (exported for testing) ──

function isYouTubeUrl(url) {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(url);
}

function resolveApiKey(opts) {
  const key = opts.apiKey || process.env.OPENAI_API_KEY;
  if (!key) {
    process.stderr.write(
      'Error: OPENAI_API_KEY is not set.\n\n' +
      'Set it in your environment:\n' +
      '  export OPENAI_API_KEY=sk-...\n\n' +
      'Or pass it with --api-key:\n' +
      '  transcribly <url> --api-key sk-...\n'
    );
    process.exit(1);
  }
  return key;
}

// ── Audio download ──

async function downloadAudio(url, tmpDir, verbose) {
  if (verbose) process.stderr.write('Downloading audio from YouTube...\n');

  const ytDlpModule = await import('yt-dlp-exec');
  const ytDlp = ytDlpModule.default || ytDlpModule;

  const info = await ytDlp(url, {
    dumpSingleJson: true,
    skipDownload: true,
    noWarnings: true,
  });

  const videoId = info.id || 'unknown';
  const title = info.title || 'untitled';
  const duration = info.duration || 0;
  const outputPath = path.join(tmpDir, `${videoId}.webm`);

  await ytDlp(url, {
    format: 'bestaudio/best',
    output: outputPath,
    noWarnings: true,
  });

  if (verbose) process.stderr.write('Audio downloaded.\n');

  return { filePath: outputPath, videoId, title, duration };
}

// ── Transcription ──

const MAX_CHUNK_SIZE_MB = 24;
const CHUNK_DURATION_SECONDS = 180;

function getFileSizeMB(filePath) {
  return fs.statSync(filePath).size / (1024 * 1024);
}

function getAudioDuration(filePath) {
  const ffmpeg = require('fluent-ffmpeg');
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(new Error(`Failed to probe audio: ${err.message}`));
      resolve(metadata.format.duration || 0);
    });
  });
}

function splitAudioChunk(inputPath, outputPath, start, duration) {
  const ffmpeg = require('fluent-ffmpeg');
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(start)
      .setDuration(duration)
      .output(outputPath)
      .audioCodec('libmp3lame')
      .on('end', resolve)
      .on('error', (err) => reject(new Error(`Failed to split audio: ${err.message}`)))
      .run();
  });
}

async function splitAudio(filePath, verbose) {
  if (getFileSizeMB(filePath) <= MAX_CHUNK_SIZE_MB) return [filePath];

  if (verbose) process.stderr.write('Splitting audio into chunks...\n');

  const dur = await getAudioDuration(filePath);
  const chunkDir = fs.mkdtempSync(path.join(os.tmpdir(), 'transcribly-chunk-'));
  const chunks = [];
  let start = 0;
  let i = 0;

  while (start < dur) {
    const chunkDur = Math.min(CHUNK_DURATION_SECONDS, dur - start);
    const chunkPath = path.join(chunkDir, `chunk_${i}.mp3`);
    await splitAudioChunk(filePath, chunkPath, start, chunkDur);
    chunks.push(chunkPath);
    start += chunkDur;
    i++;
  }

  if (verbose) process.stderr.write(`Split into ${chunks.length} chunks.\n`);
  return chunks;
}

async function transcribeAudio(filePath, apiKey, verbose) {
  const OpenAI = (await import('openai')).default;
  const client = new OpenAI({ apiKey });
  const chunks = await splitAudio(filePath, verbose);

  const transcripts = [];
  for (let i = 0; i < chunks.length; i++) {
    if (verbose) {
      process.stderr.write(
        chunks.length > 1
          ? `Transcribing chunk ${i + 1}/${chunks.length}...\n`
          : 'Transcribing...\n'
      );
    }
    const fileStream = fs.createReadStream(chunks[i]);
    const response = await client.audio.transcriptions.create({
      model: 'whisper-1',
      file: fileStream,
      response_format: 'text',
    });
    transcripts.push(String(response).trim());
  }

  // Clean up chunk temp dir
  if (chunks.length > 1 && chunks[0] !== filePath) {
    fs.rmSync(path.dirname(chunks[0]), { recursive: true, force: true });
  }

  return transcripts.join(' ');
}

// ── CLI program ──

const pkg = require('../package.json');
const program = new Command();

program
  .name('transcribly')
  .description('Transcribe YouTube videos using OpenAI Whisper API')
  .version(pkg.version)
  .argument('<youtube-url>', 'YouTube video URL to transcribe')
  .option('--json', 'Output as JSON instead of plain text')
  .option('--verbose', 'Show progress to stderr')
  .option('--api-key <key>', 'OpenAI API key (or set OPENAI_API_KEY)')
  .action(async (url, opts) => {
    // Validate URL
    if (!isYouTubeUrl(url)) {
      process.stderr.write(`Error: Invalid YouTube URL: ${url}\n`);
      process.exit(1);
    }

    // Resolve API key
    const apiKey = resolveApiKey(opts);

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'transcribly-'));

    try {
      const download = await downloadAudio(url, tmpDir, opts.verbose);
      const transcript = await transcribeAudio(download.filePath, apiKey, opts.verbose);

      const wordCount = transcript.split(/\s+/).filter(Boolean).length;

      // Metadata to stderr (won't pollute piped output)
      process.stderr.write(`Title: ${download.title}\n`);
      process.stderr.write(`Duration: ${download.duration}s\n`);
      process.stderr.write(`Words: ${wordCount}\n`);

      if (opts.json) {
        const output = JSON.stringify({
          videoId: download.videoId,
          title: download.title,
          duration: download.duration,
          wordCount,
          transcript,
        }, null, 2);
        process.stdout.write(output + '\n');
      } else {
        process.stdout.write(transcript + '\n');
      }
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

// Export for testing
module.exports = { isYouTubeUrl };

// Only run CLI when executed directly (not when required by tests)
if (require.main === module) {
  if (process.argv.length <= 2) {
    program.outputHelp({ error: true });
    process.exit(1);
  }

  program.parseAsync(process.argv).catch((err) => {
    process.stderr.write(`Error: ${err.message}\n`);
    process.exit(1);
  });
}

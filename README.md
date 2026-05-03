# Transcribly — YouTube transcripts from the terminal

A CLI tool that transcribes YouTube videos and local audio/video files using the OpenAI Whisper API.

## Quick start

```bash
npx transcribly https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

That's it. The transcript prints to your terminal and saves to `./text/`.

## Prerequisites

Transcribly requires the following system dependencies. Run `transcribly --doctor` to verify everything is set up correctly.

### Node.js 18+

Download from [nodejs.org](https://nodejs.org/) or install via a package manager:

```bash
# macOS (Homebrew)
brew install node

# Linux (Debian/Ubuntu)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Windows (winget)
winget install OpenJS.NodeJS.LTS
```

### FFmpeg

Required for audio processing. Must be available in your `PATH`.

```bash
# macOS (Homebrew)
brew install ffmpeg

# Linux (Debian/Ubuntu)
sudo apt install ffmpeg

# Linux (Fedora)
sudo dnf install ffmpeg

# Windows (Chocolatey)
choco install ffmpeg

# Windows (winget)
winget install ffmpeg
```

### Python 3.8+

Required by `yt-dlp` for YouTube audio downloads.

```bash
# macOS (Homebrew)
brew install python3

# Linux (Debian/Ubuntu)
sudo apt install python3

# Linux (Fedora)
sudo dnf install python3

# Windows
# Download from https://www.python.org/downloads/
# Or use winget:
winget install Python.Python.3
```

### OpenAI API key

Required for transcription via the Whisper API. Get your key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys).

## API key setup

Set your API key as an environment variable:

```bash
export OPENAI_API_KEY="sk-..."
```

Or pass it directly:

```bash
npx transcribly <youtube-url> --api-key sk-...
```

You can also create a `.env` file in your working directory:

```
OPENAI_API_KEY=sk-...
```

## Usage

### Transcribe a YouTube video

```bash
npx transcribly https://www.youtube.com/watch?v=VIDEO_ID
```

### Transcribe a local audio or video file

```bash
npx transcribly file ./interview.mp3
```

### Pipe output to a file

```bash
npx transcribly https://www.youtube.com/watch?v=VIDEO_ID > transcript.txt
```

### Use the transcript with an AI agent

Each agent CLI handles piped stdin a little differently. Use whichever pattern matches your tool — they all end with the agent processing the transcript.

**Codex** — pipe directly, stdin becomes the prompt:

```bash
npx transcribly https://www.youtube.com/watch?v=VIDEO_ID | codex exec --skip-git-repo-check
```

**GitHub Copilot CLI** — pipe directly without a `-p` flag:

```bash
npx transcribly https://www.youtube.com/watch?v=VIDEO_ID | copilot
```

**Claude** — Claude's CLI bails on slow stdin (3-second timeout), so write the transcript to a file first, then feed it in. Use the `--out-file` flag for a clean one-liner:

```bash
npx transcribly https://www.youtube.com/watch?v=VIDEO_ID --out-file /tmp/t.txt && \
  claude -p "Summarise this" < /tmp/t.txt
```

The file-based pattern also works as a universal fallback for any agent or downstream tool (grep, jq, your own scripts, etc.).

### Save as JSON

```bash
npx transcribly https://www.youtube.com/watch?v=VIDEO_ID --format json
```

### Explicit subcommands

```bash
# YouTube URL
transcribly url https://www.youtube.com/watch?v=VIDEO_ID

# Local file
transcribly file ./path/to/audio.mp3
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `-o, --output <dir>` | Output directory for transcript files | `./text` |
| `-f, --format <format>` | Output format: `txt` or `json` | `txt` |
| `-k, --api-key <key>` | OpenAI API key (overrides `OPENAI_API_KEY` env var) | -- |
| `--doctor` | Check all system dependencies and report status | -- |
| `--setup` | Set up OpenAI API key interactively | -- |

## Output format

**Text (default)** — plain transcript text, saved to `./text/<video-id>.txt`.

**JSON** — structured output, saved to `./text/<video-id>.json`:

```json
{
  "audioFile": "/path/to/downloaded/audio.mp3",
  "transcript": "The full transcript text..."
}
```

## Supported audio formats

mp3, mp4, wav, webm, m4a, ogg, flac, mpeg, mpga

Large files (>24 MB) are automatically split into chunks before transcription.

## Global install

```bash
npm install -g transcribly
transcribly https://www.youtube.com/watch?v=VIDEO_ID
```

## Programmatic usage

```js
const { transcribe } = require("transcribly/dist/transcriber");

(async () => {
  const result = await transcribe("./audio.mp3", process.env.OPENAI_API_KEY);
  console.log(result.transcript);
})();
```

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b my-feature`)
3. Commit your changes (`git commit -m "Add my feature"`)
4. Push to the branch (`git push origin my-feature`)
5. Open a pull request

## License

[MIT](LICENSE.md)

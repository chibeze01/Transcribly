# 📺 YouTube Video Transcriber

This Python application uses the OpenAI Whisper API to transcribe the audio from a YouTube video. 🎙️

## Requirements

- Python 3.8 or higher
- OpenAI API credentials stored in the OpenAI Secret Manager

## Installation

1. Clone this repository and navigate to the project directory: `git clone https://github.com/your-username/your-repository.git && cd your-repository`

2. Install the required dependencies: `pip install -r requirements.txt`

## Setup API KEY 🔑

To set up the API key, use the `.env.template` file and set your API key: `OPENAI_API_KEY = YOUR_API_KEY`

Then rename the `.env.template` to `.env`

## Usage

To transcribe a YouTube video, run the `main.py` script and provide the URL of the video as a command-line argument: `python main.py https://www.youtube.com/watch?v=VIDEO_ID`

Make sure to replace `VIDEO_ID` with the actual ID of the YouTube video you want to transcribe.

The transcript will be printed to the console in the form. 📜

```json
{
  "video_is": "video ID",
  "audio_file": "Audio file loaction",
  "transcript": "transcript text",
  "url": "url"
}
```

## Docker 🐳

You can also run this application using Docker. To build a Docker image, run the following command in the project directory: `docker build -t my_image .`

Make sure to replace `my_image` with a suitable name for your Docker image.

To run a Docker container and transcribe a YouTube video, use the following command: `docker run my_image https://www.youtube.com/watch?v=VIDEO_ID`

Make sure to replace `my_image` with the name of your Docker image and `VIDEO_ID` with the actual ID of the YouTube video you want to transcribe.

The transcript will be printed to the console. 🖨️

## CLI (Node.js / Bun)

Transcribly is also available as a CLI tool that you can run with `npx` or `bun x`.

### Prerequisites

- Node.js 18+ (or Bun)
- ffmpeg installed and available in your PATH
- An OpenAI API key

### Installation

```bash
# Run directly with npx (no install needed)
npx transcribly <youtube-url>

# Or install globally
npm install -g transcribly
```

### CLI Usage

```bash
# Transcribe a YouTube video
transcribly <youtube-url>

# Transcribe a YouTube video (explicit command)
transcribly url <youtube-url>

# Transcribe a local audio/video file
transcribly file ./path/to/audio.mp3

# Specify output directory and format
transcribly <youtube-url> --output ./transcripts --format json

# Use a specific API key
transcribly <youtube-url> --api-key sk-...
```

### CLI Options

| Option | Description | Default |
|--------|-------------|---------|
| `-o, --output <dir>` | Output directory for transcript files | `./text` |
| `-f, --format <format>` | Output format (`txt` or `json`) | `txt` |
| `-k, --api-key <key>` | OpenAI API key (or set `OPENAI_API_KEY` env var) | — |

### Supported Audio Formats

mp3, mp4, wav, webm, m4a, ogg, flac, mpeg, mpga


# Transcribly — YouTube transcripts from the terminal

A CLI tool that transcribes YouTube videos and local audio/video files using the OpenAI Whisper API.

## Quick start

```bash
npx transcribly https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

That's it. The transcript prints to your terminal and saves to `./text/`.

## Requirements

- [Node.js](https://nodejs.org/) 18+
- [ffmpeg](https://ffmpeg.org/) installed and available in your `PATH`
- An [OpenAI API key](https://platform.openai.com/api-keys)

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

### Pipe to another tool

```bash
npx transcribly https://www.youtube.com/watch?v=VIDEO_ID | claude "Summarise this"
```

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

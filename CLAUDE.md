# Transcribly

CLI tool that transcribes YouTube videos and local audio/video files using the OpenAI Whisper API.

## Repo layout

- `cli/` — published npm package (`transcribly`). TypeScript source in `cli/src/`.
- `client/` — React landing page deployed to transcribly.dev.
- `server/`, `transcriber/`, `main.py` — legacy Python implementation.

## Git commit conventions

- Do NOT add `Co-Authored-By: Claude ...` trailers to commit messages.
- Do NOT add "🤖 Generated with Claude Code" or similar attribution footers to commits or PR bodies.
- Write commit messages as if a human authored them.

## Workflow

- Work on feature branches; never commit directly to `master`.
- Open a PR for review before merging.
- Don't merge to `master` unless explicitly told to.

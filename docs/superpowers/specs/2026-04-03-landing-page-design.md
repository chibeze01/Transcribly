# Transcribly Landing Page — Design Spec

**Date:** 2026-04-03  
**Status:** Approved  
**Product:** Transcribly (CLI rebrand)

---

## Overview

Rebrand Transcribly from a YouTube transcription web app into a CLI/API developer tool. The landing page is a single-page scroll that positions the product as the fastest way to turn YouTube audio into text — and as a first-class tool for AI agents and Claude Code workflows.

---

## Target Audience

- Developers and indie hackers who want a no-friction CLI transcription tool
- Claude Code users who want YouTube content as agent context
- AI pipeline builders who need pipe-ready text from video audio
- Anyone who wants `npx transcribly <url>` and nothing else

---

## Visual Style

**Theme:** Terminal Purist — dark mode  
**Background:** Near-black (`#0a0a0a`)  
**Card/surface:** `#0f0f0f`  
**Borders:** `#1a1a1a` / `#222`  
**Primary accent:** Terminal green (`#28c840`)  
**Muted text:** `#444` / `#555`  
**Typography:** Monospace throughout (system monospace stack)  
**Inspiration:** Vercel, hacker/dev-tool aesthetic — minimal color, tight spacing, everything purposeful

---

## Page Architecture

Single-page scroll. No routing. Five sections + footer.

```
┌─────────────────────────┐
│  Nav                    │
├─────────────────────────┤
│  1. Hero                │
├─────────────────────────┤
│  2. Terminal Demo       │
├─────────────────────────┤
│  3. Features            │
├─────────────────────────┤
│  4. AI Integration      │
├─────────────────────────┤
│  5. CTA                 │
├─────────────────────────┤
│  Footer                 │
└─────────────────────────┘
```

---

## Section 1 — Nav + Hero

### Nav
- Left: `transcribly` wordmark in monospace bold
- Right: `docs` · `github` · `npm install` pill button (ghost)
- Border bottom: `#111`
- Sticky, transparent background

### Hero
- Badge: pulsing green dot + `v1.0 — now with AI agent support`
- Headline: `YouTube. As text. In your terminal.` — "In your terminal." in green
- Subheadline: `Transcribe any YouTube video from the CLI in seconds. Pipe the output anywhere — your AI agent, your codebase, your notes.`
- Command block: `$ npx transcribly <youtube-url>` with copy button — dark inset box
- Primary CTA: `Get started →` (green fill, black text) — smooth scrolls to Section 2 (terminal demo)
- Secondary CTA: `View on GitHub` (ghost border) — links to GitHub repo
- Three micro-stats below: `~4s avg transcription` · `any length` · `pipe-ready`

---

## Section 2 — Terminal Demo

### Layout
- Section label: `QUICK TRY`
- Heading: `See it in action`
- Subheading: `No signup. No install. Just run it.`
- Centred macOS terminal window (max-width 680px), heavy drop shadow

### Terminal Chrome
- macOS traffic lights (red/yellow/green circles)
- Title bar: `bash — 80×24`
- Background: `#0d0d0d`

### Animation Sequence (auto-plays, replay button available)
1. Command types itself character by character: `npx transcribly https://youtube.com/watch?v=dQw4w9WgXcQ`
2. Typing cursor (`▊`) hides after command completes
3. **Single status line** updates in place through three states:
   - `⠋ Fetching audio from YouTube...` (braille spinner cycling at 80ms)
   - `⠙ Chunking audio into segments...` (spinner continues, text swaps)
   - `⠹ Transcribing [████████░░] 80%` (progress bar fills live on same line)
4. Status line replaced by: `✓ Done in 4.2s`
5. Result block fades in:
   - Divider line
   - `video Never Gonna Give You Up (Official Music Video)`
   - `duration 3:33 · words 312`
   - Transcript excerpt (2–3 lines of lyrics)
   - `[...312 words piped to stdout]`
6. Pipe hint appears: `❯ npx transcribly https://... | claude "summarize this"` + `↑ pipe it anywhere`
7. New prompt `❯ ▊` appears at the bottom (cursor returns here, not on command line)

### Key constraint
The spinner and status text must update on **one line** — not stack new lines. This mimics real terminal behaviour (like `ora` npm package).

---

## Section 3 — Features

Three equal-width cards in a grid row.

| Card | Icon | Title | Body | Footer snippet |
|------|------|-------|------|----------------|
| 1 | `⚡` | Zero setup | No account. No config file. Just `npx` and a URL. Works anywhere Node runs. | `$ npx transcribly <url>` |
| 2 | `∞` | Any length video | Audio is automatically chunked and transcribed in parallel. 3-minute clip or 3-hour lecture — same command. | `✓ chunked · parallel · unlimited` |
| 3 | `\|` | Pipe-ready output | Clean plain text to stdout. Pipe into Claude, GPT, a file, a script — whatever your workflow needs. | `$ transcribly <url> | claude` |

Each card: `#0f0f0f` background, `#1a1a1a` border, rounded, monospace text, small code snippet at bottom.

---

## Section 4 — AI Integration

### Heading
- Label: `AI INTEGRATION`
- Headline: `Give your AI ears on YouTube.`  ← **ears, not eyes** (audio product)
- Subheadline: `LLMs can't listen to videos. Transcribly bridges the gap — turn any YouTube audio into text your AI can read, reason over, and act on.`

### Two-column layout

**Left — Claude Code**
- Icon + label: `Claude Code · tool call · slash command`
- Body: Add transcribly as a shell tool in Claude Code. Claude can fetch and read any YouTube video mid-session.
- Code block: `~/.claude/settings.json` snippet showing `tools` array with transcribly as a bash tool
- Call-out: `claude> "Summarize this YT video for me" → calls transcribly → reads transcript → responds`

**Right — Any AI Agent**
- Icon + label: `Any AI Agent · pipe · stdin · API`
- Body: Stretch your agent's context with real video audio. Research pipelines, RAG ingestion, lecture summaries.
- Code block: Two bash examples — `| llm "tldr"` and `| chunk --embed --store`
- Call-out: `works with GPT · Claude · Gemini · Ollama → stdout is universal`

---

## Section 5 — CTA

- Subtle grid background (`40px` squares, low opacity)
- Radial green glow behind heading
- Headline: `Start transcribing in 30 seconds.`
- Subheadline: `No account. No API key. Just Node.`
- Command block (same style as hero): `$ npx transcribly <youtube-url>` + copy button
- Primary CTA: `View on GitHub →` (green fill) — links to GitHub repo
- Secondary CTA: `Read the docs` (ghost) — links to GitHub README for now; placeholder until a /docs page exists

---

## Footer

Minimal single row:
- Left: `transcribly` wordmark (very dim)
- Centre: `github · npm · docs` links
- Right: `MIT license`

---

## Implementation Notes

- **Framework:** React (existing codebase — `client/src/`)
- **Routing:** Single page — replace `App.js` to render the landing page. Existing `Product.jsx` page is a stub and can be used/replaced.
- **Animation:** Pure CSS + vanilla JS for the terminal demo — no animation library required. Braille spinner via `setInterval` at 80ms.
- **No new dependencies** needed beyond what's already installed.
- **Responsive:** Desktop-first. Mobile breakpoint: stack feature cards vertically, stack AI integration columns vertically.
- **`.gitignore`:** Add `.superpowers/` if not already present.

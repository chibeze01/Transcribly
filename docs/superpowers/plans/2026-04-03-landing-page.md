# Transcribly Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page dark-mode landing page that rebrands Transcribly as a CLI/API tool for developers and AI agents.

**Architecture:** Replace the existing `App.js` chat interface with a `Landing` page composed of six focused section components (`Nav`, `Hero`, `TerminalDemo`, `Features`, `AIIntegration`, `CTAFooter`). All styles live in one `Landing.css` file using CSS custom properties. The terminal animation is a pure React state machine — no external animation libraries.

**Tech Stack:** React 18, Create React App, @testing-library/react, @testing-library/user-event, vanilla CSS (no MUI for this page)

**Design spec:** `docs/superpowers/specs/2026-04-03-landing-page-design.md`

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `client/src/components/landing/Landing.css` | All landing page CSS — custom properties, section styles, responsive breakpoints |
| Create | `client/src/components/landing/Nav.jsx` | Sticky top nav with logo + links |
| Create | `client/src/components/landing/Hero.jsx` | Hero section — headline, command block, CTAs, stats |
| Create | `client/src/components/landing/TerminalDemo.jsx` | Animated macOS terminal — typing → spinner → progress → result |
| Create | `client/src/components/landing/Features.jsx` | Three feature cards in a grid |
| Create | `client/src/components/landing/AIIntegration.jsx` | Two-column AI integration section |
| Create | `client/src/components/landing/CTAFooter.jsx` | Final CTA block + footer |
| Create | `client/src/pages/Landing.jsx` | Assembles all sections, imports Landing.css |
| Create | `client/src/components/landing/__tests__/Nav.test.jsx` | Nav tests |
| Create | `client/src/components/landing/__tests__/Hero.test.jsx` | Hero tests incl. copy button |
| Create | `client/src/components/landing/__tests__/TerminalDemo.test.jsx` | Animation state machine tests |
| Create | `client/src/components/landing/__tests__/Features.test.jsx` | Features card tests |
| Create | `client/src/components/landing/__tests__/AIIntegration.test.jsx` | AI integration tests |
| Create | `client/src/components/landing/__tests__/CTAFooter.test.jsx` | CTA footer tests |
| Create | `client/src/pages/__tests__/Landing.test.jsx` | Smoke test — all sections render |
| Modify | `client/src/App.js` | Render `<Landing />` instead of `<Header /> + <ChatInterface />` |
| Modify | `client/src/index.css` | Set `body` background to `#0a0a0a`, add box-sizing reset |
| Modify | `client/.gitignore` | Add `.superpowers/` |

---

## Task 1: Setup

**Files:**
- Modify: `client/.gitignore`
- Modify: `client/src/index.css`
- Create: `client/src/components/landing/` (directory)
- Create: `client/src/pages/__tests__/` (directory)

- [ ] **Step 1: Add .superpowers to gitignore**

Open `client/.gitignore` and append:
```
# superpowers brainstorm sessions
/.superpowers
```

- [ ] **Step 2: Update index.css for dark body**

Replace the full contents of `client/src/index.css` with:
```css
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #0a0a0a;
  color: #ffffff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- [ ] **Step 3: Create directories**

```bash
mkdir -p client/src/components/landing/__tests__
mkdir -p client/src/pages/__tests__
```

Expected: no output (directories created silently)

- [ ] **Step 4: Commit**

```bash
git add client/.gitignore client/src/index.css
git commit -m "chore: setup dark body styles and gitignore for landing page"
```

---

## Task 2: Landing.css — design tokens and section styles

**Files:**
- Create: `client/src/components/landing/Landing.css`

- [ ] **Step 1: Create Landing.css**

```css
/* client/src/components/landing/Landing.css */

/* ── Design tokens ─────────────────────────────── */
:root {
  --bg:          #0a0a0a;
  --surface:     #0f0f0f;
  --border:      #1a1a1a;
  --border-mid:  #222222;
  --green:       #28c840;
  --yellow:      #febc2e;
  --red:         #ff5f57;
  --text:        #ffffff;
  --muted:       #555555;
  --muted-2:     #444444;
  --dim:         #333333;
  --very-dim:    #222222;
  --font-mono:   'Courier New', Courier, monospace;
}

/* ── Global landing wrapper ────────────────────── */
.landing {
  font-family: var(--font-mono);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

/* ── Section shared utilities ──────────────────── */
.section-label {
  display: inline-block;
  padding: 3px 10px;
  border: 1px solid var(--border-mid);
  border-radius: 20px;
  font-size: 10px;
  color: var(--dim);
  letter-spacing: 0.1em;
  margin-bottom: 16px;
}

.section-heading {
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 10px;
  line-height: 1.3;
}

.section-sub {
  font-size: 12px;
  color: var(--muted-2);
  margin: 0 0 40px;
}

/* ── Nav ───────────────────────────────────────── */
.landing-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 48px;
  border-bottom: 1px solid #111111;
  background: var(--bg);
}

.nav-logo {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.05em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-link {
  font-size: 12px;
  color: var(--muted);
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
  font-family: var(--font-mono);
}

.nav-link:hover {
  color: var(--text);
}

.nav-install-btn {
  padding: 6px 14px;
  border: 1px solid var(--border-mid);
  border-radius: 4px;
  font-size: 11px;
  color: #888;
  font-family: var(--font-mono);
  cursor: pointer;
  background: none;
}

/* ── Hero ──────────────────────────────────────── */
.landing-hero {
  padding: 80px 48px 72px;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border: 1px solid var(--border-mid);
  border-radius: 20px;
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 0.08em;
  margin-bottom: 32px;
}

.hero-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

.hero-headline {
  font-size: 38px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin: 0 0 18px;
}

.hero-headline .green {
  color: var(--green);
}

.hero-subheadline {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.9;
  max-width: 480px;
  margin: 0 auto 40px;
}

.hero-cmd-block {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  background: #111111;
  border: 1px solid #1e1e1e;
  border-radius: 6px;
  padding: 14px 20px;
  margin-bottom: 32px;
}

.hero-cmd-dollar {
  color: var(--muted);
  user-select: none;
}

.hero-cmd-text {
  color: var(--text);
  font-size: 13px;
}

.hero-cmd-copy {
  font-size: 10px;
  color: #2a2a2a;
  border: none;
  border-left: 1px solid var(--border);
  padding-left: 16px;
  background: none;
  cursor: pointer;
  font-family: var(--font-mono);
  transition: color 0.15s;
}

.hero-cmd-copy:hover,
.hero-cmd-copy.copied {
  color: var(--green);
}

.hero-ctas {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 56px;
}

.btn-primary {
  padding: 10px 22px;
  background: var(--green);
  color: #000000;
  border: none;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
}

.btn-ghost {
  padding: 10px 22px;
  border: 1px solid var(--border-mid);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
  cursor: pointer;
  background: none;
  text-decoration: none;
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0;
}

.hero-stat {
  padding: 0 36px;
  text-align: center;
}

.hero-stat + .hero-stat {
  border-left: 1px solid var(--border);
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
}

.stat-label {
  font-size: 10px;
  color: var(--dim);
  margin-top: 4px;
}

/* ── Terminal Demo ──────────────────────────────── */
.landing-terminal-demo {
  padding: 72px 48px;
  text-align: center;
  border-top: 1px solid #111111;
}

.terminal-window {
  max-width: 680px;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.8);
}

.terminal-chrome {
  background: var(--border);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--border-mid);
}

.traffic-light {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.traffic-light.red    { background: var(--red); }
.traffic-light.yellow { background: var(--yellow); }
.traffic-light.green  { background: var(--green); }

.terminal-title {
  flex: 1;
  text-align: center;
  font-size: 11px;
  color: var(--dim);
}

.terminal-body {
  background: #0d0d0d;
  padding: 24px;
  font-size: 13px;
  line-height: 1.9;
  min-height: 260px;
  text-align: left;
}

.terminal-line {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.prompt-symbol {
  color: var(--green);
  flex-shrink: 0;
}

.typed-cmd {
  color: var(--text);
}

.cursor {
  color: var(--green);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

.cursor.blink {
  animation: blink 1s step-end infinite;
}

.status-line {
  margin-top: 6px;
}

.spinner-char {
  color: var(--yellow);
}

.status-text {
  color: var(--muted);
}

.progress-bar {
  color: var(--green);
}

.done-line {
  margin-top: 6px;
}

.done-check { color: var(--green); }
.done-word  { color: var(--text); }
.done-time  { color: var(--dim); }

.result-block {
  margin-top: 14px;
  font-size: 12px;
}

.result-divider {
  color: var(--very-dim);
}

.result-label {
  color: var(--muted);
  font-size: 11px;
}

.result-value-green {
  color: var(--green);
  font-size: 11px;
}

.result-value-white {
  color: var(--text);
  font-size: 11px;
}

.result-meta {
  margin-left: 1rem;
}

.transcript-excerpt {
  color: #888888;
  font-size: 12px;
  line-height: 2.1;
  margin-top: 8px;
}

.piped-note {
  color: var(--muted-2);
  font-size: 11px;
  margin-top: 4px;
}

.pipe-hint {
  margin-top: 18px;
}

.pipe-cmd {
  color: var(--dim);
}

.pipe-annotation {
  color: var(--very-dim);
  font-size: 11px;
  margin-left: 20px;
  margin-top: 2px;
}

.bottom-prompt {
  margin-top: 16px;
}

.replay-btn {
  margin-top: 20px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--dim);
  border: 1px solid var(--border);
  padding: 6px 14px;
  border-radius: 4px;
  background: none;
  cursor: pointer;
}

.replay-btn:hover {
  color: var(--muted);
}

/* ── Features ───────────────────────────────────── */
.landing-features {
  padding: 72px 48px;
  border-top: 1px solid #111111;
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 820px;
  margin: 0 auto;
  text-align: left;
}

.feature-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 28px 24px;
}

.feature-icon {
  font-size: 22px;
  color: var(--green);
  margin-bottom: 16px;
}

.feature-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 10px;
}

.feature-body {
  font-size: 11px;
  color: var(--muted-2);
  line-height: 1.8;
  margin: 0 0 20px;
}

.feature-snippet {
  padding: 10px 12px;
  background: var(--bg);
  border-radius: 4px;
  border: 1px solid #111111;
  font-size: 11px;
  color: var(--muted);
}

.feature-snippet .green { color: var(--green); }

/* ── AI Integration ─────────────────────────────── */
.landing-ai {
  padding: 72px 48px;
  border-top: 1px solid #111111;
  text-align: center;
}

.ai-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  max-width: 820px;
  margin: 0 auto;
  text-align: left;
}

.ai-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 28px;
}

.ai-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.ai-card-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: var(--border);
  border: 1px solid var(--border-mid);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.ai-card-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.ai-card-subtitle {
  font-size: 10px;
  color: var(--dim);
  margin: 2px 0 0;
}

.ai-card-body {
  font-size: 11px;
  color: var(--muted-2);
  line-height: 1.9;
  margin-bottom: 20px;
}

.ai-code-block {
  background: var(--bg);
  border: 1px solid #111111;
  border-radius: 6px;
  padding: 14px;
  margin-bottom: 16px;
}

.ai-code-label {
  font-size: 10px;
  color: var(--dim);
  margin-bottom: 8px;
  letter-spacing: 0.05em;
}

.ai-code-body {
  font-size: 11px;
  line-height: 2;
}

.ai-code-body .green  { color: var(--green); }
.ai-code-body .white  { color: var(--text); }
.ai-code-body .muted  { color: var(--muted); }
.ai-code-body .dim    { color: var(--dim); }

.ai-callout {
  padding: 10px 12px;
  background: var(--bg);
  border-radius: 4px;
  border-top: 1px solid #111111;
  border-right: 1px solid #111111;
  border-bottom: 1px solid #111111;
  border-left: 2px solid var(--green);
  font-size: 10px;
  color: var(--muted);
  line-height: 1.8;
}

.ai-callout .green { color: var(--green); }
.ai-callout .dim   { color: var(--dim); }

/* ── CTA + Footer ───────────────────────────────── */
.landing-cta {
  padding: 96px 48px 80px;
  border-top: 1px solid #111111;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(#1a1a1a 1px, transparent 1px),
    linear-gradient(90deg, #1a1a1a 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.3;
  pointer-events: none;
}

.cta-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 200px;
  background: radial-gradient(ellipse, rgba(40, 200, 64, 0.08), transparent 70%);
  pointer-events: none;
}

.cta-content {
  position: relative;
}

.cta-headline {
  font-size: 28px;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 14px;
  line-height: 1.3;
}

.cta-sub {
  font-size: 12px;
  color: var(--muted-2);
  margin: 0 0 40px;
}

.cta-cmd-block {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  background: var(--surface);
  border: 1px solid #1e1e1e;
  border-radius: 6px;
  padding: 16px 24px;
  margin-bottom: 32px;
}

.cta-cmd-dollar { color: var(--muted); user-select: none; font-size: 14px; }
.cta-cmd-text   { color: var(--text); font-size: 14px; }

.cta-btns {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.landing-footer {
  padding: 22px 48px;
  border-top: 1px solid #111111;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-logo {
  font-size: 12px;
  color: #2a2a2a;
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-link {
  font-size: 11px;
  color: #2a2a2a;
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
  font-family: var(--font-mono);
}

.footer-link:hover { color: var(--muted); }

.footer-license {
  font-size: 10px;
  color: #1e1e1e;
}

/* ── Responsive ─────────────────────────────────── */
@media (max-width: 768px) {
  .landing-nav    { padding: 16px 24px; }
  .landing-hero   { padding: 60px 24px 56px; }
  .hero-headline  { font-size: 26px; }
  .hero-stats     { flex-direction: column; gap: 20px; }
  .hero-stat + .hero-stat { border-left: none; border-top: 1px solid var(--border); padding-top: 20px; }

  .landing-terminal-demo { padding: 56px 16px; }
  .landing-features      { padding: 56px 24px; }
  .landing-ai            { padding: 56px 24px; }
  .landing-cta           { padding: 72px 24px 64px; }
  .landing-footer        { padding: 20px 24px; flex-direction: column; gap: 16px; text-align: center; }

  .features-grid { grid-template-columns: 1fr; }
  .ai-grid       { grid-template-columns: 1fr; }

  .hero-ctas  { flex-direction: column; align-items: center; }
  .cta-btns   { flex-direction: column; align-items: center; }
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/landing/Landing.css
git commit -m "feat: add Landing.css design tokens and section styles"
```

---

## Task 3: Nav component

**Files:**
- Create: `client/src/components/landing/Nav.jsx`
- Create: `client/src/components/landing/__tests__/Nav.test.jsx`

- [ ] **Step 1: Write the failing tests**

```jsx
// client/src/components/landing/__tests__/Nav.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Nav from '../Nav';

it('renders the transcribly wordmark', () => {
  render(<Nav />);
  expect(screen.getByText('transcribly')).toBeInTheDocument();
});

it('renders docs link', () => {
  render(<Nav />);
  expect(screen.getByText('docs')).toBeInTheDocument();
});

it('renders github link', () => {
  render(<Nav />);
  expect(screen.getByText('github')).toBeInTheDocument();
});

it('renders npm install button', () => {
  render(<Nav />);
  expect(screen.getByText('npm install')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd client && npm test -- --testPathPattern="Nav.test" --watchAll=false
```

Expected: FAIL — `Cannot find module '../Nav'`

- [ ] **Step 3: Implement Nav**

```jsx
// client/src/components/landing/Nav.jsx
import React from 'react';

function Nav() {
  return (
    <nav className="landing-nav">
      <span className="nav-logo">transcribly</span>
      <div className="nav-links">
        <a className="nav-link" href="#docs">docs</a>
        <a
          className="nav-link"
          href="https://github.com/chibeze01/Youtube-Transcriber"
          target="_blank"
          rel="noreferrer"
        >
          github
        </a>
        <button className="nav-install-btn">npm install</button>
      </div>
    </nav>
  );
}

export default Nav;
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd client && npm test -- --testPathPattern="Nav.test" --watchAll=false
```

Expected: PASS — 4 tests passing

- [ ] **Step 5: Commit**

```bash
git add client/src/components/landing/Nav.jsx client/src/components/landing/__tests__/Nav.test.jsx
git commit -m "feat: add Nav component"
```

---

## Task 4: Hero component

**Files:**
- Create: `client/src/components/landing/Hero.jsx`
- Create: `client/src/components/landing/__tests__/Hero.test.jsx`

- [ ] **Step 1: Write the failing tests**

```jsx
// client/src/components/landing/__tests__/Hero.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Hero from '../Hero';

beforeEach(() => {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: jest.fn().mockResolvedValue(undefined) },
    writable: true,
  });
});

it('renders the main headline', () => {
  render(<Hero />);
  expect(screen.getByText(/YouTube\. As text\./)).toBeInTheDocument();
});

it('renders "In your terminal." in the headline', () => {
  render(<Hero />);
  expect(screen.getByText(/In your terminal\./)).toBeInTheDocument();
});

it('renders the npx command', () => {
  render(<Hero />);
  expect(screen.getByText(/npx transcribly/)).toBeInTheDocument();
});

it('renders Get started button', () => {
  render(<Hero />);
  expect(screen.getByText(/Get started/)).toBeInTheDocument();
});

it('renders View on GitHub button', () => {
  render(<Hero />);
  expect(screen.getByText(/View on GitHub/)).toBeInTheDocument();
});

it('renders all three stat labels', () => {
  render(<Hero />);
  expect(screen.getByText(/avg transcription/)).toBeInTheDocument();
  expect(screen.getByText(/any length/)).toBeInTheDocument();
  expect(screen.getByText(/pipe-ready/)).toBeInTheDocument();
});

it('copies command to clipboard when copy button is clicked', async () => {
  const user = userEvent.setup();
  render(<Hero />);
  await user.click(screen.getByText('copy'));
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
    'npx transcribly <youtube-url>'
  );
});

it('shows "copied!" feedback after clicking copy', async () => {
  const user = userEvent.setup();
  render(<Hero />);
  await user.click(screen.getByText('copy'));
  expect(screen.getByText('copied!')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd client && npm test -- --testPathPattern="Hero.test" --watchAll=false
```

Expected: FAIL — `Cannot find module '../Hero'`

- [ ] **Step 3: Implement Hero**

```jsx
// client/src/components/landing/Hero.jsx
import React, { useState } from 'react';

const COMMAND = 'npx transcribly <youtube-url>';

function Hero() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(COMMAND).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <section className="landing-hero">
      <div className="hero-badge">
        <span className="hero-badge-dot" />
        v1.0 — now with AI agent support
      </div>

      <h1 className="hero-headline">
        YouTube. As text.<br />
        <span className="green">In your terminal.</span>
      </h1>

      <p className="hero-subheadline">
        Transcribe any YouTube video from the CLI in seconds.<br />
        Pipe the output anywhere — your AI agent, your codebase, your notes.
      </p>

      <div className="hero-cmd-block">
        <span className="hero-cmd-dollar">$</span>
        <span className="hero-cmd-text">{COMMAND}</span>
        <button
          className={`hero-cmd-copy${copied ? ' copied' : ''}`}
          onClick={handleCopy}
        >
          {copied ? 'copied!' : 'copy'}
        </button>
      </div>

      <div className="hero-ctas">
        <a href="#demo" className="btn-primary">Get started →</a>
        <a
          href="https://github.com/chibeze01/Youtube-Transcriber"
          target="_blank"
          rel="noreferrer"
          className="btn-ghost"
        >
          View on GitHub
        </a>
      </div>

      <div className="hero-stats">
        <div className="hero-stat">
          <div className="stat-value">~4s</div>
          <div className="stat-label">avg transcription</div>
        </div>
        <div className="hero-stat">
          <div className="stat-value">any length</div>
          <div className="stat-label">auto-chunked audio</div>
        </div>
        <div className="hero-stat">
          <div className="stat-value">pipe-ready</div>
          <div className="stat-label">stdout output</div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd client && npm test -- --testPathPattern="Hero.test" --watchAll=false
```

Expected: PASS — 8 tests passing

- [ ] **Step 5: Commit**

```bash
git add client/src/components/landing/Hero.jsx client/src/components/landing/__tests__/Hero.test.jsx
git commit -m "feat: add Hero component with copy-to-clipboard"
```

---

## Task 5: TerminalDemo component

**Files:**
- Create: `client/src/components/landing/TerminalDemo.jsx`
- Create: `client/src/components/landing/__tests__/TerminalDemo.test.jsx`

- [ ] **Step 1: Write the failing tests**

```jsx
// client/src/components/landing/__tests__/TerminalDemo.test.jsx
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TerminalDemo, { FULL_CMD, TYPING_SPEED } from '../TerminalDemo';

// Total ms to finish typing the full command (plus 600ms initial delay)
const AFTER_TYPING = 600 + FULL_CMD.length * TYPING_SPEED + 50;

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  act(() => jest.runAllTimers());
  jest.useRealTimers();
});

it('renders the terminal window chrome', () => {
  render(<TerminalDemo />);
  expect(screen.getByText('bash — 80×24')).toBeInTheDocument();
});

it('renders the QUICK TRY section label', () => {
  render(<TerminalDemo />);
  expect(screen.getByText('QUICK TRY')).toBeInTheDocument();
});

it('starts typing the command after initial delay', () => {
  render(<TerminalDemo />);
  act(() => jest.advanceTimersByTime(600 + TYPING_SPEED * 5));
  expect(screen.getByText(/npx/)).toBeInTheDocument();
});

it('shows fetching status after command finishes typing', () => {
  render(<TerminalDemo />);
  act(() => jest.advanceTimersByTime(AFTER_TYPING + 300));
  expect(screen.getByText(/Fetching audio from YouTube/)).toBeInTheDocument();
});

it('shows chunking status after fetching phase', () => {
  render(<TerminalDemo />);
  act(() => jest.advanceTimersByTime(AFTER_TYPING + 300 + 1400 + 100));
  expect(screen.getByText(/Chunking audio into segments/)).toBeInTheDocument();
});

it('shows transcribing with progress bar', () => {
  render(<TerminalDemo />);
  act(() => jest.advanceTimersByTime(AFTER_TYPING + 300 + 1400 + 1200 + 100));
  expect(screen.getByText(/Transcribing/)).toBeInTheDocument();
  expect(screen.getByText(/\[/)).toBeInTheDocument(); // progress bar brackets
});

it('shows Done after transcription completes', () => {
  // typing + 200ms pause + 1400ms fetching + 1200ms chunking + 100 steps*60ms transcribing + 300ms done delay
  const doneTime = AFTER_TYPING + 200 + 1400 + 1200 + 100 * 60 + 400;
  render(<TerminalDemo />);
  act(() => jest.advanceTimersByTime(doneTime));
  expect(screen.getByText('Done')).toBeInTheDocument();
  expect(screen.getByText(/4\.2s/)).toBeInTheDocument();
});

it('shows result block with Rick Roll video after done', () => {
  const resultTime = AFTER_TYPING + 200 + 1400 + 1200 + 100 * 60 + 400 + 600;
  render(<TerminalDemo />);
  act(() => jest.advanceTimersByTime(resultTime));
  expect(screen.getByText(/Never Gonna Give You Up/)).toBeInTheDocument();
  expect(screen.getByText(/312/)).toBeInTheDocument();
});

it('shows pipe hint after result', () => {
  const pipeTime = AFTER_TYPING + 200 + 1400 + 1200 + 100 * 60 + 400 + 600 + 1400 + 100;
  render(<TerminalDemo />);
  act(() => jest.advanceTimersByTime(pipeTime));
  expect(screen.getByText(/pipe it anywhere/)).toBeInTheDocument();
});

it('renders the replay button', () => {
  render(<TerminalDemo />);
  expect(screen.getByText(/replay/)).toBeInTheDocument();
});

it('resets animation when replay is clicked', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  render(<TerminalDemo />);
  // Fast-forward to end
  act(() => jest.advanceTimersByTime(30000));
  // Replay
  await user.click(screen.getByText(/replay/));
  // Immediately after reset, command text should be empty (typedCount = 0)
  // The terminal body should not show the result block anymore
  expect(screen.queryByText(/Never Gonna Give You Up/)).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd client && npm test -- --testPathPattern="TerminalDemo.test" --watchAll=false
```

Expected: FAIL — `Cannot find module '../TerminalDemo'`

- [ ] **Step 3: Implement TerminalDemo**

```jsx
// client/src/components/landing/TerminalDemo.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

export const FULL_CMD = 'npx transcribly https://youtube.com/watch?v=dQw4w9WgXcQ';
export const TYPING_SPEED = 36; // ms per character

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const SPINNER_SPEED = 80; // ms per frame
const PROGRESS_STEP_MS = 60; // ms per 2% progress increment

// Phases in order: typing → fetching → chunking → transcribing → done → result → pipe → prompt
function TerminalDemo() {
  const [phase, setPhase] = useState('idle');
  const [typedCount, setTypedCount] = useState(0);
  const [spinnerFrame, setSpinnerFrame] = useState(0);
  const [progress, setProgress] = useState(0);

  const timers = useRef([]);
  const intervals = useRef([]);

  const clearAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    intervals.current.forEach(clearInterval);
    timers.current = [];
    intervals.current = [];
  }, []);

  function addTimeout(fn, delay) {
    const id = setTimeout(fn, delay);
    timers.current.push(id);
    return id;
  }

  function addInterval(fn, ms) {
    const id = setInterval(fn, ms);
    intervals.current.push(id);
    return id;
  }

  function removeInterval(id) {
    clearInterval(id);
    intervals.current = intervals.current.filter(i => i !== id);
  }

  const runDemo = useCallback(() => {
    clearAll();
    setPhase('typing');
    setTypedCount(0);
    setSpinnerFrame(0);
    setProgress(0);

    // ── Phase 1: Typing ───────────────────────────
    let pos = 0;
    const typingId = addInterval(() => {
      pos += 1;
      setTypedCount(pos);
      if (pos >= FULL_CMD.length) {
        removeInterval(typingId);

        // ── Phase 2: Fetching ───────────────────
        addTimeout(() => {
          setPhase('fetching');

          const spinnerId = addInterval(() => {
            setSpinnerFrame(f => (f + 1) % SPINNER_FRAMES.length);
          }, SPINNER_SPEED);

          // ── Phase 3: Chunking ─────────────────
          addTimeout(() => {
            setPhase('chunking');

            // ── Phase 4: Transcribing ─────────
            addTimeout(() => {
              setPhase('transcribing');
              let pct = 0;
              const progressId = addInterval(() => {
                pct += 2;
                setProgress(pct);
                if (pct >= 100) {
                  removeInterval(progressId);
                  removeInterval(spinnerId);

                  // ── Phase 5: Done ────────────
                  addTimeout(() => {
                    setPhase('done');

                    // ── Phase 6: Result ──────
                    addTimeout(() => {
                      setPhase('result');

                      // ── Phase 7: Pipe ────
                      addTimeout(() => {
                        setPhase('pipe');

                        // ── Phase 8: Prompt ──
                        addTimeout(() => setPhase('prompt'), 600);
                      }, 1400);
                    }, 500);
                  }, 300);
                }
              }, PROGRESS_STEP_MS);
            }, 1200);
          }, 1400);
        }, 200);
      }
    }, TYPING_SPEED);
  }, [clearAll]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const id = setTimeout(runDemo, 600);
    return () => {
      clearTimeout(id);
      clearAll();
    };
  }, [runDemo, clearAll]);

  // Derived display flags
  const isSpinning   = ['fetching', 'chunking', 'transcribing'].includes(phase);
  const showDone     = ['done', 'result', 'pipe', 'prompt'].includes(phase);
  const showResult   = ['result', 'pipe', 'prompt'].includes(phase);
  const showPipe     = ['pipe', 'prompt'].includes(phase);
  const showPrompt   = phase === 'prompt';
  const showTypingCursor = phase === 'typing';

  const statusText =
    phase === 'fetching'     ? 'Fetching audio from YouTube...' :
    phase === 'chunking'     ? 'Chunking audio into segments...' :
    phase === 'transcribing' ? 'Transcribing ' : '';

  const filledBlocks = Math.round(progress / 100 * 10);
  const progressBar  = `[${'█'.repeat(filledBlocks)}${'░'.repeat(10 - filledBlocks)}] ${progress}%`;

  return (
    <section className="landing-terminal-demo" id="demo">
      <div className="section-label">QUICK TRY</div>
      <h2 className="section-heading">See it in action</h2>
      <p className="section-sub">No signup. No install. Just run it.</p>

      <div className="terminal-window">
        {/* Chrome */}
        <div className="terminal-chrome">
          <span className="traffic-light red" />
          <span className="traffic-light yellow" />
          <span className="traffic-light green" />
          <span className="terminal-title">bash — 80×24</span>
        </div>

        {/* Body */}
        <div className="terminal-body">
          {/* Command line — cursor only here during typing */}
          <div className="terminal-line">
            <span className="prompt-symbol">❯</span>
            <span className="typed-cmd">{FULL_CMD.slice(0, typedCount)}</span>
            {showTypingCursor && <span className="cursor blink">▊</span>}
          </div>

          {/* Single status line — updates in place */}
          {isSpinning && (
            <div className="terminal-line status-line">
              <span className="spinner-char">{SPINNER_FRAMES[spinnerFrame]} </span>
              <span className="status-text">{statusText}</span>
              {phase === 'transcribing' && (
                <span className="progress-bar"> {progressBar}</span>
              )}
            </div>
          )}

          {/* Done */}
          {showDone && (
            <div className="terminal-line done-line">
              <span className="done-check">✓</span>
              <span className="done-word"> Done</span>
              <span className="done-time"> in 4.2s</span>
            </div>
          )}

          {/* Result block */}
          {showResult && (
            <div className="result-block">
              <div className="result-divider">───────────────────────────────────────────</div>
              <div>
                <span className="result-label">video </span>
                <span className="result-value-green">Never Gonna Give You Up (Official Music Video)</span>
              </div>
              <div>
                <span className="result-label">duration </span>
                <span className="result-value-white">3:33</span>
                <span className="result-label result-meta">words </span>
                <span className="result-value-white">312</span>
              </div>
              <div className="result-divider">───────────────────────────────────────────</div>
              <div className="transcript-excerpt">
                "We're no strangers to love, you know the rules<br />
                and so do I. A full commitment's what I'm thinking of..."
              </div>
              <div className="piped-note">[...312 words piped to stdout]</div>
            </div>
          )}

          {/* Pipe hint */}
          {showPipe && (
            <div className="pipe-hint terminal-line">
              <span className="prompt-symbol">❯</span>
              <span className="pipe-cmd"> npx transcribly https://... | claude "summarize this"</span>
              <div className="pipe-annotation">↑ pipe it anywhere</div>
            </div>
          )}

          {/* Bottom prompt — cursor returns here */}
          {showPrompt && (
            <div className="terminal-line bottom-prompt">
              <span className="prompt-symbol">❯</span>
              <span className="cursor blink">▊</span>
            </div>
          )}
        </div>
      </div>

      <button className="replay-btn" onClick={runDemo}>↺ replay</button>
    </section>
  );
}

export default TerminalDemo;
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd client && npm test -- --testPathPattern="TerminalDemo.test" --watchAll=false
```

Expected: PASS — 11 tests passing

- [ ] **Step 5: Commit**

```bash
git add client/src/components/landing/TerminalDemo.jsx client/src/components/landing/__tests__/TerminalDemo.test.jsx
git commit -m "feat: add TerminalDemo component with animated state machine"
```

---

## Task 6: Features component

**Files:**
- Create: `client/src/components/landing/Features.jsx`
- Create: `client/src/components/landing/__tests__/Features.test.jsx`

- [ ] **Step 1: Write the failing tests**

```jsx
// client/src/components/landing/__tests__/Features.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Features from '../Features';

it('renders the section heading', () => {
  render(<Features />);
  expect(screen.getByText(/Built for developers/)).toBeInTheDocument();
});

it('renders Zero setup card', () => {
  render(<Features />);
  expect(screen.getByText('Zero setup')).toBeInTheDocument();
});

it('renders Any length video card', () => {
  render(<Features />);
  expect(screen.getByText('Any length video')).toBeInTheDocument();
});

it('renders Pipe-ready output card', () => {
  render(<Features />);
  expect(screen.getByText('Pipe-ready output')).toBeInTheDocument();
});

it('renders three feature cards total', () => {
  render(<Features />);
  expect(screen.getAllByRole('article')).toHaveLength(3);
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd client && npm test -- --testPathPattern="Features.test" --watchAll=false
```

Expected: FAIL — `Cannot find module '../Features'`

- [ ] **Step 3: Implement Features**

```jsx
// client/src/components/landing/Features.jsx
import React from 'react';

const FEATURES = [
  {
    icon: '⚡',
    title: 'Zero setup',
    body: "No account. No config file. Just npx and a URL. Works anywhere Node runs.",
    snippet: '$ npx transcribly <url>',
    snippetGreen: false,
  },
  {
    icon: '∞',
    title: 'Any length video',
    body: 'Audio is automatically chunked and transcribed in parallel. 3-minute clip or 3-hour lecture — same command.',
    snippet: '✓ chunked · parallel · unlimited',
    snippetGreen: true,
  },
  {
    icon: '|',
    title: 'Pipe-ready output',
    body: 'Clean plain text to stdout. Pipe into Claude, GPT, a file, a script — whatever your workflow needs.',
    snippet: '$ transcribly <url>',
    snippetGreenSuffix: ' | claude',
  },
];

function Features() {
  return (
    <section className="landing-features">
      <div className="section-label">WHY TRANSCRIBLY</div>
      <h2 className="section-heading">
        Built for developers.<br />Ready for agents.
      </h2>

      <div className="features-grid">
        {FEATURES.map((f) => (
          <article key={f.title} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-body">{f.body}</p>
            <div className="feature-snippet">
              {f.snippetGreen
                ? <span className="green">{f.snippet}</span>
                : <span>{f.snippet}{f.snippetGreenSuffix && <span className="green">{f.snippetGreenSuffix}</span>}</span>
              }
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Features;
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd client && npm test -- --testPathPattern="Features.test" --watchAll=false
```

Expected: PASS — 5 tests passing

- [ ] **Step 5: Commit**

```bash
git add client/src/components/landing/Features.jsx client/src/components/landing/__tests__/Features.test.jsx
git commit -m "feat: add Features component"
```

---

## Task 7: AIIntegration component

**Files:**
- Create: `client/src/components/landing/AIIntegration.jsx`
- Create: `client/src/components/landing/__tests__/AIIntegration.test.jsx`

- [ ] **Step 1: Write the failing tests**

```jsx
// client/src/components/landing/__tests__/AIIntegration.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import AIIntegration from '../AIIntegration';

it('renders the section headline with "ears" not "eyes"', () => {
  render(<AIIntegration />);
  expect(screen.getByText(/ears on YouTube/)).toBeInTheDocument();
  expect(screen.queryByText(/eyes on YouTube/)).not.toBeInTheDocument();
});

it('renders Claude Code card', () => {
  render(<AIIntegration />);
  expect(screen.getByText('Claude Code')).toBeInTheDocument();
});

it('renders Any AI Agent card', () => {
  render(<AIIntegration />);
  expect(screen.getByText('Any AI Agent')).toBeInTheDocument();
});

it('renders the settings.json label', () => {
  render(<AIIntegration />);
  expect(screen.getByText('~/.claude/settings.json')).toBeInTheDocument();
});

it('renders the works-with callout', () => {
  render(<AIIntegration />);
  expect(screen.getByText(/works with/)).toBeInTheDocument();
  expect(screen.getByText(/GPT/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd client && npm test -- --testPathPattern="AIIntegration.test" --watchAll=false
```

Expected: FAIL — `Cannot find module '../AIIntegration'`

- [ ] **Step 3: Implement AIIntegration**

```jsx
// client/src/components/landing/AIIntegration.jsx
import React from 'react';

function AIIntegration() {
  return (
    <section className="landing-ai">
      <div className="section-label">AI INTEGRATION</div>
      <h2 className="section-heading">
        Give your AI<br />
        <span style={{ color: 'var(--green)' }}>ears on YouTube.</span>
      </h2>
      <p className="section-sub" style={{ maxWidth: 460, margin: '0 auto 48px' }}>
        LLMs can't listen to videos. Transcribly bridges the gap — turn any YouTube
        audio into text your AI can read, reason over, and act on.
      </p>

      <div className="ai-grid">
        {/* ── Left: Claude Code ─────────────────── */}
        <div className="ai-card">
          <div className="ai-card-header">
            <div className="ai-card-icon">⬡</div>
            <div>
              <div className="ai-card-title">Claude Code</div>
              <div className="ai-card-subtitle">tool call · slash command</div>
            </div>
          </div>
          <p className="ai-card-body">
            Add transcribly as a shell tool in Claude Code. Now Claude can fetch
            and read any YouTube video mid-session — no copy-paste, no tab switching.
          </p>
          <div className="ai-code-block">
            <div className="ai-code-label">~/.claude/settings.json</div>
            <div className="ai-code-body">
              <span className="muted">{'{'}</span><br />
              &nbsp;&nbsp;<span className="green">"tools"</span>
              <span className="muted">: [{'{'}</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="green">"name"</span>
              <span className="muted">: </span>
              <span className="white">"transcribly"</span>
              <span className="muted">,</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="green">"type"</span>
              <span className="muted">: </span>
              <span className="white">"bash"</span>
              <span className="muted">,</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="green">"cmd"</span>
              <span className="muted">: </span>
              <span className="white">"npx transcribly $url"</span><br />
              &nbsp;&nbsp;<span className="muted">{'}]'}</span><br />
              <span className="muted">{'}'}</span>
            </div>
          </div>
          <div className="ai-callout">
            <span className="green">claude&gt;</span>{' '}
            "Summarize this YT video for me"<br />
            <span className="dim">→ calls transcribly → reads transcript → responds</span>
          </div>
        </div>

        {/* ── Right: Any AI Agent ───────────────── */}
        <div className="ai-card">
          <div className="ai-card-header">
            <div className="ai-card-icon">⟁</div>
            <div>
              <div className="ai-card-title">Any AI Agent</div>
              <div className="ai-card-subtitle">pipe · stdin · API</div>
            </div>
          </div>
          <p className="ai-card-body">
            Stretch your agent's context with real video audio. Research pipelines,
            RAG ingestion, lecture summaries — transcribly feeds the text in.
          </p>
          <div className="ai-code-block">
            <div className="ai-code-label">agent pipeline · bash</div>
            <div className="ai-code-body">
              <span className="dim"># fetch + summarize</span><br />
              <span className="white">npx transcribly $URL \</span><br />
              &nbsp;&nbsp;<span className="white">| llm </span>
              <span className="green">"tldr"</span><br />
              <br />
              <span className="dim"># ingest into RAG</span><br />
              <span className="white">npx transcribly $URL \</span><br />
              &nbsp;&nbsp;<span className="white">| chunk </span>
              <span className="green">--embed</span>
              <span className="white"> --store</span>
            </div>
          </div>
          <div className="ai-callout">
            <span className="green">works with</span>{' '}
            GPT · Claude · Gemini · Ollama<br />
            <span className="dim">→ stdout is universal</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AIIntegration;
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd client && npm test -- --testPathPattern="AIIntegration.test" --watchAll=false
```

Expected: PASS — 5 tests passing

- [ ] **Step 5: Commit**

```bash
git add client/src/components/landing/AIIntegration.jsx client/src/components/landing/__tests__/AIIntegration.test.jsx
git commit -m "feat: add AIIntegration component"
```

---

## Task 8: CTAFooter component

**Files:**
- Create: `client/src/components/landing/CTAFooter.jsx`
- Create: `client/src/components/landing/__tests__/CTAFooter.test.jsx`

- [ ] **Step 1: Write the failing tests**

```jsx
// client/src/components/landing/__tests__/CTAFooter.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import CTAFooter from '../CTAFooter';

it('renders the CTA headline', () => {
  render(<CTAFooter />);
  expect(screen.getByText(/Start transcribing/)).toBeInTheDocument();
});

it('renders "No account. No API key. Just Node."', () => {
  render(<CTAFooter />);
  expect(screen.getByText(/No account\. No API key\./)).toBeInTheDocument();
});

it('renders the npx command', () => {
  render(<CTAFooter />);
  expect(screen.getByText(/npx transcribly/)).toBeInTheDocument();
});

it('renders View on GitHub CTA', () => {
  render(<CTAFooter />);
  expect(screen.getByText(/View on GitHub/)).toBeInTheDocument();
});

it('renders Read the docs CTA', () => {
  render(<CTAFooter />);
  expect(screen.getByText(/Read the docs/)).toBeInTheDocument();
});

it('renders footer with MIT license', () => {
  render(<CTAFooter />);
  expect(screen.getByText(/MIT license/)).toBeInTheDocument();
});

it('renders footer links: github, npm, docs', () => {
  render(<CTAFooter />);
  // These appear as link text in the footer
  const githubLinks = screen.getAllByText('github');
  expect(githubLinks.length).toBeGreaterThanOrEqual(1);
  expect(screen.getByText('npm')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd client && npm test -- --testPathPattern="CTAFooter.test" --watchAll=false
```

Expected: FAIL — `Cannot find module '../CTAFooter'`

- [ ] **Step 3: Implement CTAFooter**

```jsx
// client/src/components/landing/CTAFooter.jsx
import React from 'react';

const GITHUB_URL = 'https://github.com/chibeze01/Youtube-Transcriber';
const README_URL = `${GITHUB_URL}#readme`;

function CTAFooter() {
  return (
    <>
      <section className="landing-cta">
        <div className="cta-grid-bg" aria-hidden="true" />
        <div className="cta-glow" aria-hidden="true" />
        <div className="cta-content">
          <h2 className="cta-headline">
            Start transcribing<br />in 30 seconds.
          </h2>
          <p className="cta-sub">No account. No API key. Just Node.</p>

          <div className="cta-cmd-block">
            <span className="cta-cmd-dollar">$</span>
            <span className="cta-cmd-text">npx transcribly &lt;youtube-url&gt;</span>
          </div>

          <div className="cta-btns">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              View on GitHub →
            </a>
            <a
              href={README_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              Read the docs
            </a>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <span className="footer-logo">transcribly</span>
        <div className="footer-links">
          <a className="footer-link" href={GITHUB_URL} target="_blank" rel="noreferrer">github</a>
          <a className="footer-link" href="https://www.npmjs.com/package/transcribly" target="_blank" rel="noreferrer">npm</a>
          <a className="footer-link" href={README_URL} target="_blank" rel="noreferrer">docs</a>
        </div>
        <span className="footer-license">MIT license</span>
      </footer>
    </>
  );
}

export default CTAFooter;
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd client && npm test -- --testPathPattern="CTAFooter.test" --watchAll=false
```

Expected: PASS — 7 tests passing

- [ ] **Step 5: Commit**

```bash
git add client/src/components/landing/CTAFooter.jsx client/src/components/landing/__tests__/CTAFooter.test.jsx
git commit -m "feat: add CTAFooter component"
```

---

## Task 9: Landing page assembly

**Files:**
- Create: `client/src/pages/Landing.jsx`
- Create: `client/src/pages/__tests__/Landing.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
// client/src/pages/__tests__/Landing.test.jsx
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Landing from '../Landing';

// Suppress the TerminalDemo timers in this smoke test
beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  act(() => jest.runAllTimers());
  jest.useRealTimers();
});

it('renders the nav', () => {
  render(<Landing />);
  expect(screen.getByText('transcribly')).toBeInTheDocument();
});

it('renders the hero headline', () => {
  render(<Landing />);
  expect(screen.getByText(/YouTube\. As text\./)).toBeInTheDocument();
});

it('renders the terminal demo section label', () => {
  render(<Landing />);
  expect(screen.getByText('QUICK TRY')).toBeInTheDocument();
});

it('renders the features section', () => {
  render(<Landing />);
  expect(screen.getByText('Zero setup')).toBeInTheDocument();
});

it('renders the AI integration section', () => {
  render(<Landing />);
  expect(screen.getByText(/ears on YouTube/)).toBeInTheDocument();
});

it('renders the CTA section', () => {
  render(<Landing />);
  expect(screen.getByText(/Start transcribing/)).toBeInTheDocument();
});

it('renders the footer', () => {
  render(<Landing />);
  expect(screen.getByText(/MIT license/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd client && npm test -- --testPathPattern="pages/__tests__/Landing" --watchAll=false
```

Expected: FAIL — `Cannot find module '../Landing'`

- [ ] **Step 3: Implement Landing.jsx**

```jsx
// client/src/pages/Landing.jsx
import React from 'react';
import '../components/landing/Landing.css';
import Nav from '../components/landing/Nav';
import Hero from '../components/landing/Hero';
import TerminalDemo from '../components/landing/TerminalDemo';
import Features from '../components/landing/Features';
import AIIntegration from '../components/landing/AIIntegration';
import CTAFooter from '../components/landing/CTAFooter';

function Landing() {
  return (
    <div className="landing">
      <Nav />
      <main>
        <Hero />
        <TerminalDemo />
        <Features />
        <AIIntegration />
        <CTAFooter />
      </main>
    </div>
  );
}

export default Landing;
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd client && npm test -- --testPathPattern="pages/__tests__/Landing" --watchAll=false
```

Expected: PASS — 7 tests passing

- [ ] **Step 5: Commit**

```bash
git add client/src/pages/Landing.jsx client/src/pages/__tests__/Landing.test.jsx
git commit -m "feat: assemble Landing page from section components"
```

---

## Task 10: Wire into App.js and final verification

**Files:**
- Modify: `client/src/App.js`

- [ ] **Step 1: Update App.js**

Replace the full contents of `client/src/App.js` with:

```jsx
// client/src/App.js
import Landing from './pages/Landing';

function App() {
  return <Landing />;
}

export default App;
```

- [ ] **Step 2: Run the full test suite**

```bash
cd client && npm test -- --watchAll=false
```

Expected: All tests pass. Note — existing tests for `ChatInterface`, `Header`, etc. may now fail if they relied on `App.js` importing them. If any tests in `App.test.js` fail, update `client/src/App.test.js` to:

```jsx
import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  jest.runAllTimers();
  jest.useRealTimers();
});

test('renders landing page', () => {
  render(<App />);
  expect(screen.getByText('transcribly')).toBeInTheDocument();
});
```

- [ ] **Step 3: Start dev server and do a manual smoke test**

```bash
cd client && npm start
```

Open http://localhost:3000 and verify:
- [ ] Page is dark (`#0a0a0a` background)
- [ ] Nav is sticky — scroll down, nav stays at top
- [ ] Terminal demo auto-plays: command types → spinner animates on one line → progress bar fills → Done → result → pipe → bottom cursor
- [ ] Replay button resets and re-runs animation
- [ ] Copy button on hero command copies text and shows "copied!" briefly
- [ ] "Get started →" scrolls to the terminal demo section
- [ ] All three feature cards render
- [ ] AI integration two-column layout looks correct
- [ ] CTA grid background and glow are visible
- [ ] Footer is minimal and dimly lit
- [ ] On mobile width (< 768px): cards stack vertically, nav wraps correctly

- [ ] **Step 4: Final commit**

```bash
cd client
git add src/App.js src/App.test.js
git commit -m "feat: wire Landing page into App — Transcribly CLI rebrand complete"
```

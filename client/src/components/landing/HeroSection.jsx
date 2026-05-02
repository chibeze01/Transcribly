import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import WaveformScene from "./WaveformScene";

const PHRASES = [
  "In your terminal.",
  "YouTube videos.",
  "Local audio files.",
  "Piped to Claude.",
  "Fed to your agent.",
  "In one command.",
];

const TYPING_SPEED = 60;
const DELETE_SPEED = 35;
const PAUSE_AFTER_TYPE = 2000;
const PAUSE_AFTER_DELETE = 400;

function useTypingAnimation(phrases) {
  const [text, setText] = useState("");
  const phraseIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);
  const timerRef = useRef(null);

  const tick = useCallback(() => {
    const current = phrases[phraseIndex.current];

    if (!isDeleting.current) {
      charIndex.current++;
      setText(current.slice(0, charIndex.current));
      if (charIndex.current === current.length) {
        timerRef.current = setTimeout(() => {
          isDeleting.current = true;
          tick();
        }, PAUSE_AFTER_TYPE);
        return;
      }
      timerRef.current = setTimeout(tick, TYPING_SPEED);
    } else {
      charIndex.current--;
      setText(current.slice(0, charIndex.current));
      if (charIndex.current === 0) {
        isDeleting.current = false;
        phraseIndex.current = (phraseIndex.current + 1) % phrases.length;
        timerRef.current = setTimeout(tick, PAUSE_AFTER_DELETE);
        return;
      }
      timerRef.current = setTimeout(tick, DELETE_SPEED);
    }
  }, [phrases]);

  useEffect(() => {
    timerRef.current = setTimeout(tick, 800);
    return () => clearTimeout(timerRef.current);
  }, [tick]);

  return text;
}

export default function HeroSection() {
  const [copied, setCopied] = useState(false);
  const typedText = useTypingAnimation(PHRASES);

  const handleCopy = () => {
    navigator.clipboard
      .writeText("npx transcribly <youtube-url>")
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-black px-6 pt-16">
      {/* Animated waveform background */}
      <WaveformScene />

      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900/60 px-3 py-1 text-sm text-gray-400 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          v1.0 — now with AI agent support
        </motion.div>

        {/* Headline with typing animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mx-auto mb-6 max-w-3xl"
        >
          <h1 className="text-left text-3xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block sm:whitespace-nowrap">Transcribe anything.</span>
            <span className="block min-h-[1.15em] text-green-400">
              {typedText || "\u00A0"}
            </span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 sm:text-xl"
        >
          Transcribe YouTube videos, local audio, and media files from the CLI.
          Pipe the output anywhere — your AI agent, your codebase, your notes.
        </motion.p>

        {/* Command block */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mx-auto mt-8 flex max-w-lg items-center justify-between rounded-lg border border-gray-800 bg-gray-900/80 px-4 py-3 backdrop-blur-sm"
        >
          <code className="font-mono text-sm text-gray-300">
            $ npx transcribly &lt;youtube-url&gt;
          </code>
          <button
            onClick={handleCopy}
            className={`ml-4 rounded px-2 py-1 text-xs font-medium transition-colors ${
              copied
                ? "text-green-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {copied ? "copied!" : "copy"}
          </button>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#demo"
            className="inline-flex items-center rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-green-400 hover:shadow-[0_0_30px_rgba(40,200,64,0.3)]"
          >
            Get started →
          </a>
          <a
            href="https://github.com/chibeze01/Youtube-Transcriber"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-lg border border-gray-700 px-6 py-3 text-sm font-semibold text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
          >
            View on GitHub
          </a>
        </motion.div>

        {/* Micro-stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 text-sm sm:flex-row sm:gap-0"
        >
          <div className="px-6">
            <span className="font-semibold text-white">~4s</span>
            <span className="ml-1 text-gray-500">avg transcription</span>
          </div>
          <div className="px-6 sm:border-l sm:border-gray-800">
            <span className="font-semibold text-white">any length</span>
            <span className="ml-1 text-gray-500">auto-chunked audio</span>
          </div>
          <div className="px-6 sm:border-l sm:border-gray-800">
            <span className="font-semibold text-white">pipe-ready</span>
            <span className="ml-1 text-gray-500">stdout output</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

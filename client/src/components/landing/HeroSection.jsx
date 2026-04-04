import { useState } from "react";

export default function HeroSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npx transcribly <youtube-url>")
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // clipboard denied — silently ignore, button stays as "copy"
      });
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-black px-6 pt-16">
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900/60 px-3 py-1 text-sm text-gray-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          v1.0 — now with AI agent support
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          YouTube. As text.{" "}
          <span className="block text-green-400">In your terminal.</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 sm:text-xl">
          Transcribe any YouTube video from the CLI in seconds. Pipe the output
          anywhere — your AI agent, your codebase, your notes.
        </p>

        {/* Command block */}
        <div className="mx-auto mt-8 flex max-w-lg items-center justify-between rounded-lg border border-gray-800 bg-gray-900 px-4 py-3">
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
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#demo"
            className="inline-flex items-center rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-green-400"
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
        </div>

        {/* Micro-stats */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-0 text-sm">
          <div className="px-6">
            <span className="font-semibold text-white">~4s</span>
            <span className="ml-1 text-gray-500">avg transcription</span>
          </div>
          <div className="sm:border-l sm:border-gray-800 px-6">
            <span className="font-semibold text-white">any length</span>
            <span className="ml-1 text-gray-500">auto-chunked audio</span>
          </div>
          <div className="sm:border-l sm:border-gray-800 px-6">
            <span className="font-semibold text-white">pipe-ready</span>
            <span className="ml-1 text-gray-500">stdout output</span>
          </div>
        </div>
      </div>
    </section>
  );
}

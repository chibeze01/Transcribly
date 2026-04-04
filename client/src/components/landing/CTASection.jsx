const GITHUB_URL = "https://github.com/chibeze01/Youtube-Transcriber";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-gray-800 px-6 py-24 font-mono text-center">
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Green glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[200px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/[0.08] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Start transcribing
          <br />
          in 30 seconds.
        </h2>
        <p className="mt-4 text-xs text-gray-500">
          No account. No API key. Just Node.
        </p>

        <div className="mx-auto mt-10 inline-flex items-center gap-4 rounded-lg border border-gray-800 bg-[#0f0f0f] px-6 py-4">
          <span className="text-sm text-gray-500">$</span>
          <span className="text-sm text-white">
            npx transcribly &lt;youtube-url&gt;
          </span>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded bg-green-500 px-6 py-3 text-xs font-bold text-black transition-colors hover:bg-green-400"
          >
            View on GitHub →
          </a>
          <a
            href={`${GITHUB_URL}#readme`}
            target="_blank"
            rel="noreferrer"
            className="rounded border border-gray-700 px-6 py-3 text-xs text-gray-500 transition-colors hover:text-white"
          >
            Read the docs
          </a>
        </div>
      </div>
    </section>
  );
}

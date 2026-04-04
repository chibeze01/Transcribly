const FEATURES = [
  {
    icon: "⚡",
    title: "Zero setup",
    body: "No account. No config file. Just npx and a URL. Works anywhere Node runs.",
    snippet: "$ npx transcribly <url>",
    snippetGreen: null,
  },
  {
    icon: "∞",
    title: "Any length video",
    body: "Audio is automatically chunked and transcribed in parallel. 3-minute clip or 3-hour lecture — same command.",
    snippet: null,
    snippetGreen: "✓ chunked · parallel · unlimited",
  },
  {
    icon: "|",
    title: "Pipe-ready output",
    body: "Clean plain text to stdout. Pipe into Claude, GPT, a file, a script — whatever your workflow needs.",
    snippet: "$ transcribly <url>",
    snippetGreen: " | claude",
  },
];

export default function FeaturesSection() {
  return (
    <section className="border-t border-gray-800 bg-[#0a0a0a] px-6 py-24 font-mono">
      <div className="mx-auto max-w-5xl text-center">
        <span className="mb-4 inline-block rounded-full border border-gray-700 px-3 py-1 text-[10px] tracking-widest text-gray-500">
          WHY TRANSCRIBLY
        </span>
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Built for developers.
          <br />
          Ready for agents.
        </h2>

        <div className="mt-12 grid gap-4 text-left md:grid-cols-3">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="rounded-xl border border-gray-800 bg-[#0f0f0f] p-7"
            >
              <div className="mb-4 text-2xl text-green-400">{f.icon}</div>
              <h3 className="mb-2 text-sm font-bold text-white">{f.title}</h3>
              <p className="mb-5 text-xs leading-relaxed text-gray-500">
                {f.body}
              </p>
              <div className="rounded border border-gray-800/50 bg-[#0a0a0a] px-3 py-2 text-xs text-gray-500">
                {f.snippet && <span>{f.snippet}</span>}
                {f.snippetGreen && (
                  <span className="text-green-400">{f.snippetGreen}</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

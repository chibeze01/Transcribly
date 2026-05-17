import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { usePackageManager, getRunCmd } from "../../context/PackageManagerContext";
import ConstellationBackground from "./ConstellationBackground";

export default function FeaturesSection() {
  const { pm } = usePackageManager();
  const runCmd = getRunCmd(pm);

  const FEATURES = [
    {
      icon: "⚡",
      title: "Zero setup",
      body: `No account. No config file. Just ${runCmd} and a URL. Works on Node and Bun.`,
      snippet: `$ ${runCmd} transcribly <url>`,
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

  return (
    <section
      className="relative overflow-hidden px-6 py-24 font-mono"
      style={{
        background:
          "linear-gradient(to bottom, #000 0%, #0a0a0a 28%, #0a0a0a 70%, #000 100%)",
      }}
    >
      <ConstellationBackground />
      <div className="relative mx-auto max-w-5xl text-center">
        <ScrollReveal>
          <span className="mb-4 inline-block rounded-full border border-gray-700 bg-[#0a0a0a]/80 px-3 py-1 text-[10px] tracking-widest text-gray-500 backdrop-blur">
            WHY TRANSCRIBLY
          </span>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Built for developers.
            <br />
            Ready for agents.
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid gap-4 text-left md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.15}>
              <motion.article
                whileHover={{
                  borderColor: "rgba(40, 200, 64, 0.3)",
                  boxShadow: "0 0 40px rgba(40, 200, 64, 0.07)",
                  y: -4,
                }}
                transition={{ duration: 0.25 }}
                className="h-full rounded-xl border border-gray-800 bg-[#0f0f0f]/95 p-7 backdrop-blur-sm"
              >
                <div className="mb-4 text-2xl text-green-400">{f.icon}</div>
                <h3 className="mb-2 text-sm font-bold text-white">
                  {f.title}
                </h3>
                <p className="mb-5 text-xs leading-relaxed text-gray-500">
                  {f.body}
                </p>
                <div className="rounded border border-gray-800/50 bg-[#0a0a0a] px-3 py-2 text-xs text-gray-500">
                  {f.snippet && <span>{f.snippet}</span>}
                  {f.snippetGreen && (
                    <span className="text-green-400">{f.snippetGreen}</span>
                  )}
                </div>
              </motion.article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

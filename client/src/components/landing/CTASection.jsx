import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { usePackageManager, getRunCmd } from "../../context/PackageManagerContext";

const GITHUB_URL = "https://github.com/chibeze01/Youtube-Transcriber";

export default function CTASection() {
  const { pm, setPm } = usePackageManager();
  const runCmd = getRunCmd(pm);

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
        <ScrollReveal>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Start transcribing
            <br />
            in 30 seconds.
          </h2>
          <p className="mt-4 text-xs text-gray-500">
            One command. Your OpenAI key. That's it.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mx-auto mt-10 inline-flex flex-col items-start">
            <div className="flex">
              {['npm', 'bun'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setPm(opt)}
                  className={`relative -mb-px rounded-t-md border-x border-t px-4 py-1.5 font-mono text-xs transition-colors ${
                    pm === opt
                      ? 'border-gray-800 bg-[#0f0f0f] text-green-400'
                      : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <motion.div
              whileHover={{ scale: 1.02, borderColor: "rgba(40,200,64,0.3)" }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-4 rounded-b-lg rounded-tr-lg border border-gray-800 bg-[#0f0f0f] px-6 py-4"
            >
              <span className="text-sm text-gray-500">$</span>
              <span className="text-sm text-white">
                {runCmd} transcribly &lt;youtube-url&gt;
              </span>
            </motion.div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded bg-green-500 px-6 py-3 text-xs font-bold text-black transition-all hover:bg-green-400 hover:shadow-[0_0_30px_rgba(40,200,64,0.3)]"
            >
              View on GitHub →
            </a>
            <a
              href="https://www.npmjs.com/package/transcribly"
              target="_blank"
              rel="noreferrer"
              className="rounded border border-gray-700 px-6 py-3 text-xs text-gray-500 transition-colors hover:text-white"
            >
              Read the docs
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

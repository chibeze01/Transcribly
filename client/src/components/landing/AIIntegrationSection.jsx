import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

export default function AIIntegrationSection() {
  return (
    <section className="border-t border-gray-800 bg-[#0a0a0a] px-6 py-24 font-mono">
      <div className="mx-auto max-w-5xl text-center">
        <ScrollReveal>
          <span className="mb-4 inline-block rounded-full border border-gray-700 px-3 py-1 text-[10px] tracking-widest text-gray-500">
            AI INTEGRATION
          </span>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Give your AI
            <br />
            <span className="text-green-400">ears on YouTube.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-gray-500">
            LLMs can&rsquo;t listen to videos. Transcribly bridges the gap —
            turn any YouTube audio into text your AI can read, reason over, and
            act on.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 text-left md:grid-cols-2">
          {/* Claude Code */}
          <ScrollReveal delay={0.1}>
            <motion.div
              whileHover={{
                borderColor: "rgba(40, 200, 64, 0.3)",
                boxShadow: "0 0 40px rgba(40, 200, 64, 0.07)",
                y: -4,
              }}
              transition={{ duration: 0.25 }}
              className="h-full rounded-xl border border-gray-800 bg-[#0f0f0f] p-7"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-sm">
                  ⬡
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    Claude Code
                  </div>
                  <div className="text-[10px] text-gray-600">
                    tool call · slash command
                  </div>
                </div>
              </div>
              <p className="mb-5 text-xs leading-relaxed text-gray-500">
                Add transcribly as a shell tool in Claude Code. Now Claude can
                fetch and read any YouTube video mid-session — no copy-paste, no
                tab switching.
              </p>
              <div className="rounded-lg border border-gray-800/50 bg-[#0a0a0a] p-4">
                <div className="mb-2 text-[10px] text-gray-600">
                  ~/.claude/settings.json
                </div>
                <pre className="text-[11px] leading-loose">
                  <span className="text-gray-600">{"{"}</span>
                  {"\n"}
                  {"  "}
                  <span className="text-green-400">"tools"</span>
                  <span className="text-gray-600">: [{"{"}</span>
                  {"\n"}
                  {"    "}
                  <span className="text-green-400">"name"</span>
                  <span className="text-gray-600">: </span>
                  <span className="text-white">"transcribly"</span>
                  <span className="text-gray-600">,</span>
                  {"\n"}
                  {"    "}
                  <span className="text-green-400">"type"</span>
                  <span className="text-gray-600">: </span>
                  <span className="text-white">"bash"</span>
                  <span className="text-gray-600">,</span>
                  {"\n"}
                  {"    "}
                  <span className="text-green-400">"cmd"</span>
                  <span className="text-gray-600">: </span>
                  <span className="text-white">"npx transcribly $url"</span>
                  {"\n"}
                  {"  "}
                  <span className="text-gray-600">{"}]"}</span>
                  {"\n"}
                  <span className="text-gray-600">{"}"}</span>
                </pre>
              </div>
              <div className="mt-4 rounded border-l-2 border-green-400 border-y border-r border-y-gray-800/50 border-r-gray-800/50 bg-[#0a0a0a] p-3 text-[10px] leading-relaxed text-gray-500">
                <span className="text-green-400">claude&gt;</span>{" "}
                "Summarize this YT video for me"
                <br />
                <span className="text-gray-600">
                  → calls transcribly → reads transcript → responds
                </span>
              </div>
            </motion.div>
          </ScrollReveal>

          {/* Any AI Agent */}
          <ScrollReveal delay={0.25}>
            <motion.div
              whileHover={{
                borderColor: "rgba(40, 200, 64, 0.3)",
                boxShadow: "0 0 40px rgba(40, 200, 64, 0.07)",
                y: -4,
              }}
              transition={{ duration: 0.25 }}
              className="h-full rounded-xl border border-gray-800 bg-[#0f0f0f] p-7"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-sm">
                  ⟁
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    Any AI Agent
                  </div>
                  <div className="text-[10px] text-gray-600">
                    pipe · stdin · API
                  </div>
                </div>
              </div>
              <p className="mb-5 text-xs leading-relaxed text-gray-500">
                Stretch your agent&rsquo;s context with real video audio.
                Research pipelines, RAG ingestion, lecture summaries —
                transcribly feeds the text in.
              </p>
              <div className="rounded-lg border border-gray-800/50 bg-[#0a0a0a] p-4">
                <div className="mb-2 text-[10px] text-gray-600">
                  agent pipeline · bash
                </div>
                <pre className="text-[11px] leading-loose">
                  <span className="text-gray-600"># fetch + summarize</span>
                  {"\n"}
                  <span className="text-white">npx transcribly $URL \</span>
                  {"\n"}
                  {"  "}
                  <span className="text-white">| llm </span>
                  <span className="text-green-400">"tldr"</span>
                  {"\n\n"}
                  <span className="text-gray-600"># ingest into RAG</span>
                  {"\n"}
                  <span className="text-white">npx transcribly $URL \</span>
                  {"\n"}
                  {"  "}
                  <span className="text-white">| chunk </span>
                  <span className="text-green-400">--embed</span>
                  <span className="text-white"> --store</span>
                </pre>
              </div>
              <div className="mt-4 rounded border-l-2 border-green-400 border-y border-r border-y-gray-800/50 border-r-gray-800/50 bg-[#0a0a0a] p-3 text-[10px] leading-relaxed text-gray-500">
                <span className="text-green-400">works with</span> GPT · Claude
                · Gemini · Ollama
                <br />
                <span className="text-gray-600">→ stdout is universal</span>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

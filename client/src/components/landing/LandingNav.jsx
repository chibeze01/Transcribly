import { useState } from "react";

export default function LandingNav() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText("npm install -g transcribly")
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-800/50 bg-[#0a0a0a]/80 backdrop-blur-md px-6 py-4 font-mono sm:px-12">
      <span className="text-sm font-bold tracking-wider text-white">transcribly</span>
      <div className="flex items-center gap-6">
        <a
          href="https://github.com/chibeze01/Youtube-Transcriber#readme"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-gray-500 transition-colors hover:text-white"
        >
          docs
        </a>
        <a
          href="https://github.com/chibeze01/Youtube-Transcriber"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-gray-500 transition-colors hover:text-white"
        >
          github
        </a>
        <button
          onClick={handleCopy}
          className={`rounded border px-3 py-1 font-mono text-xs transition-colors ${
            copied
              ? "border-green-400/50 text-green-400"
              : "border-gray-700 text-gray-400 hover:text-white"
          }`}
        >
          {copied ? "copied!" : "npm install"}
        </button>
      </div>
    </nav>
  );
}

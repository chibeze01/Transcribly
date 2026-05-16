import { useEffect, useState } from "react";
import { usePackageManager, getInstallCmd } from "../../context/PackageManagerContext";

export default function LandingNav() {
  const [copied, setCopied] = useState(false);
  const { pm, setPm } = usePackageManager();
  const installCmd = getInstallCmd(pm);

  useEffect(() => {
    setCopied(false);
  }, [pm]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(installCmd)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-800/50 bg-[#0a0a0a]/80 backdrop-blur-md px-6 py-4 font-mono sm:px-12">
      <span className="text-sm font-bold tracking-wider text-white">transcribly</span>
      <div className="flex items-center gap-4">
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
        <div className="flex items-center gap-0.5 rounded border border-gray-800 bg-gray-900/40 p-0.5">
          {['npm', 'bun'].map((opt) => (
            <button
              key={opt}
              onClick={() => setPm(opt)}
              className={`rounded px-2 py-0.5 text-xs transition-colors ${
                pm === opt
                  ? 'bg-green-500/20 text-green-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className={`rounded border px-3 py-1 font-mono text-xs transition-colors ${
            copied
              ? "border-green-400/50 text-green-400"
              : "border-gray-700 text-gray-400 hover:text-white"
          }`}
        >
          {copied ? "copied!" : pm === 'bun' ? 'bun add' : 'npm install'}
        </button>
      </div>
    </nav>
  );
}

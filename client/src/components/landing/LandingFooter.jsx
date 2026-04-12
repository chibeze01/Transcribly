const GITHUB_URL = "https://github.com/chibeze01/Youtube-Transcriber";

export default function LandingFooter() {
  return (
    <footer className="flex flex-col items-center justify-between gap-4 border-t border-gray-800 px-6 py-5 font-mono sm:flex-row sm:px-12">
      <span className="text-xs text-gray-700">transcribly</span>
      <div className="flex gap-6">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] text-gray-700 transition-colors hover:text-gray-400"
        >
          github
        </a>
        <a
          href="https://www.npmjs.com/package/transcribly"
          target="_blank"
          rel="noreferrer"
          className="text-[11px] text-gray-700 transition-colors hover:text-gray-400"
        >
          npm
        </a>
        <a
          href={`${GITHUB_URL}#readme`}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] text-gray-700 transition-colors hover:text-gray-400"
        >
          docs
        </a>
      </div>
      <span className="text-[10px] text-gray-800">MIT license</span>
    </footer>
  );
}

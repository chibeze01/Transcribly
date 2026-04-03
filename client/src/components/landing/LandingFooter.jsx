import { Link } from "react-router-dom";

export default function LandingFooter() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2 text-gray-400">
          <img
            src="/transcribly_logo_hifi.png"
            alt="Transcribly"
            className="h-6 w-6 opacity-60"
          />
          <span className="text-sm font-medium">Transcribly</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-500">
          <Link to="/app" className="transition-colors hover:text-white">
            Open App
          </Link>
          <a
            href="https://github.com/chibeze01/Transcribly"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            GitHub
          </a>
        </div>

        <p className="text-xs text-gray-600">
          &copy; {new Date().getFullYear()} Transcribly
        </p>
      </div>
    </footer>
  );
}

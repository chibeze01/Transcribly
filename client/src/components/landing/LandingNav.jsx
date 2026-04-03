import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 text-white no-underline">
          <img
            src="/transcribly_logo_hifi.png"
            alt="Transcribly"
            className="h-8 w-8"
          />
          <span className="text-lg font-bold tracking-tight">TRANSCRIBLY</span>
        </Link>

        <Link to="/app">
          <Button variant="default" size="sm">
            Open App
          </Button>
        </Link>
      </div>
    </nav>
  );
}

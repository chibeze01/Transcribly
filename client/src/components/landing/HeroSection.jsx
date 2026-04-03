import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-black px-6 pt-16">
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Transcribe anything.{" "}
          <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
            Feed everything.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 sm:text-xl">
          Extract transcripts from YouTube videos and audio files. Pipe them
          straight into AI chatbots, Claude Code, or any agent workflow.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/app">
            <Button size="lg">Try It Now</Button>
          </Link>
          <a href="#ai-integration">
            <Button variant="ghost" size="lg">
              See How It Works &darr;
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

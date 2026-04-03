import { useState, useEffect, useCallback } from "react";

const STEPS = [
  { type: "input", text: "$ transcribly https://youtube.com/watch?v=dQw4w9W", delay: 60 },
  { type: "status", text: "Connecting to YouTube...", delay: 800 },
  { type: "status", text: "Extracting audio stream...", delay: 1000 },
  { type: "status", text: "Transcribing with Whisper...", delay: 1200 },
  { type: "output", text: "[00:00] We're no strangers to love", delay: 400 },
  { type: "output", text: "[00:04] You know the rules and so do I", delay: 400 },
  { type: "output", text: "[00:08] A full commitment's what I'm thinking of", delay: 400 },
  { type: "output", text: "[00:12] You wouldn't get this from any other guy", delay: 400 },
  { type: "output", text: "[00:16] ...", delay: 300 },
  { type: "done", text: "✓ Done. 1,247 words extracted in 4.2s", delay: 2000 },
];

export default function MockTerminal() {
  const [visibleLines, setVisibleLines] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const resetAnimation = useCallback(() => {
    setVisibleLines([]);
    setCurrentStep(0);
    setTypingText("");
    setIsTyping(false);
  }, []);

  // Step progression
  useEffect(() => {
    if (currentStep >= STEPS.length) {
      const timeout = setTimeout(resetAnimation, 3000);
      return () => clearTimeout(timeout);
    }

    const step = STEPS[currentStep];

    if (step.type === "input" && !isTyping) {
      // Typewriter effect for input
      setIsTyping(true);
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        charIndex++;
        setTypingText(step.text.slice(0, charIndex));
        if (charIndex >= step.text.length) {
          clearInterval(typeInterval);
          setTimeout(() => {
            setVisibleLines((prev) => [...prev, step]);
            setTypingText("");
            setIsTyping(false);
            setCurrentStep((s) => s + 1);
          }, 400);
        }
      }, step.delay);
      return () => clearInterval(typeInterval);
    }

    if (!isTyping && step.type !== "input") {
      const timeout = setTimeout(() => {
        setVisibleLines((prev) => [...prev, step]);
        setCurrentStep((s) => s + 1);
      }, step.delay);
      return () => clearTimeout(timeout);
    }
  }, [currentStep, isTyping, resetAnimation]);

  const lineColor = (type) => {
    switch (type) {
      case "input":
        return "text-green-400";
      case "status":
        return "text-yellow-400";
      case "output":
        return "text-gray-300";
      case "done":
        return "text-emerald-400 font-semibold";
      default:
        return "text-gray-400";
    }
  };

  return (
    <section className="relative bg-black px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl">
          Quick Try
        </h2>

        <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-950 shadow-2xl">
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-gray-800 bg-gray-900 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="h-3 w-3 rounded-full bg-green-500" />
            <span className="ml-3 text-xs text-gray-500">transcribly</span>
          </div>

          {/* Terminal body */}
          <div className="min-h-[280px] p-5 font-mono text-sm leading-relaxed">
            {visibleLines.map((line, i) => (
              <div key={i} className={lineColor(line.type)}>
                {line.text}
              </div>
            ))}

            {/* Currently typing line */}
            {isTyping && (
              <div className="text-green-400">
                {typingText}
                <span className="animate-pulse">▌</span>
              </div>
            )}

            {/* Blinking cursor when idle */}
            {!isTyping && currentStep < STEPS.length && visibleLines.length === 0 && (
              <div className="text-green-400">
                <span className="animate-pulse">▌</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

export const FULL_CMD = 'npx transcribly https://youtube.com/watch?v=dQw4w9WgXcQ';
export const TYPING_SPEED = 36;

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const SPINNER_INTERVAL = 80;

function buildProgressBar(pct) {
  const filled = Math.floor(pct / 10);
  const empty = 10 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

export default function MockTerminal() {
  const [phase, setPhase] = useState('typing');
  const [typedCount, setTypedCount] = useState(0);
  const [spinnerFrame, setSpinnerFrame] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showPipe, setShowPipe] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const timers = useRef([]);

  const clearAllTimers = useCallback(() => {
    timers.current.forEach((id) => {
      clearTimeout(id);
      clearInterval(id);
    });
    timers.current = [];
  }, []);

  const addTimeout = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  const addInterval = useCallback((fn, ms) => {
    const id = setInterval(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  const removeTimer = useCallback((id) => {
    timers.current = timers.current.filter((t) => t !== id);
    clearTimeout(id);
    clearInterval(id);
  }, []);

  const runDemo = useCallback(() => {
    clearAllTimers();
    setPhase('typing');
    setTypedCount(0);
    setSpinnerFrame(0);
    setProgress(0);
    setShowResult(false);
    setShowPipe(false);
    setShowPrompt(false);

    // Phase 1: initial delay then start typing
    addTimeout(() => {
      let count = 0;
      const typingId = addInterval(() => {
        count += 1;
        setTypedCount(count);
        if (count >= FULL_CMD.length) {
          removeTimer(typingId);

          // Small pause after typing before fetching phase
          addTimeout(() => {
            setPhase('fetching');
            let frame = 0;
            const spinFetch = addInterval(() => {
              frame = (frame + 1) % SPINNER_FRAMES.length;
              setSpinnerFrame(frame);
            }, SPINNER_INTERVAL);

            // Fetching lasts 1400ms then chunking
            addTimeout(() => {
              removeTimer(spinFetch);
              setPhase('chunking');
              let frame2 = 0;
              const spinChunk = addInterval(() => {
                frame2 = (frame2 + 1) % SPINNER_FRAMES.length;
                setSpinnerFrame(frame2);
              }, SPINNER_INTERVAL);

              // Chunking lasts 1200ms then transcribing
              addTimeout(() => {
                removeTimer(spinChunk);
                setPhase('transcribing');
                let pct = 0;
                let frame3 = 0;
                const spinTranscribe = addInterval(() => {
                  frame3 = (frame3 + 1) % SPINNER_FRAMES.length;
                  setSpinnerFrame(frame3);
                }, SPINNER_INTERVAL);

                const progressId = addInterval(() => {
                  pct += 2;
                  setProgress(pct);
                  if (pct >= 100) {
                    removeTimer(progressId);
                    removeTimer(spinTranscribe);

                    // Done phase
                    addTimeout(() => {
                      setPhase('done');

                      // Show result block after brief pause
                      addTimeout(() => {
                        setShowResult(true);

                        // Show pipe hint
                        addTimeout(() => {
                          setShowPipe(true);

                          // Show final prompt
                          addTimeout(() => {
                            setShowPrompt(true);
                            setPhase('prompt');
                          }, 800);
                        }, 1400);
                      }, 500);
                    }, 400);
                  }
                }, 60);
              }, 1200);
            }, 1400);
          }, 200);
        }
      }, TYPING_SPEED);
    }, 600);
  }, [clearAllTimers, addTimeout, addInterval, removeTimer]);

  // Restart animation when section scrolls into view
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runDemo();
        } else {
          clearAllTimers();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      clearAllTimers();
    };
  }, [runDemo, clearAllTimers]);

  const typedCmd = FULL_CMD.slice(0, typedCount);
  const isTypingPhase = phase === 'typing';
  const spinnerChar = SPINNER_FRAMES[spinnerFrame];

  return (
    <section ref={sectionRef} className="relative bg-black px-6 py-24" id="demo">
      <div className="mx-auto max-w-3xl">
        {/* Section label */}
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-green-400">
          QUICK TRY
        </p>

        {/* Heading */}
        <h2 className="mb-4 text-center text-3xl font-bold text-white sm:text-4xl">
          See it in action
        </h2>

        {/* Subheading */}
        <p className="mb-10 text-center text-gray-400">
          No signup. No install. Just run it.
        </p>

        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="overflow-hidden rounded-xl border border-gray-800 bg-gray-950 shadow-2xl">
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-gray-800 bg-gray-900 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="h-3 w-3 rounded-full bg-green-500" />
            <span className="ml-auto text-xs text-gray-500">bash — 80×24</span>
          </div>

          {/* Terminal body */}
          <div className="min-h-[320px] p-5 font-mono text-sm leading-relaxed">
            {/* Command line — visible once typing starts */}
            {typedCount > 0 && (
              <div className="text-green-400">
                <span className="text-gray-500">❯ </span>
                {typedCmd}
                {isTypingPhase && (
                  <span className="animate-pulse">▊</span>
                )}
              </div>
            )}

            {/* Single status line — updates in place */}
            {(phase === 'fetching' || phase === 'chunking') && (
              <div className="mt-1">
                <span className="text-yellow-400">{spinnerChar} </span>
                <span className="text-gray-400">
                  {phase === 'fetching'
                    ? 'Fetching audio from YouTube...'
                    : 'Chunking audio into segments...'}
                </span>
              </div>
            )}

            {phase === 'transcribing' && (
              <div className="mt-1">
                <span className="text-yellow-400">{spinnerChar} </span>
                <span className="text-gray-400">Transcribing </span>
                <span className="text-green-400">[{buildProgressBar(progress)}]</span>
                <span className="text-gray-400"> {progress}%</span>
              </div>
            )}

            {(phase === 'done' || phase === 'result' || phase === 'pipe' || phase === 'prompt') && (
              <div className="mt-1 text-green-400">
                <span>✓ </span>
                <span>Done</span>
                <span className="text-gray-500"> in </span>
                <span>4.2s</span>
              </div>
            )}

            {/* Result block */}
            {showResult && (
              <div className="mt-3 text-gray-400">
                <div className="text-gray-600">───────────────────────────────────────────</div>
                <div>
                  <span className="text-gray-500">video  </span>
                  Never Gonna Give You Up (Official Music Video)
                </div>
                <div>
                  <span className="text-gray-500">duration  </span>
                  3:33
                  <span className="text-gray-500">{'     '}words  </span>
                  312
                </div>
                <div className="text-gray-600">───────────────────────────────────────────</div>
                <div className="mt-1 italic text-gray-300">
                  &ldquo;We&rsquo;re no strangers to love, you know the rules
                </div>
                <div className="italic text-gray-300">
                  and so do I. A full commitment&rsquo;s what I&rsquo;m thinking of...&rdquo;
                </div>
                <div className="text-gray-500">[...312 words piped to stdout]</div>
              </div>
            )}

            {/* Pipe hint */}
            {showPipe && (
              <div className="mt-4">
                <div className="text-gray-300">
                  <span className="text-gray-500">❯ </span>
                  npx transcribly https://...{' '}
                  <span className="text-yellow-400">| claude &quot;summarize this&quot;</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">↑ pipe it anywhere</div>
              </div>
            )}

            {/* Bottom prompt cursor */}
            {showPrompt && (
              <div className="mt-3 text-green-400">
                <span className="text-gray-500">❯ </span>
                <span className="animate-pulse">▊</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Replay button */}
        <div className="mt-4 text-center">
          <button
            onClick={runDemo}
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            ↺ replay
          </button>
        </div>
      </div>
    </section>
  );
}

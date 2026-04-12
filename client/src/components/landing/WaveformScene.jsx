import { useEffect, useRef } from "react";

const BAR_COUNT = 32;
const BAR_WIDTH = 4;
const BAR_GAP = 6;
const GREEN = "#28c840";
const PARTICLE_COUNT = 60;

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default function WaveformScene() {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Particles
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: randomBetween(0.5, 1.5),
      speed: randomBetween(0.0002, 0.0008),
      drift: randomBetween(-0.0003, 0.0003),
      alpha: randomBetween(0.1, 0.4),
    }));

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener("resize", resize);

    let running = true;

    function draw(time) {
      if (!running) return;
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      // ── Particles ──
      for (const p of particles) {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -0.02) {
          p.y = 1.02;
          p.x = Math.random();
        }
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(40, 200, 64, ${p.alpha})`;
        ctx.fill();
      }

      // ── Waveform bars ──
      const totalWidth = BAR_COUNT * (BAR_WIDTH + BAR_GAP) - BAR_GAP;
      const startX = (width - totalWidth) / 2;
      const baseY = height * 0.55;
      const maxBarHeight = height * 0.35;
      const t = time * 0.001;

      for (let i = 0; i < BAR_COUNT; i++) {
        const x = startX + i * (BAR_WIDTH + BAR_GAP);

        // Multi-frequency height
        const h =
          0.3 +
          Math.sin(t * 2.0 + i * 0.35) * 0.25 +
          Math.sin(t * 1.3 + i * 0.6) * 0.2 +
          Math.sin(t * 0.7 + i * 0.15) * 0.15;
        const barHeight = Math.max(4, h * maxBarHeight);

        // Glow
        ctx.shadowBlur = 12;
        ctx.shadowColor = GREEN;

        // Bar gradient
        const grad = ctx.createLinearGradient(x, baseY, x, baseY - barHeight);
        grad.addColorStop(0, "rgba(40, 200, 64, 0.6)");
        grad.addColorStop(1, "rgba(40, 200, 64, 0.15)");
        ctx.fillStyle = grad;

        // Round-topped bar
        const r = Math.min(BAR_WIDTH / 2, 2);
        ctx.beginPath();
        ctx.moveTo(x, baseY);
        ctx.lineTo(x, baseY - barHeight + r);
        ctx.quadraticCurveTo(x, baseY - barHeight, x + r, baseY - barHeight);
        ctx.lineTo(x + BAR_WIDTH - r, baseY - barHeight);
        ctx.quadraticCurveTo(
          x + BAR_WIDTH,
          baseY - barHeight,
          x + BAR_WIDTH,
          baseY - barHeight + r
        );
        ctx.lineTo(x + BAR_WIDTH, baseY);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;
      }

      frameRef.current = requestAnimationFrame(draw);
    }

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-25"
      aria-hidden="true"
    />
  );
}

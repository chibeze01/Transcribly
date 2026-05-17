import { useEffect, useRef } from "react";

export default function DeepSpaceBackground({
  starCount = 140,
  color = "180,220,200",
  fadeTop = true,
  fadeBottom = true,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let stars = [];
    let raf;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    stars = Array.from({ length: starCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.4 + Math.random() * 1.4,
      base: 0.15 + Math.random() * 0.55,
      twinkleSpeed: 0.0004 + Math.random() * 0.0012,
      phase: Math.random() * Math.PI * 2,
      bright: Math.random() < 0.08,
    }));

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const tw = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.phase);
        const alpha = s.base * (0.5 + tw * 0.5);
        const r = s.r * (s.bright ? 1.6 : 1);
        const px = s.x * w;
        const py = s.y * h;
        if (s.bright) {
          const g = ctx.createRadialGradient(px, py, 0, px, py, r * 6);
          g.addColorStop(0, `rgba(${color},${alpha * 0.6})`);
          g.addColorStop(1, `rgba(${color},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(px, py, r * 6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(${color},${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [starCount, color]);

  const stops = [];
  if (fadeTop) stops.push("#000 0%", "transparent 18%");
  else stops.push("transparent 0%");
  if (fadeBottom) stops.push("transparent 80%", "#000 100%");
  else stops.push("transparent 100%");

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to bottom, ${stops.join(", ")})` }}
      />
    </div>
  );
}

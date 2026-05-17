import { useEffect, useRef } from "react";

export default function CodeRainBackground({
  opacity = 0.3,
  density = 1,
  speed = 1,
  color = "74,222,128",
  vignette = true,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const fontSize = 14;
    const chars = "01{}[]()<>/\\=+-*;:&|!?".split("");
    let w = 0;
    let h = 0;
    let columns = 0;
    let drops = [];
    let active = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      columns = Math.floor(w / fontSize);
      drops = Array(columns).fill(0).map(() => Math.random() * -h);
      active = Array(columns).fill(0).map(() => Math.random() < density);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf;
    const draw = () => {
      ctx.fillStyle = "rgba(10,10,10,0.08)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = `rgba(${color},0.35)`;
      ctx.font = `${fontSize}px JetBrains Mono, ui-monospace, monospace`;
      for (let i = 0; i < columns; i++) {
        if (!active[i]) continue;
        const c = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(c, i * fontSize, drops[i]);
        if (drops[i] > h && Math.random() > 0.985) drops[i] = 0;
        drops[i] += fontSize * 0.4 * speed;
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [density, speed, color]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ opacity }}
      />
      {vignette && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 60%, transparent 0%, rgba(10,10,10,0.85) 70%, #0a0a0a 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, #0a0a0a 0%, transparent 14%, transparent 86%, #0a0a0a 100%)",
            }}
          />
        </>
      )}
    </div>
  );
}

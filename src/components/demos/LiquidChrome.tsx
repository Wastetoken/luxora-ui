import { useEffect, useRef } from "react";

const LiquidChrome = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (time: number) => {
      const w = canvas.width;
      const h = canvas.height;
      const t = time * 0.001;

      for (let x = 0; x < w; x += 4) {
        for (let y = 0; y < h; y += 4) {
          const nx = x / w;
          const ny = y / h;
          const v1 = Math.sin(nx * 6 + t * 1.2) * Math.cos(ny * 4 + t * 0.8);
          const v2 = Math.sin((nx + ny) * 5 + t) * 0.5;
          const v3 = Math.cos(nx * 3 - ny * 7 + t * 1.5) * 0.3;
          const value = (v1 + v2 + v3 + 1) / 2;

          const r = Math.floor(180 + value * 75);
          const g = Math.floor(180 + value * 75);
          const b = Math.floor(200 + value * 55);

          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(x, y, 4, 4);
        }
      }
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[400px] relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ imageRendering: "auto" }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className="text-5xl font-bold mix-blend-difference" style={{ color: "white" }}>
          LIQUID CHROME
        </h2>
      </div>
    </div>
  );
};

export default LiquidChrome;

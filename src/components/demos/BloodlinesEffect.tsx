import { useEffect, useRef } from "react";

const BloodlinesEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;

    const lines: { points: { x: number; y: number }[]; speed: number; width: number; hue: number }[] = [];
    const w = canvas.width;
    const h = canvas.height;

    for (let i = 0; i < 12; i++) {
      const pts = [];
      const segments = 80;
      const startY = Math.random() * h;
      for (let j = 0; j <= segments; j++) {
        pts.push({ x: (j / segments) * w, y: startY + Math.sin(j * 0.3) * 50 });
      }
      lines.push({
        points: pts,
        speed: 0.5 + Math.random() * 2,
        width: 1 + Math.random() * 3,
        hue: 350 + Math.random() * 20,
      });
    }

    let time = 0;
    const draw = () => {
      ctx.fillStyle = "rgba(10, 5, 5, 0.08)";
      ctx.fillRect(0, 0, w, h);

      lines.forEach((line) => {
        ctx.beginPath();
        line.points.forEach((pt, i) => {
          pt.y += Math.sin(time * 0.02 * line.speed + i * 0.15) * 0.8;
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.strokeStyle = `hsla(${line.hue}, 80%, 45%, 0.6)`;
        ctx.lineWidth = line.width;
        ctx.shadowColor = `hsla(${line.hue}, 90%, 50%, 0.5)`;
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      time++;
      animId = requestAnimationFrame(draw);
    };

    ctx.fillStyle = "rgb(10, 5, 5)";
    ctx.fillRect(0, 0, w, h);
    animId = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="w-full h-full min-h-[400px]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default BloodlinesEffect;

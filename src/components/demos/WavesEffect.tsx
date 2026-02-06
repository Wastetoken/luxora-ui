import { useEffect, useRef } from "react";

const WavesEffect = () => {
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

    const waves = [
      { amplitude: 40, frequency: 0.02, speed: 0.03, color: "hsla(38, 92%, 50%, 0.3)", offset: 0 },
      { amplitude: 30, frequency: 0.015, speed: 0.02, color: "hsla(340, 80%, 55%, 0.25)", offset: 50 },
      { amplitude: 50, frequency: 0.01, speed: 0.015, color: "hsla(260, 70%, 55%, 0.2)", offset: 100 },
      { amplitude: 25, frequency: 0.025, speed: 0.04, color: "hsla(180, 70%, 50%, 0.2)", offset: -30 },
    ];

    let time = 0;
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 2) {
          const y =
            h * 0.5 +
            wave.offset +
            Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude +
            Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 1.5) * wave.amplitude * 0.5;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = wave.color;
        ctx.fill();
      });

      time++;
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[400px] bg-background">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default WavesEffect;

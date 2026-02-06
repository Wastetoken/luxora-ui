import { useEffect, useRef, useState } from "react";

// Circle Animations Collection 1
export const CircleAnimations1 = () => {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-background gap-12 flex-wrap p-8">
      <style>{`
        @keyframes ca-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.3; } }
        @keyframes ca-orbit { from { transform: rotate(0deg) translateX(50px) rotate(0deg); } to { transform: rotate(360deg) translateX(50px) rotate(-360deg); } }
        @keyframes ca-pendulum { 0%, 100% { transform: rotate(-30deg); } 50% { transform: rotate(30deg); } }
        @keyframes ca-ring-expand { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
      `}</style>
      {/* Radial Pulse */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        {[0, 1, 2].map(i => (
          <div key={i} className="absolute rounded-full" style={{
            width: 40, height: 40,
            border: "2px solid hsl(38, 92%, 50%)",
            animation: `ca-pulse 2s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }} />
        ))}
      </div>
      {/* Orbital */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full" style={{ background: "hsl(38, 92%, 50%)" }} />
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="absolute" style={{
            width: 8, height: 8, borderRadius: "50%",
            background: `hsl(${38 + i * 30}, 80%, 55%)`,
            animation: `ca-orbit ${3 + i * 0.5}s linear infinite`,
            animationDelay: `${i * 0.5}s`,
          }} />
        ))}
      </div>
      {/* Concentric Rings */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="absolute rounded-full" style={{
            width: 20, height: 20,
            border: "1px solid hsl(260, 70%, 55%)",
            animation: `ca-ring-expand 2s ease-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }} />
        ))}
      </div>
    </div>
  );
};

// Circle Animations Collection 3
export const CircleAnimations3 = () => {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-background gap-16 p-8">
      <style>{`
        @keyframes ca3-breathe { 0%, 100% { transform: scale(0.8); opacity: 0.4; } 50% { transform: scale(1.2); opacity: 1; } }
        @keyframes ca3-chase { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes ca3-wave { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
      `}</style>
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-20 h-20">
          {[0,1,2].map(i => (
            <div key={i} className="absolute inset-0 rounded-full" style={{
              border: `2px solid hsl(${180 + i*40}, 70%, 55%)`,
              animation: `ca3-breathe 2s ease-in-out infinite`,
              animationDelay: `${i*0.3}s`,
              transform: `scale(${0.6 + i*0.2})`,
            }} />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">Breathe</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-20 h-20" style={{ animation: "ca3-chase 4s linear infinite" }}>
          {[0,1,2,3,4,5].map(i => (
            <div key={i} className="absolute" style={{
              width: 8, height: 8, borderRadius: "50%",
              background: `hsl(${38 + i*20}, 85%, 55%)`,
              top: 36 + 30 * Math.sin((i * Math.PI * 2) / 6),
              left: 36 + 30 * Math.cos((i * Math.PI * 2) / 6),
            }} />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">Chase</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-2 items-end h-20">
          {[0,1,2,3,4,5,6].map(i => (
            <div key={i} className="rounded-full" style={{
              width: 8, height: 8,
              background: `hsl(${340 + i*10}, 75%, 55%)`,
              animation: `ca3-wave 1.5s ease-in-out infinite`,
              animationDelay: `${i*0.1}s`,
            }} />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">Wave</span>
      </div>
    </div>
  );
};

// Circle Animations Collection 4
export const CircleAnimations4 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 400;
    let animId: number;
    let t = 0;

    const draw = () => {
      ctx.fillStyle = "hsl(225, 14%, 7%)";
      ctx.fillRect(0, 0, 600, 400);

      // Pattern 1: Spiral
      for (let i = 0; i < 60; i++) {
        const angle = (i * 0.3) + t * 0.02;
        const r = i * 2.5;
        const x = 150 + Math.cos(angle) * r;
        const y = 200 + Math.sin(angle) * r;
        const size = 2 + Math.sin(t * 0.05 + i * 0.2) * 1.5;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${38 + i * 2}, 85%, 55%, ${0.3 + Math.sin(t * 0.03 + i) * 0.3})`;
        ctx.fill();
      }

      // Pattern 2: Lissajous
      ctx.beginPath();
      for (let i = 0; i < 200; i++) {
        const p = i / 200 * Math.PI * 2;
        const x = 450 + Math.sin(p * 3 + t * 0.02) * 80;
        const y = 200 + Math.sin(p * 2 + t * 0.015) * 80;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "hsla(260, 70%, 60%, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Center dots
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + t * 0.01;
        const x = 300 + Math.cos(angle) * (40 + Math.sin(t * 0.03) * 15);
        const y = 200 + Math.sin(angle) * (40 + Math.cos(t * 0.03) * 15);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${340 + i * 10}, 80%, 55%, 0.7)`;
        ctx.fill();
      }

      t++;
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [mounted]);

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-background">
      <canvas ref={canvasRef} className="max-w-full" style={{ width: 600, height: 400 }} />
    </div>
  );
};

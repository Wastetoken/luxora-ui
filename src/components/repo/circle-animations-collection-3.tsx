"use client";

import React, { useRef, useEffect } from "react";

// --- ANIMATION LOGIC ---
const MONOCHROME_FILL = (opacity: number) => `rgba(255, 255, 255, ${Math.max(0, Math.min(1, opacity))})`;

type AnimateFunction = (timestamp: number) => void;
type SetupFunction = (ctx: CanvasRenderingContext2D, width: number, height: number) => AnimateFunction;

const animationLogic = {
    pulseWave: ((ctx, CANVAS_WIDTH, CANVAS_HEIGHT) => {
        const centerX = CANVAS_WIDTH / 2, centerY = CANVAS_HEIGHT / 2;
        let time = 0, lastTime = 0;
        const dotRings = [{ radius: 15, count: 6 }, { radius: 30, count: 12 }, { radius: 45, count: 18 }, { radius: 60, count: 24 }, { radius: 75, count: 30 }];
        return (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            const dT = timestamp - lastTime; lastTime = timestamp; time += dT * 0.001;
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.beginPath(); ctx.arc(centerX, centerY, 2, 0, Math.PI * 2); ctx.fillStyle = MONOCHROME_FILL(0.9); ctx.fill();
            dotRings.forEach((ring, rIdx) => {
                for (let i = 0; i < ring.count; i++) {
                    const angle = (i / ring.count) * Math.PI * 2, p = Math.sin(time * 2 - rIdx * 0.4) * 3;
                    const x = centerX + Math.cos(angle) * (ring.radius + p), y = centerY + Math.sin(angle) * (ring.radius + p);
                    const o = 0.4 + ((Math.sin(time * 2 - rIdx * 0.4 + i * 0.2) + 1) / 2) * 0.6;
                    ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fillStyle = MONOCHROME_FILL(o); ctx.fill();
                }
            });
        };
    }) as SetupFunction,
    pulseWaveShockwave: ((ctx, CANVAS_WIDTH, CANVAS_HEIGHT) => {
        const centerX = CANVAS_WIDTH / 2, centerY = CANVAS_HEIGHT / 2;
        let time = 0, lastTime = 0;
        const dotRings = [{ radius: 15, count: 6 }, { radius: 30, count: 12 }, { radius: 45, count: 18 }, { radius: 60, count: 24 }, { radius: 75, count: 30 }];
        const waveSpeed = 30, waveThickness = 40, maxR = dotRings[dotRings.length - 1].radius + waveThickness;
        const rotMag = 0.15, rotSpeed = 3;
        return (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            const dT = timestamp - lastTime; lastTime = timestamp; time += dT * 0.001;
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.beginPath(); ctx.arc(centerX, centerY, 1.5, 0, Math.PI * 2); ctx.fillStyle = MONOCHROME_FILL(0.8); ctx.fill();
            const waveFront = (time * waveSpeed) % maxR;
            dotRings.forEach(ring => {
                for (let i = 0; i < ring.count; i++) {
                    const bAngle = (i / ring.count) * Math.PI * 2, dist = ring.radius - waveFront;
                    let pF = 0; if (Math.abs(dist) < waveThickness / 2) pF = Math.max(0, Math.cos((dist / (waveThickness / 2)) * (Math.PI / 2)));
                    let angle = bAngle; if (pF > 0.01) angle += pF * Math.sin(time * rotSpeed + i * 0.5) * rotMag;
                    const s = 1.5 + pF * 1.8, o = 0.2 + pF * 0.7;
                    const x = centerX + Math.cos(angle) * ring.radius, y = centerY + Math.sin(angle) * ring.radius;
                    ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fillStyle = MONOCHROME_FILL(o); ctx.fill();
                }
            });
        };
    }) as SetupFunction,
    pulseWaveSpiral: ((ctx, CANVAS_WIDTH, CANVAS_HEIGHT) => {
        const centerX = CANVAS_WIDTH / 2, centerY = CANVAS_HEIGHT / 2;
        let time = 0, lastTime = 0;
        const dotRings = [{ radius: 15, count: 6 }, { radius: 30, count: 12 }, { radius: 45, count: 18 }, { radius: 60, count: 24 }, { radius: 75, count: 30 }];
        return (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            const dT = timestamp - lastTime; lastTime = timestamp; time += dT * 0.001;
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.beginPath(); ctx.arc(centerX, centerY, 2, 0, Math.PI * 2); ctx.fillStyle = MONOCHROME_FILL(0.9); ctx.fill();
            dotRings.forEach((ring, rIdx) => {
                const rotSpeed = 0.2 + rIdx * 0.03;
                for (let i = 0; i < ring.count; i++) {
                    const bAngle = (i / ring.count) * Math.PI * 2, spiralOffset = (ring.radius / 15) * 0.4;
                    const angle = bAngle + time * rotSpeed + spiralOffset;
                    const pPhase = time * 1.5 - ring.radius / 20 + (i / ring.count) * Math.PI, pRadius = Math.sin(pPhase) * 3;
                    const cRadius = ring.radius + pRadius;
                    const x = centerX + Math.cos(angle) * cRadius, y = centerY + Math.sin(angle) * cRadius;
                    const o = 0.3 + ((Math.sin(pPhase - Math.PI / 4) + 1) / 2) * 0.7;
                    ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fillStyle = MONOCHROME_FILL(o); ctx.fill();
                }
            });
        };
    }) as SetupFunction,
};

// --- REACT COMPONENTS ---

const CANVAS_WIDTH = 180;
const CANVAS_HEIGHT = 180;

type AnimationId = keyof typeof animationLogic;

const ANIMATIONS: { id: AnimationId; title: string }[] = [
  { id: "pulseWave", title: "Pulse Wave" },
  { id: "pulseWaveShockwave", title: "Shockwave" },
  { id: "pulseWaveSpiral", title: "Spiral" },
];

const useCanvasAnimation = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  animationId: AnimationId
) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    let animationFrameId: number;
    const animateFunction = animationLogic[animationId];

    if (animateFunction) {
      const render = animateFunction(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
      const loop = (timestamp: number) => {
        render(timestamp);
        animationFrameId = requestAnimationFrame(loop);
      };
      animationFrameId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef, animationId]);
};

const Corner = ({ className }: { className: string }) => (
  <div className={`corner absolute z-10 h-4 w-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${className}`}>
    <svg width="16" height="16" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <polygon points="448,224 288,224 288,64 224,64 224,224 64,224 64,288 224,288 224,448 288,448 288,288 448,288" />
    </svg>
  </div>
);

const AnimationCard: React.FC<{ id: AnimationId; title:string }> = ({ id, title }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasAnimation(canvasRef, id);

  return (
    <div className="group relative flex h-[220px] w-[220px] flex-col items-center overflow-visible border border-white/10 bg-black/50 p-2.5 transition-colors duration-300 hover:border-white/30">
      <Corner className="top-[-8px] left-[-8px]" />
      <Corner className="top-[-8px] right-[-8px] rotate-90" />
      <Corner className="bottom-[-8px] left-[-8px] -rotate-90" />
      <Corner className="bottom-[-8px] right-[-8px] rotate-180" />
      
      <div className="mb-[10px] text-center text-xs uppercase tracking-[0.5px] text-white/70">{title}</div>
      <div className="relative flex h-[180px] w-[180px] items-center justify-center">
        <canvas ref={canvasRef} className="absolute left-0 top-0"></canvas>
      </div>
    </div>
  );
};

export const CircleAnimationsGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-neutral-900">
      {ANIMATIONS.map((anim) => (
        <AnimationCard key={anim.id} id={anim.id} title={anim.title} />
      ))}
    </div>
  );
};
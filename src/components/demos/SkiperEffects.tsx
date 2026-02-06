import { useEffect, useRef, useState } from "react";

// Helper to create unique effects per Skiper
const createEffect = (
  type: string,
  colors: string[],
  params: { count?: number; speed?: number; size?: number; label?: string }
) => {
  const { count = 8, speed = 3, size = 40, label = "" } = params;

  switch (type) {
    case "orbit":
      return () => (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-background">
          <style>{`
            @keyframes sk-orbit-${speed} { from { transform: rotate(0deg) translateX(${size * 2}px) rotate(0deg); } to { transform: rotate(360deg) translateX(${size * 2}px) rotate(-360deg); } }
          `}</style>
          <div className="relative" style={{ width: size * 5, height: size * 5 }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{ background: colors[0] }} />
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="absolute top-1/2 left-1/2" style={{
                width: size * 0.3, height: size * 0.3, borderRadius: "50%",
                background: colors[i % colors.length],
                animation: `sk-orbit-${speed} ${speed + i * 0.5}s linear infinite`,
                animationDelay: `${(i / count) * speed}s`,
                marginLeft: -(size * 0.15), marginTop: -(size * 0.15),
              }} />
            ))}
          </div>
        </div>
      );

    case "bars":
      return () => (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-background">
          <style>{`
            @keyframes sk-bar { 0%, 100% { height: 20%; } 50% { height: 80%; } }
          `}</style>
          <div className="flex items-end gap-1" style={{ height: size * 4 }}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="rounded-t" style={{
                width: size * 0.4,
                background: `linear-gradient(to top, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})`,
                animation: `sk-bar ${speed * 0.3}s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
                height: "50%",
              }} />
            ))}
          </div>
        </div>
      );

    case "gradient":
      return () => (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center">
          <style>{`
            @keyframes sk-grad { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          `}</style>
          <div className="w-full h-full rounded-lg" style={{
            background: `linear-gradient(135deg, ${colors.join(", ")})`,
            backgroundSize: "400% 400%",
            animation: `sk-grad ${speed}s ease infinite`,
          }}>
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl font-bold mix-blend-overlay" style={{ color: "white" }}>{label}</span>
            </div>
          </div>
        </div>
      );

    case "flip":
      return () => {
        const [flipped, setFlipped] = useState(false);
        return (
          <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-background" style={{ perspective: "1000px" }}>
            <div
              className="cursor-pointer transition-transform duration-700"
              style={{
                width: size * 5, height: size * 4, transformStyle: "preserve-3d",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
              }}
              onClick={() => setFlipped(!flipped)}
            >
              <div className="absolute inset-0 rounded-xl flex items-center justify-center" style={{
                background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                backfaceVisibility: "hidden",
              }}>
                <span className="text-2xl font-bold" style={{ color: "white" }}>Front</span>
              </div>
              <div className="absolute inset-0 rounded-xl flex items-center justify-center" style={{
                background: `linear-gradient(135deg, ${colors[1]}, ${colors[2] || colors[0]})`,
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}>
                <span className="text-2xl font-bold" style={{ color: "white" }}>Back</span>
              </div>
            </div>
            <p className="absolute bottom-8 text-xs text-muted-foreground">Click to flip</p>
          </div>
        );
      };

    case "wave":
      return () => (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-background">
          <svg viewBox="0 0 400 200" className="w-full max-w-md">
            {[0, 1, 2].map((layer) => (
              <path
                key={layer}
                fill="none"
                stroke={colors[layer % colors.length]}
                strokeWidth="2"
                opacity={0.5 + layer * 0.15}
                d={`M 0 ${100 + layer * 20} ${Array.from({ length: 20 }).map((_, i) =>
                  `Q ${i * 20 + 10} ${100 + layer * 20 + Math.sin(i + layer) * 30}, ${(i + 1) * 20} ${100 + layer * 20}`
                ).join(" ")}`}
              >
                <animate attributeName="d"
                  dur={`${speed + layer}s`}
                  repeatCount="indefinite"
                  values={`M 0 ${100 + layer * 20} ${Array.from({ length: 20 }).map((_, i) =>
                    `Q ${i * 20 + 10} ${100 + layer * 20 + Math.sin(i + layer) * 30}, ${(i + 1) * 20} ${100 + layer * 20}`
                  ).join(" ")};M 0 ${100 + layer * 20} ${Array.from({ length: 20 }).map((_, i) =>
                    `Q ${i * 20 + 10} ${100 + layer * 20 - Math.sin(i + layer) * 30}, ${(i + 1) * 20} ${100 + layer * 20}`
                  ).join(" ")};M 0 ${100 + layer * 20} ${Array.from({ length: 20 }).map((_, i) =>
                    `Q ${i * 20 + 10} ${100 + layer * 20 + Math.sin(i + layer) * 30}, ${(i + 1) * 20} ${100 + layer * 20}`
                  ).join(" ")}`}
                />
              </path>
            ))}
          </svg>
        </div>
      );

    case "grid":
      return () => (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-background">
          <style>{`
            @keyframes sk-dot-pulse { 0%, 100% { transform: scale(0.5); opacity: 0.3; } 50% { transform: scale(1.2); opacity: 1; } }
          `}</style>
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(count))}, 1fr)` }}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="rounded-full" style={{
                width: size * 0.4, height: size * 0.4,
                background: colors[i % colors.length],
                animation: `sk-dot-pulse ${speed * 0.5}s ease-in-out infinite`,
                animationDelay: `${(i * 0.15)}s`,
              }} />
            ))}
          </div>
        </div>
      );

    case "rings":
      return () => (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-background">
          <style>{`
            @keyframes sk-ring { 0% { transform: scale(0.3); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
          `}</style>
          <div className="relative" style={{ width: size * 5, height: size * 5 }}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="absolute inset-0 m-auto rounded-full" style={{
                width: size * 2, height: size * 2,
                border: `2px solid ${colors[i % colors.length]}`,
                animation: `sk-ring ${speed}s ease-out infinite`,
                animationDelay: `${(i / count) * speed}s`,
              }} />
            ))}
          </div>
        </div>
      );

    case "morph":
      return () => (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-background">
          <style>{`
            @keyframes sk-morph {
              0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: rotate(0deg); }
              33% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; transform: rotate(120deg); }
              66% { border-radius: 50% 60% 30% 60% / 30% 50% 70% 60%; transform: rotate(240deg); }
            }
          `}</style>
          <div style={{
            width: size * 4, height: size * 4,
            background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
            animation: `sk-morph ${speed}s ease-in-out infinite`,
          }} />
        </div>
      );

    case "cards":
      return () => (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-background">
          <style>{`
            @keyframes sk-card-float { 0%, 100% { transform: translateY(0) rotate(var(--rot)); } 50% { transform: translateY(-10px) rotate(var(--rot)); } }
          `}</style>
          <div className="relative" style={{ width: size * 6, height: size * 4 }}>
            {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
              <div key={i} className="absolute rounded-xl" style={{
                width: size * 4, height: size * 3,
                left: i * 15, top: i * 8,
                background: `linear-gradient(135deg, ${colors[i % colors.length]}33, ${colors[(i + 1) % colors.length]}33)`,
                border: `1px solid ${colors[i % colors.length]}44`,
                ["--rot" as string]: `${(i - 2) * 3}deg`,
                animation: `sk-card-float ${speed}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
                zIndex: i,
              }} />
            ))}
          </div>
        </div>
      );

    case "interactive":
      return () => {
        const [pos, setPos] = useState({ x: 0, y: 0 });
        const ref = useRef<HTMLDivElement>(null);
        return (
          <div
            ref={ref}
            className="w-full h-full min-h-[400px] flex items-center justify-center bg-background relative cursor-crosshair"
            onMouseMove={(e) => {
              if (!ref.current) return;
              const rect = ref.current.getBoundingClientRect();
              setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
          >
            {colors.map((color, i) => (
              <div key={i} className="absolute rounded-full pointer-events-none transition-all duration-300" style={{
                width: size * (2 - i * 0.3), height: size * (2 - i * 0.3),
                background: `${color}33`,
                border: `1px solid ${color}66`,
                left: pos.x - size * (1 - i * 0.15),
                top: pos.y - size * (1 - i * 0.15),
                transitionDelay: `${i * 50}ms`,
              }} />
            ))}
            <p className="text-xs text-muted-foreground pointer-events-none">Move your cursor</p>
          </div>
        );
      };

    case "text":
      return () => (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-background">
          <style>{`
            @keyframes sk-glitch {
              0%, 90%, 100% { transform: translate(0); filter: none; }
              92% { transform: translate(-3px, 1px); filter: hue-rotate(90deg); }
              94% { transform: translate(3px, -1px); filter: hue-rotate(-90deg); }
              96% { transform: translate(-1px, 2px); filter: hue-rotate(45deg); }
              98% { transform: translate(2px, -2px); }
            }
          `}</style>
          <h2 className="text-5xl font-bold" style={{
            color: colors[0],
            animation: `sk-glitch ${speed}s ease-in-out infinite`,
          }}>
            {label || "GLITCH"}
          </h2>
        </div>
      );

    default:
      return () => (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-background">
          <div className="w-16 h-16 rounded-full" style={{ background: colors[0], animation: `sk-morph ${speed}s ease-in-out infinite` }} />
        </div>
      );
  }
};

// Define all Skiper components
const c1 = ["hsl(38, 92%, 50%)", "hsl(30, 85%, 55%)", "hsl(45, 90%, 55%)"];
const c2 = ["hsl(260, 70%, 55%)", "hsl(280, 80%, 60%)", "hsl(240, 65%, 50%)"];
const c3 = ["hsl(340, 80%, 55%)", "hsl(320, 70%, 55%)", "hsl(0, 75%, 50%)"];
const c4 = ["hsl(180, 70%, 45%)", "hsl(200, 80%, 50%)", "hsl(160, 65%, 45%)"];
const c5 = ["hsl(120, 60%, 45%)", "hsl(140, 70%, 50%)", "hsl(100, 55%, 40%)"];

export const Skiper3 = createEffect("orbit", c1, { count: 6, speed: 4, size: 35 });
export const Skiper4 = createEffect("gradient", c2, { speed: 5, size: 40, label: "SKIPER 4" });
export const Skiper16 = createEffect("cards", c3, { count: 4, speed: 3, size: 50 });
export const Skiper17 = createEffect("cards", c4, { count: 5, speed: 4, size: 45 });
export const Skiper19 = createEffect("orbit", c4, { count: 10, speed: 5, size: 30 });
export const Skiper25 = createEffect("bars", c1, { count: 16, speed: 4, size: 50 });
export const Skiper26 = createEffect("flip", c2, { size: 50 });
export const Skiper28 = createEffect("wave", c3, { speed: 4 });
export const Skiper30 = createEffect("grid", c1, { count: 25, speed: 3, size: 30 });
export const Skiper31 = createEffect("morph", c2, { speed: 6, size: 50 });
export const Skiper34 = createEffect("grid", c3, { count: 16, speed: 4, size: 35 });
export const Skiper37 = createEffect("wave", c4, { speed: 3 });
export const Skiper39 = createEffect("orbit", c3, { count: 12, speed: 6, size: 25 });
export const Skiper40 = createEffect("gradient", c1, { speed: 4, label: "FLOW" });
export const Skiper41 = createEffect("flip", c4, { size: 55 });
export const Skiper47 = createEffect("cards", c1, { count: 3, speed: 5, size: 55 });
export const Skiper48 = createEffect("cards", c2, { count: 4, speed: 3, size: 48 });
export const Skiper49 = createEffect("cards", c3, { count: 5, speed: 4, size: 42 });
export const Skiper50 = createEffect("cards", c4, { count: 3, speed: 3.5, size: 52 });
export const Skiper51 = createEffect("cards", c5, { count: 4, speed: 4.5, size: 46 });
export const Skiper52 = createEffect("cards", c1, { count: 5, speed: 3.5, size: 44 });
export const Skiper53 = createEffect("cards", [...c2, ...c3], { count: 4, speed: 4, size: 50 });
export const Skiper54 = createEffect("cards", [...c1, ...c4], { count: 3, speed: 5, size: 54 });
export const Skiper58 = createEffect("rings", c1, { count: 5, speed: 3, size: 40 });
export const Skiper61 = createEffect("interactive", c1, { size: 40 });
export const Skiper62 = createEffect("rings", c2, { count: 6, speed: 2.5, size: 35 });
export const Skiper63 = createEffect("morph", c3, { speed: 5, size: 55 });
export const Skiper64 = createEffect("interactive", c4, { size: 35 });
export const Skiper65 = createEffect("interactive", c5, { size: 45 });
export const Skiper66 = createEffect("cards", [...c3, ...c5], { count: 4, speed: 3, size: 48 });
export const Skiper67 = createEffect("morph", [...c1, ...c2], { speed: 4, size: 60 });
export const Skiper87 = createEffect("grid", [...c1, ...c3], { count: 36, speed: 2, size: 25 });

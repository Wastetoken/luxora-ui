import { useState, useEffect, useRef } from "react";

// Text Roll Navigation
export const TextRollNav = () => {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-background">
      <style>{`
        .roll-item { overflow: hidden; height: 3rem; }
        .roll-inner { transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .roll-item:hover .roll-inner { transform: translateY(-3rem); }
      `}</style>
      <nav className="flex flex-col gap-2">
        {["Home", "About", "Work", "Contact", "Blog"].map((item, i) => (
          <div key={i} className="roll-item cursor-pointer">
            <div className="roll-inner">
              <div className="h-12 flex items-center text-4xl font-bold text-foreground tracking-tight px-4">{item}</div>
              <div className="h-12 flex items-center text-4xl font-bold tracking-tight px-4" style={{ color: "hsl(38, 92%, 50%)" }}>{item}</div>
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};

// Wavy Text Block
export const WavyTextBlock = () => {
  const text = "WAVE MOTION";
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-background">
      <style>{`
        @keyframes wavy-char { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
      `}</style>
      <div className="flex">
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="text-5xl font-bold text-foreground inline-block"
            style={{
              animation: `wavy-char 2s ease-in-out infinite`,
              animationDelay: `${i * 0.08}s`,
              minWidth: char === " " ? "0.5em" : undefined,
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

// Parallax Scrolling Text Effect
export const ParallaxText = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x, y });
  };

  return (
    <div
      ref={ref}
      className="w-full h-full min-h-[400px] flex items-center justify-center bg-background overflow-hidden cursor-crosshair"
      style={{ touchAction: "none" }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
    >
      {["PARALLAX", "MOTION", "DEPTH"].map((text, i) => {
        const depth = (i + 1) * 30;
        return (
          <div
            key={i}
            className="absolute text-7xl font-bold pointer-events-none transition-transform duration-300"
            style={{
              color: `hsla(${38 + i * 60}, 80%, ${55 - i * 10}%, ${0.8 - i * 0.2})`,
              transform: `translate(${offset.x * depth}px, ${offset.y * depth}px)`,
            }}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
};

// Text Scroll Animation
export const TextScrollAnimation = () => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const p = container.scrollTop / (container.scrollHeight - container.clientHeight);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const words = ["Build", "Something", "Beautiful", "With", "React", "Components", "Today"];

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] overflow-y-auto bg-background">
      <div style={{ height: "300vh" }} className="relative">
        <div className="sticky top-0 h-full flex items-center justify-center">
          <div className="flex flex-wrap justify-center gap-4 px-8 max-w-lg">
            {words.map((word, i) => {
              const wordProgress = Math.max(0, Math.min(1, (progress - i * 0.1) * 5));
              return (
                <span
                  key={i}
                  className="text-4xl font-bold transition-none"
                  style={{
                    opacity: wordProgress,
                    transform: `translateY(${(1 - wordProgress) * 30}px)`,
                    color: wordProgress > 0.5 ? "hsl(38, 92%, 50%)" : "hsl(220, 14%, 40%)",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

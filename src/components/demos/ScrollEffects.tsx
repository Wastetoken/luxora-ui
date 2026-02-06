import { useState, useEffect, useRef } from "react";

// Flyby Scroll
export const FlybyScroll = () => {
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = () => setScrollY(el.scrollTop);
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const items = ["VELOCITY", "MOMENTUM", "THRUST", "TRAJECTORY", "ORBIT"];

  return (
    <div ref={ref} className="w-full h-full min-h-[400px] overflow-y-auto bg-background">
      <div style={{ height: "400vh" }} className="relative">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          {items.map((text, i) => {
            const offset = scrollY * (0.3 + i * 0.15) - i * 100;
            return (
              <div
                key={i}
                className="absolute text-6xl font-bold whitespace-nowrap pointer-events-none"
                style={{
                  color: `hsla(${38 + i * 40}, 80%, 55%, ${0.15 + i * 0.05})`,
                  transform: `translate3d(${-offset * 0.5}px, ${i * 60 - 120}px, 0) perspective(500px) rotateY(${Math.sin(offset * 0.005) * 5}deg)`,
                }}
              >
                {text}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// SVG Path Scroll
export const SvgPathScroll = () => {
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = () => {
      const p = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const pathLength = 800;

  return (
    <div ref={ref} className="w-full h-full min-h-[400px] overflow-y-auto bg-background">
      <div style={{ height: "300vh" }} className="relative">
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <svg viewBox="0 0 300 300" className="w-64 h-64">
            <path
              d="M 50 250 Q 50 50 150 50 Q 250 50 250 150 Q 250 250 150 250 Q 100 250 100 200 Q 100 150 150 150"
              fill="none"
              stroke="hsl(225, 12%, 20%)"
              strokeWidth="2"
            />
            <path
              d="M 50 250 Q 50 50 150 50 Q 250 50 250 150 Q 250 250 150 250 Q 100 250 100 200 Q 100 150 150 150"
              fill="none"
              stroke="hsl(38, 92%, 50%)"
              strokeWidth="3"
              strokeDasharray={pathLength}
              strokeDashoffset={pathLength * (1 - progress)}
              strokeLinecap="round"
            />
            <circle
              r="6"
              fill="hsl(38, 92%, 50%)"
              style={{
                offsetPath: `path("M 50 250 Q 50 50 150 50 Q 250 50 250 150 Q 250 250 150 250 Q 100 250 100 200 Q 100 150 150 150")`,
                offsetDistance: `${progress * 100}%`,
              }}
            />
          </svg>
          <div className="absolute bottom-8 text-sm text-muted-foreground">↓ Scroll to animate</div>
        </div>
      </div>
    </div>
  );
};

// Animated Gallery
export const AnimatedGallery = () => {
  const colors = [
    "hsl(38, 92%, 50%)", "hsl(260, 70%, 55%)", "hsl(340, 80%, 55%)",
    "hsl(180, 70%, 45%)", "hsl(120, 60%, 45%)", "hsl(200, 80%, 50%)",
    "hsl(30, 85%, 55%)", "hsl(300, 60%, 50%)", "hsl(160, 65%, 45%)",
  ];

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-background p-8">
      <style>{`
        @keyframes gallery-in {
          from { transform: scale(0.8) rotate(3deg); opacity: 0; }
          to { transform: scale(1) rotate(0); opacity: 1; }
        }
      `}</style>
      <div className="grid grid-cols-3 gap-3 max-w-md">
        {colors.map((color, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
            style={{
              background: `linear-gradient(135deg, ${color}, ${colors[(i + 3) % colors.length]})`,
              animation: `gallery-in 0.6s ease-out both`,
              animationDelay: `${i * 0.08}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Image Trail Effect
export const ImageTrailEffect = () => {
  const [trails, setTrails] = useState<{ x: number; y: number; id: number; color: string }[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const colors = ["hsl(38, 92%, 50%)", "hsl(260, 70%, 55%)", "hsl(340, 80%, 55%)", "hsl(180, 70%, 45%)"];
    const newTrail = { x, y, id: idRef.current++, color: colors[idRef.current % colors.length] };
    setTrails(prev => [...prev.slice(-15), newTrail]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTrails(prev => prev.slice(1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={ref}
      className="w-full h-full min-h-[400px] bg-background relative cursor-none overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {trails.map((trail, i) => (
        <div
          key={trail.id}
          className="absolute rounded-lg pointer-events-none"
          style={{
            left: trail.x - 20,
            top: trail.y - 20,
            width: 40,
            height: 40,
            background: trail.color,
            opacity: (i + 1) / trails.length * 0.6,
            transform: `scale(${(i + 1) / trails.length})`,
            transition: "opacity 0.3s",
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p className="text-muted-foreground text-sm">Move your mouse</p>
      </div>
    </div>
  );
};

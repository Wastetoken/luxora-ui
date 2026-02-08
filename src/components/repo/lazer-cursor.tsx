import { useEffect, useRef } from "react";

interface StrandPoint {
  x: number;
  y: number;
}

class Strand {
  points: StrandPoint[];
  speed: number;
  colorOffset: number;

  constructor(w: number, h: number) {
    this.points = [];
    const startX = Math.random() * w;
    const startY = Math.random() * h;
    for (let i = 0; i < 2; i++) {
      this.points.push({ x: startX, y: startY });
    }
    this.speed = Math.random() + 0.4 + 0.1 * 0.7;
    this.colorOffset = Math.random() * 0;
  }

  update(target: { x: number; y: number }) {
    let last = { x: target.x, y: target.y };
    for (const p of this.points) {
      p.x += (last.x - p.x) * this.speed;
      p.y += (last.y - p.y) * this.speed;
      last = p;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.strokeStyle = `hsl(${this.colorOffset}, 100%, 35%)`;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.stroke();
  }
}

const NUM_STRANDS = 100;

interface LazerCursorProps {
  /** Number of strands following the cursor */
  numStrands?: number;
  /** Custom className for the container */
  className?: string;
  /** Content to render on top of the cursor canvas */
  children?: React.ReactNode;
}

const LazerCursor = ({ numStrands = NUM_STRANDS, className, children }: LazerCursorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const strandsRef = useRef<Strand[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = container.offsetWidth);
    let h = (canvas.height = container.offsetHeight);
    mouseRef.current = { x: w / 2, y: h / 2 };

    strandsRef.current = [];
    for (let i = 0; i < numStrands; i++) {
      strandsRef.current.push(new Strand(w, h));
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const t = e.touches[0];
      mouseRef.current.x = t.clientX - rect.left;
      mouseRef.current.y = t.clientY - rect.top;
    };

    const handleResize = () => {
      w = canvas.width = container.offsetWidth;
      h = canvas.height = container.offsetHeight;
    };

    let animId: number;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of strandsRef.current) {
        s.update(mouseRef.current);
        s.draw(ctx);
      }
      animId = requestAnimationFrame(loop);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("resize", handleResize);
    loop();

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [numStrands]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full cursor-none overflow-hidden ${className ?? ""}`}
      style={{ background: "radial-gradient(circle at center, #0a0a0a 0%, #050505 90%)" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      {children}
    </div>
  );
};

export { LazerCursor };

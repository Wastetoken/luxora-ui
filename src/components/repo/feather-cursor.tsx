import { useEffect, useRef } from "react";

interface FeatherCursorProps {
  /** Number of strands */
  numStrands?: number;
  /** Custom className for the container */
  className?: string;
  /** Content to render on top */
  children?: React.ReactNode;
}

const FeatherCursor = ({
  numStrands = 800,
  className,
  children,
}: FeatherCursorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = container.offsetWidth);
    let h = (canvas.height = container.offsetHeight);

    const NUM_STRANDS = numStrands;
    const STRAND_LENGTH = 1.01;

    // Exact port of the original Strand class
    const strands: {
      points: { x: number; y: number }[];
      speed: number;
      colorOffset: number;
    }[] = [];

    for (let i = 0; i < NUM_STRANDS; i++) {
      const points: { x: number; y: number }[] = [];
      const startX = Math.random() * w;
      const startY = Math.random() * h;
      for (let j = 0; j < STRAND_LENGTH; j++) {
        points.push({ x: startX, y: startY });
      }
      strands.push({
        points,
        speed: Math.random() * 0.3 + 0.1 * 0.2,
        colorOffset: Math.random() * 0,
      });
    }

    const mouse = { x: w / 2, y: h / 2 };

    function updateStrand(
      strand: (typeof strands)[0],
      target: { x: number; y: number }
    ) {
      let last = { x: target.x, y: target.y };
      for (const p of strand.points) {
        p.x += (last.x - p.x) * strand.speed;
        p.y += (last.y - p.y) * strand.speed;
        last = p;
      }
    }

    function drawStrand(strand: (typeof strands)[0]) {
      ctx!.beginPath();
      ctx!.moveTo(strand.points[0].x, strand.points[0].y);
      for (let i = 1; i < strand.points.length; i++) {
        ctx!.lineTo(strand.points[i].x, strand.points[i].y);
      }
      ctx!.strokeStyle = `hsl(${strand.colorOffset} 100%, 100%, 65%)`;
      ctx!.lineWidth = 3.0;
      ctx!.lineCap = "square";
      ctx!.stroke();
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const t = e.touches[0];
      mouse.x = t.clientX - rect.left;
      mouse.y = t.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const t = e.touches[0];
      mouse.x = t.clientX - rect.left;
      mouse.y = t.clientY - rect.top;
    };

    const handleResize = () => {
      w = canvas.width = container.offsetWidth;
      h = canvas.height = container.offsetHeight;
    };

    let animId: number;
    function loop() {
      ctx!.clearRect(0, 0, w, h);
      for (const s of strands) {
        updateStrand(s, mouse);
        drawStrand(s);
      }
      animId = requestAnimationFrame(loop);
    }

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("resize", handleResize);
    loop();

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [numStrands]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full cursor-none overflow-hidden ${className ?? ""}`}
      style={{ background: "radial-gradient(circle at center, #0a0a0a 0%, #050505 90%)", touchAction: "none" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      {children}
    </div>
  );
};

export { FeatherCursor };

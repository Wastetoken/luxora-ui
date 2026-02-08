import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

class Segment {
  l: number;
  ang: number;
  pos: Point;
  nextPos: Point;

  constructor(parent: { x?: number; y?: number; pos?: Point; nextPos?: Point }, l: number, a: number, first: boolean) {
    this.l = l;
    this.ang = a;
    if (first) {
      this.pos = { x: parent.x!, y: parent.y! };
    } else {
      this.pos = { x: parent.nextPos!.x, y: parent.nextPos!.y };
    }
    this.nextPos = {
      x: this.pos.x + l * Math.cos(a),
      y: this.pos.y + l * Math.sin(a),
    };
  }

  update(t: Point) {
    this.ang = Math.atan2(t.y - this.pos.y, t.x - this.pos.x);
    this.pos.x = t.x - this.l * Math.cos(this.ang);
    this.pos.y = t.y - this.l * Math.sin(this.ang);
    this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
    this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
  }

  fallback(t: Point) {
    this.pos.x = t.x;
    this.pos.y = t.y;
    this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
    this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
  }

  show(ctx: CanvasRenderingContext2D) {
    ctx.lineTo(this.nextPos.x, this.nextPos.y);
  }
}

class Tentacle {
  x: number;
  y: number;
  l: number;
  n: number;
  rand: number;
  segments: Segment[];

  constructor(x: number, y: number, l: number, n: number) {
    this.x = x;
    this.y = y;
    this.l = l;
    this.n = n;
    this.rand = Math.random();
    this.segments = [new Segment(this, l / n, 0, true)];
    for (let i = 1; i < n; i++) {
      this.segments.push(new Segment(this.segments[i - 1], l / n, 0, false));
    }
  }

  move(last: Partial<Point>, target: Point) {
    const angle = Math.atan2(target.y - this.y, target.x - this.x);
    const d =
      Math.hypot(
        (last.x ?? target.x) - target.x,
        (last.y ?? target.y) - target.y
      ) + 5;

    const t = {
      x: target.x - 0.8 * d * Math.cos(angle),
      y: target.y - 0.8 * d * Math.sin(angle),
    };

    this.segments[this.n - 1].update(t);
    for (let i = this.n - 2; i >= 0; i--) {
      this.segments[i].update(this.segments[i + 1].pos);
    }

    if (Math.hypot(this.x - target.x, this.y - target.y) <= this.l + d) {
      this.segments[0].fallback({ x: this.x, y: this.y });
      for (let i = 1; i < this.n; i++) {
        this.segments[i].fallback(this.segments[i - 1].nextPos);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, target: Point) {
    if (Math.hypot(this.x - target.x, this.y - target.y) <= this.l) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      for (const s of this.segments) s.show(ctx);
      ctx.strokeStyle = `hsl(${this.rand * 40 + 100},100%,${this.rand * 30 + 50}%)`;
      ctx.lineWidth = this.rand * 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
  }
}

interface ElectricCursorProps {
  /** Number of tentacles */
  numTentacles?: number;
  /** Custom className for the container */
  className?: string;
  /** Content to render on top */
  children?: React.ReactNode;
}

const ElectricCursor = ({
  numTentacles = 600,
  className,
  children,
}: ElectricCursorProps) => {
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

    const mouse: { x: number | false; y: number | false } = { x: false, y: false };
    let lastTarget: Partial<Point> = {};
    let target = { x: w / 2, y: h / 2 };
    let t = 0;

    const maxl = 90;
    const minl = 40;
    const n = 30; // segments per tentacle (reduced from 320 for perf)

    const tentacles: Tentacle[] = [];
    for (let i = 0; i < numTentacles; i++) {
      tentacles.push(
        new Tentacle(
          Math.random() * w,
          Math.random() * h,
          Math.random() * (maxl - minl) + minl,
          n
        )
      );
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = false;
      mouse.y = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const touch = e.touches[0];
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const touch = e.touches[0];
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      mouse.x = false;
      mouse.y = false;
    };

    const handleResize = () => {
      w = canvas.width = container.offsetWidth;
      h = canvas.height = container.offsetHeight;
    };

    let animId: number;

    const draw = () => {
      if (mouse.x !== false && mouse.y !== false) {
        target.x += (mouse.x - target.x) / 8;
        target.y += (mouse.y - target.y) / 8;
      } else {
        target.x += (w / 2 + Math.cos(t) * w * 0.2 - target.x) / 50;
        target.y += (h / 2 + Math.sin(t) * h * 0.2 - target.y) / 50;
        t += 0.09;
      }

      ctx.clearRect(0, 0, w, h);

      for (const tent of tentacles) {
        tent.move(lastTarget, target);
        tent.draw(ctx, target);
      }

      lastTarget = { x: target.x, y: target.y };
    };

    const loop = () => {
      animId = requestAnimationFrame(loop);
      draw();
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: false });
    window.addEventListener("resize", handleResize);
    loop();

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [numTentacles]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full cursor-none overflow-hidden ${className ?? ""}`}
      style={{ background: "rgb(30, 30, 30)", touchAction: "none" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ touchAction: "none" }}
      />
      {children}
    </div>
  );
};

export { ElectricCursor };

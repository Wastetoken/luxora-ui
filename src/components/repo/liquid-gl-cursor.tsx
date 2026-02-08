import { useEffect, useRef, useState } from "react";

interface LiquidGLCursorProps {
  /** Size of the cursor circle in pixels */
  size?: number;
  /** Smoothing factor (0-1, lower = smoother) */
  smoothness?: number;
  /** Custom className for the container */
  className?: string;
  /** Content to render behind the cursor */
  children?: React.ReactNode;
}

const LiquidGLCursor = ({
  size = 80,
  smoothness = 0.5,
  className,
  children,
}: LiquidGLCursorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const cursor = cursorRef.current;
    if (!container || !cursor) return;

    const rect = container.getBoundingClientRect();
    mouseRef.current = { x: rect.width / 2, y: rect.height / 2 };
    currentRef.current = { ...mouseRef.current };

    let animId: number;

    const updatePosition = () => {
      const dx = mouseRef.current.x - currentRef.current.x;
      const dy = mouseRef.current.y - currentRef.current.y;

      currentRef.current.x += dx * smoothness;
      currentRef.current.y += dy * smoothness;

      cursor.style.left = `${currentRef.current.x}px`;
      cursor.style.top = `${currentRef.current.y}px`;

      animId = requestAnimationFrame(updatePosition);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      mouseRef.current.x = e.clientX - r.left;
      mouseRef.current.y = e.clientY - r.top;
      setActive(true);
    };

    const handleMouseLeave = () => {
      setActive(false);
    };

    const handleMouseEnter = () => {
      setActive(true);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseenter", handleMouseEnter);
    updatePosition();

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, [smoothness]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-black cursor-none overflow-hidden ${className ?? ""}`}
    >
      {/* Cursor element */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[10000] rounded-full transition-[width,height] duration-200 ease-out"
        style={{
          width: size,
          height: size,
          opacity: active ? 1 : 0,
          transform: "translate(-50%, -50%)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          background:
            "linear-gradient(90deg, rgba(228, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 38%, rgba(255, 255, 255, 1) 84%)",
          mixBlendMode: "difference",
          transition: "opacity 0.3s ease, width 0.25s ease, height 0.25s ease",
        }}
      />
      {children}
    </div>
  );
};

export { LiquidGLCursor };

import { useEffect, useRef } from 'react';

const SIZE = 130;
const ZOOM = 2.0;

export default function LiquidCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const target = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      // Smooth follow
      pos.current.x += (target.current.x - pos.current.x) * 0.12;
      pos.current.y += (target.current.y - pos.current.y) * 0.12;
      container.style.left = pos.current.x + 'px';
      container.style.top = pos.current.y + 'px';

      // Find the background shader canvas
      const bgCanvas = document.querySelector('canvas.fixed') as HTMLCanvasElement | null;

      ctx.clearRect(0, 0, SIZE, SIZE);

      if (bgCanvas) {
        // Calculate the source region (what area of the background to magnify)
        const srcSize = SIZE / ZOOM;
        const sx = pos.current.x - srcSize / 2;
        const sy = pos.current.y - srcSize / 2;

        // Clip to circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
        ctx.clip();

        // Draw magnified background
        ctx.drawImage(
          bgCanvas,
          sx, sy, srcSize, srcSize,  // source rect
          0, 0, SIZE, SIZE            // dest rect (fills lens)
        );

        // Glass edge effects
        const gradient = ctx.createRadialGradient(
          SIZE / 2, SIZE / 2, SIZE * 0.35,
          SIZE / 2, SIZE / 2, SIZE / 2
        );
        gradient.addColorStop(0, 'rgba(255,255,255,0)');
        gradient.addColorStop(0.7, 'rgba(255,255,255,0)');
        gradient.addColorStop(0.85, 'rgba(255,255,255,0.06)');
        gradient.addColorStop(0.95, 'rgba(255,255,255,0.12)');
        gradient.addColorStop(1, 'rgba(255,255,255,0.18)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, SIZE, SIZE);

        // Chromatic aberration at edges — red shift
        ctx.globalCompositeOperation = 'screen';
        const aberration = ctx.createRadialGradient(
          SIZE / 2, SIZE / 2, SIZE * 0.38,
          SIZE / 2, SIZE / 2, SIZE / 2
        );
        aberration.addColorStop(0, 'rgba(0,0,0,0)');
        aberration.addColorStop(0.8, 'rgba(0,0,0,0)');
        aberration.addColorStop(1, 'rgba(180,80,60,0.15)');
        ctx.fillStyle = aberration;
        ctx.fillRect(0, 0, SIZE, SIZE);
        ctx.globalCompositeOperation = 'source-over';

        // Caustic highlight
        ctx.beginPath();
        ctx.arc(SIZE * 0.35, SIZE * 0.3, SIZE * 0.08, 0, Math.PI * 2);
        const highlight = ctx.createRadialGradient(
          SIZE * 0.35, SIZE * 0.3, 0,
          SIZE * 0.35, SIZE * 0.3, SIZE * 0.08
        );
        highlight.addColorStop(0, 'rgba(255,255,255,0.25)');
        highlight.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = highlight;
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      container.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      container.style.opacity = '0';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    render();

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed pointer-events-none z-[9999]"
      style={{
        width: SIZE,
        height: SIZE,
        transform: 'translate(-50%, -50%)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: '50%',
          boxShadow: [
            '0 0 0 1.5px rgba(255,255,255,0.18)',
            '0 0 12px rgba(255,255,255,0.06)',
            '0 0 30px rgba(255,255,255,0.03)',
          ].join(', '),
        }}
      />
    </div>
  );
}

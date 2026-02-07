import { useEffect, useRef } from 'react';

export default function LiquidCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  const SIZE = 120; // diameter of the lens
  const ZOOM = 1.8; // magnification factor
  const EDGE_THICKNESS = 12; // pixels of edge distortion

  useEffect(() => {
    const container = containerRef.current;
    const lensCanvas = canvasRef.current;
    if (!container || !lensCanvas) return;

    const ctx = lensCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    lensCanvas.width = SIZE;
    lensCanvas.height = SIZE;

    pos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    target.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      container.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      container.style.opacity = '0';
    };

    let animId: number;

    const render = () => {
      // Smooth lerp
      pos.current.x += (target.current.x - pos.current.x) * 0.12;
      pos.current.y += (target.current.y - pos.current.y) * 0.12;

      container.style.left = pos.current.x + 'px';
      container.style.top = pos.current.y + 'px';

      // Find the background shader canvas
      const bgCanvas = document.querySelector('canvas:not(#lens-canvas)') as HTMLCanvasElement;
      if (bgCanvas) {
        const radius = SIZE / 2;
        const sampleRadius = radius / ZOOM;

        // Source coordinates on the background canvas
        const dpr = bgCanvas.width / bgCanvas.clientWidth;
        const sx = pos.current.x * dpr - sampleRadius * dpr;
        const sy = pos.current.y * dpr - sampleRadius * dpr;
        const sSize = sampleRadius * 2 * dpr;

        ctx.clearRect(0, 0, SIZE, SIZE);
        ctx.save();

        // Clip to circle
        ctx.beginPath();
        ctx.arc(radius, radius, radius - 1, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Draw magnified background
        try {
          ctx.drawImage(
            bgCanvas,
            sx, sy, sSize, sSize,
            0, 0, SIZE, SIZE
          );
        } catch (e) {
          // WebGL canvas may not be readable in some cases
        }

        // Edge refraction distortion — draw warped ring at edges
        // This creates a barrel distortion effect at the lens border
        const edgeGradient = ctx.createRadialGradient(radius, radius, radius - EDGE_THICKNESS, radius, radius, radius);
        edgeGradient.addColorStop(0, 'rgba(255,255,255,0)');
        edgeGradient.addColorStop(0.3, 'rgba(255,255,255,0.06)');
        edgeGradient.addColorStop(0.7, 'rgba(255,255,255,0.12)');
        edgeGradient.addColorStop(1, 'rgba(255,255,255,0.18)');
        ctx.fillStyle = edgeGradient;
        ctx.fill();

        // Chromatic aberration at edges — slight color offset
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.08;

        // Red channel shift
        ctx.save();
        ctx.beginPath();
        ctx.arc(radius, radius, radius - 1, 0, Math.PI * 2);
        ctx.clip();
        try {
          ctx.drawImage(
            bgCanvas,
            sx - 2 * dpr, sy, sSize, sSize,
            0, 0, SIZE, SIZE
          );
        } catch (e) {}
        ctx.restore();

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';

        ctx.restore();

        // Draw glass rim
        ctx.beginPath();
        ctx.arc(radius, radius, radius - 1, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner highlight arc (top-left caustic)
        ctx.beginPath();
        ctx.arc(radius, radius, radius - 3, -Math.PI * 0.8, -Math.PI * 0.3);
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Outer subtle glow
        ctx.beginPath();
        ctx.arc(radius, radius, radius + 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

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
        id="lens-canvas"
        width={SIZE}
        height={SIZE}
        className="rounded-full"
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: '50%',
          boxShadow: [
            '0 0 15px rgba(255,255,255,0.06)',
            '0 0 30px rgba(255,255,255,0.03)',
            'inset 0 0 8px rgba(255,255,255,0.05)',
          ].join(', '),
        }}
      />
    </div>
  );
}

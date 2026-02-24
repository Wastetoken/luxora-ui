import { useRef, useEffect, useCallback } from "react";

// Simple 2D Perlin-style noise
function noise2D(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1;
}

function smoothNoise(x: number, y: number): number {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = noise2D(ix, iy), b = noise2D(ix + 1, iy);
  const c = noise2D(ix, iy + 1), d = noise2D(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm(x: number, y: number, octaves = 3): number {
  let val = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    val += amp * smoothNoise(x * freq, y * freq);
    amp *= 0.5;
    freq *= 2;
  }
  return val;
}

interface Props {
  text: string;
}

export default function PerlinHoverText({ text }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const animRef = useRef(0);
  const timeRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
    }
    
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const fontSize = w / text.length * 1.45;
    ctx.font = `400 ${fontSize}px 'Cinzel Decorative', serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";

    const { x: mx, y: my, active } = mouseRef.current;
    const time = timeRef.current;

    if (!active) {
      ctx.fillText(text, w / 2, h / 2);
    } else {
      // Draw each character with localized distortion near cursor
      const metrics = ctx.measureText(text);
      const totalW = metrics.width;
      let xPos = w / 2 - totalW / 2;
      const cy = h / 2;
      const radius = 120;

      ctx.textAlign = "left";
      ctx.textAlign = "left";

      for (let i = 0; i < text.length; i++) {
        const charW = ctx.measureText(text[i]).width;
        const charCenterX = xPos + charW / 2;
        const charCenterY = cy;

        const dx = charCenterX - mx;
        const dy = charCenterY - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / radius);
        const eased = influence * influence * (3 - 2 * influence); // smoothstep

        const noiseScale = 0.04;
        const offsetX = fbm(charCenterX * noiseScale + time * 0.8, charCenterY * noiseScale, 3) * 12 * eased;
        const offsetY = fbm(charCenterX * noiseScale, charCenterY * noiseScale + time * 0.8, 3) * 12 * eased;

        ctx.fillText(text[i], xPos + offsetX, cy + offsetY);
        xPos += charW;
      }
      ctx.shadowBlur = 0;
    }

    timeRef.current += 0.06;
    animRef.current = requestAnimationFrame(draw);
  }, [text]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  const onEnter = () => { mouseRef.current.active = true; };
  const onLeave = () => { mouseRef.current = { x: -9999, y: -9999, active: false }; };
  const onMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.active = true;
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block pointer-events-auto"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      style={{ cursor: "default" }}
    >
      {/* Invisible text for sizing */}
      <span className="invisible" style={{ fontFamily: "'Cinzel Decorative', serif", fontWeight: 400 }}>{text}</span>
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}

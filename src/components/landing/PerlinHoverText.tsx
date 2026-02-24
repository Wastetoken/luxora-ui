import { useRef, useEffect } from "react";

// FBM noise for distortion
function hash(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1;
}

function smoothNoise(x: number, y: number): number {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy), b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm(x: number, y: number): number {
  return 0.5 * smoothNoise(x, y) +
    0.25 * smoothNoise(x * 2.02, y * 2.02) +
    0.125 * smoothNoise(x * 4.03, y * 4.03);
}

interface Props {
  text: string;
}

export default function PerlinHoverText({ text }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    mouseX: -1, mouseY: -1, hover: false,
    hoverAmount: 0, animId: 0, time: 0,
    sourceCanvas: null as HTMLCanvasElement | null,
    sourceData: null as ImageData | null,
    needsSource: true,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Source canvas for clean text
    const srcCanvas = document.createElement("canvas");
    const srcCtx = srcCanvas.getContext("2d", { willReadFrequently: true })!;
    stateRef.current.sourceCanvas = srcCanvas;

    function buildSource() {
      const dpr = window.devicePixelRatio || 1;
      const rect = container!.getBoundingClientRect();
      const w = Math.ceil(rect.width * dpr);
      const h = Math.ceil(rect.height * dpr);
      if (w === 0 || h === 0) return;

      srcCanvas.width = w;
      srcCanvas.height = h;
      canvas!.width = w;
      canvas!.height = h;
      canvas!.style.width = rect.width + "px";
      canvas!.style.height = rect.height + "px";

      srcCtx.clearRect(0, 0, w, h);
      const fontSize = (rect.width / text.length) * 1.45 * dpr;
      srcCtx.font = `400 ${fontSize}px 'Cinzel Decorative', serif`;
      srcCtx.textAlign = "center";
      srcCtx.textBaseline = "middle";
      srcCtx.fillStyle = "#fff";
      srcCtx.fillText(text, w / 2, h / 2);

      stateRef.current.sourceData = srcCtx.getImageData(0, 0, w, h);
      stateRef.current.needsSource = false;
    }

    function resize() {
      stateRef.current.needsSource = true;
    }

    window.addEventListener("resize", resize);

    function render() {
      const st = stateRef.current;
      if (st.needsSource) buildSource();

      const w = canvas!.width;
      const h = canvas!.height;
      if (w === 0 || h === 0 || !st.sourceData) {
        st.animId = requestAnimationFrame(render);
        return;
      }

      // Smooth hover interpolation
      const target = st.hover ? 1.0 : 0.0;
      st.hoverAmount += (target - st.hoverAmount) * 0.06;
      if (Math.abs(st.hoverAmount) < 0.001) st.hoverAmount = 0;

      st.time += 0.02;

      const src = st.sourceData.data;
      const out = ctx!.createImageData(w, h);
      const dst = out.data;

      const dpr = window.devicePixelRatio || 1;
      const rect = container!.getBoundingClientRect();
      const mx = (st.mouseX / rect.width) * w;
      const my = (st.mouseY / rect.height) * h;
      const radius = 0.3 * Math.min(w, h);
      const t = st.time;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;

          if (st.hoverAmount > 0.001) {
            const dx = x - mx;
            const dy = y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const influence = Math.max(0, 1 - dist / radius);
            const eased = influence * influence * (3 - 2 * influence);
            const strength = 18 * eased * st.hoverAmount;

            const scale = 0.015;
            const ox = fbm(x * scale + t, y * scale) * strength;
            const oy = fbm(x * scale, y * scale + t * 0.7) * strength;

            const sx = Math.min(w - 1, Math.max(0, Math.round(x + ox)));
            const sy = Math.min(h - 1, Math.max(0, Math.round(y + oy)));
            const si = (sy * w + sx) * 4;

            dst[i] = src[si];
            dst[i + 1] = src[si + 1];
            dst[i + 2] = src[si + 2];
            dst[i + 3] = src[si + 3];
          } else {
            dst[i] = src[i];
            dst[i + 1] = src[i + 1];
            dst[i + 2] = src[i + 2];
            dst[i + 3] = src[i + 3];
          }
        }
      }

      ctx!.putImageData(out, 0, 0);
      st.animId = requestAnimationFrame(render);
    }

    document.fonts.ready.then(() => {
      buildSource();
      st.animId = requestAnimationFrame(render);
    });

    const st = stateRef.current;

    return () => {
      cancelAnimationFrame(st.animId);
      window.removeEventListener("resize", resize);
    };
  }, [text]);

  const onMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    stateRef.current.mouseX = e.clientX - rect.left;
    stateRef.current.mouseY = e.clientY - rect.top;
    stateRef.current.hover = true;
  };
  const onLeave = () => { stateRef.current.hover = false; };

  return (
    <div
      ref={containerRef}
      className="relative inline-block pointer-events-auto"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ cursor: "default", padding: "0.15em 0" }}
    >
      <span className="invisible block" style={{ fontFamily: "'Cinzel Decorative', serif", fontWeight: 400, lineHeight: 1.3 }}>{text}</span>
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}

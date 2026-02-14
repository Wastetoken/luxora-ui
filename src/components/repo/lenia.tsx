"use client";

import {
  useRef,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
} from "react";
import { animate, createTimeline, stagger } from "animejs";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────
 * SEEDED PRNG — deterministic random for hydration safety
 * ──────────────────────────────────────────────────────────── */

function seeded(i: number, salt: number): number {
  return ((Math.sin(i * salt + 311.7) * 43758.5453) % 1 + 1) % 1;
}

/* ────────────────────────────────────────────────────────────
 * THEME HOOK — watches .dark class on <html>
 * ──────────────────────────────────────────────────────────── */

function useIsDark(ref?: React.RefObject<HTMLElement | null>) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const check = () => {
      if (ref?.current) {
        setDark(!!ref.current.closest(".dark"));
      } else {
        setDark(document.documentElement.classList.contains("dark"));
      }
    };
    check();

    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    if (ref?.current) {
      let el: HTMLElement | null = ref.current.parentElement;
      while (el && el !== document.documentElement) {
        observer.observe(el, {
          attributes: true,
          attributeFilter: ["class"],
        });
        el = el.parentElement;
      }
    }
    return () => observer.disconnect();
  }, [ref]);

  return dark;
}

/* ────────────────────────────────────────────────────────────
 * THEME PALETTES
 * ──────────────────────────────────────────────────────────── */

interface ThemePalette {
  grainRgb: [number, number, number];
  filmGrainAlpha: number;
  filmGrainValue: number;
  vignetteColor: string;
  vignetteOpacity: number;
}

const PALETTE_DARK: ThemePalette = {
  grainRgb: [16, 16, 16],
  filmGrainAlpha: 18,
  filmGrainValue: 25,
  vignetteColor: "0,0,0",
  vignetteOpacity: 0.4,
};

const PALETTE_LIGHT: ThemePalette = {
  grainRgb: [235, 230, 224],
  filmGrainAlpha: 14,
  filmGrainValue: 200,
  vignetteColor: "255,255,255",
  vignetteOpacity: 0.25,
};

/* ────────────────────────────────────────────────────────────
 * LENIA COLOR PALETTES — state value (0-1) → RGB
 * ──────────────────────────────────────────────────────────── */

interface ColorStop {
  t: number;
  r: number;
  g: number;
  b: number;
}

const LENIA_COLORS_DARK: ColorStop[] = [
  { t: 0.0, r: 10, g: 10, b: 12 },
  { t: 0.15, r: 22, g: 22, b: 28 },
  { t: 0.4, r: 50, g: 48, b: 58 },
  { t: 0.65, r: 120, g: 115, b: 130 },
  { t: 0.85, r: 180, g: 175, b: 190 },
  { t: 1.0, r: 230, g: 226, b: 235 },
];

const LENIA_COLORS_LIGHT: ColorStop[] = [
  { t: 0.0, r: 248, g: 246, b: 242 },
  { t: 0.15, r: 230, g: 225, b: 218 },
  { t: 0.4, r: 190, g: 182, b: 172 },
  { t: 0.65, r: 140, g: 132, b: 122 },
  { t: 0.85, r: 90, g: 82, b: 72 },
  { t: 1.0, r: 40, g: 35, b: 30 },
];

function lerpColor(
  stops: ColorStop[],
  t: number
): [number, number, number] {
  const v = Math.max(0, Math.min(1, t));
  if (v <= stops[0].t) return [stops[0].r, stops[0].g, stops[0].b];
  if (v >= stops[stops.length - 1].t) {
    const last = stops[stops.length - 1];
    return [last.r, last.g, last.b];
  }
  for (let i = 0; i < stops.length - 1; i++) {
    if (v >= stops[i].t && v <= stops[i + 1].t) {
      const f = (v - stops[i].t) / (stops[i + 1].t - stops[i].t);
      return [
        Math.round(stops[i].r + (stops[i + 1].r - stops[i].r) * f),
        Math.round(stops[i].g + (stops[i + 1].g - stops[i].g) * f),
        Math.round(stops[i].b + (stops[i + 1].b - stops[i].b) * f),
      ];
    }
  }
  return [stops[0].r, stops[0].g, stops[0].b];
}

/* ────────────────────────────────────────────────────────────
 * KERNEL — precomputed ring convolution offsets
 * ──────────────────────────────────────────────────────────── */

interface KernelOffset {
  dx: number;
  dy: number;
  w: number;
}

function buildKernel(radius: number): KernelOffset[] {
  const beta = 0.5;
  const alpha = 0.15;
  const offsets: KernelOffset[] = [];
  let totalWeight = 0;

  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const r = Math.sqrt(dx * dx + dy * dy);
      if (r > radius || r === 0) continue;
      const rNorm = r / radius;
      const w = Math.exp(
        -((rNorm - beta) * (rNorm - beta)) / (2 * alpha * alpha)
      );
      if (w > 1e-6) {
        offsets.push({ dx, dy, w });
        totalWeight += w;
      }
    }
  }

  // Normalize
  for (let i = 0; i < offsets.length; i++) {
    offsets[i].w /= totalWeight;
  }

  return offsets;
}

/* ────────────────────────────────────────────────────────────
 * GROWTH FUNCTION — Gaussian bump
 * ──────────────────────────────────────────────────────────── */

function growthFn(u: number, mu: number, sigma: number): number {
  const diff = u - mu;
  return 2 * Math.exp(-(diff * diff) / (2 * sigma * sigma)) - 1;
}

/* ────────────────────────────────────────────────────────────
 * SIMULATION INIT — seed blobs + noise
 * ──────────────────────────────────────────────────────────── */

function initField(w: number, h: number): Float32Array {
  const field = new Float32Array(w * h);

  // Seed 2 circular blobs at deterministic positions
  const blobCount = 2;
  for (let b = 0; b < blobCount; b++) {
    const cx = seeded(b, 127.1) * w;
    const cy = seeded(b, 269.5) * h;
    const r = 5 + seeded(b, 43.7) * 4; // radius 5-9
    const val = 0.5 + seeded(b, 97.3) * 0.3; // value 0.5-0.8

    for (let y = Math.floor(cy - r - 1); y <= Math.ceil(cy + r + 1); y++) {
      for (let x = Math.floor(cx - r - 1); x <= Math.ceil(cx + r + 1); x++) {
        const wx = ((x % w) + w) % w;
        const wy = ((y % h) + h) % h;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < r) {
          const falloff = 1 - (dist / r) * (dist / r);
          field[wy * w + wx] = Math.min(
            1,
            field[wy * w + wx] + val * falloff
          );
        }
      }
    }
  }

  // Add low-level noise
  for (let i = 0; i < w * h; i++) {
    field[i] = Math.min(1, Math.max(0, field[i] + (seeded(i, 173.9) - 0.5) * 0.03));
  }

  return field;
}

/* ────────────────────────────────────────────────────────────
 * LENIA COMPONENT
 * ──────────────────────────────────────────────────────────── */

interface LeniaProps {
  children?: ReactNode;
  /** Simulation grid width (default: 192) */
  gridWidth?: number;
  /** Simulation grid height (default: 128) */
  gridHeight?: number;
  /** Growth function center (default: 0.15) */
  mu?: number;
  /** Growth function width (default: 0.017) */
  sigma?: number;
  /** Kernel radius in cells (default: 13) */
  kernelRadius?: number;
  /** Integration time step (default: 0.1) */
  dt?: number;
  /** Cursor brush radius in cells (default: 5) */
  brushRadius?: number;
  /** Show film grain overlay (default: true) */
  filmGrain?: boolean;
  /** Show vignette (default: true) */
  vignette?: boolean;
  /** Additional className */
  className?: string;
}

export function Lenia({
  children,
  gridWidth = 192,
  gridHeight = 128,
  mu = 0.15,
  sigma = 0.017,
  kernelRadius = 13,
  dt = 0.1,
  brushRadius = 5,
  filmGrain = true,
  vignette = true,
  className,
}: LeniaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grainCanvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const rafRef = useRef<number>(0);
  const paletteRef = useRef<ThemePalette>(PALETTE_DARK);
  const [revealed, setRevealed] = useState(false);
  const revealedRef = useRef(false);
  const hasInteractedRef = useRef(false);
  const isDark = useIsDark(containerRef);

  // Simulation state refs
  const fieldARef = useRef<Float32Array | null>(null);
  const fieldBRef = useRef<Float32Array | null>(null);
  const kernelRef = useRef<KernelOffset[]>([]);
  const simWRef = useRef(gridWidth);
  const simHRef = useRef(gridHeight);
  const colorsRef = useRef<ColorStop[]>(LENIA_COLORS_DARK);

  // Sync palette and colors to refs
  useEffect(() => {
    paletteRef.current = isDark ? PALETTE_DARK : PALETTE_LIGHT;
    colorsRef.current = isDark ? LENIA_COLORS_DARK : LENIA_COLORS_LIGHT;
  }, [isDark]);

  // Film grain generator
  const generateFilmGrain = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const pal = paletteRef.current;
      const imgData = ctx.createImageData(w, h);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * pal.filmGrainValue;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = pal.filmGrainAlpha;
      }
      ctx.putImageData(imgData, 0, 0);
    },
    []
  );

  // Simulation step: convolve + grow + integrate
  const simStep = useCallback(() => {
    const A = fieldARef.current;
    const B = fieldBRef.current;
    const kernel = kernelRef.current;
    const sw = simWRef.current;
    const sh = simHRef.current;
    if (!A || !B || kernel.length === 0) return;

    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        // Convolution with toroidal wrap
        let sum = 0;
        for (let k = 0; k < kernel.length; k++) {
          const nx = ((x + kernel[k].dx) % sw + sw) % sw;
          const ny = ((y + kernel[k].dy) % sh + sh) % sh;
          sum += A[ny * sw + nx] * kernel[k].w;
        }

        // Growth function
        const g = growthFn(sum, mu, sigma);

        // Integration
        const idx = y * sw + x;
        B[idx] = Math.max(0, Math.min(1, A[idx] + dt * g));
      }
    }

    // Swap buffers
    fieldARef.current = B;
    fieldBRef.current = A;
  }, [mu, sigma, dt]);

  // Inject chemical at cursor position
  const injectAtCursor = useCallback(() => {
    const A = fieldARef.current;
    const sw = simWRef.current;
    const sh = simHRef.current;
    const canvas = canvasRef.current;
    if (!A || !canvas) return;

    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    if (!mouseRef.current.active) return;

    // Map canvas coords to sim grid coords
    const rect = canvas.getBoundingClientRect();
    const simX = (mx / rect.width) * sw;
    const simY = (my / rect.height) * sh;
    const br = brushRadius;
    const brSq = br * br;

    for (let dy = -br - 1; dy <= br + 1; dy++) {
      for (let dx = -br - 1; dx <= br + 1; dx++) {
        const dSq = dx * dx + dy * dy;
        if (dSq > brSq * 4) continue;
        const nx = ((Math.round(simX) + dx) % sw + sw) % sw;
        const ny = ((Math.round(simY) + dy) % sh + sh) % sh;
        const strength = 0.8 * Math.exp(-dSq / (2 * br * br));
        const idx = ny * sw + nx;
        A[idx] = Math.min(1, A[idx] + strength);
      }
    }
  }, [brushRadius]);

  // Render simulation to canvas with bilinear interpolation
  const renderField = useCallback(() => {
    const canvas = canvasRef.current;
    const A = fieldARef.current;
    const sw = simWRef.current;
    const sh = simHRef.current;
    if (!canvas || !A) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const imgData = ctx.createImageData(cw, ch);
    const data = imgData.data;
    const colors = colorsRef.current;

    const scaleX = sw / cw;
    const scaleY = sh / ch;

    for (let py = 0; py < ch; py++) {
      const srcY = py * scaleY;
      const sy0 = Math.floor(srcY);
      const sy1 = (sy0 + 1) % sh;
      const fy = srcY - sy0;

      for (let px = 0; px < cw; px++) {
        const srcX = px * scaleX;
        const sx0 = Math.floor(srcX);
        const sx1 = (sx0 + 1) % sw;
        const fx = srcX - sx0;

        // Bilinear interpolation of state value
        const v00 = A[sy0 * sw + sx0];
        const v10 = A[sy0 * sw + sx1];
        const v01 = A[sy1 * sw + sx0];
        const v11 = A[sy1 * sw + sx1];
        const v =
          v00 * (1 - fx) * (1 - fy) +
          v10 * fx * (1 - fy) +
          v01 * (1 - fx) * fy +
          v11 * fx * fy;

        const [r, g, b] = lerpColor(colors, v);
        const idx = (py * cw + px) * 4;
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, []);

  // Main animation loop
  const tick = useCallback(() => {
    // Inject cursor chemical
    injectAtCursor();

    // Run 1 simulation step per frame (perf: kernel convolution is expensive)
    simStep();

    // Render to canvas
    renderField();

    // Trigger text reveal on first interaction
    if (!revealedRef.current && hasInteractedRef.current) {
      revealedRef.current = true;
      setRevealed(true);
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [simStep, injectAtCursor, renderField]);

  // Init
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const grainCanvas = grainCanvasRef.current;
    if (!container || !canvas || !grainCanvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();

    // Use a lower resolution for the simulation canvas (not full DPR)
    // to keep the pixel-level rendering fast
    const canvasScale = 0.5;
    canvas.width = Math.round(rect.width * canvasScale);
    canvas.height = Math.round(rect.height * canvasScale);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    grainCanvas.width = rect.width * 0.5;
    grainCanvas.height = rect.height * 0.5;
    grainCanvas.style.width = `${rect.width}px`;
    grainCanvas.style.height = `${rect.height}px`;

    // Init simulation
    simWRef.current = gridWidth;
    simHRef.current = gridHeight;
    kernelRef.current = buildKernel(kernelRadius);
    fieldARef.current = initField(gridWidth, gridHeight);
    fieldBRef.current = new Float32Array(gridWidth * gridHeight);

    let grainInterval: ReturnType<typeof setInterval> | undefined;
    if (filmGrain) {
      const gCtx = grainCanvas.getContext("2d");
      if (gCtx) {
        generateFilmGrain(gCtx, grainCanvas.width, grainCanvas.height);
        grainInterval = setInterval(
          () =>
            generateFilmGrain(gCtx, grainCanvas.width, grainCanvas.height),
          80
        );
      }
    }

    rafRef.current = requestAnimationFrame(tick);

    const onResize = () => {
      const r = container.getBoundingClientRect();
      canvas.width = Math.round(r.width * 0.5);
      canvas.height = Math.round(r.height * 0.5);
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      grainCanvas.width = r.width * 0.5;
      grainCanvas.height = r.height * 0.5;
      grainCanvas.style.width = `${r.width}px`;
      grainCanvas.style.height = `${r.height}px`;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      if (grainInterval) clearInterval(grainInterval);
    };
  }, [gridWidth, gridHeight, kernelRadius, filmGrain, generateFilmGrain, tick]);

  // Anime.js text reveal
  useEffect(() => {
    if (!revealed || !contentRef.current) return;

    const els = contentRef.current.querySelectorAll("[data-lenia-reveal]");
    const tl = createTimeline({
      defaults: { duration: 900, ease: "outQuint" },
    });

    els.forEach((el, i) => {
      const chars = el.querySelectorAll(".lenia-char");
      if (chars.length > 0) {
        tl.add(
          chars,
          {
            y: [60, 0],
            opacity: [0, 1],
            rotateX: [90, 0],
            delay: stagger(25, { from: "center" }),
          },
          i === 0 ? 0 : "-=700"
        );
      } else {
        tl.add(el, { y: [40, 0], opacity: [0, 1] }, i === 0 ? 0 : "-=700");
      }
    });
  }, [revealed]);

  // Mouse / touch tracking
  const handlePointerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const c = containerRef.current;
      if (!c) return;
      const rect = c.getBoundingClientRect();
      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      const cy = "touches" in e ? e.touches[0].clientY : e.clientY;
      mouseRef.current.x = cx - rect.left;
      mouseRef.current.y = cy - rect.top;
      mouseRef.current.active = true;
      if (!hasInteractedRef.current) {
        hasInteractedRef.current = true;
      }
    },
    []
  );

  const handlePointerLeave = useCallback(() => {
    mouseRef.current.active = false;
  }, []);

  const vignetteStyle = isDark
    ? `radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(${PALETTE_DARK.vignetteColor},${PALETTE_DARK.vignetteOpacity}) 100%)`
    : `radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(${PALETTE_LIGHT.vignetteColor},${PALETTE_LIGHT.vignetteOpacity}) 100%)`;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden select-none bg-[var(--gray-1)]",
        className
      )}
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onTouchEnd={handlePointerLeave}
      style={{ cursor: "crosshair" }}
    >
      {/* Simulation canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ imageRendering: "auto" }}
      />

      {/* Blur backdrop behind text */}
      <div
        className="absolute inset-0 z-[5]"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          maskImage:
            "radial-gradient(ellipse 65% 60% at 50% 50%, black 25%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 60% at 50% 50%, black 25%, transparent 75%)",
        }}
      />

      {/* Content overlay */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-10 flex items-center justify-center"
      >
        {children}
      </div>

      {/* Film grain overlay */}
      {filmGrain && (
        <canvas
          ref={grainCanvasRef}
          className="absolute inset-0 z-30 pointer-events-none opacity-30"
          style={{ imageRendering: "pixelated" }}
        />
      )}

      {/* Vignette */}
      {vignette && (
        <div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{ background: vignetteStyle }}
        />
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 * HELPER — split text into animatable characters
 * ──────────────────────────────────────────────────────────── */

export function LeniaText({
  children,
  className,
  as: Tag = "h1",
}: {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  return (
    <Tag
      data-lenia-reveal
      className={cn("overflow-hidden", className)}
      style={{ perspective: "600px" }}
    >
      {children.split("").map((char, i) => (
        <span
          key={i}
          className="lenia-char inline-block"
          style={{ opacity: 0, transformOrigin: "center bottom" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Tag>
  );
}

/* ────────────────────────────────────────────────────────────
 * PREVIEW — registry showcase
 * ──────────────────────────────────────────────────────────── */

export function LeniaPreview() {
  const [key, setKey] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isDark = useIsDark(wrapperRef);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-[600px]"
      style={{ background: isDark ? "#0a0a0c" : "#f8f6f2" }}
    >
      <Lenia
        key={key}
        gridWidth={160}
        gridHeight={108}
        mu={0.14}
        sigma={0.015}
        kernelRadius={7}
        dt={0.15}
        brushRadius={4}
        filmGrain
        vignette
        className="w-full h-full"
      >
        <div className="flex flex-col items-center gap-6 px-8 text-center">
          <LeniaText
            as="h1"
            className={cn(
              "text-[clamp(2.5rem,8vw,7rem)] font-light tracking-[-0.04em] leading-[0.9]",
              isDark ? "text-white" : "text-[#1a1a1a]"
            )}
          >
            Lenia
          </LeniaText>
          <LeniaText
            as="p"
            className={cn(
              "text-[clamp(0.875rem,1.5vw,1.125rem)] font-light tracking-[0.02em] max-w-[480px]",
              isDark ? "text-white/60" : "text-black/50"
            )}
          >
            Move to seed life
          </LeniaText>
          <div
            data-lenia-reveal
            className="mt-4 flex items-center gap-3"
            style={{ opacity: 0 }}
          >
            <div
              className={cn(
                "h-px w-8",
                isDark ? "bg-white/15" : "bg-black/10"
              )}
            />
            <span
              className={cn(
                "text-[11px] uppercase tracking-[0.2em] font-light",
                isDark ? "text-white/45" : "text-black/40"
              )}
            >
              Continuous cellular automata
            </span>
            <div
              className={cn(
                "h-px w-8",
                isDark ? "bg-white/15" : "bg-black/10"
              )}
            />
          </div>
        </div>
      </Lenia>

      <button
        onClick={() => {
          setKey((k) => k + 1);
        }}
        className={cn(
          "absolute bottom-4 right-4 z-40 px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] rounded-md backdrop-blur-sm transition-colors",
          isDark
            ? "text-white/40 border border-white/10 bg-black/40 hover:text-white/60 hover:border-white/20"
            : "text-black/40 border border-black/10 bg-white/40 hover:text-black/60 hover:border-black/20"
        )}
      >
        Reset
      </button>
    </div>
  );
}

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
 * THEME HOOK — watches .dark class on <html> + parent chain
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
  /** Color stops for V concentration mapping: [V threshold, r, g, b] */
  colorStops: [number, number, number, number][];
  filmGrainAlpha: number;
  filmGrainValue: number;
  vignetteColor: string;
  vignetteOpacity: number;
  background: string;
}

const PALETTE_DARK: ThemePalette = {
  colorStops: [
    [0.0, 15, 15, 20],      // bg inside letters - very dark
    [0.1, 28, 26, 35],      // very dark subtle
    [0.25, 55, 50, 68],     // dark purple-gray
    [0.4, 100, 95, 115],    // mid lavender-gray
    [0.6, 155, 148, 168],   // light purple-gray
    [0.8, 200, 195, 210],   // bright lavender
    [1.0, 235, 230, 242],   // near-white
  ],
  filmGrainAlpha: 18,
  filmGrainValue: 25,
  vignetteColor: "0,0,0",
  vignetteOpacity: 0.35,
  background: "#0a0a0a",
};

const PALETTE_LIGHT: ThemePalette = {
  colorStops: [
    [0.0, 245, 242, 238],
    [0.1, 228, 222, 215],
    [0.25, 195, 185, 175],
    [0.4, 155, 145, 135],
    [0.6, 115, 105, 95],
    [0.8, 70, 62, 55],
    [1.0, 30, 25, 20],
  ],
  filmGrainAlpha: 14,
  filmGrainValue: 200,
  vignetteColor: "255,255,255",
  vignetteOpacity: 0.2,
  background: "#f5f2ee",
};

/* ────────────────────────────────────────────────────────────
 * COLOR INTERPOLATION — map V concentration to RGB
 * ──────────────────────────────────────────────────────────── */

function mapConcentrationToColor(
  v: number,
  stops: [number, number, number, number][]
): [number, number, number] {
  const clamped = Math.max(0, Math.min(1, v));
  // Find bounding stops
  for (let i = 0; i < stops.length - 1; i++) {
    const [t0, r0, g0, b0] = stops[i];
    const [t1, r1, g1, b1] = stops[i + 1];
    if (clamped >= t0 && clamped <= t1) {
      const t = t1 === t0 ? 0 : (clamped - t0) / (t1 - t0);
      return [
        Math.round(r0 + (r1 - r0) * t),
        Math.round(g0 + (g1 - g0) * t),
        Math.round(b0 + (b1 - b0) * t),
      ];
    }
  }
  const last = stops[stops.length - 1];
  return [last[1], last[2], last[3]];
}

/* ────────────────────────────────────────────────────────────
 * SDF MASK — render text into binary mask at sim resolution
 * ──────────────────────────────────────────────────────────── */

function createFullMask(
  width: number,
  height: number
): Uint8Array {
  const mask = new Uint8Array(width * height);
  mask.fill(1);
  return mask;
}

/* ────────────────────────────────────────────────────────────
 * REACTION-DIFFUSION SIMULATION STATE
 * ──────────────────────────────────────────────────────────── */

interface SimState {
  U: Float32Array;
  V: Float32Array;
  Unext: Float32Array;
  Vnext: Float32Array;
  mask: Uint8Array;
  width: number;
  height: number;
}

function createSimState(
  width: number,
  height: number,
  mask: Uint8Array
): SimState {
  const size = width * height;
  const U = new Float32Array(size);
  const V = new Float32Array(size);
  const Unext = new Float32Array(size);
  const Vnext = new Float32Array(size);

  // Initialize: U=1 everywhere, V=0.25 as base
  for (let i = 0; i < size; i++) {
    U[i] = 0.75;
    V[i] = 0.25;
  }

  // Add variation seeds spread across the field for pattern nucleation
  const numSeeds = 20;
  for (let s = 0; s < numSeeds; s++) {
    const cx = Math.floor(seeded(s, 173.9) * width);
    const cy = Math.floor(seeded(s, 311.3) * height);
    const radius = 6;

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy > radius * radius) continue;
        const nx = ((cx + dx) % width + width) % width;
        const ny = ((cy + dy) % height + height) % height;
        const ni = ny * width + nx;
        V[ni] = 0.5;
        U[ni] = 0.5;
      }
    }
  }

  return { U, V, Unext, Vnext, mask, width, height };
}

/* ────────────────────────────────────────────────────────────
 * GRAY-SCOTT SIMULATION STEP
 * ──────────────────────────────────────────────────────────── */

function simulateStep(
  sim: SimState,
  F: number,
  k: number,
  Du: number,
  Dv: number
) {
  const { U, V, Unext, Vnext, width, height } = sim;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const u = U[idx];
      const v = V[idx];

      // Toroidal Laplacian
      const left = U[y * width + ((x - 1 + width) % width)];
      const right = U[y * width + ((x + 1) % width)];
      const up = U[((y - 1 + height) % height) * width + x];
      const down = U[((y + 1) % height) * width + x];
      const lapU = left + right + up + down - 4 * u;

      const vLeft = V[y * width + ((x - 1 + width) % width)];
      const vRight = V[y * width + ((x + 1) % width)];
      const vUp = V[((y - 1 + height) % height) * width + x];
      const vDown = V[((y + 1) % height) * width + x];
      const lapV = vLeft + vRight + vUp + vDown - 4 * v;

      const uvv = u * v * v;

      Unext[idx] = u + Du * lapU - uvv + F * (1 - u);
      Vnext[idx] = v + Dv * lapV + uvv - (F + k) * v;

      Unext[idx] = Math.max(0, Math.min(1, Unext[idx]));
      Vnext[idx] = Math.max(0, Math.min(1, Vnext[idx]));
    }
  }

  sim.U.set(Unext);
  sim.V.set(Vnext);
}

/* ────────────────────────────────────────────────────────────
 * CURSOR INJECTION — inject chemical V in Gaussian pattern
 * ──────────────────────────────────────────────────────────── */

function injectAtCursor(
  sim: SimState,
  gridX: number,
  gridY: number,
  radius: number
) {
  const { V, width, height } = sim;
  const r2 = radius * radius;
  const sigma2 = 2 * r2;

  const minX = Math.max(0, Math.floor(gridX - radius * 3));
  const maxX = Math.min(width - 1, Math.ceil(gridX + radius * 3));
  const minY = Math.max(0, Math.floor(gridY - radius * 3));
  const maxY = Math.min(height - 1, Math.ceil(gridY + radius * 3));

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const idx = y * width + x;
      const dx = x - gridX;
      const dy = y - gridY;
      const dist2 = dx * dx + dy * dy;
      const injection = 0.3 * Math.exp(-dist2 / sigma2);
      V[idx] = Math.min(V[idx] + injection, 1.0);
    }
  }
}

/* ────────────────────────────────────────────────────────────
 * MORPHOGEN COMPONENT
 * ──────────────────────────────────────────────────────────── */

interface MorphogenProps {
  children?: ReactNode;
  /** Simulation grid width (default: 512) */
  gridWidth?: number;
  /** Simulation grid height (default: 384) */
  gridHeight?: number;
  /** Feed rate F (default: 0.037) */
  feedRate?: number;
  /** Kill rate k (default: 0.06) */
  killRate?: number;
  /** Diffusion rate of U (default: 0.21) */
  diffusionU?: number;
  /** Diffusion rate of V (default: 0.105) */
  diffusionV?: number;
  /** Cursor injection radius in cells (default: 5) */
  brushRadius?: number;
  /** Show film grain overlay (default: true) */
  filmGrain?: boolean;
  /** Show vignette (default: true) */
  vignette?: boolean;
  /** Additional className */
  className?: string;
}

export function Morphogen({
  children,
  gridWidth = 512,
  gridHeight = 384,
  feedRate = 0.037,
  killRate = 0.06,
  diffusionU = 0.21,
  diffusionV = 0.105,
  brushRadius = 5,
  filmGrain = true,
  vignette = true,
  className,
}: MorphogenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grainCanvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<SimState | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const rafRef = useRef<number>(0);
  const paletteRef = useRef<ThemePalette>(PALETTE_DARK);
  const maskReadyRef = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const revealedRef = useRef(false);
  const interactedRef = useRef(false);
  const isDark = useIsDark(containerRef);

  // Sync palette to ref
  useEffect(() => {
    paletteRef.current = isDark ? PALETTE_DARK : PALETTE_LIGHT;
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

  // Simulation + render loop
  const tick = useCallback(() => {
    const canvas = canvasRef.current;
    const sim = simRef.current;
    if (!canvas || !sim || !maskReadyRef.current) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const { width: gw, height: gh, V: simV, mask } = sim;
    const pal = paletteRef.current;

    // Map mouse position to sim grid coordinates
    if (mouseRef.current.active) {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const normX = mouseRef.current.x / rect.width;
        const normY = mouseRef.current.y / rect.height;
        const gridX = normX * gw;
        const gridY = normY * gh;
        injectAtCursor(sim, gridX, gridY, brushRadius);
      }
    }

    // Run 4 simulation iterations per frame (perf-balanced)
    const stepsPerFrame = 4;
    for (let s = 0; s < stepsPerFrame; s++) {
      simulateStep(sim, feedRate, killRate, diffusionU, diffusionV);
    }

    // Render simulation to display canvas (full background)
    const imgData = ctx.createImageData(canvasW, canvasH);
    const d = imgData.data;
    const scaleX = gw / canvasW;
    const scaleY = gh / canvasH;

    for (let py = 0; py < canvasH; py++) {
      for (let px = 0; px < canvasW; px++) {
        const gx = Math.floor(px * scaleX);
        const gy = Math.floor(py * scaleY);
        const gi = gy * gw + gx;
        const pi = (py * canvasW + px) * 4;

        const v = simV[gi];
        const [r, g, b] = mapConcentrationToColor(v, pal.colorStops);
        d[pi] = r;
        d[pi + 1] = g;
        d[pi + 2] = b;
        d[pi + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Trigger text reveal after first interaction
    if (!revealedRef.current && interactedRef.current) {
      revealedRef.current = true;
      setRevealed(true);
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [feedRate, killRate, diffusionU, diffusionV, brushRadius]);

  // Init simulation and canvas
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const grainCanvas = grainCanvasRef.current;
    if (!container || !canvas || !grainCanvas) return;

    const rect = container.getBoundingClientRect();
    // Render at half CSS resolution for performance (CPU-rendered)
    const canvasScale = 0.5;
    const displayW = Math.floor(rect.width * canvasScale);
    const displayH = Math.floor(rect.height * canvasScale);

    canvas.width = displayW;
    canvas.height = displayH;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    grainCanvas.width = Math.floor(rect.width * 0.5);
    grainCanvas.height = Math.floor(rect.height * 0.5);
    grainCanvas.style.width = `${rect.width}px`;
    grainCanvas.style.height = `${rect.height}px`;

    // Create full-field mask (entire background is active)
    const mask = createFullMask(gridWidth, gridHeight);
    maskReadyRef.current = true;
    simRef.current = createSimState(gridWidth, gridHeight, mask);

    // Film grain
    let grainInterval: ReturnType<typeof setInterval> | undefined;
    if (filmGrain) {
      const gCtx = grainCanvas.getContext("2d");
      if (gCtx) {
        generateFilmGrain(gCtx, grainCanvas.width, grainCanvas.height);
        grainInterval = setInterval(
          () => generateFilmGrain(gCtx, grainCanvas.width, grainCanvas.height),
          80
        );
      }
    }

    rafRef.current = requestAnimationFrame(tick);

    // Resize handler
    const onResize = () => {
      const r = container.getBoundingClientRect();
      const dw = Math.floor(r.width * 0.5);
      const dh = Math.floor(r.height * 0.5);

      canvas.width = dw;
      canvas.height = dh;
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;

      grainCanvas.width = Math.floor(r.width * 0.5);
      grainCanvas.height = Math.floor(r.height * 0.5);
      grainCanvas.style.width = `${r.width}px`;
      grainCanvas.style.height = `${r.height}px`;

      // Recompute full-field simulation
      const mask = createFullMask(gridWidth, gridHeight);
      maskReadyRef.current = true;
      simRef.current = createSimState(gridWidth, gridHeight, mask);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      if (grainInterval) clearInterval(grainInterval);
    };
  }, [gridWidth, gridHeight, filmGrain, generateFilmGrain, tick]);

  // Anime.js text reveal
  useEffect(() => {
    if (!revealed || !contentRef.current) return;

    const els = contentRef.current.querySelectorAll("[data-morphogen-reveal]");
    const tl = createTimeline({
      defaults: { duration: 900, ease: "outQuint" },
    });

    els.forEach((el, i) => {
      const chars = el.querySelectorAll(".morphogen-char");
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
      if (!interactedRef.current) interactedRef.current = true;
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
      {/* Reaction-diffusion canvas (full background) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ imageRendering: "auto" }}
      />

      {/* Blur backdrop behind text */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
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
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
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

export function MorphogenText({
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
      data-morphogen-reveal
      className={cn(className)}
      style={{ perspective: "600px" }}
    >
      {children.split("").map((char, i) => (
        <span
          key={i}
          className="morphogen-char inline-block"
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

export function MorphogenPreview() {
  const [key, setKey] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isDark = useIsDark(wrapperRef);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-[600px]"
      style={{ background: isDark ? "#0a0a0a" : "#f5f2ee" }}
    >
      <Morphogen
        key={key}
        gridWidth={256}
        gridHeight={192}
        feedRate={0.037}
        killRate={0.06}
        diffusionU={0.21}
        diffusionV={0.105}
        brushRadius={5}
        filmGrain
        vignette
        className="w-full h-full"
      >
        <div className="flex flex-col items-center gap-6 px-8 text-center">
          <MorphogenText
            as="h1"
            className={cn(
              "text-[clamp(2.5rem,8vw,7rem)] font-light tracking-[-0.04em] leading-[0.9]",
              isDark ? "text-white" : "text-[#1a1a1a]"
            )}
          >
            Morphogen
          </MorphogenText>
          <MorphogenText
            as="p"
            className={cn(
              "text-[clamp(0.875rem,1.5vw,1.125rem)] font-light tracking-[0.02em] max-w-[480px]",
              isDark ? "text-white/60" : "text-black/50"
            )}
          >
            Inject chemicals into the field
          </MorphogenText>
          <div
            data-morphogen-reveal
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
              Gray-Scott system
            </span>
            <div
              className={cn(
                "h-px w-8",
                isDark ? "bg-white/15" : "bg-black/10"
              )}
            />
          </div>
        </div>
      </Morphogen>

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

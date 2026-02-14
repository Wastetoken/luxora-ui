"use client";

import { useRef, useEffect, useCallback, useState, type ReactNode } from "react";
import { createTimeline, stagger } from "animejs";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────
 * SIMPLEX NOISE — compact 2D implementation
 * Adapted from Stefan Gustavson's GLSL noise (public domain)
 * ──────────────────────────────────────────────────────────── */

const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;
const grad3 = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];
const perm = new Uint8Array(512);
(() => {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = (Math.sin(i * 127.1 + 311.7) * 43758.5453) >>> 0;
    const k = j % (i + 1);
    [p[i], p[k]] = [p[k], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
})();

function noise2D(x: number, y: number): number {
  const s = (x + y) * F2;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const t = (i + j) * G2;
  const x0 = x - (i - t);
  const y0 = y - (j - t);
  const i1 = x0 > y0 ? 1 : 0;
  const j1 = x0 > y0 ? 0 : 1;
  const x1 = x0 - i1 + G2;
  const y1 = y0 - j1 + G2;
  const x2 = x0 - 1 + 2 * G2;
  const y2 = y0 - 1 + 2 * G2;
  const ii = i & 255;
  const jj = j & 255;
  let n0 = 0,
    n1 = 0,
    n2 = 0;
  let t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 > 0) {
    t0 *= t0;
    const gi = perm[ii + perm[jj]] % 8;
    n0 = t0 * t0 * (grad3[gi][0] * x0 + grad3[gi][1] * y0);
  }
  let t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 > 0) {
    t1 *= t1;
    const gi = perm[ii + i1 + perm[jj + j1]] % 8;
    n1 = t1 * t1 * (grad3[gi][0] * x1 + grad3[gi][1] * y1);
  }
  let t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 > 0) {
    t2 *= t2;
    const gi = perm[ii + 1 + perm[jj + 1]] % 8;
    n2 = t2 * t2 * (grad3[gi][0] * x2 + grad3[gi][1] * y2);
  }
  return 70 * (n0 + n1 + n2);
}

/* ────────────────────────────────────────────────────────────
 * SEEDED PRNG — deterministic random for particle init
 * ──────────────────────────────────────────────────────────── */

function seeded(i: number, salt: number): number {
  return (((Math.sin(i * salt + 311.7) * 43758.5453) % 1) + 1) % 1;
}

/* ────────────────────────────────────────────────────────────
 * PARTICLE DATA — with depth layers + heat tracking
 * ──────────────────────────────────────────────────────────── */

interface ParticleData {
  x: Float32Array;
  y: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  ox: Float32Array;
  oy: Float32Array;
  size: Float32Array;
  alpha: Float32Array;
  shade: Float32Array;
  depth: Float32Array;
  heat: Float32Array;
  eroded: Uint8Array;
  count: number;
}

function createParticles(w: number, h: number, count: number, clearR: number): ParticleData {
  const x = new Float32Array(count);
  const y = new Float32Array(count);
  const vx = new Float32Array(count);
  const vy = new Float32Array(count);
  const ox = new Float32Array(count);
  const oy = new Float32Array(count);
  const size = new Float32Array(count);
  const alpha = new Float32Array(count);
  const shade = new Float32Array(count);
  const depth = new Float32Array(count);
  const heat = new Float32Array(count);
  const eroded = new Uint8Array(count);

  const cols = Math.ceil(Math.sqrt(count * (w / h)));
  const rows = Math.ceil(count / cols);
  const cellW = w / cols;
  const cellH = h / rows;

  const cx = w / 2;
  const cy = h / 2;

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    let px = (col + seeded(i, 127.1)) * cellW;
    let py = Math.min((row + seeded(i, 269.5)) * cellH, h);

    // Push particles outside the clear zone
    if (clearR > 0) {
      const dx = px - cx;
      const dy = py - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < clearR + 10) {
        const angle = dist > 0.1 ? Math.atan2(dy, dx) : seeded(i, 999.1) * Math.PI * 2;
        const newDist = clearR + 10 + seeded(i, 831.2) * clearR * 0.7;
        px = Math.max(0, Math.min(w, cx + Math.cos(angle) * newDist));
        py = Math.max(0, Math.min(h, cy + Math.sin(angle) * newDist));
      }
    }

    x[i] = ox[i] = px;
    y[i] = oy[i] = py;
    vx[i] = 0;
    vy[i] = 0;
    depth[i] = seeded(i, 512.3);
    const baseSize = 1.5 + seeded(i, 43.7) * 2.5;
    size[i] = baseSize * (0.4 + depth[i] * 1.4);
    alpha[i] = 0.35 + seeded(i, 97.3) * 0.65;
    shade[i] = -8 + seeded(i, 173.9) * 16;
    heat[i] = 0;
    eroded[i] = 0;
  }

  return { x, y, vx, vy, ox, oy, size, alpha, shade, depth, heat, eroded, count };
}

/* ────────────────────────────────────────────────────────────
 * SHOCKWAVE — expanding ring of force
 * ──────────────────────────────────────────────────────────── */

interface Shockwave {
  cx: number;
  cy: number;
  radius: number;
  maxRadius: number;
  strength: number;
  born: number;
}

/* ────────────────────────────────────────────────────────────
 * GLOW SPRITE — pre-rendered radial gradient for ember effect
 * ──────────────────────────────────────────────────────────── */

function createGlowSprite(warm: boolean): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  if (warm) {
    g.addColorStop(0, "rgba(255,160,60,0.7)");
    g.addColorStop(0.25, "rgba(255,100,20,0.35)");
    g.addColorStop(0.6, "rgba(200,60,10,0.1)");
    g.addColorStop(1, "rgba(150,30,0,0)");
  } else {
    g.addColorStop(0, "rgba(160,90,30,0.5)");
    g.addColorStop(0.25, "rgba(130,60,15,0.25)");
    g.addColorStop(0.6, "rgba(100,40,10,0.08)");
    g.addColorStop(1, "rgba(80,20,0,0)");
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return c;
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
  emberRgb: [number, number, number];
  peakRgb: [number, number, number];
  filmGrainAlpha: number;
  filmGrainValue: number;
  vignetteColor: string;
  vignetteOpacity: number;
  shockwaveRgb: [number, number, number];
}

const PALETTE_DARK: ThemePalette = {
  grainRgb: [16, 16, 16],
  emberRgb: [220, 110, 30],
  peakRgb: [255, 220, 160],
  filmGrainAlpha: 18,
  filmGrainValue: 25,
  vignetteColor: "0,0,0",
  vignetteOpacity: 0.6,
  shockwaveRgb: [255, 160, 60],
};

const PALETTE_LIGHT: ThemePalette = {
  grainRgb: [235, 230, 224],
  emberRgb: [160, 80, 20],
  peakRgb: [220, 120, 30],
  filmGrainAlpha: 14,
  filmGrainValue: 200,
  vignetteColor: "255,255,255",
  vignetteOpacity: 0.4,
  shockwaveRgb: [180, 100, 30],
};

/* ────────────────────────────────────────────────────────────
 * EROSION COMPONENT
 * ──────────────────────────────────────────────────────────── */

interface ErosionProps {
  children?: ReactNode;
  /** Number of grain particles (default: 15000) */
  particleCount?: number;
  /** Cursor influence radius in px (default: 140) */
  erosionRadius?: number;
  /** Cursor repulsion strength — Coulomb constant (default: 8000) */
  erosionStrength?: number;
  /** Heal rate — how fast particles return (0-1, default: 0.008) */
  healRate?: number;
  /** Gravity in px/s² (default: 60) */
  gravity?: number;
  /** Perlin noise turbulence intensity (default: 30) */
  turbulence?: number;
  /** Tangential vortex force multiplier (default: 0.45) */
  vortexStrength?: number;
  /** Enable click-to-shockwave (default: true) */
  shockwaveOnClick?: boolean;
  /** Clear zone radius as fraction of min(width,height). 0 = no clear zone. (default: 0) */
  clearRadius?: number;
  /** Show flickering film grain overlay (default: true) */
  filmGrain?: boolean;
  /** Show edge vignette (default: true) */
  vignette?: boolean;
  /** Additional className */
  className?: string;
}

export function Erosion({
  children,
  particleCount = 15000,
  erosionRadius = 140,
  erosionStrength = 8000,
  healRate = 0.008,
  gravity = 60,
  turbulence = 30,
  vortexStrength = 0.45,
  shockwaveOnClick = true,
  clearRadius = 0,
  filmGrain = true,
  vignette = true,
  className,
}: ErosionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grainCanvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<ParticleData | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const prevMouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const paletteRef = useRef<ThemePalette>(PALETTE_DARK);
  const [revealed, setRevealed] = useState(false);
  const revealedRef = useRef(false);
  const detonationTimeRef = useRef(0);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const glowDarkRef = useRef<HTMLCanvasElement | null>(null);
  const glowLightRef = useRef<HTMLCanvasElement | null>(null);
  const isDark = useIsDark(containerRef);

  useEffect(() => {
    paletteRef.current = isDark ? PALETTE_DARK : PALETTE_LIGHT;
  }, [isDark]);

  // When clearRadius is active, reveal text on mount
  useEffect(() => {
    if (clearRadius > 0 && !revealedRef.current) {
      const timer = setTimeout(() => {
        revealedRef.current = true;
        setRevealed(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [clearRadius]);

  // Film grain generator
  const generateFilmGrain = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
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
  }, []);

  // Physics + render loop
  const tick = useCallback(() => {
    const canvas = canvasRef.current;
    const particles = particlesRef.current;
    if (!canvas || !particles) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const dpr = window.devicePixelRatio || 1;
    const dt = 1 / 60;
    const time = (timeRef.current += dt);
    const mx = mouseRef.current.x * dpr;
    const my = mouseRef.current.y * dpr;
    const mouseActive = mouseRef.current.active;
    const pal = paletteRef.current;
    const shockwaves = shockwavesRef.current;

    // Clear zone geometry
    const centerX = w / 2;
    const centerY = h / 2;
    const clearR = clearRadius > 0 ? Math.min(w, h) * clearRadius : 0;

    const windX = (mx - prevMouseRef.current.x) * 0.3;
    const windY = (my - prevMouseRef.current.y) * 0.3;
    prevMouseRef.current.x = mx;
    prevMouseRef.current.y = my;

    const { x, y, vx, vy, ox, oy, size, alpha, shade, depth, heat, eroded, count } = particles;

    const erosionRadSq = (erosionRadius * dpr) ** 2;
    const timeSinceDet = time - detonationTimeRef.current;
    const healSuppressed = detonationTimeRef.current > 0 && timeSinceDet < 3.5;

    // --- PROCESS SHOCKWAVES ---
    for (let s = shockwaves.length - 1; s >= 0; s--) {
      const sw = shockwaves[s];
      const age = time - sw.born;
      sw.radius += (600 + 200 / (1 + age * 2)) * dpr * dt;

      if (sw.radius > sw.maxRadius || age > 4) {
        shockwaves.splice(s, 1);
        continue;
      }

      const ringWidth = 100 * dpr;
      const fade = Math.max(0, 1 - age * 0.3);

      for (let i = 0; i < count; i++) {
        const pdx = x[i] - sw.cx;
        const pdy = y[i] - sw.cy;
        const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
        const ringDist = Math.abs(pdist - sw.radius);

        if (ringDist < ringWidth && pdist > 1) {
          const proximity = 1 - ringDist / ringWidth;
          const pushStr = sw.strength * proximity * proximity * fade * dt;
          const depthScale = 0.3 + depth[i] * 0.7;
          vx[i] += (pdx / pdist) * pushStr * depthScale;
          vy[i] += (pdy / pdist) * pushStr * depthScale;
          heat[i] = Math.min(1, heat[i] + 0.4 * proximity * fade);
          eroded[i] = 1;
        }
      }
    }

    // --- PHYSICS ---
    for (let i = 0; i < count; i++) {
      const dx = x[i] - mx;
      const dy = y[i] - my;
      const distSq = dx * dx + dy * dy;
      const depthScale = 0.3 + depth[i] * 0.7;

      // Cursor interaction: radial repulsion + tangential vortex
      if (mouseActive && distSq < erosionRadSq && distSq > 1) {
        const dist = Math.sqrt(distSq);
        const force = (erosionStrength * dpr) / Math.max(distSq, 400);
        const nx = dx / dist;
        const ny = dy / dist;
        const tx = -ny;
        const ty = nx;

        vx[i] += (nx * force + windX * 2) * dt * depthScale;
        vy[i] += (ny * force + windY * 2) * dt * depthScale;
        vx[i] += tx * force * vortexStrength * dt * depthScale;
        vy[i] += ty * force * vortexStrength * dt * depthScale;

        eroded[i] = 1;
      }

      // Clear zone boundary repulsion
      if (clearR > 0) {
        const cdx = x[i] - centerX;
        const cdy = y[i] - centerY;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cdist < clearR && cdist > 0.1) {
          const push = (clearR - cdist) * 1.5;
          vx[i] += (cdx / cdist) * push;
          vy[i] += (cdy / cdist) * push;
        }
        // Proximity heat — organic glowing ring
        const ringDist = Math.abs(cdist - clearR);
        const band = clearR * 0.35;
        if (ringDist < band) {
          const prox = 1 - ringDist / band;
          heat[i] = Math.max(heat[i], prox * prox * 0.14);
        }
      }

      if (eroded[i]) {
        vy[i] += gravity * dpr * dt * (0.5 + depth[i] * 0.5);

        const ns = 0.003;
        const turbScale = (1.5 - depth[i] * 0.8) * turbulence * dpr;
        const turbX = noise2D(x[i] * ns, y[i] * ns + time * 0.8) * turbScale;
        const turbY = noise2D(x[i] * ns + 100, y[i] * ns + 100 + time * 0.8) * turbScale;
        vx[i] += turbX * dt;
        vy[i] += turbY * dt;

        if (!healSuppressed && (!mouseActive || distSq > erosionRadSq * 4)) {
          const rs = healRate * 2;
          vx[i] += (ox[i] - x[i]) * rs;
          vy[i] += (oy[i] - y[i]) * rs;

          const hx = x[i] - ox[i];
          const hy = y[i] - oy[i];
          if (hx * hx + hy * hy < 4 && vx[i] * vx[i] + vy[i] * vy[i] < 1) {
            x[i] = ox[i];
            y[i] = oy[i];
            vx[i] = 0;
            vy[i] = 0;
            eroded[i] = 0;
          }
        }

        vx[i] *= 0.96;
        vy[i] *= 0.96;
      } else {
        // Ambient breathing
        const ans = 0.002;
        const amp = 2.0 * dpr * (1.2 - depth[i] * 0.6);
        x[i] = ox[i] + noise2D(ox[i] * ans + time * 0.12, oy[i] * ans) * amp;
        y[i] = oy[i] + noise2D(ox[i] * ans + 50, oy[i] * ans + time * 0.12 + 50) * amp;
      }

      // Heat accumulation from velocity
      const vel = Math.sqrt(vx[i] * vx[i] + vy[i] * vy[i]);
      heat[i] = Math.min(1, heat[i] + vel * 0.0006);
      heat[i] *= 0.993;
      if (heat[i] < 0.005) heat[i] = 0;

      // Integrate
      x[i] += vx[i] * dt * 60;
      y[i] += vy[i] * dt * 60;

      // Soft boundary bounce
      if (x[i] < 0) {
        x[i] = 0;
        vx[i] *= -0.3;
      }
      if (x[i] > w) {
        x[i] = w;
        vx[i] *= -0.3;
      }
      if (y[i] < 0) {
        y[i] = 0;
        vy[i] *= -0.3;
      }
      if (y[i] > h) {
        y[i] = h;
        vy[i] *= -0.3;
      }
    }

    // --- RENDER ---
    ctx.clearRect(0, 0, w, h);

    const [br, bg, bb] = pal.grainRgb;
    const [er, eg, eb] = pal.emberRgb;
    const [pr, pg, pb] = pal.peakRgb;

    // Pass 1: all particles with heat-based color
    for (let i = 0; i < count; i++) {
      const s = size[i] * dpr;
      const a = alpha[i];
      const sh = shade[i];
      const ht = heat[i];

      let cr: number, cg: number, cb: number;

      if (ht < 0.05) {
        cr = br + sh;
        cg = bg + sh;
        cb = bb + sh;
      } else if (ht < 0.5) {
        const t = (ht - 0.05) / 0.45;
        const tt = t * t;
        cr = br + sh + (er - br) * tt;
        cg = bg + sh + (eg - bg) * tt;
        cb = bb + sh + (eb - bb) * tt;
      } else {
        const t = (ht - 0.5) / 0.5;
        cr = er + (pr - er) * t;
        cg = eg + (pg - eg) * t;
        cb = eb + (pb - eb) * t;
      }

      cr = Math.max(0, Math.min(255, cr));
      cg = Math.max(0, Math.min(255, cg));
      cb = Math.max(0, Math.min(255, cb));

      ctx.fillStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${a.toFixed(2)})`;
      ctx.fillRect(x[i] - s * 0.5, y[i] - s * 0.5, s, s);
    }

    // Pass 2: additive glow for hot particles
    const glowSprite = isDark ? glowDarkRef.current : glowLightRef.current;
    if (glowSprite) {
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < count; i++) {
        if (heat[i] < 0.12) continue;
        const ht = heat[i];
        const glowSize = size[i] * dpr * (3 + ht * 8);
        ctx.globalAlpha = ht * ht * 0.35;
        ctx.drawImage(glowSprite, x[i] - glowSize * 0.5, y[i] - glowSize * 0.5, glowSize, glowSize);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    // Pass 3: shockwave ring visuals
    for (const sw of shockwaves) {
      const age = time - sw.born;
      const opacity = Math.max(0, 1 - age * 0.35);
      if (opacity <= 0) continue;

      const [sr, sg, sb] = pal.shockwaveRgb;

      const outerWidth = Math.max(1, (40 - age * 10) * dpr);
      ctx.strokeStyle = `rgba(${sr},${sg},${sb},${(opacity * 0.2).toFixed(3)})`;
      ctx.lineWidth = outerWidth;
      ctx.beginPath();
      ctx.arc(sw.cx, sw.cy, sw.radius, 0, Math.PI * 2);
      ctx.stroke();

      const innerWidth = Math.max(0.5, (16 - age * 5) * dpr);
      ctx.strokeStyle = `rgba(${pr},${pg},${pb},${(opacity * 0.35).toFixed(3)})`;
      ctx.lineWidth = innerWidth;
      ctx.beginPath();
      ctx.arc(sw.cx, sw.cy, sw.radius, 0, Math.PI * 2);
      ctx.stroke();

      if (age < 0.3) {
        const flash = 1 - age / 0.3;
        ctx.strokeStyle = `rgba(255,255,255,${(flash * flash * 0.4).toFixed(3)})`;
        ctx.lineWidth = innerWidth * 0.4;
        ctx.beginPath();
        ctx.arc(sw.cx, sw.cy, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Trigger detonation reveal (only when no clear zone)
    if (!revealedRef.current && clearR === 0) {
      let erodedCount = 0;
      for (let i = 0; i < count; i++) if (eroded[i]) erodedCount++;
      if (erodedCount > count * 0.06) {
        revealedRef.current = true;
        detonationTimeRef.current = time;
        const diag = Math.sqrt(w * w + h * h);
        shockwaves.push({
          cx: w / 2,
          cy: h / 2,
          radius: 0,
          maxRadius: diag,
          strength: 22000,
          born: time,
        });
        setRevealed(true);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [erosionRadius, erosionStrength, healRate, gravity, turbulence, vortexStrength, clearRadius, isDark]);

  // Init
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const grainCanvas = grainCanvasRef.current;
    if (!container || !canvas || !grainCanvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    grainCanvas.width = rect.width * 0.5;
    grainCanvas.height = rect.height * 0.5;
    grainCanvas.style.width = `${rect.width}px`;
    grainCanvas.style.height = `${rect.height}px`;

    const clearR = clearRadius > 0 ? Math.min(rect.width * dpr, rect.height * dpr) * clearRadius : 0;

    particlesRef.current = createParticles(rect.width * dpr, rect.height * dpr, particleCount, clearR);

    glowDarkRef.current = createGlowSprite(true);
    glowLightRef.current = createGlowSprite(false);

    let grainInterval: ReturnType<typeof setInterval> | undefined;
    if (filmGrain) {
      const gCtx = grainCanvas.getContext("2d");
      if (gCtx) {
        generateFilmGrain(gCtx, grainCanvas.width, grainCanvas.height);
        grainInterval = setInterval(() => generateFilmGrain(gCtx, grainCanvas.width, grainCanvas.height), 80);
      }
    }

    rafRef.current = requestAnimationFrame(tick);

    const onResize = () => {
      const r = container.getBoundingClientRect();
      const d = window.devicePixelRatio || 1;
      canvas.width = r.width * d;
      canvas.height = r.height * d;
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      grainCanvas.width = r.width * 0.5;
      grainCanvas.height = r.height * 0.5;
      grainCanvas.style.width = `${r.width}px`;
      grainCanvas.style.height = `${r.height}px`;
      const cr = clearRadius > 0 ? Math.min(r.width * d, r.height * d) * clearRadius : 0;
      particlesRef.current = createParticles(r.width * d, r.height * d, particleCount, cr);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      if (grainInterval) clearInterval(grainInterval);
    };
  }, [particleCount, clearRadius, filmGrain, generateFilmGrain, tick]);

  // Anime.js text reveal
  useEffect(() => {
    if (!revealed || !contentRef.current) return;

    const els = contentRef.current.querySelectorAll("[data-erosion-reveal]");
    const tl = createTimeline({
      defaults: { duration: 1200, ease: "outQuint" },
    });

    const startDelay = clearRadius > 0 ? 100 : 500;

    els.forEach((el, i) => {
      const chars = el.querySelectorAll(".erosion-char");
      if (chars.length > 0) {
        tl.add(
          chars,
          {
            y: [100, 0],
            opacity: [0, 1],
            rotateX: [120, 0],
            scale: [0.7, 1],
            delay: stagger(35, { from: "center" }),
            duration: 1400,
          },
          i === 0 ? startDelay : "-=1000",
        );
      } else {
        tl.add(el, { y: [60, 0], opacity: [0, 1], scale: [0.9, 1], duration: 1100 }, i === 0 ? startDelay : "-=800");
      }
    });
  }, [revealed, clearRadius]);

  // Mouse / touch tracking
  const handlePointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const c = containerRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
    const cy = "touches" in e ? e.touches[0].clientY : e.clientY;
    mouseRef.current.x = cx - rect.left;
    mouseRef.current.y = cy - rect.top;
    mouseRef.current.active = true;
  }, []);

  const handlePointerLeave = useCallback(() => {
    mouseRef.current.active = false;
  }, []);

  // Click shockwave
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!shockwaveOnClick) return;
      const c = containerRef.current;
      if (!c) return;
      const rect = c.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const cx = (e.clientX - rect.left) * dpr;
      const cy = (e.clientY - rect.top) * dpr;
      const diag = Math.sqrt((rect.width * dpr) ** 2 + (rect.height * dpr) ** 2);
      shockwavesRef.current.push({
        cx,
        cy,
        radius: 0,
        maxRadius: diag,
        strength: 16000,
        born: timeRef.current,
      });
    },
    [shockwaveOnClick],
  );

  const vignetteStyle = isDark
    ? `radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(${PALETTE_DARK.vignetteColor},${PALETTE_DARK.vignetteOpacity}) 100%)`
    : `radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(${PALETTE_LIGHT.vignetteColor},${PALETTE_LIGHT.vignetteOpacity}) 100%)`;

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full overflow-hidden select-none bg-[var(--gray-1)]", className)}
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onTouchEnd={handlePointerLeave}
      onClick={handleClick}
      style={{ cursor: "crosshair" }}
    >
      {/* Content — centered in the clear zone */}
      <div ref={contentRef} className="absolute inset-0 z-10 flex items-center justify-center">
        {children}
      </div>

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none" />

      {/* Film grain overlay */}
      {filmGrain && (
        <canvas
          ref={grainCanvasRef}
          className="absolute inset-0 z-30 pointer-events-none opacity-50"
          style={{ imageRendering: "pixelated" }}
        />
      )}

      {/* Vignette */}
      {vignette && <div className="absolute inset-0 z-30 pointer-events-none" style={{ background: vignetteStyle }} />}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 * HELPER — split text into animatable characters
 * ──────────────────────────────────────────────────────────── */

export function ErosionText({
  children,
  className,
  as: Tag = "h1",
}: {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  return (
    <Tag data-erosion-reveal className={cn("overflow-hidden", className)} style={{ perspective: "800px" }}>
      {children.split("").map((char, i) => (
        <span key={i} className="erosion-char inline-block" style={{ opacity: 0, transformOrigin: "center bottom" }}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Tag>
  );
}

/* ────────────────────────────────────────────────────────────
 * PREVIEW — registry showcase
 * ──────────────────────────────────────────────────────────── */

export function ErosionPreview() {
  const [key, setKey] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isDark = useIsDark(wrapperRef);

  return (
    <div ref={wrapperRef} className="relative w-full h-[600px]" style={{ background: isDark ? "#050505" : "#f5f2ee" }}>
      <Erosion
        key={key}
        particleCount={5000}
        erosionRadius={140}
        erosionStrength={8000}
        healRate={0.005}
        gravity={50}
        turbulence={30}
        vortexStrength={0.45}
        shockwaveOnClick
        clearRadius={0.38}
        filmGrain
        vignette
        className="w-full h-full"
      >
        <div className="flex flex-col items-center gap-6 px-8 text-center">
          <ErosionText
            as="h1"
            className={cn(
              "text-[clamp(3rem,10vw,8rem)] font-extralight tracking-[-0.06em] leading-[0.85]",
              isDark ? "text-white" : "text-[#1a1a1a]",
            )}
          >
            Erosion
          </ErosionText>
          <ErosionText
            as="p"
            className={cn(
              "text-[clamp(0.875rem,1.5vw,1.125rem)] font-light tracking-[0.02em] max-w-[480px]",
              isDark ? "text-white/50" : "text-black/45",
            )}
          >
            Move your cursor to erode
          </ErosionText>
          <div data-erosion-reveal className="mt-6 flex items-center gap-3" style={{ opacity: 0 }}>
            <div className={cn("h-px w-10", isDark ? "bg-white/15" : "bg-black/10")} />
            <span
              className={cn(
                "text-[11px] uppercase tracking-[0.2em] font-light",
                isDark ? "text-white/25" : "text-black/30",
              )}
            >
              Click anywhere for shockwave
            </span>
            <div className={cn("h-px w-10", isDark ? "bg-white/15" : "bg-black/10")} />
          </div>
        </div>
      </Erosion>

      <button
        onClick={() => {
          setKey((k) => k + 1);
        }}
        className={cn(
          "absolute bottom-4 right-4 z-40 px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] rounded-md backdrop-blur-sm transition-colors",
          isDark
            ? "text-white/40 border border-white/10 bg-black/40 hover:text-white/60 hover:border-white/20"
            : "text-black/40 border border-black/10 bg-white/40 hover:text-black/60 hover:border-black/20",
        )}
      >
        Reset
      </button>
    </div>
  );
}

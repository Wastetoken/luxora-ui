"use client";

import {
  useRef,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
} from "react";
import { animate, createTimeline, onScroll, splitText, stagger } from "animejs";
import { cn } from "@/lib/utils";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────
 * THEME HOOK
 * ──────────────────────────────────────────────────────────── */

function useIsDark(ref?: React.RefObject<HTMLElement | null>) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const check = () => {
      if (ref?.current) setDark(!!ref.current.closest(".dark"));
      else setDark(document.documentElement.classList.contains("dark"));
    };
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    if (ref?.current) {
      let el: HTMLElement | null = ref.current.parentElement;
      while (el && el !== document.documentElement) {
        obs.observe(el, { attributes: true, attributeFilter: ["class"] });
        el = el.parentElement;
      }
    }
    return () => obs.disconnect();
  }, [ref]);
  return dark;
}

/* ────────────────────────────────────────────────────────────
 * GLSL — "DIMENSIONAL BREACH"
 *
 * Storyboard:
 *   Act 1 (0-1.5s)  — Void. Stars slowly materialise.
 *   Act 2 (0.8-3.3s) — Spacetime TEARS. An organic portal
 *                       rips open at centre. Dimensional
 *                       energy floods through the breach.
 *   Act 3 (2-4s)     — Through the rift: a cosmic nebula
 *                       with dense star fields. Chromatic
 *                       aberration fractures light at the
 *                       dimensional boundary.
 *   Act 4 (4-6s)     — Text crystallises from the breach
 *                       energy. Each letter causes a
 *                       spacetime ripple on arrival.
 *   Ambient (6s+)    — Everything breathes. Mouse warps the
 *                       membrane. Gravitational wave pulses
 *                       emanate outward.
 *
 * Visual layers (back → front):
 *   1. Deep void with sparse twinkling stars
 *   2. Gravitational distortion field (UV warp near breach)
 *   3. Dimensional caustic light patterns on the void
 *   4. Breach portal (organic SDF with noise edges)
 *   5. Other dimension: domain-warped nebula + dense stars
 *   6. Plasma edge glow (white-hot → electric blue → violet)
 *   7. Dimensional particles orbiting the breach edge
 *   8. Gravitational wave concentric ripples
 *   9. Breach-opening flash pulse
 *  10. Vignette + gamma correction
 * ──────────────────────────────────────────────────────────── */

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const FRAG = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uMouse;
uniform float uProgress;
uniform float uStarBright;
uniform float uFlash;
uniform float uDark;
uniform float uZoom;

varying vec2 vUv;

#define PI 3.14159265359

/* ── noise primitives ── */
float hash(float n) { return fract(sin(n) * 43758.5453); }
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)),
           dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n = dot(i, vec2(1.0, 57.0));
  return mix(
    mix(hash(n),        hash(n + 1.0),  f.x),
    mix(hash(n + 57.0), hash(n + 58.0), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float f = 0.0, w = 0.5;
  for (int i = 0; i < 4; i++) {
    f += w * noise(p);
    p *= 2.03;
    w *= 0.495;
  }
  return f;
}

/* ── star field ── */
float starField(vec2 uv, float scale, float threshold) {
  vec2 gv = fract(uv * scale) - 0.5;
  vec2 id = floor(uv * scale);
  vec2 rnd = hash2(id);
  float d = length(gv - (rnd - 0.5) * 0.7);
  float b = hash(dot(id, vec2(13.0, 7.0)));
  float star = smoothstep(0.02 + 0.03 * b, 0.0, d);
  star *= step(threshold, b);
  star *= 0.6 + 0.4 * sin(uTime * (0.5 + b * 3.0) + b * 6.28);
  return star;
}

/* ── domain-warped cosmic nebula ── */
vec3 cosmicNebula(vec2 uv) {
  vec2 warp = vec2(
    fbm(uv * 1.8 + uTime * 0.03),
    fbm(uv * 1.8 + 100.0 - uTime * 0.02)
  );
  vec2 w = uv + warp * 0.35;
  float n1 = fbm(w * 2.5);
  float n2 = fbm(w * 1.5 + 50.0);

  vec3 col = vec3(0.0);
  col += vec3(0.08, 0.01, 0.20) * smoothstep(0.2, 0.8, n1);
  col += vec3(0.01, 0.07, 0.24) * smoothstep(0.3, 0.7, n2);
  col += vec3(0.14, 0.04, 0.06) * pow(n1 * n2, 1.5);
  return col;
}

/* ── organic breach SDF (position-based noise — no atan seam) ── */
float breachSDF(vec2 p, float progress) {
  float r = length(p);
  float shape = 0.13 * progress;
  shape += noise(p * 4.0 + uTime * 0.15) * 0.05 * progress;
  shape += noise(p * 8.0 - uTime * 0.22) * 0.02 * progress;
  shape *= 1.0 + 0.08 * sin(uTime * 0.7);
  shape *= smoothstep(0.0, 0.3, progress);
  return r - shape;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - uResolution * 0.5) / uResolution.y;
  vec2 uvOrig = uv;
  uv.y -= 0.18; // push breach upward — text lives below
  uv /= max(uZoom, 1.0); // scroll-driven zoom into breach center

  /* ── mouse membrane warp ── */
  vec2 mouseUV = (uMouse - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  float mDist  = length(uv - mouseUV);
  uv += (uv - mouseUV) / (mDist * mDist + 0.4) * 0.008;

  /* ── gravitational field near breach ── */
  float cDist = length(uv);
  uv += normalize(uv + 1e-6) * uProgress * 0.015 / (cDist + 0.2);

  /* ── breach SDF ── */
  float breach = breachSDF(uv, uProgress);
  float inside = smoothstep(0.008, -0.008, breach);
  float eDist  = abs(breach);
  float gInner = exp(-eDist * 60.0) * uProgress;
  float gMid   = exp(-eDist * 20.0) * uProgress;
  float gOuter = exp(-eDist * 6.0)  * uProgress;

  /* ── OUR DIMENSION (outside the breach) ── */
  vec3 ourSpace = vec3(0.008, 0.005, 0.015);

  // sparse stars
  float s1 = starField(uv, 40.0, 0.92) * uStarBright;
  float s2 = starField(uv + 100.0, 25.0, 0.95) * uStarBright;
  ourSpace += vec3(0.7, 0.8, 1.0) * s1 + vec3(1.0, 0.85, 0.7) * s2;

  // gravitational lensing near breach bends nearby stars
  float lensZone = smoothstep(0.35, 0.1, cDist) * uProgress;
  vec2 lensUV = uv + normalize(uv + 1e-6) * 0.05 * lensZone;
  ourSpace += vec3(0.5, 0.6, 1.0) * starField(lensUV, 35.0, 0.9) * lensZone * 0.8;

  // dimensional caustics on the void near breach
  float c1 = sin(uv.x * 20.0 + uTime * 0.5 + sin(uv.y * 15.0))
           * sin(uv.y * 18.0 - uTime * 0.3 + sin(uv.x * 12.0));
  float c2 = sin(uv.x * 15.0 - uTime * 0.4 + sin(uv.y * 20.0 + uTime * 0.2))
           * sin(uv.y * 22.0 + uTime * 0.6);
  ourSpace += vec3(0.1, 0.15, 0.3) * pow(max(0.0, c1 + c2), 3.0) * 0.025 * gOuter;

  /* ── OTHER DIMENSION (inside the breach) ── */
  float chrom = 0.012 * uProgress;
  vec3 otherDim;
  otherDim.r = cosmicNebula(uv + vec2(chrom, 0.0)).r;
  otherDim.g = cosmicNebula(uv).g;
  otherDim.b = cosmicNebula(uv - vec2(chrom, 0.0)).b;

  // dense inner star field
  otherDim += vec3(0.8, 0.85, 1.0)  * starField(uv, 60.0, 0.8)
            + vec3(1.0, 0.7, 0.9)   * starField(uv + 50.0, 80.0, 0.85) * 0.6
            + vec3(0.6, 0.9, 1.0)   * starField(uv + 150.0, 45.0, 0.88) * 0.4;
  otherDim *= 1.5;
  otherDim *= smoothstep(-0.06, -0.02, breach);
  otherDim += vec3(0.03, 0.01, 0.06);

  /* ── composite ── */
  vec3 color = mix(ourSpace, otherDim, inside);

  // edge plasma (white-hot → electric blue → violet)
  float eVar = noise(uv * 3.0 + uTime * 0.5) * 0.5 + 0.5;
  vec3 plasma  = vec3(0.95, 0.95, 1.0)  * gInner
               + vec3(0.3, 0.5, 1.0)    * gMid
               + vec3(0.35, 0.08, 0.55) * gOuter;
  plasma = mix(plasma, plasma * vec3(0.5, 1.0, 0.8), eVar * gMid);
  color += plasma * 2.5;

  // dimensional particles orbiting the breach
  for (int i = 0; i < 10; i++) {
    float fi = float(i);
    float pA = fi * PI * 2.0 / 10.0 + uTime * (0.15 + fi * 0.02);
    float pR = 0.13 * uProgress + noise(vec2(fi, uTime * 0.3)) * 0.04;
    vec2  pP = vec2(cos(pA), sin(pA)) * pR;
    float pD = length(uv - pP);
    color += mix(vec3(0.3, 0.5, 1.0), vec3(0.7, 0.3, 1.0), sin(fi * 1.3) * 0.5 + 0.5)
           * exp(-pD * 200.0) * uProgress * 1.5;
  }

  // gravitational wave ripples
  for (int w = 0; w < 3; w++) {
    float fw    = float(w);
    float wR    = mod(uTime * 0.8 + fw * 2.0, 6.0) * 0.15;
    float wDist = abs(cDist - wR);
    color += vec3(0.15, 0.1, 0.25)
           * exp(-wDist * 40.0) * 0.04 * uProgress
           * smoothstep(0.9, 0.0, wR);
  }

  // breach-opening flash
  color += vec3(0.25, 0.2, 0.5) * uFlash * (inside + gMid);

  // light-mode: radial dark island around breach, smooth fade to light bg
  if (uDark < 0.5) {
    vec3 lightBg = vec3(0.96, 0.95, 0.93);
    vec2 toBreach = uvOrig - vec2(0.0, 0.18);
    float darkMask = smoothstep(0.52, 0.18, length(toBreach * vec2(0.9, 1.0)));
    color = mix(lightBg, color, darkMask);
  }

  // vignette (dark mode only — light mode already has radial fade)
  if (uDark > 0.5) {
    color *= smoothstep(0.0, 0.6, 1.0 - length(uvOrig * vec2(0.8, 1.0)) * 0.7);
  }

  // gamma
  color = pow(max(color, vec3(0.0)), vec3(0.9));

  gl_FragColor = vec4(color, 1.0);
}
`;

/* ────────────────────────────────────────────────────────────
 * SINGULARITY COMPONENT
 * ──────────────────────────────────────────────────────────── */

interface SingularityParams {
  progress: number;
  starBright: number;
  flash: number;
  zoom: number;
  [key: string]: number;
}

interface SingularityProps {
  children?: ReactNode;
  filmGrain?: boolean;
  vignette?: boolean;
  className?: string;
  onParamsReady?: (params: SingularityParams, entryTl: ReturnType<typeof createTimeline>) => void;
}

export function Singularity({
  children,
  filmGrain = true,
  vignette = true,
  className,
  onParamsReady,
}: SingularityProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const grainCanvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });
  const rafRef = useRef<number>(0);
  const [revealed, setRevealed] = useState(false);
  const revealedRef = useRef(false);
  const isDark = useIsDark(containerRef);
  const isDarkRef = useRef(true);

  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  /* ── film grain ── */
  const generateGrain = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const dark = isDarkRef.current;
      const imgData = ctx.createImageData(w, h);
      const d = imgData.data;
      const gv = dark ? 20 : 180;
      const ga = dark ? 14 : 10;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * gv;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = ga;
      }
      ctx.putImageData(imgData, 0, 0);
    },
    [],
  );

  /* ── Three.js + anime.js storyboard ── */
  useEffect(() => {
    const container = containerRef.current;
    const mount = mountRef.current;
    const grainCanvas = grainCanvasRef.current;
    if (!container || !mount || !grainCanvas) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    /* renderer */
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
    });
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(dpr);
    mount.appendChild(renderer.domElement);

    /* shader material */
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(rect.width * dpr, rect.height * dpr),
        },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uProgress: { value: 0 },
        uStarBright: { value: 0 },
        uFlash: { value: 0 },
        uDark: { value: 1.0 },
        uZoom: { value: 1.0 },
      },
    });
    scene.add(new THREE.Mesh(geometry, material));

    /* ── STORYBOARD (anime.js v4 timeline) ── */
    const params: SingularityParams = { progress: 0, starBright: 0, flash: 0, zoom: 1 };

    const tl = createTimeline({ defaults: { ease: "outQuint" } });

    // Act 1 — stars emerge from the void
    tl.add(params, { starBright: [0, 0.35], duration: 1500 }, 0);

    // Act 2 — the breach tears open
    tl.add(
      params,
      { progress: [0, 1], duration: 2500, ease: "inOutCubic" },
      800,
    );

    // Dimensional flash at the tearing moment
    tl.add(params, { flash: [0, 1], duration: 200, ease: "outQuad" }, 1800);
    tl.add(params, { flash: [1, 0], duration: 800, ease: "outExpo" }, 2000);

    // Act 3 — stars reach full brightness
    tl.add(
      params,
      { starBright: [0.35, 1], duration: 2000, ease: "outCubic" },
      2000,
    );

    onParamsReady?.(params, tl);

    /* grain canvas */
    grainCanvas.width = rect.width * 0.5;
    grainCanvas.height = rect.height * 0.5;
    grainCanvas.style.width = `${rect.width}px`;
    grainCanvas.style.height = `${rect.height}px`;

    let grainInterval: ReturnType<typeof setInterval> | undefined;
    if (filmGrain) {
      const gCtx = grainCanvas.getContext("2d");
      if (gCtx) {
        generateGrain(gCtx, grainCanvas.width, grainCanvas.height);
        grainInterval = setInterval(
          () => generateGrain(gCtx, grainCanvas.width, grainCanvas.height),
          80,
        );
      }
    }

    /* smooth mouse */
    let smoothMX = 0.5;
    let smoothMY = 0.5;
    const startTime = performance.now();

    /* render loop */
    const loop = () => {
      const elapsed = (performance.now() - startTime) / 1000;

      // lerp mouse
      const targetMX = mouseRef.current.active ? mouseRef.current.x : 0.5;
      const targetMY = mouseRef.current.active ? mouseRef.current.y : 0.5;
      smoothMX += (targetMX - smoothMX) * 0.04;
      smoothMY += (targetMY - smoothMY) * 0.04;

      // push uniforms
      material.uniforms.uTime.value = elapsed;
      material.uniforms.uMouse.value.set(smoothMX, smoothMY);
      material.uniforms.uProgress.value = params.progress;
      material.uniforms.uStarBright.value = params.starBright;
      material.uniforms.uFlash.value = params.flash;
      material.uniforms.uDark.value = isDarkRef.current ? 1.0 : 0.0;
      material.uniforms.uZoom.value = params.zoom ?? 1.0;

      renderer.render(scene, camera);

      // trigger text reveal once breach is wide enough
      if (!revealedRef.current && params.progress > 0.6) {
        revealedRef.current = true;
        setRevealed(true);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    /* resize */
    const onResize = () => {
      const r = container.getBoundingClientRect();
      const d = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setSize(r.width, r.height);
      renderer.setPixelRatio(d);
      material.uniforms.uResolution.value.set(r.width * d, r.height * d);
      grainCanvas.width = r.width * 0.5;
      grainCanvas.height = r.height * 0.5;
      grainCanvas.style.width = `${r.width}px`;
      grainCanvas.style.height = `${r.height}px`;
    };
    window.addEventListener("resize", onResize);

    /* cleanup */
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      tl.pause();
      if (grainInterval) clearInterval(grainInterval);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement);
    };
  }, [filmGrain, generateGrain]);

  /* ── text reveal (triggered when breach opens) ── */
  useEffect(() => {
    if (!revealed || !contentRef.current) return;
    const els = contentRef.current.querySelectorAll(
      "[data-singularity-reveal]",
    );
    const revealTl = createTimeline({
      defaults: { duration: 1200, ease: "outExpo" },
    });
    els.forEach((el, i) => {
      const chars = el.querySelectorAll(".singularity-char");
      if (chars.length > 0) {
        revealTl.add(
          chars,
          {
            y: [80, 0],
            opacity: [0, 1],
            rotateX: [100, 0],
            scale: [0.5, 1],
            delay: stagger(45, { from: "center" }),
          },
          i === 0 ? 0 : "-=900",
        );
      } else {
        revealTl.add(
          el,
          { y: [40, 0], opacity: [0, 1] },
          i === 0 ? 0 : "-=800",
        );
      }
    });
  }, [revealed]);

  /* ── pointer tracking ── */
  const handlePointerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const c = containerRef.current;
      if (!c) return;
      const r = c.getBoundingClientRect();
      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      const cy = "touches" in e ? e.touches[0].clientY : e.clientY;
      mouseRef.current.x = Math.max(
        0,
        Math.min(1, (cx - r.left) / r.width),
      );
      mouseRef.current.y = Math.max(
        0,
        Math.min(1, (cy - r.top) / r.height),
      );
      mouseRef.current.active = true;
    },
    [],
  );
  const handlePointerLeave = useCallback(() => {
    mouseRef.current.active = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden select-none",
        className,
      )}
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onTouchEnd={handlePointerLeave}
      style={{ cursor: "crosshair" }}
    >
      {/* WebGL canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* content overlay — pinned to bottom, below the breach */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-10 pointer-events-none"
      >
        {children}
      </div>

      {/* film grain */}
      {filmGrain && (
        <canvas
          ref={grainCanvasRef}
          className="absolute inset-0 z-20 pointer-events-none opacity-25"
          style={{ imageRendering: "pixelated" }}
        />
      )}

      {/* vignette */}
      {vignette && (
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: isDark
              ? "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)"
              : "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(255,255,255,0.25) 100%)",
          }}
        />
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 * TEXT HELPER — splits text into individually animated chars
 * ──────────────────────────────────────────────────────────── */

export function SingularityText({
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
      data-singularity-reveal
      className={cn("overflow-hidden", className)}
      style={{ perspective: "800px" }}
    >
      {children.split("").map((char, i) => (
        <span
          key={i}
          className="singularity-char inline-block"
          style={{ opacity: 0, transformOrigin: "center bottom" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Tag>
  );
}

/* ────────────────────────────────────────────────────────────
 * PREVIEW — Scroll-driven breach dive + brand reveal
 * ──────────────────────────────────────────────────────────── */

export function SingularityPreview() {
  const [key, setKey] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const blackoutRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLSpanElement>(null);
  const scrollTlRef = useRef<ReturnType<typeof createTimeline> | null>(null);
  const scrollObsRef = useRef<ReturnType<typeof onScroll> | null>(null);
  const splitterRef = useRef<ReturnType<typeof splitText> | null>(null);
  const glowAnimRef = useRef<ReturnType<typeof animate> | null>(null);

  /* ── Callback: receives params + entryTl from Singularity once WebGL is ready ── */
  const handleParamsReady = useCallback((params: SingularityParams, entryTl: ReturnType<typeof createTimeline>) => {
    const wrapper = wrapperRef.current;
    const spacer = spacerRef.current;
    const hero = heroRef.current;
    const scrollHint = scrollHintRef.current;
    const blackout = blackoutRef.current;
    const brand = brandRef.current;
    const glow = glowRef.current;
    const logo = logoRef.current;
    const headline = headlineRef.current;
    const subtext = subtextRef.current;

    if (!wrapper || !spacer || !hero || !scrollHint || !blackout || !brand || !glow || !logo || !headline || !subtext) return;

    /* ── Split headline text into chars ── */
    const splitter = splitText(headline);
    splitterRef.current = splitter;

    /* ── Entry complete → build scroll timeline, create observer, enable scrolling ── */
    entryTl.then(() => {
      // Enable scrolling
      wrapper.style.overflowY = "auto";

      // Create scroll observer — container is now scrollable
      const obs = onScroll({
        container: wrapper,
        target: spacer,
        enter: "top top",
        leave: "bottom bottom",
        sync: 8,
      });
      scrollObsRef.current = obs;

      // Build scroll timeline linked to observer
      const tl = createTimeline({
        autoplay: obs,
        defaults: { ease: "linear" },
      });
      scrollTlRef.current = tl;

      /* ── Phase 1: Approach the Breach (0–35%) — 0→350 ── */

      // Hero text fade-out + pull toward breach center
      tl.add(hero, {
        opacity: [1, 0],
        translateY: [0, -50],
        scale: [1, 0.88],
        duration: 250,
      }, 0);

      // Scroll hint disappears
      tl.add(scrollHint, {
        opacity: [1, 0],
        duration: 50,
      }, 0);

      // Breach opens wider — more of other dimension visible
      tl.add(params, {
        progress: [1, 2],
        duration: 350,
      }, 0);

      // Zoom into the breach
      tl.add(params, {
        zoom: [1, 3],
        duration: 350,
      }, 0);

      // Stars dim — leaving our dimension
      tl.add(params, {
        starBright: [1, 0.3],
        duration: 300,
      }, 0);

      /* ── Phase 2: Through the Breach (35–60%) — 350→600 ── */

      // Deep zoom — breach fills entire screen
      tl.add(params, {
        zoom: [3, 14],
        duration: 250,
      }, 350);

      // Breach expands massively
      tl.add(params, {
        progress: [2, 4],
        duration: 250,
      }, 350);

      // Stars vanish
      tl.add(params, {
        starBright: [0.3, 0],
        duration: 150,
      }, 350);

      // Dimensional flash as we pass through
      tl.add(params, {
        flash: [0, 0.6],
        duration: 80,
      }, 380);
      tl.add(params, {
        flash: [0.6, 0],
        duration: 170,
      }, 460);

      // Blackout — the other dimension engulfs everything
      tl.add(blackout, {
        opacity: [0, 1],
        duration: 200,
      }, 450);

      /* ── Phase 3: Brand Reveal (60–100%) — 600→1000 ── */

      // Brand container fades in from the void
      tl.add(brand, {
        opacity: [0, 1],
        duration: 150,
      }, 650);

      // Ambient glow
      tl.add(glow, {
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 200,
      }, 680);

      // Logo emerges
      tl.add(logo, {
        opacity: [0, 1],
        scale: [0.7, 1],
        duration: 200,
      }, 700);

      // Headline chars stagger reveal
      if (splitter.chars.length > 0) {
        tl.add(splitter.chars, {
          opacity: [0, 1],
          translateY: [30, 0],
          rotateX: [45, 0],
          duration: 200,
          delay: stagger(15, { from: "center" }),
        }, 750);
      }

      // Subtext fades in last
      tl.add(subtext, {
        opacity: [0, 1],
        duration: 150,
      }, 880);

      // Fade in scroll hint
      animate(scrollHint, { opacity: [0, 1], duration: 600, ease: "outCubic" });

      // Ambient glow pulse loop
      glowAnimRef.current = animate(glow, {
        scale: [1, 1.15, 1],
        opacity: [0.8, 1, 0.8],
        duration: 4000,
        ease: "inOutSine",
        loop: true,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Cleanup on unmount / key change ── */
  useEffect(() => {
    return () => {
      splitterRef.current?.revert();
      scrollObsRef.current?.revert();
      scrollTlRef.current?.pause();
      glowAnimRef.current?.pause();
    };
  }, [key]);

  /* ── Reset handler ── */
  const handleReset = useCallback(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = 0;
      wrapperRef.current.style.overflowY = "hidden";
    }
    setKey((k) => k + 1);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="attractor-scroll-container relative w-full h-[600px]"
      style={{
        background: "#0a0a0a",
        overflowY: "hidden",
        scrollbarWidth: "none",
      }}
    >
      <style>{`
        .attractor-scroll-container::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Spacer — 500% height for smooth scroll travel */}
      <div ref={spacerRef} style={{ height: "500%" }}>
        {/* Sticky viewport — pins WebGL + overlays while scrolling */}
        <div className="sticky top-0 w-full h-[600px]">
          <Singularity key={key} filmGrain vignette className="w-full h-full" onParamsReady={handleParamsReady}>
            {/* Hero content — centered below breach */}
            <div ref={heroRef} className="flex flex-col items-center gap-5 px-8 text-center max-w-[900px]">
              {/* Pre-title */}
              <div
                data-singularity-reveal
                className="flex items-center gap-3"
                style={{ opacity: 0 }}
              >
                <div className="h-px w-10 bg-white/15" />
                <span className="text-[10px] uppercase tracking-[0.35em] font-light text-white/35">
                  Dimensional Event &middot; Year One
                </span>
                <div className="h-px w-10 bg-white/15" />
              </div>

              {/* Title */}
              <SingularityText
                as="h1"
                className="text-[clamp(2.5rem,7vw,5.5rem)] font-extralight tracking-[0.06em] leading-[0.85] uppercase text-white"
              >
                Singularity
              </SingularityText>

              {/* Subtitle */}
              <SingularityText
                as="p"
                className="text-[clamp(0.8rem,1.4vw,1.1rem)] font-light tracking-[0.04em] max-w-[440px] leading-relaxed text-white/50"
              >
                Some boundaries were never meant to be crossed
              </SingularityText>
            </div>
          </Singularity>

          {/* Scroll hint */}
          <div
            ref={scrollHintRef}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
            style={{ opacity: 0 }}
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/35 font-light">
              Scroll
            </span>
            <div className="w-px h-8" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }} />
          </div>

          {/* Blackout overlay */}
          <div
            ref={blackoutRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 25, opacity: 0, background: "#000" }}
          />

          {/* Brand reveal */}
          <div
            ref={brandRef}
            className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
            style={{ opacity: 0 }}
          >
            {/* Ambient glow */}
            <div
              ref={glowRef}
              className="absolute w-64 h-64 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
                opacity: 0,
              }}
            />
            <div className="flex flex-col items-center gap-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={logoRef}
                src="/logo.png"
                alt="Luxora"
                className="w-24 h-24 object-contain"
                style={{ opacity: 0, filter: "invert(1) brightness(1.2)" }}
              />
              <h2
                ref={headlineRef}
                className="text-white text-[clamp(1.8rem,4vw,3.2rem)] font-light tracking-[-0.02em] text-center"
                style={{ perspective: "600px" }}
              >
                Everything you always wanted
              </h2>
              <span
                ref={subtextRef}
                className="text-[11px] uppercase tracking-[0.2em] text-white/45"
                style={{ opacity: 0 }}
              >
                Luxora
              </span>
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="absolute top-4 right-4 z-40 px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] rounded-md backdrop-blur-sm transition-colors text-white/30 border border-white/[0.08] bg-black/30 hover:text-white/50 hover:border-white/15"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

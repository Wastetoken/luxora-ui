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
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
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
 * GLSL — Faithful port of Shadertoy tsBXW3
 * Cursor-driven gravitational lensing
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
uniform float uDiskBright;
uniform float uLensing;
uniform float uInclination;
uniform float uAzimuth;
uniform float uDark;
uniform float uZoom;

varying vec2 vUv;

#define PI 3.14159265359
#define _Speed 3.0
#define _Steps 22.0
#define _Size 0.3
#define DISK_STEPS 22

/* ── Hash / noise ── */
float hashF(float x){ return fract(sin(x)*152754.742); }
float hashV(vec2 x){ return hashF(x.x + hashF(x.y)); }

float value(vec2 p, float f){
  float bl = hashV(floor(p*f));
  float br = hashV(floor(p*f + vec2(1.,0.)));
  float tl = hashV(floor(p*f + vec2(0.,1.)));
  float tr = hashV(floor(p*f + vec2(1.,1.)));
  vec2 fr = fract(p*f);
  fr = (3. - 2.*fr)*fr*fr;
  float b = mix(bl, br, fr.x);
  float t = mix(tl, tr, fr.x);
  return mix(b, t, fr.y);
}

/* ── Background: procedural stars + faint nebula ── */
vec4 background(vec3 ray){
  vec2 uv = ray.xy;
  if(abs(ray.x) > 0.5) uv.x = ray.z;
  else if(abs(ray.y) > 0.5) uv.y = ray.z;

  float brightness = value(uv*3., 100.);
  float color = value(uv*2., 20.);
  brightness = pow(brightness, 256.);
  brightness = brightness*100.;
  brightness = clamp(brightness, 0., 1.);

  vec3 stars = brightness * mix(vec3(1., .6, .2), vec3(.2, .6, 1.), color);

  // Procedural nebula (replaces iChannel0 texture)
  float n1 = value(uv*4.5, 8.0);
  float n2 = value(uv*3.2+vec2(5.3,2.1), 6.0);
  float neb = n1*n2;
  vec4 nebulae = vec4(neb*0.8, neb*0.65, neb*0.9, 1.0);
  nebulae.xyz += nebulae.xxx + nebulae.yyy + nebulae.zzz;
  nebulae.xyz *= 0.25;
  nebulae *= nebulae; // ^2
  nebulae *= nebulae; // ^4
  nebulae *= nebulae; // ^8
  nebulae *= nebulae; // ^16

  nebulae.xyz += stars;
  return nebulae;
}

/* ── Volumetric disk ray march ── */
vec4 raymarchDisk(vec3 ray, vec3 zeroPos){
  vec3 position = zeroPos;
  float lengthPos = length(position.xz);
  float dist = min(1., lengthPos*(1./_Size)*0.5) * _Size * 0.4 * (1./_Steps) / max(abs(ray.y), 1e-4);

  position += dist*_Steps*ray*0.5;

  vec2 deltaPos;
  deltaPos.x = -zeroPos.z*0.01 + zeroPos.x;
  deltaPos.y = zeroPos.x*0.01 + zeroPos.z;
  deltaPos = normalize(deltaPos - zeroPos.xz);

  float parallel = dot(ray.xz, deltaPos);
  parallel /= sqrt(lengthPos);
  parallel *= 0.5;
  float redShift = parallel + 0.3;
  redShift *= redShift;
  redShift = clamp(redShift, 0., 1.);

  float disMix = clamp((lengthPos - _Size * 2.)*(1./_Size)*0.24, 0., 1.);
  vec3 insideCol = mix(vec3(1.0,0.8,0.0), vec3(0.5,0.13,0.02)*0.2, disMix);
  insideCol *= mix(vec3(0.4, 0.2, 0.1), vec3(1.6, 2.4, 4.0), redShift);
  insideCol *= 1.25;
  redShift += 0.12;
  redShift *= redShift;

  vec4 o = vec4(0.);

  for(int ii = 0; ii < DISK_STEPS; ii++){
    float i = float(ii);
    position -= dist * ray;

    float intensity = clamp(1. - abs((i - 0.8) * (1./_Steps) * 2.), 0., 1.);
    float lp = length(position.xz);
    float distMult = 1.;
    distMult *= clamp((lp - _Size * 0.75) * (1./_Size) * 1.5, 0., 1.);
    distMult *= clamp((_Size * 10. - lp) * (1./_Size) * 0.20, 0., 1.);
    distMult *= distMult;

    float u = lp + uTime * _Size * 0.3 + intensity * _Size * 0.2;

    vec2 xy;
    float rot = mod(uTime*_Speed, 8192.);
    xy.x = -position.z*sin(rot) + position.x*cos(rot);
    xy.y = position.x*sin(rot) + position.z*cos(rot);

    float xv = abs(xy.x / (xy.y + sign(xy.y)*1e-4));
    float angle = 0.02*atan(xv);

    float f = 70.;
    vec2 nuv = vec2(angle, u * (1./_Size) * 0.05);
    float ns = value(nuv, f);
    ns = ns*0.5 + 0.3*value(nuv, f*2.) + 0.2*value(nuv, f*4.);

    float extraWidth = ns * 1. * (1. - clamp(i * (1./_Steps)*2. - 1., 0., 1.));
    float alpha = clamp(ns*(intensity + extraWidth)*((1./_Size) * 10. + 0.01) * dist * distMult, 0., 1.);

    vec3 col = 2.*mix(vec3(0.3,0.2,0.15)*insideCol, insideCol, min(1.,intensity*2.));
    o = clamp(vec4(col*alpha + o.rgb*(1.-alpha), o.a*(1.-alpha) + alpha), vec4(0.), vec4(1.));

    float lps = lp * (1./_Size);
    o.rgb += redShift*(intensity*1. + 0.5)*(1./_Steps)*100.*distMult/(lps*lps);
  }

  o.rgb = clamp(o.rgb - 0.005, 0., 1.);
  return o;
}

/* ── Camera rotation ── */
void Rotate(inout vec3 vector, vec2 a){
  vector.yz = cos(a.y)*vector.yz + sin(a.y)*vec2(-1,1)*vector.zy;
  vector.xz = cos(a.x)*vector.xz + sin(a.x)*vec2(-1,1)*vector.zx;
}

void main(){
  vec2 fragCoord = gl_FragCoord.xy;

  // ~10 degree screen-space rotation for cinematic composition
  vec2 fragCoordRot;
  fragCoordRot.x = fragCoord.x*0.985 + fragCoord.y * 0.174;
  fragCoordRot.y = fragCoord.y*0.985 - fragCoord.x * 0.174;
  fragCoordRot += vec2(-0.04, -0.15) * uResolution.xy;

  // Camera ray — fixed screen, camera orbits the subject
  vec3 ray = normalize(vec3(
    (fragCoordRot - uResolution.xy*0.5) / uResolution.x,
    1.0
  ));

  vec3 pos = vec3(0., 0.05 / uZoom, -5.0 / uZoom);
  vec2 camAngle = vec2(uTime*0.1 + uAzimuth, uInclination + 0.1 + PI);

  float camDist = length(pos);
  Rotate(pos, camAngle);
  camAngle.xy -= min(0.3/camDist, PI) * vec2(1., 0.5);
  Rotate(ray, camAngle);

  vec4 col = vec4(0.);
  vec4 glow = vec4(0.);
  vec4 outCol = vec4(100.);

  float lensStrength = uLensing;

  for(int disks = 0; disks < 28; disks++){
    for(int h = 0; h < 8; h++){
      float dotpos = dot(pos, pos) + 1e-8;
      float invDist = inversesqrt(dotpos);
      float centDist = dotpos * invDist;
      float stepDist = 0.92 * abs(pos.y / (ray.y + sign(ray.y)*1e-6));
      float farLimit = centDist * 0.5;
      float closeLimit = centDist*0.1 + 0.05*centDist*centDist*(1./_Size);
      stepDist = min(stepDist, min(farLimit, closeLimit));

      float invDistSqr = invDist * invDist;
      float bendForce = stepDist * invDistSqr * _Size * 0.625 * lensStrength;
      ray = normalize(ray - (bendForce * invDist) * pos);
      pos += stepDist * ray;

      glow += vec4(1.2,1.1,1.,1.0) * (0.01*stepDist * invDistSqr * invDistSqr * clamp(centDist*2. - 1.2, 0., 1.)) * uDark;
    }

    float dist2 = length(pos);

    if(dist2 < _Size * 0.1){
      // Event horizon — black void in both themes
      vec3 voidCol = mix(vec3(0.04, 0.035, 0.03), vec3(0.0), uDark);
      outCol = vec4(col.rgb * col.a + voidCol * (1.-col.a) + glow.rgb * (1.-col.a), 1.);
      break;
    }
    else if(dist2 > _Size * 1000.){
      vec4 bg;
      if(uDark > 0.5){
        bg = background(ray);
      } else {
        bg = vec4(0.96, 0.95, 0.93, 1.0);
      }
      outCol = vec4(col.rgb*col.a + bg.rgb*(1.-col.a) + glow.rgb*(1.-col.a), 1.);
      break;
    }
    else if(abs(pos.y) <= _Size * 0.002){
      vec4 diskCol = raymarchDisk(ray, pos) * uDiskBright;
      pos.y = 0.;
      pos += abs(_Size * 0.001 / (ray.y + sign(ray.y)*1e-6)) * ray;
      col = vec4(diskCol.rgb*(1.-col.a) + col.rgb, col.a + diskCol.a*(1.-col.a));
    }
  }

  if(outCol.r >= 99.)
    outCol = vec4(col.rgb + glow.rgb*(col.a + glow.a), 1.);

  col = outCol;
  col.rgb = pow(max(col.rgb, vec3(0.)), vec3(0.6));

  gl_FragColor = col;
}
`;

/* ────────────────────────────────────────────────────────────
 * ATTRACTOR COMPONENT
 * ──────────────────────────────────────────────────────────── */

interface AttractorParams {
  diskBright: number;
  lensing: number;
  inclination: number;
  zoom: number;
  azimuth: number;
  [key: string]: number;
}

interface AttractorProps {
  children?: ReactNode;
  filmGrain?: boolean;
  vignette?: boolean;
  className?: string;
  onParamsReady?: (params: AttractorParams, entryTl: ReturnType<typeof createTimeline>) => void;
}

export function Attractor({
  children,
  filmGrain = true,
  vignette = true,
  className,
  onParamsReady,
}: AttractorProps) {
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

  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  const generateGrain = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const dark = isDarkRef.current;
      const imgData = ctx.createImageData(w, h);
      const d = imgData.data;
      const gv = dark ? 20 : 180;
      const ga = dark ? 14 : 10;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * gv;
        d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = ga;
      }
      ctx.putImageData(imgData, 0, 0);
    }, []
  );

  useEffect(() => {
    const container = containerRef.current;
    const mount = mountRef.current;
    const grainCanvas = grainCanvasRef.current;
    if (!container || !mount || !grainCanvas) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(dpr);
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uTime:        { value: 0 },
        uResolution:  { value: new THREE.Vector2(rect.width * dpr, rect.height * dpr) },
        uDiskBright:  { value: 0 },
        uLensing:     { value: 0 },
        uInclination: { value: 0.2 },
        uAzimuth:     { value: 0 },
        uDark:        { value: 1.0 },
        uZoom:        { value: 1.0 },
      },
    });
    scene.add(new THREE.Mesh(geometry, material));

    const params: AttractorParams = { diskBright: 0, lensing: 0, inclination: 0.1, zoom: 1, azimuth: 0 };

    const entryTl = createTimeline({
      defaults: { ease: "outQuint" },
    });
    entryTl.add(params, {
      lensing: [0, 1],
      duration: 2200,
    }, 0);
    entryTl.add(params, {
      diskBright: [0, 1],
      duration: 1800,
    }, 600);
    entryTl.add(params, {
      inclination: [0.1, 0.2],
      duration: 3000,
      ease: "outCubic",
    }, 0);

    onParamsReady?.(params, entryTl);

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
          () => generateGrain(gCtx, grainCanvas.width, grainCanvas.height), 80
        );
      }
    }

    // Cinematic camera — Steadicam feel with scroll-driven drift
    let smoothIncl = 0.1;
    let smoothAzim = 0.0;

    const startTime = performance.now();

    const loop = () => {
      const elapsed = (performance.now() - startTime) / 1000;

      // Subtle first-person camera drift when zooming into the black hole
      const zoomFactor = Math.max(0, ((params.zoom ?? 1) - 1) / 9); // 0→1 as zoom 1→10
      const driftAzim = Math.sin(elapsed * 0.4) * 0.04 * zoomFactor;
      const driftIncl = Math.cos(elapsed * 0.25) * 0.025 * zoomFactor;

      // Camera orbits around the black hole
      // Mouse X → azimuth orbit, Mouse Y → inclination tilt
      const targetIncl = mouseRef.current.active
        ? 0.08 + (1.0 - mouseRef.current.y) * 0.35
        : (params.inclination + driftIncl);
      const targetAzim = mouseRef.current.active
        ? (mouseRef.current.x - 0.5) * 0.6
        : ((params.azimuth ?? 0) + driftAzim);

      // Lerp speed: faster during scroll (0.06) for responsive feel, slow (0.025) at rest
      const lerpSpeed = zoomFactor > 0.01 ? 0.06 : 0.025;
      smoothIncl += (targetIncl - smoothIncl) * lerpSpeed;
      smoothAzim += (targetAzim - smoothAzim) * lerpSpeed;

      material.uniforms.uTime.value = elapsed;
      material.uniforms.uDiskBright.value = params.diskBright;
      material.uniforms.uLensing.value = params.lensing;
      material.uniforms.uInclination.value = smoothIncl;
      material.uniforms.uAzimuth.value = smoothAzim;
      material.uniforms.uDark.value = isDarkRef.current ? 1.0 : 0.0;
      material.uniforms.uZoom.value = params.zoom ?? 1.0;

      renderer.render(scene, camera);

      if (!revealedRef.current && params.diskBright > 0.6) {
        revealedRef.current = true;
        setRevealed(true);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    const onResize = () => {
      const r = container.getBoundingClientRect();
      const d = Math.min(window.devicePixelRatio || 1, 2.5);
      renderer.setSize(r.width, r.height);
      renderer.setPixelRatio(d);
      material.uniforms.uResolution.value.set(r.width * d, r.height * d);
      grainCanvas.width = r.width * 0.5;
      grainCanvas.height = r.height * 0.5;
      grainCanvas.style.width = `${r.width}px`;
      grainCanvas.style.height = `${r.height}px`;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      entryTl.pause();
      if (grainInterval) clearInterval(grainInterval);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [filmGrain, generateGrain]);

  useEffect(() => {
    if (!revealed || !contentRef.current) return;
    const els = contentRef.current.querySelectorAll("[data-attractor-reveal]");
    const tl = createTimeline({ defaults: { duration: 900, ease: "outQuint" } });
    els.forEach((el, i) => {
      const chars = el.querySelectorAll(".attractor-char");
      if (chars.length > 0) {
        tl.add(chars, {
          y: [60, 0], opacity: [0, 1], rotateX: [90, 0],
          delay: stagger(25, { from: "center" }),
        }, i === 0 ? 0 : "-=700");
      } else {
        tl.add(el, { y: [40, 0], opacity: [0, 1] }, i === 0 ? 0 : "-=700");
      }
    });
  }, [revealed]);

  const handlePointerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const c = containerRef.current;
      if (!c) return;
      const rect = c.getBoundingClientRect();
      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      const cy = "touches" in e ? e.touches[0].clientY : e.clientY;
      mouseRef.current.x = Math.max(0, Math.min(1, (cx - rect.left) / rect.width));
      mouseRef.current.y = Math.max(0, Math.min(1, (cy - rect.top) / rect.height));
      mouseRef.current.active = true;
    }, []
  );
  const handlePointerLeave = useCallback(() => {
    mouseRef.current.active = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full overflow-hidden select-none", className)}
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onTouchEnd={handlePointerLeave}
      style={{ cursor: "crosshair" }}
    >
      <div ref={mountRef} className="absolute inset-0 z-0" />

      <div
        ref={contentRef}
        className="absolute inset-0 z-10 pointer-events-none"
      >
        {children}
      </div>
      {filmGrain && (
        <canvas
          ref={grainCanvasRef}
          className="absolute inset-0 z-20 pointer-events-none opacity-25"
          style={{ imageRendering: "pixelated" }}
        />
      )}
      {vignette && (
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: isDark
              ? "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 35%, transparent 55%, transparent 80%, rgba(0,0,0,0.3) 100%)"
              : "linear-gradient(to top, rgba(245,242,238,0.5) 0%, rgba(245,242,238,0.15) 30%, transparent 50%)",
          }}
        />
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 * TEXT HELPER
 * ──────────────────────────────────────────────────────────── */

export function AttractorText({
  children, className, style, as: Tag = "h1",
}: { children: string; className?: string; style?: React.CSSProperties; as?: "h1" | "h2" | "h3" | "p" | "span" }) {
  return (
    <Tag data-attractor-reveal className={cn("overflow-hidden", className)} style={{ perspective: "600px", ...style }}>
      {children.split("").map((char, i) => (
        <span key={i} className="attractor-char inline-block" style={{ opacity: 0, transformOrigin: "center bottom" }}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Tag>
  );
}

/* ────────────────────────────────────────────────────────────
 * PREVIEW — Scroll-driven black hole aspiration + brand reveal
 * ──────────────────────────────────────────────────────────── */

export function AttractorPreview() {
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
  const isDark = useIsDark(wrapperRef);

  /* ── Callback: receives params + entryTl from Attractor once WebGL is ready ── */
  const handleParamsReady = useCallback((params: AttractorParams, entryTl: ReturnType<typeof createTimeline>) => {
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

    /* ── Split headline text into chars (ready for Phase 3) ── */
    const splitter = splitText(headline);
    splitterRef.current = splitter;

    /* ── Entry complete → build scroll timeline, create observer, enable scrolling ── */
    entryTl.then(() => {
      // Enable scrolling
      wrapper.style.overflowY = "auto";

      // Create scroll observer — container is now scrollable
      // High sync value = silky smooth, floaty space feel
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

      /* ── Phase 1: Departure (0–35%) — 0→350 ── */

      // Hero text fade-out + pull up + shrink
      tl.add(hero, {
        opacity: [1, 0],
        translateY: [0, -40],
        scale: [1, 0.9],
        duration: 250,
      }, 0);

      // Scroll hint disappears fast
      tl.add(scrollHint, {
        opacity: [1, 0],
        duration: 50,
      }, 0);

      // Shader: lensing ramps 1→3
      tl.add(params, {
        lensing: [1, 3],
        duration: 350,
      }, 0);

      // Shader: disk dims smoothly as we rise above the plane
      tl.add(params, {
        diskBright: [1, 0.3],
        duration: 350,
      }, 0);

      // Shader: zoom 1→2.5 (gentle approach)
      tl.add(params, {
        zoom: [1, 2.5],
        duration: 350,
      }, 0);

      // Shader: inclination 0.2→0.7 (rise above disk for polar dive)
      // This makes the event horizon grow as a dark circle, not orange disk
      tl.add(params, {
        inclination: [0.2, 0.7],
        duration: 350,
      }, 0);

      // Subtle azimuth drift — camera orbits slightly like falling human
      tl.add(params, {
        azimuth: [0, 0.12],
        duration: 350,
      }, 0);

      /* ── Phase 2: Event Horizon (35–60%) — 350→600 ── */

      // Shader: extreme lensing
      tl.add(params, {
        lensing: [3, 8],
        duration: 250,
      }, 350);

      // Shader: deep zoom — diving into singularity
      tl.add(params, {
        zoom: [2.5, 12],
        duration: 250,
      }, 350);

      // Disk fully fades
      tl.add(params, {
        diskBright: [0.3, 0],
        duration: 150,
      }, 350);

      // Inclination continues upward — full polar view
      tl.add(params, {
        inclination: [0.7, 1.0],
        duration: 250,
      }, 350);

      // Azimuth drifts back — disorienting spiral
      tl.add(params, {
        azimuth: [0.12, -0.08],
        duration: 250,
      }, 350);

      // Blackout overlay — event horizon swallows everything
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

      // Ambient glow pulse loop (runs independently)
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

  /* ── Cleanup splitter + scroll observer on unmount / key change ── */
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
    // Reset scroll position before re-keying
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
        background: "#000",
        overflowY: "hidden",
        scrollbarWidth: "none",
      }}
    >
      <style>{`
        .attractor-scroll-container::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Spacer creates scroll distance — 300% of container height */}
      <div ref={spacerRef} style={{ height: "500%" }}>
        {/* Sticky viewport — pins WebGL + overlays while scrolling */}
        <div className="sticky top-0 w-full h-[600px]">
          <Attractor key={key} filmGrain vignette className="w-full h-full" onParamsReady={handleParamsReady}>
            {/* Hero content — bottom-left */}
            <div ref={heroRef} className="absolute inset-0 flex flex-col justify-end px-10 pb-12 sm:px-14 sm:pb-16">
              {/* Tag */}
              <div data-attractor-reveal className="mb-5 flex items-center gap-2.5" style={{ opacity: 0 }}>
                <div className="h-px w-6 bg-white/20" />
                <span className="text-[11px] uppercase tracking-[0.2em] font-light text-white/50">
                  Schwarzschild spacetime
                </span>
              </div>

              {/* Headline */}
              <AttractorText
                as="h1"
                className="text-[clamp(2.8rem,6vw,5rem)] font-medium tracking-[-0.035em] leading-[1.05] max-w-[600px] text-white"
              >
                Beyond the event horizon
              </AttractorText>

              {/* Description */}
              <p
                data-attractor-reveal
                className="mt-5 text-[15px] leading-[1.6] max-w-[420px] text-white/60"
                style={{ opacity: 0 }}
              >
                Real-time gravitational ray tracing with relativistic
                accretion disk, Doppler beaming, and photon sphere lensing.
              </p>

              {/* CTAs */}
              <div data-attractor-reveal className="mt-8 flex items-center gap-3 pointer-events-auto" style={{ opacity: 0 }}>
                <button className="px-5 py-2.5 text-[13px] font-medium rounded-lg transition-all bg-white text-black hover:bg-white/90">
                  Get started
                </button>
                <button className="px-5 py-2.5 text-[13px] font-medium rounded-lg transition-all text-white/70 border border-white/[0.12] hover:bg-white/[0.06] hover:text-white/90">
                  Documentation
                </button>
              </div>
            </div>
          </Attractor>

          {/* Scroll hint — appears after entry animation */}
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

          {/* Blackout overlay — fades in during Phase 2 */}
          <div
            ref={blackoutRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 25, opacity: 0, background: "#000" }}
          />

          {/* Brand reveal — appears from void in Phase 3 */}
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
                alt="Opale UI"
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
                Opale UI
              </span>
            </div>
          </div>

          {/* Reset button — inside sticky so it stays visible */}
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

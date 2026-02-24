"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

const IMAGE_URLS = [
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/AlmostCentralPurple.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueAndBlack.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueAndRed.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueHalfDome.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueLiquidFlow.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueWhiteAndOrangeLiqiudFlow.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueWithWhiteHighlight.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueYellowAndPink.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BluesAndPinkSwirl.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/CentralBlue.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/CentralBlueBreakthrough.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/CentralGreenMuted.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/CentralWhiteShineOnBlue.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/DarkGreenShine.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/DarkWithHope.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/DepressedAndCold.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/DepressedAndWarmOne.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/DepressedAndWarmTwo.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/LightBlue.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/LookOutTheWindowBlur.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/MellowPeachFilm.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/MutedAndSoft.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/MutedWithRed.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/NakedAndMuted.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/NotFullyRipeLemon.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/OrangeAndPinkNeon.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/OrangeHalves.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/OrangeToDarkerOrange.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/PeachVibe.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/Pearl.png",
];

function prettyName(url: string) {
  return url.split("/").pop()!.replace(".png", "").replace(/([A-Z])/g, " $1").trim();
}

// ── Vertex shader ──
const vertexShader = `
  varying vec2 v_uv;
  void main(){ v_uv = uv; gl_Position = vec4(position,1.0); }
`;

// ── Fragment shader with FBM liquid distortion + chromatic aberration + liquid wipe transition ──
const fragmentShader = `
  precision mediump float;
  uniform float u_time;
  uniform vec2  u_mouse;
  uniform vec2  u_resolution;
  uniform sampler2D u_texture;
  uniform sampler2D u_texPrev;
  uniform float u_transition;
  uniform vec2  u_transDir;
  varying vec2 v_uv;
  #define PI 3.14159265359

  vec2 hash22(vec2 p){
    p = vec2(dot(p,vec2(47.1,31.7)),dot(p,vec2(269.5,183.3)));
    return -1.0+2.0*fract(sin(p)*437958.5453123);
  }
  float noise(vec2 p){
    vec2 i=floor(p), f=fract(p);
    vec2 u=f*f*(3.0-2.0*f);
    return mix(
      mix(dot(hash22(i+vec2(0,0)),f-vec2(0,0)),dot(hash22(i+vec2(1,0)),f-vec2(1,0)),u.x),
      mix(dot(hash22(i+vec2(0,1)),f-vec2(0,1)),dot(hash22(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);
  }
  float fbm(vec2 p){
    float s=0.0,a=0.5;
    for(int i=0;i<6;i++){ s+=a*noise(p); p*=2.0; a*=0.5; }
    return s;
  }

  /* Liquid wipe transition using FBM turbulence */
  float liquidMask(vec2 uv, float progress, vec2 dir){
    float sweep = dot(uv - 0.5, dir) + 0.5;
    vec2 uvt = uv * 3.2 + dir * u_time * 0.18;
    float turb = fbm(uvt) * 0.38;
    float edge = smoothstep(
      progress - 0.22,
      progress + 0.22,
      sweep + turb
    );
    float ring = length(uv - 0.5) * 1.4;
    float pulse = smoothstep(progress - 0.04, progress + 0.04, ring) * 0.18;
    return clamp(edge + pulse, 0.0, 1.0);
  }

  vec3 sampleDistorted(sampler2D tex, vec2 uv){
    vec2 uvA = uv;
    uvA.x *= u_resolution.x / u_resolution.y;
    vec2 m = u_mouse;
    m.x *= u_resolution.x / u_resolution.y;
    float dist = length(uvA - m);
    float mi = 0.05 / (0.01 + dist * 0.5);
    float t = u_time * 0.01;
    float ds = 0.012 + 0.028 * cos(t * 1.3);
    vec2 dv = vec2(fbm(uvA + t*0.022 + vec2(0.1)), fbm(uvA + vec2(7.7,2.3) + t*0.015));
    dv *= ds * (1.0 + mi * 4.5);
    vec2 md = normalize(uvA - m + 0.0001);
    float vs = -0.055 * mi;
    float va = atan(uvA.y - m.y, uvA.x - m.x);
    float vd = dist * 4.0;
    vec2 duv = uv + dv + md * mi * 0.018;
    duv += vec2(cos(va + vd) * vs, sin(va + vd) * vs);
    // Chromatic aberration
    float str = 0.008 + 0.01 * mi;
    vec2 c = vec2(0.1);
    vec2 d2 = normalize(duv - c);
    float e = smoothstep(0.0, 0.3, length(duv - c)) * str * 1.4;
    return vec3(
      texture2D(tex, duv - d2*e*0.9).r,
      texture2D(tex, duv - d2*e*0.55).g,
      texture2D(tex, duv - d2*e*0.45).b
    );
  }

  void main(){
    vec2 uv = v_uv;
    vec3 colNext = sampleDistorted(u_texture, uv);
    vec3 colPrev = sampleDistorted(u_texPrev, uv);

    float mask = liquidMask(uv, u_transition, normalize(u_transDir));
    vec3 col = mix(colPrev, colNext, mask);

    // Vignette
    float vig = 1.0 - smoothstep(0.3, 0.85, length(uv - 0.5) * 1.9);
    col *= mix(0.78, 1.0, vig);

    // Subtle scanline
    float scan = sin(uv.y * u_resolution.y * 1.5) * 0.012;
    col -= scan;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Geist+Mono:wght@300;400&display=swap');

  .lgal-wrap {
    overflow: hidden;
    background: #000;
    width: 100%;
    height: 100vh;
    font-family: 'Geist Mono', monospace;
    cursor: none;
  }

  .lgal-strip {
    position: fixed;
    top: 0; right: 0;
    width: 96px;
    height: 100%;
    background: rgba(10,10,14,0.72);
    backdrop-filter: blur(24px) saturate(1.4);
    border-left: 1px solid rgba(255,255,255,0.07);
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 0;
    gap: 6px;
    z-index: 10;
  }
  .lgal-strip::-webkit-scrollbar { display: none; }

  .lgal-strip-header {
    width: 100%;
    padding: 0 8px 10px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 4px;
    text-align: center;
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
  }

  .lgal-thumb {
    position: relative;
    flex: 0 0 auto;
    width: 72px; height: 72px;
    border-radius: 8px;
    overflow: hidden;
    cursor: none;
    border: 1.5px solid transparent;
    transition: border-color 0.25s, box-shadow 0.25s;
    transform-style: preserve-3d;
    will-change: transform;
  }
  .lgal-thumb img {
    width: 100%; height: 100%;
    object-fit: cover;
    border-radius: 6px;
    filter: brightness(0.65) saturate(0.8);
    transition: filter 0.3s;
  }
  .lgal-thumb:hover img { filter: brightness(1.0) saturate(1.2); }
  .lgal-thumb.active {
    border-color: #c8ff3e;
    box-shadow: 0 0 0 1px rgba(200,255,62,0.15), 0 0 20px rgba(200,255,62,0.12);
  }
  .lgal-thumb.active img { filter: brightness(1.0) saturate(1.2); }

  .lgal-thumb-idx {
    position: absolute;
    bottom: 4px; left: 5px;
    font-size: 9px;
    color: rgba(255,255,255,0.4);
    pointer-events: none;
    line-height: 1;
  }
  .lgal-thumb.active .lgal-thumb-idx { color: #c8ff3e; }

  .lgal-thumb::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 7px;
    background: radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(200,255,62,0.18) 0%, transparent 65%);
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
  }
  .lgal-thumb:hover::after { opacity: 1; }

  .lgal-nav {
    position: fixed;
    top: 50%;
    z-index: 20;
    background: rgba(15,15,18,0.55);
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.7);
    width: 40px; height: 40px;
    border-radius: 50%;
    font-size: 15px;
    cursor: none;
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(12px);
    transition: background 0.2s, border-color 0.2s, color 0.2s;
    transform: translateY(-50%);
  }
  .lgal-nav:hover {
    background: rgba(200,255,62,0.1);
    border-color: rgba(200,255,62,0.4);
    color: #c8ff3e;
  }
  .lgal-prev { left: 16px; }
  .lgal-next { right: 110px; }

  .lgal-label {
    position: fixed;
    top: 22px; left: 50%;
    transform: translateX(calc(-50% - 48px));
    color: rgba(255,255,255,0.75);
    font-family: 'DM Serif Display', serif;
    font-style: italic;
    font-size: 15px;
    letter-spacing: 0.02em;
    text-shadow: 0 1px 8px rgba(0,0,0,0.9);
    white-space: nowrap;
    pointer-events: none;
    z-index: 10;
  }

  .lgal-counter {
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(calc(-50% - 48px));
    font-size: 10px;
    letter-spacing: 0.14em;
    color: rgba(255,255,255,0.25);
    pointer-events: none;
    z-index: 10;
  }
  .lgal-counter span { color: rgba(255,255,255,0.6); }

  .lgal-cursor {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: exclusion;
  }
  .lgal-cursor-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #c8ff3e;
    position: absolute;
    top: -4px; left: -4px;
    transition: transform 0.08s ease;
  }
  .lgal-cursor-ring {
    width: 36px; height: 36px;
    border-radius: 50%;
    border: 1px solid rgba(200,255,62,0.6);
    position: absolute;
    top: -18px; left: -18px;
    transition: transform 0.18s ease, width 0.18s ease, height 0.18s ease, top 0.18s ease, left 0.18s ease;
  }
`;

export const LiquidGallery = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [label, setLabel] = useState(prettyName(IMAGE_URLS[0]));
  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Store Three.js state in a ref so we can access it from event handlers
  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    uniforms: Record<string, { value: any }>;
    texCache: Map<string, THREE.Texture>;
    loader: THREE.TextureLoader;
    transitioning: boolean;
  } | null>(null);

  const currentIndexRef = useRef(0);

  const getOrLoadTexture = useCallback((url: string): Promise<THREE.Texture> => {
    const state = threeRef.current;
    if (!state) return Promise.reject();
    if (state.texCache.has(url)) return Promise.resolve(state.texCache.get(url)!);
    return new Promise((resolve) => {
      state.loader.load(url, (tex) => {
        tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.minFilter = THREE.LinearFilter;
        state.texCache.set(url, tex);
        resolve(tex);
      });
    });
  }, []);

  function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  const runTransition = useCallback(async (fromTex: THREE.Texture, toTex: THREE.Texture, dir: number[]) => {
    const state = threeRef.current;
    if (!state) return;
    const { uniforms } = state;

    return new Promise<void>((resolve) => {
      uniforms.u_texPrev.value = fromTex;
      uniforms.u_texture.value = toTex;
      uniforms.u_transDir.value.set(dir[0], dir[1]).normalize();
      uniforms.u_transition.value = 0;
      state.transitioning = true;

      const duration = 900;
      const start = performance.now();
      function step(now: number) {
        const raw = Math.min((now - start) / duration, 1.0);
        uniforms.u_transition.value = easeInOutCubic(raw);
        if (raw < 1.0) requestAnimationFrame(step);
        else { state!.transitioning = false; resolve(); }
      }
      requestAnimationFrame(step);
    });
  }, []);

  const switchTo = useCallback(async (idx: number, dir: number[] | null = null) => {
    const state = threeRef.current;
    if (!state || state.transitioning) return;
    idx = ((idx % IMAGE_URLS.length) + IMAGE_URLS.length) % IMAGE_URLS.length;
    const prevIdx = currentIndexRef.current;
    if (idx === prevIdx && state.uniforms.u_texture.value) return;

    if (dir === null) dir = idx > prevIdx ? [1, 0] : [-1, 0];

    currentIndexRef.current = idx;
    setCurrentIndex(idx);
    setLabel(prettyName(IMAGE_URLS[idx]));

    // Scroll thumb into view
    thumbRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "nearest" });

    const [fromTex, toTex] = await Promise.all([
      state.uniforms.u_texture.value
        ? Promise.resolve(state.uniforms.u_texture.value)
        : getOrLoadTexture(IMAGE_URLS[prevIdx]),
      getOrLoadTexture(IMAGE_URLS[idx]),
    ]);

    await runTransition(fromTex, toTex, dir);

    // Preload neighbors
    for (let d = 1; d <= 3; d++) {
      getOrLoadTexture(IMAGE_URLS[(idx + d) % IMAGE_URLS.length]);
      getOrLoadTexture(IMAGE_URLS[((idx - d) + IMAGE_URLS.length) % IMAGE_URLS.length]);
    }
  }, [getOrLoadTexture, runTransition]);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const STRIP_W = 96;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    } catch (e) {
      console.error("LiquidGallery: WebGL context creation failed", e);
      return;
    }
    const gl = renderer.getContext();
    if (!gl) {
      console.error("LiquidGallery: No WebGL context available");
      renderer.dispose();
      return;
    }
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%;";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    camera.position.z = 1;

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";

    const uniforms: Record<string, { value: any }> = {
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_resolution: { value: new THREE.Vector2() },
      u_texture: { value: null },
      u_texPrev: { value: null },
      u_transition: { value: 0.0 },
      u_transDir: { value: new THREE.Vector2(1.0, 0.0) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    threeRef.current = {
      renderer,
      uniforms,
      texCache: new Map(),
      loader,
      transitioning: false,
    };

    // Force initial compile to catch shader errors
    renderer.compile(scene, camera);
    const programs = renderer.info.programs;
    if (programs && programs.length > 0) {
      console.log("LiquidGallery: Shader compiled successfully");
    }

    function resize() {
      const w = window.innerWidth - STRIP_W;
      const h = window.innerHeight;
      renderer.setSize(w, h, true);
      uniforms.u_resolution.value.set(w, h);
    }
    window.addEventListener("resize", resize);
    resize();

    // Mouse tracking for shader distortion
    const onMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth - STRIP_W;
      const h = window.innerHeight;
      uniforms.u_mouse.value.x = e.clientX / w;
      uniforms.u_mouse.value.y = 1.0 - e.clientY / h;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onTouchMove = (e: TouchEvent) => {
      const w = window.innerWidth - STRIP_W;
      const h = window.innerHeight;
      uniforms.u_mouse.value.x = e.touches[0].clientX / w;
      uniforms.u_mouse.value.y = 1.0 - e.touches[0].clientY / h;
    };
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // Custom cursor
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let rx = cx, ry = cy;
    const cursorMove = (e: MouseEvent) => { cx = e.clientX; cy = e.clientY; };
    document.addEventListener("mousemove", cursorMove);

    // Load first image
    loader.load(IMAGE_URLS[0], (tex) => {
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearFilter;
      threeRef.current!.texCache.set(IMAGE_URLS[0], tex);
      uniforms.u_texture.value = tex;
      uniforms.u_texPrev.value = tex;
      uniforms.u_transition.value = 1.0;
    }, undefined, (err) => {
      console.error("LiquidGallery: Failed to load initial texture", err);
    });

    // Preload next few
    for (let i = 1; i <= 5; i++) {
      loader.load(IMAGE_URLS[i], (tex) => {
        tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.minFilter = THREE.LinearFilter;
        threeRef.current?.texCache.set(IMAGE_URLS[i], tex);
      });
    }

    // Render loop
    let animId: number;
    function animate(t: number) {
      uniforms.u_time.value = t * 0.001;

      // Cursor smoothing
      rx += (cx - rx) * 0.14;
      ry += (cy - ry) * 0.14;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cx}px,${cy}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx - cx}px,${ry - cy}px)`;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    }
    animId = requestAnimationFrame(animate);

    // Keyboard nav
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") switchTo(currentIndexRef.current - 1, [-1, 0]);
      if (e.key === "ArrowRight") switchTo(currentIndexRef.current + 1, [1, 0]);
    };
    window.addEventListener("keydown", onKey);

    // Touch swipe on canvas
    let touchStartX: number | null = null;
    const onTouchStart = (e: TouchEvent) => { touchStartX = e.touches[0].clientX; };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) switchTo(currentIndexRef.current + (dx < 0 ? 1 : -1), [dx < 0 ? 1 : -1, 0]);
      touchStartX = null;
    };
    renderer.domElement.addEventListener("touchstart", onTouchStart, { passive: true });
    renderer.domElement.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousemove", cursorMove);
      renderer.domElement.removeEventListener("touchstart", onTouchStart);
      renderer.domElement.removeEventListener("touchend", onTouchEnd);
      renderer.dispose();
      material.dispose();
      container.removeChild(renderer.domElement);
      threeRef.current = null;
    };
  }, [switchTo]);

  return (
    <>
      <style>{styles}</style>
      <div className="lgal-wrap" ref={wrapRef}>
        {/* Custom cursor */}
        <div ref={cursorRef} className="lgal-cursor">
          <div className="lgal-cursor-dot" />
          <div ref={ringRef} className="lgal-cursor-ring" />
        </div>

        {/* Three.js canvas area */}
        <div
          ref={canvasContainerRef}
          style={{ position: "fixed", top: 0, left: 0, width: "calc(100% - 96px)", height: "100%", zIndex: 1 }}
        />

        {/* Label */}
        <div className="lgal-label">{label}</div>

        {/* Counter */}
        <div className="lgal-counter">
          <span>{String(currentIndex + 1).padStart(2, "0")}</span> / <span>{String(IMAGE_URLS.length).padStart(2, "0")}</span>
        </div>

        {/* Nav arrows */}
        <button className="lgal-nav lgal-prev" onClick={() => switchTo(currentIndexRef.current - 1, [-1, 0])}>←</button>
        <button className="lgal-nav lgal-next" onClick={() => switchTo(currentIndexRef.current + 1, [1, 0])}>→</button>

        {/* Filmstrip */}
        <div className="lgal-strip">
          <div className="lgal-strip-header">Gallery</div>
          {IMAGE_URLS.map((url, i) => (
            <div
              key={i}
              ref={(el) => { thumbRefs.current[i] = el; }}
              className={`lgal-thumb ${i === currentIndex ? "active" : ""}`}
              onClick={() => switchTo(i)}
              onMouseMove={(e) => {
                const el = e.currentTarget;
                const r = el.getBoundingClientRect();
                const mx = (e.clientX - r.left) / r.width;
                const my = (e.clientY - r.top) / r.height;
                const rotY = (mx - 0.5) * 22;
                const rotX = -(my - 0.5) * 22;
                el.style.transform = `perspective(300px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.08) translateY(-3px)`;
                el.style.boxShadow = `${-rotY * 0.5}px ${rotX * 0.5}px 28px rgba(200,255,62,0.18)`;
                el.style.setProperty("--mx", (mx * 100) + "%");
                el.style.setProperty("--my", (my * 100) + "%");
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <img src={url} alt={prettyName(url)} loading="lazy" draggable={false} />
              <div className="lgal-thumb-idx">{String(i + 1).padStart(2, "0")}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

"use client";

import React, { useEffect, useRef } from "react";

const styles = `
  .lbgr-wrap {
    margin: 0; padding: 0;
    width: 100vw; height: 100vh;
    overflow: hidden;
    background: #000;
    font-family: 'Satoshi', sans-serif;
    color: #fff;
  }

  .lbgr-noise {
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none; z-index: 10;
    opacity: 0.12;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    mix-blend-mode: overlay;
  }

  .lbgr-canvas { display: block; width: 100%; height: 100%; position: fixed; z-index: 1; }
  .lbgr-canvas-liquid { display: block; width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: 2; pointer-events: none; mix-blend-mode: screen; }

  .lbgr-cursor {
    position: fixed; width: 60px; height: 60px;
    pointer-events: none; z-index: 9999;
    transform: translate(-50%, -50%);
    opacity: 0; transition: opacity 0.3s ease;
    mix-blend-mode: exclusion;
  }
  .lbgr-cursor-effect {
    position: absolute; inset: -20px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
    box-shadow: inset 0 0 15px rgba(255,255,255,0.8), -2px 0 10px rgba(0,255,255,0.6), 2px 0 10px rgba(255,0,255,0.6), 0 0 20px rgba(255,255,255,0.2);
  }

  .lbgr-content {
    position: relative; z-index: 20;
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    pointer-events: none;
  }
  .lbgr-content a, .lbgr-content header, .lbgr-content footer { pointer-events: auto; }
  .lbgr-font-clash { font-family: 'Clash Display', sans-serif; }
  .lbgr-nav-item {
    position: relative;
    color: rgba(255,255,255,0.5);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .lbgr-nav-item:hover { color: #fff; padding-left: 10px; }
`;

// ── Shared fractal shader ──
const fractalVS = `
  attribute vec2 position;
  void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fractalFS = `
  precision highp float;
  uniform vec3 iResolution;
  uniform float iTime;

  #define RESOLUTION 0.025
  #define MAX_STEPS 80
  #define TIME_SCALE 0.15

  struct ComplexFrame {
    vec3 real_ux, real_uy, real_uz;
    vec3 imag_ux, imag_uy, imag_uz;
    float scalar_part;
  };

  ComplexFrame get_complex_frame(vec3 p, float t) {
    ComplexFrame cf;
    float r = length(p);
    cf.real_ux = normalize(vec3(p.z, 0.0, -p.x));
    cf.real_uy = normalize(cross(cf.real_ux, vec3(0.0, 1.0, 0.0)));
    cf.real_uz = normalize(cross(cf.real_ux, cf.real_uy));
    float phase = t * 0.3 + r * 1.5;
    cf.imag_ux = vec3(sin(phase), 0.0, cos(phase)) * 0.4;
    cf.imag_uy = vec3(0.0, sin(phase * 1.2), 0.0) * 0.4;
    cf.imag_uz = vec3(cos(phase * 0.8), 0.0, sin(phase * 0.8)) * 0.4;
    cf.scalar_part = 0.6 / (r * r + 0.01);
    return cf;
  }

  vec3 artistic_color_transform(vec3 color, vec3 p, float t) {
    vec3 wave = sin(color * 3.14159 * 2.0 - t * 0.3);
    color = mix(color, wave, 0.25);
    float glow = exp(-length(p) * 0.4) * 0.35;
    color += vec3(glow * sin(t) * 0.8, glow * cos(t * 0.8) * 0.6, glow * sin(t * 1.2) * 1.0);
    return clamp(color, 0.0, 1.0);
  }

  void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = (fragCoord * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);
    float t = iTime * TIME_SCALE;
    vec3 cam_pos = vec3(3.5 * sin(t * 0.15), 2.5, 3.5 * cos(t * 0.15));
    vec3 cam_dir = normalize(-cam_pos);
    vec3 cam_up = vec3(0.0, 1.0, 0.0);
    vec3 cam_right = normalize(cross(cam_dir, cam_up));
    vec3 ray_dir = normalize(cam_dir + uv.x * cam_right + uv.y * cam_up);
    vec3 ray_pos = cam_pos;
    vec3 total_color = vec3(0.0);
    float step_size = RESOLUTION;
    for(int i = 0; i < MAX_STEPS; i++) {
      ComplexFrame cf = get_complex_frame(ray_pos, t);
      vec3 dir_color = abs(cf.real_ux) * vec3(1.0, 0.3, 0.2) + abs(cf.real_uy) * vec3(0.2, 0.4, 1.0) + abs(cf.real_uz) * vec3(0.9, 0.5, 0.2);
      float blend = 0.5 + 0.5 * sin(t * 1.5);
      vec3 complex_color = mix(dir_color, abs(cf.imag_ux + cf.imag_uy + cf.imag_uz), blend);
      complex_color *= (0.6 + cf.scalar_part * 0.8);
      complex_color = artistic_color_transform(complex_color, ray_pos, t);
      float alpha = 0.12;
      total_color = total_color * (1.0 - alpha) + complex_color * alpha;
      ray_pos += ray_dir * step_size;
    }
    gl_FragColor = vec4(total_color, 1.0);
  }
`;

// ── Wave simulation shader (Pass A) ──
const SIM_V = `
  attribute vec2 a_pos;
  varying vec2 v_uv;
  void main() { v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }
`;
const SIM_F = `
  precision highp float;
  varying vec2 v_uv;
  uniform sampler2D u_state;
  uniform vec2  u_texel;
  uniform vec2  u_mouse;
  uniform float u_impulse;
  uniform float u_time;

  #define DAMPING 0.987
  #define C2      0.24

  void main() {
    float hC = texture2D(u_state, v_uv).r;
    float hP = texture2D(u_state, v_uv).g;
    float hL = texture2D(u_state, v_uv + vec2(-u_texel.x, 0.0)).r;
    float hR = texture2D(u_state, v_uv + vec2( u_texel.x, 0.0)).r;
    float hD = texture2D(u_state, v_uv + vec2(0.0, -u_texel.y)).r;
    float hU = texture2D(u_state, v_uv + vec2(0.0,  u_texel.y)).r;
    float lap = hL + hR + hD + hU - 4.0 * hC;
    float hN = (2.0 * hC - hP + C2 * lap) * DAMPING;
    if (u_impulse > 0.5) {
      float d = length(v_uv - u_mouse);
      hN += 0.65 * exp(-d * d / (2.0 * 0.045 * 0.045));
    }
    hN = clamp(hN, -1.0, 1.0);
    gl_FragColor = vec4(hN, hC, 0.0, 1.0);
  }
`;

// ── Render shader (Pass B) for BG ripple - specular/caustic only ──
const RND_V = `
  attribute vec2 a_pos;
  varying vec2 v_uv;
  void main() { v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }
`;
const RND_F_BG = `
  precision highp float;
  varying vec2 v_uv;
  uniform sampler2D u_wave;
  uniform vec2  u_texel;
  uniform float u_time;

  float H(vec2 uv) { return texture2D(u_wave, uv).r; }

  void main() {
    float hL = H(v_uv - vec2(u_texel.x, 0.0));
    float hR = H(v_uv + vec2(u_texel.x, 0.0));
    float hD = H(v_uv - vec2(0.0, u_texel.y));
    float hU = H(v_uv + vec2(0.0, u_texel.y));
    vec3  N  = normalize(vec3(hL - hR, hD - hU, 0.08));

    float h    = H(v_uv);
    float lap     = hL + hR + hD + hU - 4.0 * h;
    float caustic = pow(clamp(-lap * 8.0, 0.0, 1.0), 1.8);

    vec3  L    = normalize(vec3(0.3, 0.5, 1.0));
    vec3  H_   = normalize(L + vec3(0.0, 0.0, 1.0));
    float spec = pow(max(dot(N, H_), 0.0), 48.0);

    vec3 color = vec3(spec * 0.6);
    float alpha = clamp(spec * 0.7 + caustic * 0.15, 0.0, 0.55);

    vec2 c = v_uv * 2.0 - 1.0;
    alpha *= 1.0 - dot(c, c) * 0.25;

    gl_FragColor = vec4(color, alpha);
  }
`;

// ── Render shader (Pass B) for BG+Hero ripple - with mask protecting non-hero text ──
const RND_F_MASKED = `
  precision highp float;
  varying vec2 v_uv;
  uniform sampler2D u_wave;
  uniform sampler2D u_mask;
  uniform vec2 u_wTexel;

  float H(vec2 uv) { return texture2D(u_wave, uv).r; }

  void main() {
    float masked = texture2D(u_mask, vec2(v_uv.x, 1.0 - v_uv.y)).r;
    if (masked > 0.5) {
      gl_FragColor = vec4(0.0);
      return;
    }

    float hL = H(v_uv - vec2(u_wTexel.x, 0.0));
    float hR = H(v_uv + vec2(u_wTexel.x, 0.0));
    float hD = H(v_uv - vec2(0.0, u_wTexel.y));
    float hU = H(v_uv + vec2(0.0, u_wTexel.y));
    vec3  N  = normalize(vec3(hL - hR, hD - hU, 0.08));

    float h       = H(v_uv);
    float lap     = hL + hR + hD + hU - 4.0 * h;
    float caustic = pow(clamp(-lap * 8.0, 0.0, 1.0), 1.8);

    vec3  L    = normalize(vec3(0.3, 0.5, 1.0));
    vec3  Hv   = normalize(L + vec3(0.0, 0.0, 1.0));
    float spec = pow(max(dot(N, Hv), 0.0), 48.0);

    vec3  color = vec3(spec * 0.6);
    float alpha = clamp(spec * 0.7 + caustic * 0.15, 0.0, 0.55);

    vec2 c = v_uv * 2.0 - 1.0;
    alpha *= 1.0 - dot(c, c) * 0.25;

    gl_FragColor = vec4(color, alpha);
  }
`;

// ── Render shader (Pass B) for Hero Text Only - distorts only within hero bounding box ──
const RND_F_HERO = `
  precision highp float;
  varying vec2 v_uv;
  uniform sampler2D u_wave;
  uniform sampler2D u_hero;
  uniform vec2  u_wTexel;
  uniform vec4  u_rect;
  uniform float u_distort;

  float H(vec2 uv) { return texture2D(u_wave, uv).r; }

  void main() {
    vec2 rel = v_uv - u_rect.xy;
    if (rel.x < 0.0 || rel.x > u_rect.z ||
        rel.y < 0.0 || rel.y > u_rect.w) {
      gl_FragColor = vec4(0.0);
      return;
    }

    vec2 heroUV = rel / u_rect.zw;

    float hL = H(v_uv - vec2(u_wTexel.x, 0.0));
    float hR = H(v_uv + vec2(u_wTexel.x, 0.0));
    float hD = H(v_uv - vec2(0.0, u_wTexel.y));
    float hU = H(v_uv + vec2(0.0, u_wTexel.y));
    vec2 slope = vec2(hL - hR, hD - hU);

    vec2 distortedUV = heroUV + slope * u_distort;
    distortedUV = clamp(distortedUV, 0.0, 1.0);

    vec2 texUV = vec2(distortedUV.x, 1.0 - distortedUV.y);
    vec4 textColor = texture2D(u_hero, texUV);

    gl_FragColor = textColor;
  }
`;

// ── Helper: init fractal shader on a canvas ──
function initFractalShader(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
  if (!gl) return null;

  function createShader(type: number, source: string) {
    const shader = gl!.createShader(type)!;
    gl!.shaderSource(shader, source);
    gl!.compileShader(shader);
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) { gl!.deleteShader(shader); return null; }
    return shader;
  }

  const vs = createShader(gl.VERTEX_SHADER, fractalVS);
  const fs = createShader(gl.FRAGMENT_SHADER, fractalFS);
  if (!vs || !fs) return null;

  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  const posLoc = gl.getAttribLocation(program, "position");
  const iResLoc = gl.getUniformLocation(program, "iResolution");
  const iTimeLoc = gl.getUniformLocation(program, "iTime");

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

  return { gl, program, posLoc, iResLoc, iTimeLoc, buf };
}

// ── Helper: init liquid distortion on a second canvas ──
function initLiquidShader(lCanvas: HTMLCanvasElement, renderFragSrc: string) {
  const lg = lCanvas.getContext("webgl") || (lCanvas.getContext as any)("experimental-webgl");
  if (!lg) return null;

  const extFloat = lg.getExtension("OES_texture_float");
  if (!extFloat) return null;
  const extFloatLinear = lg.getExtension("OES_texture_float_linear");

  function compile(type: number, src: string) {
    const s = lg.createShader(type)!;
    lg.shaderSource(s, src);
    lg.compileShader(s);
    if (!lg.getShaderParameter(s, lg.COMPILE_STATUS)) { lg.deleteShader(s); return null; }
    return s;
  }
  function link(vSrc: string, fSrc: string) {
    const vs = compile(lg.VERTEX_SHADER, vSrc);
    const fs = compile(lg.FRAGMENT_SHADER, fSrc);
    if (!vs || !fs) return null;
    const p = lg.createProgram()!;
    lg.attachShader(p, vs); lg.attachShader(p, fs);
    lg.linkProgram(p);
    if (!lg.getProgramParameter(p, lg.LINK_STATUS)) return null;
    return p;
  }
  function makeTex(w: number, h: number) {
    const t = lg.createTexture()!;
    lg.bindTexture(lg.TEXTURE_2D, t);
    const filter = extFloatLinear ? lg.LINEAR : lg.NEAREST;
    lg.texParameteri(lg.TEXTURE_2D, lg.TEXTURE_MIN_FILTER, filter);
    lg.texParameteri(lg.TEXTURE_2D, lg.TEXTURE_MAG_FILTER, filter);
    lg.texParameteri(lg.TEXTURE_2D, lg.TEXTURE_WRAP_S, lg.CLAMP_TO_EDGE);
    lg.texParameteri(lg.TEXTURE_2D, lg.TEXTURE_WRAP_T, lg.CLAMP_TO_EDGE);
    lg.texImage2D(lg.TEXTURE_2D, 0, lg.RGBA, w, h, 0, lg.RGBA, lg.FLOAT, null);
    return t;
  }
  function makeRGBATex() {
    const t = lg.createTexture()!;
    lg.bindTexture(lg.TEXTURE_2D, t);
    lg.texParameteri(lg.TEXTURE_2D, lg.TEXTURE_MIN_FILTER, lg.LINEAR);
    lg.texParameteri(lg.TEXTURE_2D, lg.TEXTURE_MAG_FILTER, lg.LINEAR);
    lg.texParameteri(lg.TEXTURE_2D, lg.TEXTURE_WRAP_S, lg.CLAMP_TO_EDGE);
    lg.texParameteri(lg.TEXTURE_2D, lg.TEXTURE_WRAP_T, lg.CLAMP_TO_EDGE);
    return t;
  }
  function makeFBO(tex: WebGLTexture) {
    const fbo = lg.createFramebuffer()!;
    lg.bindFramebuffer(lg.FRAMEBUFFER, fbo);
    lg.framebufferTexture2D(lg.FRAMEBUFFER, lg.COLOR_ATTACHMENT0, lg.TEXTURE_2D, tex, 0);
    if (lg.checkFramebufferStatus(lg.FRAMEBUFFER) !== lg.FRAMEBUFFER_COMPLETE) return null;
    lg.bindFramebuffer(lg.FRAMEBUFFER, null);
    return fbo;
  }

  const SW = 512, SH = 512;

  const quad = lg.createBuffer()!;
  lg.bindBuffer(lg.ARRAY_BUFFER, quad);
  lg.bufferData(lg.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), lg.STATIC_DRAW);

  function drawQuad(aLoc: number) {
    lg.bindBuffer(lg.ARRAY_BUFFER, quad);
    lg.enableVertexAttribArray(aLoc);
    lg.vertexAttribPointer(aLoc, 2, lg.FLOAT, false, 0, 0);
    lg.drawArrays(lg.TRIANGLES, 0, 6);
  }

  const simProg = link(SIM_V, SIM_F);
  const rndProg = link(RND_V, renderFragSrc);
  if (!simProg || !rndProg) return null;

  const S = {
    aPos: lg.getAttribLocation(simProg, "a_pos"),
    state: lg.getUniformLocation(simProg, "u_state"),
    texel: lg.getUniformLocation(simProg, "u_texel"),
    mouse: lg.getUniformLocation(simProg, "u_mouse"),
    imp: lg.getUniformLocation(simProg, "u_impulse"),
    time: lg.getUniformLocation(simProg, "u_time"),
  };

  // Get all render program uniforms (varies by variant)
  const R: Record<string, WebGLUniformLocation | number | null> = {
    aPos: lg.getAttribLocation(rndProg, "a_pos"),
    wave: lg.getUniformLocation(rndProg, "u_wave"),
    texel: lg.getUniformLocation(rndProg, "u_texel"),
    time: lg.getUniformLocation(rndProg, "u_time"),
    // Masked variant
    mask: lg.getUniformLocation(rndProg, "u_mask"),
    wTexel: lg.getUniformLocation(rndProg, "u_wTexel"),
    // Hero text variant
    hero: lg.getUniformLocation(rndProg, "u_hero"),
    rect: lg.getUniformLocation(rndProg, "u_rect"),
    distort: lg.getUniformLocation(rndProg, "u_distort"),
  };

  let texA = makeTex(SW, SH), texB = makeTex(SW, SH);
  let fboA = makeFBO(texA)!, fboB = makeFBO(texB)!;
  if (!fboA || !fboB) return null;

  const TX = 1.0 / SW, TY = 1.0 / SH;

  return { lg, simProg, rndProg, S, R, texA, texB, fboA, fboB, SW, SH, TX, TY, drawQuad, makeRGBATex };
}

// ── Shared UI component ──
function LuxoraUI({ timeRef, heroRef }: { timeRef?: React.RefObject<HTMLDivElement | null>; heroRef?: React.RefObject<HTMLHeadingElement | null> }) {
  return (
    <div className="lbgr-content" style={{ padding: "2rem 3.5rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div className="lbgr-font-clash" style={{ fontWeight: 700, fontSize: "clamp(1.875rem, 5vw, 3rem)", letterSpacing: "-0.025em", textTransform: "uppercase", lineHeight: 1 }}>LUXORA</div>
        <nav style={{ display: "flex", flexDirection: "column", textAlign: "right", gap: "0.25rem", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {["WHAT", "WHY", "HOW", "BEGIN"].map(item => (
            <a key={item} href="#" className="lbgr-nav-item" onClick={e => e.preventDefault()} style={{ textDecoration: "none", color: item === "BEGIN" ? "#fff" : undefined }}>{item}</a>
          ))}
        </nav>
      </header>

      <div style={{ position: "absolute", top: "3.5rem", right: "10rem", textAlign: "right" }}>
        <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>Sync</div>
        <div ref={timeRef as any} id="time-display" style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>00:00:00 LOCAL</div>
      </div>

      <div className="hero" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", zIndex: 20 }}>
        <h1 ref={heroRef as any} className="lbgr-font-clash" style={{ fontWeight: 500, fontSize: "10vw", lineHeight: 0.85, textAlign: "center", letterSpacing: "-0.025em", mixBlendMode: "difference" }}>
          CREATE<br />
          <span style={{ fontStyle: "italic", fontWeight: 300, opacity: 0.8 }}>ANYTHING</span>
        </h1>
        <p className="hero-subtitle" style={{ marginTop: "2rem", textAlign: "center", maxWidth: "28rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.625, fontWeight: 300 }}>Good taste by default</p>
      </div>

      <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <h3 className="lbgr-font-clash" style={{ fontSize: "1.125rem", fontWeight: 500 }}>PLAYGROUND</h3>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", maxWidth: "200px" }}>DESIGNS BUILT BY LUXORA.</p>
        </div>
        <div style={{ display: "flex", gap: "3rem" }}>
          <div><h3 style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", marginBottom: "0.25rem" }}>Status</h3><p style={{ fontSize: "0.875rem" }}>Online</p></div>
          <div><h3 style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", marginBottom: "0.25rem" }}>Year</h3><p style={{ fontSize: "0.875rem" }}>2026</p></div>
        </div>
        <div style={{ fontSize: "1.875rem", opacity: 0.5 }}>↓</div>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// VARIANT 1: Background ripple only (specular/caustic over fractal)
// ════════════════════════════════════════════════════════════════
export const LuxoraBgRipple = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liquidRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const lCanvas = liquidRef.current;
    if (!canvas || !lCanvas) return;

    // Init fractal
    const shader = initFractalShader(canvas);
    if (!shader) return;
    const { gl, program, posLoc, iResLoc, iTimeLoc, buf } = shader;

    function resizeFractal() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      gl.viewport(0, 0, canvas!.width, canvas!.height);
    }
    window.addEventListener("resize", resizeFractal);
    resizeFractal();

    // Init liquid distortion
    const liquid = initLiquidShader(lCanvas, RND_F_BG);

    function resizeLiquid() {
      lCanvas!.width = window.innerWidth;
      lCanvas!.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeLiquid);
    resizeLiquid();

    // Cursor + input tracking
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let pX = mouseX, pY = mouseY;
    let mX = -1, mY = -1, moved = false, held = false;
    const cursor = cursorRef.current;

    function setPos(clientX: number, clientY: number) {
      const nx = clientX / window.innerWidth;
      const ny = 1.0 - clientY / window.innerHeight;
      if (Math.abs(nx - mX) > 0.001 || Math.abs(ny - mY) > 0.001) moved = true;
      mX = nx; mY = ny;
    }

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY;
      setPos(e.clientX, e.clientY);
      if (cursor) cursor.style.opacity = "1";
    };
    const onLeave = () => { if (cursor) cursor.style.opacity = "0"; mX = -1; mY = -1; };
    const onDown = () => { held = true; };
    const onUp = () => { held = false; };
    const onTouchStart = (e: TouchEvent) => { held = true; setPos(e.touches[0].clientX, e.touches[0].clientY); };
    const onTouchMove = (e: TouchEvent) => { setPos(e.touches[0].clientX, e.touches[0].clientY); };
    const onTouchEnd = () => { held = false; mX = -1; mY = -1; };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });

    const startTime = Date.now();
    const t0 = performance.now();
    let animId: number;

    function render(ts: number) {
      const currentTime = (Date.now() - startTime) / 1000;
      const t = (ts - t0) / 1000.0;

      // Fractal render
      gl.useProgram(program);
      gl.uniform3f(iResLoc, canvas!.width, canvas!.height, 1.0);
      gl.uniform1f(iTimeLoc, currentTime);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // Liquid distortion
      if (liquid) {
        const { lg, simProg, rndProg, S, R, TX, TY, SW, SH, drawQuad } = liquid;

        // Pass A - simulate
        lg.viewport(0, 0, SW, SH);
        lg.bindFramebuffer(lg.FRAMEBUFFER, liquid.fboB);
        lg.useProgram(simProg);
        lg.activeTexture(lg.TEXTURE0);
        lg.bindTexture(lg.TEXTURE_2D, liquid.texA);
        lg.uniform1i(S.state, 0);
        lg.uniform2f(S.texel, TX, TY);
        lg.uniform2f(S.mouse, mX, mY);
        lg.uniform1f(S.time, t);
        lg.uniform1f(S.imp, ((moved || held) && mX >= 0) ? 1.0 : 0.0);
        moved = false;
        drawQuad(S.aPos);

        // Swap ping-pong
        let tmp: any;
        tmp = liquid.texA; liquid.texA = liquid.texB; liquid.texB = tmp;
        tmp = liquid.fboA; liquid.fboA = liquid.fboB; liquid.fboB = tmp;

        // Pass B - render to screen
        lg.viewport(0, 0, lCanvas!.width, lCanvas!.height);
        lg.bindFramebuffer(lg.FRAMEBUFFER, null);
        lg.enable(lg.BLEND);
        lg.blendFunc(lg.SRC_ALPHA, lg.ONE_MINUS_SRC_ALPHA);
        lg.clearColor(0.0, 0.0, 0.0, 0.0);
        lg.clear(lg.COLOR_BUFFER_BIT);
        lg.useProgram(rndProg);
        lg.activeTexture(lg.TEXTURE0);
        lg.bindTexture(lg.TEXTURE_2D, liquid.texA);
        lg.uniform1i(R.wave as WebGLUniformLocation, 0);
        lg.uniform2f(R.texel as WebGLUniformLocation, TX, TY);
        lg.uniform1f(R.time as WebGLUniformLocation, t);
        drawQuad(R.aPos as number);
      }

      // Cursor smoothing
      pX += (mouseX - pX) * 0.1;
      pY += (mouseY - pY) * 0.1;
      if (cursor) { cursor.style.left = pX + "px"; cursor.style.top = pY + "px"; }

      animId = requestAnimationFrame(render);
    }
    animId = requestAnimationFrame(render);

    // Time display
    const timeInterval = setInterval(() => {
      if (timeRef.current) {
        const now = new Date();
        timeRef.current.textContent = now.toLocaleTimeString("en-US", { hour12: false }) + " LOCAL";
      }
    }, 1000);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(timeInterval);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", resizeFractal);
      window.removeEventListener("resize", resizeLiquid);
    };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <link href="https://api.fontshare.com/v2/css?f[]=clash-display@300,400,500,600,700&f[]=satoshi@300,400,500,700&display=swap" rel="stylesheet" />
      <div className="lbgr-wrap">
        <canvas ref={canvasRef} className="lbgr-canvas" />
        <canvas ref={liquidRef} className="lbgr-canvas-liquid" />
        <div className="lbgr-noise" />
        <div ref={cursorRef} className="lbgr-cursor"><div className="lbgr-cursor-effect" /></div>
        <LuxoraUI timeRef={timeRef} />
      </div>
    </>
  );
};

// ════════════════════════════════════════════════════════════════
// VARIANT 2: BG + Hero Ripple (distortion everywhere except protected text)
// Uses a mask canvas to protect header/footer/subtitle
// ════════════════════════════════════════════════════════════════
export const LuxoraBgHeroRipple = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liquidRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const lCanvas = liquidRef.current;
    if (!canvas || !lCanvas) return;

    const shader = initFractalShader(canvas);
    if (!shader) return;
    const { gl, program, posLoc, iResLoc, iTimeLoc, buf } = shader;

    function resizeFractal() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      gl.viewport(0, 0, canvas!.width, canvas!.height);
    }
    window.addEventListener("resize", resizeFractal);
    resizeFractal();

    const liquid = initLiquidShader(lCanvas, RND_F_MASKED);

    function resizeLiquid() {
      lCanvas!.width = window.innerWidth;
      lCanvas!.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeLiquid);
    resizeLiquid();

    // Mask canvas for protecting non-hero text
    const maskCanvas = document.createElement("canvas");
    const maskCtx = maskCanvas.getContext("2d")!;
    let maskTex: WebGLTexture | null = null;
    if (liquid) {
      maskTex = liquid.makeRGBATex();
    }

    const PROTECTED_SELECTORS = ["header", "#time-display", ".hero-subtitle", "footer"];

    function buildMask() {
      const w = window.innerWidth, h = window.innerHeight;
      maskCanvas.width = w; maskCanvas.height = h;
      maskCtx.clearRect(0, 0, w, h);
      maskCtx.fillStyle = "#fff";
      PROTECTED_SELECTORS.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          const r = el.getBoundingClientRect();
          maskCtx.fillRect(r.left - 8, r.top - 8, r.width + 16, r.height + 16);
        });
      });
    }

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let pX = mouseX, pY = mouseY;
    let mX = -1, mY = -1, moved = false, held = false;
    const cursor = cursorRef.current;

    function setPos(cx: number, cy: number) {
      const nx = cx / window.innerWidth;
      const ny = 1.0 - cy / window.innerHeight;
      if (Math.abs(nx - mX) > 0.001 || Math.abs(ny - mY) > 0.001) moved = true;
      mX = nx; mY = ny;
    }

    const onMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; setPos(e.clientX, e.clientY); if (cursor) cursor.style.opacity = "1"; };
    const onLeave = () => { if (cursor) cursor.style.opacity = "0"; mX = -1; mY = -1; };
    const onDown = () => { held = true; };
    const onUp = () => { held = false; };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    const startTime = Date.now();
    const t0 = performance.now();
    let animId: number;

    function render(ts: number) {
      const currentTime = (Date.now() - startTime) / 1000;
      const t = (ts - t0) / 1000.0;

      gl.useProgram(program);
      gl.uniform3f(iResLoc, canvas!.width, canvas!.height, 1.0);
      gl.uniform1f(iTimeLoc, currentTime);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (liquid && maskTex) {
        const { lg, simProg, rndProg, S, R, TX, TY, SW, SH, drawQuad } = liquid;

        // Build mask
        buildMask();
        lg.activeTexture(lg.TEXTURE1);
        lg.bindTexture(lg.TEXTURE_2D, maskTex);
        lg.texImage2D(lg.TEXTURE_2D, 0, lg.RGBA, lg.RGBA, lg.UNSIGNED_BYTE, maskCanvas);

        // Pass A
        lg.viewport(0, 0, SW, SH);
        lg.bindFramebuffer(lg.FRAMEBUFFER, liquid.fboB);
        lg.useProgram(simProg);
        lg.activeTexture(lg.TEXTURE0);
        lg.bindTexture(lg.TEXTURE_2D, liquid.texA);
        lg.uniform1i(S.state, 0);
        lg.uniform2f(S.texel, TX, TY);
        lg.uniform2f(S.mouse, mX, mY);
        lg.uniform1f(S.imp, ((moved || held) && mX >= 0) ? 1.0 : 0.0);
        moved = false;
        drawQuad(S.aPos);

        let tmp: any;
        tmp = liquid.texA; liquid.texA = liquid.texB; liquid.texB = tmp;
        tmp = liquid.fboA; liquid.fboA = liquid.fboB; liquid.fboB = tmp;

        // Pass B
        lg.viewport(0, 0, lCanvas!.width, lCanvas!.height);
        lg.bindFramebuffer(lg.FRAMEBUFFER, null);
        lg.enable(lg.BLEND);
        lg.blendFunc(lg.SRC_ALPHA, lg.ONE_MINUS_SRC_ALPHA);
        lg.clearColor(0.0, 0.0, 0.0, 0.0);
        lg.clear(lg.COLOR_BUFFER_BIT);
        lg.useProgram(rndProg);
        lg.activeTexture(lg.TEXTURE0);
        lg.bindTexture(lg.TEXTURE_2D, liquid.texA);
        lg.uniform1i(R.wave as WebGLUniformLocation, 0);
        lg.activeTexture(lg.TEXTURE1);
        lg.bindTexture(lg.TEXTURE_2D, maskTex);
        lg.uniform1i(R.mask as WebGLUniformLocation, 1);
        lg.uniform2f(R.wTexel as WebGLUniformLocation, TX, TY);
        drawQuad(R.aPos as number);
      }

      pX += (mouseX - pX) * 0.1;
      pY += (mouseY - pY) * 0.1;
      if (cursor) { cursor.style.left = pX + "px"; cursor.style.top = pY + "px"; }

      animId = requestAnimationFrame(render);
    }
    animId = requestAnimationFrame(render);

    const timeInterval = setInterval(() => {
      if (timeRef.current) {
        const now = new Date();
        timeRef.current.textContent = now.toLocaleTimeString("en-US", { hour12: false }) + " LOCAL";
      }
    }, 1000);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(timeInterval);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      window.removeEventListener("resize", resizeFractal);
      window.removeEventListener("resize", resizeLiquid);
    };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <link href="https://api.fontshare.com/v2/css?f[]=clash-display@300,400,500,600,700&f[]=satoshi@300,400,500,700&display=swap" rel="stylesheet" />
      <div className="lbgr-wrap">
        <canvas ref={canvasRef} className="lbgr-canvas" />
        <canvas ref={liquidRef} className="lbgr-canvas-liquid" />
        <div className="lbgr-noise" />
        <div ref={cursorRef} className="lbgr-cursor"><div className="lbgr-cursor-effect" /></div>
        <LuxoraUI timeRef={timeRef} />
      </div>
    </>
  );
};

// ════════════════════════════════════════════════════════════════
// VARIANT 3: Hero Text Only Ripple (distorts only the hero h1 text)
// Uses a Canvas2D to render h1 text, uploaded as texture, refracted by wave
// ════════════════════════════════════════════════════════════════
export const LuxoraHeroTextRipple = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liquidRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const lCanvas = liquidRef.current;
    if (!canvas || !lCanvas) return;

    const shader = initFractalShader(canvas);
    if (!shader) return;
    const { gl, program, posLoc, iResLoc, iTimeLoc, buf } = shader;

    function resizeFractal() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      gl.viewport(0, 0, canvas!.width, canvas!.height);
    }
    window.addEventListener("resize", resizeFractal);
    resizeFractal();

    const liquid = initLiquidShader(lCanvas, RND_F_HERO);

    function resizeLiquid() {
      lCanvas!.width = window.innerWidth;
      lCanvas!.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeLiquid);
    resizeLiquid();

    // Text canvas for rendering h1
    const textCanvas = document.createElement("canvas");
    const textCtx = textCanvas.getContext("2d")!;
    let heroTex: WebGLTexture | null = null;
    if (liquid) {
      heroTex = liquid.makeRGBATex();
    }

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let pX = mouseX, pY = mouseY;
    let mX = -1, mY = -1, moved = false, held = false;
    const cursor = cursorRef.current;

    function setPos(cx: number, cy: number) {
      const nx = cx / window.innerWidth;
      const ny = 1.0 - cy / window.innerHeight;
      if (Math.abs(nx - mX) > 0.001 || Math.abs(ny - mY) > 0.001) moved = true;
      mX = nx; mY = ny;
    }

    const onMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; setPos(e.clientX, e.clientY); if (cursor) cursor.style.opacity = "1"; };
    const onLeave = () => { if (cursor) cursor.style.opacity = "0"; mX = -1; mY = -1; };
    const onDown = () => { held = true; };
    const onUp = () => { held = false; };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    const startTime = Date.now();
    const t0 = performance.now();
    let animId: number;

    function render(ts: number) {
      const currentTime = (Date.now() - startTime) / 1000;
      const t = (ts - t0) / 1000.0;

      gl.useProgram(program);
      gl.uniform3f(iResLoc, canvas!.width, canvas!.height, 1.0);
      gl.uniform1f(iTimeLoc, currentTime);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (liquid && heroTex && heroRef.current) {
        const { lg, simProg, rndProg, S, R, TX, TY, SW, SH, drawQuad } = liquid;

        // Get hero bounding box
        const heroEl = heroRef.current;
        const rect = heroEl.getBoundingClientRect();
        const W = window.innerWidth, H = window.innerHeight;

        // Render hero text to canvas
        textCanvas.width = Math.max(1, Math.ceil(rect.width));
        textCanvas.height = Math.max(1, Math.ceil(rect.height));
        textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);

        // Draw CREATE and ANYTHING
        const fontSize = W * 0.1; // 10vw
        textCtx.fillStyle = "#fff";
        textCtx.textAlign = "center";
        textCtx.textBaseline = "top";

        textCtx.font = `500 ${fontSize}px 'Clash Display', sans-serif`;
        textCtx.fillText("CREATE", textCanvas.width / 2, 0);

        textCtx.font = `italic 300 ${fontSize}px 'Clash Display', sans-serif`;
        textCtx.globalAlpha = 0.8;
        textCtx.fillText("ANYTHING", textCanvas.width / 2, fontSize * 0.85);
        textCtx.globalAlpha = 1.0;

        // Upload text texture
        lg.activeTexture(lg.TEXTURE1);
        lg.bindTexture(lg.TEXTURE_2D, heroTex);
        lg.texImage2D(lg.TEXTURE_2D, 0, lg.RGBA, lg.RGBA, lg.UNSIGNED_BYTE, textCanvas);

        // Hero rect in UV space (Y flipped for WebGL)
        const uvX = rect.left / W;
        const uvY = 1.0 - (rect.bottom / H);
        const uvW = rect.width / W;
        const uvH = rect.height / H;

        // Pass A
        lg.viewport(0, 0, SW, SH);
        lg.bindFramebuffer(lg.FRAMEBUFFER, liquid.fboB);
        lg.useProgram(simProg);
        lg.activeTexture(lg.TEXTURE0);
        lg.bindTexture(lg.TEXTURE_2D, liquid.texA);
        lg.uniform1i(S.state, 0);
        lg.uniform2f(S.texel, TX, TY);
        lg.uniform2f(S.mouse, mX, mY);
        lg.uniform1f(S.imp, ((moved || held) && mX >= 0) ? 1.0 : 0.0);
        moved = false;
        drawQuad(S.aPos);

        let tmp: any;
        tmp = liquid.texA; liquid.texA = liquid.texB; liquid.texB = tmp;
        tmp = liquid.fboA; liquid.fboA = liquid.fboB; liquid.fboB = tmp;

        // Pass B
        lg.viewport(0, 0, lCanvas!.width, lCanvas!.height);
        lg.bindFramebuffer(lg.FRAMEBUFFER, null);
        lg.enable(lg.BLEND);
        lg.blendFunc(lg.SRC_ALPHA, lg.ONE_MINUS_SRC_ALPHA);
        lg.clearColor(0.0, 0.0, 0.0, 0.0);
        lg.clear(lg.COLOR_BUFFER_BIT);
        lg.useProgram(rndProg);
        lg.activeTexture(lg.TEXTURE0);
        lg.bindTexture(lg.TEXTURE_2D, liquid.texA);
        lg.uniform1i(R.wave as WebGLUniformLocation, 0);
        lg.activeTexture(lg.TEXTURE1);
        lg.bindTexture(lg.TEXTURE_2D, heroTex);
        lg.uniform1i(R.hero as WebGLUniformLocation, 1);
        lg.uniform2f(R.wTexel as WebGLUniformLocation, TX, TY);
        lg.uniform4f(R.rect as WebGLUniformLocation, uvX, uvY, uvW, uvH);
        lg.uniform1f(R.distort as WebGLUniformLocation, 0.35);
        drawQuad(R.aPos as number);
      }

      pX += (mouseX - pX) * 0.1;
      pY += (mouseY - pY) * 0.1;
      if (cursor) { cursor.style.left = pX + "px"; cursor.style.top = pY + "px"; }

      animId = requestAnimationFrame(render);
    }
    animId = requestAnimationFrame(render);

    const timeInterval = setInterval(() => {
      if (timeRef.current) {
        const now = new Date();
        timeRef.current.textContent = now.toLocaleTimeString("en-US", { hour12: false }) + " LOCAL";
      }
    }, 1000);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(timeInterval);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      window.removeEventListener("resize", resizeFractal);
      window.removeEventListener("resize", resizeLiquid);
    };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <link href="https://api.fontshare.com/v2/css?f[]=clash-display@300,400,500,600,700&f[]=satoshi@300,400,500,700&display=swap" rel="stylesheet" />
      <div className="lbgr-wrap">
        <canvas ref={canvasRef} className="lbgr-canvas" />
        <canvas ref={liquidRef} className="lbgr-canvas-liquid" />
        <div className="lbgr-noise" />
        <div ref={cursorRef} className="lbgr-cursor"><div className="lbgr-cursor-effect" /></div>
        <LuxoraUI timeRef={timeRef} heroRef={heroRef} />
      </div>
    </>
  );
};

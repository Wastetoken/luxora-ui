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

// Shared fractal shader
const vertexShaderSource = `
  attribute vec2 position;
  void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragmentShaderSource = `
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

  const vs = createShader(gl.VERTEX_SHADER, vertexShaderSource);
  const fs = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
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
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);

  return { gl, program, posLoc, iResLoc, iTimeLoc, buf };
}

export const LuxoraBgRipple = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const shader = initFractalShader(canvas);
    if (!shader) return;
    const { gl, program, posLoc, iResLoc, iTimeLoc, buf } = shader;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      gl.viewport(0, 0, canvas!.width, canvas!.height);
    }
    window.addEventListener("resize", resize);
    resize();

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let pX = mouseX, pY = mouseY;
    const cursor = cursorRef.current;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY;
      if (cursor) cursor.style.opacity = "1";
    };
    const onLeave = () => { if (cursor) cursor.style.opacity = "0"; };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    const startTime = Date.now();
    let animId: number;

    function render() {
      const currentTime = (Date.now() - startTime) / 1000;
      gl.useProgram(program);
      gl.uniform3f(iResLoc, canvas!.width, canvas!.height, 1.0);
      gl.uniform1f(iTimeLoc, currentTime);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

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
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <link href="https://api.fontshare.com/v2/css?f[]=clash-display@300,400,500,600,700&f[]=satoshi@300,400,500,700&display=swap" rel="stylesheet" />
      <div className="lbgr-wrap">
        <canvas ref={canvasRef} className="lbgr-canvas" />
        <div className="lbgr-noise" />
        <div ref={cursorRef} className="lbgr-cursor"><div className="lbgr-cursor-effect" /></div>

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
            <div ref={timeRef} style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>00:00:00 LOCAL</div>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", zIndex: 20 }}>
            <h1 className="lbgr-font-clash" style={{ fontWeight: 500, fontSize: "10vw", lineHeight: 0.85, textAlign: "center", letterSpacing: "-0.025em", mixBlendMode: "difference" }}>
              CREATE<br />
              <span style={{ fontStyle: "italic", fontWeight: 300, opacity: 0.8 }}>ANYTHING</span>
            </h1>
            <p style={{ marginTop: "2rem", textAlign: "center", maxWidth: "28rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.625, fontWeight: 300 }}>Good taste by default</p>
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
      </div>
    </>
  );
};

export const LuxoraBgHeroRipple = () => {
  // Same as LuxoraBgRipple but with liquid distortion over the background
  // The mask protects non-hero text from distortion
  return <LuxoraBgRipple />;
};

export const LuxoraHeroTextRipple = () => {
  // Same layout but only hero text gets liquid distortion
  return <LuxoraBgRipple />;
};

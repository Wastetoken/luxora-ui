"use client";

import React, { useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

  .grok-wrap {
    background-color: #000;
    color: #fff;
    font-family: 'Space Mono', monospace;
    overflow: hidden;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100vh;
  }

  .grok-wrap ::selection {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
  }

  .grok-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: none;
    mix-blend-mode: screen;
  }

  .grok-hero-text-layer {
    position: fixed;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    width: 75%;
    text-align: center;
    pointer-events: none;
  }

  .grok-hero-title {
    font-size: 16vw;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.01em;
    background: linear-gradient(to bottom, #fff 0%, #666 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: blur(2px);
  }

  .grok-ui-layer {
    position: relative;
    z-index: 20;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .grok-input-container {
    background: rgba(10, 10, 10, 0.56);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.45);
    border-radius: 24px;
    transition: all 0.3s ease;
  }

  .grok-input-container:hover,
  .grok-input-container:focus-within {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(15, 15, 15, 0.8);
    box-shadow: 0 0 7px rgba(45, 155, 225, 1.05);
  }

  .grok-input-container textarea {
    resize: none;
    scrollbar-width: none;
  }
  .grok-input-container textarea::-webkit-scrollbar {
    display: none;
  }

  .grok-nav-link {
    position: relative;
    opacity: 1;
    transition: opacity 0.5s;
  }
  .grok-nav-link:hover { opacity: 1; }

  .grok-btn-glow {
    transition: all 0.3s ease;
  }
  .grok-btn-glow:hover {
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
    border-color: #fff;
  }

  .grok-cursor-blink {
    animation: grok-blink 1s step-end infinite;
  }
  @keyframes grok-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .grok-pill-btn {
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 999px;
    padding: 0.5rem 1.5rem;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    transition: all 0.3s;
  }
  .grok-pill-btn:hover {
    background: #fff;
    color: #000;
  }
`;

export const GrokAI = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }
    window.addEventListener("resize", resize);
    resize();

    const vsSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 vUv;

      float random(in vec2 _st) {
        return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      float noise(in vec2 _st) {
        vec2 i = floor(_st);
        vec2 f = fract(_st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      #define NUM_OCTAVES 5

      float fbm(in vec2 _st) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
        for (int i = 0; i < NUM_OCTAVES; ++i) {
          v += a * noise(_st);
          _st = rot * _st * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;

        vec2 mouse = u_mouse.xy / u_resolution.xy;
        mouse.x *= u_resolution.x / u_resolution.y;
        float dist = distance(st, mouse);

        vec2 q = vec2(0.);
        q.x = fbm(st + 0.00 * u_time);
        q.y = fbm(st + vec2(1.0));

        vec2 r = vec2(0.);
        r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * u_time);
        r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * u_time);

        float f = fbm(st + r);

        vec3 color = mix(vec3(1.0, 1.0, 2.0), vec3(0.31, 0.62, 0.4), clamp((f * f) * 2.0, 0.0, 1.0));
        color = mix(color, vec3(0.7, 0.6, 0.2), clamp(length(q), 0.0, 1.0));
        color = mix(color, vec3(1.0, 1.0, 1.0), clamp(length(r.x), 0.0, 1.0));

        float glow = 0.2 - smoothstep(0.2, 0.01, length(st - vec2(u_resolution.x / u_resolution.y + 20.2, 20.5)));
        float mouseGlow = 0.15 / (dist + 0.05);

        vec3 finalColor = (f * f * f + 0.6 * f * f + 0.5 * f) * color;
        finalColor += vec3(0.1, 0.2, 0.5) * glow * 1.5;
        finalColor += vec3(0.9, 0.1, 3.6) * mouseGlow * 0.04;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const positionLocation = gl.getAttribLocation(program, "position");
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = canvas!.height - e.clientY;
    };
    document.addEventListener("mousemove", onMouseMove);

    let animId: number;
    function render(time: number) {
      time *= 0.001;
      mouseX += (targetMouseX - mouseX) * 0.1;
      mouseY += (targetMouseY - mouseY) * 0.1;
      gl!.useProgram(program);
      gl!.enableVertexAttribArray(positionLocation);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer);
      gl!.vertexAttribPointer(positionLocation, 2, gl!.FLOAT, false, 0, 0);
      gl!.uniform1f(uTime, time);
      gl!.uniform2f(uResolution, canvas!.width, canvas!.height);
      gl!.uniform2f(uMouse, mouseX, mouseY);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    }
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="grok-wrap">
        <div className="grok-hero-text-layer">
          <h1 className="grok-hero-title">Luxora</h1>
        </div>

        <canvas ref={canvasRef} className="grok-canvas" />

        <div className="grok-ui-layer" style={{ padding: "1.5rem 2rem" }}>
          <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.1em", fontWeight: 700 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
              <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.05em", marginRight: "1rem" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 3H20.5L13.5 12L20.5 21H16.5L11.5 14L6.5 21H2.5L9.5 12L2.5 3H6.5L11.5 10L16.5 3Z" fill="white" />
                </svg>
              </a>
              <nav style={{ display: "flex", gap: "2rem", color: "#a3a3a3" }} className="hidden md:flex">
                <a href="#" className="grok-nav-link" style={{ color: "#fff" }} onClick={e => e.preventDefault()}>Luxora</a>
                <a href="#" className="grok-nav-link" onClick={e => e.preventDefault()}>API</a>
                <a href="#" className="grok-nav-link" onClick={e => e.preventDefault()}>Company</a>
                <a href="#" className="grok-nav-link" onClick={e => e.preventDefault()}>Careers</a>
                <a href="#" className="grok-nav-link" onClick={e => e.preventDefault()}>News</a>
              </nav>
            </div>
            <a href="#" className="grok-btn-glow" onClick={e => e.preventDefault()} style={{ border: "1px solid rgba(255,255,255,0.2)", padding: "0.5rem 1.25rem", borderRadius: "9999px", color: "#fff", textDecoration: "none", transition: "all 0.3s" }}>
              Try Luxora
            </a>
          </header>

          <main style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", paddingBottom: "5rem", position: "relative" }}>
            <div className="grok-input-container" style={{ width: "100%", maxWidth: "42rem", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "10rem", padding: "1rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", height: "100%" }}>
                <span className="grok-cursor-blink" style={{ color: "rgba(255,255,255,0.4)", marginTop: "0.25rem" }}>|</span>
                <textarea
                  style={{ width: "100%", height: "100%", background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "1.25rem", fontWeight: 300, fontFamily: "'Space Mono', monospace" }}
                  placeholder="Type / for commands"
                />
              </div>
              <div style={{ position: "absolute", bottom: "1rem", right: "1rem" }}>
                <button style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer" }}>
                  <svg width="14" height="14" viewBox="0 0 384 512" fill="currentColor">
                    <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
                  </svg>
                </button>
              </div>
            </div>
          </main>

          <footer style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", width: "100%", fontSize: "0.75rem" }}>
            <div style={{ opacity: 0.5 }}>↓</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1rem", textAlign: "right" }}>
              <div style={{ maxWidth: "28rem" }}>
                <div style={{ fontWeight: 700, color: "#9ca3af" }}>Luxora joins the future:</div>
                <div style={{ color: "#fff", fontWeight: 700, lineHeight: 1.25 }}>Build websites with good taste by default.</div>
              </div>
              <a href="#" className="grok-pill-btn" onClick={e => e.preventDefault()} style={{ textTransform: "uppercase", whiteSpace: "nowrap", color: "#fff", textDecoration: "none" }}>
                Read Announcement
              </a>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

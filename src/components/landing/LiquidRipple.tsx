import { useEffect, useRef } from "react";

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
const RND_V = `
  attribute vec2 a_pos;
  varying vec2 v_uv;
  void main() { v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }
`;
const RND_F = `
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
    vec3  Hv   = normalize(L + vec3(0.0, 0.0, 1.0));
    float spec = pow(max(dot(N, Hv), 0.0), 48.0);

    vec3 color = vec3(spec * 0.6);
    float alpha = clamp(spec * 0.7 + caustic * 0.15, 0.0, 0.55);

    vec2 c = v_uv * 2.0 - 1.0;
    alpha *= 1.0 - dot(c, c) * 0.25;

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function LiquidRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl") || (canvas.getContext as any)("experimental-webgl");
    if (!gl) return;

    const extFloat = gl.getExtension("OES_texture_float");
    if (!extFloat) return;
    const extFloatLinear = gl.getExtension("OES_texture_float_linear");

    function compile(type: number, src: string) {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
      return s;
    }
    function link(vSrc: string, fSrc: string) {
      const vs = compile(gl.VERTEX_SHADER, vSrc);
      const fs = compile(gl.FRAGMENT_SHADER, fSrc);
      if (!vs || !fs) return null;
      const p = gl.createProgram()!;
      gl.attachShader(p, vs); gl.attachShader(p, fs);
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
      return p;
    }
    function makeTex(w: number, h: number) {
      const t = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, t);
      const filter = extFloatLinear ? gl.LINEAR : gl.NEAREST;
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.FLOAT, null);
      return t;
    }
    function makeFBO(tex: WebGLTexture) {
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) return null;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return fbo;
    }

    const SW = 512, SH = 512;
    const quad = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);

    function drawQuad(aLoc: number) {
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(aLoc);
      gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    const simProg = link(SIM_V, SIM_F);
    const rndProg = link(RND_V, RND_F);
    if (!simProg || !rndProg) return;

    const S = {
      aPos: gl.getAttribLocation(simProg, "a_pos"),
      state: gl.getUniformLocation(simProg, "u_state"),
      texel: gl.getUniformLocation(simProg, "u_texel"),
      mouse: gl.getUniformLocation(simProg, "u_mouse"),
      imp: gl.getUniformLocation(simProg, "u_impulse"),
    };
    const R = {
      aPos: gl.getAttribLocation(rndProg, "a_pos"),
      wave: gl.getUniformLocation(rndProg, "u_wave"),
      texel: gl.getUniformLocation(rndProg, "u_texel"),
      time: gl.getUniformLocation(rndProg, "u_time"),
    };

    let texA = makeTex(SW, SH), texB = makeTex(SW, SH);
    let fboA = makeFBO(texA)!, fboB = makeFBO(texB)!;
    if (!fboA || !fboB) return;

    const TX = 1.0 / SW, TY = 1.0 / SH;

    let mX = -1, mY = -1, moved = false, held = false;

    function setPos(cx: number, cy: number) {
      const nx = cx / window.innerWidth;
      const ny = 1.0 - cy / window.innerHeight;
      if (Math.abs(nx - mX) > 0.001 || Math.abs(ny - mY) > 0.001) moved = true;
      mX = nx; mY = ny;
    }

    const onMove = (e: MouseEvent) => { setPos(e.clientX, e.clientY); };
    const onLeave = () => { mX = -1; mY = -1; };
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

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const t0 = performance.now();
    let animId: number;

    function render(ts: number) {
      const t = (ts - t0) / 1000.0;

      // Pass A - simulate
      gl.viewport(0, 0, SW, SH);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fboB);
      gl.useProgram(simProg);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texA);
      gl.uniform1i(S.state, 0);
      gl.uniform2f(S.texel, TX, TY);
      gl.uniform2f(S.mouse, mX, mY);
      gl.uniform1f(S.imp, ((moved || held) && mX >= 0) ? 1.0 : 0.0);
      moved = false;
      drawQuad(S.aPos);

      // Swap
      let tmp: any;
      tmp = texA; texA = texB; texB = tmp;
      tmp = fboA; fboA = fboB; fboB = tmp;

      // Pass B - render
      gl.viewport(0, 0, canvas!.width, canvas!.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(rndProg);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texA);
      gl.uniform1i(R.wave, 0);
      gl.uniform2f(R.texel, TX, TY);
      gl.uniform1f(R.time, t);
      drawQuad(R.aPos);

      animId = requestAnimationFrame(render);
    }
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ display: "block", zIndex: 2, mixBlendMode: "screen" }}
    />
  );
}

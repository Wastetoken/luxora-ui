import { useRef, useEffect } from "react";

const VERT = `
  attribute vec2 a_pos;
  varying vec2 v_uv;
  void main() {
    v_uv = vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5);
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
`;

const FRAG = `
  precision highp float;
  varying vec2 v_uv;
  uniform sampler2D u_tex;
  uniform vec2 u_mouse;
  uniform float u_hover;
  uniform float u_time;
  uniform vec2 u_resolution;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x_) - 0.5;
    vec3 ox = floor(x_ + 0.5);
    vec3 a0 = x_ - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float f = 0.0;
    f += 0.5000 * snoise(p); p *= 2.02;
    f += 0.2500 * snoise(p); p *= 2.03;
    f += 0.1250 * snoise(p); p *= 2.01;
    f += 0.0625 * snoise(p);
    return f;
  }

  void main() {
    vec2 uv = v_uv;

    if (u_hover > 0.001) {
      float aspect = u_resolution.x / u_resolution.y;
      vec2 diff = uv - u_mouse;
      diff.x *= aspect;
      float dist = length(diff);

      float radius = 0.35;
      float influence = smoothstep(radius, 0.0, dist);

      float t = u_time * 0.8;
      vec2 noiseCoord = uv * 4.0;
      float nx = fbm(noiseCoord + vec2(t, 0.0));
      float ny = fbm(noiseCoord + vec2(5.2, t * 0.7));

      float strength = 0.12 * influence * u_hover;
      uv += vec2(nx, ny) * strength;
    }

    vec4 color = texture2D(u_tex, uv);
    gl_FragColor = color;
  }
`;

interface Props {
  text: string;
}

export default function PerlinHoverText({ text }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    mouseX: 0.5, mouseY: 0.5, hover: false,
    hoverAmount: 0, animId: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    const glCanvas = glCanvasRef.current;
    if (!container || !glCanvas) return;

    const gl = glCanvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) {
      console.error("PerlinHoverText: WebGL context failed");
      return;
    }

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl!.getShaderInfoLog(s));
        gl!.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog));
      return;
    }

    const aPos = gl.getAttribLocation(prog, "a_pos");
    const uTex = gl.getUniformLocation(prog, "u_tex");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uHover = gl.getUniformLocation(prog, "u_hover");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");

    const quad = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);

    // Create text texture
    const textCanvas = document.createElement("canvas");
    const textCtx = textCanvas.getContext("2d")!;
    const tex = gl.createTexture()!;

    function uploadTextTexture() {
      const dpr = window.devicePixelRatio || 1;
      const rect = container!.getBoundingClientRect();
      const w = Math.ceil(rect.width * dpr);
      const h = Math.ceil(rect.height * dpr);
      if (w === 0 || h === 0) return;

      textCanvas.width = w;
      textCanvas.height = h;
      textCtx.clearRect(0, 0, w, h);

      const fontSize = (rect.width / text.length) * 1.45 * dpr;
      textCtx.font = `400 ${fontSize}px 'Cinzel Decorative', serif`;
      textCtx.textAlign = "center";
      textCtx.textBaseline = "middle";
      textCtx.fillStyle = "#ffffff";
      textCtx.fillText(text, w / 2, h / 2);

      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, textCanvas);
    }

    let needsUpload = true;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = container!.getBoundingClientRect();
      glCanvas!.width = Math.ceil(rect.width * dpr);
      glCanvas!.height = Math.ceil(rect.height * dpr);
      glCanvas!.style.width = rect.width + "px";
      glCanvas!.style.height = rect.height + "px";
      needsUpload = true;
    }

    resize();
    window.addEventListener("resize", resize);

    const t0 = performance.now();

    function render() {
      if (needsUpload) {
        uploadTextTexture();
        needsUpload = false;
      }

      const t = (performance.now() - t0) / 1000;
      const st = stateRef.current;

      const target = st.hover ? 1.0 : 0.0;
      st.hoverAmount += (target - st.hoverAmount) * 0.06;
      if (Math.abs(st.hoverAmount) < 0.001) st.hoverAmount = 0;

      gl!.viewport(0, 0, glCanvas!.width, glCanvas!.height);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.enable(gl!.BLEND);
      gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE_MINUS_SRC_ALPHA);

      gl!.useProgram(prog);
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      gl!.uniform1i(uTex, 0);
      gl!.uniform2f(uMouse, st.mouseX, st.mouseY);
      gl!.uniform1f(uHover, st.hoverAmount);
      gl!.uniform1f(uTime, t);
      gl!.uniform2f(uRes, glCanvas!.width, glCanvas!.height);

      gl!.bindBuffer(gl!.ARRAY_BUFFER, quad);
      gl!.enableVertexAttribArray(aPos);
      gl!.vertexAttribPointer(aPos, 2, gl!.FLOAT, false, 0, 0);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);

      st.animId = requestAnimationFrame(render);
    }

    document.fonts.ready.then(() => {
      needsUpload = true;
      stateRef.current.animId = requestAnimationFrame(render);
    });

    return () => {
      cancelAnimationFrame(stateRef.current.animId);
      window.removeEventListener("resize", resize);
    };
  }, [text]);

  const onMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    stateRef.current.mouseX = (e.clientX - rect.left) / rect.width;
    stateRef.current.mouseY = (e.clientY - rect.top) / rect.height;
    stateRef.current.hover = true;
  };
  const onLeave = () => { stateRef.current.hover = false; };

  return (
    <div
      ref={containerRef}
      className="relative inline-block pointer-events-auto"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ cursor: "default", padding: "0.15em 0", isolation: "isolate" }}
    >
      <span className="invisible block" style={{ fontFamily: "'Cinzel Decorative', serif", fontWeight: 400, lineHeight: 1.3 }}>{text}</span>
      <canvas
        ref={glCanvasRef}
        className="absolute inset-0"
        style={{ pointerEvents: "none", mixBlendMode: "normal" }}
      />
    </div>
  );
}

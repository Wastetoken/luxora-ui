import { useEffect, useRef } from 'react';

const vertexShader = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform vec2 iResolution;
  uniform float iTime;
  uniform vec2 iMouse;

  #define PI 3.14159265359

  mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float f = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      f += amp * noise(p);
      p = p * 2.1 + vec2(1.7, 9.2);
      amp *= 0.5;
    }
    return f;
  }

  float pattern(vec2 p, float t) {
    vec2 q = vec2(
      fbm(p + vec2(0.0, 0.0) + 0.15 * t),
      fbm(p + vec2(5.2, 1.3) + 0.12 * t)
    );
    vec2 r = vec2(
      fbm(p + 4.0 * q + vec2(1.7, 9.2) + 0.126 * t),
      fbm(p + 4.0 * q + vec2(8.3, 2.8) + 0.13 * t)
    );
    return fbm(p + 4.0 * r);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 p = uv * 3.0 - 1.5;
    p.x *= iResolution.x / iResolution.y;

    float t = iTime * 0.3;

    // Mouse influence
    vec2 mouseNorm = iMouse / iResolution;
    p += (mouseNorm - 0.5) * 0.3;

    float f = pattern(p, t);

    // Amber/gold palette on dark charcoal
    vec3 colA = vec3(0.04, 0.04, 0.06);   // deep charcoal
    vec3 colB = vec3(0.12, 0.08, 0.02);   // dark amber
    vec3 colC = vec3(0.85, 0.55, 0.1);    // bright amber
    vec3 colD = vec3(0.95, 0.75, 0.3);    // gold highlight

    vec3 col = colA;
    col = mix(col, colB, smoothstep(0.0, 0.4, f));
    col = mix(col, colC, smoothstep(0.4, 0.8, f) * 0.15);
    col = mix(col, colD, smoothstep(0.75, 1.0, f) * 0.08);

    // Subtle vignette
    float vig = 1.0 - 0.4 * length(uv - 0.5);
    col *= vig;

    // Add very subtle noise grain
    float grain = hash(uv * iTime) * 0.02;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vertexShader);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentShader);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(program, 'iResolution');
    const timeLoc = gl.getUniformLocation(program, 'iTime');
    const mouseLoc = gl.getUniformLocation(program, 'iMouse');

    const mouse = { x: 0, y: 0 };
    const startTime = Date.now();

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      mouse.x = (e.clientX - rect.left) * dpr;
      mouse.y = canvas.height - (e.clientY - rect.top) * dpr;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    let animId: number;
    const render = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, (Date.now() - startTime) / 1000);
      gl.uniform2f(mouseLoc, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ display: 'block', zIndex: 0 }}
    />
  );
}

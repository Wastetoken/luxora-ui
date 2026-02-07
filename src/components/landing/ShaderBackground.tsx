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
    float aspect = iResolution.x / iResolution.y;
    vec2 p = uv * 3.0 - 1.5;
    p.x *= aspect;

    float t = iTime * 0.25;

    // Mouse influence
    vec2 mouseNorm = iMouse / iResolution;
    p += (mouseNorm - 0.5) * 0.2;

    float f = pattern(p, t);

    // Base: olive/sage green
    vec3 sage = vec3(0.52, 0.56, 0.42);
    vec3 olive = vec3(0.45, 0.50, 0.38);
    vec3 col = mix(sage, olive, f);

    // Central radial glow — pink/magenta orb
    vec2 center = uv - 0.5;
    center.x *= aspect;
    float dist = length(center);

    // Concentric ring distortion
    float rings = sin(dist * 18.0 - t * 1.5) * 0.5 + 0.5;
    rings *= exp(-dist * 3.0);

    // Pink/magenta gradient from center
    vec3 pink = vec3(0.82, 0.32, 0.62);
    vec3 magenta = vec3(0.72, 0.22, 0.58);
    vec3 hotPink = vec3(0.90, 0.40, 0.70);

    // Strong central glow
    float glow = exp(-dist * 2.2);
    col = mix(col, pink, glow * 0.85);
    col = mix(col, magenta, glow * rings * 0.4);
    col = mix(col, hotPink, exp(-dist * 4.0) * 0.5);

    // Purple transition zone between pink and green
    vec3 purple = vec3(0.55, 0.35, 0.55);
    float purpleZone = smoothstep(0.2, 0.5, dist) * smoothstep(0.7, 0.4, dist);
    col = mix(col, purple, purpleZone * 0.3);

    // Subtle pattern-based color variation
    col += vec3(0.05, -0.02, 0.03) * f;

    // Gentle vignette
    float vig = 1.0 - 0.25 * length(uv - 0.5);
    col *= vig;

    // Subtle grain
    float grain = hash(uv * iTime) * 0.025;
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

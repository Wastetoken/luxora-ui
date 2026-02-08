import { useEffect, useRef } from 'react';

const lensVertex = `
  attribute vec2 position;
  void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const lensFragment = `
  precision highp float;
  uniform vec3 iResolution;
  uniform float iTime;
  uniform vec2 uCenter;
  uniform float uZoom;
  uniform vec2 uScreenSize;

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
    vec2 lensUV = fragCoord / iResolution.xy;

    // Circular mask
    vec2 centered = lensUV * 2.0 - 1.0;
    float dist = length(centered);
    if (dist > 1.0) discard;

    // Map lens pixel to screen coordinate (zoomed around cursor)
    vec2 screenCoord = uCenter + (lensUV - 0.5) * (iResolution.xy / uZoom);
    vec2 uv = (screenCoord * 2.0 - uScreenSize) / min(uScreenSize.x, uScreenSize.y);
    float t = iTime * TIME_SCALE;

    vec3 cam_pos = vec3(3.5 * sin(t * 0.15), 2.5, 3.5 * cos(t * 0.15));
    vec3 cam_dir = normalize(-cam_pos);
    vec3 cam_up = vec3(0.0, 1.0, 0.0);
    vec3 cam_right = normalize(cross(cam_dir, cam_up));
    vec3 ray_dir = normalize(cam_dir + uv.x * cam_right + uv.y * cam_up);
    vec3 ray_pos = cam_pos;
    vec3 total_color = vec3(0.0);
    float step_size = RESOLUTION;

    for (int i = 0; i < MAX_STEPS; i++) {
      ComplexFrame cf = get_complex_frame(ray_pos, t);
      vec3 dir_color = abs(cf.real_ux) * vec3(1.0, 0.3, 0.2) +
                       abs(cf.real_uy) * vec3(0.2, 0.4, 1.0) +
                       abs(cf.real_uz) * vec3(0.9, 0.5, 0.2);
      float blend = 0.5 + 0.5 * sin(t * 1.5);
      vec3 complex_color = mix(dir_color, abs(cf.imag_ux + cf.imag_uy + cf.imag_uz), blend);
      complex_color *= (0.6 + cf.scalar_part * 0.8);
      complex_color = artistic_color_transform(complex_color, ray_pos, t);
      float alpha = 0.12;
      total_color = total_color * (1.0 - alpha) + complex_color * alpha;
      ray_pos += ray_dir * step_size;
    }

    // Glass edge refraction — chromatic shift at rim
    float edgeFactor = smoothstep(0.6, 1.0, dist);
    vec3 refracted = total_color;
    refracted.r *= 1.0 + edgeFactor * 0.3;
    refracted.b *= 1.0 - edgeFactor * 0.15;
    refracted = mix(total_color, refracted, edgeFactor);
    refracted += edgeFactor * 0.08;

    float edgeAlpha = 1.0 - smoothstep(0.92, 1.0, dist);
    gl_FragColor = vec4(refracted, edgeAlpha);
  }
`;

const SIZE = 130;
const ZOOM = 2.0;

export default function LiquidCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const target = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    canvas.width = SIZE;
    canvas.height = SIZE;

    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false }) ||
               canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) return;
    glRef.current = gl;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Lens shader error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, lensVertex);
    const fs = createShader(gl.FRAGMENT_SHADER, lensFragment);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Lens link error:', gl.getProgramInfoLog(program));
      return;
    }
    programRef.current = program;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    uniformsRef.current = {
      iResolution: gl.getUniformLocation(program, 'iResolution'),
      iTime: gl.getUniformLocation(program, 'iTime'),
      uCenter: gl.getUniformLocation(program, 'uCenter'),
      uZoom: gl.getUniformLocation(program, 'uZoom'),
      uScreenSize: gl.getUniformLocation(program, 'uScreenSize'),
    };

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    startTimeRef.current = Date.now();

    let animId: number;

    const render = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.12;
      pos.current.y += (target.current.y - pos.current.y) * 0.12;
      container.style.left = pos.current.x + 'px';
      container.style.top = pos.current.y + 'px';

      const gl2 = glRef.current;
      const prog = programRef.current;
      const u = uniformsRef.current;
      if (gl2 && prog) {
        gl2.viewport(0, 0, SIZE, SIZE);
        gl2.clearColor(0, 0, 0, 0);
        gl2.clear(gl2.COLOR_BUFFER_BIT);
        gl2.useProgram(prog);
        gl2.uniform3f(u.iResolution!, SIZE, SIZE, 1.0);
        gl2.uniform1f(u.iTime!, (Date.now() - startTimeRef.current) / 1000);
        gl2.uniform2f(u.uCenter!, pos.current.x, window.innerHeight - pos.current.y);
        gl2.uniform1f(u.uZoom!, ZOOM);
        gl2.uniform2f(u.uScreenSize!, window.innerWidth, window.innerHeight);
        gl2.drawArrays(gl2.TRIANGLES, 0, 6);
      }

      animId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      container.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      container.style.opacity = '0';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    render();

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed pointer-events-none z-[9999]"
      style={{
        width: SIZE,
        height: SIZE,
        transform: 'translate(-50%, -50%)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: '50%',
          boxShadow: [
            '0 0 0 1.5px rgba(255,255,255,0.18)',
            '0 0 12px rgba(255,255,255,0.06)',
            '0 0 30px rgba(255,255,255,0.03)',
          ].join(', '),
        }}
      />
    </div>
  );
}

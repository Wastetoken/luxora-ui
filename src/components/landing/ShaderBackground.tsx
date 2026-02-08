import { useEffect, useRef } from 'react';

const vertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
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
    
    gl_FragColor = vec4(total_color, 1.0);
  }
`;

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true }) || canvas.getContext('webgl', { preserveDrawingBuffer: true });
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

    const vs = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
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

    const posLoc = gl.getAttribLocation(program, 'position');
    const resLoc = gl.getUniformLocation(program, 'iResolution');
    const timeLoc = gl.getUniformLocation(program, 'iTime');

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const startTime = Date.now();
    let animId: number;

    const render = () => {
      const currentTime = (Date.now() - startTime) / 1000;

      gl.useProgram(program);
      gl.uniform3f(resLoc, canvas.width, canvas.height, 1.0);
      gl.uniform1f(timeLoc, currentTime);

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
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

import { useEffect, useRef, useState } from 'react';

const vertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const getFragmentShader = (invert: boolean) => `
  precision highp float;
  uniform vec2 iResolution;
  uniform float iTime;
  uniform vec3 iMouse;
  uniform vec2 iClickPos;
  uniform float iClickTime;

  float noise(vec2 p) {
    return smoothstep(-0.5, 0.9, sin((p.x - p.y) * 555.0) * sin(p.y * 1444.0)) - 0.4;
  }

  float fabric(vec2 p) {
    mat2 m = mat2(0.06, 0.02, -0.02, -0.01);
    float f = 0.62 * noise(p);
    f += -0.43 * noise(p = m * p);
    f += -0.12 * noise(p = m * p);
    return f + 0.1 / noise(m * p);
  }

  float silk(vec2 uv, float t) {
    float s = sin(-15.0 * (uv.x + uv.y + cos(26.0 * uv.x + 5.0 * uv.y)) + sin(19.0 * (uv.x + uv.y)) - t);
    s = 1.17 + 0.01 * (s * s * 20.5 + s);
    s *= 0.8 + 0.91 * fabric(uv * min(iResolution.x, iResolution.y) * 0.5999);
    return s * 0.1009 + 0.8100;
  }

  float silkd(vec2 uv, float t) {
    float xy = uv.x + uv.y;
    float d = (1.001 * (1.0 - 80.0 * sin(2.0 * uv.x + -7.0 * uv.y)) + 999.0 * cos(1.0 * xy)) * 
              cos(5.0 * (cos(2.0 * uv.x + 5.0 * uv.y) + xy) + sin(12.0 * xy) - t);
    return 0.005 * d * (sign(d) + 3.0);
  }

  void main() {
    float mr = min(iResolution.x, iResolution.y);
    vec2 uv = gl_FragCoord.xy / mr;
    float t = iTime;
    
    uv.y += 0.03 * sin(8.0 * uv.x - t);
    
    float timeSinceClick = t - iClickTime;
    
    if (timeSinceClick < 3.0 && iClickTime > 0.0) {
      vec2 clickUv = iClickPos.xy / mr;
      float dist = distance(clickUv, uv);
      float ripple = sin(dist * 50.0 - timeSinceClick * 12.0) * exp(-dist * 5.0 - timeSinceClick * 2.0);
      uv += normalize(uv - clickUv) * ripple * 0.08;
    }
    
    float s = sqrt(silk(uv, t));
    float d = silkd(uv, t);
    
    vec3 c = vec3(s);
    c += 0.7 * vec3(1.0, 0.83, 0.6) * d;
    c *= 1.0 - max(0.0, 0.8 * d);
    
    ${invert ? `
      c = pow(c, 0.3 / vec3(0.52, 0.5, 0.4));
      c = 1.0 - c;
    ` : `
      c = pow(c, vec3(0.52, 0.5, 0.4));
    `}
    
    gl_FragColor = vec4(c, 1.0);
  }
`;

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark') ||
                         window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(isDarkMode);
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkTheme);
    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkTheme);
    };
  }, []);

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

    const vs = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl.FRAGMENT_SHADER, getFragmentShader(isDark));
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
    const clickPosLoc = gl.getUniformLocation(program, 'iClickPos');
    const clickTimeLoc = gl.getUniformLocation(program, 'iClickTime');

    const mouse = { x: 0, y: 0, z: 0 };
    const clickPos = { x: 0, y: 0 };
    let clickTime = 0;
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

    const handleMouseDown = () => {
      mouse.z = 2;
      clickPos.x = mouse.x;
      clickPos.y = mouse.y;
      clickTime = (Date.now() - startTime) / 1000;
    };

    const handleMouseUp = () => { mouse.z = 0; };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    let animId: number;
    const render = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, (Date.now() - startTime) / 1000);
      gl.uniform3f(mouseLoc, mouse.x, mouse.y, mouse.z);
      gl.uniform2f(clickPosLoc, clickPos.x, clickPos.y);
      gl.uniform1f(clickTimeLoc, clickTime);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ display: 'block', zIndex: 0 }}
    />
  );
}

"use client";

import { ArrowRight } from "lucide-react";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const simulationVertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const simulationFragmentShader = `
uniform sampler2D textureA;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;
uniform int frame;
varying vec2 vUv;

const float delta = 1.4;  

void main() {
    vec2 uv = vUv;
    if (frame == 0) {
        gl_FragColor = vec4(0.0);
        return;
    }
    
    vec4 data = texture2D(textureA, uv);
    float pressure = data.x;
    float pVel = data.y;
    
    vec2 texelSize = 1.0 / resolution;
    float p_right = texture2D(textureA, uv + vec2(texelSize.x, 0.0)).x;
    float p_left = texture2D(textureA, uv + vec2(-texelSize.x, 0.0)).x;
    float p_up = texture2D(textureA, uv + vec2(0.0, texelSize.y)).x;
    float p_down = texture2D(textureA, uv + vec2(0.0, -texelSize.y)).x;
    
    if (uv.x <= texelSize.x) p_left = p_right;
    if (uv.x >= 1.0 - texelSize.x) p_right = p_left;
    if (uv.y <= texelSize.y) p_down = p_up;
    if (uv.y >= 1.0 - texelSize.y) p_up = p_down;
    
    // Enhanced wave equation matching ShaderToy
    pVel += delta * (-2.0 * pressure + p_right + p_left) / 4.0;
    pVel += delta * (-2.0 * pressure + p_up + p_down) / 4.0;
    
    pressure += delta * pVel;
    
    pVel -= 0.005 * delta * pressure;
    
    pVel *= 1.0 - 0.002 * delta;
    pressure *= 0.999;
    
    // Mouse interaction
    vec2 mouseUV = mouse / resolution;
    if(mouse.x > 0.0) {
        float dist = distance(uv, mouseUV);
        if(dist <= 0.02) {  // Smaller radius for more precise ripples
            pressure += 2.0 * (1.0 - dist / 0.02);  // Increased intensity
        }
    }
    
    
    gl_FragColor = vec4(pressure, pVel, 
        (p_right - p_left) / 2.0, 
        (p_up - p_down) / 2.0);
}
`;

const renderVertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const renderFragmentShader = `
uniform sampler2D textureA;
uniform sampler2D textureB;
varying vec2 vUv;

void main() {
    vec4 data = texture2D(textureA, vUv);
    
    vec2 distortion = 0.3 * data.zw;
    vec4 color = texture2D(textureB, vUv + distortion);
    
    vec3 normal = normalize(vec3(-data.z * 2.0, 0.5, -data.w * 2.0));
    vec3 lightDir = normalize(vec3(-3.0, 10.0, 3.0));
    float specular = pow(max(0.0, dot(normal, lightDir)), 60.0) * 1.5;
    
    gl_FragColor = color + vec4(specular);
}
`;

interface LiquidSimulationProps {
  imagePath?: string;
  text?: string;
}

const LiquidSimulation = ({
  imagePath = "/skiperv1/skiper12/vercel_logo_liquid.avif",
  text,
}: LiquidSimulationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const simSceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const frameRef = useRef(0);
  const rtARef = useRef<THREE.WebGLRenderTarget | null>(null);
  const rtBRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const simMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const renderMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const textTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const simScene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2();
    let frame = 0;

    const width = window.innerWidth * window.devicePixelRatio;
    const height = window.innerHeight * window.devicePixelRatio;
    const options = {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      stencilBuffer: false,
      depthBuffer: false,
    };
    let rtA = new THREE.WebGLRenderTarget(width, height, options);
    let rtB = new THREE.WebGLRenderTarget(width, height, options);

    const simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        mouse: { value: mouse },
        resolution: { value: new THREE.Vector2(width, height) },
        time: { value: 0 },
        frame: { value: 0 },
      },
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
    });

    const renderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        textureB: { value: null },
      },
      vertexShader: renderVertexShader,
      fragmentShader: renderFragmentShader,
      transparent: true,
    });

    const plane = new THREE.PlaneGeometry(2, 2);
    const simQuad = new THREE.Mesh(plane, simMaterial);
    const renderQuad = new THREE.Mesh(plane, renderMaterial);

    simScene.add(simQuad);
    scene.add(renderQuad);

    // Create background texture with image or text
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { alpha: true });

    if (ctx) {
      // Create black background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      const textTexture = new THREE.CanvasTexture(canvas);
      textTexture.minFilter = THREE.LinearFilter;
      textTexture.magFilter = THREE.LinearFilter;
      textTexture.format = THREE.RGBAFormat;

      // Function to load content and start animation
      const loadContentAndStart = () => {
        if (imagePath) {
          // Load and draw image
          const logoImg = new Image();
          logoImg.crossOrigin = "anonymous";
          logoImg.onload = () => {
            // Calculate logo size to fill half the canvas while maintaining aspect ratio
            const canvasAspect = width / height;
            const imageAspect = logoImg.width / logoImg.height;

            let logoWidth, logoHeight, logoX, logoY;

            if (imageAspect > canvasAspect) {
              // Image is wider than canvas - fit to half width
              logoWidth = width * 0.5;
              logoHeight = logoWidth / imageAspect;
              logoX = (width - logoWidth) / 2;
              logoY = (height - logoHeight) / 2;
            } else {
              // Image is taller than canvas - fit to half height
              logoHeight = height * 0.5;
              logoWidth = logoHeight * imageAspect;
              logoX = (width - logoWidth) / 2;
              logoY = (height - logoHeight) / 2;
            }

            ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
            textTexture.needsUpdate = true;

            // Start animation after image is loaded
            startAnimation();
          };
          logoImg.src = imagePath;
        } else if (text) {
          // Draw text
          const fontSize = Math.round(250 * window.devicePixelRatio);
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${fontSize}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.textRendering = "geometricPrecision";
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.fillText(text, width / 2, height / 2);
          textTexture.needsUpdate = true;

          // Start animation immediately for text
          startAnimation();
        } else {
          // No content, start animation with black background
          startAnimation();
        }
      };

      // Store refs
      rendererRef.current = renderer;
      sceneRef.current = scene;
      simSceneRef.current = simScene;
      cameraRef.current = camera;
      mouseRef.current = mouse;
      frameRef.current = frame;
      rtARef.current = rtA;
      rtBRef.current = rtB;
      simMaterialRef.current = simMaterial;
      renderMaterialRef.current = renderMaterial;
      textTextureRef.current = textTexture;

      // Function to start animation after content is loaded
      const startAnimation = () => {
        // Event listeners
        const handleResize = () => {
          const newWidth = window.innerWidth * window.devicePixelRatio;
          const newHeight = window.innerHeight * window.devicePixelRatio;

          renderer.setSize(window.innerWidth, window.innerHeight);
          rtA.setSize(newWidth, newHeight);
          rtB.setSize(newWidth, newHeight);
          simMaterial.uniforms.resolution.value.set(newWidth, newHeight);

          canvas.width = newWidth;
          canvas.height = newHeight;
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, newWidth, newHeight);

          // Reload content with new dimensions
          if (imagePath) {
            const logoImg = new Image();
            logoImg.crossOrigin = "anonymous";
            logoImg.onload = () => {
              // Calculate logo size to fill half the canvas while maintaining aspect ratio
              const canvasAspect = newWidth / newHeight;
              const imageAspect = logoImg.width / logoImg.height;

              let logoWidth, logoHeight, logoX, logoY;

              if (imageAspect > canvasAspect) {
                // Image is wider than canvas - fit to half width
                logoWidth = newWidth * 0.5;
                logoHeight = logoWidth / imageAspect;
                logoX = (newWidth - logoWidth) / 2;
                logoY = (newHeight - logoHeight) / 2;
              } else {
                // Image is taller than canvas - fit to half height
                logoHeight = newHeight * 0.5;
                logoWidth = newHeight * imageAspect;
                logoX = (newWidth - logoWidth) / 2;
                logoY = (newHeight - logoHeight) / 2;
              }

              ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
              textTexture.needsUpdate = true;
            };
            logoImg.src = imagePath;
          } else if (text) {
            const fontSize = Math.round(250 * window.devicePixelRatio);
            ctx.fillStyle = "#ffffff";
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(text, newWidth / 2, newHeight / 2);
            textTexture.needsUpdate = true;
          }
        };

        const handleMouseMove = (e: MouseEvent) => {
          mouse.x = e.clientX * window.devicePixelRatio;
          mouse.y = (window.innerHeight - e.clientY) * window.devicePixelRatio;
        };

        const handleMouseLeave = () => {
          mouse.set(0, 0);
        };

        window.addEventListener("resize", handleResize);
        renderer.domElement.addEventListener("mousemove", handleMouseMove);
        renderer.domElement.addEventListener("mouseleave", handleMouseLeave);

        // Animation loop
        const animate = () => {
          simMaterial.uniforms.frame.value = frame++;
          simMaterial.uniforms.time.value = performance.now() / 1000;

          simMaterial.uniforms.textureA.value = rtA.texture;
          renderer.setRenderTarget(rtB);
          renderer.render(simScene, camera);

          renderMaterial.uniforms.textureA.value = rtB.texture;
          renderMaterial.uniforms.textureB.value = textTexture;
          renderer.setRenderTarget(null);
          renderer.render(scene, camera);

          const temp = rtA;
          rtA = rtB;
          rtB = temp;

          animationIdRef.current = requestAnimationFrame(animate);
        };

        animate();
      };

      // Start loading content and animation
      loadContentAndStart();

      // Cleanup function
      return () => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }

        renderer.dispose();
        rtA.dispose();
        rtB.dispose();
        textTexture.dispose();
      };
    }
  }, [imagePath, text]);

  return (
    <div
      ref={containerRef}
      className="scale-200 absolute inset-0 left-0 md:scale-100"
    />
  );
};

const Skiper12 = () => {
  return (
    <div className="relative flex h-full w-full flex-col justify-end overflow-hidden text-white">
      <LiquidSimulation imagePath="/skiperv1/skiper12/vercel_logo_liquid.avif" />

      {/* Footer */}
      <div className="pointer-events-none absolute bottom-0 w-full w-screen p-10">
        <h1 className="font-geist mb-10 max-w-xl pr-3 text-4xl font-medium leading-[0.9] tracking-tighter md:text-5xl lg:text-6xl">
          Vercel's one-day event for developers and bussiness leaders
        </h1>
        <div className="flex w-full flex-col items-start gap-5 lg:flex-row lg:justify-between">
          <div className="flex w-full items-center justify-between gap-12 uppercase lg:w-fit lg:justify-center">
            <p className="font-geist-mono w-fit text-sm">
              punjab, india <br />
              and online
            </p>
            <p className="font-geist-mono w-fit text-sm">
              sep 1, 2025 <br /> the Moosa pind
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center justify-between gap-12 uppercase lg:w-fit lg:justify-center">
            <p className="font-geist-mono w-fit text-sm">
              onilne <br /> free
            </p>
            <p className="font-geist-mono w-fit text-sm">
              in person tickets <br /> $600
            </p>
            <button className="font-geist-mono flex items-center gap-2 bg-white px-4 py-2 text-sm uppercase text-black">
              get tickets
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { LiquidSimulation, Skiper12 };

/**
 * Skiper 12 VercelLiquid — React + Framer Motion
 * Inspired by and adapted from https://vercel.com/blog/designing-and-building-the-vercel-ship-conference-platform
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.in
 * Twitter: https://x.com/Gur__vi
 */

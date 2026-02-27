"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface AsciiSimulationProps {
  modelPath?: string;
  className?: string;
  // ASCII Effect props
  asciiChars?: string;
  invert?: boolean;
  fontSize?: string;
  lineHeight?: string;
  // Model props
  modelScale?: number;
  rotationSpeed?: number;
  // Camera props
  cameraPosition?: { x: number; y: number; z: number };
  // Controls props
  enableZoom?: boolean;
  enablePan?: boolean;
  enableRotate?: boolean;
  rotateSpeed?: number;
  // Styling props
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
}

const AsciiSimulation = ({
  modelPath = "/models/car.glb",
  className = "h-[60vh] w-full",
  // ASCII Effect props
  asciiChars = " .:-+*=%@#",
  invert = true,
  fontSize = "2px",
  lineHeight = "2px",
  // Model props
  modelScale = 6,
  rotationSpeed = 0.001,
  // Camera props
  cameraPosition = { x: 0, y: 7.5, z: 25 },
  // Controls props
  enableZoom = false,
  enablePan = false,
  enableRotate = true,
  rotateSpeed = 1.0,
  // Styling props
  backgroundColor = "black",
  textColor = "white",
  fontFamily = "monospace",
}: AsciiSimulationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const effectRef = useRef<AsciiEffect | null>(null);
  const controlsRef = useRef<TrackballControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(
      70,
      containerWidth / containerHeight,
      1,
      1000,
    );
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    cameraRef.current = camera;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0, 0, 0);
    sceneRef.current = scene;

    // Lights
    const pointLight1 = new THREE.PointLight(0xffffff, 3, 0, 0);
    pointLight1.position.set(500, 500, 500);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 1, 0, 0);
    pointLight2.position.set(-500, -500, -500);
    scene.add(pointLight2);

    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf: any) => {
        scene.add(gltf.scene);
        modelRef.current = gltf.scene;

        // Adjust model position, scale, and rotation as needed
        gltf.scene.position.set(0, 0, 0);
        gltf.scene.scale.set(modelScale, modelScale, modelScale);
        gltf.scene.rotation.set(0, 0, 0);
      },
      undefined,
      (error: any) => {
        console.error("Error loading GLTF model:", error);
      },
    );

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(containerWidth, containerHeight);
    rendererRef.current = renderer;

    // ASCII Effect
    const effect = new AsciiEffect(renderer, asciiChars, { invert });
    effect.setSize(containerWidth, containerHeight);
    effect.domElement.style.color = textColor;
    effect.domElement.style.backgroundColor = backgroundColor;
    effect.domElement.style.fontFamily = fontFamily;
    effect.domElement.style.fontSize = fontSize;
    effect.domElement.style.lineHeight = lineHeight;
    effect.domElement.style.pointerEvents = "auto";
    effect.domElement.style.cursor = "grab";
    effect.domElement.style.userSelect = "none";
    effect.domElement.style.webkitUserSelect = "none";
    effectRef.current = effect;

    // Append effect to container
    container.appendChild(effect.domElement);

    // Controls
    const controls = new TrackballControls(camera, effect.domElement);
    (controls as any).enableZoom = enableZoom;
    (controls as any).enablePan = enablePan;
    (controls as any).enableRotate = enableRotate;
    (controls as any).rotateSpeed = rotateSpeed;
    (controls as any).noZoom = !enableZoom;
    (controls as any).noPan = !enablePan;
    controlsRef.current = controls;

    // Animation loop
    const animate = () => {
      const timer = Date.now() - startTimeRef.current;

      // Animate the car model
      if (modelRef.current) {
        modelRef.current.rotation.y = timer * rotationSpeed; // Rotate the car
      }

      controls.update();
      effect.render(scene, camera);

      animationRef.current = requestAnimationFrame(animate);
    };

    // Add mouse event listeners for better interaction feedback
    const handleMouseDown = () => {
      if (effect.domElement) {
        effect.domElement.style.cursor = "grabbing";
      }
    };

    const handleMouseUp = () => {
      if (effect.domElement) {
        effect.domElement.style.cursor = "grab";
      }
    };

    effect.domElement.addEventListener("mousedown", handleMouseDown);
    effect.domElement.addEventListener("mouseup", handleMouseUp);
    effect.domElement.addEventListener("mouseleave", handleMouseUp);

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!container || !cameraRef.current || !effectRef.current) return;

      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();

      effectRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);

      if (effectRef.current) {
        effectRef.current.domElement.removeEventListener(
          "mousedown",
          handleMouseDown,
        );
        effectRef.current.domElement.removeEventListener(
          "mouseup",
          handleMouseUp,
        );
        effectRef.current.domElement.removeEventListener(
          "mouseleave",
          handleMouseUp,
        );
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (controlsRef.current) {
        controlsRef.current.dispose();
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      if (container && effectRef.current) {
        container.removeChild(effectRef.current.domElement);
      }
    };
  }, [
    modelPath,
    asciiChars,
    invert,
    fontSize,
    lineHeight,
    modelScale,
    rotationSpeed,
    cameraPosition,
    enableZoom,
    enablePan,
    enableRotate,
    rotateSpeed,
    backgroundColor,
    textColor,
    fontFamily,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    />
  );
};

const Skiper14 = () => {
  return (
    <div className="relative flex h-full w-screen flex-col overflow-hidden bg-[#f5f5f0] p-2">
      {/* ASCII Simulation */}
      <AsciiSimulation modelPath="/models/car.glb" />

      <div className="mt-auto w-full translate-y-2 bg-[#f5f5f0] text-[#121212]">
        <h1 className="font-geist text-center text-[17vw] font-bold leading-[0.9] tracking-tighter">
          skiperui.com
        </h1>
        <div className="flex w-full flex-col items-start gap-5 px-4 pb-4 lg:flex-row lg:justify-between lg:px-10">
          <div className="flex w-full items-center justify-between gap-12 uppercase lg:w-fit lg:justify-center">
            <p className="font-geist-mono w-fit text-sm">
              punjab, india <br />
              and online
            </p>
            <p className="font-geist-mono w-fit text-right text-sm lg:text-left">
              sep 1, 2025 <br /> the Moosa pind
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center justify-between gap-12 uppercase lg:w-fit lg:justify-center">
            <p className="font-geist-mono w-fit text-sm">
              onilne <br /> free
            </p>
            <p className="font-geist-mono w-fit text-right text-sm lg:text-left">
              in person tickets <br /> $600
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AsciiSimulation, Skiper14 };

/**
 * Skiper 14 ASCII_Landing_Page — React + Framer Motion
 * Inspired by and adapted from https://threejs.org/examples/#webgl_effects_ascii
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

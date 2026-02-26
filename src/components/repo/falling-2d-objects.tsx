"use client";

import React, { useRef, useEffect } from "react";

export interface OsmoFalling2DObjectsProps {
  textures?: string[];
  objectCount?: number;
  objectSize?: number;
  gravity?: number;
  bounciness?: number;
  className?: string;
}

const defaultTextures = ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe", "#43e97b"];

export default function OsmoFalling2DObjects({
  textures = defaultTextures,
  objectCount = 30,
  objectSize = 40,
  gravity = 1,
  bounciness = 0.6,
  className,
}: OsmoFalling2DObjectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    let cleanup: (() => void) | undefined;

    const loadMatter = async () => {
      try {
        const Matter = await import("matter-js");
        const container = containerRef.current!;
        const canvas = canvasRef.current!;
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        canvas.width = width;
        canvas.height = height;

        const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;
        const engine = Engine.create({ gravity: { x: 0, y: gravity } });

        const render = Render.create({
          canvas, engine,
          options: { width, height, wireframes: false, background: "transparent", pixelRatio: window.devicePixelRatio || 1 },
        });

        const wallThickness = 50;
        const walls = [
          Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, { isStatic: true, render: { visible: false } }),
          Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, render: { visible: false } }),
          Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, render: { visible: false } }),
        ];
        World.add(engine.world, walls);

        const objects: any[] = [];
        for (let i = 0; i < objectCount; i++) {
          const x = Math.random() * width;
          const y = -Math.random() * height - objectSize;
          const size = objectSize * (0.5 + Math.random() * 0.8);
          const color = textures[i % textures.length];
          const isCircle = Math.random() > 0.5;
          const body = isCircle
            ? Bodies.circle(x, y, size / 2, { restitution: bounciness, friction: 0.3, render: { fillStyle: color } })
            : Bodies.rectangle(x, y, size, size, { restitution: bounciness, friction: 0.3, chamfer: { radius: size * 0.15 }, render: { fillStyle: color } });
          objects.push(body);
        }

        objects.forEach((body, i) => { setTimeout(() => { World.add(engine.world, body) }, i * 100) });

        const mouse = Mouse.create(canvas);
        const mouseConstraint = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } });
        World.add(engine.world, mouseConstraint);

        const runner = Runner.create();
        Runner.run(runner, engine);
        Render.run(render);

        cleanup = () => { Render.stop(render); Runner.stop(runner); Engine.clear(engine); render.canvas.remove(); };
      } catch {
        if (containerRef.current) {
          const fallback = document.createElement("div");
          fallback.style.cssText = "display:flex;align-items:center;justify-content:center;height:100%;opacity:0.5;font-size:1rem;";
          fallback.textContent = "Install matter-js for physics simulation";
          containerRef.current.appendChild(fallback);
        }
      }
    };

    loadMatter();
    return () => { cleanup?.() };
  }, [textures, objectCount, objectSize, gravity, bounciness]);

  return (
    <div ref={containerRef} className={className} style={{ position: "relative", width: "100%", minHeight: "500px", overflow: "hidden", borderRadius: "16px" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }} />
    </div>
  );
}

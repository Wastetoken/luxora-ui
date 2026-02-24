"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const SPRITE_CONFIG = {
  src: "https://pub-6738c828bef548d69b3f13bdd680b5b0.r2.dev/Untitled518_20260131224823.png",
  rows: 15,
  cols: 7,
};

const BG_URL = "https://pub-6738c828bef548d69b3f13bdd680b5b0.r2.dev/background1.png";

class Peep {
  image: HTMLImageElement;
  rect: number[];
  width: number;
  height: number;
  drawArgs: any[];
  x = 0;
  y = 0;
  anchorY = 0;
  scaleX = 1;
  walk: gsap.core.Timeline | null = null;

  constructor({ image, rect }: { image: HTMLImageElement; rect: number[] }) {
    this.image = image;
    this.rect = rect;
    this.width = rect[2];
    this.height = rect[3];
    this.drawArgs = [this.image, rect[0], rect[1], rect[2], rect[3], 0, 0, this.width, this.height] as const;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.scaleX, 1);
    ctx.drawImage(this.image, this.rect[0], this.rect[1], this.rect[2], this.rect[3], 0, 0, this.width, this.height);
    ctx.restore();
  }
}

const randomRange = (min: number, max: number) => min + Math.random() * (max - min);
const randomIndex = (arr: any[]) => (randomRange(0, arr.length) | 0);
const removeFromArray = (arr: any[], i: number) => arr.splice(i, 1)[0];
const removeItemFromArray = (arr: any[], item: any) => removeFromArray(arr, arr.indexOf(item));
const removeRandomFromArray = (arr: any[]) => removeFromArray(arr, randomIndex(arr));
const getRandomFromArray = (arr: any[]) => arr[randomIndex(arr) | 0];

export const CrowdSprites = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stage = { width: 0, height: 0 };
    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    const img = new Image();
    img.src = SPRITE_CONFIG.src;

    const resetPeep = (peep: Peep) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 100 - 250 * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + offsetY;
      let startX: number, endX: number;
      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }
      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;
      return { startX, startY, endX };
    };

    const normalWalk = (peep: Peep, props: { startX: number; startY: number; endX: number }) => {
      const { startY, endX } = props;
      const xDuration = 10;
      const yDuration = 0.25;
      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.5, 1.5));
      tl.to(peep, { duration: xDuration, x: endX, ease: "none" }, 0);
      tl.to(peep, { duration: yDuration, repeat: xDuration / yDuration, yoyo: true, y: startY - 10 }, 0);
      return tl;
    };

    const addPeepToCrowd = (): Peep => {
      const peep = removeRandomFromArray(availablePeeps) as Peep;
      const props = resetPeep(peep);
      const walk = normalWalk(peep, props).eventCallback("onComplete", () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });
      peep.walk = walk;
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);
      return peep;
    };

    const removePeepFromCrowd = (peep: Peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const createPeeps = () => {
      const { rows, cols } = SPRITE_CONFIG;
      const { naturalWidth: w, naturalHeight: h } = img;
      const total = rows * cols;
      const rw = w / rows;
      const rh = h / cols;
      for (let i = 0; i < total; i++) {
        allPeeps.push(new Peep({
          image: img,
          rect: [(i % rows) * rw, ((i / rows) | 0) * rh, rw, rh],
        }));
      }
    };

    const resize = () => {
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = stage.width * devicePixelRatio;
      canvas.height = stage.height * devicePixelRatio;
      crowd.forEach((p) => p.walk?.kill());
      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);
      while (availablePeeps.length) {
        addPeepToCrowd().walk?.progress(Math.random());
      }
    };

    const render = () => {
      canvas.width = canvas.width; // clear
      ctx.save();
      ctx.scale(devicePixelRatio, devicePixelRatio);
      crowd.forEach((p) => p.render(ctx));
      ctx.restore();
    };

    img.onload = () => {
      createPeeps();
      resize();
      gsap.ticker.add(render);
      window.addEventListener("resize", resize);
    };

    return () => {
      gsap.ticker.remove(render);
      window.removeEventListener("resize", resize);
      crowd.forEach((p) => p.walk?.kill());
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url('${BG_URL}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 1,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
        }}
      />
    </div>
  );
};

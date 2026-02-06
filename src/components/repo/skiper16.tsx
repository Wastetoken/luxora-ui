"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import ReactLenis from "lenis/react";
import React, { useRef } from "react";

const projects = [
  {
    title: "Project 1",
    src: "https://images.unsplash.com/photo-1721332163253-12d997232230?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Project 2",
    src: "https://images.unsplash.com/photo-1721332163634-b33379204051?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Project 3",
    src: "https://images.unsplash.com/photo-1721332164025-4724660d5716?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Project 4",
    src: "https://images.unsplash.com/photo-1721332164025-4724660d5716?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Project 5",
    src: "https://images.unsplash.com/photo-1721332164025-4724660d5716?w=800&auto=format&fit=crop&q=60",
  },
];

const StickyCard_001: React.FC<{
  i: number;
  title: string;
  src: string;
  progress: any;
  range: [number, number];
  targetScale: number;
}> = ({
  i,
  title,
  src,
  progress,
  range,
  targetScale,
}) => {
  const container = useRef<HTMLDivElement>(null);

  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="sticky top-0 flex items-center justify-center"
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 20 + 250}px)`,
        }}
        className="rounded-xl relative -top-1/4 flex h-[300px] w-[500px] origin-top flex-col overflow-hidden border border-white/20"
      >
        <img src={src} alt={title} className="h-full w-full object-cover" />
      </motion.div>
    </div>
  );
};

const Skiper16 = () => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <ReactLenis root>
      <main
        ref={container}
        className="relative flex w-full flex-col items-center justify-center pb-[100vh] pt-[50vh]"
      >
        <div className="absolute left-1/2 top-[10%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
          <span className="after:from-background after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-[''] text-white">
            scroll down to see card stack
          </span>
        </div>
        {projects.map((project, i) => {
          const targetScale = Math.max(
            0.5,
            1 - (projects.length - i - 1) * 0.1,
          );
          return (
            <StickyCard_001
              key={`p_${i}`}
              i={i}
              {...project}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </main>
    </ReactLenis>
  );
};

export { Skiper16, StickyCard_001 };
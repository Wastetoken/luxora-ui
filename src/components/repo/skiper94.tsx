"use client";

import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";
import React from "react";

const Skiper94 = () => {
  const { scrollYProgress } = useScroll();

  const value = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clipPath = useMotionTemplate`inset(0 0 ${value}% 0)`;

  const progressValue = useTransform(scrollYProgress, [0, 1], [1, 100]);

  const y = useTransform(scrollYProgress, [0, 1], [0, 240]);

  return (
    <div className="relative flex h-full w-full">
      {/* the Scroll Indicator */}
      <div className="z-4 bg-foreground/10 sticky left-0 top-1/2 flex h-60 w-1.5 -translate-y-1/2 translate-x-20 flex-col items-center justify-center gap-2 rounded-2xl">
        <motion.div
          className="h-full w-full rounded-2xl bg-orange-500"
          style={{ clipPath }}
        ></motion.div>
        <motion.div
          style={{ y }}
          className="absolute top-0 flex h-px w-4 items-center justify-center bg-orange-500 text-sm font-medium tracking-tight text-orange-500"
        >
          <motion.span className="absolute left-6 tabular-nums">
            {useTransform(progressValue, (v) => Math.round(v))}
          </motion.span>
        </motion.div>
      </div>

      <Content />
    </div>
  );
};

export { Skiper94 };

/**
 * ==============   Utils   ================
 */

function Content() {
  return (
    <article className="mx-auto max-w-xl space-y-[10vh] py-[50vh]">
      <div className="-mt-36 mb-36 grid content-start justify-items-center gap-6 text-center">
        <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          Scroll down to see the effect
        </span>
      </div>
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="text-justify">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi alias
          similique eveniet corrupti cupiditate, saepe magni, distinctio at
          dolor dignissimos consequatur rerum quasi expedita soluta amet, fugiat
          quaerat commodi accusamus enim necessitatibus facere cumque dolores
          quisquam? Vero harum repellendus labore.
        </div>
      ))}
    </article>
  );
}

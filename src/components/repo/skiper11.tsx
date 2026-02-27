"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const Skiper11 = () => {
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative flex h-full w-full items-center justify-center bg-white">
      <AnimatePresence>{showPreloader && <Preloader_005 />}</AnimatePresence>
      <Main />
    </main>
  );
};

const Main = () => {
  return (
    <section className="flex h-full w-full items-center justify-center bg-white text-orange-500">
      Your crazy Landing page
    </section>
  );
};

const Preloader_005 = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  // Fisher-Yates shuffle algorithm
  const shuffle = (a: number[]) => {
    const shuffled = [...a];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Generate centered pixel blocks for main transition
  const getCenteredBlocks = () => {
    if (!isClient) return [];

    const { width: innerWidth, height: innerHeight } = dimensions;
    const blockSize = innerWidth * 0.05;
    const nbOfBlocks = Math.ceil(innerHeight / blockSize);
    const shuffledIndexes = shuffle([...Array(nbOfBlocks)].map((_, i) => i));

    return shuffledIndexes.map((randomIndex, index) => (
      <motion.div
        key={index}
        className="h-[5vw] w-full border-[0.2px] border-white bg-[#f5f5f5]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0, delay: 0.03 * randomIndex }}
        custom={randomIndex}
      />
    ));
  };

  return (
    <motion.div className="fixed inset-0 z-50 bg-white">
      {/* Menu Text */}
      <motion.div
        className="fixed left-1/2 z-40 flex min-h-screen w-screen -translate-x-1/2 flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
      >
        <div className="fixed z-0 size-[400px] bg-neutral-100 blur-2xl" />
        <div className="relative z-10 font-sans text-2xl tracking-tight text-black/80">
          <h1 className="text-center">AI that Convert </h1>
          <h1 className="relative z-10">Linkedin to Professional</h1>
          <Stroke className="absolute right-0 top-[3.3rem] stroke-[#FFAD42]/60" />
        </div>
        <h1 className="relative z-10 font-sans text-2xl tracking-tight text-black/80">
          Website in minutes
        </h1>
        <div className="mt-32 block md:hidden" />
      </motion.div>

      {/* Main Pixel Transition */}
      <div className="pointer-events-none fixed inset-0 z-[2] flex">
        {[...Array(20)].map((_, index) => (
          <div key={index} className="flex w-[5vw] flex-col">
            {getCenteredBlocks()}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const Stroke = (props: any) => {
  return (
    <svg
      {...props}
      width="128"
      height="21"
      viewBox="0 0 128 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_3_592)">
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          d="M2.12988 2.1001L58.1362 2.1001L127.805 8.4001L31.6326 10.5001L90.1184 18.9001L65.0899 18.9001"
          stroke="#F5F5F5"
          {...props}
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3_592">
          <rect width="128" height="21" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export { Skiper11 };

/**
 * Skiper 10 Preloader_005 — React + Framer Motion
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

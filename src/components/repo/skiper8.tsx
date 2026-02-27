"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useSyncExternalStore, useState } from "react";

let cachedDimensions = { width: 0, height: 0 };
const subscribeToDimensions = (callback: () => void) => {
  const onResize = () => {
    cachedDimensions = { width: window.innerWidth, height: window.innerHeight };
    callback();
  };
  // Initialize on subscribe
  cachedDimensions = { width: window.innerWidth, height: window.innerHeight };
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
};
const getDimensions = () => cachedDimensions;
const getServerDimensions = () => ({ width: 0, height: 0 });

const Skiper8 = () => {
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowPreloader(false);
    }, 2000);
  }, []);

  return (
    <main className="h-full w-full">
      <AnimatePresence mode="wait">
        {showPreloader && <Preloader_002 />}
      </AnimatePresence>
      <Main />
    </main>
  );
};

const Main = () => {
  return (
    <section className="flex h-full w-full items-center justify-center">
      Your crazy Landing page
    </section>
  );
};

export { Skiper8 };

const words = [
  "Hello",
  "bonjour",
  "Ciao",
  "Olà",
  "やあ",
  "Hallå",
  "Guten tag",
  "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ",
];

const Preloader_002 = () => {
  const [index, setIndex] = useState(0);
  const dimension = useSyncExternalStore(
    subscribeToDimensions,
    getDimensions,
    getServerDimensions,
  );

  useEffect(() => {
    if (index === words.length - 1) return;
    setTimeout(
      () => {
        setIndex(index + 1);
      },
      index === 0 ? 1000 : 150,
    );
  }, [index]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height}  L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height}  L0 0`;

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const },
    },
    exit: {
      d: targetPath,
      transition: {
        duration: 0.7,
        ease: [0.76, 0, 0.24, 1] as const,
        delay: 0.3,
      },
    },
  };

  return (
    <motion.div
      variants={{
        initial: {
          top: 0,
        },
        exit: {
          top: "-100vh",
          transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
        },
      }}
      initial="initial"
      exit="exit"
      className="fixed inset-0 z-[99] flex h-full w-full items-center justify-center bg-white"
    >
      {dimension.width > 0 && (
        <>
          <motion.p
            variants={{
              initial: {
                opacity: 0,
              },
              enter: {
                opacity: 0.75,
                transition: { duration: 1, delay: 0.2 },
              },
            }}
            className="absolute z-10 flex items-center gap-6 text-5xl font-semibold tracking-tighter text-black md:text-6xl"
            initial="initial"
            animate="enter"
          >
            {words[index]}
          </motion.p>
          <svg className="absolute top-0 h-[calc(100%+300px)] w-full">
            <motion.path
              variants={curve}
              initial="initial"
              exit="exit"
              className="fill-white shadow-[0_0_10px_#fff]"
            ></motion.path>
          </svg>
        </>
      )}
    </motion.div>
  );
};

/**
 * Skiper 8 Preloader_002 — React + Framer Motion
 * Inspired by and adapted from https://dennissnellenberg.com/
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

"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

import { useIsMobile } from "@/hooks/use-mobile";

const Skiper7 = () => {
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="h-full w-screen bg-black">
      <AnimatePresence mode="popLayout">
        {showPreloader ? (
          <motion.div
            key="preloader"
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 1, ease: [0.785, 0.135, 0.15, 0.86] }}
          >
            <Preloader_001 />
          </motion.div>
        ) : (
          <motion.div className="size-full" key="main">
            <Main />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export { Skiper7 };

const Main = () => {
  const list = [
    {
      name: "Sydney",
      value: 21.1,
      date: "2025-01-01",
    },
    {
      name: "Melbourne",
      value: 15.2,
      date: "2025-01-02",
    },
    {
      name: "Brisbane",
      value: 10.3,
      date: "2025-01-03",
    },
    {
      name: "Mumbai",
      value: 8.4,
      date: "2025-01-04",
    },
    {
      name: "Los Angeles",
      value: 6.5,
      date: "2025-01-05",
    },
    {
      name: "Mexico City",
      value: 4.6,
      date: "2025-01-06",
    },
    {
      name: "London",
      value: 2.7,
      date: "2025-01-07",
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const isMobile = useIsMobile();

  return (
    <div className="relative flex h-full w-screen flex-col items-center justify-center overflow-hidden font-sans text-[#F11313]">
      <motion.ul
        layout
        className="mt-25 z-10 flex w-full flex-col items-center justify-center gap-1"
      >
        {list.map((item, index) => (
          <motion.li
            initial={{ y: 350, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              height:
                hoveredIndex === index
                  ? !isMobile
                    ? 120
                    : 60
                  : !isMobile
                    ? 83
                    : 40,
            }}
            transition={{
              duration: 0.7,
              ease: [0.215, 0.61, 0.355, 1],
              delay: index * 0.035 + 0.5,

              height: {
                duration: 0.15,
                ease: "easeOut",
              },
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative my-2 flex w-fit cursor-pointer flex-col items-center lg:px-20"
            key={index}
          >
            <div className="relative flex items-start gap-5">
              <span className="text-[7vw] font-extrabold uppercase leading-[0.8] tracking-[-0.03em]">
                {item.name}
              </span>
              <span className="absolute -right-2 top-1 w-fit translate-x-full text-[2vw] font-bold leading-[0.9] tracking-tighter">
                {item.value}k
              </span>
            </div>

            <AnimatePresence mode="popLayout">
              {hoveredIndex === index && (
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="whitespace-nowrap text-[2vw] font-bold uppercase leading-[0.9] tracking-[-0.06em]"
                >
                  {item.date}
                </motion.h2>
              )}
            </AnimatePresence>
          </motion.li>
        ))}
        <motion.li
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.6 }}
          className="font-inter mt-10 font-black uppercase leading-[0.8] tracking-[-0.03em] text-white lg:text-3xl"
        >
          find your race
        </motion.li>
      </motion.ul>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
        className="absolute bottom-0 z-0 h-[50vh]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/skiperv1/skiper7/bg.png"
          alt=""
          className="size-full object-cover"
        />
      </motion.div>
    </div>
  );
};

const Preloader_001 = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center text-[#F11313]">
      <div className="z-50 flex max-w-4xl flex-col items-center justify-center gap-10">
        <h1 className="text-center text-[9vw] font-extrabold uppercase leading-[0.8] tracking-[-0.03em]">
          after dark <br /> tour©2025
        </h1>
        <div className="h-25 flex w-full items-center justify-between">
          <div>
            <NikeLogo className="w-18 h-10" />
          </div>
          <h3 className="text-2xl font-extrabold uppercase leading-[0.9] tracking-[-0.06em]">
            Powered by <br /> nike women
          </h3>
        </div>
        <h1 className="text-center text-[9vw] font-extrabold uppercase leading-[0.8] tracking-[-0.06em]">
          race the
          <br /> Night away.
        </h1>
      </div>
      <div className="absolute inset-0 z-20">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          playsInline
        >
          <source src="/skiperv1/skiper7/nike.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

const NikeLogo = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="42"
      height="22"
      viewBox="0 0 42 22"
      fill="none"
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.9389 3.68059C13.6545 4.46711 12.9677 5.06994 11.9965 5.06994L12.9918 2.45373C13.9389 2.45373 14.2016 2.98593 13.9389 3.68059ZM16.879 3.65705C17.708 1.52828 16.5223 0 14.0112 0H10.9772L6.75989 10.9287H9.79391L11.4302 6.66887L12.0857 10.9287H15.0282L14.2257 6.391C15.2667 5.99773 16.4042 4.81561 16.879 3.65705ZM23.6556 7.33999L26.4993 0H23.4652L20.6938 7.1775C20.4094 7.91927 20.0528 8.28898 19.4841 8.28898C18.7731 8.28898 18.9635 7.6414 19.1515 7.1775L21.9277 0H18.8936L16.2861 6.69241C15.0764 9.79607 16.3343 11.1383 18.537 11.1383C21.1203 11.1383 22.6603 9.90911 23.6556 7.33999ZM31.3287 10.0928L35.2446 0H32.4492L30.1983 5.83526V0H27.3548L23.1374 10.9311H25.9571L28.1379 5.21123V10.9193L11.623 15.1745C9.08782 15.8362 7.03461 15.742 5.87546 14.9154C2.87998 12.7678 5.17417 8.49621 5.97185 7.1987C4.5211 8.77879 3.04867 10.3377 1.91362 12.059C0.151994 14.7271 -0.621577 17.6753 0.585773 19.5639C2.75949 22.9619 7.95036 21.3818 11.2591 20.0113L42.002 7.33999L31.3287 10.0928Z"
        fill="currentColor"
      />
    </svg>
  );
};

/**
 * Skiper 7 Preloader_001 — React + Framer Motion
 * Inspired by and adapted from https://afterdarktour.nike.com/en/home
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * Illustrations by https://afterdarktour.nike.com/en/home
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 * - Cannot use original Nike illustrations or videos for commercial purposes.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.in
 * Twitter: https://x.com/Gur__vi
 */

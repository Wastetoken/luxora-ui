"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

const Skiper52 = () => {
  const images = [
    { src: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/AlmostCentralPurple.png", alt: "Central purple glass", code: "# 01" },
    { src: "https://pub-6096620d8a154ad4a488c1600d79206a.r2.dev/48-cool-tone-spatial-gradient.jpg", alt: "Cool tone spatial gradient", code: "# 02" },
    { src: "https://pub-391b349e64bf41c79cbb737e77691d35.r2.dev/Dusk-Amber-Gradient.png", alt: "Dusk amber gradient", code: "# 03" },
    { src: "https://pub-6096620d8a154ad4a488c1600d79206a.r2.dev/18-fractal-glass-hero-bg.jpg", alt: "Fractal glass hero", code: "# 04" },
    { src: "https://pub-6096620d8a154ad4a488c1600d79206a.r2.dev/13-green-fractal-light-background.jpg", alt: "Green fractal light", code: "# 05" },
    { src: "https://pub-391b349e64bf41c79cbb737e77691d35.r2.dev/Blue-Energy-Beam.jpg", alt: "Blue energy beam", code: "# 06" },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#f5f4f3] min-h-[500px]">
      <HoverExpand_001 className="" images={images} />{" "}
    </div>
  );
};

export { Skiper52 };

const HoverExpand_001 = ({
  images,
  className,
}: {
  images: { src: string; alt: string; code: string }[];
  className?: string;
}) => {
  const [activeImage, setActiveImage] = useState<number | null>(1);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn("relative w-full max-w-6xl px-5", className)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="flex w-full items-center justify-center gap-1">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="relative cursor-pointer overflow-hidden rounded-3xl"
              initial={{ width: "2.5rem", height: "20rem" }}
              animate={{
                width: activeImage === index ? "24rem" : "5rem",
                height: activeImage === index ? "24rem" : "24rem",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setActiveImage(index)}
              onHoverStart={() => setActiveImage(index)}
            >
              <AnimatePresence>
                {activeImage === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute h-full w-full bg-gradient-to-t from-black/40 to-transparent"
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {activeImage === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute flex h-full w-full flex-col items-end justify-end p-4"
                  >
                    <p className="text-left text-xs text-white/50">
                      {image.code}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <img
                src={image.src}
                className="size-full object-cover"
                alt={image.alt}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export { HoverExpand_001 };
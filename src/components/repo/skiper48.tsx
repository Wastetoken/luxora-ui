"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { Autoplay, EffectCards, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { cn } from "@/lib/utils";

const Skiper48 = () => {
  const images = [
    { src: "https://pub-6096620d8a154ad4a488c1600d79206a.r2.dev/13-green-fractal-light-background.jpg", alt: "Green fractal light" },
    { src: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueAndBlack.png", alt: "Blue and black glass" },
    { src: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/AlmostCentralPurple.png", alt: "Central purple glass" },
    { src: "https://pub-6096620d8a154ad4a488c1600d79206a.r2.dev/47-fractal-phantom-gradient-stripes.jpg", alt: "Phantom gradient stripes" },
    { src: "https://pub-6096620d8a154ad4a488c1600d79206a.r2.dev/48-cool-tone-spatial-gradient.jpg", alt: "Cool tone spatial gradient" },
    { src: "https://pub-391b349e64bf41c79cbb737e77691d35.r2.dev/Blue-Energy-Beam.jpg", alt: "Blue energy beam" },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#f5f4f3] min-h-[500px]">
      <Carousel_002 className="" images={images} loop />
    </div>
  );
};

export { Skiper48 };

const Carousel_002 = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 40,
}: {
  images: { src: string; alt: string }[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
}) => {
  const css = `
  .Carousal_002 {
    padding-bottom: 50px !important;
  }
  `;
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn("relative w-full max-w-3xl", className)}
    >
      <style>{css}</style>

      <Swiper
        spaceBetween={spaceBetween}
        autoplay={
          autoplay
            ? {
                delay: 1000,
                disableOnInteraction: false,
              }
            : false
        }
        effect="cards"
        grabCursor={true}
        loop={loop}
        pagination={
          showPagination
            ? {
                clickable: true,
              }
            : false
        }
        navigation={
          showNavigation
            ? {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }
            : false
        }
        className="Carousal_002 h-[380px] w-[260px]"
        modules={[EffectCards, Autoplay, Pagination, Navigation]}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="rounded-3xl border border-gray-200 bg-white shadow-xl">
            <img
              className="h-full w-full object-cover"
              src={image.src}
              alt={image.alt}
            />
          </SwiperSlide>
        ))}
        {showNavigation && (
          <div>
            <div className="swiper-button-next after:hidden">
              <ChevronRightIcon className="h-6 w-6 text-black" />
            </div>
            <div className="swiper-button-prev after:hidden">
              <ChevronLeftIcon className="h-6 w-6 text-black" />
            </div>
          </div>
        )}
      </Swiper>
    </motion.div>
  );
};

export { Carousel_002 };
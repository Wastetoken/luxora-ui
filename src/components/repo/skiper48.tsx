"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { Autoplay, EffectCards, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { cn } from "@/lib/utils";

const Skiper48 = () => {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1721332163253-12d997232230?w=500&auto=format&fit=crop&q=60",
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: "https://images.unsplash.com/photo-1721332163634-b33379204051?w=500&auto=format&fit=crop&q=60",
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: "https://images.unsplash.com/photo-1721332164025-4724660d5716?w=500&auto=format&fit=crop&q=60",
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: "https://images.unsplash.com/photo-1721332163253-12d997232230?w=500&auto=format&fit=crop&q=60",
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: "https://images.unsplash.com/photo-1721332163634-b33379204051?w=500&auto=format&fit=crop&q=60",
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: "https://images.unsplash.com/photo-1721332164025-4724660d5716?w=500&auto=format&fit=crop&q=60",
      alt: "Illustrations by my fav AarzooAly",
    },
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
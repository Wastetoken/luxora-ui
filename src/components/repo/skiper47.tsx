"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { cn } from "@/lib/utils";

const Skiper47 = () => {
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
      <Carousel_001 className="" images={images} showPagination loop />
    </div>
  );
};

export { Skiper47 };

const Carousel_001 = ({
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
  .Carousal_001 {
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
      className={cn("w-3xl relative w-full max-w-4xl", className)}
    >
      <style>{css}</style>

      <Swiper
        spaceBetween={spaceBetween}
        autoplay={
          autoplay
            ? {
                delay: 1500,
                disableOnInteraction: false,
              }
            : false
        }
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        loop={loop}
        slidesPerView={2.43}
        coverflowEffect={{
          rotate: 0,
          slideShadows: false,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
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
        className="Carousal_001"
        modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="!h-[320px] w-full border border-gray-200 bg-white shadow-lg rounded-xl overflow-hidden">
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

export { Carousel_001 };
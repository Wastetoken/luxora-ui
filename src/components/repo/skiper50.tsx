"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { Autoplay, EffectCreative, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { cn } from "@/lib/utils";

const Skiper50 = () => {
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
      <Carousel_004 className="" images={images} showPagination loop />
    </div>
  );
};

export { Skiper50 };

const Carousel_004 = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 0,
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
  .Carousal_004 {
    width: 100%;
    height: 440px;
    padding-bottom: 50px !important;
  }
  
  .Carousal_004 .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 300px;
    border-radius: 25px;
  }
  
  .swiper-pagination-bullet {
    background-color: #000 !important;
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
      className={cn("relative w-full max-w-4xl px-5", className)}
    >
      <style>{css}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Swiper
          spaceBetween={spaceBetween}
          autoplay={
            autoplay
              ? {
                  delay: 1500,
                  disableOnInteraction: true,
                }
              : false
          }
          effect="creative"
          grabCursor={true}
          slidesPerView="auto"
          centeredSlides={true}
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
          className="Carousal_004"
          creativeEffect={{
            prev: {
              shadow: true,
              origin: "left center",
              translate: ["-5%", 0, -200],
              rotate: [0, 100, 0],
            },
            next: {
              origin: "right center",
              translate: ["5%", 0, -200],
              rotate: [0, -100, 0],
            },
          }}
          modules={[EffectCreative, Pagination, Autoplay]}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="">
              <img
                className="h-full w-full scale-105 rounded-3xl object-cover"
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
    </motion.div>
  );
};

export { Carousel_004 };
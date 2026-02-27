"use client"

import React, { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export interface ParallaxGalleryImage {
  src: string
  alt: string
}

export interface OsmoParallaxImageGalleryProps {
  images?: ParallaxGalleryImage[]
  speed?: number
  gap?: number
  className?: string
}

const defaultImages: ParallaxGalleryImage[] = [
  { src: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/AlmostCentralPurple.png", alt: "Gallery 1" },
  { src: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueAndBlack.png", alt: "Gallery 2" },
  { src: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueAndRed.png", alt: "Gallery 3" },
  { src: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueHalfDome.png", alt: "Gallery 4" },
  { src: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueLiquidFlow.png", alt: "Gallery 5" },
  { src: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueWhiteAndOrangeLiqiudFlow.png", alt: "Gallery 6" },
]

export default function OsmoParallaxImageGallery({
  images = defaultImages,
  speed = 0.5,
  gap = 24,
  className,
}: OsmoParallaxImageGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const items = containerRef.current!.querySelectorAll<HTMLElement>(".parallax-gallery-item")

      items.forEach((item, i) => {
        const direction = i % 2 === 0 ? 1 : -1
        const parallaxAmount = 80 * speed * direction

        gsap.fromTo(
          item,
          { y: parallaxAmount },
          {
            y: -parallaxAmount,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        )

        // Reveal animation
        gsap.from(item, {
          opacity: 0,
          scale: 0.9,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [images, speed])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        columns: "2",
        columnGap: `${gap}px`,
        padding: "2rem 0",
      }}
    >
      {images.map((image, i) => (
        <div
          key={i}
          className="parallax-gallery-item"
          style={{
            marginBottom: `${gap}px`,
            breakInside: "avoid",
            borderRadius: "16px",
            overflow: "hidden",
            willChange: "transform",
          }}
        >
          <img
            src={image.src}
            alt={image.alt}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              transition: "transform 0.5s ease",
            }}
          />
        </div>
      ))}
    </div>
  )
}

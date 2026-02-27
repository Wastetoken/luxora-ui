"use client"

import React, { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"

export interface CarouselImage {
  src: string
  alt: string
}

export interface Osmo3DImageCarouselProps {
  images?: CarouselImage[]
  autoplay?: boolean
  perspective?: number
  className?: string
}

const defaultImages: CarouselImage[] = [
  { src: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/AlmostCentralPurple.png", alt: "Slide 1" },
  { src: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueAndBlack.png", alt: "Slide 2" },
  { src: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueAndRed.png", alt: "Slide 3" },
  { src: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueHalfDome.png", alt: "Slide 4" },
  { src: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueLiquidFlow.png", alt: "Slide 5" },
  { src: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueWithWhiteHighlight.png", alt: "Slide 6" },
]

export default function Osmo3DImageCarousel({
  images = defaultImages,
  autoplay = true,
  perspective = 1000,
  className,
}: Osmo3DImageCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const rotationRef = useRef(0)

  const count = images.length
  const angleStep = 360 / count
  const radius = 350

  useEffect(() => {
    if (!autoplay) return

    const ctx = gsap.context(() => {
      gsap.to(carouselRef.current, {
        rotationY: 360,
        duration: count * 4,
        ease: "none",
        repeat: -1,
      })
    })

    return () => ctx.revert()
  }, [autoplay, count])

  const handlePrev = () => {
    rotationRef.current += angleStep
    gsap.to(carouselRef.current, {
      rotationY: rotationRef.current,
      duration: 0.6,
      ease: "power2.out",
    })
  }

  const handleNext = () => {
    rotationRef.current -= angleStep
    gsap.to(carouselRef.current, {
      rotationY: rotationRef.current,
      duration: 0.6,
      ease: "power2.out",
    })
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 2rem",
        minHeight: "500px",
      }}
    >
      <div
        style={{
          perspective: `${perspective}px`,
          width: "300px",
          height: "250px",
          position: "relative",
        }}
      >
        <div
          ref={carouselRef}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
            transition: autoplay ? "none" : "transform 0.6s ease",
          }}
        >
          {images.map((image, i) => {
            const angle = angleStep * i
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: "280px",
                  height: "200px",
                  left: "50%",
                  top: "50%",
                  marginLeft: "-140px",
                  marginTop: "-100px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  backfaceVisibility: "hidden",
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {!autoplay && (
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <button
            onClick={handlePrev}
            style={{
              padding: "0.5rem 1.5rem",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            style={{
              padding: "0.5rem 1.5rem",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

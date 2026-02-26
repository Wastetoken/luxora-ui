"use client"

import React, { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export interface StickyFeature {
  title: string
  description: string
  image: string
}

export interface OsmoStickyFeaturesProps {
  features?: StickyFeature[]
  className?: string
}

const defaultFeatures: StickyFeature[] = [
  { title: "Lightning Fast", description: "Built with performance in mind. Every millisecond counts for your users.", image: "https://picsum.photos/seed/feat1/600/400" },
  { title: "Beautifully Designed", description: "Pixel-perfect interfaces that your users will love to interact with.", image: "https://picsum.photos/seed/feat2/600/400" },
  { title: "Fully Responsive", description: "Looks great on every screen size, from mobile to ultra-wide displays.", image: "https://picsum.photos/seed/feat3/600/400" },
  { title: "Secure by Default", description: "Enterprise-grade security built into every layer of the stack.", image: "https://picsum.photos/seed/feat4/600/400" },
]

export default function OsmoStickyFeatures({
  features = defaultFeatures,
  className,
}: OsmoStickyFeaturesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const items = containerRef.current!.querySelectorAll<HTMLElement>(".sticky-feature-item")

      items.forEach((item) => {
        const image = item.querySelector(".sticky-feature-image")
        const text = item.querySelector(".sticky-feature-text")

        gsap.from(image, {
          scale: 0.85,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        })

        gsap.from(text, {
          x: -30,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [features])

  return (
    <div ref={containerRef} className={className}>
      {features.map((feature, i) => (
        <div
          key={i}
          className="sticky-feature-item"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
            minHeight: "100vh",
            padding: "4rem 2rem",
          }}
        >
          <div
            className="sticky-feature-text"
            style={{
              position: "sticky",
              top: "40vh",
              alignSelf: "start",
            }}
          >
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                opacity: 0.4,
                display: "block",
                marginBottom: "1rem",
              }}
            >
              Feature {String(i + 1).padStart(2, "0")}
            </span>
            <h3
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
                fontWeight: 800,
                marginBottom: "1rem",
                letterSpacing: "-0.02em",
              }}
            >
              {feature.title}
            </h3>
            <p style={{ fontSize: "1.1rem", opacity: 0.7, lineHeight: 1.7, maxWidth: "450px" }}>
              {feature.description}
            </p>
          </div>
          <div
            className="sticky-feature-image"
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
            }}
          >
            <img
              src={feature.image}
              alt={feature.title}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

"use client"

import React, { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export interface OsmoMaskedTextRevealProps {
  text?: string
  image?: string
  speed?: number
  className?: string
}

export default function OsmoMaskedTextReveal({
  text = "REVEAL",
  image = "https://picsum.photos/seed/masked/1200/600",
  speed = 1,
  className,
}: OsmoMaskedTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const mask = containerRef.current!.querySelector(".mask-overlay")
      const textEl = containerRef.current!.querySelector(".masked-text")
      const section = containerRef.current!.querySelector(".masked-section")

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "bottom center",
          scrub: 1 / speed,
        },
      })

      tl.fromTo(
        textEl,
        { scale: 3, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "power2.out" }
      )

      tl.to(
        mask,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1,
          ease: "power2.inOut",
        },
        0
      )
    }, containerRef)

    return () => ctx.revert()
  }, [text, image, speed])

  return (
    <div ref={containerRef} className={className} style={{ position: "relative" }}>
      {/* Pre-scroll spacer */}
      <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "1.25rem", fontWeight: 500, opacity: 0.3, color: "#fff", textAlign: "center" }}>
          ↓ Scroll to reveal ↓
        </p>
      </div>

      {/* Main reveal section */}
      <div
        className="masked-section"
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
        }}
      >
        <div
          className="mask-overlay"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            clipPath: "inset(50% 50% 50% 50%)",
            zIndex: 1,
          }}
        />
        <div
          className="masked-text"
          style={{
            position: "relative",
            zIndex: 2,
            fontSize: "clamp(4rem, 15vw, 12rem)",
            fontWeight: 900,
            color: "#fff",
            mixBlendMode: "difference",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            willChange: "transform",
          }}
        >
          {text}
        </div>
      </div>

      {/* Post-scroll spacer */}
      <div style={{ height: "40vh" }} />
    </div>
  )
}

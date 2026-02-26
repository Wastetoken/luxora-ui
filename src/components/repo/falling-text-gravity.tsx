"use client"

import React, { useRef, useEffect } from "react"
import { gsap } from "gsap"

export interface OsmoFallingTextGravityProps {
  text?: string
  gravity?: number
  bounciness?: number
  className?: string
}

export default function OsmoFallingTextGravity({
  text = "GRAVITY",
  gravity = 1,
  bounciness = 0.4,
  className,
}: OsmoFallingTextGravityProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    const chars = container.querySelectorAll<HTMLElement>(".gravity-char")
    const containerHeight = container.offsetHeight

    const ctx = gsap.context(() => {
      chars.forEach((char, i) => {
        const charHeight = char.offsetHeight
        const maxY = containerHeight - charHeight - 20
        const delay = i * 0.08 + Math.random() * 0.1
        const tl = gsap.timeline({ delay })

        tl.fromTo(char, { y: -100, opacity: 0 }, { y: maxY, opacity: 1, duration: 0.8 / gravity, ease: "power2.in" })

        let bounceHeight = maxY * bounciness
        let bounceDur = 0.4 / gravity
        for (let b = 0; b < 4; b++) {
          tl.to(char, { y: maxY - bounceHeight, duration: bounceDur, ease: "power2.out" })
          tl.to(char, { y: maxY, duration: bounceDur, ease: "power2.in" })
          bounceHeight *= bounciness
          bounceDur *= 0.7
        }

        tl.to(char, { rotation: (Math.random() - 0.5) * 20, duration: 0.3, ease: "power2.out" }, 0.8 / gravity + delay)
      })
    }, container)

    return () => ctx.revert()
  }, [text, gravity, bounciness])

  return (
    <div ref={containerRef} className={className} style={{ position: "relative", height: "400px", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "2rem", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: "0.1em" }}>
        {text.split("").map((char, i) => (
          <span key={i} className="gravity-char" style={{ display: "inline-block", fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 900, willChange: "transform", opacity: 0 }}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    </div>
  )
}

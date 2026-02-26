"use client"

import React, { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"

export interface OsmoRotatingTextProps {
  words?: string[]
  speed?: number
  direction?: "up" | "down"
  className?: string
}

export default function OsmoRotatingText({
  words = ["Creative", "Beautiful", "Powerful", "Elegant"],
  speed = 2,
  direction = "up",
  className,
}: OsmoRotatingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const wordRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wordRef.current) return

    const ctx = gsap.context(() => {
      const yFrom = direction === "up" ? 60 : -60
      const yTo = direction === "up" ? -60 : 60

      const animate = () => {
        const el = wordRef.current
        if (!el) return

        gsap.fromTo(
          el,
          { y: yFrom, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
          }
        )

        gsap.to(el, {
          y: yTo,
          opacity: 0,
          duration: 0.5,
          ease: "power3.in",
          delay: speed - 0.5,
          onComplete: () => {
            setCurrentIndex((prev) => (prev + 1) % words.length)
          },
        })
      }

      animate()
    })

    return () => ctx.revert()
  }, [currentIndex, words, speed, direction])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "3rem",
        fontSize: "clamp(2rem, 5vw, 4rem)",
        fontWeight: 800,
      }}
    >
      <span>We are&nbsp;</span>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          height: "1.2em",
          minWidth: "200px",
        }}
      >
        <div
          ref={wordRef}
          style={{
            position: "absolute",
            width: "100%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {words[currentIndex]}
        </div>
      </div>
    </div>
  )
}

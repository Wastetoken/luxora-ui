"use client"

import React, { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export interface OsmoPixelatedImageRevealProps {
  image?: string
  pixelSize?: number
  revealSpeed?: number
  className?: string
}

export default function OsmoPixelatedImageReveal({
  image = "https://picsum.photos/seed/pixel/800/500",
  pixelSize = 20,
  revealSpeed = 1,
  className,
}: OsmoPixelatedImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx2d = canvas.getContext("2d")
    if (!ctx2d) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = image

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      setLoaded(true)

      const obj = { pixelation: pixelSize }

      const drawPixelated = (size: number) => {
        if (size <= 1) {
          ctx2d.drawImage(img, 0, 0, canvas.width, canvas.height)
          return
        }

        const w = canvas.width
        const h = canvas.height

        // Draw small then scale up for pixelation effect
        ctx2d.clearRect(0, 0, w, h)
        const smallW = Math.ceil(w / size)
        const smallH = Math.ceil(h / size)

        ctx2d.imageSmoothingEnabled = false
        ctx2d.drawImage(img, 0, 0, smallW, smallH)
        ctx2d.drawImage(canvas, 0, 0, smallW, smallH, 0, 0, w, h)
      }

      drawPixelated(pixelSize)

      const gsapCtx = gsap.context(() => {
        gsap.to(obj, {
          pixelation: 1,
          duration: 2 / revealSpeed,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
          onUpdate: () => {
            drawPixelated(Math.round(obj.pixelation))
          },
        })
      }, containerRef)

      return () => gsapCtx.revert()
    }
  }, [image, pixelSize, revealSpeed])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          maxWidth: "800px",
          height: "auto",
          borderRadius: "16px",
          display: loaded ? "block" : "none",
        }}
      />
      {!loaded && (
        <div
          style={{
            width: "100%",
            maxWidth: "800px",
            height: "400px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          Loading...
        </div>
      )}
    </div>
  )
}

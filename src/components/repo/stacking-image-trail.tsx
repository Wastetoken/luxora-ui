"use client"

import React, { useRef, useEffect, useCallback } from "react"
import { gsap } from "gsap"

export interface OsmoStackingImageTrailProps {
  images?: string[]
  stackCount?: number
  className?: string
}

const defaultImages = [
  "https://picsum.photos/seed/stack1/250/350",
  "https://picsum.photos/seed/stack2/250/350",
  "https://picsum.photos/seed/stack3/250/350",
  "https://picsum.photos/seed/stack4/250/350",
  "https://picsum.photos/seed/stack5/250/350",
]

export default function OsmoStackingImageTrail({
  images = defaultImages,
  stackCount = 5,
  className,
}: OsmoStackingImageTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement[]>([])
  const indexRef = useRef(0)
  const lastPos = useRef({ x: 0, y: 0 })
  const zRef = useRef(1)

  const spawnImage = useCallback(
    (x: number, y: number) => {
      if (!containerRef.current) return

      const container = containerRef.current
      const img = document.createElement("div")
      const src = images[indexRef.current % images.length]
      indexRef.current++
      zRef.current++

      img.style.cssText = `
        position:absolute;
        width:160px;height:220px;
        border-radius:10px;
        background-image:url(${src});
        background-size:cover;
        background-position:center;
        left:${x - 80}px;
        top:${y - 110}px;
        pointer-events:none;
        z-index:${zRef.current};
        box-shadow:0 10px 40px rgba(0,0,0,0.3);
        will-change:transform,opacity;
      `

      container.appendChild(img)
      stackRef.current.push(img)

      gsap.fromTo(
        img,
        { scale: 0.6, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.5)" }
      )

      // Restack older images slightly
      stackRef.current.forEach((el, i) => {
        const offset = stackRef.current.length - 1 - i
        if (offset > 0 && offset <= stackCount) {
          gsap.to(el, {
            scale: 1 - offset * 0.04,
            y: -offset * 4,
            opacity: 1 - offset * 0.15,
            duration: 0.3,
          })
        }
      })

      // Remove excess
      while (stackRef.current.length > stackCount) {
        const old = stackRef.current.shift()
        if (old) {
          gsap.to(old, {
            opacity: 0,
            scale: 0.5,
            duration: 0.3,
            onComplete: () => old.remove(),
          })
        }
      }
    },
    [images, stackCount]
  )

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const dx = x - lastPos.current.x
      const dy = y - lastPos.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist > 100) {
        lastPos.current = { x, y }
        spawnImage(x, y)
      }
    }

    container.addEventListener("mousemove", handleMouseMove)
    return () => container.removeEventListener("mousemove", handleMouseMove)
  }, [spawnImage])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "500px",
        cursor: "crosshair",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p style={{ fontSize: "1.25rem", opacity: 0.3, userSelect: "none", zIndex: 0 }}>
        Move your mouse to stack images
      </p>
    </div>
  )
}

"use client"

import React, { useRef, useEffect, useCallback } from "react"
import { gsap } from "gsap"

export interface OsmoRotatingImageTrailProps {
  images?: string[]
  trailLength?: number
  rotation?: number
  className?: string
}

const defaultImages = [
  "https://picsum.photos/seed/trail1/200/200",
  "https://picsum.photos/seed/trail2/200/200",
  "https://picsum.photos/seed/trail3/200/200",
  "https://picsum.photos/seed/trail4/200/200",
  "https://picsum.photos/seed/trail5/200/200",
  "https://picsum.photos/seed/trail6/200/200",
]

export default function OsmoRotatingImageTrail({
  images = defaultImages,
  trailLength = 8,
  rotation = 15,
  className,
}: OsmoRotatingImageTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement[]>([])
  const currentIndex = useRef(0)
  const lastPos = useRef({ x: 0, y: 0 })
  const threshold = 80

  const spawnTrailImage = useCallback(
    (x: number, y: number) => {
      if (!containerRef.current) return

      const container = containerRef.current
      const img = document.createElement("div")
      const imageUrl = images[currentIndex.current % images.length]
      currentIndex.current++

      const rot = (Math.random() - 0.5) * rotation * 2

      img.style.cssText = `
        position:absolute;
        width:120px;height:120px;
        border-radius:12px;
        background-image:url(${imageUrl});
        background-size:cover;
        background-position:center;
        left:${x - 60}px;
        top:${y - 60}px;
        pointer-events:none;
        z-index:${currentIndex.current};
        will-change:transform,opacity;
      `

      container.appendChild(img)
      trailRef.current.push(img)

      gsap.fromTo(
        img,
        { scale: 0.3, rotation: rot, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          rotation: rot,
          duration: 0.4,
          ease: "back.out(1.7)",
        }
      )

      gsap.to(img, {
        opacity: 0,
        scale: 0.5,
        duration: 0.6,
        delay: 1.5,
        ease: "power2.in",
        onComplete: () => {
          img.remove()
          trailRef.current = trailRef.current.filter((el) => el !== img)
        },
      })

      // Remove excess
      while (trailRef.current.length > trailLength) {
        const oldest = trailRef.current.shift()
        if (oldest) {
          gsap.to(oldest, {
            opacity: 0,
            scale: 0.3,
            duration: 0.2,
            onComplete: () => oldest.remove(),
          })
        }
      }
    },
    [images, trailLength, rotation]
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

      if (dist > threshold) {
        lastPos.current = { x, y }
        spawnTrailImage(x, y)
      }
    }

    container.addEventListener("mousemove", handleMouseMove)
    return () => container.removeEventListener("mousemove", handleMouseMove)
  }, [spawnTrailImage])

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
        Move your mouse to create a rotating image trail
      </p>
    </div>
  )
}

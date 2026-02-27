"use client"

import React, { useRef, useCallback } from "react"
import { gsap } from "gsap"

export interface DirectionalItem {
  title: string
  image: string
  link: string
}

export interface OsmoDirectionalListHoverProps {
  items?: DirectionalItem[]
  className?: string
}

const defaultItems: DirectionalItem[] = [
  { title: "Project Alpha", image: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/AlmostCentralPurple.png", link: "#" },
  { title: "Project Beta", image: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueAndBlack.png", link: "#" },
  { title: "Project Gamma", image: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueAndRed.png", link: "#" },
  { title: "Project Delta", image: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueHalfDome.png", link: "#" },
  { title: "Project Epsilon", image: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueLiquidFlow.png", link: "#" },
]

export default function OsmoDirectionalListHover({
  items = defaultItems,
  className,
}: OsmoDirectionalListHoverProps) {
  const previewRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const handleMouseEnter = useCallback((item: DirectionalItem, e: React.MouseEvent) => {
    if (!previewRef.current || !imgRef.current) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const y = e.clientY - rect.top > rect.height / 2 ? "bottom" : "top"
    imgRef.current.src = item.image
    imgRef.current.alt = item.title
    gsap.set(previewRef.current, { y: y === "top" ? -20 : 20, opacity: 0 })
    gsap.to(previewRef.current, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" })
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!previewRef.current) return
    const container = (e.currentTarget as HTMLElement).closest("[data-directional-list]")
    if (!container) return
    const rect = container.getBoundingClientRect()
    gsap.to(previewRef.current, { x: e.clientX - rect.left + 20, y: e.clientY - rect.top - 75, duration: 0.3, ease: "power2.out" })
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!previewRef.current) return
    gsap.to(previewRef.current, { opacity: 0, duration: 0.2, ease: "power2.in" })
  }, [])

  return (
    <div
      data-directional-list
      className={className}
      style={{ position: "relative", maxWidth: "800px", margin: "0 auto", padding: "2rem 0" }}
    >
      <div
        ref={previewRef}
        style={{
          position: "absolute", width: "280px", height: "180px", borderRadius: "12px",
          overflow: "hidden", pointerEvents: "none", zIndex: 10, opacity: 0,
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        <img ref={imgRef} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
      </div>

      {items.map((item, i) => (
        <a
          key={i}
          href={item.link}
          onMouseEnter={(e) => handleMouseEnter(item, e)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "1.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.1)",
            textDecoration: "none", color: "inherit", cursor: "pointer", transition: "opacity 0.3s ease",
          }}
        >
          <span style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.01em" }}>
            {item.title}
          </span>
          <span style={{ fontSize: "1.5rem", opacity: 0.5 }}>&rarr;</span>
        </a>
      ))}
    </div>
  )
}

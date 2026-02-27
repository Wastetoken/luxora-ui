"use client"

import React, { useRef, useState } from "react"
import { gsap } from "gsap"

export interface ZoomImage {
  src: string
  title: string
}

export interface OsmoImageToBackgroundZoomProps {
  images?: ZoomImage[]
  duration?: number
  className?: string
}

const defaultImages: ZoomImage[] = [
  { src: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/AlmostCentralPurple.png", title: "Central Purple" },
  { src: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueAndBlack.png", title: "Blue & Black" },
  { src: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueAndRed.png", title: "Blue & Red" },
  { src: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueHalfDome.png", title: "Blue Half Dome" },
]

export default function OsmoImageToBackgroundZoom({
  images = defaultImages,
  duration = 0.8,
  className,
}: OsmoImageToBackgroundZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const [activeImage, setActiveImage] = useState<string | null>(null)

  const handleImageClick = (image: ZoomImage, e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !bgRef.current) return
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    const bg = bgRef.current
    bg.style.backgroundImage = `url(${image.src})`
    gsap.fromTo(bg,
      { clipPath: `inset(${rect.top - containerRect.top}px ${containerRect.right - rect.right}px ${containerRect.bottom - rect.bottom}px ${rect.left - containerRect.left}px)`, opacity: 1 },
      { clipPath: "inset(0px 0px 0px 0px)", duration, ease: "power3.inOut", onComplete: () => setActiveImage(image.src) }
    )
  }

  const handleClose = () => {
    if (!bgRef.current) return
    gsap.to(bgRef.current, { opacity: 0, duration: duration * 0.6, ease: "power2.in", onComplete: () => { setActiveImage(null); if (bgRef.current) bgRef.current.style.opacity = "0" } })
  }

  return (
    <div ref={containerRef} className={className} style={{ position: "relative", minHeight: "500px", overflow: "hidden" }}>
      <div ref={bgRef} onClick={handleClose} style={{ position: "absolute", inset: 0, backgroundSize: "cover", backgroundPosition: "center", opacity: 0, zIndex: 10, cursor: activeImage ? "pointer" : "default", pointerEvents: activeImage ? "auto" : "none" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", padding: "2rem", position: "relative", zIndex: 5 }}>
        {images.map((image, i) => (
          <div key={i} onClick={(e) => handleImageClick(image, e)} style={{ borderRadius: "16px", overflow: "hidden", cursor: "pointer", position: "relative", aspectRatio: "16/10" }}>
            <img src={image.src} alt={image.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1rem", background: "linear-gradient(transparent, rgba(0,0,0,0.7))", color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}>{image.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

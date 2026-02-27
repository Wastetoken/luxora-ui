"use client"

import React, { useRef, useState, useEffect } from "react"
import { gsap } from "gsap"

export interface NavItem {
  label: string
  href: string
  image: string
}

export interface OsmoBoldFullscreenNavigationProps {
  items?: NavItem[]
  bgColor?: string
  className?: string
}

const defaultItems: NavItem[] = [
  { label: "Home", href: "#", image: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/AlmostCentralPurple.png" },
  { label: "Work", href: "#", image: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueAndBlack.png" },
  { label: "About", href: "#", image: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueAndRed.png" },
  { label: "Contact", href: "#", image: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueHalfDome.png" },
]

export default function OsmoBoldFullscreenNavigation({
  items = defaultItems,
  bgColor = "#0a0a0a",
  className,
}: OsmoBoldFullscreenNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)
  const bgImageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!overlayRef.current || !linksRef.current) return
    const overlay = overlayRef.current
    const links = linksRef.current.querySelectorAll(".nav-link")
    if (isOpen) {
      gsap.to(overlay, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power3.inOut" })
      gsap.from(links, { y: 80, opacity: 0, stagger: 0.08, duration: 0.6, ease: "power3.out", delay: 0.3 })
    } else {
      gsap.to(overlay, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.5, ease: "power3.inOut" })
    }
  }, [isOpen])

  useEffect(() => {
    if (!bgImageRef.current || hoveredIndex === null) return
    gsap.to(bgImageRef.current, { opacity: 0.15, duration: 0.4, ease: "power2.out" })
  }, [hoveredIndex])

  return (
    <div className={className} style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "relative", zIndex: 100, background: "none", border: "none",
          cursor: "pointer", padding: "12px", display: "flex", flexDirection: "column", gap: "6px",
        }}
      >
        <span style={{ width: "32px", height: "2px", background: "#fff", transition: "all 0.3s ease", transform: isOpen ? "rotate(45deg) translateY(8px)" : "none" }} />
        <span style={{ width: "32px", height: "2px", background: "#fff", transition: "all 0.3s ease", opacity: isOpen ? 0 : 1 }} />
        <span style={{ width: "32px", height: "2px", background: "#fff", transition: "all 0.3s ease", transform: isOpen ? "rotate(-45deg) translateY(-8px)" : "none" }} />
      </button>

      <div
        ref={overlayRef}
        style={{
          position: "fixed", inset: 0, backgroundColor: bgColor, zIndex: 90,
          clipPath: "inset(0% 0% 100% 0%)", display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div
          ref={bgImageRef}
          style={{
            position: "absolute", inset: 0,
            backgroundImage: hoveredIndex !== null ? `url(${items[hoveredIndex].image})` : "none",
            backgroundSize: "cover", backgroundPosition: "center", opacity: 0,
            transition: "background-image 0.3s ease",
          }}
        />
        <nav ref={linksRef} style={{ position: "relative", zIndex: 2 }}>
          {items.map((item, i) => (
            <div key={i} style={{ overflow: "hidden" }}>
              <a
                className="nav-link"
                href={item.href}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => {
                  setHoveredIndex(null)
                  if (bgImageRef.current) gsap.to(bgImageRef.current, { opacity: 0, duration: 0.3 })
                }}
                style={{
                  display: "block", fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 900,
                  textDecoration: "none", color: "#fff", lineHeight: 1.1, letterSpacing: "-0.03em",
                  padding: "0.1em 0", transition: "opacity 0.3s ease",
                  opacity: hoveredIndex === null || hoveredIndex === i ? 1 : 0.3,
                }}
              >
                {item.label}
              </a>
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}

"use client"

import React, { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export interface HorizontalSection {
  title: string
  content: string
  bgColor: string
}

export interface OsmoHorizontalScrollingSectionsProps {
  sections?: HorizontalSection[]
  className?: string
}

const defaultSections: HorizontalSection[] = [
  { title: "Discover", content: "Explore new possibilities through innovative design thinking.", bgColor: "#1a1a2e" },
  { title: "Create", content: "Build meaningful experiences with modern technology.", bgColor: "#16213e" },
  { title: "Refine", content: "Polish every detail to achieve pixel-perfect results.", bgColor: "#0f3460" },
  { title: "Launch", content: "Ship confidently with robust testing and monitoring.", bgColor: "#533483" },
]

export default function OsmoHorizontalScrollingSections({
  sections = defaultSections,
  className,
}: OsmoHorizontalScrollingSectionsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return
    const ctx = gsap.context(() => {
      const track = trackRef.current!
      const totalScroll = track.scrollWidth - window.innerWidth

      gsap.to(track, {
        x: -totalScroll, ease: "none",
        scrollTrigger: { trigger: containerRef.current, start: "top top", end: () => `+=${totalScroll}`, scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
      })
    }, containerRef)
    return () => ctx.revert()
  }, [sections])

  return (
    <div ref={containerRef} className={className} style={{ overflow: "hidden" }}>
      <div ref={trackRef} style={{ display: "flex", width: `${sections.length * 100}vw`, height: "100vh" }}>
        {sections.map((section, i) => (
          <div key={i} className="h-scroll-panel" style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: section.bgColor, color: "#fff", padding: "4rem", flexShrink: 0, position: "relative" }}>
            <span className="h-scroll-number" style={{ fontSize: "0.875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.4, marginBottom: "1rem" }}>
              {String(i + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}
            </span>
            <h2 className="h-scroll-title" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, marginBottom: "1rem", letterSpacing: "-0.02em" }}>{section.title}</h2>
            <p className="h-scroll-content" style={{ fontSize: "1.25rem", maxWidth: "500px", textAlign: "center", opacity: 0.7, lineHeight: 1.6 }}>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

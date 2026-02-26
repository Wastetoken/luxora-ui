"use client"

import React, { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export interface OsmoHighlightTextOnScrollProps {
  text?: string
  highlightColor?: string
  className?: string
}

export default function OsmoHighlightTextOnScroll({
  text = "As you scroll down this page, each word will progressively highlight, creating a beautiful reading experience that guides your attention through the content naturally.",
  highlightColor = "#667eea",
  className,
}: OsmoHighlightTextOnScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    const textEl = container.querySelector(".highlight-text") as HTMLElement
    if (!textEl) return

    const words = text.split(" ")
    textEl.innerHTML = words
      .map((word) => `<span class="highlight-word" style="color:rgba(255,255,255,0.2);transition:color 0.3s ease">${word} </span>`)
      .join("")

    const wordEls = textEl.querySelectorAll(".highlight-word")

    const ctx = gsap.context(() => {
      gsap.to(wordEls, {
        color: highlightColor,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: { trigger: container, start: "top 70%", end: "bottom 30%", scrub: 1 },
      })
    }, container)

    return () => ctx.revert()
  }, [text, highlightColor])

  return (
    <div ref={containerRef} className={className} style={{ padding: "4rem 2rem", maxWidth: "800px", margin: "0 auto" }}>
      <div className="highlight-text" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 600, lineHeight: 1.5, letterSpacing: "-0.01em" }} />
    </div>
  )
}

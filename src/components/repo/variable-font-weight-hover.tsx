"use client"

import React, { useRef, useCallback } from "react"

export interface OsmoVariableFontWeightHoverProps {
  text?: string
  minWeight?: number
  maxWeight?: number
  className?: string
}

export default function OsmoVariableFontWeightHover({
  text = "HOVER OVER THIS TEXT",
  minWeight = 100,
  maxWeight = 900,
  className,
}: OsmoVariableFontWeightHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return

      const chars = containerRef.current.querySelectorAll<HTMLSpanElement>(".vf-char")

      chars.forEach((char) => {
        const charRect = char.getBoundingClientRect()
        const charCenterX = charRect.left + charRect.width / 2
        const charCenterY = charRect.top + charRect.height / 2

        const distX = e.clientX - charCenterX
        const distY = e.clientY - charCenterY
        const distance = Math.sqrt(distX * distX + distY * distY)
        const maxDist = 150

        const proximity = Math.max(0, 1 - distance / maxDist)
        const weight = minWeight + (maxWeight - minWeight) * proximity

        char.style.fontVariationSettings = `"wght" ${Math.round(weight)}`
        char.style.transition = "font-variation-settings 0.15s ease"
      })
    },
    [minWeight, maxWeight]
  )

  const handleMouseLeave = useCallback(() => {
    if (!containerRef.current) return
    const chars = containerRef.current.querySelectorAll<HTMLSpanElement>(".vf-char")
    chars.forEach((char) => {
      char.style.fontVariationSettings = `"wght" ${minWeight}`
      char.style.transition = "font-variation-settings 0.5s ease"
    })
  }, [minWeight])

  return (
    <>
      {/* Load a variable font that supports weight axis */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
      `}</style>
      <div
        ref={containerRef}
        className={className}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "3rem",
          cursor: "default",
          userSelect: "none",
        }}
      >
        <div
          style={{
            fontSize: "clamp(2rem, 6vw, 5rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          {text.split("").map((char, i) => (
            <span
              key={i}
              className="vf-char"
              style={{
                display: char === " " ? "inline" : "inline-block",
                fontVariationSettings: `"wght" ${minWeight}`,
                willChange: "font-variation-settings",
                color: "white",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}

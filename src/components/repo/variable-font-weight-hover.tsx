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
      const rect = containerRef.current.getBoundingClientRect()

      chars.forEach((char) => {
        const charRect = char.getBoundingClientRect()
        const charCenterX = charRect.left + charRect.width / 2
        const charCenterY = charRect.top + charRect.height / 2

        const distX = e.clientX - charCenterX
        const distY = e.clientY - charCenterY
        const distance = Math.sqrt(distX * distX + distY * distY)
        const maxDist = rect.width * 0.3

        const proximity = Math.max(0, 1 - distance / maxDist)
        const weight = minWeight + (maxWeight - minWeight) * proximity

        char.style.fontWeight = String(Math.round(weight))
        char.style.transition = "font-weight 0.1s ease"
      })
    },
    [minWeight, maxWeight]
  )

  const handleMouseLeave = useCallback(() => {
    if (!containerRef.current) return
    const chars = containerRef.current.querySelectorAll<HTMLSpanElement>(".vf-char")
    chars.forEach((char) => {
      char.style.fontWeight = String(minWeight)
      char.style.transition = "font-weight 0.5s ease"
    })
  }, [minWeight])

  return (
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
          fontVariationSettings: `"wght" ${minWeight}`,
        }}
      >
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="vf-char"
            style={{
              display: char === " " ? "inline" : "inline-block",
              fontWeight: minWeight,
              willChange: "font-weight",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    </div>
  )
}

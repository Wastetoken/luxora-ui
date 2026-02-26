"use client"

import React, { useRef, useState, useCallback } from "react"

export interface OsmoBeforeAfterSplitSliderProps {
  beforeImage?: string
  afterImage?: string
  initialPosition?: number
  className?: string
}

export default function OsmoBeforeAfterSplitSlider({
  beforeImage = "https://picsum.photos/seed/before/800/500?grayscale",
  afterImage = "https://picsum.photos/seed/after/800/500",
  initialPosition = 50,
  className,
}: OsmoBeforeAfterSplitSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(initialPosition)
  const isDragging = useRef(false)

  const updatePosition = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const percent = (x / rect.width) * 100
    setPosition(percent)
  }, [])

  const handleMouseDown = useCallback(() => {
    isDragging.current = true
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current) return
      updatePosition(e)
    },
    [updatePosition]
  )

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
  }, [])

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={updatePosition}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        aspectRatio: "16/10",
        overflow: "hidden",
        borderRadius: "16px",
        cursor: "ew-resize",
        userSelect: "none",
      }}
    >
      <img
        src={afterImage}
        alt="After"
        draggable={false}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          clipPath: `inset(0 ${100 - position}% 0 0)`,
        }}
      >
        <img src={beforeImage} alt="Before" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div
        style={{
          position: "absolute", top: 0, bottom: 0, left: `${position}%`,
          width: "3px", background: "#fff", transform: "translateX(-50%)", zIndex: 5,
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: "40px", height: "40px", borderRadius: "50%", background: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <span style={{ color: "#000", fontSize: "16px", fontWeight: 700 }}>&harr;</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: "12px", left: "12px", padding: "4px 12px", background: "rgba(0,0,0,0.6)", borderRadius: "6px", color: "#fff", fontSize: "0.75rem", fontWeight: 600, zIndex: 4 }}>Before</div>
      <div style={{ position: "absolute", top: "12px", right: "12px", padding: "4px 12px", background: "rgba(0,0,0,0.6)", borderRadius: "6px", color: "#fff", fontSize: "0.75rem", fontWeight: 600, zIndex: 4 }}>After</div>
    </div>
  )
}

"use client"

import React, { useRef, useEffect, useCallback } from "react"

export interface OsmoGlowingDotsGridProps {
  rows?: number
  cols?: number
  color?: string
  glowRadius?: number
  interactive?: boolean
  className?: string
}

export default function OsmoGlowingDotsGrid({
  rows = 15,
  cols = 25,
  color = "#667eea",
  glowRadius = 5,
  interactive = true,
  className,
}: OsmoGlowingDotsGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animFrameRef = useRef<number>(0)

  const registerDot = useCallback((el: HTMLDivElement | null, index: number) => {
    if (el) dotsRef.current[index] = el
  }, [])

  useEffect(() => {
    if (!containerRef.current || !interactive) return
    const container = containerRef.current

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const handleMouseLeave = () => { mouseRef.current = { x: -1000, y: -1000 } }

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)

    const dotSpacing = { x: container.offsetWidth / (cols + 1), y: container.offsetHeight / (rows + 1) }

    const animate = () => {
      dotsRef.current.forEach((dot, index) => {
        if (!dot) return
        const row = Math.floor(index / cols)
        const col = index % cols
        const dotX = (col + 1) * dotSpacing.x
        const dotY = (row + 1) * dotSpacing.y
        const dx = mouseRef.current.x - dotX
        const dy = mouseRef.current.y - dotY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDist = glowRadius * dotSpacing.x
        const brightness = Math.max(0, 1 - distance / maxDist)
        dot.style.opacity = String(0.1 + brightness * 0.9)
        dot.style.transform = `scale(${1 + brightness * 1.5})`
        dot.style.boxShadow = brightness > 0.1 ? `0 0 ${brightness * 15}px ${color}` : "none"
      })
      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [rows, cols, color, glowRadius, interactive])

  return (
    <div ref={containerRef} className={className} style={{ position: "relative", width: "100%", minHeight: "400px", overflow: "hidden", borderRadius: "16px", background: "#0a0a0a", cursor: interactive ? "crosshair" : "default" }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, width: "100%", height: "100%", position: "absolute", inset: 0, padding: "1rem" }}>
        {Array.from({ length: rows * cols }, (_, i) => (
          <div key={i} ref={(el) => registerDot(el, i)} style={{ width: "4px", height: "4px", borderRadius: "50%", background: color, opacity: 0.1, justifySelf: "center", alignSelf: "center", transition: interactive ? "none" : "opacity 0.3s ease", willChange: "transform, opacity" }} />
        ))}
      </div>
    </div>
  )
}

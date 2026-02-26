"use client"

import React, { useRef, useEffect, useCallback } from "react"

export interface OsmoInteractivePixelGridProps {
  gridSize?: number
  colors?: string[]
  interactionRadius?: number
  className?: string
}

export default function OsmoInteractivePixelGrid({
  gridSize = 20,
  colors = ["#667eea", "#764ba2", "#f093fb", "#4facfe"],
  interactionRadius = 3,
  className,
}: OsmoInteractivePixelGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixelsRef = useRef<{ brightness: number; targetBrightness: number; color: string }[]>([])
  const animFrameRef = useRef<number>(0)

  const init = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const width = container.offsetWidth
    const height = container.offsetHeight
    canvas.width = width
    canvas.height = height

    const cols = Math.ceil(width / gridSize)
    const rows = Math.ceil(height / gridSize)

    pixelsRef.current = Array.from({ length: cols * rows }, () => ({
      brightness: 0, targetBrightness: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    const ctx2d = canvas.getContext("2d")
    if (!ctx2d) return

    const render = () => {
      ctx2d.clearRect(0, 0, width, height)
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const idx = row * cols + col
          const pixel = pixelsRef.current[idx]
          if (!pixel) continue
          pixel.brightness += (pixel.targetBrightness - pixel.brightness) * 0.1
          pixel.targetBrightness *= 0.96
          if (pixel.brightness < 0.01) { pixel.brightness = 0; continue }
          const x = col * gridSize
          const y = row * gridSize
          const size = gridSize - 2
          ctx2d.globalAlpha = pixel.brightness
          ctx2d.fillStyle = pixel.color
          ctx2d.beginPath()
          ctx2d.roundRect(x + 1, y + 1, size, size, 2)
          ctx2d.fill()
        }
      }
      ctx2d.globalAlpha = 1
      animFrameRef.current = requestAnimationFrame(render)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const col = Math.floor(mx / gridSize)
      const row = Math.floor(my / gridSize)
      for (let r = -interactionRadius; r <= interactionRadius; r++) {
        for (let c = -interactionRadius; c <= interactionRadius; c++) {
          const pr = row + r; const pc = col + c
          if (pr < 0 || pr >= rows || pc < 0 || pc >= cols) continue
          const dist = Math.sqrt(r * r + c * c)
          if (dist > interactionRadius) continue
          const idx = pr * cols + pc
          const intensity = 1 - dist / interactionRadius
          if (pixelsRef.current[idx]) pixelsRef.current[idx].targetBrightness = Math.max(pixelsRef.current[idx].targetBrightness, intensity)
        }
      }
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    animFrameRef.current = requestAnimationFrame(render)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [gridSize, colors, interactionRadius])

  useEffect(() => {
    const cleanup = init()
    return () => cleanup?.()
  }, [init])

  return (
    <div ref={containerRef} className={className} style={{ position: "relative", width: "100%", minHeight: "400px", overflow: "hidden", borderRadius: "16px", background: "#0a0a0a", cursor: "crosshair" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "1.1rem", userSelect: "none" }}>Move your cursor across the grid</p>
      </div>
    </div>
  )
}

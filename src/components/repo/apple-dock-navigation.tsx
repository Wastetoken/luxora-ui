"use client"

import React, { useRef, useState, useCallback } from "react"

export interface DockItem {
  label: string
  icon: string
  href: string
}

export interface OsmoAppleDockNavigationProps {
  items?: DockItem[]
  position?: "bottom" | "left" | "right"
  size?: number
  className?: string
}

const defaultItems: DockItem[] = [
  { label: "Home", icon: "H", href: "#" },
  { label: "Search", icon: "S", href: "#" },
  { label: "Messages", icon: "M", href: "#" },
  { label: "Calendar", icon: "C", href: "#" },
  { label: "Photos", icon: "P", href: "#" },
  { label: "Settings", icon: "G", href: "#" },
  { label: "Music", icon: "U", href: "#" },
]

const COLORS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
]

export default function OsmoAppleDockNavigation({
  items = defaultItems,
  position = "bottom",
  size = 56,
  className,
}: OsmoAppleDockNavigationProps) {
  const dockRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState<number | null>(null)
  const [tooltip, setTooltip] = useState<string | null>(null)

  const isVertical = position === "left" || position === "right"

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!dockRef.current) return
      const rect = dockRef.current.getBoundingClientRect()
      const pos = isVertical
        ? (e.clientY - rect.top) / rect.height
        : (e.clientX - rect.left) / rect.width
      setMousePos(pos)
    },
    [isVertical]
  )

  const handleMouseLeave = useCallback(() => {
    setMousePos(null)
    setTooltip(null)
  }, [])

  const getScale = (index: number): number => {
    if (mousePos === null) return 1
    const itemPos = (index + 0.5) / items.length
    const distance = Math.abs(mousePos - itemPos) * items.length
    const scale = Math.max(1, 1.6 - distance * 0.35)
    return Math.min(scale, 1.6)
  }

  const dockStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: isVertical ? "column" : "row",
    alignItems: "flex-end",
    gap: "4px",
    padding: "10px 14px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.12)",
    position: "relative",
  }

  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    padding: "2rem",
    ...(position === "bottom" && { alignItems: "flex-end" }),
    ...(position === "left" && { alignItems: "center", justifyContent: "flex-start" }),
    ...(position === "right" && { alignItems: "center", justifyContent: "flex-end" }),
  }

  return (
    <div className={className} style={containerStyle}>
      <div
        ref={dockRef}
        style={dockStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {items.map((item, i) => {
          const scale = getScale(i)
          const currentSize = size * scale

          return (
            <a
              key={i}
              href={item.href}
              onMouseEnter={() => setTooltip(item.label)}
              onMouseLeave={() => setTooltip(null)}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: `${currentSize}px`,
                height: `${currentSize}px`,
                borderRadius: "14px",
                background: COLORS[i % COLORS.length],
                color: "#fff",
                fontWeight: 800,
                fontSize: `${14 * scale}px`,
                textDecoration: "none",
                transition: mousePos !== null ? "all 0.15s ease" : "all 0.4s ease",
                transformOrigin: isVertical
                  ? position === "left"
                    ? "left center"
                    : "right center"
                  : "center bottom",
                marginBottom: isVertical ? 0 : `${(currentSize - size) / 2}px`,
                boxShadow: scale > 1.1 ? "0 8px 24px rgba(0,0,0,0.3)" : "none",
              }}
            >
              {item.icon}
              {tooltip === item.label && (
                <div
                  style={{
                    position: "absolute",
                    [isVertical ? (position === "left" ? "right" : "left") : "top"]: "-36px",
                    background: "rgba(0,0,0,0.8)",
                    color: "#fff",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                  }}
                >
                  {item.label}
                </div>
              )}
            </a>
          )
        })}
      </div>
    </div>
  )
}

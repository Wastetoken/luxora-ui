"use client"

import React, { useRef, useEffect } from "react"
import { gsap } from "gsap"

export interface OsmoMagneticCursorProps {
  strength?: number
  radius?: number
  children?: React.ReactNode
  className?: string
}

export default function OsmoMagneticCursor({
  strength = 0.5,
  radius = 150,
  children,
  className,
}: OsmoMagneticCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    const magneticEls = container.querySelectorAll<HTMLElement>("[data-magnetic]")
    const handlers: Array<{ el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }> = []

    magneticEls.forEach((el) => {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const distX = e.clientX - centerX
        const distY = e.clientY - centerY
        const distance = Math.sqrt(distX * distX + distY * distY)
        if (distance < radius) {
          const factor = (1 - distance / radius) * strength
          gsap.to(el, { x: distX * factor, y: distY * factor, duration: 0.4, ease: "power3.out" })
        }
      }
      const handleMouseLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" })
      }
      el.addEventListener("mousemove", handleMouseMove)
      el.addEventListener("mouseleave", handleMouseLeave)
      handlers.push({ el, move: handleMouseMove, leave: handleMouseLeave })
    })

    return () => { handlers.forEach(({ el, move, leave }) => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave) }) }
  }, [strength, radius])

  return (
    <div ref={containerRef} className={className}>
      {children || (
        <div style={{ display: "flex", gap: "2rem", justifyContent: "center", alignItems: "center", padding: "4rem", flexWrap: "wrap" }}>
          {["Explore", "Create", "Build", "Ship"].map((label, i) => (
            <div key={i} data-magnetic style={{ padding: "1rem 2.5rem", borderRadius: "40px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.03)", cursor: "pointer", fontSize: "1.1rem", fontWeight: 600, willChange: "transform", transition: "border-color 0.3s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(102,126,234,0.6)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}>
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

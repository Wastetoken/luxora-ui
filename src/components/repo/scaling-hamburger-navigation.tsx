"use client"

import React, { useRef, useState, useEffect } from "react"
import { gsap } from "gsap"

export interface HamburgerNavItem {
  label: string
  href: string
}

export interface OsmoScalingHamburgerNavigationProps {
  items?: HamburgerNavItem[]
  bgColor?: string
  className?: string
}

const defaultItems: HamburgerNavItem[] = [
  { label: "Home", href: "#" },
  { label: "Projects", href: "#" },
  { label: "About", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Contact", href: "#" },
]

export default function OsmoScalingHamburgerNavigation({
  items = defaultItems,
  bgColor = "#0a0a0a",
  className,
}: OsmoScalingHamburgerNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!overlayRef.current || !contentRef.current) return

    const overlay = overlayRef.current
    const links = contentRef.current.querySelectorAll(".scale-nav-link")

    if (isOpen) {
      gsap.to(overlay, {
        scale: 1,
        borderRadius: "0px",
        duration: 0.6,
        ease: "power3.inOut",
      })
      gsap.from(links, {
        scale: 0.5,
        opacity: 0,
        stagger: 0.06,
        duration: 0.5,
        ease: "back.out(1.7)",
        delay: 0.3,
      })
    } else {
      gsap.to(overlay, {
        scale: 0,
        borderRadius: "50%",
        duration: 0.5,
        ease: "power3.inOut",
      })
    }
  }, [isOpen])

  return (
    <div className={className} style={{ position: "relative" }}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "relative",
          zIndex: 100,
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: isOpen ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.15)",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "5px",
          transition: "all 0.3s ease",
        }}
      >
        <span
          style={{
            width: "20px",
            height: "2px",
            background: "#fff",
            transition: "all 0.3s ease",
            transform: isOpen ? "rotate(45deg) translateY(7px)" : "none",
          }}
        />
        <span
          style={{
            width: "20px",
            height: "2px",
            background: "#fff",
            transition: "all 0.3s ease",
            opacity: isOpen ? 0 : 1,
          }}
        />
        <span
          style={{
            width: "20px",
            height: "2px",
            background: "#fff",
            transition: "all 0.3s ease",
            transform: isOpen ? "rotate(-45deg) translateY(-7px)" : "none",
          }}
        />
      </button>

      {/* Scaling overlay */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: bgColor,
          zIndex: 90,
          transform: "scale(0)",
          borderRadius: "50%",
          transformOrigin: "top right",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <nav
          ref={contentRef}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {items.map((item, i) => (
            <a
              key={i}
              className="scale-nav-link"
              href={item.href}
              onClick={() => setIsOpen(false)}
              style={{
                fontSize: "clamp(2rem, 6vw, 4rem)",
                fontWeight: 800,
                textDecoration: "none",
                color: "#fff",
                padding: "0.25em 0",
                letterSpacing: "-0.02em",
                transition: "opacity 0.2s ease, transform 0.2s ease",
                display: "block",
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}

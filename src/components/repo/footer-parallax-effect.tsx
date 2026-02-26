"use client"

import React, { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export interface FooterLink {
  label: string
  href: string
}

export interface OsmoFooterParallaxEffectProps {
  title?: string
  subtitle?: string
  links?: FooterLink[]
  bgColor?: string
  className?: string
}

const defaultLinks: FooterLink[] = [
  { label: "Twitter", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Dribbble", href: "#" },
]

export default function OsmoFooterParallaxEffect({
  title = "Let's Work Together",
  subtitle = "Ready to start your next project?",
  links = defaultLinks,
  bgColor = "#0a0a0a",
  className,
}: OsmoFooterParallaxEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      const titleEl = containerRef.current!.querySelector(".footer-title")
      const subtitleEl = containerRef.current!.querySelector(".footer-subtitle")
      const linksEl = containerRef.current!.querySelectorAll(".footer-link")

      gsap.from(titleEl, { yPercent: 50, ease: "none", scrollTrigger: { trigger: containerRef.current, start: "top bottom", end: "top center", scrub: true } })
      gsap.from(subtitleEl, { yPercent: 30, opacity: 0, scrollTrigger: { trigger: containerRef.current, start: "top 80%", end: "top 40%", scrub: true } })
      gsap.from(linksEl, { y: 30, opacity: 0, stagger: 0.1, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: containerRef.current, start: "top 60%", toggleActions: "play none none reverse" } })
    }, containerRef)
    return () => ctx.revert()
  }, [title, subtitle, links])

  return (
    <footer ref={containerRef} className={className} style={{ backgroundColor: bgColor, color: "#fff", padding: "8rem 2rem 4rem", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
        <p className="footer-subtitle" style={{ fontSize: "1.1rem", opacity: 0.5, marginBottom: "1rem", fontWeight: 500 }}>{subtitle}</p>
        <h2 className="footer-title" style={{ fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "3rem", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{title}</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          {links.map((link, i) => (
            <a key={i} className="footer-link" href={link.href} style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "1rem", fontWeight: 500, transition: "color 0.3s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}>{link.label}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}

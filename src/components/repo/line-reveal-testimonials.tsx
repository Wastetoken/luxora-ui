"use client"

import React, { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export interface Testimonial {
  quote: string
  author: string
  role: string
}

export interface OsmoLineRevealTestimonialsProps {
  testimonials?: Testimonial[]
  speed?: number
  className?: string
}

const defaultTestimonials: Testimonial[] = [
  { quote: "This product completely transformed how we work. The team has never been more productive.", author: "Sarah Chen", role: "CEO, TechFlow" },
  { quote: "Incredible attention to detail. Every interaction feels polished and intentional.", author: "Marcus Rivera", role: "Design Lead, Pixel" },
  { quote: "We saw a 200% increase in engagement within the first month of implementation.", author: "Elena Kowalski", role: "VP Marketing, Growth Co" },
]

export default function OsmoLineRevealTestimonials({
  testimonials = defaultTestimonials,
  speed = 1,
  className,
}: OsmoLineRevealTestimonialsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      const cards = containerRef.current!.querySelectorAll(".testimonial-card")
      cards.forEach((card) => {
        const lines = card.querySelectorAll(".testimonial-line")
        const author = card.querySelector(".testimonial-author")
        const divider = card.querySelector(".testimonial-divider")
        const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 80%", toggleActions: "play none none reverse" } })
        tl.from(divider, { scaleX: 0, duration: 0.6 / speed, ease: "power3.inOut" })
        tl.from(lines, { y: 40, opacity: 0, stagger: 0.1 / speed, duration: 0.6 / speed, ease: "power3.out" }, "-=0.3")
        tl.from(author, { y: 20, opacity: 0, duration: 0.5 / speed, ease: "power2.out" }, "-=0.2")
      })
    }, containerRef)
    return () => ctx.revert()
  }, [testimonials, speed])

  return (
    <div ref={containerRef} className={className} style={{ position: "relative" }}>
      {/* Pre-spacer */}
      <div style={{ height: "40vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "1rem", opacity: 0.3, color: "#fff" }}>↓ Scroll to reveal testimonials ↓</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "3rem", padding: "2rem 2rem 2rem", maxWidth: "800px", margin: "0 auto" }}>
        {testimonials.map((t, i) => {
          const lines = t.quote.match(/[^.!?]+[.!?]+/g) || [t.quote]
          return (
            <div key={i} className="testimonial-card" style={{ padding: "2rem 0" }}>
              <div className="testimonial-divider" style={{ width: "60px", height: "2px", background: "linear-gradient(90deg, #667eea, #764ba2)", marginBottom: "1.5rem", transformOrigin: "left center" }} />
              <div style={{ overflow: "hidden" }}>
                {lines.map((line, li) => (
                  <div key={li} className="testimonial-line" style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", fontWeight: 400, lineHeight: 1.5, fontStyle: "italic", opacity: 0.9, color: "#fff" }}>{line.trim()}</div>
                ))}
              </div>
              <div className="testimonial-author" style={{ marginTop: "1.5rem" }}>
                <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#fff" }}>{t.author}</div>
                <div style={{ fontSize: "0.9rem", opacity: 0.6, color: "#fff" }}>{t.role}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Post-spacer */}
      <div style={{ height: "30vh" }} />
    </div>
  )
}

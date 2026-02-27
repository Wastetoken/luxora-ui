"use client"

import React, { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"

export interface DroppingCard {
  title: string
  description: string
  image: string
}

export interface OsmoDroppingCardsStackProps {
  cards?: DroppingCard[]
  autoplay?: boolean
  className?: string
}

const defaultCards: DroppingCard[] = [
  { title: "First Card", description: "This is the first card in the stack.", image: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/AlmostCentralPurple.png" },
  { title: "Second Card", description: "This is the second card in the stack.", image: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueAndBlack.png" },
  { title: "Third Card", description: "This is the third card in the stack.", image: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueAndRed.png" },
  { title: "Fourth Card", description: "This is the fourth card in the stack.", image: "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueHalfDome.png" },
]

export default function OsmoDroppingCardsStack({
  cards = defaultCards,
  autoplay = true,
  className,
}: OsmoDroppingCardsStackProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const cardEls = containerRef.current.querySelectorAll<HTMLElement>(".drop-card")
    cardEls.forEach((card, i) => {
      if (i === activeIndex) {
        gsap.to(card, { y: 0, scale: 1, opacity: 1, rotation: 0, zIndex: cards.length, duration: 0.6, ease: "back.out(1.5)" })
      } else if (i < activeIndex) {
        gsap.to(card, { y: 300, scale: 0.8, opacity: 0, rotation: (Math.random() - 0.5) * 30, zIndex: i, duration: 0.5, ease: "power3.in" })
      } else {
        const offset = i - activeIndex
        gsap.to(card, { y: -offset * 8, scale: 1 - offset * 0.05, opacity: 1 - offset * 0.2, rotation: 0, zIndex: cards.length - offset, duration: 0.4, ease: "power2.out" })
      }
    })
  }, [activeIndex, cards.length])

  useEffect(() => {
    if (!autoplay) return
    intervalRef.current = setInterval(() => { setActiveIndex((prev) => (prev + 1) % cards.length) }, 3000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [autoplay, cards.length])

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % cards.length)

  return (
    <div ref={containerRef} className={className} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 2rem", minHeight: "500px" }}>
      <div style={{ position: "relative", width: "360px", height: "340px", cursor: "pointer" }} onClick={handleNext}>
        {cards.map((card, i) => (
          <div key={i} className="drop-card" style={{ position: "absolute", top: 0, left: 0, width: "100%", borderRadius: "20px", overflow: "hidden", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", willChange: "transform" }}>
            <img src={card.image} alt={card.title} style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }} />
            <div style={{ padding: "1.25rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.3rem" }}>{card.title}</h3>
              <p style={{ fontSize: "0.9rem", opacity: 0.6 }}>{card.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "1.5rem", display: "flex", gap: "8px" }}>
        {cards.map((_, i) => (
          <div key={i} onClick={() => setActiveIndex(i)} style={{ width: "8px", height: "8px", borderRadius: "50%", background: i === activeIndex ? "#667eea" : "rgba(255,255,255,0.2)", cursor: "pointer", transition: "background 0.3s ease" }} />
        ))}
      </div>
    </div>
  )
}

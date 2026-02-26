"use client"

import React, { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export interface StackingCard {
  title: string
  description: string
  bgColor: string
}

export interface OsmoStackingCardsParallaxProps {
  cards?: StackingCard[]
  className?: string
}

const defaultCards: StackingCard[] = [
  { title: "Strategy", description: "We define the roadmap and set clear goals for success.", bgColor: "#1a1a2e" },
  { title: "Design", description: "Crafting beautiful interfaces that users love to interact with.", bgColor: "#16213e" },
  { title: "Develop", description: "Building robust applications with cutting-edge technology.", bgColor: "#0f3460" },
  { title: "Launch", description: "Deploying to production and monitoring performance.", bgColor: "#533483" },
]

export default function OsmoStackingCardsParallax({
  cards = defaultCards,
  className,
}: OsmoStackingCardsParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const cardEls = containerRef.current!.querySelectorAll<HTMLElement>(".stacking-parallax-card")

      cardEls.forEach((card, i) => {
        if (i === cards.length - 1) return // Last card doesn't animate

        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          end: "bottom top",
          pin: true,
          pinSpacing: false,
        })

        gsap.to(card, {
          scale: 0.9 - i * 0.02,
          opacity: 0.5,
          scrollTrigger: {
            trigger: cardEls[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [cards])

  return (
    <div ref={containerRef} className={className}>
      {cards.map((card, i) => (
        <div
          key={i}
          className="stacking-parallax-card"
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: card.bgColor,
            color: "#fff",
            padding: "4rem 2rem",
            borderRadius: "24px 24px 0 0",
            position: "relative",
            willChange: "transform",
          }}
        >
          <span
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              opacity: 0.5,
              marginBottom: "1rem",
            }}
          >
            0{i + 1}
          </span>
          <h2 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, marginBottom: "1rem" }}>
            {card.title}
          </h2>
          <p style={{ fontSize: "1.25rem", maxWidth: "500px", textAlign: "center", opacity: 0.7 }}>
            {card.description}
          </p>
        </div>
      ))}
    </div>
  )
}

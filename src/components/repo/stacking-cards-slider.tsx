"use client"

import React, { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export interface StackSliderCard {
  title: string
  content: string
  bgColor: string
}

export interface OsmoStackingCardsSliderProps {
  cards?: StackSliderCard[]
  className?: string
}

const defaultCards: StackSliderCard[] = [
  { title: "Step 01", content: "Research and discover user needs through comprehensive interviews and data analysis.", bgColor: "#1a1a2e" },
  { title: "Step 02", content: "Design intuitive interfaces that delight users at every interaction point.", bgColor: "#16213e" },
  { title: "Step 03", content: "Develop robust applications using modern frameworks and best practices.", bgColor: "#0f3460" },
  { title: "Step 04", content: "Test thoroughly, deploy confidently, and iterate based on real feedback.", bgColor: "#533483" },
]

export default function OsmoStackingCardsSlider({
  cards = defaultCards,
  className,
}: OsmoStackingCardsSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const cardEls = containerRef.current!.querySelectorAll<HTMLElement>(".stack-slider-card")

      cardEls.forEach((card, i) => {
        // Pin each card
        ScrollTrigger.create({
          trigger: card,
          start: `top ${80 + i * 30}px`,
          endTrigger: containerRef.current,
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
        })

        // Scale down as next card arrives
        if (i < cards.length - 1) {
          gsap.to(card, {
            scale: 0.92 - i * 0.02,
            filter: `brightness(${0.7 - i * 0.1})`,
            scrollTrigger: {
              trigger: cardEls[i + 1],
              start: "top bottom",
              end: `top ${80 + i * 30}px`,
              scrub: true,
            },
          })
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [cards])

  return (
    <div ref={containerRef} className={className} style={{ position: "relative" }}>
      {cards.map((card, i) => (
        <div
          key={i}
          className="stack-slider-card"
          style={{
            width: "min(90vw, 800px)",
            margin: "0 auto",
            marginBottom: "2rem",
            minHeight: "350px",
            borderRadius: "24px",
            backgroundColor: card.bgColor,
            color: "#fff",
            padding: "3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            willChange: "transform",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <h3
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              fontWeight: 900,
              marginBottom: "1rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {card.title}
          </h3>
          <p style={{ fontSize: "1.2rem", opacity: 0.8, lineHeight: 1.6, maxWidth: "600px" }}>
            {card.content}
          </p>
        </div>
      ))}
    </div>
  )
}

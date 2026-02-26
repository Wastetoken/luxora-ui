"use client"

import React from "react"

export interface OsmoCSSMarqueeProps {
  items?: string[]
  speed?: number
  direction?: "left" | "right"
  gap?: number
  className?: string
}

export default function OsmoCSSMarquee({
  items = ["Creative Studio", "Digital Design", "Web Development", "Brand Identity", "Motion Graphics"],
  speed = 30,
  direction = "left",
  gap = 48,
  className,
}: OsmoCSSMarqueeProps) {
  const animationName = "osmo-marquee-scroll"

  const keyframes = `
    @keyframes ${animationName} {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `

  return (
    <div className={className} style={{ overflow: "hidden", padding: "1.5rem 0" }}>
      <style>{keyframes}</style>
      <div
        style={{
          display: "flex",
          width: "fit-content",
          animation: `${animationName} ${speed}s linear infinite`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {[0, 1].map((setIdx) => (
          <div key={setIdx} style={{ display: "flex", alignItems: "center" }}>
            {items.map((item, i) => (
              <React.Fragment key={i}>
                <span
                  style={{
                    fontSize: "clamp(1.5rem, 4vw, 3rem)",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    paddingLeft: `${gap / 2}px`,
                    paddingRight: `${gap / 2}px`,
                    opacity: 0.9,
                  }}
                >
                  {item}
                </span>
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "currentColor",
                    opacity: 0.3,
                    flexShrink: 0,
                  }}
                />
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

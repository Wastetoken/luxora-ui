"use client"

import React, { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"

export interface OsmoDraggableMarqueeProps {
  items?: string[]
  speed?: number
  direction?: "left" | "right"
  pauseOnHover?: boolean
  className?: string
}

export default function OsmoDraggableMarquee({
  items = ["Design", "Code", "Ship", "Iterate", "Scale", "Repeat"],
  speed = 60,
  direction = "left",
  pauseOnHover = true,
  className,
}: OsmoDraggableMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const isDragging = useRef(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return

    const track = trackRef.current
    const firstSet = track.querySelector(".marquee-set-0") as HTMLElement
    if (!firstSet) return

    const setWidth = firstSet.offsetWidth

    const ctx = gsap.context(() => {
      const xFrom = direction === "left" ? 0 : -setWidth
      const xTo = direction === "left" ? -setWidth : 0
      const dur = setWidth / speed

      tweenRef.current = gsap.fromTo(
        track,
        { x: xFrom },
        { x: xTo, duration: dur, ease: "none", repeat: -1 }
      )
    }, containerRef)

    let startX = 0
    let trackX = 0

    const handlePointerDown = (e: PointerEvent) => {
      isDragging.current = true
      startX = e.clientX
      trackX = gsap.getProperty(track, "x") as number
      tweenRef.current?.pause()
      containerRef.current!.style.cursor = "grabbing"
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return
      const dx = e.clientX - startX
      const newX = trackX + dx
      const wrapped = ((newX % setWidth) + setWidth) % setWidth - setWidth
      gsap.set(track, { x: wrapped })
    }

    const handlePointerUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      containerRef.current!.style.cursor = "grab"
      if (!paused) tweenRef.current?.resume()
    }

    const el = containerRef.current
    el.addEventListener("pointerdown", handlePointerDown)
    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)

    return () => {
      el.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
      ctx.revert()
    }
  }, [items, speed, direction, paused])

  useEffect(() => {
    if (!tweenRef.current) return
    paused ? tweenRef.current.pause() : tweenRef.current.resume()
  }, [paused])

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
      style={{ overflow: "hidden", cursor: "grab", userSelect: "none", padding: "2rem 0", touchAction: "none" }}
    >
      <div ref={trackRef} style={{ display: "flex", width: "fit-content" }}>
        {[0, 1, 2].map((setIdx) => (
          <div key={setIdx} className={`marquee-set-${setIdx}`} style={{ display: "flex", alignItems: "center" }}>
            {items.map((item, i) => (
              <React.Fragment key={i}>
                <span style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, whiteSpace: "nowrap", padding: "0 1rem" }}>{item}</span>
                <span style={{ opacity: 0.2, fontSize: "2rem", padding: "0 1rem" }}>/</span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

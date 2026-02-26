"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export interface OsmoTextScrambleProps {
  text?: string
  speed?: number
  trigger?: "hover" | "scroll" | "load"
  className?: string
}

const CHARS = "!<>-_\\/[]{}--=+*^?#_abcdefghijklmnopqrstuvwxyz0123456789"

export default function OsmoTextScramble({
  text = "OSMO SCRAMBLE",
  speed = 30,
  trigger = "hover",
  className,
}: OsmoTextScrambleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [display, setDisplay] = useState(text)
  const isAnimating = useRef(false)
  const frameRef = useRef<number>(0)

  const scramble = useCallback(() => {
    if (isAnimating.current) return
    isAnimating.current = true

    const originalChars = text.split("")
    const length = originalChars.length
    let frame = 0
    const maxFrames = length + 15

    const update = () => {
      const output = originalChars
        .map((char, idx) => {
          if (char === " ") return " "
          if (frame - idx > 15) return char
          if (frame > idx) {
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          }
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join("")

      setDisplay(output)
      frame++

      if (frame <= maxFrames) {
        frameRef.current = window.setTimeout(update, speed)
      } else {
        setDisplay(text)
        isAnimating.current = false
      }
    }

    update()
  }, [text, speed])

  useEffect(() => {
    return () => {
      if (frameRef.current) clearTimeout(frameRef.current)
    }
  }, [])

  useEffect(() => {
    if (trigger === "load") {
      scramble()
      return
    }

    if (trigger === "scroll" && containerRef.current) {
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 80%",
          onEnter: scramble,
          onEnterBack: scramble,
        })
      }, containerRef)
      return () => ctx.revert()
    }
  }, [trigger, scramble])

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseEnter={trigger === "hover" ? scramble : undefined}
      style={{
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1.5rem 2rem",
        cursor: trigger === "hover" ? "pointer" : "default",
      }}
    >
      <span
        style={{
          fontSize: "clamp(1.5rem, 4vw, 3rem)",
          fontWeight: 800,
          fontFamily: "monospace",
          letterSpacing: "0.1em",
          whiteSpace: "pre",
        }}
      >
        {display}
      </span>
    </div>
  )
}

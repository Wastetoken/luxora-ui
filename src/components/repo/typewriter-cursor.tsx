'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoTypewriterCursorProps {
  phrases?: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  cursorColor?: string
  className?: string
}

export default function OsmoTypewriterCursor({
  phrases = ['Creative Developer', 'UI Engineer', 'Design Enthusiast', 'Problem Solver'],
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000,
  cursorColor = '#8b5cf6',
  className,
}: OsmoTypewriterCursorProps) {
  const [displayText, setDisplayText] = useState('')
  const stateRef = useRef({ phraseIndex: 0, isDeleting: false, charIndex: 0 })
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const tick = () => {
      const { phraseIndex, isDeleting, charIndex } = stateRef.current
      const currentPhrase = phrases[phraseIndex]

      if (!isDeleting) {
        if (charIndex < currentPhrase.length) {
          stateRef.current.charIndex = charIndex + 1
          setDisplayText(currentPhrase.slice(0, charIndex + 1))
          timerRef.current = setTimeout(tick, typingSpeed)
        } else {
          stateRef.current.isDeleting = true
          timerRef.current = setTimeout(tick, pauseDuration)
        }
      } else {
        if (charIndex > 0) {
          stateRef.current.charIndex = charIndex - 1
          setDisplayText(currentPhrase.slice(0, charIndex - 1))
          timerRef.current = setTimeout(tick, deletingSpeed)
        } else {
          stateRef.current.isDeleting = false
          stateRef.current.phraseIndex = (phraseIndex + 1) % phrases.length
          timerRef.current = setTimeout(tick, typingSpeed)
        }
      }
    }

    timerRef.current = setTimeout(tick, typingSpeed)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [phrases, typingSpeed, deletingSpeed, pauseDuration])

  return (
    <div
      className={cn(
        'flex items-center justify-center py-20 px-8',
        className
      )}
    >
      <div className="text-center">
        <p className="text-white/40 text-lg mb-2">I am a</p>
        <div className="flex items-center justify-center gap-1">
          <span className="text-white text-4xl md:text-6xl font-bold tracking-tight min-h-[1.2em]">
            {displayText}
          </span>
          <motion.span
            className="inline-block w-[3px] h-[1em] text-4xl md:text-6xl align-middle"
            style={{ backgroundColor: cursorColor }}
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
          />
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

interface Ripple {
  id: number
  x: number
  y: number
}

export interface OsmoRippleEffectProps {
  color?: string
  duration?: number
  maxSize?: number
  className?: string
}

export default function OsmoRippleEffect({
  color = '#8b5cf6',
  duration = 0.8,
  maxSize = 300,
  className,
}: OsmoRippleEffectProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = Date.now()

      setRipples((prev) => [...prev, { id, x, y }])

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, duration * 1000)
    },
    [duration]
  )

  return (
    <div
      onClick={handleClick}
      className={cn(
        'relative w-full h-[400px] overflow-hidden bg-neutral-950 rounded-xl cursor-pointer flex items-center justify-center',
        className
      )}
    >
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ width: 0, height: 0, opacity: 0.6 }}
            animate={{ width: maxSize, height: maxSize, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: ripple.x - maxSize / 2,
              top: ripple.y - maxSize / 2,
              borderRadius: '50%',
              border: `2px solid ${color}`,
              pointerEvents: 'none',
            }}
          />
        ))}
      </AnimatePresence>
      <p className="text-white/60 text-lg font-medium pointer-events-none select-none">
        Click anywhere
      </p>
    </div>
  )
}

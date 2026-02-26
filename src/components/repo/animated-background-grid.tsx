'use client'

import React, { useMemo } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoAnimatedBackgroundGridProps {
  rows?: number
  cols?: number
  dotSize?: number
  dotColor?: string
  speed?: number
  className?: string
}

export default function OsmoAnimatedBackgroundGrid({
  rows = 12,
  cols = 20,
  dotSize = 3,
  dotColor = '#8b5cf6',
  speed = 3,
  className,
}: OsmoAnimatedBackgroundGridProps) {
  const dots = useMemo(() => {
    const result: { row: number; col: number; delay: number }[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        result.push({
          row: r,
          col: c,
          delay: (r + c) * 0.1,
        })
      }
    }
    return result
  }, [rows, cols])

  return (
    <div
      className={cn(
        'relative w-full h-[400px] overflow-hidden bg-neutral-950 rounded-xl',
        className
      )}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          padding: '2rem',
        }}
      >
        {dots.map((dot, i) => (
          <motion.div
            key={i}
            className="flex items-center justify-center"
          >
            <motion.div
              style={{
                width: dotSize,
                height: dotSize,
                borderRadius: '50%',
                backgroundColor: dotColor,
              }}
              animate={{
                opacity: [0.15, 0.6, 0.15],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: speed,
                delay: dot.delay % (speed * 2),
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <h3 className="text-white/80 text-2xl font-bold">Animated Grid</h3>
          <p className="text-white/40 text-sm mt-2">A pulsating dot matrix background</p>
        </div>
      </div>
    </div>
  )
}

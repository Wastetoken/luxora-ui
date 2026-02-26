'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoTextSplitHoverProps {
  text?: string
  splitOffset?: number
  color?: string
  className?: string
}

export default function OsmoTextSplitHover({
  text = 'SPLIT HOVER',
  splitOffset = 20,
  color = '#8b5cf6',
  className,
}: OsmoTextSplitHoverProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        'flex items-center justify-center py-20 cursor-pointer select-none',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <div className="flex text-6xl md:text-8xl font-black tracking-tighter">
          {text.split('').map((char, i) => {
            const isTopHalf = i % 2 === 0
            return (
              <motion.span
                key={i}
                className="inline-block relative"
                animate={{
                  y: isHovered ? (isTopHalf ? -splitOffset : splitOffset) : 0,
                  color: isHovered ? color : '#ffffff',
                  rotateZ: isHovered ? (isTopHalf ? -3 : 3) : 0,
                }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.03,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

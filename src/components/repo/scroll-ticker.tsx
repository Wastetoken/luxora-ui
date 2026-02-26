'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoScrollTickerProps {
  items?: string[]
  speed?: number
  direction?: 'left' | 'right'
  className?: string
}

export default function OsmoScrollTicker({
  items = [
    'Breaking News',
    'Product Launch',
    'New Feature Available',
    'Community Update',
    'Latest Release',
    'Important Announcement',
  ],
  speed = 300,
  direction = 'left',
  className,
}: OsmoScrollTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'left' ? [0, -speed] : [-speed, 0]
  )

  const separator = ' \u2022 '
  const repeatedItems = [...items, ...items, ...items]

  return (
    <div
      ref={containerRef}
      className={cn(
        'w-full overflow-hidden bg-neutral-950 py-5 border-y border-white/10',
        className
      )}
    >
      <motion.div style={{ x }} className="flex whitespace-nowrap">
        {repeatedItems.map((item, i) => (
          <span
            key={i}
            className="text-white/80 text-lg font-medium mx-0 flex-shrink-0"
          >
            {item}
            <span className="text-white/30 mx-4">{separator}</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

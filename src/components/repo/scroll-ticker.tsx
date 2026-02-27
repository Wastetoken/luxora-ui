'use client'

import React from 'react'
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
  speed = 30,
  direction = 'left',
  className,
}: OsmoScrollTickerProps) {
  const separator = ' \u2022 '
  const repeatedItems = [...items, ...items]

  const animationDirection = direction === 'left' ? 'normal' : 'reverse'

  return (
    <div
      className={cn(
        'w-full overflow-hidden bg-neutral-950 py-5 border-y border-white/10',
        className
      )}
    >
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: `ticker-scroll ${speed}s linear infinite`,
          animationDirection,
        }}
      >
        {repeatedItems.map((item, i) => (
          <span
            key={i}
            className="text-white/80 text-lg font-medium mx-0 flex-shrink-0"
          >
            {item}
            <span className="text-white/30 mx-4">{separator}</span>
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {repeatedItems.map((item, i) => (
          <span
            key={`dup-${i}`}
            className="text-white/80 text-lg font-medium mx-0 flex-shrink-0"
          >
            {item}
            <span className="text-white/30 mx-4">{separator}</span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

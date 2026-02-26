'use client'

import React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoInfiniteLogoSliderProps {
  logos?: { name: string; color?: string }[]
  speed?: number
  pauseOnHover?: boolean
  className?: string
}

const defaultLogos = [
  { name: 'Acme Corp', color: '#8b5cf6' },
  { name: 'Globex', color: '#06b6d4' },
  { name: 'Initech', color: '#f59e0b' },
  { name: 'Umbrella', color: '#ef4444' },
  { name: 'Hooli', color: '#22c55e' },
  { name: 'Stark', color: '#3b82f6' },
  { name: 'Wayne', color: '#a855f7' },
  { name: 'Oscorp', color: '#ec4899' },
]

export default function OsmoInfiniteLogoSlider({
  logos = defaultLogos,
  speed = 25,
  pauseOnHover = true,
  className,
}: OsmoInfiniteLogoSliderProps) {
  const doubled = [...logos, ...logos]

  return (
    <div className={cn('w-full overflow-hidden bg-neutral-950 py-10', pauseOnHover && 'group', className)}>
      <motion.div
        className={cn('flex gap-12 items-center w-max', pauseOnHover && 'group-hover:[animation-play-state:paused]')}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ x: { duration: speed, repeat: Infinity, ease: 'linear' } }}
      >
        {doubled.map((logo, i) => (
          <div key={i} className="flex items-center gap-3 px-6 py-3 rounded-lg border border-white/10 bg-white/5 flex-shrink-0">
            <div className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: logo.color || '#8b5cf6' }}>{logo.name.charAt(0)}</div>
            <span className="text-white/80 text-sm font-medium whitespace-nowrap">{logo.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

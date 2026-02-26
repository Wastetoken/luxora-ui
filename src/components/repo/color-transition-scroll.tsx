'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoColorTransitionScrollProps {
  colors?: string[]
  labels?: string[]
  className?: string
}

export default function OsmoColorTransitionScroll({
  colors = ['#0f172a', '#1e1b4b', '#4c1d95', '#7c3aed', '#2563eb', '#0891b2'],
  labels = ['Midnight', 'Deep Indigo', 'Royal Purple', 'Vivid Violet', 'Electric Blue', 'Cyan'],
  className,
}: OsmoColorTransitionScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  const backgroundColor = useTransform(
    scrollYProgress,
    colors.map((_, i) => i / (colors.length - 1)),
    colors
  )

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <motion.div
        style={{ backgroundColor }}
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
      >
        {colors.map((_, i) => {
          const start = i / colors.length
          const end = (i + 1) / colors.length
          return (
            <SectionLabel
              key={i}
              label={labels[i] || `Section ${i + 1}`}
              scrollYProgress={scrollYProgress}
              start={start}
              end={end}
            />
          )
        })}
      </motion.div>
      <div style={{ height: `${colors.length * 100}vh` }} />
    </div>
  )
}

function SectionLabel({
  label,
  scrollYProgress,
  start,
  end,
}: {
  label: string
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
  start: number
  end: number
}) {
  const mid = (start + end) / 2
  const opacity = useTransform(
    scrollYProgress,
    [start, mid - 0.02, mid, mid + 0.02, end],
    [0, 0, 1, 0, 0]
  )
  const y = useTransform(scrollYProgress, [start, mid, end], [30, 0, -30])

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute text-white text-5xl font-bold tracking-tight"
    >
      {label}
    </motion.div>
  )
}

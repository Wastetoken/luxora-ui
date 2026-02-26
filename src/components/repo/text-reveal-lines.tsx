'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoTextRevealLinesProps {
  lines?: string[]
  staggerDelay?: number
  className?: string
}

const defaultLines = [
  'We craft digital experiences',
  'that push boundaries and',
  'redefine what is possible',
  'in modern web design.',
]

export default function OsmoTextRevealLines({
  lines = defaultLines,
  staggerDelay = 0.08,
  className,
}: OsmoTextRevealLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'start 0.2'],
  })

  return (
    <div ref={containerRef} className={cn('py-32 px-8', className)}>
      <div className="max-w-4xl mx-auto">
        {lines.map((line, i) => (
          <RevealLine
            key={i}
            line={line}
            index={i}
            total={lines.length}
            scrollYProgress={scrollYProgress}
            staggerDelay={staggerDelay}
          />
        ))}
      </div>
    </div>
  )
}

function RevealLine({
  line,
  index,
  total,
  scrollYProgress,
  staggerDelay,
}: {
  line: string
  index: number
  total: number
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
  staggerDelay: number
}) {
  const start = (index / total) * 0.7
  const end = start + 0.3

  const y = useTransform(scrollYProgress, [start, end], [40, 0])
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1])
  const clipPath = useTransform(
    scrollYProgress,
    [start, end],
    ['inset(0 0 100% 0)', 'inset(0 0 0% 0)']
  )

  return (
    <div className="overflow-hidden">
      <motion.p
        style={{ y, opacity, clipPath }}
        className="text-white text-3xl md:text-5xl font-bold leading-tight"
      >
        {line}
      </motion.p>
    </div>
  )
}

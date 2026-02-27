'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoTextBlurRevealProps {
  text?: string
  className?: string
}

export default function OsmoTextBlurReveal({
  text = 'Design is not just what it looks like and feels like. Design is how it works. Great design emerges from the intersection of clarity and purpose.',
  className,
}: OsmoTextBlurRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const words = text.split(' ')

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Pre-spacer */}
      <div className="h-[40vh] flex items-center justify-center">
        <p className="text-white/30 text-sm">↓ Scroll to reveal ↓</p>
      </div>

      <div className="py-40 px-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-3xl md:text-5xl font-bold leading-tight text-white/90 flex flex-wrap gap-x-3 gap-y-2">
            {words.map((word, i) => (
              <BlurWord
                key={i}
                word={word}
                index={i}
                total={words.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </p>
        </div>
      </div>

      {/* Post-spacer */}
      <div className="h-[40vh]" />
    </div>
  )
}

interface BlurWordProps {
  word: string
  index: number
  total: number
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
}

const BlurWord = React.forwardRef<HTMLSpanElement, BlurWordProps>(function BlurWord(
  { word, index, total, scrollYProgress },
  ref
) {
  const start = (index / total) * 0.6
  const end = start + 0.4

  const blur = useTransform(scrollYProgress, [start, end], [10, 0])
  const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1])
  const filter = useTransform(blur, (v) => `blur(${v}px)`)

  return (
    <motion.span
      ref={ref}
      style={{ filter, opacity }}
      className="inline-block"
    >
      {word}
    </motion.span>
  )
})

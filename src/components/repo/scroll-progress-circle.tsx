'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoScrollProgressCircleProps {
  size?: number
  strokeWidth?: number
  color?: string
  trackColor?: string
  showPercentage?: boolean
  className?: string
}

export default function OsmoScrollProgressCircle({
  size = 80,
  strokeWidth = 4,
  color = '#8b5cf6',
  trackColor = '#ffffff15',
  showPercentage = true,
  className,
}: OsmoScrollProgressCircleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = useTransform(
    scrollYProgress,
    [0, 1],
    [circumference, 0]
  )

  const percentage = useTransform(scrollYProgress, [0, 1], [0, 100])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Fixed progress indicator */}
      <div className="sticky top-6 z-50 flex justify-end pr-6 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="relative"
          style={{ width: size, height: size }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={trackColor}
              strokeWidth={strokeWidth}
            />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              style={{ strokeDashoffset }}
            />
          </svg>
          {showPercentage && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ color }}
            >
              <motion.span className="text-xs font-bold tabular-nums">
                <PercentageDisplay progress={percentage} />
              </motion.span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Scrollable content */}
      <div className="px-8 py-12 space-y-8 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-white">Scroll Progress</h2>
        <p className="text-white/60">Scroll down to see the progress circle fill up.</p>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-40 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="text-white/30 text-sm">Section {i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PercentageDisplay({
  progress,
}: {
  progress: ReturnType<typeof useTransform<number, number>>
}) {
  const rounded = useTransform(progress, (v: number) => `${Math.round(v)}%`)
  return <motion.span>{rounded}</motion.span>
}

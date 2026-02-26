'use client'

import React from 'react'
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
  const { scrollYProgress } = useScroll()

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = useTransform(
    scrollYProgress,
    [0, 1],
    [circumference, 0]
  )

  const percentage = useTransform(scrollYProgress, [0, 1], [0, 100])

  return (
    <div className={cn('fixed bottom-6 right-6 z-50', className)}>
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
              {/* Use a simple integer display */}
              <PercentageDisplay progress={percentage} />
            </motion.span>
          </div>
        )}
      </motion.div>
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

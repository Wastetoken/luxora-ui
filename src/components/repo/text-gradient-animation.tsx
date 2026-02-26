'use client'

import React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoTextGradientAnimationProps {
  text?: string
  colors?: string[]
  speed?: number
  className?: string
}

export default function OsmoTextGradientAnimation({
  text = 'Gradient Text',
  colors = ['#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6'],
  speed = 4,
  className,
}: OsmoTextGradientAnimationProps) {
  const gradient = `linear-gradient(90deg, ${colors.join(', ')})`

  return (
    <div className={cn('flex items-center justify-center py-20 px-8', className)}>
      <motion.h1
        className="text-5xl md:text-8xl font-black tracking-tight"
        style={{
          backgroundImage: gradient,
          backgroundSize: `${colors.length * 100}% 100%`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
        animate={{
          backgroundPosition: ['0% center', '-200% center'],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {text}
      </motion.h1>
    </div>
  )
}

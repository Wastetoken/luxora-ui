'use client'

import React from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoScrollMorphHeaderProps {
  title?: string
  bgColor?: string
  accentColor?: string
  className?: string
}

export default function OsmoScrollMorphHeader({
  title = 'Morphing Header',
  bgColor = '#0f172a',
  accentColor = '#8b5cf6',
  className,
}: OsmoScrollMorphHeaderProps) {
  const { scrollY } = useScroll()

  const headerHeight = useTransform(scrollY, [0, 200], [120, 60])
  const titleSize = useTransform(scrollY, [0, 200], [2.5, 1.2])
  const bgOpacity = useTransform(scrollY, [0, 150], [0, 0.95])
  const borderOpacity = useTransform(scrollY, [100, 200], [0, 0.2])
  const padding = useTransform(scrollY, [0, 200], [32, 16])

  return (
    <div className={cn('relative', className)}>
      <motion.header
        style={{
          height: headerHeight,
          paddingLeft: padding,
          paddingRight: padding,
        }}
        className="sticky top-0 z-50 w-full flex items-center justify-between"
      >
        <motion.div
          style={{ opacity: bgOpacity }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 backdrop-blur-xl"
            style={{ backgroundColor: bgColor }}
          />
        </motion.div>

        <motion.div
          style={{ opacity: borderOpacity }}
          className="absolute bottom-0 left-0 right-0 h-px bg-white/20"
        />

        <motion.h1
          style={{ fontSize: titleSize }}
          className="relative text-white font-bold tracking-tight"
        >
          {title}
        </motion.h1>

        <div className="relative flex items-center gap-4">
          <motion.div
            style={{
              backgroundColor: accentColor,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 rounded-full text-white text-sm font-medium cursor-pointer"
          >
            Get Started
          </motion.div>
        </div>
      </motion.header>

      <div className="px-8 py-20 space-y-8">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-white/5 border border-white/10" />
        ))}
      </div>
    </div>
  )
}

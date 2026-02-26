'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoGridHoverEffectProps {
  items?: { title: string; description: string; icon: string }[]
  columns?: number
  className?: string
}

const defaultItems = [
  { title: 'Analytics', description: 'Real-time data insights', icon: '📊' },
  { title: 'Security', description: 'Enterprise-grade protection', icon: '🔒' },
  { title: 'Speed', description: 'Lightning-fast performance', icon: '⚡' },
  { title: 'Scale', description: 'Grow without limits', icon: '🚀' },
  { title: 'Support', description: '24/7 dedicated team', icon: '💬' },
  { title: 'Integration', description: 'Connect everything', icon: '🔗' },
]

export default function OsmoGridHoverEffect({
  items = defaultItems,
  columns = 3,
  className,
}: OsmoGridHoverEffectProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div
      className={cn('w-full px-6 py-12', className)}
      style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '1px' }}
    >
      {items.map((item, i) => (
        <motion.div key={i} className="relative p-8 cursor-pointer overflow-hidden" onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
          <motion.div className="absolute inset-0 bg-white/5" animate={{ opacity: hoveredIndex === i ? 1 : 0, scale: hoveredIndex === i ? 1 : 0.95 }} transition={{ duration: 0.3 }} />
          <motion.div className="absolute inset-0 border border-white/10" animate={{ borderColor: hoveredIndex === i ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.1)' }} transition={{ duration: 0.3 }} />
          <div className="relative z-10">
            <motion.div className="text-3xl mb-4" animate={{ scale: hoveredIndex === i ? 1.2 : 1, y: hoveredIndex === i ? -4 : 0 }} transition={{ duration: 0.3 }}>{item.icon}</motion.div>
            <motion.h3 className="text-white font-semibold text-lg mb-2" animate={{ color: hoveredIndex === i ? '#c4b5fd' : '#ffffff' }} transition={{ duration: 0.3 }}>{item.title}</motion.h3>
            <motion.p className="text-sm" animate={{ color: hoveredIndex === i ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)' }} transition={{ duration: 0.3 }}>{item.description}</motion.p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

'use client'

import React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoHoverLiftCardProps {
  cards?: { title: string; description: string; tag: string; color: string }[]
  liftAmount?: number
  className?: string
}

const defaultCards = [
  { title: 'Starter Plan', description: 'Perfect for individuals and small projects getting started.', tag: '$9/mo', color: '#3b82f6' },
  { title: 'Pro Plan', description: 'For growing teams that need more power and flexibility.', tag: '$29/mo', color: '#8b5cf6' },
  { title: 'Enterprise', description: 'Custom solutions for large organizations at any scale.', tag: 'Custom', color: '#f59e0b' },
]

export default function OsmoHoverLiftCard({
  cards = defaultCards,
  liftAmount = 12,
  className,
}: OsmoHoverLiftCardProps) {
  return (
    <div className={cn('flex flex-wrap gap-6 justify-center p-12', className)}>
      {cards.map((card, i) => (
        <motion.div
          key={i}
          className="relative w-72 rounded-2xl border border-white/10 bg-neutral-900 p-6 cursor-pointer overflow-hidden"
          whileHover={{ y: -liftAmount, boxShadow: `0 20px 40px -12px ${card.color}33`, borderColor: `${card.color}44` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <motion.div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: card.color }} initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.4 }} />
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 text-white" style={{ backgroundColor: `${card.color}22`, color: card.color }}>{card.tag}</div>
          <h3 className="text-white text-xl font-bold mb-2">{card.title}</h3>
          <p className="text-white/50 text-sm leading-relaxed mb-6">{card.description}</p>
          <motion.button className="w-full py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: card.color }} whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.97 }}>Get Started</motion.button>
        </motion.div>
      ))}
    </div>
  )
}

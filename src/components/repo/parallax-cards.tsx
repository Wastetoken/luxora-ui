'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoParallaxCardsProps {
  cards?: { title: string; description: string; color: string }[]
  className?: string
}

const defaultCards = [
  { title: 'Design', description: 'Create beautiful interfaces with intuitive design tools', color: '#8b5cf6' },
  { title: 'Develop', description: 'Build robust applications with modern frameworks', color: '#06b6d4' },
  { title: 'Deploy', description: 'Ship to production with confidence and speed', color: '#f59e0b' },
  { title: 'Scale', description: 'Grow your infrastructure to meet demand seamlessly', color: '#ef4444' },
]

export default function OsmoParallaxCards({
  cards = defaultCards,
  className,
}: OsmoParallaxCardsProps) {
  return (
    <div className={cn('w-full py-20 px-6', className)}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {cards.map((card, i) => (
          <ParallaxCard key={i} card={card} index={i} />
        ))}
      </div>
    </div>
  )
}

function ParallaxCard({
  card,
  index,
}: {
  card: { title: string; description: string; color: string }
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50 * (index % 2 === 0 ? 1 : -1), -50 * (index % 2 === 0 ? 1 : -1)])
  const rotate = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? 2 : -2, index % 2 === 0 ? -2 : 2])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])

  return (
    <motion.div
      ref={ref}
      style={{ y, rotate, scale }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 p-8"
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-20"
        style={{ backgroundColor: card.color }}
      />
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold mb-6"
        style={{ backgroundColor: card.color }}
      >
        {index + 1}
      </div>
      <h3 className="text-white text-2xl font-bold mb-3">{card.title}</h3>
      <p className="text-white/60 text-sm leading-relaxed">{card.description}</p>
    </motion.div>
  )
}

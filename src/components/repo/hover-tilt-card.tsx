'use client'

import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoHoverTiltCardProps {
  title?: string
  description?: string
  glareColor?: string
  maxTilt?: number
  className?: string
}

export default function OsmoHoverTiltCard({
  title = '3D Tilt Card',
  description = 'Hover over this card to see it tilt in 3D space. The card follows your cursor with a realistic perspective effect.',
  glareColor = '#ffffff',
  maxTilt = 15,
  className,
}: OsmoHoverTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [maxTilt, -maxTilt]), { damping: 20, stiffness: 300 })
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-maxTilt, maxTilt]), { damping: 20, stiffness: 300 })

  const glareX = useTransform(mouseX, [0, 1], [0, 100])
  const glareY = useTransform(mouseY, [0, 1], [0, 100])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  return (
    <div className={cn('flex items-center justify-center p-12', className)} style={{ perspective: 1000 }}>
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative w-80 h-96 rounded-2xl border border-white/10 bg-neutral-900 p-8 cursor-pointer overflow-hidden"
      >
        <motion.div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at ${glareX}% ${glareY}%, ${glareColor}15 0%, transparent 50%)` }} animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.3 }} />
        <div style={{ transform: 'translateZ(40px)' }}>
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
          </div>
          <h3 className="text-white text-xl font-bold mb-3">{title}</h3>
          <p className="text-white/50 text-sm leading-relaxed">{description}</p>
        </div>
        <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600" animate={{ scaleX: isHovered ? 1 : 0 }} transition={{ duration: 0.4 }} style={{ transformOrigin: 'left' }} />
      </motion.div>
    </div>
  )
}

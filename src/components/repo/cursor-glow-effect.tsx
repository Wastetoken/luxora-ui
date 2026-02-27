'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoCursorGlowEffectProps {
  color?: string
  size?: number
  intensity?: number
  className?: string
}

export default function OsmoCursorGlowEffect({
  color = '#06b6d4',
  size = 400,
  intensity = 0.15,
  className,
}: OsmoCursorGlowEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { damping: 25, stiffness: 200 })
  const springY = useSpring(mouseY, { damping: 25, stiffness: 200 })

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${springX}px ${springY}px, ${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')}, transparent 80%)`

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    }

    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative w-full h-[400px] overflow-hidden bg-neutral-950 rounded-xl',
        className
      )}
    >
      {/* Card grid to demonstrate the glow on surfaces */}
      <div className="absolute inset-0 grid grid-cols-3 gap-4 p-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            className="relative rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
            style={{ background: isHovered ? background : undefined }}
          >
            <div className="relative z-10 p-4 h-full flex flex-col justify-end">
              <div className="h-3 w-16 rounded bg-white/10 mb-2" />
              <div className="h-2 w-24 rounded bg-white/5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Global glow overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: isHovered ? background : undefined }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center space-y-2 bg-neutral-950/60 px-6 py-4 rounded-xl backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white/90">Cursor Glow</h3>
          <p className="text-white/40 text-sm">Cards illuminate as your cursor passes over</p>
        </div>
      </div>
    </div>
  )
}

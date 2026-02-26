'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoCursorGlowEffectProps {
  color?: string
  size?: number
  intensity?: number
  className?: string
}

export default function OsmoCursorGlowEffect({
  color = '#06b6d4',
  size = 300,
  intensity = 0.6,
  className,
}: OsmoCursorGlowEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { damping: 25, stiffness: 200 })
  const springY = useSpring(mouseY, { damping: 25, stiffness: 200 })

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
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          x: springX,
          y: springY,
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          background: `radial-gradient(circle, ${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          borderRadius: '50%',
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-white/90">Glow Effect</h3>
          <p className="text-white/50 text-sm max-w-xs">
            Move your cursor to see the glow follow
          </p>
        </div>
      </div>
    </div>
  )
}

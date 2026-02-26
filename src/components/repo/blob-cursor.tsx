'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoBlobCursorProps {
  color?: string
  size?: number
  className?: string
}

export default function OsmoBlobCursor({
  color = '#8b5cf6',
  size = 200,
  className,
}: OsmoBlobCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInside, setIsInside] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { damping: 20, stiffness: 150, mass: 0.5 })
  const springY = useSpring(mouseY, { damping: 20, stiffness: 150, mass: 0.5 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left - size / 2)
      mouseY.set(e.clientY - rect.top - size / 2)
    }

    const handleMouseEnter = () => setIsInside(true)
    const handleMouseLeave = () => setIsInside(false)

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [mouseX, mouseY, size])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full h-[400px] overflow-hidden cursor-none bg-neutral-950 rounded-xl',
        className
      )}
    >
      <motion.div
        style={{
          x: springX,
          y: springY,
          width: size,
          height: size,
          background: `radial-gradient(circle, ${color} 0%, ${color}88 40%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(20px)',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
        animate={{ scale: isInside ? 1 : 0, opacity: isInside ? 0.8 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p className="text-white/60 text-lg font-medium">Move your cursor</p>
      </div>
    </div>
  )
}

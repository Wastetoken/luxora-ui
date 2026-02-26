'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoCursorSpotlightProps {
  size?: number
  borderColor?: string
  content?: string
  className?: string
}

export default function OsmoCursorSpotlight({
  size = 250,
  borderColor = '#f59e0b',
  content = 'Hidden content revealed by spotlight. Move your cursor to explore the darkness.',
  className,
}: OsmoCursorSpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { damping: 30, stiffness: 250 })
  const springY = useSpring(mouseY, { damping: 30, stiffness: 250 })

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
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      className={cn(
        'relative w-full h-[400px] overflow-hidden bg-neutral-950 rounded-xl cursor-none',
        className
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <p className="text-white/80 text-xl font-medium text-center leading-relaxed max-w-lg">
          {content}
        </p>
      </div>

      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'rgba(0,0,0,0.95)',
          maskImage: `radial-gradient(circle ${size / 2}px at var(--mx) var(--my), transparent 0%, black 100%)`,
          WebkitMaskImage: `radial-gradient(circle ${size / 2}px at var(--mx) var(--my), transparent 0%, black 100%)`,
        }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {isActive && (
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
            borderRadius: '50%',
            border: `1px solid ${borderColor}33`,
            boxShadow: `0 0 60px ${borderColor}22, inset 0 0 60px ${borderColor}11`,
            pointerEvents: 'none',
          }}
        />
      )}

      {!isActive && (
        <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center">
          <p className="text-white/40 text-lg">Hover to reveal</p>
        </div>
      )}
    </div>
  )
}

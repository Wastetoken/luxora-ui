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
  size = 60,
  className,
}: OsmoBlobCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInside, setIsInside] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { damping: 15, stiffness: 150, mass: 0.5 })
  const springY = useSpring(mouseY, { damping: 15, stiffness: 150, mass: 0.5 })

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
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => { setIsInside(false); setIsPressed(false) }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={cn(
        'relative w-full h-[400px] overflow-hidden cursor-none bg-neutral-950 rounded-xl',
        className
      )}
    >
      {/* Blob body - organic shape that morphs */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 10,
        }}
        animate={{
          scale: isPressed ? 1.8 : isInside ? 1 : 0,
          opacity: isInside ? 1 : 0,
          borderRadius: isPressed ? '40% 60% 55% 45% / 55% 40% 60% 45%' : '50%',
        }}
        transition={{
          scale: { type: 'spring', damping: 12, stiffness: 200 },
          borderRadius: { duration: 0.3 },
          opacity: { duration: 0.2 },
        }}
      >
        <div
          className="w-full h-full"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${color}, ${color}99)`,
            borderRadius: 'inherit',
            boxShadow: `0 0 40px ${color}66, 0 0 80px ${color}33`,
          }}
        />
      </motion.div>

      {/* Trail blobs */}
      {[0.7, 0.45, 0.25].map((scale, i) => {
        const trailSize = size * scale
        return (
          <motion.div
            key={i}
            style={{
              x: springX,
              y: springY,
              width: trailSize,
              height: trailSize,
              marginLeft: -trailSize / 2,
              marginTop: -trailSize / 2,
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              background: color,
              borderRadius: '50%',
              opacity: isInside ? 0.3 - i * 0.08 : 0,
              filter: `blur(${8 + i * 6}px)`,
            }}
            transition={{
              x: { damping: 12 - i * 2, stiffness: 120 - i * 20, mass: 0.5 + i * 0.3 },
              y: { damping: 12 - i * 2, stiffness: 120 - i * 20, mass: 0.5 + i * 0.3 },
            }}
          />
        )
      })}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center space-y-2">
          <p className="text-white/60 text-lg font-medium">Move & click</p>
          <p className="text-white/30 text-sm">Blob follows your cursor</p>
        </div>
      </div>
    </div>
  )
}

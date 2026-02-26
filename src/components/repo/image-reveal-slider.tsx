'use client'

import React, { useState, useRef, useCallback } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoImageRevealSliderProps {
  beforeImage?: string
  afterImage?: string
  height?: number
  className?: string
}

export default function OsmoImageRevealSlider({
  beforeImage = 'https://picsum.photos/seed/reveal-before/800/500?grayscale',
  afterImage = 'https://picsum.photos/seed/reveal-after/800/500',
  height = 400,
  className,
}: OsmoImageRevealSliderProps) {
  const [sliderPos, setSliderPos] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPos(percentage)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => { if (!isDragging) return; updatePosition(e.clientX) }, [isDragging, updatePosition])
  const handleTouchMove = useCallback((e: React.TouchEvent) => { if (!isDragging) return; updatePosition(e.touches[0].clientX) }, [isDragging, updatePosition])

  return (
    <div ref={containerRef} className={cn('relative w-full overflow-hidden rounded-xl select-none', className)} style={{ height }} onMouseMove={handleMouseMove} onMouseUp={() => setIsDragging(false)} onMouseLeave={() => setIsDragging(false)} onTouchMove={handleTouchMove} onTouchEnd={() => setIsDragging(false)}>
      <img src={afterImage} alt="After" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      <motion.div className="absolute inset-0 overflow-hidden" animate={{ width: `${sliderPos}%` }} transition={{ duration: isDragging ? 0 : 0.1, ease: 'linear' }}>
        <img src={beforeImage} alt="Before" className="absolute inset-0 w-full h-full object-cover" style={{ width: containerRef.current?.offsetWidth || '100%' }} draggable={false} />
      </motion.div>
      <motion.div className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10" animate={{ left: `${sliderPos}%` }} transition={{ duration: isDragging ? 0 : 0.1, ease: 'linear' }} style={{ marginLeft: -1 }} onMouseDown={() => setIsDragging(true)} onTouchStart={() => setIsDragging(true)}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4L3 10L7 16" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M13 4L17 10L13 16" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </motion.div>
      <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">Before</div>
      <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">After</div>
    </div>
  )
}

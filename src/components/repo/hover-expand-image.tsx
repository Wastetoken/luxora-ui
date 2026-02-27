'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoHoverExpandImageProps {
  images?: { src: string; alt: string; title: string }[]
  height?: number
  className?: string
}

const defaultImages = [
  { src: 'https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/AlmostCentralPurple.png', alt: 'Image 1', title: 'Purple' },
  { src: 'https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueAndBlack.png', alt: 'Image 2', title: 'Blue & Black' },
  { src: 'https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueAndRed.png', alt: 'Image 3', title: 'Blue & Red' },
  { src: 'https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueHalfDome.png', alt: 'Image 4', title: 'Half Dome' },
  { src: 'https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueLiquidFlow.png', alt: 'Image 5', title: 'Liquid Flow' },
]

export default function OsmoHoverExpandImage({
  images = defaultImages,
  height = 500,
  className,
}: OsmoHoverExpandImageProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={cn('flex w-full gap-1 overflow-hidden rounded-xl', className)} style={{ height }}>
      {images.map((image, i) => (
        <motion.div
          key={i}
          className="relative overflow-hidden cursor-pointer"
          animate={{ flex: hoveredIndex === i ? 4 : hoveredIndex === null ? 1 : 0.5 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <motion.img src={image.src} alt={image.alt} className="absolute inset-0 w-full h-full object-cover" animate={{ scale: hoveredIndex === i ? 1.05 : 1 }} transition={{ duration: 0.5 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <AnimatePresence>
            {hoveredIndex === i && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }} className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white text-2xl font-bold">{image.title}</h3>
              </motion.div>
            )}
          </AnimatePresence>
          {hoveredIndex !== i && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <span className="text-white/70 text-sm font-medium" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>{image.title}</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

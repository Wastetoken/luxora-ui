'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoHoverZoomGalleryProps {
  images?: { src: string; alt: string; title: string }[]
  zoomScale?: number
  className?: string
}

const defaultImages = [
  { src: 'https://picsum.photos/seed/zoom1/600/400', alt: 'Image 1', title: 'Aurora Borealis' },
  { src: 'https://picsum.photos/seed/zoom2/600/400', alt: 'Image 2', title: 'Coastal Cliffs' },
  { src: 'https://picsum.photos/seed/zoom3/600/400', alt: 'Image 3', title: 'Cherry Blossom' },
  { src: 'https://picsum.photos/seed/zoom4/600/400', alt: 'Image 4', title: 'Starry Night' },
  { src: 'https://picsum.photos/seed/zoom5/600/400', alt: 'Image 5', title: 'Autumn Forest' },
  { src: 'https://picsum.photos/seed/zoom6/600/400', alt: 'Image 6', title: 'Glacier Lake' },
]

export default function OsmoHoverZoomGallery({
  images = defaultImages,
  zoomScale = 1.15,
  className,
}: OsmoHoverZoomGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-4 p-6 max-w-5xl mx-auto', className)}>
      {images.map((image, i) => (
        <motion.div key={i} className="relative overflow-hidden rounded-xl cursor-pointer group" style={{ aspectRatio: '3/2' }} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)} animate={{ opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.5 : 1 }} transition={{ duration: 0.3 }}>
          <motion.img src={image.src} alt={image.alt} className="w-full h-full object-cover" animate={{ scale: hoveredIndex === i ? zoomScale : 1 }} transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <motion.div className="absolute bottom-0 left-0 right-0 p-4" animate={{ y: hoveredIndex === i ? 0 : 10, opacity: hoveredIndex === i ? 1 : 0.7 }} transition={{ duration: 0.3 }}>
            <h4 className="text-white text-sm font-semibold">{image.title}</h4>
          </motion.div>
          <motion.div className="absolute inset-0 border-2 border-transparent rounded-xl" animate={{ borderColor: hoveredIndex === i ? 'rgba(139, 92, 246, 0.5)' : 'transparent' }} transition={{ duration: 0.3 }} />
        </motion.div>
      ))}
    </div>
  )
}

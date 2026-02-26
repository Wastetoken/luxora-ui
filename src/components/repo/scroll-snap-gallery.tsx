'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoScrollSnapGalleryProps {
  images?: { src: string; alt: string; caption?: string }[]
  className?: string
}

const defaultImages = [
  { src: 'https://picsum.photos/seed/snap1/1200/800', alt: 'Gallery image 1', caption: 'Mountain Vista' },
  { src: 'https://picsum.photos/seed/snap2/1200/800', alt: 'Gallery image 2', caption: 'Ocean Sunset' },
  { src: 'https://picsum.photos/seed/snap3/1200/800', alt: 'Gallery image 3', caption: 'Forest Path' },
  { src: 'https://picsum.photos/seed/snap4/1200/800', alt: 'Gallery image 4', caption: 'Desert Dunes' },
  { src: 'https://picsum.photos/seed/snap5/1200/800', alt: 'Gallery image 5', caption: 'City Lights' },
]

export default function OsmoScrollSnapGallery({
  images = defaultImages,
  className,
}: OsmoScrollSnapGalleryProps) {
  return (
    <div
      className={cn(
        'w-full h-[500px] overflow-y-auto snap-y snap-mandatory rounded-xl',
        className
      )}
      style={{ scrollbarWidth: 'none' }}
    >
      {images.map((image, i) => (
        <GallerySlide key={i} image={image} index={i} />
      ))}
    </div>
  )
}

function GallerySlide({
  image,
  index,
}: {
  image: { src: string; alt: string; caption?: string }
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { amount: 0.5 })

  return (
    <div
      ref={ref}
      className="snap-start h-[500px] w-full relative flex-shrink-0 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        animate={{ scale: isInView ? 1 : 1.1, opacity: isInView ? 1 : 0.6 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <img
          src={image.src}
          alt={image.alt}
          className="w-full h-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <motion.div
        className="absolute bottom-8 left-8 right-8"
        animate={{ y: isInView ? 0 : 20, opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span className="text-white/50 text-sm font-mono">{String(index + 1).padStart(2, '0')}</span>
        {image.caption && (
          <h3 className="text-white text-3xl font-bold mt-1">{image.caption}</h3>
        )}
      </motion.div>
    </div>
  )
}

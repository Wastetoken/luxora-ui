'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoScrollFadeGalleryProps {
  images?: { src: string; alt: string }[]
  className?: string
}

const defaultImages = [
  { src: 'https://picsum.photos/seed/fade1/600/400', alt: 'Gallery image 1' },
  { src: 'https://picsum.photos/seed/fade2/600/400', alt: 'Gallery image 2' },
  { src: 'https://picsum.photos/seed/fade3/600/400', alt: 'Gallery image 3' },
  { src: 'https://picsum.photos/seed/fade4/600/400', alt: 'Gallery image 4' },
  { src: 'https://picsum.photos/seed/fade5/600/400', alt: 'Gallery image 5' },
  { src: 'https://picsum.photos/seed/fade6/600/400', alt: 'Gallery image 6' },
]

export default function OsmoScrollFadeGallery({
  images = defaultImages,
  className,
}: OsmoScrollFadeGalleryProps) {
  return (
    <div className={cn('w-full py-20', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 max-w-6xl mx-auto">
        {images.map((image, i) => (
          <FadeInImage key={i} image={image} index={i} />
        ))}
      </div>
    </div>
  )
}

function FadeInImage({
  image,
  index,
}: {
  image: { src: string; alt: string }
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const y = useTransform(scrollYProgress, [0, 1], [60, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1])

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, scale }}
      className="overflow-hidden rounded-xl"
    >
      <img
        src={image.src}
        alt={image.alt}
        className="w-full h-64 object-cover"
        loading="lazy"
      />
    </motion.div>
  )
}

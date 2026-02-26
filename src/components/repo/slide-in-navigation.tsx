'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

export interface OsmoSlideInNavigationProps {
  items?: { label: string; href: string }[]
  bgColor?: string
  accentColor?: string
  direction?: 'left' | 'right'
  className?: string
}

const defaultItems = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Work', href: '#' },
  { label: 'Services', href: '#' },
  { label: 'Contact', href: '#' },
]

export default function OsmoSlideInNavigation({
  items = defaultItems,
  bgColor = '#0a0a0a',
  accentColor = '#8b5cf6',
  direction = 'right',
  className,
}: OsmoSlideInNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const slideDirection = direction === 'right' ? '100%' : '-100%'

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 flex flex-col gap-1.5 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
        aria-label="Toggle navigation"
      >
        <motion.span
          className="block w-6 h-0.5 bg-white"
          animate={{
            rotateZ: isOpen ? 45 : 0,
            y: isOpen ? 4 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="block w-6 h-0.5 bg-white"
          animate={{ opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="block w-6 h-0.5 bg-white"
          animate={{
            rotateZ: isOpen ? -45 : 0,
            y: isOpen ? -4 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.nav
              initial={{ x: slideDirection }}
              animate={{ x: 0 }}
              exit={{ x: slideDirection }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed top-0 bottom-0 z-40 w-80 flex flex-col justify-center px-12"
              style={{
                backgroundColor: bgColor,
                [direction]: 0,
              }}
            >
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ x: direction === 'right' ? 40 : -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: direction === 'right' ? 40 : -40, opacity: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    <a
                      href={item.href}
                      className="block text-3xl font-bold text-white/80 py-3 transition-colors hover:text-white"
                      style={{ '--accent': accentColor } as React.CSSProperties}
                      onMouseEnter={(e) => (e.currentTarget.style.color = accentColor)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

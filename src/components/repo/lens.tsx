"use client"

import React, { useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

interface LensProps {
  children: React.ReactNode; zoomFactor?: number; lensSize?: number; position?: { x: number; y: number }; isStatic?: boolean; hovering?: boolean; setHovering?: (hovering: boolean) => void
}

export const Lens: React.FC<LensProps> = ({ children, zoomFactor = 1.5, lensSize = 170, isStatic = false, position = { x: 200, y: 150 }, hovering, setHovering }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [localIsHovering, setLocalIsHovering] = useState(false)
  const isHovering = hovering !== undefined ? hovering : localIsHovering
  const setIsHovering = setHovering || setLocalIsHovering
  const [mousePosition, setMousePosition] = useState({ x: 100, y: 100 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-lg z-20" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} onMouseMove={handleMouseMove}>
      {children}
      {isStatic ? (
        <motion.div initial={{ opacity: 0, scale: 0.58 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3, ease: "easeOut" }} className="absolute inset-0 overflow-hidden" style={{ maskImage: `radial-gradient(circle ${lensSize / 2}px at ${position.x}px ${position.y}px, black 100%, transparent 100%)`, WebkitMaskImage: `radial-gradient(circle ${lensSize / 2}px at ${position.x}px ${position.y}px, black 100%, transparent 100%)`, transformOrigin: `${position.x}px ${position.y}px` }}>
          <div className="absolute inset-0" style={{ transform: `scale(${zoomFactor})`, transformOrigin: `${position.x}px ${position.y}px` }}>{children}</div>
        </motion.div>
      ) : (
        <AnimatePresence>
          {isHovering && (
            <motion.div initial={{ opacity: 0, scale: 0.58 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3, ease: "easeOut" }} className="absolute inset-0 overflow-hidden" style={{ maskImage: `radial-gradient(circle ${lensSize / 2}px at ${mousePosition.x}px ${mousePosition.y}px, black 100%, transparent 100%)`, WebkitMaskImage: `radial-gradient(circle ${lensSize / 2}px at ${mousePosition.x}px ${mousePosition.y}px, black 100%, transparent 100%)`, transformOrigin: `${mousePosition.x}px ${mousePosition.y}px`, zIndex: 50 }}>
              <div className="absolute inset-0" style={{ transform: `scale(${zoomFactor})`, transformOrigin: `${mousePosition.x}px ${mousePosition.y}px` }}>{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

export interface AceternityLensProps { zoomFactor?: number; className?: string }

export default function AceternityLensWrapper({ zoomFactor = 1.5, className }: AceternityLensProps) {
  return (
    <div className={`flex items-center justify-center ${className || ""}`}>
      <Lens zoomFactor={zoomFactor}>
        <img src="https://images.unsplash.com/photo-1713869791518-a770879e60dc?w=800" alt="lens demo" className="rounded-lg w-full max-w-md" />
      </Lens>
    </div>
  )
}

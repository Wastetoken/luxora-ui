"use client"

import React, { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AuroraBackgroundLibProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode
  showRadialGradient?: boolean
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundLibProps) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col h-[100vh] items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-slate-950 transition-bg",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={cn(
              `[--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)]
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%]
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-50 will-change-transform`,
              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
            )}
          ></div>
        </div>
        {children}
      </div>
    </main>
  )
}

export interface AceternityAuroraBackgroundProps {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  showRadial?: boolean
  className?: string
}

export default function AceternityAuroraBackgroundWrapper({
  title = "Background lights are cool, you know.",
  subtitle = "A subtle yet beautiful aurora effect for your hero sections.",
  ctaText = "Debug Now",
  ctaLink = "#",
  showRadial = true,
  className,
}: AceternityAuroraBackgroundProps) {
  return (
    <AuroraBackground showRadialGradient={showRadial} className={className}>
      <div className="relative flex flex-col gap-4 items-center justify-center px-4">
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          {title}
        </div>
        {subtitle && (
          <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
            {subtitle}
          </div>
        )}
        {ctaText && (
          <a
            href={ctaLink}
            className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2"
          >
            {ctaText}
          </a>
        )}
      </div>
    </AuroraBackground>
  )
}

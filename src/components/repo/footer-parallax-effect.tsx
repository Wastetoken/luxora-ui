"use client"

import React, { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export interface FooterLink {
  label: string
  href: string
}

export interface OsmoFooterParallaxEffectProps {
  title?: string
  subtitle?: string
  links?: FooterLink[]
  bgColor?: string
  className?: string
}

const defaultLinks: FooterLink[] = [
  { label: "Twitter", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Dribbble", href: "#" },
]

export default function OsmoFooterParallaxEffect({
  title = "Let's Work Together",
  subtitle = "Ready to start your next project?",
  links = defaultLinks,
  bgColor = "#0a0a0a",
  className,
}: OsmoFooterParallaxEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const container = containerRef.current!
      const hero = container.querySelector(".fp-hero") as HTMLElement
      const footerContent = container.querySelector(".fp-footer") as HTMLElement
      const parallaxBg1 = container.querySelector(".fp-parallax-1") as HTMLElement
      const parallaxBg2 = container.querySelector(".fp-parallax-2") as HTMLElement
      const parallaxBg3 = container.querySelector(".fp-parallax-3") as HTMLElement
      const titleEl = container.querySelector(".footer-title")
      const subtitleEl = container.querySelector(".footer-subtitle")
      const linksEl = container.querySelectorAll(".footer-link")

      // Parallax layers moving at different speeds
      gsap.to(parallaxBg1, {
        yPercent: -40,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })

      gsap.to(parallaxBg2, {
        yPercent: -60,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })

      gsap.to(parallaxBg3, {
        yPercent: -80,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })

      // Hero text parallax (moves faster than scroll)
      gsap.to(hero, {
        yPercent: -50,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "40% top",
          scrub: true,
        },
      })

      // Footer reveal
      gsap.from(titleEl, {
        yPercent: 80,
        ease: "none",
        scrollTrigger: {
          trigger: footerContent,
          start: "top bottom",
          end: "top center",
          scrub: true,
        },
      })

      gsap.from(subtitleEl, {
        yPercent: 50,
        opacity: 0,
        scrollTrigger: {
          trigger: footerContent,
          start: "top 80%",
          end: "top 40%",
          scrub: true,
        },
      })

      gsap.from(linksEl, {
        y: 40,
        opacity: 0,
        stagger: 0.05,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerContent,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [title, subtitle, links])

  return (
    <div ref={containerRef} className={className} style={{ position: "relative", overflow: "hidden" }}>
      {/* Scroll spacer with parallax hero */}
      <div style={{ height: "200vh", position: "relative" }}>
        {/* Parallax background layers */}
        <div
          className="fp-parallax-1"
          style={{
            position: "absolute",
            top: "5%",
            left: "10%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(102,126,234,0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="fp-parallax-2"
          style={{
            position: "absolute",
            top: "20%",
            right: "15%",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(118,75,162,0.12) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <div
          className="fp-parallax-3"
          style={{
            position: "absolute",
            top: "50%",
            left: "40%",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />

        {/* Hero section that parallaxes away */}
        <div
          className="fp-hero"
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <p style={{ fontSize: "1rem", fontWeight: 500, opacity: 0.4, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem", color: "#fff" }}>
            Scroll to reveal
          </p>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", opacity: 0.8 }}>
            Parallax Footer
          </h1>
          <div style={{ width: "40px", height: "40px", marginTop: "2rem", opacity: 0.3 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* The actual parallax footer */}
      <footer
        className="fp-footer"
        style={{
          backgroundColor: bgColor,
          color: "#fff",
          padding: "8rem 2rem 4rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
          <p className="footer-subtitle" style={{ fontSize: "1.1rem", opacity: 0.5, marginBottom: "1rem", fontWeight: 500 }}>
            {subtitle}
          </p>
          <h2
            className="footer-title"
            style={{
              fontSize: "clamp(3rem, 8vw, 7rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              marginBottom: "3rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {title}
          </h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
              flexWrap: "wrap",
              paddingTop: "2rem",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {links.map((link, i) => (
              <a
                key={i}
                className="footer-link"
                href={link.href}
                style={{
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

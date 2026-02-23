"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=Manrope:wght@200;400;500;800&family=Syncopate:wght@400;700&display=swap');

  .ptf-wrap {
    font-family: 'Manrope', sans-serif;
    background-color: #EAEAEA;
    color: #080808;
    overflow-x: hidden;
  }
  .ptf-wrap ::selection { background: #080808; color: #EAEAEA; }

  .ptf-font-display { font-family: 'Syncopate', sans-serif; }
  .ptf-font-serif { font-family: 'Cormorant Garamond', serif; }
  .ptf-font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }

  .ptf-text-outline {
    -webkit-text-stroke: 1px currentColor;
    color: transparent;
  }

  .ptf-project-card:hover .ptf-project-img { transform: scale(1.05); }

  .ptf-nav-line { transition: width 0.3s; }
  .ptf-nav-group:hover .ptf-nav-line { width: 100%; }
`;

export const Portfolio = () => {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero parallax
      gsap.to(".ptf-hero-img", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: ".ptf-hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Manifesto text reveal
      gsap.from(".ptf-split-text", {
        scrollTrigger: {
          trigger: ".ptf-manifesto",
          start: "top 70%",
          end: "bottom bottom",
          toggleActions: "play none none reverse",
        },
        opacity: 0.1,
        y: 50,
        duration: 1.5,
        ease: "power3.out",
      });

      // Horizontal scroll
      const workStrip = document.getElementById("ptf-work-strip");
      const workWrapper = document.getElementById("ptf-work-wrapper");
      if (workStrip && workWrapper) {
        const getScrollAmount = () => workStrip.scrollWidth - window.innerWidth;
        const tween = gsap.to(workStrip, { x: () => -getScrollAmount(), ease: "none" });
        ScrollTrigger.create({
          trigger: workWrapper,
          start: "top top",
          end: () => "+=" + getScrollAmount(),
          pin: true,
          animation: tween,
          scrub: 1,
          invalidateOnRefresh: true,
        });
      }

      // Image parallax
      gsap.to(".ptf-parallax-img", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: ".ptf-parallax-container",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="ptf-wrap" ref={wrapRef}>
        {/* Nav */}
        <nav style={{ position: "fixed", top: 0, left: 0, width: "100%", padding: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 50, mixBlendMode: "difference", color: "#EAEAEA", pointerEvents: "none" }}>
          <div style={{ pointerEvents: "auto" }}>
            <h1 className="ptf-font-serif" style={{ fontSize: "1.5rem", fontStyle: "italic", letterSpacing: "0.05em" }}>PTD.</h1>
          </div>
          <div className="ptf-nav-group" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem", fontSize: "0.75rem", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", pointerEvents: "auto", cursor: "pointer" }}>
            <span>Menu</span>
            <div className="ptf-nav-line" style={{ width: "2rem", height: "1px", background: "#EAEAEA" }} />
          </div>
        </nav>

        {/* Hero */}
        <section className="ptf-hero" style={{ position: "relative", height: "100vh", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", overflow: "hidden", background: "#EAEAEA", color: "#080808" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <img src="https://pub-0277fc17b515429b96928b2eb764f2e1.r2.dev/01.png" alt="Architectural Shadows" className="ptf-hero-img" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.1, filter: "grayscale(1) contrast(1.25)" }} />
          </div>
          <div style={{ zIndex: 10, textAlign: "center" }}>
            <p className="ptf-font-mono" style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.5em", marginBottom: "1rem" }}>Portfolio 26</p>
            <h1 className="ptf-font-display" style={{ fontSize: "12vw", lineHeight: 0.8, textTransform: "uppercase", fontWeight: 700, letterSpacing: "-0.05em" }}>
              Structure <br />
              <span className="ptf-font-serif" style={{ fontStyle: "italic", fontWeight: 300, textTransform: "lowercase", fontSize: "10vw" }}>of</span> Silence
            </h1>
          </div>
          <div className="ptf-font-mono" style={{ position: "absolute", bottom: "2.5rem", left: "2.5rem", fontSize: "0.75rem", zIndex: 10 }}>
            34.0522° N, 118.2437° W<br />San Diego, CA
          </div>
          <div style={{ position: "absolute", bottom: "2.5rem", right: "2.5rem", zIndex: 10, fontSize: "1.25rem" }}>↓</div>
        </section>

        {/* Manifesto */}
        <section className="ptf-manifesto" style={{ position: "relative", background: "#080808", color: "#EAEAEA", minHeight: "150vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "8rem 1.5rem" }}>
          <div style={{ width: "100%", maxWidth: "72rem", display: "grid", gridTemplateColumns: "1fr", gap: "3rem", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
              <h2 className="ptf-split-text ptf-font-serif" style={{ fontSize: "clamp(1.5rem, 4vw, 3.75rem)", fontWeight: 300, lineHeight: 1.25 }}>
                Architecture is not about space but about <span style={{ color: "#fff", fontStyle: "italic" }}>time</span>. We sculpt voids to capture the passing of light.
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "2rem" }}>
                <div>
                  <p className="ptf-font-mono" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#737373", marginBottom: "1rem" }}>Philosophy</p>
                  <p style={{ fontSize: "1.125rem", fontWeight: 300, color: "#a3a3a3", lineHeight: 1.625, maxWidth: "24rem" }}>
                    My work exists at the intersection of brutalism and organic form. Every curve is calculated, every sharp edge is a decision.
                  </p>
                </div>
                <div style={{ position: "relative", overflow: "hidden", height: "16rem", filter: "grayscale(1)", transition: "filter 0.7s" }}>
                  <img src="https://pub-0277fc17b515429b96928b2eb764f2e1.r2.dev/12.png" alt="Concrete detail" style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.25)", transition: "transform 1.5s" }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Horizontal scroll projects */}
        <section id="ptf-work-wrapper" style={{ position: "relative", height: "100vh", background: "#EAEAEA", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ position: "absolute", top: "3rem", left: "3rem", zIndex: 20, mixBlendMode: "difference", color: "#fff" }}>
            <h3 className="ptf-font-display" style={{ fontSize: "2.25rem", textTransform: "uppercase" }}>Selected Works</h3>
          </div>
          <div id="ptf-work-strip" style={{ display: "flex", gap: "5rem", paddingLeft: "20vw", alignItems: "center", height: "70vh", width: "max-content" }}>
            {[
              { src: "https://pub-0277fc17b515429b96928b2eb764f2e1.r2.dev/01.png", title: "The Prism", tag: "Residential", w: "70vh", h: "50vh" },
              { src: "https://pub-0277fc17b515429b96928b2eb764f2e1.r2.dev/03.png", title: "Void Museum", tag: "Oslo, Norway", w: "50vh", h: "60vh" },
              { src: "https://pub-0277fc17b515429b96928b2eb764f2e1.r2.dev/09.png", title: "Carbon Tower", tag: "Explore", w: "80vh", h: "45vh" },
            ].map((p, i) => (
              <div key={i} className="ptf-project-card" style={{ position: "relative", width: p.w, height: p.h, flexShrink: 0, cursor: "pointer" }}>
                <div style={{ overflow: "hidden", width: "100%", height: "100%", position: "relative" }}>
                  <img src={p.src} alt={p.title} className="ptf-project-img" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s", filter: "grayscale(1)" }} />
                </div>
                <div style={{ position: "absolute", bottom: "-2.5rem", left: 0 }}>
                  <h4 className="ptf-font-serif" style={{ fontSize: "1.875rem", fontStyle: "italic", color: "#080808" }}>{p.title}</h4>
                  <span className="ptf-font-mono" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(8,8,8,0.6)" }}>{p.tag}</span>
                </div>
              </div>
            ))}
            <div style={{ width: "40vh", height: "40vh", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderLeft: "1px solid rgba(8,8,8,0.2)" }}>
              <p className="ptf-font-display" style={{ fontSize: "1.5rem", color: "rgba(8,8,8,0.4)", textTransform: "uppercase", textAlign: "center", lineHeight: 1.625 }}>End of<br />Selection</p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section style={{ background: "#080808", color: "#EAEAEA", padding: "10rem 1.5rem" }}>
          <div style={{ borderTop: "1px solid rgba(234,234,234,0.2)", marginBottom: "5rem" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem" }}>
            <div>
              <h5 className="ptf-font-mono" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.3em", marginBottom: "1.5rem", color: "#737373" }}>Methodology</h5>
              <h3 className="ptf-font-display" style={{ fontSize: "3rem", textTransform: "uppercase", lineHeight: 1, marginBottom: "2.5rem" }}>Process<br />& Form</h3>
              <p className="ptf-font-serif" style={{ fontSize: "1.5rem", fontStyle: "italic", fontWeight: 300, color: "#a3a3a3" }}>
                Design is intelligence made visible.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              {["Conceptualization", "Spatial Planning", "Materiality", "Execution"].map((item, i) => (
                <div key={i} style={{ borderBottom: "1px solid #262626", paddingBottom: "3rem" }}>
                  <h4 style={{ fontSize: "1.5rem", fontWeight: 300, marginBottom: "1rem" }}>0{i + 1}. {item}</h4>
                  <p style={{ color: "#737373", fontSize: "0.875rem", lineHeight: 1.625 }}>
                    Design methodology for architectural excellence.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Image break */}
        <section style={{ height: "80vh", width: "100%", position: "relative", overflow: "hidden" }}>
          <div className="ptf-parallax-container" style={{ position: "absolute", inset: 0 }}>
            <img src="https://pub-0277fc17b515429b96928b2eb764f2e1.r2.dev/03.png" alt="Staircase" className="ptf-parallax-img" style={{ width: "100%", height: "120%", objectFit: "cover", objectPosition: "bottom" }} />
          </div>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <h2 className="ptf-font-display" style={{ fontSize: "8vw", color: "#fff", opacity: 0.8, mixBlendMode: "overlay" }}>ELEVATION</h2>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background: "#EAEAEA", color: "#080808", padding: "6rem 1.5rem", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", position: "relative", zIndex: 10 }}>
            <div>
              <h2 className="ptf-font-display" style={{ fontSize: "clamp(3rem, 8vw, 6rem)", letterSpacing: "-0.025em", marginBottom: "2rem" }}>LET'S<br />BUILD.</h2>
              <a href="#" onClick={e => e.preventDefault()} className="ptf-font-serif" style={{ fontStyle: "italic", fontSize: "1.875rem", color: "#080808", textDecoration: "none" }}>Djent@Thall.com</a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "flex-end", textAlign: "right" }}>
              <p className="ptf-font-mono" style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#737373", marginBottom: "0.5rem" }}>Office</p>
              <address style={{ fontStyle: "normal", fontSize: "1.25rem", lineHeight: 1.375, marginBottom: "2.5rem" }}>
                666 Gate Way, Floor 13<br />Industrial District<br />San Diego, 92104
              </address>
              <p className="ptf-font-mono" style={{ fontSize: "0.75rem", color: "#a3a3a3" }}>© 2026 Patrick Dunn.</p>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: "-5rem", left: "-2.5rem", opacity: 0.03, userSelect: "none", pointerEvents: "none" }}>
            <span className="ptf-font-display" style={{ fontSize: "20vw", whiteSpace: "nowrap" }}>ARCHITECTURAL</span>
          </div>
        </footer>
      </div>
    </>
  );
};

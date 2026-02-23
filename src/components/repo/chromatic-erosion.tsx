"use client";

import React, { useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,800;1,800&family=JetBrains+Mono:wght@400;700&display=swap');

  .erosion-wrap {
    width: 100%;
    height: 100vh;
    background-color: #050505;
    color: #f4f4f4;
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .erosion-container {
    position: relative;
    width: 90vw;
    height: 80vh;
    background: #050505;
    border: 1px solid rgba(255,255,255,0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 4rem;
  }

  .erosion-container::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), transparent 0%, #050505 80%);
    z-index: 5;
    pointer-events: none;
    opacity: 0.6;
  }

  .chroma-engine {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  }

  .chroma-layer {
    position: absolute;
    inset: -10%;
    background-size: cover;
    background-position: center;
    mix-blend-mode: screen;
    filter: saturate(1.4) contrast(1.1);
    animation: erosion-drift 20s infinite alternate ease-in-out;
  }

  .chroma-layer-top {
    background-image: url('https://pub-f741fb7b98024df48a8a6d8ac4804414.r2.dev/TOP3gRADIENTS.png');
    opacity: 0.8;
    animation-duration: 25s;
  }

  .chroma-layer-mid {
    background-image: url('https://pub-f741fb7b98024df48a8a6d8ac4804414.r2.dev/MID3gRANDIENTS2.png');
    opacity: 0.6;
    mix-blend-mode: overlay;
    animation-duration: 18s;
    animation-delay: -5s;
  }

  .chroma-layer-bot {
    background-image: url('https://pub-f741fb7b98024df48a8a6d8ac4804414.r2.dev/BOTT3gRADIENTS3.png');
    opacity: 0.7;
    animation-duration: 30s;
    animation-delay: -10s;
  }

  .stipple-overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    background-image: url('https://pub-f741fb7b98024df48a8a6d8ac4804414.r2.dev/noise2.png');
    background-size: 200px;
    opacity: 0.4;
    mix-blend-mode: overlay;
    pointer-events: none;
    animation: erosion-grain-jitter 0.2s infinite steps(2);
  }

  .erosion-content {
    position: relative;
    z-index: 10;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .erosion-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: rgba(255,255,255,0.5);
    display: flex;
    gap: 2rem;
  }

  .erosion-meta-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .erosion-meta-value {
    color: #f4f4f4;
  }

  .erosion-title {
    font-size: clamp(4rem, 12vw, 10rem);
    line-height: 0.85;
    font-weight: 800;
    letter-spacing: -0.04em;
    text-transform: uppercase;
    margin-top: 2rem;
    filter: url(#abrasion-filter);
  }

  .erosion-title-outline {
    display: block;
    color: transparent;
    -webkit-text-stroke: 1px rgba(255,255,255,0.3);
  }

  .erosion-title-solid {
    display: block;
    background: linear-gradient(to bottom, #fff, rgba(255,255,255,0.2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .erosion-cta {
    border: 1px solid rgba(255,255,255,0.2);
    padding: 1.5rem 2rem;
    backdrop-filter: blur(10px);
    background: rgba(255,255,255,0.05);
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .erosion-cta:hover {
    background: #f4f4f4;
    color: #050505;
    transform: translateY(-5px);
  }

  .erosion-cta .cta-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    font-weight: 700;
  }

  .erosion-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: rgba(255,255,255,0.1);
  }

  .erosion-grid-cell {
    width: 12px;
    height: 12px;
    background: #050505;
    transition: background 0.3s ease;
  }

  .erosion-cta:hover .erosion-grid-cell {
    background: #f4f4f4;
  }

  .erosion-status-dot {
    width: 6px;
    height: 6px;
    background: #ff3e00;
    border-radius: 50%;
    display: inline-block;
    margin-right: 8px;
    box-shadow: 0 0 10px #ff3e00;
    animation: erosion-pulse 2s infinite;
  }

  .erosion-slide-up {
    animation: erosion-slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes erosion-drift {
    0% { transform: translate(0, 0) scale(1) rotate(0deg); }
    50% { transform: translate(-2%, 3%) scale(1.05) rotate(1deg); }
    100% { transform: translate(1%, -2%) scale(1) rotate(-1deg); }
  }

  @keyframes erosion-grain-jitter {
    0% { transform: translate(0,0); }
    50% { transform: translate(-1%, -1%); }
    100% { transform: translate(1%, 1%); }
  }

  @keyframes erosion-slideUp {
    from { opacity: 0; transform: translateY(40px); filter: blur(10px); }
    to { opacity: 1; transform: translateY(0); filter: blur(0); }
  }

  @keyframes erosion-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.8); }
  }
`;

export const ChromaticErosion = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      container.style.setProperty("--x", `${x}%`);
      container.style.setProperty("--y", `${y}%`);

      const layers = container.querySelectorAll(".chroma-layer");
      layers.forEach((layer, idx) => {
        const speed = (idx + 1) * 10;
        const shiftX = (x - 50) / speed;
        const shiftY = (y - 50) / speed;
        (layer as HTMLElement).style.transform = `translate(${shiftX}%, ${shiftY}%) scale(1.1)`;
      });
    };

    const handleMouseLeave = () => {
      container.style.setProperty("--x", "50%");
      container.style.setProperty("--y", "50%");
      const layers = container.querySelectorAll(".chroma-layer");
      layers.forEach((layer) => {
        (layer as HTMLElement).style.transform = "translate(0, 0) scale(1)";
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const gridCells = Array.from({ length: 8 });

  return (
    <>
      <style>{styles}</style>
      <svg style={{ display: "none" }}>
        <defs>
          <filter id="abrasion-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={2} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={2} />
          </filter>
        </defs>
      </svg>

      <div className="erosion-wrap">
        <div className="erosion-container" ref={containerRef}>
          <div className="chroma-engine">
            <div className="chroma-layer chroma-layer-top" />
            <div className="chroma-layer chroma-layer-mid" />
            <div className="chroma-layer chroma-layer-bot" />
            <div className="stipple-overlay" />
          </div>

          <div className="erosion-content">
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }} className="erosion-slide-up">
              <div className="erosion-meta">
                <div className="erosion-meta-item">
                  <span>Frequency</span>
                  <span className="erosion-meta-value">842.09 MHz</span>
                </div>
                <div className="erosion-meta-item">
                  <span>Erosion Rate</span>
                  <span className="erosion-meta-value">0.0042% / SEC</span>
                </div>
              </div>
              <div className="erosion-meta">
                <div className="erosion-meta-item" style={{ textAlign: "right" }}>
                  <span><span className="erosion-status-dot" />System Active</span>
                  <span className="erosion-meta-value">CORE_OS // V.4.0</span>
                </div>
              </div>
            </header>

            <main className="erosion-title">
              <span className="erosion-title-outline erosion-slide-up" style={{ animationDelay: "0.2s" }}>Chromatic</span>
              <span className="erosion-title-solid erosion-slide-up" style={{ animationDelay: "0.3s" }}>Erosion</span>
            </main>

            <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }} className="erosion-slide-up" >
              <div className="erosion-cta">
                <div className="erosion-grid">
                  {gridCells.map((_, i) => (
                    <div key={i} className="erosion-grid-cell" />
                  ))}
                </div>
                <span className="cta-label">INITIALIZE DECAY SEQUENCE</span>
              </div>

              <div className="erosion-meta">
                <div className="erosion-meta-item">
                  <span>Coord</span>
                  <span className="erosion-meta-value">40.7128° N, 74.0060° W</span>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};

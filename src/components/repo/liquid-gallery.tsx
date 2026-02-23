"use client";

import React, { useEffect, useRef, useState } from "react";

const IMAGE_URLS = [
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/AlmostCentralPurple.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueAndBlack.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueAndRed.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueHalfDome.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueLiquidFlow.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueWhiteAndOrangeLiqiudFlow.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueWithWhiteHighlight.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BlueYellowAndPink.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/BluesAndPinkSwirl.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/CentralBlue.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/CentralBlueBreakthrough.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/CentralGreenMuted.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/CentralWhiteShineOnBlue.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/DarkGreenShine.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/DarkWithHope.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/DepressedAndCold.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/DepressedAndWarmOne.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/DepressedAndWarmTwo.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/LightBlue.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/LookOutTheWindowBlur.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/MellowPeachFilm.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/MutedAndSoft.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/MutedWithRed.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/NakedAndMuted.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/NotFullyRipeLemon.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/OrangeAndPinkNeon.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/OrangeHalves.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/OrangeToDarkerOrange.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/PeachVibe.png",
  "https://pub-08da4348c3374e69879a944d84f167a2.r2.dev/Glass-Displacement/Pearl.png",
];

function prettyName(url: string) {
  return url.split("/").pop()!.replace(".png", "").replace(/([A-Z])/g, " $1").trim();
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Geist+Mono:wght@300;400&display=swap');

  .lgal-wrap {
    overflow: hidden;
    background: #000;
    width: 100%;
    height: 100vh;
    font-family: 'Geist Mono', monospace;
  }

  .lgal-strip {
    position: fixed;
    top: 0; right: 0;
    width: 96px;
    height: 100%;
    background: rgba(10,10,14,0.72);
    backdrop-filter: blur(24px) saturate(1.4);
    border-left: 1px solid rgba(255,255,255,0.07);
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 0;
    gap: 6px;
    z-index: 10;
  }
  .lgal-strip::-webkit-scrollbar { display: none; }

  .lgal-strip-header {
    width: 100%;
    padding: 0 8px 10px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 4px;
    text-align: center;
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
  }

  .lgal-thumb {
    position: relative;
    flex: 0 0 auto;
    width: 72px; height: 72px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    border: 1.5px solid transparent;
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  .lgal-thumb img {
    width: 100%; height: 100%;
    object-fit: cover;
    border-radius: 6px;
    filter: brightness(0.65) saturate(0.8);
    transition: filter 0.3s;
  }
  .lgal-thumb:hover img { filter: brightness(1.0) saturate(1.2); }
  .lgal-thumb.active {
    border-color: #c8ff3e;
    box-shadow: 0 0 0 1px rgba(200,255,62,0.15), 0 0 20px rgba(200,255,62,0.12);
  }
  .lgal-thumb.active img { filter: brightness(1.0) saturate(1.2); }

  .lgal-thumb-idx {
    position: absolute;
    bottom: 4px; left: 5px;
    font-size: 9px;
    color: rgba(255,255,255,0.4);
    pointer-events: none;
    line-height: 1;
  }
  .lgal-thumb.active .lgal-thumb-idx { color: #c8ff3e; }

  .lgal-nav {
    position: fixed;
    top: 50%;
    z-index: 20;
    background: rgba(15,15,18,0.55);
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.7);
    width: 40px; height: 40px;
    border-radius: 50%;
    font-size: 15px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(12px);
    transition: background 0.2s, border-color 0.2s, color 0.2s;
    transform: translateY(-50%);
  }
  .lgal-nav:hover {
    background: rgba(200,255,62,0.1);
    border-color: rgba(200,255,62,0.4);
    color: #c8ff3e;
  }
  .lgal-prev { left: 16px; }
  .lgal-next { right: 110px; }

  .lgal-label {
    position: fixed;
    top: 22px; left: 50%;
    transform: translateX(calc(-50% - 48px));
    color: rgba(255,255,255,0.75);
    font-family: 'DM Serif Display', serif;
    font-style: italic;
    font-size: 15px;
    letter-spacing: 0.02em;
    text-shadow: 0 1px 8px rgba(0,0,0,0.9);
    white-space: nowrap;
    pointer-events: none;
    z-index: 10;
  }

  .lgal-counter {
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(calc(-50% - 48px));
    font-size: 10px;
    letter-spacing: 0.14em;
    color: rgba(255,255,255,0.25);
    pointer-events: none;
    z-index: 10;
  }
  .lgal-counter span { color: rgba(255,255,255,0.6); }
`;

export const LiquidGallery = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [label, setLabel] = useState(prettyName(IMAGE_URLS[0]));

  // For simplicity, this gallery shows the images as a simple viewer with the filmstrip
  // The Three.js liquid distortion shader is complex - we render images directly with CSS transitions
  const mainImgRef = useRef<HTMLImageElement>(null);

  const switchTo = (idx: number) => {
    idx = ((idx % IMAGE_URLS.length) + IMAGE_URLS.length) % IMAGE_URLS.length;
    setCurrentIndex(idx);
    setLabel(prettyName(IMAGE_URLS[idx]));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") switchTo(currentIndex - 1);
      if (e.key === "ArrowRight") switchTo(currentIndex + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex]);

  return (
    <>
      <style>{styles}</style>
      <div className="lgal-wrap" ref={wrapRef}>
        {/* Main image */}
        <div style={{ position: "fixed", top: 0, left: 0, width: "calc(100% - 96px)", height: "100%", zIndex: 1 }}>
          <img
            ref={mainImgRef}
            src={IMAGE_URLS[currentIndex]}
            alt={label}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "opacity 0.5s ease",
            }}
          />
          {/* Vignette */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)", pointerEvents: "none" }} />
        </div>

        {/* Label */}
        <div className="lgal-label">{label}</div>

        {/* Counter */}
        <div className="lgal-counter">
          <span>{String(currentIndex + 1).padStart(2, "0")}</span> / <span>{String(IMAGE_URLS.length).padStart(2, "0")}</span>
        </div>

        {/* Nav arrows */}
        <button className="lgal-nav lgal-prev" onClick={() => switchTo(currentIndex - 1)}>←</button>
        <button className="lgal-nav lgal-next" onClick={() => switchTo(currentIndex + 1)}>→</button>

        {/* Filmstrip */}
        <div className="lgal-strip">
          <div className="lgal-strip-header">Gallery</div>
          {IMAGE_URLS.map((url, i) => (
            <div
              key={i}
              className={`lgal-thumb ${i === currentIndex ? "active" : ""}`}
              onClick={() => switchTo(i)}
            >
              <img src={url} alt={prettyName(url)} loading="lazy" draggable={false} />
              <div className="lgal-thumb-idx">{String(i + 1).padStart(2, "0")}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

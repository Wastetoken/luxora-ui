import { HorizonHero } from "@/components/repo/horizon-hero-section";

const horizonStyles = `
  .hero-container {
    position: relative;
    width: 100%;
    min-height: 300vh;
    background: linear-gradient(180deg, #000 0%, #0a0a1a 100%);
    color: white;
  }
  .hero-canvas {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    z-index: 0;
  }
  .hero-content {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
    pointer-events: none;
  }
  .hero-content.cosmos-content {
    text-align: center;
  }
  .hero-title {
    font-size: clamp(2rem, 8vw, 6rem);
    font-weight: 900;
    letter-spacing: -0.03em;
    line-height: 0.9;
    margin: 0;
    text-transform: uppercase;
    color: white;
  }
  .title-char {
    display: inline-block;
  }
  .hero-subtitle {
    margin-top: 1.5rem;
    opacity: 0.7;
  }
  .hero-subtitle.cosmos-subtitle {
    text-align: center;
  }
  .subtitle-line {
    font-size: clamp(0.75rem, 1.5vw, 1rem);
    margin: 0.25rem 0;
    color: rgba(255, 255, 255, 0.6);
  }
  .side-menu {
    position: fixed;
    left: 2rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 20;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  .menu-icon {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .menu-icon span {
    display: block;
    width: 20px;
    height: 2px;
    background: rgba(255, 255, 255, 0.6);
  }
  .vertical-text {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-size: 0.65rem;
    letter-spacing: 0.3em;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
  }
  .scroll-progress {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.5);
  }
  .progress-track {
    width: 100px;
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 1px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: rgba(255, 255, 255, 0.6);
    transition: width 0.1s ease;
  }
  .section-counter {
    font-variant-numeric: tabular-nums;
  }
  .scroll-sections {
    position: relative;
    z-index: 5;
  }
  .content-section {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
`;

const HorizonHeroDemo = () => {
  return (
    <>
      <style>{horizonStyles}</style>
      <HorizonHero />
    </>
  );
};

export default HorizonHeroDemo;

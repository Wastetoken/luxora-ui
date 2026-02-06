import { HorizonHero } from "@/components/repo/horizon-hero-section";

const horizonStyles = `
  .hero-container {
    position: relative;
    width: 100%;
    height: 300vh;
    overflow: hidden;
    background: #000;
    color: white;
  }
  .hero-container.cosmos-style {
    background: linear-gradient(180deg, #000 0%, #0a0a1a 100%);
  }
  .hero-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
  .hero-content {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
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
    font-size: clamp(3rem, 10vw, 8rem);
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
    font-size: clamp(0.875rem, 2vw, 1.25rem);
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
  @keyframes word-appear {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const HorizonHeroDemo = () => {
  return (
    <div className="w-full h-full bg-black overflow-auto relative">
      <style>{horizonStyles}</style>
      <HorizonHero />
    </div>
  );
};

export default HorizonHeroDemo;

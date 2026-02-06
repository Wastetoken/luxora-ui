import { HorizonHero } from "@/components/repo/horizon-hero-section";

const horizonStyles = `
  .horizon-demo-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .horizon-demo-wrapper .hero-container {
    position: relative;
    width: 100%;
    min-height: 300vh;
    overflow: hidden;
    background: linear-gradient(180deg, #000 0%, #0a0a1a 100%);
    color: white;
  }
  .horizon-demo-wrapper .hero-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }
  .horizon-demo-wrapper .hero-content {
    position: sticky;
    top: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
    pointer-events: none;
  }
  .horizon-demo-wrapper .hero-content.cosmos-content {
    text-align: center;
  }
  .horizon-demo-wrapper .hero-title {
    font-size: clamp(2rem, 8vw, 6rem);
    font-weight: 900;
    letter-spacing: -0.03em;
    line-height: 0.9;
    margin: 0;
    text-transform: uppercase;
    color: white;
  }
  .horizon-demo-wrapper .title-char {
    display: inline-block;
  }
  .horizon-demo-wrapper .hero-subtitle {
    margin-top: 1.5rem;
    opacity: 0.7;
  }
  .horizon-demo-wrapper .hero-subtitle.cosmos-subtitle {
    text-align: center;
  }
  .horizon-demo-wrapper .subtitle-line {
    font-size: clamp(0.75rem, 1.5vw, 1rem);
    margin: 0.25rem 0;
    color: rgba(255, 255, 255, 0.6);
  }
  .horizon-demo-wrapper .side-menu {
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
  .horizon-demo-wrapper .menu-icon {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .horizon-demo-wrapper .menu-icon span {
    display: block;
    width: 20px;
    height: 2px;
    background: rgba(255, 255, 255, 0.6);
  }
  .horizon-demo-wrapper .vertical-text {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-size: 0.65rem;
    letter-spacing: 0.3em;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
  }
  .horizon-demo-wrapper .scroll-progress {
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
  .horizon-demo-wrapper .progress-track {
    width: 100px;
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 1px;
    overflow: hidden;
  }
  .horizon-demo-wrapper .progress-fill {
    height: 100%;
    background: rgba(255, 255, 255, 0.6);
    transition: width 0.1s ease;
  }
  .horizon-demo-wrapper .section-counter {
    font-variant-numeric: tabular-nums;
  }
  .horizon-demo-wrapper .scroll-sections {
    position: relative;
    z-index: 5;
  }
  .horizon-demo-wrapper .content-section {
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
    <div className="horizon-demo-wrapper">
      <style>{horizonStyles}</style>
      <HorizonHero />
    </div>
  );
};

export default HorizonHeroDemo;

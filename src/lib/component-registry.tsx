import { ComponentType } from "react";

// Direct imports
import FluidBlob from "@/components/demos/FluidBlob";
import LiquidChrome from "@/components/demos/LiquidChrome";
import WavesEffect from "@/components/demos/WavesEffect";
import BloodlinesEffect from "@/components/demos/BloodlinesEffect";
import DisplayCards from "@/components/demos/DisplayCards";
import MilHardware from "@/components/demos/MilHardware";
import HorizonHero from "@/components/demos/HorizonHero";
import SneakHover from "@/components/demos/SneakHover";
import { CircleAnimations1, CircleAnimations3, CircleAnimations4 } from "@/components/demos/CircleAnimations";
import { TextRollNav, WavyTextBlock, ParallaxText, TextScrollAnimation } from "@/components/demos/TextEffects";
import { FlybyScroll, SvgPathScroll, AnimatedGallery, ImageTrailEffect } from "@/components/demos/ScrollEffects";
import { HeroSection, MenuAnimations } from "@/components/demos/InteractiveEffects";
import {
  Skiper3, Skiper4, Skiper16, Skiper17, Skiper19, Skiper25, Skiper26, Skiper28,
  Skiper30, Skiper31, Skiper34, Skiper37, Skiper39, Skiper40, Skiper41,
  Skiper47, Skiper48, Skiper49, Skiper50, Skiper51, Skiper52, Skiper53, Skiper54,
  Skiper58, Skiper61, Skiper62, Skiper63, Skiper64, Skiper65, Skiper66, Skiper67, Skiper87,
} from "@/components/demos/SkiperEffects";

export interface ComponentEntry {
  id: string;
  name: string;
  category: string;
  component: ComponentType;
  code: string;
}

export const componentRegistry: ComponentEntry[] = [
  // Heroes & Sections
  {
    id: "horizon-hero-section", name: "Horizon Hero", category: "Heroes & Sections",
    component: HorizonHero,
    code: `const HorizonHero = () => {\n  return (\n    <div className="horizon-bg absolute inset-0" />\n    <div className="horizon-line" />\n    <h1 style={{ animation: "text-glow 3s infinite" }}>HORIZON</h1>\n  );\n};\n\n// CSS: gradient horizon with animated glow line\n// and pulsing text-shadow effect`,
  },
  {
    id: "hero-section", name: "StackPilot Hero", category: "Heroes & Sections",
    component: HeroSection,
    code: `const HeroSection = () => {\n  return (\n    <div className="hero-container">\n      <div className="badge">NEW RELEASE</div>\n      <h1 style={{ animation: "hero-float 6s infinite" }}>\n        Build Faster. Ship Smarter.\n      </h1>\n      <div className="cta-buttons">\n        <button>Get Started</button>\n        <button>View Docs</button>\n      </div>\n    </div>\n  );\n};`,
  },

  // Shaders & Effects
  {
    id: "bloodlines", name: "Bloodlines Shader", category: "Shaders & Effects",
    component: BloodlinesEffect,
    code: `const BloodlinesEffect = () => {\n  const canvasRef = useRef<HTMLCanvasElement>(null);\n\n  useEffect(() => {\n    // Canvas animation: 12 flowing lines\n    // Each line has sine-wave displacement\n    // Red glow via shadowColor + shadowBlur\n    // Trail effect via semi-transparent fill\n  }, []);\n\n  return <canvas ref={canvasRef} />;\n};`,
  },
  {
    id: "liquid-chrome", name: "Liquid Chrome", category: "Shaders & Effects",
    component: LiquidChrome,
    code: `const LiquidChrome = () => {\n  const canvasRef = useRef<HTMLCanvasElement>(null);\n\n  useEffect(() => {\n    // Per-pixel rendering at 4px resolution\n    // Layered sine/cosine functions for\n    // metallic reflection effect\n    const v1 = Math.sin(nx * 6 + t) * Math.cos(ny * 4 + t);\n    const v2 = Math.sin((nx + ny) * 5 + t);\n    // RGB mapped from combined values\n  }, []);\n\n  return <canvas ref={canvasRef} />;\n};`,
  },
  {
    id: "waves", name: "Waves Shader", category: "Shaders & Effects",
    component: WavesEffect,
    code: `const WavesEffect = () => {\n  // Canvas with 4 layered sine waves\n  // Each wave has unique amplitude, frequency,\n  // speed, color, and vertical offset\n  const waves = [\n    { amplitude: 40, frequency: 0.02, speed: 0.03, color: "hsla(38,92%,50%,0.3)" },\n    { amplitude: 30, frequency: 0.015, speed: 0.02, color: "hsla(340,80%,55%,0.25)" },\n    // ...\n  ];\n  return <canvas ref={canvasRef} />;\n};`,
  },

  // Animations
  {
    id: "fluid-blob", name: "Fluid Blob", category: "Animations",
    component: FluidBlob,
    code: `const FluidBlob = () => {\n  // CSS keyframe animations:\n  // blob-morph: cycles border-radius values\n  // blob-rotate: 360deg rotation with scale pulse\n  // Shadow layer with blur + reverse animation\n  return (\n    <div className="fluid-blob-main" />\n    <div className="fluid-blob-shadow" />\n  );\n};`,
  },
  {
    id: "circle-animations-collection", name: "Circle Animations 1", category: "Animations",
    component: CircleAnimations1,
    code: `// Three circle animation patterns:\n// 1. Radial Pulse - concentric circles scaling\n// 2. Orbital - dots orbiting center point\n// 3. Concentric Rings - expanding rings that fade\n\nconst CircleAnimations1 = () => (\n  <div className="flex gap-12">\n    {/* Radial Pulse */}\n    {[0,1,2].map(i => <div style={{ animation: "ca-pulse 2s infinite" }} />)}\n    {/* Orbital */}\n    {[0,1,2,3].map(i => <div style={{ animation: "ca-orbit 3s linear infinite" }} />)}\n  </div>\n);`,
  },
  {
    id: "circle-animations-collection-3", name: "Circle Animations 3", category: "Animations",
    component: CircleAnimations3,
    code: `// Three patterns: Breathe, Chase, Wave\nconst CircleAnimations3 = () => (\n  <div className="flex gap-16">\n    {/* Breathe: nested circles scaling */}\n    {/* Chase: dots positioned in circle, container rotates */}\n    {/* Wave: row of dots with staggered Y translation */}\n  </div>\n);`,
  },
  {
    id: "circle-animations-collection-4", name: "Circle Animations 4", category: "Animations",
    component: CircleAnimations4,
    code: `const CircleAnimations4 = () => {\n  // Canvas-based: spiral dots + Lissajous curve + orbiting dots\n  useEffect(() => {\n    // Spiral: 60 dots with increasing radius\n    for (let i = 0; i < 60; i++) {\n      const angle = i * 0.3 + t * 0.02;\n      const r = i * 2.5;\n    }\n    // Lissajous: parametric curve sin(3t) x sin(2t)\n    // Center: 8 orbiting dots with breathing radius\n  }, []);\n};`,
  },
  {
    id: "animated-gallery", name: "Animated Gallery", category: "Animations",
    component: AnimatedGallery,
    code: `const AnimatedGallery = () => {\n  // 3x3 grid of gradient-filled squares\n  // Staggered entrance animation:\n  // scale(0.8) + rotate(3deg) → scale(1) + rotate(0)\n  // Each tile delayed by 80ms\n  return (\n    <div className="grid grid-cols-3 gap-3">\n      {colors.map((color, i) => (\n        <div style={{ animationDelay: i * 0.08 + "s" }} />\n      ))}\n    </div>\n  );\n};`,
  },

  // Text Effects
  {
    id: "text-roll-navigation", name: "Text Roll Navigation", category: "Text Effects",
    component: TextRollNav,
    code: `const TextRollNav = () => {\n  // Each nav item has two text layers stacked vertically\n  // On hover, translateY(-3rem) reveals the colored duplicate\n  // Transition: cubic-bezier(0.25, 0.46, 0.45, 0.94)\n  return (\n    <nav>\n      {items.map(item => (\n        <div className="roll-item">\n          <div className="roll-inner">\n            <div>{item}</div>\n            <div style={{ color: accent }}>{item}</div>\n          </div>\n        </div>\n      ))}\n    </nav>\n  );\n};`,
  },
  {
    id: "wavy-text-block", name: "Wavy Text Block", category: "Text Effects",
    component: WavyTextBlock,
    code: `const WavyTextBlock = () => {\n  // Each character is an inline-block span\n  // Animation: translateY(0) → translateY(-15px)\n  // Staggered delay: i * 0.08s per character\n  return (\n    <div className="flex">\n      {text.split("").map((char, i) => (\n        <span style={{ animationDelay: i * 0.08 + "s" }}>{char}</span>\n      ))}\n    </div>\n  );\n};`,
  },
  {
    id: "parallax-scrolling-text-effect", name: "Parallax Text", category: "Text Effects",
    component: ParallaxText,
    code: `const ParallaxText = () => {\n  // Mouse position tracked relative to container\n  // Multiple text layers at different "depths"\n  // Each layer translates proportionally to depth\n  const depth = (i + 1) * 30;\n  transform: translate(offset.x * depth, offset.y * depth)\n};`,
  },
  {
    id: "text-scroll-animation", name: "Text Scroll Animation", category: "Text Effects",
    component: TextScrollAnimation,
    code: `const TextScrollAnimation = () => {\n  // Scroll progress tracked within component\n  // Words fade in and slide up sequentially\n  // Each word triggered at progress threshold\n  const wordProgress = (progress - i * 0.1) * 5;\n  style={{ opacity: wordProgress, translateY: (1 - p) * 30 }}\n};`,
  },

  // Scroll Effects
  {
    id: "flyby-scroll", name: "Flyby Scroll", category: "Scroll Effects",
    component: FlybyScroll,
    code: `const FlybyScroll = () => {\n  // Sticky container with 400vh scroll height\n  // Text elements fly horizontally at different speeds\n  // 3D perspective rotation based on scroll position\n  transform: translate3d(-offset * 0.5, yPos, 0)\n    perspective(500px)\n    rotateY(sin(offset * 0.005) * 5deg)\n};`,
  },
  {
    id: "svg-follow-scroll", name: "SVG Path Scroll", category: "Scroll Effects",
    component: SvgPathScroll,
    code: `const SvgPathScroll = () => {\n  // SVG spiral path with stroke-dasharray\n  // Scroll progress controls dashoffset\n  // Circle follows path via offset-distance\n  strokeDasharray={pathLength}\n  strokeDashoffset={pathLength * (1 - progress)}\n  // Dot: offsetDistance: progress * 100%\n};`,
  },
  {
    id: "image-trail-effect", name: "Image Trail Effect", category: "Scroll Effects",
    component: ImageTrailEffect,
    code: `const ImageTrailEffect = () => {\n  // Mouse position spawns colored squares\n  // Trail limited to 15 elements\n  // Older elements auto-removed via interval\n  // Scale and opacity decrease with age\n  onMouseMove: push new trail element\n  setInterval: remove oldest every 100ms\n};`,
  },

  // Interactive
  {
    id: "sneak-hover", name: "Sneak Hover", category: "Interactive",
    component: SneakHover,
    code: `const SneakHover = () => {\n  // List items with color sweep on hover\n  // Background slides in from left (translateX)\n  // Text shifts right and changes color\n  // Index number fades in on hover\n  transform: hovered ? "translateX(0)" : "translateX(-100%)"\n};`,
  },
  {
    id: "menu-animations", name: "Menu Animations", category: "Interactive",
    component: MenuAnimations,
    code: `const MenuAnimations = () => {\n  // Dropdown menus with fade+slide animation\n  // Each menu item has hover highlight\n  // Uses onMouseEnter/Leave for smooth transitions\n  animation: fadeSlideIn 0.2s ease-out\n  // from: opacity 0, translateY(-4px)\n  // to: opacity 1, translateY(0)\n};`,
  },

  // Cards & Layout
  {
    id: "display-cards", name: "Display Cards", category: "Cards & Layout",
    component: DisplayCards,
    code: `const DisplayCards = () => {\n  // 4 cards stacked with CSS rotation\n  // On hover: card lifts up, scales 1.05x\n  // Z-index swap brings hovered card to top\n  // Each card has gradient background\n  transform: rotate(rotation) translateY(offset) scale(scale)\n};`,
  },
  {
    id: "mil-hardware", name: "Military Hardware", category: "Cards & Layout",
    component: MilHardware,
    code: `const MilHardware = () => {\n  // Radar SVG with rotating sweep line\n  // Concentric range circles + crosshairs\n  // Blip markers at fixed positions\n  // Data readout: LAT, LNG, ALT, HDG, SPD\n  // Status indicators with blink animation\n  // System tags: COMMS, NAV, TGTG, FLIR\n};`,
  },

  // Skiper Collection
  { id: "skiper3", name: "Skiper 3", category: "Skiper Collection", component: Skiper3, code: `// Orbiting dots pattern\n// 6 dots orbiting a center point\n// Each dot has staggered animation delay\nconst Skiper3 = createEffect("orbit", colors, { count: 6, speed: 4 });` },
  { id: "skiper4", name: "Skiper 4", category: "Skiper Collection", component: Skiper4, code: `// Animated gradient mesh\n// 400% background-size with position animation\nconst Skiper4 = createEffect("gradient", colors, { speed: 5 });` },
  { id: "skiper16", name: "Skiper 16", category: "Skiper Collection", component: Skiper16, code: `// Floating card stack\n// Cards with staggered float animation\nconst Skiper16 = createEffect("cards", colors, { count: 4 });` },
  { id: "skiper17", name: "Skiper 17", category: "Skiper Collection", component: Skiper17, code: `// Floating card stack variant\nconst Skiper17 = createEffect("cards", colors, { count: 5 });` },
  { id: "skiper19", name: "Skiper 19", category: "Skiper Collection", component: Skiper19, code: `// Dense orbital pattern\nconst Skiper19 = createEffect("orbit", colors, { count: 10, speed: 5 });` },
  { id: "skiper25", name: "Skiper 25", category: "Skiper Collection", component: Skiper25, code: `// Audio equalizer bars\n// 16 bars with staggered bounce animation\nconst Skiper25 = createEffect("bars", colors, { count: 16 });` },
  { id: "skiper26", name: "Skiper 26", category: "Skiper Collection", component: Skiper26, code: `// 3D flip card\n// Click to rotate 180deg on Y axis\nconst Skiper26 = createEffect("flip", colors);` },
  { id: "skiper28", name: "Skiper 28", category: "Skiper Collection", component: Skiper28, code: `// Animated SVG wave lines\nconst Skiper28 = createEffect("wave", colors, { speed: 4 });` },
  { id: "skiper30", name: "Skiper 30", category: "Skiper Collection", component: Skiper30, code: `// Pulsing dot grid (5x5)\nconst Skiper30 = createEffect("grid", colors, { count: 25 });` },
  { id: "skiper31", name: "Skiper 31", category: "Skiper Collection", component: Skiper31, code: `// Morphing blob shape\nconst Skiper31 = createEffect("morph", colors, { speed: 6 });` },
  { id: "skiper34", name: "Skiper 34", category: "Skiper Collection", component: Skiper34, code: `// Pulsing dot grid (4x4)\nconst Skiper34 = createEffect("grid", colors, { count: 16 });` },
  { id: "skiper37", name: "Skiper 37", category: "Skiper Collection", component: Skiper37, code: `// SVG wave animation\nconst Skiper37 = createEffect("wave", colors, { speed: 3 });` },
  { id: "skiper39", name: "Skiper 39", category: "Skiper Collection", component: Skiper39, code: `// Dense orbital dots\nconst Skiper39 = createEffect("orbit", colors, { count: 12, speed: 6 });` },
  { id: "skiper40", name: "Skiper 40", category: "Skiper Collection", component: Skiper40, code: `// Flowing gradient\nconst Skiper40 = createEffect("gradient", colors, { speed: 4, label: "FLOW" });` },
  { id: "skiper41", name: "Skiper 41", category: "Skiper Collection", component: Skiper41, code: `// 3D flip card variant\nconst Skiper41 = createEffect("flip", colors);` },
  { id: "skiper47", name: "Skiper 47", category: "Skiper Collection", component: Skiper47, code: `// Card stack (3 cards)\nconst Skiper47 = createEffect("cards", colors, { count: 3 });` },
  { id: "skiper48", name: "Skiper 48", category: "Skiper Collection", component: Skiper48, code: `// Card stack variant\nconst Skiper48 = createEffect("cards", colors, { count: 4 });` },
  { id: "skiper49", name: "Skiper 49", category: "Skiper Collection", component: Skiper49, code: `// Card stack variant\nconst Skiper49 = createEffect("cards", colors, { count: 5 });` },
  { id: "skiper50", name: "Skiper 50", category: "Skiper Collection", component: Skiper50, code: `// Card stack variant\nconst Skiper50 = createEffect("cards", colors, { count: 3 });` },
  { id: "skiper51", name: "Skiper 51", category: "Skiper Collection", component: Skiper51, code: `// Card stack variant\nconst Skiper51 = createEffect("cards", colors, { count: 4 });` },
  { id: "skiper52", name: "Skiper 52", category: "Skiper Collection", component: Skiper52, code: `// Card stack variant\nconst Skiper52 = createEffect("cards", colors, { count: 5 });` },
  { id: "skiper53", name: "Skiper 53", category: "Skiper Collection", component: Skiper53, code: `// Card stack variant\nconst Skiper53 = createEffect("cards", colors, { count: 4 });` },
  { id: "skiper54", name: "Skiper 54", category: "Skiper Collection", component: Skiper54, code: `// Card stack variant\nconst Skiper54 = createEffect("cards", colors, { count: 3 });` },
  { id: "skiper58", name: "Skiper 58", category: "Skiper Collection", component: Skiper58, code: `// Expanding concentric rings\nconst Skiper58 = createEffect("rings", colors, { count: 5 });` },
  { id: "skiper61", name: "Skiper 61", category: "Skiper Collection", component: Skiper61, code: `// Interactive cursor follower\nconst Skiper61 = createEffect("interactive", colors);` },
  { id: "skiper62", name: "Skiper 62", category: "Skiper Collection", component: Skiper62, code: `// Expanding rings variant\nconst Skiper62 = createEffect("rings", colors, { count: 6 });` },
  { id: "skiper63", name: "Skiper 63", category: "Skiper Collection", component: Skiper63, code: `// Morphing shape\nconst Skiper63 = createEffect("morph", colors, { speed: 5 });` },
  { id: "skiper64", name: "Skiper 64", category: "Skiper Collection", component: Skiper64, code: `// Interactive cursor follower\nconst Skiper64 = createEffect("interactive", colors);` },
  { id: "skiper65", name: "Skiper 65", category: "Skiper Collection", component: Skiper65, code: `// Interactive cursor follower\nconst Skiper65 = createEffect("interactive", colors);` },
  { id: "skiper66", name: "Skiper 66", category: "Skiper Collection", component: Skiper66, code: `// Card stack variant\nconst Skiper66 = createEffect("cards", colors, { count: 4 });` },
  { id: "skiper67", name: "Skiper 67", category: "Skiper Collection", component: Skiper67, code: `// Morphing shape variant\nconst Skiper67 = createEffect("morph", colors, { speed: 4 });` },
  { id: "skiper87", name: "Skiper 87", category: "Skiper Collection", component: Skiper87, code: `// Dense pulsing dot grid (6x6)\nconst Skiper87 = createEffect("grid", colors, { count: 36 });` },
];

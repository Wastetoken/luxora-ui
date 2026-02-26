import { ComponentType } from "react";

// Real component imports from the repo
import HorizonHeroDemo from "@/components/demos/HorizonHeroDemo";
import { Component as HeroSection } from "@/components/repo/hero-section";
import MilHardware from "@/components/repo/mil-hardware";
import Bloodlines from "@/components/repo/bloodlines";
import LiquidChrome from "@/components/repo/liquid-chrome";
import Waves from "@/components/repo/waves";
import { LavaLamp } from "@/components/repo/fluid-blob";
import DisplayCards from "@/components/repo/display-cards";
import { Component as SneakHover } from "@/components/repo/sneak-hover";
import { Component as FlybyScroll } from "@/components/repo/flyby-scroll";
import { CircleAnimationsGrid as CircleAnimations1 } from "@/components/repo/circle-animations-collection";
import { CircleAnimationsGrid as CircleAnimations3 } from "@/components/repo/circle-animations-collection-3";
import { CircleAnimationsGrid as CircleAnimations4 } from "@/components/repo/circle-animations-collection-4";
import { VelocityText } from "@/components/repo/parallax-scrolling-text-effect";
import TextRollDemo from "@/components/demos/TextRollDemo";
import { Skiper19 as SvgFollowScroll } from "@/components/repo/svg-follow-scroll";

// Demo wrappers for components needing props/children
import AnimatedGalleryDemo from "@/components/demos/AnimatedGalleryDemo";
import ImageTrailDemo from "@/components/demos/ImageTrailDemo";
import WavyTextDemo from "@/components/demos/WavyTextDemo";
import MenuAnimationsDemo from "@/components/demos/MenuAnimationsDemo";
import VideoPlayerDemo from "@/components/demos/VideoPlayerDemo";
import LazerCursorDemo from "@/components/demos/LazerCursorDemo";

import LiquidGLCursorDemo from "@/components/demos/LiquidGLCursorDemo";
import ElectricCursorDemo from "@/components/demos/ElectricCursorDemo";
import FeatherCursorDemo from "@/components/demos/FeatherCursorDemo";
import ReptileCursorDemo from "@/components/demos/ReptileCursorDemo";
import { Skiper67 } from "@/components/repo/skiper67";
// Skiper collection
import { Skiper3 } from "@/components/repo/skiper3";
import { Skiper4 } from "@/components/repo/skiper4";
import { Skiper16 } from "@/components/repo/skiper16";
import { Skiper17 } from "@/components/repo/skiper17";
import { Skiper25 } from "@/components/repo/skiper25";
import { Skiper26 } from "@/components/repo/skiper26";
import { Skiper28 } from "@/components/repo/skiper28";
import { Skiper30 } from "@/components/repo/skiper30";
import { Skiper31 } from "@/components/repo/skiper31";
import { Skiper34 } from "@/components/repo/skiper34";
import { Skiper37 } from "@/components/repo/skiper37";
import { Skiper39 } from "@/components/repo/skiper39";
import { Skiper40 } from "@/components/repo/skiper40";
import { Skiper41 } from "@/components/repo/skiper41";
import { Skiper47 } from "@/components/repo/skiper47";
import { Skiper48 } from "@/components/repo/skiper48";
import { Skiper49 } from "@/components/repo/skiper49";
import { Skiper50 } from "@/components/repo/skiper50";
import { Skiper51 } from "@/components/repo/skiper51";
import { Skiper52 } from "@/components/repo/skiper52";
import { Skiper53 } from "@/components/repo/skiper53";
import { Skiper54 } from "@/components/repo/skiper54";
import { Skiper58 } from "@/components/repo/skiper58";
import { Skiper61 } from "@/components/repo/skiper61";
import { Skiper62 } from "@/components/repo/skiper62";
import { Skiper63 } from "@/components/repo/skiper63";
import { Skiper64 } from "@/components/repo/skiper64";
import { Skiper65 } from "@/components/repo/skiper65";
import { Skiper66 } from "@/components/repo/skiper66";
import { Skiper87 } from "@/components/repo/skiper87";
import { SingularityPreview } from "@/components/repo/singularity";
import { AttractorPreview } from "@/components/repo/attractor";
import { MorphogenPreview } from "@/components/repo/morphogen";
import { ErosionPreview } from "@/components/repo/erosion";
import { LeniaPreview } from "@/components/repo/lenia";
import { LuxoraAIDesigner } from "@/components/repo/luxora-ai-designer";
import { SinekPanel } from "@/components/repo/sinek-panel";
import { CrowdSprites } from "@/components/repo/crowd-sprites";
import { ChromaticErosion } from "@/components/repo/chromatic-erosion";
import { GrokAI } from "@/components/repo/grok-ai";
import { LiquidGallery } from "@/components/repo/liquid-gallery";
import { Portfolio } from "@/components/repo/portfolio";
import { LuxoraBgRipple, LuxoraHeroTextRipple } from "@/components/repo/luxora-bg-ripple";

// Osmo Collection
import OsmoAnimatedBackgroundGrid from "@/components/repo/animated-background-grid";
import OsmoAppleDockNavigation from "@/components/repo/apple-dock-navigation";
import OsmoBeforeAfterSplitSlider from "@/components/repo/before-after-split-slider";
import OsmoBlobCursor from "@/components/repo/blob-cursor";
import OsmoBoldFullscreenNavigation from "@/components/repo/bold-fullscreen-navigation";
import OsmoColorTransitionScroll from "@/components/repo/color-transition-scroll";
import OsmoCSSMarquee from "@/components/repo/css-marquee";
import OsmoCursorGlowEffect from "@/components/repo/cursor-glow-effect";
import OsmoCursorSpotlight from "@/components/repo/cursor-spotlight";
import OsmoDirectionalListHover from "@/components/repo/directional-list-hover";

export interface ComponentEntry {
  id: string;
  name: string;
  category: string;
  component: ComponentType;
  sourceFile: string;
  /** When true, component renders full-page instead of in the contained preview box. */
  needsFullscreen?: boolean;
  /** NPM packages required by this component */
  dependencies?: string[];
  /** The actual export name(s) from the source file. Used to generate correct import code. */
  exportName: string;
  /** True if the component uses `export default` instead of named export */
  isDefaultExport?: boolean;
  /** Local files this component depends on (e.g. carousel.tsx) */
  localDeps?: string[];
  /** Native theme of the component: "light" or "dark". Defaults to "dark". */
  nativeTheme?: "light" | "dark";
}

export const componentRegistry: ComponentEntry[] = [
  // Heroes & Sections
  { id: "horizon-hero-section", name: "Horizon Hero", category: "Heroes & Sections", component: HorizonHeroDemo, sourceFile: "horizon-hero-section.tsx", needsFullscreen: true, dependencies: ["three", "gsap"], exportName: "HorizonHero" },
  { id: "hero-section", name: "StackPilot Hero", category: "Heroes & Sections", component: HeroSection, sourceFile: "hero-section.tsx", exportName: "Component" },

  // Shaders & Effects
  { id: "bloodlines", name: "Bloodlines Shader", category: "Shaders & Effects", component: Bloodlines, sourceFile: "bloodlines.tsx", exportName: "SilkShader", isDefaultExport: true },
  { id: "liquid-chrome", name: "Liquid Chrome", category: "Shaders & Effects", component: LiquidChrome, sourceFile: "liquid-chrome.tsx", exportName: "SilkShader", isDefaultExport: true },
  { id: "waves", name: "Waves Shader", category: "Shaders & Effects", component: Waves, sourceFile: "waves.tsx", exportName: "SilkShader", isDefaultExport: true },
  { id: "singularity", name: "Singularity", category: "Shaders & Effects", component: SingularityPreview, sourceFile: "singularity.tsx", needsFullscreen: true, dependencies: ["animejs", "three"], exportName: "SingularityPreview" },
  { id: "attractor", name: "Attractor", category: "Shaders & Effects", component: AttractorPreview, sourceFile: "attractor.tsx", needsFullscreen: true, dependencies: ["animejs", "three"], exportName: "AttractorPreview" },
  { id: "morphogen", name: "Morphogen", category: "Shaders & Effects", component: MorphogenPreview, sourceFile: "morphogen.tsx", needsFullscreen: true, dependencies: ["animejs"], exportName: "MorphogenPreview" },
  { id: "erosion", name: "Erosion", category: "Shaders & Effects", component: ErosionPreview, sourceFile: "erosion.tsx", needsFullscreen: true, dependencies: ["animejs"], exportName: "ErosionPreview" },
  { id: "lenia", name: "Lenia", category: "Shaders & Effects", component: LeniaPreview, sourceFile: "lenia.tsx", needsFullscreen: true, dependencies: ["animejs"], exportName: "LeniaPreview" },

  // Animations
  { id: "fluid-blob", name: "Fluid Blob", category: "Animations", component: LavaLamp, sourceFile: "fluid-blob.tsx", dependencies: ["three", "@react-three/fiber"], exportName: "LavaLamp" },
  { id: "circle-animations-1", name: "Circle Animations 1", category: "Animations", component: CircleAnimations1, sourceFile: "circle-animations-collection.tsx", exportName: "CircleAnimationsGrid" },
  { id: "circle-animations-3", name: "Circle Animations 3", category: "Animations", component: CircleAnimations3, sourceFile: "circle-animations-collection-3.tsx", exportName: "CircleAnimationsGrid" },
  { id: "circle-animations-4", name: "Circle Animations 4", category: "Animations", component: CircleAnimations4, sourceFile: "circle-animations-collection-4.tsx", exportName: "CircleAnimationsGrid" },
  { id: "animated-gallery", name: "Animated Gallery", category: "Animations", component: AnimatedGalleryDemo, sourceFile: "animated-gallery.tsx", needsFullscreen: true, dependencies: ["motion"], exportName: "ContainerScroll, GalleryContainer, GalleryCol" },

  // Text Effects
  { id: "text-roll-navigation", name: "Text Roll Navigation", category: "Text Effects", component: TextRollDemo, sourceFile: "text-roll-navigation.tsx", dependencies: ["framer-motion"], exportName: "TextRoll" },
  { id: "wavy-text-block", name: "Wavy Text Block", category: "Text Effects", component: WavyTextDemo, sourceFile: "wavy-text-block.tsx", dependencies: ["motion"], exportName: "WavyBlock, WavyBlockItem" },
  { id: "parallax-text", name: "Parallax Text", category: "Text Effects", component: VelocityText, sourceFile: "parallax-scrolling-text-effect.tsx", needsFullscreen: true, dependencies: ["framer-motion"], exportName: "VelocityText" },
  { id: "text-scroll-animation", name: "Text Scroll Animation", category: "Text Effects", component: Skiper31, sourceFile: "text-scroll-animation.tsx", needsFullscreen: true, dependencies: ["framer-motion", "lenis"], exportName: "Skiper31" },

  // Scroll Effects
  { id: "flyby-scroll", name: "Flyby Scroll", category: "Scroll Effects", component: FlybyScroll, sourceFile: "flyby-scroll.tsx", exportName: "Component" },
  { id: "svg-follow-scroll", name: "SVG Path Scroll", category: "Scroll Effects", component: SvgFollowScroll, sourceFile: "svg-follow-scroll.tsx", needsFullscreen: true, dependencies: ["framer-motion"], exportName: "Skiper19" },
  { id: "image-trail-effect", name: "Image Trail Effect", category: "Scroll Effects", component: ImageTrailDemo, sourceFile: "image-trail-effect.tsx", dependencies: ["gsap"], exportName: "TrailWrapper", isDefaultExport: true },

  // Cursors
  { id: "lazer-cursor", name: "Lazer Cursor", category: "Cursors", component: LazerCursorDemo, sourceFile: "lazer-cursor.tsx", needsFullscreen: true, exportName: "LazerCursor" },
  { id: "liquid-gl-cursor", name: "Liquid GL Cursor", category: "Cursors", component: LiquidGLCursorDemo, sourceFile: "liquid-gl-cursor.tsx", needsFullscreen: true, exportName: "LiquidGLCursor" },
  { id: "electric-cursor", name: "Electric Cursor", category: "Cursors", component: ElectricCursorDemo, sourceFile: "electric-cursor.tsx", needsFullscreen: true, exportName: "ElectricCursor" },
  { id: "feather-cursor", name: "Feather Cursor", category: "Cursors", component: FeatherCursorDemo, sourceFile: "feather-cursor.tsx", needsFullscreen: true, exportName: "FeatherCursor" },
  { id: "reptile-cursor", name: "Reptile Cursor", category: "Cursors", component: ReptileCursorDemo, sourceFile: "reptile-cursor.tsx", needsFullscreen: true, exportName: "ReptileCursor" },

  // Interactive
  { id: "sneak-hover", name: "Sneak Hover", category: "Interactive", component: SneakHover, sourceFile: "sneak-hover.tsx", dependencies: ["three"], exportName: "Component" },
  { id: "menu-animations", name: "Menu Animations", category: "Interactive", component: MenuAnimationsDemo, sourceFile: "menu-animations.tsx", dependencies: ["gsap"], exportName: "MenuAnimation" },

  // Cards & Layout
  { id: "display-cards", name: "Display Cards", category: "Cards & Layout", component: DisplayCards, sourceFile: "display-cards.tsx", exportName: "DisplayCards", isDefaultExport: true },
  { id: "mil-hardware", name: "Military Hardware", category: "Cards & Layout", component: MilHardware, sourceFile: "mil-hardware.tsx", exportName: "MilHardware", isDefaultExport: true },

  // Skiper Collection
  { id: "skiper3", name: "Skiper 3", category: "Skiper Collection", component: Skiper3, sourceFile: "skiper3.tsx", dependencies: ["framer-motion"], exportName: "Skiper3" },
  { id: "skiper4", name: "Skiper 4", category: "Skiper Collection", component: Skiper4, sourceFile: "skiper4.tsx", dependencies: ["framer-motion"], exportName: "Skiper4" },
  { id: "skiper16", name: "Skiper 16", category: "Skiper Collection", component: Skiper16, sourceFile: "skiper16.tsx", needsFullscreen: true, dependencies: ["framer-motion", "lenis"], exportName: "Skiper16" },
  { id: "skiper17", name: "Skiper 17", category: "Skiper Collection", component: Skiper17, sourceFile: "skiper17.tsx", needsFullscreen: true, dependencies: ["gsap", "@gsap/react", "lenis"], exportName: "Skiper17" },
  { id: "skiper25", name: "Skiper 25", category: "Skiper Collection", component: Skiper25, sourceFile: "skiper25.tsx", dependencies: ["framer-motion", "use-sound"], exportName: "Skiper25" },
  { id: "skiper26", name: "Skiper 26", category: "Skiper Collection", component: Skiper26, sourceFile: "skiper26.tsx", dependencies: ["framer-motion"], exportName: "Skiper26" },
  { id: "skiper28", name: "Skiper 28", category: "Skiper Collection", component: Skiper28, sourceFile: "skiper28.tsx", needsFullscreen: true, dependencies: ["framer-motion", "lenis"], exportName: "Skiper28", nativeTheme: "light" },
  { id: "skiper30", name: "Skiper 30", category: "Skiper Collection", component: Skiper30, sourceFile: "skiper30.tsx", needsFullscreen: true, dependencies: ["framer-motion", "lenis"], exportName: "Skiper30" },
  { id: "skiper31", name: "Skiper 31", category: "Skiper Collection", component: Skiper31, sourceFile: "skiper31.tsx", needsFullscreen: true, dependencies: ["framer-motion", "lenis"], exportName: "Skiper31" },
  { id: "skiper34", name: "Skiper 34", category: "Skiper Collection", component: Skiper34, sourceFile: "skiper34.tsx", needsFullscreen: true, dependencies: ["framer-motion", "lenis"], exportName: "Skiper34", nativeTheme: "light" },
  { id: "skiper37", name: "Skiper 37", category: "Skiper Collection", component: Skiper37, sourceFile: "skiper37.tsx", needsFullscreen: true, dependencies: ["framer-motion", "@number-flow/react", "react-intersection-observer"], exportName: "Skiper37" },
  { id: "skiper39", name: "Skiper 39", category: "Skiper Collection", component: Skiper39, sourceFile: "skiper39.tsx", needsFullscreen: true, dependencies: ["gsap"], exportName: "Skiper39" },
  { id: "skiper40", name: "Skiper 40", category: "Skiper Collection", component: Skiper40, sourceFile: "skiper40.tsx", exportName: "Skiper40" },
  { id: "skiper41", name: "Skiper 41", category: "Skiper Collection", component: Skiper41, sourceFile: "skiper41.tsx", needsFullscreen: true, exportName: "Skiper41", nativeTheme: "light" },
  { id: "skiper47", name: "Skiper 47", category: "Skiper Collection", component: Skiper47, sourceFile: "skiper47.tsx", dependencies: ["framer-motion", "swiper"], exportName: "Skiper47" },
  { id: "skiper48", name: "Skiper 48", category: "Skiper Collection", component: Skiper48, sourceFile: "skiper48.tsx", dependencies: ["framer-motion", "swiper"], exportName: "Skiper48" },
  { id: "skiper49", name: "Skiper 49", category: "Skiper Collection", component: Skiper49, sourceFile: "skiper49.tsx", dependencies: ["framer-motion", "swiper"], exportName: "Skiper49" },
  { id: "skiper50", name: "Skiper 50", category: "Skiper Collection", component: Skiper50, sourceFile: "skiper50.tsx", dependencies: ["framer-motion", "swiper"], exportName: "Skiper50" },
  { id: "skiper51", name: "Skiper 51", category: "Skiper Collection", component: Skiper51, sourceFile: "skiper51.tsx", dependencies: ["framer-motion", "swiper"], exportName: "Skiper51" },
  { id: "skiper52", name: "Skiper 52", category: "Skiper Collection", component: Skiper52, sourceFile: "skiper52.tsx", dependencies: ["framer-motion"], exportName: "Skiper52", nativeTheme: "light" },
  { id: "skiper53", name: "Skiper 53", category: "Skiper Collection", component: Skiper53, sourceFile: "skiper53.tsx", dependencies: ["framer-motion"], exportName: "Skiper53" },
  { id: "skiper54", name: "Skiper 54", category: "Skiper Collection", component: Skiper54, sourceFile: "skiper54.tsx", dependencies: ["framer-motion", "embla-carousel-autoplay", "embla-carousel-react"], exportName: "Skiper54", localDeps: ["carousel.tsx"] },
  { id: "skiper58", name: "Skiper 58", category: "Skiper Collection", component: Skiper58, sourceFile: "skiper58.tsx", dependencies: ["framer-motion"], exportName: "Skiper58" },
  { id: "skiper61", name: "Skiper 61", category: "Skiper Collection", component: Skiper61, sourceFile: "skiper61.tsx", dependencies: ["framer-motion"], exportName: "Skiper61" },
  { id: "skiper62", name: "Skiper 62", category: "Skiper Collection", component: Skiper62, sourceFile: "skiper62.tsx", dependencies: ["framer-motion"], exportName: "Skiper62" },
  { id: "skiper63", name: "Skiper 63", category: "Skiper Collection", component: Skiper63, sourceFile: "skiper63.tsx", dependencies: ["framer-motion"], exportName: "Skiper63" },
  { id: "skiper64", name: "Skiper 64", category: "Skiper Collection", component: Skiper64, sourceFile: "skiper64.tsx", dependencies: ["framer-motion"], exportName: "Skiper64" },
  { id: "skiper65", name: "Skiper 65", category: "Skiper Collection", component: Skiper65, sourceFile: "skiper65.tsx", exportName: "Skiper65" },
  { id: "skiper66", name: "Skiper 66", category: "Skiper Collection", component: Skiper66, sourceFile: "skiper66.tsx", exportName: "Skiper66" },
  { id: "skiper67", name: "Skiper 67", category: "Skiper Collection", component: Skiper67, sourceFile: "skiper67.tsx", dependencies: ["media-chrome", "framer-motion"], exportName: "Skiper67" },
  { id: "skiper87", name: "Skiper 87", category: "Skiper Collection", component: Skiper87, sourceFile: "skiper87.tsx", exportName: "Skiper87", localDeps: ["scroll-area.tsx"] },

  // Luxora Collection
  { id: "luxora-ai-designer", name: "Luxora AI Designer", category: "Heroes & Sections", component: LuxoraAIDesigner, sourceFile: "luxora-ai-designer.tsx", needsFullscreen: true, exportName: "LuxoraAIDesigner" },
  { id: "sinek-panel", name: "Sinek Golden Circle", category: "Interactive", component: SinekPanel, sourceFile: "sinek-panel.tsx", needsFullscreen: true, exportName: "SinekPanel" },
  { id: "crowd-sprites", name: "Crowd Sprites", category: "Animations", component: CrowdSprites, sourceFile: "crowd-sprites.tsx", needsFullscreen: true, dependencies: ["gsap"], exportName: "CrowdSprites" },
  { id: "chromatic-erosion", name: "Chromatic Erosion", category: "Shaders & Effects", component: ChromaticErosion, sourceFile: "chromatic-erosion.tsx", needsFullscreen: true, exportName: "ChromaticErosion" },
  { id: "grok-ai", name: "Grok AI", category: "Heroes & Sections", component: GrokAI, sourceFile: "grok-ai.tsx", needsFullscreen: true, exportName: "GrokAI" },
  { id: "liquid-gallery", name: "Liquid Gallery", category: "Interactive", component: LiquidGallery, sourceFile: "liquid-gallery.tsx", needsFullscreen: true, dependencies: ["three"], exportName: "LiquidGallery" },
  { id: "portfolio", name: "Architecture Portfolio", category: "Heroes & Sections", component: Portfolio, sourceFile: "portfolio.tsx", needsFullscreen: true, dependencies: ["gsap"], exportName: "Portfolio" },
  { id: "luxora-bg-ripple", name: "Luxora BG Ripple", category: "Shaders & Effects", component: LuxoraBgRipple, sourceFile: "luxora-bg-ripple.tsx", needsFullscreen: true, exportName: "LuxoraBgRipple" },
  
  { id: "luxora-hero-text-ripple", name: "Luxora Hero Text Ripple", category: "Shaders & Effects", component: LuxoraHeroTextRipple, sourceFile: "luxora-bg-ripple.tsx", needsFullscreen: true, exportName: "LuxoraHeroTextRipple" },

  // Osmo Collection
  { id: "animated-background-grid", name: "Animated Background Grid", category: "Animations", component: OsmoAnimatedBackgroundGrid, sourceFile: "animated-background-grid.tsx", dependencies: ["motion"], exportName: "OsmoAnimatedBackgroundGrid", isDefaultExport: true },
  { id: "apple-dock-navigation", name: "Apple Dock Navigation", category: "Interactive", component: OsmoAppleDockNavigation, sourceFile: "apple-dock-navigation.tsx", exportName: "OsmoAppleDockNavigation", isDefaultExport: true },
  { id: "before-after-split-slider", name: "Before/After Slider", category: "Interactive", component: OsmoBeforeAfterSplitSlider, sourceFile: "before-after-split-slider.tsx", exportName: "OsmoBeforeAfterSplitSlider", isDefaultExport: true },
  { id: "blob-cursor", name: "Blob Cursor", category: "Cursors", component: OsmoBlobCursor, sourceFile: "blob-cursor.tsx", dependencies: ["motion"], exportName: "OsmoBlobCursor", isDefaultExport: true },
  { id: "bold-fullscreen-navigation", name: "Bold Fullscreen Nav", category: "Interactive", component: OsmoBoldFullscreenNavigation, sourceFile: "bold-fullscreen-navigation.tsx", dependencies: ["gsap"], exportName: "OsmoBoldFullscreenNavigation", isDefaultExport: true },
  { id: "color-transition-scroll", name: "Color Transition Scroll", category: "Scroll Effects", component: OsmoColorTransitionScroll, sourceFile: "color-transition-scroll.tsx", needsFullscreen: true, dependencies: ["motion"], exportName: "OsmoColorTransitionScroll", isDefaultExport: true },
  { id: "css-marquee", name: "CSS Marquee", category: "Text Effects", component: OsmoCSSMarquee, sourceFile: "css-marquee.tsx", exportName: "OsmoCSSMarquee", isDefaultExport: true },
  { id: "cursor-glow-effect", name: "Cursor Glow Effect", category: "Cursors", component: OsmoCursorGlowEffect, sourceFile: "cursor-glow-effect.tsx", dependencies: ["motion"], exportName: "OsmoCursorGlowEffect", isDefaultExport: true },
  { id: "cursor-spotlight", name: "Cursor Spotlight", category: "Cursors", component: OsmoCursorSpotlight, sourceFile: "cursor-spotlight.tsx", dependencies: ["motion"], exportName: "OsmoCursorSpotlight", isDefaultExport: true },
  { id: "directional-list-hover", name: "Directional List Hover", category: "Interactive", component: OsmoDirectionalListHover, sourceFile: "directional-list-hover.tsx", dependencies: ["gsap"], exportName: "OsmoDirectionalListHover", isDefaultExport: true },
];

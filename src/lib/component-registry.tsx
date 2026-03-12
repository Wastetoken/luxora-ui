import { ComponentType } from "react";

// Real component imports from the repo
import HorizonHeroDemo from "@/components/demos/HorizonHeroDemo";
import { HeroSection } from "@/components/repo/hero-section";
import MilHardware from "@/components/repo/mil-hardware";
import Bloodlines from "@/components/repo/bloodlines";
import LiquidChrome from "@/components/repo/liquid-chrome";
import Waves from "@/components/repo/waves";
import { LavaLamp } from "@/components/repo/fluid-blob";
import DisplayCards from "@/components/repo/display-cards";
import { SneakHover } from "@/components/repo/sneak-hover";
import { FlybyScroll } from "@/components/repo/flyby-scroll";
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
import FluidInversionCursorDemo from "@/components/demos/FluidInversionCursorDemo";
import WaitlistLandingDemo from "@/components/demos/WaitlistLandingDemo";
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
import { Skiper12 } from "@/components/repo/skiper12";
import { Skiper13 } from "@/components/repo/skiper13";
import { Skiper14 } from "@/components/repo/skiper14";
import { Skiper32 } from "@/components/repo/skiper32";
import { Skiper33 } from "@/components/repo/skiper33";
import { Skiper79 } from "@/components/repo/skiper79";
import { Skiper88 } from "@/components/repo/skiper88";
import { Skiper94 } from "@/components/repo/skiper94";
import { Skiper95 } from "@/components/repo/skiper95";
import { Skiper1 } from "@/components/repo/skiper1";
import { Skiper6 } from "@/components/repo/skiper6";
import { Skiper7 } from "@/components/repo/skiper7";
import { Skiper8 } from "@/components/repo/skiper8";
import { Skiper9 } from "@/components/repo/skiper9";
import { Skiper10 } from "@/components/repo/skiper10";
import { Skiper11 } from "@/components/repo/skiper11";
import { Skiper73 } from "@/components/repo/skiper73";
import { Skiper80 } from "@/components/repo/skiper80";
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
import { SplineScene } from "@/components/repo/spline-scene";
import { PoisonLibrary } from "@/components/repo/poison-library";

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
import OsmoDownloadButton from "@/components/repo/download-button";
import OsmoDraggableMarquee from "@/components/repo/draggable-marquee";
import OsmoDroppingCardsStack from "@/components/repo/dropping-cards-stack";
import OsmoFalling2DObjects from "@/components/repo/falling-2d-objects";
import OsmoFallingTextGravity from "@/components/repo/falling-text-gravity";
import OsmoFooterParallaxEffect from "@/components/repo/footer-parallax-effect";
import OsmoGlowingDotsGrid from "@/components/repo/glowing-dots-grid";
import OsmoGridHoverEffect from "@/components/repo/grid-hover-effect";
import OsmoHighlightTextOnScroll from "@/components/repo/highlight-text-on-scroll";
import OsmoHorizontalScrollingSections from "@/components/repo/horizontal-scrolling-sections";
import OsmoHoverExpandImage from "@/components/repo/hover-expand-image";
import OsmoHoverLiftCard from "@/components/repo/hover-lift-card";
import OsmoHoverTiltCard from "@/components/repo/hover-tilt-card";
import OsmoHoverZoomGallery from "@/components/repo/hover-zoom-gallery";
import OsmoImageRevealSlider from "@/components/repo/image-reveal-slider";
import OsmoImageToBackgroundZoom from "@/components/repo/image-to-background-zoom";
import OsmoInfiniteLogoSlider from "@/components/repo/infinite-logo-slider";
import OsmoInteractivePixelGrid from "@/components/repo/interactive-pixel-grid";
import OsmoLineRevealTestimonials from "@/components/repo/line-reveal-testimonials";
import OsmoMagneticCursor from "@/components/repo/magnetic-cursor";
import OsmoMaskedTextReveal from "@/components/repo/masked-text-reveal";
import OsmoParallaxCards from "@/components/repo/parallax-cards";
import OsmoParallaxImageGallery from "@/components/repo/parallax-image-gallery";
import OsmoPixelatedImageReveal from "@/components/repo/pixelated-image-reveal";
import OsmoRippleEffect from "@/components/repo/ripple-effect";
import OsmoRotatingImageTrail from "@/components/repo/rotating-image-trail";
import OsmoRotatingText from "@/components/repo/rotating-text";
import OsmoScalingHamburgerNavigation from "@/components/repo/scaling-hamburger-navigation";
import OsmoScrollFadeGallery from "@/components/repo/scroll-fade-gallery";
import OsmoScrollMorphHeader from "@/components/repo/scroll-morph-header";
import OsmoScrollProgressCircle from "@/components/repo/scroll-progress-circle";
import OsmoScrollSnapGallery from "@/components/repo/scroll-snap-gallery";
import OsmoScrollTicker from "@/components/repo/scroll-ticker";
import OsmoSlideInNavigation from "@/components/repo/slide-in-navigation";
import OsmoStackingCardsParallax from "@/components/repo/stacking-cards-parallax";
import OsmoStackingCardsSlider from "@/components/repo/stacking-cards-slider";
import OsmoStackingImageTrail from "@/components/repo/stacking-image-trail";
import OsmoStickyFeatures from "@/components/repo/sticky-features";
import OsmoTextBlurReveal from "@/components/repo/text-blur-reveal";
import OsmoTextGradientAnimation from "@/components/repo/text-gradient-animation";
import OsmoTextRevealLines from "@/components/repo/text-reveal-lines";
import OsmoTextScramble from "@/components/repo/text-scramble";
import OsmoTextSplitHover from "@/components/repo/text-split-hover";
import Osmo3DImageCarousel from "@/components/repo/three-d-image-carousel";
import OsmoTypewriterCursor from "@/components/repo/typewriter-cursor";
import OsmoVariableFontWeightHover from "@/components/repo/variable-font-weight-hover";

// Aceternity Collection
import AceternityHeroParallax from "@/components/repo/hero-parallax";
import AceternityLampEffect from "@/components/repo/lamp-effect";
import AceternityLens from "@/components/repo/lens";
import AceternityMeteors from "@/components/repo/meteors";
import AceternityMovingBorder from "@/components/repo/moving-border";
import NoiseBackgroundWrapper from "@/components/repo/noise-background";
import AceternityAuroraBackground from "@/components/repo/aurora-background";
import AceternityBackgroundGradient from "@/components/repo/background-gradient-animation";
import BackgroundRippleEffectWrapper from "@/components/repo/background-ripple-effect";
import CometCardWrapper from "@/components/repo/comet-card";

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
  { id: "hero-section", name: "StackPilot Hero", category: "Heroes & Sections", component: HeroSection, sourceFile: "hero-section.tsx", exportName: "HeroSection" },

  // Shaders & Effects
  { id: "bloodlines", name: "Bloodlines Shader", category: "Shaders & Effects", component: Bloodlines, sourceFile: "bloodlines.tsx", exportName: "SilkShader", isDefaultExport: true },
  { id: "liquid-chrome", name: "Liquid Chrome", category: "Shaders & Effects", component: LiquidChrome, sourceFile: "liquid-chrome.tsx", exportName: "SilkShader", isDefaultExport: true },
  { id: "waves", name: "Waves Shader", category: "Shaders & Effects", component: Waves, sourceFile: "waves.tsx", exportName: "SilkShader", isDefaultExport: true },
  { id: "singularity", name: "Singularity", category: "Shaders & Effects", component: SingularityPreview, sourceFile: "singularity.tsx", needsFullscreen: true, dependencies: ["animejs", "three"], exportName: "SingularityPreview" },
  { id: "attractor", name: "Attractor", category: "Shaders & Effects", component: AttractorPreview, sourceFile: "attractor.tsx", needsFullscreen: true, dependencies: ["animejs", "three"], exportName: "AttractorPreview" },
  { id: "morphogen", name: "Morphogen", category: "Shaders & Effects", component: MorphogenPreview, sourceFile: "morphogen.tsx", needsFullscreen: true, dependencies: ["animejs"], exportName: "MorphogenPreview" },
  { id: "erosion", name: "Erosion", category: "Shaders & Effects", component: ErosionPreview, sourceFile: "erosion.tsx", needsFullscreen: true, dependencies: ["animejs"], exportName: "ErosionPreview" },
  { id: "lenia", name: "Lenia", category: "Shaders & Effects", component: LeniaPreview, sourceFile: "lenia.tsx", needsFullscreen: true, dependencies: ["animejs"], exportName: "LeniaPreview" },

  // 3D
  { id: "spline-scene", name: "Spline 3D Scene", category: "3D", component: SplineScene, sourceFile: "spline-scene.tsx", needsFullscreen: true, dependencies: ["@splinetool/react-spline"], exportName: "SplineScene", isDefaultExport: true },

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
  { id: "fluid-inversion-cursor", name: "Fluid Inversion Cursor", category: "Cursors", component: FluidInversionCursorDemo, sourceFile: "fluid-inversion-cursor.tsx", needsFullscreen: true, exportName: "FluidInversionCursor", nativeTheme: "light" },

  // Interactive
  { id: "sneak-hover", name: "Sneak Hover", category: "Interactive", component: SneakHover, sourceFile: "sneak-hover.tsx", dependencies: ["three"], exportName: "Component" },
  { id: "menu-animations", name: "Menu Animations", category: "Interactive", component: MenuAnimationsDemo, sourceFile: "menu-animations.tsx", dependencies: ["gsap"], exportName: "MenuAnimation" },

  // Cards & Layout
  { id: "display-cards", name: "Display Cards", category: "Cards & Layout", component: DisplayCards, sourceFile: "display-cards.tsx", exportName: "DisplayCards", isDefaultExport: true },
  { id: "mil-hardware", name: "Military Hardware", category: "Cards & Layout", component: MilHardware, sourceFile: "mil-hardware.tsx", exportName: "MilHardware", isDefaultExport: true },

  // Skiper Collection
  { id: "skiper3", name: "Skiper 3", category: "Skiper Collection", component: Skiper3, sourceFile: "skiper3.tsx", dependencies: ["framer-motion"], exportName: "Skiper3" },
  { id: "skiper4", name: "Skiper 4", category: "Skiper Collection", component: Skiper4, sourceFile: "skiper4.tsx", dependencies: ["framer-motion", "lucide-react"], exportName: "Skiper4" },
  { id: "skiper16", name: "Skiper 16", category: "Skiper Collection", component: Skiper16, sourceFile: "skiper16.tsx", needsFullscreen: true, dependencies: ["framer-motion", "lenis"], exportName: "Skiper16" },
  { id: "skiper17", name: "Skiper 17", category: "Skiper Collection", component: Skiper17, sourceFile: "skiper17.tsx", needsFullscreen: true, dependencies: ["gsap", "@gsap/react", "lenis"], exportName: "Skiper17" },
  { id: "skiper25", name: "Skiper 25", category: "Skiper Collection", component: Skiper25, sourceFile: "skiper25.tsx", dependencies: ["framer-motion", "use-sound"], exportName: "Skiper25" },
  { id: "skiper26", name: "Skiper 26", category: "Skiper Collection", component: Skiper26, sourceFile: "skiper26.tsx", dependencies: ["framer-motion", "lucide-react", "next-themes"], exportName: "Skiper26" },
  { id: "skiper28", name: "Skiper 28", category: "Skiper Collection", component: Skiper28, sourceFile: "skiper28.tsx", needsFullscreen: true, dependencies: ["framer-motion", "lenis"], exportName: "Skiper28", nativeTheme: "light" },
  { id: "skiper30", name: "Skiper 30", category: "Skiper Collection", component: Skiper30, sourceFile: "skiper30.tsx", needsFullscreen: true, dependencies: ["framer-motion", "lenis"], exportName: "Skiper30" },
  { id: "skiper31", name: "Skiper 31", category: "Skiper Collection", component: Skiper31, sourceFile: "skiper31.tsx", needsFullscreen: true, dependencies: ["framer-motion", "lenis"], exportName: "Skiper31" },
  { id: "skiper34", name: "Skiper 34", category: "Skiper Collection", component: Skiper34, sourceFile: "skiper34.tsx", needsFullscreen: true, dependencies: ["framer-motion", "lenis"], exportName: "Skiper34", nativeTheme: "light" },
  { id: "skiper37", name: "Skiper 37", category: "Skiper Collection", component: Skiper37, sourceFile: "skiper37.tsx", needsFullscreen: true, dependencies: ["framer-motion", "@number-flow/react", "react-intersection-observer"], exportName: "Skiper37" },
  { id: "skiper39", name: "Skiper 39", category: "Skiper Collection", component: Skiper39, sourceFile: "skiper39.tsx", needsFullscreen: true, dependencies: ["gsap"], exportName: "Skiper39" },
  { id: "skiper40", name: "Skiper 40", category: "Skiper Collection", component: Skiper40, sourceFile: "skiper40.tsx", exportName: "Skiper40" },
  { id: "skiper41", name: "Skiper 41", category: "Skiper Collection", component: Skiper41, sourceFile: "skiper41.tsx", needsFullscreen: true, exportName: "Skiper41", nativeTheme: "light" },
  { id: "skiper47", name: "Skiper 47", category: "Skiper Collection", component: Skiper47, sourceFile: "skiper47.tsx", dependencies: ["framer-motion", "swiper", "lucide-react"], exportName: "Skiper47" },
  { id: "skiper48", name: "Skiper 48", category: "Skiper Collection", component: Skiper48, sourceFile: "skiper48.tsx", dependencies: ["framer-motion", "swiper", "lucide-react"], exportName: "Skiper48" },
  { id: "skiper49", name: "Skiper 49", category: "Skiper Collection", component: Skiper49, sourceFile: "skiper49.tsx", dependencies: ["framer-motion", "swiper"], exportName: "Skiper49" },
  { id: "skiper50", name: "Skiper 50", category: "Skiper Collection", component: Skiper50, sourceFile: "skiper50.tsx", dependencies: ["framer-motion", "swiper", "lucide-react"], exportName: "Skiper50" },
  { id: "skiper51", name: "Skiper 51", category: "Skiper Collection", component: Skiper51, sourceFile: "skiper51.tsx", dependencies: ["framer-motion", "swiper", "lucide-react"], exportName: "Skiper51" },
  { id: "skiper52", name: "Skiper 52", category: "Skiper Collection", component: Skiper52, sourceFile: "skiper52.tsx", dependencies: ["framer-motion"], exportName: "Skiper52", nativeTheme: "light" },
  { id: "skiper53", name: "Skiper 53", category: "Skiper Collection", component: Skiper53, sourceFile: "skiper53.tsx", dependencies: ["framer-motion"], exportName: "Skiper53" },
  { id: "skiper54", name: "Skiper 54", category: "Skiper Collection", component: Skiper54, sourceFile: "skiper54.tsx", dependencies: ["framer-motion", "embla-carousel-autoplay", "embla-carousel-react", "lucide-react"], exportName: "Skiper54", localDeps: ["carousel.tsx"] },
  { id: "skiper58", name: "Skiper 58", category: "Skiper Collection", component: Skiper58, sourceFile: "skiper58.tsx", dependencies: ["framer-motion"], exportName: "Skiper58" },
  { id: "skiper61", name: "Skiper 61", category: "Skiper Collection", component: Skiper61, sourceFile: "skiper61.tsx", dependencies: ["framer-motion"], exportName: "Skiper61" },
  { id: "skiper62", name: "Skiper 62", category: "Skiper Collection", component: Skiper62, sourceFile: "skiper62.tsx", dependencies: ["framer-motion"], exportName: "Skiper62" },
  { id: "skiper63", name: "Skiper 63", category: "Skiper Collection", component: Skiper63, sourceFile: "skiper63.tsx", dependencies: ["framer-motion", "lucide-react"], exportName: "Skiper63" },
  { id: "skiper64", name: "Skiper 64", category: "Skiper Collection", component: Skiper64, sourceFile: "skiper64.tsx", dependencies: ["framer-motion"], exportName: "Skiper64" },
  { id: "skiper65", name: "Skiper 65", category: "Skiper Collection", component: Skiper65, sourceFile: "skiper65.tsx", exportName: "Skiper65" },
  { id: "skiper66", name: "Skiper 66", category: "Skiper Collection", component: Skiper66, sourceFile: "skiper66.tsx", exportName: "Skiper66" },
  { id: "skiper67", name: "Skiper 67", category: "Skiper Collection", component: Skiper67, sourceFile: "skiper67.tsx", dependencies: ["media-chrome", "framer-motion", "lucide-react"], exportName: "Skiper67" },
  { id: "skiper87", name: "Skiper 87", category: "Skiper Collection", component: Skiper87, sourceFile: "skiper87.tsx", dependencies: ["@radix-ui/react-scroll-area"], exportName: "Skiper87", localDeps: ["scroll-area.tsx"] },
  { id: "skiper12", name: "Skiper 12", category: "Skiper Collection", component: Skiper12, sourceFile: "skiper12.tsx", needsFullscreen: true, dependencies: ["three", "lucide-react"], exportName: "Skiper12" },
  { id: "skiper13", name: "Skiper 13", category: "Skiper Collection", component: Skiper13, sourceFile: "skiper13.tsx", dependencies: ["framer-motion", "usehooks-ts"], exportName: "Skiper13" },
  { id: "skiper14", name: "Skiper 14", category: "Skiper Collection", component: Skiper14, sourceFile: "skiper14.tsx", needsFullscreen: true, dependencies: ["three"], exportName: "Skiper14" },
  { id: "skiper32", name: "Skiper 32", category: "Skiper Collection", component: Skiper32, sourceFile: "skiper32.tsx", needsFullscreen: true, dependencies: ["framer-motion", "gsap", "lenis"], exportName: "Skiper32" },
  { id: "skiper33", name: "Skiper 33", category: "Skiper Collection", component: Skiper33, sourceFile: "skiper33.tsx", needsFullscreen: true, dependencies: ["framer-motion", "gsap", "lenis"], exportName: "Skiper33" },
  { id: "skiper79", name: "Skiper 79", category: "Skiper Collection", component: Skiper79, sourceFile: "skiper79.tsx", needsFullscreen: true, dependencies: ["framer-motion"], exportName: "Skiper79" },
  { id: "skiper88", name: "Skiper 88", category: "Skiper Collection", component: Skiper88, sourceFile: "skiper88.tsx", needsFullscreen: true, dependencies: ["motion"], exportName: "Skiper88" },
  { id: "skiper94", name: "Skiper 94", category: "Skiper Collection", component: Skiper94, sourceFile: "skiper94.tsx", needsFullscreen: true, dependencies: ["motion"], exportName: "Skiper94" },
  { id: "skiper95", name: "Skiper 95", category: "Skiper Collection", component: Skiper95, sourceFile: "skiper95.tsx", needsFullscreen: true, dependencies: ["motion"], exportName: "Skiper95" },
  { id: "skiper1", name: "Skiper 1 – Scrollbar", category: "Skiper Collection", component: Skiper1, sourceFile: "skiper1.tsx", needsFullscreen: true, dependencies: ["framer-motion", "react-use-measure"], exportName: "Skiper1" },
  { id: "skiper6", name: "Skiper 6 – Team Hover", category: "Skiper Collection", component: Skiper6, sourceFile: "skiper6.tsx", needsFullscreen: true, dependencies: ["framer-motion"], exportName: "Skiper6" },
  { id: "skiper7", name: "Skiper 7 – Preloader 1", category: "Skiper Collection", component: Skiper7, sourceFile: "skiper7.tsx", needsFullscreen: true, dependencies: ["framer-motion"], exportName: "Skiper7" },
  { id: "skiper8", name: "Skiper 8 – Preloader 2", category: "Skiper Collection", component: Skiper8, sourceFile: "skiper8.tsx", needsFullscreen: true, dependencies: ["framer-motion"], exportName: "Skiper8", nativeTheme: "light" },
  { id: "skiper9", name: "Skiper 9 – Preloader 3", category: "Skiper Collection", component: Skiper9, sourceFile: "skiper9.tsx", needsFullscreen: true, dependencies: ["framer-motion"], exportName: "Skiper9" },
  { id: "skiper10", name: "Skiper 10 – Preloader 4", category: "Skiper Collection", component: Skiper10, sourceFile: "skiper10.tsx", needsFullscreen: true, dependencies: ["framer-motion"], exportName: "Skiper10" },
  { id: "skiper11", name: "Skiper 11 – Preloader 5", category: "Skiper Collection", component: Skiper11, sourceFile: "skiper11.tsx", needsFullscreen: true, dependencies: ["framer-motion"], exportName: "Skiper11", nativeTheme: "light" },
  { id: "skiper73", name: "Skiper 73 – Infinite Canvas", category: "Skiper Collection", component: Skiper73, sourceFile: "skiper73.tsx", needsFullscreen: true, dependencies: ["gsap"], exportName: "Skiper73" },
  { id: "skiper80", name: "Skiper 80 – Project List", category: "Skiper Collection", component: Skiper80, sourceFile: "skiper80.tsx", needsFullscreen: true, dependencies: ["framer-motion", "lucide-react"], exportName: "Skiper80" },

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
  { id: "waitlist-landing", name: "Waitlist Landing Page", category: "Heroes & Sections", component: WaitlistLandingDemo, sourceFile: "waitlist-landing.tsx", needsFullscreen: true, exportName: "WaitlistLanding", nativeTheme: "dark" },

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
  { id: "download-button", name: "Download Button", category: "Interactive", component: OsmoDownloadButton, sourceFile: "download-button.tsx", exportName: "OsmoDownloadButton", isDefaultExport: true },
  { id: "draggable-marquee", name: "Draggable Marquee", category: "Text Effects", component: OsmoDraggableMarquee, sourceFile: "draggable-marquee.tsx", dependencies: ["gsap"], exportName: "OsmoDraggableMarquee", isDefaultExport: true },
  { id: "dropping-cards-stack", name: "Dropping Cards Stack", category: "Cards & Layout", component: OsmoDroppingCardsStack, sourceFile: "dropping-cards-stack.tsx", dependencies: ["gsap"], exportName: "OsmoDroppingCardsStack", isDefaultExport: true },
  { id: "falling-2d-objects", name: "Falling 2D Objects", category: "Animations", component: OsmoFalling2DObjects, sourceFile: "falling-2d-objects.tsx", dependencies: ["matter-js"], exportName: "OsmoFalling2DObjects", isDefaultExport: true },
  { id: "falling-text-gravity", name: "Falling Text Gravity", category: "Text Effects", component: OsmoFallingTextGravity, sourceFile: "falling-text-gravity.tsx", dependencies: ["gsap"], exportName: "OsmoFallingTextGravity", isDefaultExport: true },
  { id: "footer-parallax-effect", name: "Footer Parallax", category: "Scroll Effects", component: OsmoFooterParallaxEffect, sourceFile: "footer-parallax-effect.tsx", needsFullscreen: true, dependencies: ["gsap"], exportName: "OsmoFooterParallaxEffect", isDefaultExport: true },
  { id: "glowing-dots-grid", name: "Glowing Dots Grid", category: "Interactive", component: OsmoGlowingDotsGrid, sourceFile: "glowing-dots-grid.tsx", exportName: "OsmoGlowingDotsGrid", isDefaultExport: true },
  { id: "grid-hover-effect", name: "Grid Hover Effect", category: "Interactive", component: OsmoGridHoverEffect, sourceFile: "grid-hover-effect.tsx", dependencies: ["motion"], exportName: "OsmoGridHoverEffect", isDefaultExport: true },
  { id: "highlight-text-on-scroll", name: "Highlight Text Scroll", category: "Scroll Effects", component: OsmoHighlightTextOnScroll, sourceFile: "highlight-text-on-scroll.tsx", needsFullscreen: true, dependencies: ["gsap"], exportName: "OsmoHighlightTextOnScroll", isDefaultExport: true },
  { id: "horizontal-scrolling-sections", name: "Horizontal Scroll Sections", category: "Scroll Effects", component: OsmoHorizontalScrollingSections, sourceFile: "horizontal-scrolling-sections.tsx", needsFullscreen: true, dependencies: ["gsap"], exportName: "OsmoHorizontalScrollingSections", isDefaultExport: true },
  { id: "hover-expand-image", name: "Hover Expand Image", category: "Interactive", component: OsmoHoverExpandImage, sourceFile: "hover-expand-image.tsx", dependencies: ["motion"], exportName: "OsmoHoverExpandImage", isDefaultExport: true },
  { id: "hover-lift-card", name: "Hover Lift Card", category: "Cards & Layout", component: OsmoHoverLiftCard, sourceFile: "hover-lift-card.tsx", dependencies: ["motion"], exportName: "OsmoHoverLiftCard", isDefaultExport: true },
  { id: "hover-tilt-card", name: "Hover Tilt Card", category: "Cards & Layout", component: OsmoHoverTiltCard, sourceFile: "hover-tilt-card.tsx", dependencies: ["motion"], exportName: "OsmoHoverTiltCard", isDefaultExport: true },
  { id: "hover-zoom-gallery", name: "Hover Zoom Gallery", category: "Interactive", component: OsmoHoverZoomGallery, sourceFile: "hover-zoom-gallery.tsx", dependencies: ["motion"], exportName: "OsmoHoverZoomGallery", isDefaultExport: true },
  { id: "image-reveal-slider", name: "Image Reveal Slider", category: "Interactive", component: OsmoImageRevealSlider, sourceFile: "image-reveal-slider.tsx", dependencies: ["motion"], exportName: "OsmoImageRevealSlider", isDefaultExport: true },
  { id: "image-to-background-zoom", name: "Image Background Zoom", category: "Interactive", component: OsmoImageToBackgroundZoom, sourceFile: "image-to-background-zoom.tsx", dependencies: ["gsap"], exportName: "OsmoImageToBackgroundZoom", isDefaultExport: true },
  { id: "infinite-logo-slider", name: "Infinite Logo Slider", category: "Text Effects", component: OsmoInfiniteLogoSlider, sourceFile: "infinite-logo-slider.tsx", dependencies: ["motion"], exportName: "OsmoInfiniteLogoSlider", isDefaultExport: true },
  { id: "interactive-pixel-grid", name: "Interactive Pixel Grid", category: "Interactive", component: OsmoInteractivePixelGrid, sourceFile: "interactive-pixel-grid.tsx", exportName: "OsmoInteractivePixelGrid", isDefaultExport: true },
  { id: "line-reveal-testimonials", name: "Line Reveal Testimonials", category: "Scroll Effects", component: OsmoLineRevealTestimonials, sourceFile: "line-reveal-testimonials.tsx", needsFullscreen: true, dependencies: ["gsap"], exportName: "OsmoLineRevealTestimonials", isDefaultExport: true },
  { id: "magnetic-cursor", name: "Magnetic Cursor", category: "Cursors", component: OsmoMagneticCursor, sourceFile: "magnetic-cursor.tsx", dependencies: ["gsap"], exportName: "OsmoMagneticCursor", isDefaultExport: true },
  { id: "masked-text-reveal", name: "Masked Text Reveal", category: "Scroll Effects", component: OsmoMaskedTextReveal, sourceFile: "masked-text-reveal.tsx", needsFullscreen: true, dependencies: ["gsap"], exportName: "OsmoMaskedTextReveal", isDefaultExport: true },
  { id: "parallax-cards", name: "Parallax Cards", category: "Cards & Layout", component: OsmoParallaxCards, sourceFile: "parallax-cards.tsx", needsFullscreen: true, dependencies: ["motion"], exportName: "OsmoParallaxCards", isDefaultExport: true },
  { id: "parallax-image-gallery", name: "Parallax Image Gallery", category: "Scroll Effects", component: OsmoParallaxImageGallery, sourceFile: "parallax-image-gallery.tsx", needsFullscreen: true, dependencies: ["gsap"], exportName: "OsmoParallaxImageGallery", isDefaultExport: true },
  { id: "pixelated-image-reveal", name: "Pixelated Image Reveal", category: "Scroll Effects", component: OsmoPixelatedImageReveal, sourceFile: "pixelated-image-reveal.tsx", dependencies: ["gsap"], exportName: "OsmoPixelatedImageReveal", isDefaultExport: true },
  { id: "ripple-effect", name: "Ripple Effect", category: "Interactive", component: OsmoRippleEffect, sourceFile: "ripple-effect.tsx", dependencies: ["motion"], exportName: "OsmoRippleEffect", isDefaultExport: true },
  { id: "rotating-image-trail", name: "Rotating Image Trail", category: "Cursors", component: OsmoRotatingImageTrail, sourceFile: "rotating-image-trail.tsx", dependencies: ["gsap"], exportName: "OsmoRotatingImageTrail", isDefaultExport: true },
  { id: "rotating-text", name: "Rotating Text", category: "Text Effects", component: OsmoRotatingText, sourceFile: "rotating-text.tsx", dependencies: ["gsap"], exportName: "OsmoRotatingText", isDefaultExport: true },
  { id: "scaling-hamburger-navigation", name: "Scaling Hamburger Nav", category: "Navigation", component: OsmoScalingHamburgerNavigation, sourceFile: "scaling-hamburger-navigation.tsx", dependencies: ["gsap"], exportName: "OsmoScalingHamburgerNavigation", isDefaultExport: true },
  { id: "scroll-fade-gallery", name: "Scroll Fade Gallery", category: "Scroll Effects", component: OsmoScrollFadeGallery, sourceFile: "scroll-fade-gallery.tsx", needsFullscreen: true, dependencies: ["motion"], exportName: "OsmoScrollFadeGallery", isDefaultExport: true },
  { id: "scroll-morph-header", name: "Scroll Morph Header", category: "Navigation", component: OsmoScrollMorphHeader, sourceFile: "scroll-morph-header.tsx", needsFullscreen: true, dependencies: ["motion"], exportName: "OsmoScrollMorphHeader", isDefaultExport: true },
  { id: "scroll-progress-circle", name: "Scroll Progress Circle", category: "Scroll Effects", component: OsmoScrollProgressCircle, sourceFile: "scroll-progress-circle.tsx", needsFullscreen: true, dependencies: ["motion"], exportName: "OsmoScrollProgressCircle", isDefaultExport: true },
  { id: "scroll-snap-gallery", name: "Scroll Snap Gallery", category: "Scroll Effects", component: OsmoScrollSnapGallery, sourceFile: "scroll-snap-gallery.tsx", dependencies: ["motion"], exportName: "OsmoScrollSnapGallery", isDefaultExport: true },
  { id: "scroll-ticker", name: "Scroll Ticker", category: "Text Effects", component: OsmoScrollTicker, sourceFile: "scroll-ticker.tsx", dependencies: ["motion"], exportName: "OsmoScrollTicker", isDefaultExport: true },
  { id: "slide-in-navigation", name: "Slide-In Navigation", category: "Navigation", component: OsmoSlideInNavigation, sourceFile: "slide-in-navigation.tsx", dependencies: ["motion"], exportName: "OsmoSlideInNavigation", isDefaultExport: true },
  { id: "stacking-cards-parallax", name: "Stacking Cards Parallax", category: "Scroll Effects", component: OsmoStackingCardsParallax, sourceFile: "stacking-cards-parallax.tsx", needsFullscreen: true, dependencies: ["gsap"], exportName: "OsmoStackingCardsParallax", isDefaultExport: true },
  { id: "stacking-cards-slider", name: "Stacking Cards Slider", category: "Scroll Effects", component: OsmoStackingCardsSlider, sourceFile: "stacking-cards-slider.tsx", needsFullscreen: true, dependencies: ["gsap"], exportName: "OsmoStackingCardsSlider", isDefaultExport: true },
  { id: "stacking-image-trail", name: "Stacking Image Trail", category: "Cursors", component: OsmoStackingImageTrail, sourceFile: "stacking-image-trail.tsx", dependencies: ["gsap"], exportName: "OsmoStackingImageTrail", isDefaultExport: true },
  { id: "sticky-features", name: "Sticky Features", category: "Scroll Effects", component: OsmoStickyFeatures, sourceFile: "sticky-features.tsx", needsFullscreen: true, dependencies: ["gsap"], exportName: "OsmoStickyFeatures", isDefaultExport: true },
  { id: "text-blur-reveal", name: "Text Blur Reveal", category: "Scroll Effects", component: OsmoTextBlurReveal, sourceFile: "text-blur-reveal.tsx", needsFullscreen: true, dependencies: ["motion"], exportName: "OsmoTextBlurReveal", isDefaultExport: true },
  { id: "text-gradient-animation", name: "Text Gradient Animation", category: "Text Effects", component: OsmoTextGradientAnimation, sourceFile: "text-gradient-animation.tsx", dependencies: ["motion"], exportName: "OsmoTextGradientAnimation", isDefaultExport: true },
  { id: "text-reveal-lines", name: "Text Reveal Lines", category: "Scroll Effects", component: OsmoTextRevealLines, sourceFile: "text-reveal-lines.tsx", needsFullscreen: true, dependencies: ["motion"], exportName: "OsmoTextRevealLines", isDefaultExport: true },
  { id: "text-scramble", name: "Text Scramble", category: "Text Effects", component: OsmoTextScramble, sourceFile: "text-scramble.tsx", dependencies: ["gsap"], exportName: "OsmoTextScramble", isDefaultExport: true },
  { id: "text-split-hover", name: "Text Split Hover", category: "Text Effects", component: OsmoTextSplitHover, sourceFile: "text-split-hover.tsx", dependencies: ["motion"], exportName: "OsmoTextSplitHover", isDefaultExport: true },
  { id: "three-d-image-carousel", name: "3D Image Carousel", category: "Interactive", component: Osmo3DImageCarousel, sourceFile: "three-d-image-carousel.tsx", dependencies: ["gsap"], exportName: "Osmo3DImageCarousel", isDefaultExport: true },
  { id: "typewriter-cursor", name: "Typewriter Cursor", category: "Text Effects", component: OsmoTypewriterCursor, sourceFile: "typewriter-cursor.tsx", dependencies: ["motion"], exportName: "OsmoTypewriterCursor", isDefaultExport: true },
  { id: "variable-font-weight-hover", name: "Variable Font Weight Hover", category: "Text Effects", component: OsmoVariableFontWeightHover, sourceFile: "variable-font-weight-hover.tsx", exportName: "OsmoVariableFontWeightHover", isDefaultExport: true },

  // Aceternity Collection
  { id: "hero-parallax", name: "Hero Parallax", category: "Heroes & Sections", component: AceternityHeroParallax, sourceFile: "hero-parallax.tsx", needsFullscreen: true, dependencies: ["motion"], exportName: "AceternityHeroParallaxWrapper", isDefaultExport: true },
  { id: "lamp-effect", name: "Lamp Effect", category: "Shaders & Effects", component: AceternityLampEffect, sourceFile: "lamp-effect.tsx", dependencies: ["motion"], exportName: "AceternityLampEffect", isDefaultExport: true },
  { id: "lens", name: "Lens Zoom", category: "Interactive", component: AceternityLens, sourceFile: "lens.tsx", dependencies: ["motion"], exportName: "AceternityLensWrapper", isDefaultExport: true },
  { id: "meteors", name: "Meteors", category: "Animations", component: AceternityMeteors, sourceFile: "meteors.tsx", exportName: "AceternityMeteorsWrapper", isDefaultExport: true },
  { id: "moving-border", name: "Moving Border", category: "Interactive", component: AceternityMovingBorder, sourceFile: "moving-border.tsx", dependencies: ["motion"], exportName: "AceternityMovingBorderWrapper", isDefaultExport: true },
  { id: "noise-background", name: "Noise Background", category: "Shaders & Effects", component: NoiseBackgroundWrapper, sourceFile: "noise-background.tsx", dependencies: ["motion"], exportName: "NoiseBackgroundWrapper", isDefaultExport: true },
  { id: "aurora-background", name: "Aurora Background", category: "Shaders & Effects", component: AceternityAuroraBackground, sourceFile: "aurora-background.tsx", exportName: "AceternityAuroraBackgroundWrapper", isDefaultExport: true },
  { id: "background-gradient-animation", name: "Background Gradient Animation", category: "Shaders & Effects", component: AceternityBackgroundGradient, sourceFile: "background-gradient-animation.tsx", exportName: "AceternityBackgroundGradientWrapper", isDefaultExport: true },
  { id: "background-ripple-effect", name: "Background Ripple Grid", category: "Interactive", component: BackgroundRippleEffectWrapper, sourceFile: "background-ripple-effect.tsx", exportName: "BackgroundRippleEffectWrapper", isDefaultExport: true },
  { id: "comet-card", name: "Comet Card", category: "Cards & Layout", component: CometCardWrapper, sourceFile: "comet-card.tsx", dependencies: ["motion"], exportName: "CometCardWrapper", isDefaultExport: true },

  // Poison Library Collection
  { id: "poison-library", name: "Poison Library – DAW UI", category: "Poison Library", component: PoisonLibrary, sourceFile: "poison-library.tsx", needsFullscreen: true, dependencies: ["lucide-react"], exportName: "PoisonLibrary" },
];

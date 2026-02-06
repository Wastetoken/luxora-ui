import { ComponentType } from "react";

// Real component imports from the repo
import { HorizonHero } from "@/components/repo/horizon-hero-section";
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
import { TextRoll } from "@/components/repo/text-roll-navigation";
import { Skiper19 as SvgFollowScroll } from "@/components/repo/svg-follow-scroll";

// Demo wrappers for components needing props/children
import AnimatedGalleryDemo from "@/components/demos/AnimatedGalleryDemo";
import ImageTrailDemo from "@/components/demos/ImageTrailDemo";
import WavyTextDemo from "@/components/demos/WavyTextDemo";
import MenuAnimationsDemo from "@/components/demos/MenuAnimationsDemo";
import VideoPlayerDemo from "@/components/demos/VideoPlayerDemo";

// Skiper collection
import { Skiper3 } from "@/components/repo/skiper3";
import { Skiper4 } from "@/components/repo/skiper4";
import { Skiper16 } from "@/components/repo/skiper16";
import { Skiper17 } from "@/components/repo/skiper17";
import { Skiper19 } from "@/components/repo/skiper19";
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

export interface ComponentEntry {
  id: string;
  name: string;
  category: string;
  component: ComponentType;
  sourceFile: string;
}

export const componentRegistry: ComponentEntry[] = [
  // Heroes & Sections
  { id: "horizon-hero-section", name: "Horizon Hero", category: "Heroes & Sections", component: HorizonHero, sourceFile: "horizon-hero-section.tsx" },
  { id: "hero-section", name: "StackPilot Hero", category: "Heroes & Sections", component: HeroSection, sourceFile: "hero-section.tsx" },

  // Shaders & Effects
  { id: "bloodlines", name: "Bloodlines Shader", category: "Shaders & Effects", component: Bloodlines, sourceFile: "bloodlines.tsx" },
  { id: "liquid-chrome", name: "Liquid Chrome", category: "Shaders & Effects", component: LiquidChrome, sourceFile: "liquid-chrome.tsx" },
  { id: "waves", name: "Waves Shader", category: "Shaders & Effects", component: Waves, sourceFile: "waves.tsx" },

  // Animations
  { id: "fluid-blob", name: "Fluid Blob", category: "Animations", component: LavaLamp, sourceFile: "fluid-blob.tsx" },
  { id: "circle-animations-1", name: "Circle Animations 1", category: "Animations", component: CircleAnimations1, sourceFile: "circle-animations-collection.tsx" },
  { id: "circle-animations-3", name: "Circle Animations 3", category: "Animations", component: CircleAnimations3, sourceFile: "circle-animations-collection-3.tsx" },
  { id: "circle-animations-4", name: "Circle Animations 4", category: "Animations", component: CircleAnimations4, sourceFile: "circle-animations-collection-4.tsx" },
  { id: "animated-gallery", name: "Animated Gallery", category: "Animations", component: AnimatedGalleryDemo, sourceFile: "animated-gallery.tsx" },

  // Text Effects
  { id: "text-roll-navigation", name: "Text Roll Navigation", category: "Text Effects", component: TextRoll, sourceFile: "text-roll-navigation.tsx" },
  { id: "wavy-text-block", name: "Wavy Text Block", category: "Text Effects", component: WavyTextDemo, sourceFile: "wavy-text-block.tsx" },
  { id: "parallax-text", name: "Parallax Text", category: "Text Effects", component: VelocityText, sourceFile: "parallax-scrolling-text-effect.tsx" },
  { id: "text-scroll-animation", name: "Text Scroll Animation", category: "Text Effects", component: Skiper31, sourceFile: "text-scroll-animation.tsx" },

  // Scroll Effects
  { id: "flyby-scroll", name: "Flyby Scroll", category: "Scroll Effects", component: FlybyScroll, sourceFile: "flyby-scroll.tsx" },
  { id: "svg-follow-scroll", name: "SVG Path Scroll", category: "Scroll Effects", component: SvgFollowScroll, sourceFile: "svg-follow-scroll.tsx" },
  { id: "image-trail-effect", name: "Image Trail Effect", category: "Scroll Effects", component: ImageTrailDemo, sourceFile: "image-trail-effect.tsx" },

  // Interactive
  { id: "sneak-hover", name: "Sneak Hover", category: "Interactive", component: SneakHover, sourceFile: "sneak-hover.tsx" },
  { id: "menu-animations", name: "Menu Animations", category: "Interactive", component: MenuAnimationsDemo, sourceFile: "menu-animations.tsx" },

  // Cards & Layout
  { id: "display-cards", name: "Display Cards", category: "Cards & Layout", component: DisplayCards, sourceFile: "display-cards.tsx" },
  { id: "mil-hardware", name: "Military Hardware", category: "Cards & Layout", component: MilHardware, sourceFile: "mil-hardware.tsx" },

  // Skiper Collection
  { id: "skiper3", name: "Skiper 3", category: "Skiper Collection", component: Skiper3, sourceFile: "skiper3.tsx" },
  { id: "skiper4", name: "Skiper 4", category: "Skiper Collection", component: Skiper4, sourceFile: "skiper4.tsx" },
  { id: "skiper16", name: "Skiper 16", category: "Skiper Collection", component: Skiper16, sourceFile: "skiper16.tsx" },
  { id: "skiper17", name: "Skiper 17", category: "Skiper Collection", component: Skiper17, sourceFile: "skiper17.tsx" },
  { id: "skiper19", name: "Skiper 19", category: "Skiper Collection", component: Skiper19, sourceFile: "skiper19.tsx" },
  { id: "skiper25", name: "Skiper 25", category: "Skiper Collection", component: Skiper25, sourceFile: "skiper25.tsx" },
  { id: "skiper26", name: "Skiper 26", category: "Skiper Collection", component: Skiper26, sourceFile: "skiper26.tsx" },
  { id: "skiper28", name: "Skiper 28", category: "Skiper Collection", component: Skiper28, sourceFile: "skiper28.tsx" },
  { id: "skiper30", name: "Skiper 30", category: "Skiper Collection", component: Skiper30, sourceFile: "skiper30.tsx" },
  { id: "skiper31", name: "Skiper 31", category: "Skiper Collection", component: Skiper31, sourceFile: "skiper31.tsx" },
  { id: "skiper34", name: "Skiper 34", category: "Skiper Collection", component: Skiper34, sourceFile: "skiper34.tsx" },
  { id: "skiper37", name: "Skiper 37", category: "Skiper Collection", component: Skiper37, sourceFile: "skiper37.tsx" },
  { id: "skiper39", name: "Skiper 39", category: "Skiper Collection", component: Skiper39, sourceFile: "skiper39.tsx" },
  { id: "skiper40", name: "Skiper 40", category: "Skiper Collection", component: Skiper40, sourceFile: "skiper40.tsx" },
  { id: "skiper41", name: "Skiper 41", category: "Skiper Collection", component: Skiper41, sourceFile: "skiper41.tsx" },
  { id: "skiper47", name: "Skiper 47", category: "Skiper Collection", component: Skiper47, sourceFile: "skiper47.tsx" },
  { id: "skiper48", name: "Skiper 48", category: "Skiper Collection", component: Skiper48, sourceFile: "skiper48.tsx" },
  { id: "skiper49", name: "Skiper 49", category: "Skiper Collection", component: Skiper49, sourceFile: "skiper49.tsx" },
  { id: "skiper50", name: "Skiper 50", category: "Skiper Collection", component: Skiper50, sourceFile: "skiper50.tsx" },
  { id: "skiper51", name: "Skiper 51", category: "Skiper Collection", component: Skiper51, sourceFile: "skiper51.tsx" },
  { id: "skiper52", name: "Skiper 52", category: "Skiper Collection", component: Skiper52, sourceFile: "skiper52.tsx" },
  { id: "skiper53", name: "Skiper 53", category: "Skiper Collection", component: Skiper53, sourceFile: "skiper53.tsx" },
  { id: "skiper54", name: "Skiper 54", category: "Skiper Collection", component: Skiper54, sourceFile: "skiper54.tsx" },
  { id: "skiper58", name: "Skiper 58", category: "Skiper Collection", component: Skiper58, sourceFile: "skiper58.tsx" },
  { id: "skiper61", name: "Skiper 61", category: "Skiper Collection", component: Skiper61, sourceFile: "skiper61.tsx" },
  { id: "skiper62", name: "Skiper 62", category: "Skiper Collection", component: Skiper62, sourceFile: "skiper62.tsx" },
  { id: "skiper63", name: "Skiper 63", category: "Skiper Collection", component: Skiper63, sourceFile: "skiper63.tsx" },
  { id: "skiper64", name: "Skiper 64", category: "Skiper Collection", component: Skiper64, sourceFile: "skiper64.tsx" },
  { id: "skiper65", name: "Skiper 65", category: "Skiper Collection", component: Skiper65, sourceFile: "skiper65.tsx" },
  { id: "skiper66", name: "Skiper 66", category: "Skiper Collection", component: Skiper66, sourceFile: "skiper66.tsx" },
  { id: "skiper67", name: "Skiper 67", category: "Skiper Collection", component: VideoPlayerDemo, sourceFile: "skiper67.tsx" },
  { id: "skiper87", name: "Skiper 87", category: "Skiper Collection", component: Skiper87, sourceFile: "skiper87.tsx" },
];

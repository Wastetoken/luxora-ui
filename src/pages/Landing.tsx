import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ShaderBackground from "@/components/landing/ShaderBackground";
import LiquidRipple from "@/components/landing/LiquidRipple";
import LiquidCursor from "@/components/landing/LiquidCursor";
import PerlinHoverText from "@/components/landing/PerlinHoverText";

const Landing = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white font-satoshi">
      <ShaderBackground />
      <LiquidRipple />

      {/* Noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Hide custom cursor on mobile */}
      <div className="hidden md:block">
        <LiquidCursor />
      </div>

      {/* Content layer */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between p-5 sm:p-8 md:p-14 pointer-events-none">
        {/* Header */}
        <header className="flex justify-between items-start pointer-events-auto">
          <div className="font-clash font-bold text-2xl sm:text-3xl md:text-5xl tracking-tight uppercase leading-none hover:text-white/80 transition-colors">
            LUXORA
          </div>
          <nav className="flex flex-col text-right gap-1 md:gap-2 text-[10px] sm:text-xs md:text-sm font-medium tracking-widest uppercase">
            <Link to="/showcase" className="nav-item">
              BROWSE LIBRARY
            </Link>
          </nav>
        </header>

        {/* Hero Text */}
        <div className="flex-1 flex flex-col justify-center items-center relative z-20">
          <h1 className="font-bold text-[14vw] sm:text-[12vw] md:text-[10vw] leading-[0.85] text-center tracking-tight mix-blend-difference select-none">
            <PerlinHoverText text="FAVORITE" />
            <br />
            <span className="font-clash italic font-thin opacity-80">COMPONENTS</span>
          </h1>
          <p className="mt-4 sm:mt-8 text-center max-w-md text-xs sm:text-sm md:text-base text-white/50 leading-relaxed font-light px-4">
            A collection of react components.
          </p>
          <p className="mt-3 sm:mt-8 text-center max-w-md text-xs sm:text-sm md:text-base text-white/50 leading-relaxed font-light">
            Good taste by default
          </p>
        </div>

        {/* Footer */}
        <footer className="flex flex-col sm:grid sm:grid-cols-3 items-center sm:items-end gap-4 sm:gap-0 border-t border-white/10 pt-4 sm:pt-8 pointer-events-auto">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <h3 className="font-clash text-sm sm:text-lg font-medium">PLAYGROUND</h3>
            <p className="text-[10px] sm:text-xs text-white/40 max-w-[200px]">
              COMPONENTS BUILT BY MANY, COMPILED BY LUXORA.
            </p>
          </div>

          <div className="flex gap-8 sm:gap-12 items-center justify-center">
            <div className="text-center">
              <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Status</h3>
              <p className="text-xs sm:text-sm">Online</p>
            </div>
            <div className="text-center">
              <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Year</h3>
              <p className="text-xs sm:text-sm">2026</p>
            </div>
          </div>

        </footer>
      </div>
    </div>
  );
};

export default Landing;

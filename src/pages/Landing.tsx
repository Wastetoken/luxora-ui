import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ShaderBackground from '@/components/landing/ShaderBackground';
import LiquidCursor from '@/components/landing/LiquidCursor';

const Landing = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white font-satoshi">
      <ShaderBackground />

      {/* Noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <LiquidCursor />

      {/* Content layer */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between p-8 md:p-14 pointer-events-none">
        {/* Header */}
        <header className="flex justify-between items-start pointer-events-auto">
          <div className="font-clash font-bold text-3xl md:text-5xl tracking-tight uppercase leading-none hover:text-white/80 transition-colors">
            LUXORA
          </div>
          <nav className="flex flex-col text-right gap-1 md:gap-2 text-xs md:text-sm font-medium tracking-widest uppercase">
            <Link to="/showcase" className="nav-item">
              BROWSE LIBRARY
            </Link>
          </nav>
        </header>

        {/* Dynamic Time — absolute positioned */}
        <div className="absolute top-14 right-40 hidden lg:block text-right pointer-events-none">
          <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2">&gt;&gt;&gt;&gt;&gt;&gt;&gt;</div>
          <div className="font-mono text-xs text-white/70">{time} LOCAL</div>
        </div>

        {/* Hero Text */}
        <div className="flex-1 flex flex-col justify-center items-center relative z-20">
          <h1 className="font-clash font-medium text-[10vw] leading-[0.85] text-center tracking-tight mix-blend-difference select-none">
            FAVORITE<br />
            <span className="italic font-light opacity-80 backdrop-blur-sm">COMPONENTS</span>
          </h1>
          <p className="mt-8 text-center max-w-md text-sm md:text-base text-white/50 leading-relaxed font-light">
            A collection of react components.
          </p>
          <p className="mt-8 text-center max-w-md text-sm md:text-base text-white/50 leading-relaxed font-light">
            Good taste by default
          </p>
        </div>

        {/* Footer */}
        <footer className="flex justify-between items-end border-t border-white/10 pt-8 pointer-events-auto">
          <div className="flex flex-col gap-1">
            <h3 className="font-clash text-lg font-medium">PLAYGROUND</h3>
            <p className="text-xs text-white/40 max-w-[200px]">COMPONENTS BUILT BY MANY, COMPILED BY LUXORA.</p>
          </div>

          <div className="flex gap-12 items-center">
            <div className="hidden md:block text-center">
              <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Status</h3>
              <p className="text-sm">Online</p>
            </div>
            <div className="text-center">
              <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Year</h3>
              <p className="text-sm">2026</p>
            </div>
          </div>

          <Link to="/showcase" className="text-3xl animate-bounce opacity-50">↓</Link>
        </footer>
      </div>
    </div>
  );
};

export default Landing;

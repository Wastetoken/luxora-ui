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
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white font-satoshi cursor-none">
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
      <div className="relative z-20 w-full h-full flex flex-col pointer-events-none">
        {/* Header */}
        <header className="p-6 md:p-10 lg:p-14 flex justify-between items-start pointer-events-auto">
          <span className="font-clash text-lg font-bold tracking-tight">LUXORA</span>
          <div className="flex flex-col items-end gap-1">
            <Link
              to="/showcase"
              className="nav-item text-sm uppercase tracking-widest text-white/60 hover:text-white transition-all duration-300 hover:pr-2.5 relative"
            >
              &gt;&gt;BROWSE LIBRARY
            </Link>
            <span className="text-white/50 font-mono text-[10px] uppercase tracking-widest">
              {time} LOCAL
            </span>
          </div>
        </header>

        {/* Center hero — "FAVORITE COMPONENTS" */}
        <main className="flex-1 flex flex-col items-center justify-center pointer-events-none px-4">
          <h1 className="text-center select-none mix-blend-difference">
            <span className="block font-clash font-bold text-[12vw] md:text-[11vw] lg:text-[10vw] leading-[0.9] tracking-tight">
              FAVORITE
            </span>
            <span className="block font-clash font-light italic text-[12vw] md:text-[11vw] lg:text-[10vw] leading-[0.9] tracking-tight text-white/70">
              COMPONENTS
            </span>
          </h1>
          <p className="text-white/50 text-sm md:text-base mt-8 text-center">
            A collection of react components.
          </p>
          <p className="text-white/50 text-sm mt-3 text-center italic">
            Good taste by default
          </p>
        </main>

        {/* Bottom bar */}
        <footer className="p-6 md:p-10 lg:p-14 pt-0 flex items-end justify-between border-t border-white/10 mx-6 md:mx-10 lg:mx-14 pb-6 md:pb-10 lg:pb-14 pointer-events-auto">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-white/80 font-bold mb-1">
              PLAYGROUND
            </p>
            <p className="text-[10px] uppercase tracking-widest text-white/40 max-w-[220px] leading-relaxed">
              COMPONENTS BUILT BY MANY,<br />COMPILED BY LUXORA.
            </p>
          </div>

          <div className="flex items-end gap-12">
            <div className="flex gap-8">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">Status</p>
                <p className="font-mono text-sm text-white">Online</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">Year</p>
                <p className="font-mono text-sm text-white">2026</p>
              </div>
            </div>

            <Link
              to="/showcase"
              className="font-mono text-lg text-white/50 hover:text-white/80 transition-colors"
            >
              ↓
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;

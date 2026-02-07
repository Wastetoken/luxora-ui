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
          <span className="font-clash text-lg font-medium tracking-tight">LUXORA</span>
          <nav className="flex flex-col items-end gap-1">
            <Link
              to="/showcase"
              className="nav-item text-sm uppercase tracking-widest text-white/50 hover:text-white transition-all duration-300 hover:pl-2.5 relative"
            >
              BROWSE LIBRARY
            </Link>
          </nav>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col p-6 md:p-10 lg:p-14 pt-0 md:pt-0 lg:pt-0">
          {/* Hero */}
          <div className="flex-1 flex items-end justify-between pointer-events-auto">
            <h1 className="text-[12vw] md:text-[10vw] font-clash font-bold leading-[0.85] tracking-tight mix-blend-difference select-none">
              {'LUXORA'.split('').map((letter, i) => (
                <span key={i}>{letter}{i < 5 ? '\u2009' : ''}</span>
              ))}
            </h1>
            <div className="hidden md:flex flex-col items-end gap-1 mb-2">
              <span className="text-white/40 font-mono text-xs animate-bounce opacity-80">
                &gt;&gt;&gt;&gt;&gt;&gt;&gt;
              </span>
              <span className="text-white/50 font-mono text-[10px] uppercase tracking-widest">
                {time} LOCAL
              </span>
            </div>
          </div>

          {/* Bottom section */}
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8 md:gap-12 pt-6 border-t border-white/10 mt-6 pointer-events-auto">
            <div className="flex-1">
              <h2 className="font-clash text-3xl md:text-5xl font-bold leading-none mb-2">
                FAVORITE<br />COMPONENTS
              </h2>
              <p className="text-white/40 text-sm md:text-base max-w-md leading-relaxed mb-1">
                A collection of react components.
              </p>
              <p className="font-clash text-lg font-light italic text-white/70">
                Good taste by default
              </p>
            </div>

            <div className="hidden lg:block text-right">
              <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-2">
                PLAYGROUND
              </p>
              <p className="text-[10px] uppercase tracking-widest text-white/40 max-w-[200px] ml-auto leading-relaxed">
                COMPONENTS BUILT BY MANY, COMPILED BY LUXORA.
              </p>
              <div className="flex justify-end gap-12 mt-8">
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
                className="inline-block font-mono text-sm text-white/50 hover:text-white/80 transition-colors mt-8 animate-bounce"
              >
                ↓
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Landing;

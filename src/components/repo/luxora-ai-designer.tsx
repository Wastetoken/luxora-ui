"use client";

import React, { useEffect, useRef } from "react";

const styles = `
  .luxora-ai-noise {
    position: absolute;
    top: -150%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    width: 500%;
    height: 400%;
    background: transparent url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="100.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="10.4"/%3E%3C/svg%3E');
    pointer-events: none;
    z-index: 10;
    opacity: 0.09;
    animation: luxora-ai-grain 7s steps(10) infinite;
  }

  .luxora-ai-aurora {
    background:
      radial-gradient(at 0% 0%, hsla(38, 93%, 67%, 1) 0, transparent 150%),
      radial-gradient(at 100% 0%, hsla(0, 0%, 10%, 1) 0, transparent 250%),
      radial-gradient(at 100% 100%, hsla(14, 86%, 57%, 1) 0, transparent 250%),
      radial-gradient(at 0% 100%, hsla(260, 48%, 51%, 1) 0, transparent 150%),
      radial-gradient(at 50% 50%, hsla(39, 94%, 71%, 1) 0, transparent 150%);
    background-size: 150% 150%;
  }

  .luxora-ai-glass {
    background: rgba(68, 72, 87, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 1.0);
    box-shadow: 0 35px 45px -25px rgba(0, 0, 0, 2.5);
  }

  .luxora-ai-placeholder::placeholder {
    color: rgba(255, 255, 255, 0.4);
    font-weight: 700;
  }

  @keyframes luxora-ai-grain {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-5%, 10%); }
    20% { transform: translate(-15%, 5%); }
    30% { transform: translate(7%, -25%); }
    40% { transform: translate(-5%, 25%); }
    50% { transform: translate(-15%, 10%); }
    60% { transform: translate(15%, 0%); }
    70% { transform: translate(0%, 15%); }
    80% { transform: translate(3%, 35%); }
    90% { transform: translate(-10%, 10%); }
  }

  @keyframes luxora-ai-fadeIn {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  .luxora-ai-fadein {
    animation: luxora-ai-fadeIn 0.8s ease-out forwards;
  }

  .luxora-ai-fadein-1 { animation-delay: 0.1s; opacity: 0; }
  .luxora-ai-fadein-2 { animation-delay: 0.5s; opacity: 0; }
`;

export const LuxoraAIDesigner = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const handler = () => {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    };
    textarea.addEventListener("input", handler);
    return () => textarea.removeEventListener("input", handler);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="luxora-ai-aurora relative min-h-screen w-full text-white overflow-x-hidden selection:bg-white/40 selection:text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Noise */}
        <div className="luxora-ai-noise" />

        {/* Nav */}
        <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-6 md:px-12 md:py-8 mix-blend-difference text-white">
          <div className="text-sm tracking-[0.2em] font-bold">LUXORA</div>
          <div className="hidden md:flex gap-8 text-xs font-semibold tracking-widest uppercase text-white/80">
            <a href="#" className="hover:text-white transition-colors" onClick={e => e.preventDefault()}>Docs & Support</a>
            <a href="#" className="hover:text-white transition-colors" onClick={e => e.preventDefault()}>Enterprise</a>
          </div>
        </nav>

        {/* Main */}
        <main className="relative z-20 flex flex-col items-center justify-start min-h-screen pt-32 pb-12 px-4 md:px-0">
          {/* Hero */}
          <div className="text-center w-full max-w-4xl mx-auto mb-12">
            <h1 className="text-8xl md:text-9xl tracking-tight mb-4 text-white drop-shadow-lg" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              Lu<span className="italic font-light text-white/90" style={{ fontFamily: "'Playfair Display', serif" }} />XoRA
            </h1>

            <h2 className="text-7xl md:text-2xl font-medium tracking-tighter mb-4 leading-[0.9] text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              GOOD <span className="italic font-light">TASTE</span>{" "}
              <span style={{ fontFamily: "'Cinzel Decorative', serif" }}>BY DEFAULT</span>
            </h2>

            <p className="text-xs md:text-sm tracking-widest uppercase text-white/80 mt-16 mb-12 font-medium">
              Build websites, starting from an idea or an existing design
            </p>

            {/* Command Bar */}
            <div className="w-full max-w-2xl mx-auto luxora-ai-glass rounded-2xl p-4 transition-all duration-300 hover:border-white/80 group focus-within:ring-1 focus-within:ring-white/20 luxora-ai-fadein luxora-ai-fadein-1">
              <div className="relative flex flex-col h-32">
                <label className="sr-only">AI Prompt</label>
                <textarea
                  ref={textareaRef}
                  className="w-full bg-transparent border-white/80 focus:ring-0 text-white text-lg resize-none h-full p-2 luxora-ai-placeholder outline-none"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                  placeholder="Start writing or type '/' for commands..."
                />

                <div className="absolute bottom-1 left-1 right-1 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-[#2a2a2d] hover:bg-[#353538] rounded text-xs text-gray-300 tracking-wide transition-colors border border-white/5">
                      Tools
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
                        <path d="M4 21v-7" /><path d="M4 10V3" /><path d="M12 21v-9" /><path d="M12 8V3" /><path d="M20 21v-5" /><path d="M20 12V3" /><path d="M1 14h6" /><path d="M9 8h6" /><path d="M17 16h6" />
                      </svg>
                    </button>
                    <button className="p-1.5 hover:bg-black/40 rounded text-gray-400 transition-colors" aria-label="Upload image">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                      </svg>
                    </button>
                  </div>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full border border-black/10 bg-white/5 hover:bg-black text-white hover:text-white transition-all duration-300 group-focus-within:bg-white group-focus-within:text-black" aria-label="Send prompt">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Playgrounds Section */}
          <div className="w-full max-w-4xl mx-auto mt-8 luxora-ai-fadein luxora-ai-fadein-2">
            <div className="luxora-ai-glass rounded-2xl p-6 md:p-8 min-h-[400px] flex flex-col justify-between relative overflow-hidden group hover:border-white/60 transition-all duration-500">
              <div className="absolute -top-60 -right-60 w-56 h-20 bg-black/60 rounded-full blur-[100px] group-hover:bg-black/90 transition-all duration-700" />
              <div className="flex justify-between items-start z-10">
                <h3 className="text-sm font-semibold tracking-wide text-white">My Playgrounds</h3>
              </div>
              <div className="z-10 mt-auto">
                <button className="group/item flex items-center gap-3 text-white hover:text-black/80 transition-colors">
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-black/5 group-hover/item:bg-white group-hover/item:text-black transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                  <span className="text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Start from a template</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

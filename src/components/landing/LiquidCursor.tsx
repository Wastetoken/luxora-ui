import { useEffect, useRef } from 'react';

export default function LiquidCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursor.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* SVG filter for liquid distortion */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <filter id="liquid-distortion">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" />
        </filter>
      </svg>

      <div
        ref={cursorRef}
        className="fixed w-[60px] h-[60px] pointer-events-none z-[9999]"
        style={{
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          mixBlendMode: 'exclusion',
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            inset: '-20px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            filter: 'url(#liquid-distortion)',
            boxShadow: [
              'inset 0 0 15px rgba(255, 255, 255, 0.8)',
              '-2px 0 10px rgba(0, 255, 255, 0.6)',
              '2px 0 10px rgba(255, 0, 255, 0.6)',
              '0 0 20px rgba(255, 255, 255, 0.2)',
            ].join(', '),
          }}
        />
      </div>
    </>
  );
}

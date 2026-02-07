import { useEffect, useRef } from 'react';

export default function LiquidCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    pos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    target.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      cursor.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = '0';
    };

    let animId: number;
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.12;
      pos.current.y += (target.current.y - pos.current.y) * 0.12;
      cursor.style.left = pos.current.x + 'px';
      cursor.style.top = pos.current.y + 'px';
      animId = requestAnimationFrame(animate);
    };
    animate();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const cursorSize = 80;

  return (
    <>
      {/* SVG filters for refracted liquid glass */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          {/* Main liquid glass refraction filter */}
          <filter id="liquid-glass" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
            {/* Organic noise for liquid distortion */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves={5}
              seed={3}
              result="noise"
            />
            {/* Displacement for refraction/lens distortion */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={28}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            {/* Slight blur for glass softness */}
            <feGaussianBlur in="displaced" stdDeviation={0.6} result="blurred" />
            {/* Specular lighting for glass surface highlights */}
            <feSpecularLighting
              surfaceScale={3}
              specularConstant={1.2}
              specularExponent={35}
              lightingColor="#ffffff"
              in="noise"
              result="specular"
            >
              <fePointLight x={-3000} y={-8000} z={15000} />
            </feSpecularLighting>
            {/* Mask specular to source shape */}
            <feComposite in="specular" in2="SourceGraphic" operator="in" result="specMasked" />
            {/* Blend specular onto displaced image */}
            <feComposite
              in="blurred"
              in2="specMasked"
              operator="arithmetic"
              k1={0}
              k2={1}
              k3={0.7}
              k4={0}
            />
          </filter>

          {/* Chromatic aberration filter for prismatic edges */}
          <filter id="chromatic-split" x="-20%" y="-20%" width="140%" height="140%">
            {/* Red channel offset */}
            <feOffset in="SourceGraphic" dx={-1.5} dy={0} result="redShift" />
            <feColorMatrix
              in="redShift"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="red"
            />
            {/* Green channel (center) */}
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="green"
            />
            {/* Blue channel offset */}
            <feOffset in="SourceGraphic" dx={1.5} dy={0} result="blueShift" />
            <feColorMatrix
              in="blueShift"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="blue"
            />
            {/* Composite RGB */}
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" />
          </filter>

          {/* Radial gradient for glass orb shape */}
          <radialGradient id="glass-fill" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
          </radialGradient>

          <radialGradient id="glass-rim" cx="50%" cy="50%" r="50%">
            <stop offset="75%" stopColor="rgba(255,255,255,0)" />
            <stop offset="90%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
          </radialGradient>

          <radialGradient id="glass-highlight" cx="30%" cy="25%" r="30%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
      </svg>

      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999]"
        style={{
          width: cursorSize,
          height: cursorSize,
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        {/* Backdrop blur layer for glass refraction */}
        <div
          className="absolute rounded-full"
          style={{
            inset: -10,
            backdropFilter: 'blur(6px) saturate(1.4) brightness(1.1)',
            WebkitBackdropFilter: 'blur(6px) saturate(1.4) brightness(1.1)',
            filter: 'url(#liquid-glass)',
            mixBlendMode: 'normal',
          }}
        />

        {/* SVG glass orb with refraction visuals */}
        <svg
          width={cursorSize + 20}
          height={cursorSize + 20}
          viewBox={`0 0 ${cursorSize + 20} ${cursorSize + 20}`}
          className="absolute"
          style={{
            top: -10,
            left: -10,
            filter: 'url(#chromatic-split)',
          }}
        >
          {/* Outer glass body */}
          <circle
            cx={(cursorSize + 20) / 2}
            cy={(cursorSize + 20) / 2}
            r={cursorSize / 2}
            fill="url(#glass-fill)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={0.5}
          />
          {/* Rim light */}
          <circle
            cx={(cursorSize + 20) / 2}
            cy={(cursorSize + 20) / 2}
            r={cursorSize / 2}
            fill="url(#glass-rim)"
          />
          {/* Top-left caustic highlight */}
          <ellipse
            cx={(cursorSize + 20) / 2 - 8}
            cy={(cursorSize + 20) / 2 - 10}
            rx={14}
            ry={10}
            fill="url(#glass-highlight)"
            transform={`rotate(-20 ${(cursorSize + 20) / 2 - 8} ${(cursorSize + 20) / 2 - 10})`}
          />
          {/* Small secondary highlight */}
          <ellipse
            cx={(cursorSize + 20) / 2 + 12}
            cy={(cursorSize + 20) / 2 + 14}
            rx={5}
            ry={3}
            fill="rgba(255,255,255,0.15)"
            transform={`rotate(30 ${(cursorSize + 20) / 2 + 12} ${(cursorSize + 20) / 2 + 14})`}
          />
        </svg>

        {/* Prismatic edge glow */}
        <div
          className="absolute rounded-full"
          style={{
            inset: -4,
            boxShadow: [
              'inset 0 0 20px rgba(255, 255, 255, 0.15)',
              '-2px -1px 8px rgba(0, 255, 255, 0.3)',
              '2px 1px 8px rgba(255, 0, 255, 0.3)',
              '0px -2px 6px rgba(120, 200, 255, 0.2)',
              '0 0 25px rgba(255, 255, 255, 0.08)',
            ].join(', '),
            borderRadius: '50%',
          }}
        />
      </div>
    </>
  );
}

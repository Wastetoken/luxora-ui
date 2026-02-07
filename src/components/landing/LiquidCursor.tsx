import { useEffect, useRef } from 'react';

export default function LiquidCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Initialize to center
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

    // Smooth lerp animation loop
    let animId: number;
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.1;
      pos.current.y += (target.current.y - pos.current.y) * 0.1;
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

  return (
    <>
      {/* SVG filter for liquid distortion */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="liquid-distortion">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={4} result="noise" seed={4} />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={35} xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation={0.8} />
            <feSpecularLighting surfaceScale={2} specularConstant={1} specularExponent={20} lightingColor="#ffffff" in="noise" result="specular">
              <fePointLight x={-5000} y={-10000} z={20000} />
            </feSpecularLighting>
            <feComposite in="specular" in2="SourceGraphic" operator="in" result="specularComposite" />
            <feComposite in="SourceGraphic" in2="specularComposite" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} />
          </filter>
        </defs>
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

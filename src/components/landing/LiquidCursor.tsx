import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    liquidGL: (options: Record<string, unknown>) => unknown;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function LiquidCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const targetRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let animId: number;
    const smoothness = 0.5;

    function updatePosition() {
      const dx = targetRef.current.x - posRef.current.x;
      const dy = targetRef.current.y - posRef.current.y;
      posRef.current.x += dx * smoothness;
      posRef.current.y += dy * smoothness;

      cursor!.style.left = posRef.current.x + 'px';
      cursor!.style.top = posRef.current.y + 'px';

      animId = requestAnimationFrame(updatePosition);
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      cursor.classList.add('active');
    };

    const handleMouseLeave = () => {
      cursor.classList.remove('active');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    updatePosition();

    // Load liquidGL dependencies and initialize
    let glassEffect: unknown = null;

    (async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
        await loadScript('https://cdn.jsdelivr.net/gh/naughtyduk/liquidGL/scripts/liquidGL.js');

        if (window.liquidGL && cursor) {
          glassEffect = window.liquidGL({
            snapshot: 'body',
            target: '.js-custom-cursor',
            resolution: 2.0,
            refraction: 0.015,
            bevelDepth: -0.16,
            bevelWidth: 0.25,
            frost: 0,
            shadow: true,
            specular: true,
            reveal: 'none',
            tilt: false,
            magnify: 1.1,
            on: {
              init() {
                cursor.classList.add('active');
              },
            },
          });
        }
      } catch (err) {
        console.warn('liquidGL failed to load:', err);
      }
    })();

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      glassEffect = null;
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="js-custom-cursor fixed pointer-events-none z-[10000] opacity-0 rounded-full"
      style={{
        width: 80,
        height: 80,
        transform: 'translate(-50%, -50%)',
        border: '1px solid rgba(255,255,255,0.2)',
        background:
          'linear-gradient(90deg, rgba(228,255,255,1) 0%, rgba(255,255,255,1) 38%, rgba(255,255,255,1) 84%)',
        mixBlendMode: 'multiply',
      }}
    />
  );
}

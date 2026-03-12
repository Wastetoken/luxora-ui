"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// undefined = no provider found
// null = provider exists, Lenis not yet initialized
// Lenis instance = ready
const ScrollContext = createContext<Lenis | null | undefined>(undefined);

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    setLenisInstance(lenis);

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value as number, { immediate: true });
        }
        return lenis.actualScroll;
      },
      getBoundingClientRect() {
        return {
          top: 0, left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.body.style.transform ? "transform" : "fixed",
    });

    lenis.on("scroll", ScrollTrigger.update);

    const handleRefresh = () => lenis.raf(0);
    ScrollTrigger.addEventListener("refresh", handleRefresh);

    const scrollHandler = (time: number) => {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(scrollHandler);
    };
    rafIdRef.current = requestAnimationFrame(scrollHandler);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      ScrollTrigger.removeEventListener("refresh", handleRefresh);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return (
    <ScrollContext.Provider value={lenisInstance}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return context;
};

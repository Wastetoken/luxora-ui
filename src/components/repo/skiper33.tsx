"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import ReactLenis from "lenis/react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Skiper33 = () => {
  return (
    <div className="w-screen">
      <WithGsap />
      <WithFramerMotion />
    </div>
  );
};

const WithFramerMotion = ({ className }: { className?: string }) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Image data - using available images from the project
  const images = [
    "/skiperv1/common/img1.webp",
    "/skiperv1/common/img2.webp",
    "/skiperv1/common/img3.webp",
    "/skiperv1/common/img4.webp",
    "/skiperv1/common/img5.webp",
    "/skiperv1/common/img6.webp",
    "/skiperv1/common/img7.webp",
    "/skiperv1/common/img8.webp",
    "/skiperv1/common/img9.webp",
    "/skiperv1/common/img10.webp",
    "/skiperv1/common/img11.webp",
    "/skiperv1/common/img12.webp",
    "/skiperv1/common/img13.webp",
    "/skiperv1/common/img14.webp",
    "/skiperv1/common/img15.webp",
    "/skiperv1/common/img16.webp",
    "/skiperv1/common/img17.webp",
    "/skiperv1/common/img18.webp",
    "/skiperv1/common/img19.webp",
    "/skiperv1/common/img20.webp",
  ];

  // Grid item component with individual scroll animations
  const GridItem = ({
    img,
    isLeft,
  }: {
    img: string;
    index: number;
    isLeft: boolean;
  }) => {
    const itemRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress: itemProgress } = useScroll({
      target: itemRef,
      offset: ["start end", "end start"],
    });

    // Transform values based on scroll progress
    const rotateX = useTransform(itemProgress, [0, 0.5, 1], [70, 0, -50]);
    const rotateZ = useTransform(
      itemProgress,
      [0, 0.5, 1],
      isLeft ? [5, 0, -1] : [-5, 0, 1],
    );
    const x = useTransform(
      itemProgress,
      [0, 0.5, 0.7, 1],
      isLeft ? ["-40%", "0%", "0%", "-10%"] : ["40%", "0%", "0%", "10%"],
    );
    const skewX = useTransform(
      itemProgress,
      [0, 0.5, 1],
      isLeft ? [-5, 0, 5] : [5, 0, -5],
    );
    const y = useTransform(itemProgress, [0, 0.5, 1], ["40%", "0%", "-10%"]);
    const blur = useTransform(itemProgress, [0, 0.5, 1], [7, 0, 4]);
    const brightness = useTransform(itemProgress, [0, 0.5, 1], [0, 100, 0]);
    const contrast = useTransform(itemProgress, [0, 0.5, 1], [180, 110, 180]);
    const scaleY = useTransform(itemProgress, [0, 0.5, 1], [1.8, 1, 1.1]);

    return (
      <motion.figure
        ref={itemRef}
        className="relative z-10 m-0"
        style={{
          perspective: "800px",
          willChange: "transform",
          z: 300,
        }}
      >
        <motion.div
          className="relative aspect-[1/1.2] w-full overflow-hidden rounded"
          style={{
            y,
            x,
            rotateX,
            rotateZ,
            skewX,
            filter: useTransform(
              [blur, brightness, contrast],
              ([b, br, c]) => `blur(${b}px) brightness(${br}%) contrast(${c}%)`,
            ),
            scaleY,
          }}
        >
          <motion.div
            className="absolute -left-0 -top-0 h-full w-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${img})`,
            }}
          />
        </motion.div>
      </motion.figure>
    );
  };

  return (
    <ReactLenis root>
      <div className={cn("relative w-full overflow-hidden", className)}>
        <div ref={mainRef} className="relative w-full overflow-hidden">
          {/* Intro Section */}
          <div className="top-22 absolute left-1/2 z-10 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
            <span className="after:from-background after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
              Framer motion Perspective scroll effect
            </span>
          </div>

          {/* Main Grid Section */}
          <section className="relative grid w-full place-items-center">
            <div
              ref={gridRef}
              className="relative mb-[10vh] mt-[20vh] grid w-full max-w-sm grid-cols-2 gap-8 py-[20vh]"
            >
              {[...images, ...images.slice(0, 4)].map((img, index) => {
                // Determine if item is on left side based on grid position
                const isLeft = index % 2 === 0;

                return (
                  <GridItem
                    key={index}
                    img={img}
                    index={index}
                    isLeft={isLeft}
                  />
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </ReactLenis>
  );
};

const WithGsap = ({ className }: { className?: string }) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Image data - using available images from the project
  const images = [
    "/skiperv1/common/img1.webp",
    "/skiperv1/common/img2.webp",
    "/skiperv1/common/img3.webp",
    "/skiperv1/common/img4.webp",
    "/skiperv1/common/img5.webp",
    "/skiperv1/common/img6.webp",
    "/skiperv1/common/img7.webp",
    "/skiperv1/common/img8.webp",
    "/skiperv1/common/img9.webp",
    "/skiperv1/common/img10.webp",
    "/skiperv1/common/img11.webp",
    "/skiperv1/common/img12.webp",
    "/skiperv1/common/img13.webp",
    "/skiperv1/common/img14.webp",
    "/skiperv1/common/img15.webp",
    "/skiperv1/common/img16.webp",
    "/skiperv1/common/img17.webp",
    "/skiperv1/common/img18.webp",
    "/skiperv1/common/img19.webp",
    "/skiperv1/common/img20.webp",
  ];

  // Helper function to determine if element is on left side
  const isLeftSide = (element: Element) => {
    const elementCenter =
      element.getBoundingClientRect().left +
      element.getBoundingClientRect().width / 2;
    const viewportCenter = window.innerWidth / 2;
    return elementCenter < viewportCenter;
  };

  // Animation functions
  const animateScrollGrid = () => {
    const gridImages = gridRef.current?.querySelectorAll(".grid-item-imgwrap");
    if (!gridImages) return;

    gridImages.forEach((imageWrap) => {
      const imgEl = imageWrap.querySelector(".grid-item-img");
      const leftSide = isLeftSide(imageWrap);

      gsap
        .timeline({
          scrollTrigger: {
            trigger: imageWrap,
            start: "top bottom+=10%",
            end: "bottom top-=25%",
            scrub: true,
          },
        })
        .from(imageWrap, {
          startAt: { filter: "blur(0px) brightness(100%) contrast(100%)" },
          z: 300,
          rotateX: 70,
          rotateZ: leftSide ? 5 : -5,
          xPercent: leftSide ? -40 : 40,
          skewX: leftSide ? -20 : 20,
          yPercent: 100,
          filter: "blur(7px) brightness(0%) contrast(400%)",
          ease: "sine",
        })
        .to(imageWrap, {
          z: 300,
          rotateX: -50,
          rotateZ: leftSide ? -1 : 1,
          xPercent: leftSide ? -20 : 20,
          skewX: leftSide ? 10 : -10,
          filter: "blur(4px) brightness(0%) contrast(500%)",
          ease: "sine.in",
        })
        .from(
          imgEl,
          {
            scaleY: 1.8,
            ease: "sine",
          },
          0,
        )
        .to(
          imgEl,
          {
            scaleY: 1.8,
            ease: "sine.in",
          },
          ">",
        );
    });
  };

  useEffect(() => {
    const init = () => {
      animateScrollGrid();
    };

    // Simulate image preloading
    const timer = setTimeout(() => {
      init();
      window.scrollTo(0, 0);
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div ref={mainRef} className="relative w-full overflow-hidden">
        {/* Intro Section */}
        <div className="top-22 absolute left-1/2 z-10 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
          <span className="after:from-background after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
            GSAP Perspective scroll effect
          </span>
        </div>

        {/* Main Grid Section */}
        <section className="relative grid w-full place-items-center">
          <div
            ref={gridRef}
            className="relative mb-[10vh] mt-[20vh] grid w-full max-w-sm grid-cols-2 gap-8 py-[20vh]"
          >
            {[...images, ...images.slice(0, 4)].map((img, index) => (
              <figure
                key={index}
                className="relative z-10 m-0"
                style={{
                  perspective: "800px",
                  willChange: "transform",
                }}
              >
                <div className="grid-item-imgwrap relative aspect-[1/1.2] w-full overflow-hidden rounded will-change-[filter]">
                  <div
                    className="grid-item-img backface-hidden absolute -left-0 -top-0 h-full w-full bg-cover bg-center will-change-transform"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                </div>
              </figure>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export { Skiper33, WithFramerMotion, WithGsap };

/**
 * Skiper 33 ScrollAnimation_004 — React + framer motion + Gsap + lenis
 * Inspired by and adapted from https://tympanus.net/codrops/demos/
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * These animations aren’t associated with the tympanus.net . They’re independent recreations meant to study interaction design
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.in
 * Twitter: https://x.com/Gur__vi
 */

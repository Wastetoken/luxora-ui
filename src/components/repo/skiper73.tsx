"use client";

import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import React, { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(Observer);

interface InfiniteCanvasProps {
  imageClassName?: string;
  numberOfImages?: number;
  imageRootPath?: string;
  gap?: string;
  className?: string;
}

const InfiniteCanvas = ({
  imageClassName = "w-[25vw] lg:w-[15vw]",
  numberOfImages = 15,
  imageRootPath = "/images/lummi",
  gap = "10vw",
  className,
}: InfiniteCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const halfX = container.clientWidth / 2;
    const wrapX = gsap.utils.wrap(-halfX, 0);
    const xTo = gsap.quickTo(container, "x", {
      duration: 1.5,
      ease: "power4",
      modifiers: {
        x: gsap.utils.unitize(wrapX),
      },
    });

    const halfY = container.clientHeight / 2;
    const wrapY = gsap.utils.wrap(-halfY, 0);
    const yTo = gsap.quickTo(container, "y", {
      duration: 1.5,
      ease: "power4",
      modifiers: {
        y: gsap.utils.unitize(wrapY),
      },
    });

    let incrX = 0,
      incrY = 0;

    const observer = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      onChangeX: (self) => {
        if (self.event.type === "wheel") incrX -= self.deltaX;
        else incrX += self.deltaX * 2;

        xTo(incrX);
      },
      onChangeY: (self) => {
        if (self.event.type === "wheel") incrY -= self.deltaY;
        else incrY += self.deltaY * 2;

        yTo(incrY);
      },
    });

    return () => {
      observer.kill();
    };
  }, []);

  const generateImageNames = () => {
    const images = [];
    for (let i = 1; i <= numberOfImages; i++) {
      images.push(`img${i}.png`);
    }
    return images;
  };

  const mediaItems = generateImageNames();

  const renderContent = (isDuplicate = false) => (
    <div
      className={cn(
        "pointer-events-none grid w-max grid-cols-5 p-[5vw]",
        isDuplicate && "aria-hidden",
      )}
      style={{ gap }}
    >
      {mediaItems.map((image, index) => (
        <div
          key={`${isDuplicate ? "dup" : "orig"}-${index}`}
          className={cn("aspect-square select-none", imageClassName)}
        >
          <img
            src={`${imageRootPath}/${image}`}
            alt=""
            className="block h-full w-full object-contain"
          />
        </div>
      ))}
    </div>
  );

  return (
    <section
      className={cn(
        "pointer-events-none h-screen w-full overflow-hidden",
        className,
      )}
    >
      <div
        ref={containerRef}
        className="grid w-max grid-cols-2 will-change-transform"
      >
        {renderContent()}
        {renderContent(true)}
        {renderContent(true)}
        {renderContent(true)}
      </div>
    </section>
  );
};

const Skiper73 = () => {
  return (
    <InfiniteCanvas
      imageClassName="w-[45vw] lg:w-[15vw]"
      numberOfImages={15}
      imageRootPath="/images/lummi"
      gap="5vw"
    />
  );
};

export { InfiniteCanvas, Skiper73 };

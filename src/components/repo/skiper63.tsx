"use client";

import { motion } from "framer-motion";
import { GripHorizontal, RefreshCcw } from "lucide-react";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

// to use the filter just add this to your layout.tsx
// <SkiperSquiCircleFilterLayout/>
// {children}

// on element you need to add squicircle just add the filter id SkiperSquiCircleFilter
//<div style={{filter: "url(#SquiCircleFilter)"}}></div>

// thats it you can use the filter now no extra rerenders no complications just pure css filter

export const SquiCircleFilterStatic = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-0 left-0"
      version="1.1"
    >
      <defs>
        <filter id="SkiperSquiCircleFilterLayout">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -7"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  );
};

// ------------------------------------------------------------
// use this to toggle the values no need to use this anywhere else
// else bcz it will just add more reRenders and you probably wont need that
// ------------------------------------------------------------

const Skiper63 = () => {
  const [toggle, setToggle] = useState(true);
  const [height, setHeight] = useState(200);
  const [width, setWidth] = useState(300);
  const [blurValue, setBlurValue] = useState(10);
  const [colorMatrixValue, setColorMatrixValue] = useState(20);
  const [alphaValue, setAlphaValue] = useState(-7);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-white">
      <div className="mb-20 grid content-start justify-items-center gap-6 text-center">
        <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          squicircle with svg filter
        </span>
      </div>
      <SquiCircleFilter
        blurValue={blurValue}
        colorMatrixValue={colorMatrixValue}
        alphaValue={alphaValue}
      />
      <Options
        toggle={toggle}
        setToggle={setToggle}
        height={height}
        setHeight={setHeight}
        width={width}
        setWidth={setWidth}
        blurValue={blurValue}
        setBlurValue={setBlurValue}
        colorMatrixValue={colorMatrixValue}
        setColorMatrixValue={setColorMatrixValue}
        alphaValue={alphaValue}
        setAlphaValue={setAlphaValue}
      />
      <div
        className="bg-white rounded-2xl"
        style={{
          height: `${height}px`,
          width: `${width}px`,
          filter: toggle ? "url(#SquiCircleFilter)" : "none",
        }}
      ></div>
    </div>
  );
};

export { Skiper63 };

const SquiCircleFilter = ({
  blurValue = 10,
  colorMatrixValue = 20,
  alphaValue = -7,
}: {
  blurValue?: number;
  colorMatrixValue?: number;
  alphaValue?: number;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-0 left-0"
      version="1.1"
    >
      <defs>
        <filter id="SquiCircleFilter">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={blurValue}
            result="blur"
          />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${colorMatrixValue} ${alphaValue}`}
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  );
};

const Options = ({
  toggle,
  setToggle,
  height,
  setHeight,
  width,
  setWidth,
  blurValue,
  setBlurValue,
  colorMatrixValue,
  setColorMatrixValue,
  alphaValue,
  setAlphaValue,
}: {
  toggle: boolean;
  setToggle: (value: boolean) => void;
  height: number;
  setHeight: (value: number) => void;
  width: number;
  setWidth: (value: number) => void;
  blurValue: number;
  setBlurValue: (value: number) => void;
  colorMatrixValue: number;
  setColorMatrixValue: (value: number) => void;
  alphaValue: number;
  setAlphaValue: (value: number) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const resetValues = () => {
    setToggle(false);
    setHeight(200);
    setWidth(300);
    setBlurValue(10);
    setColorMatrixValue(20);
    setAlphaValue(-7);
  };

  return (
    <motion.div
      className="top-30 border-white/10 bg-black/50 absolute right-1/2 flex w-[300px] translate-x-1/2 flex-col gap-3 rounded-3xl border p-3 backdrop-blur-sm lg:right-4 lg:translate-x-0 z-50 text-white"
      drag={isDragging}
      dragMomentum={false}
    >
      <div className="flex items-center justify-between">
        <span
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          className="size-4 cursor-grab active:cursor-grabbing"
        >
          <GripHorizontal className="size-4 opacity-50 text-white" />
        </span>

        <p
          onClick={resetValues}
          className="hover:bg-white/10 group flex cursor-pointer items-center justify-center gap-2 rounded-lg px-2 py-1 text-sm opacity-50 text-white"
        >
          Reset
          <span className="group-active:-rotate-360 rotate-0 cursor-pointer transition-all duration-300 group-hover:rotate-90">
            <RefreshCcw className="size-4 opacity-50 text-white" />
          </span>
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        {/* Toggle Control */}
        <div className="grid grid-cols-3 items-center gap-2 py-1">
          <p className="text-sm opacity-50 text-white">Filter :</p>
          <button
            onClick={() => setToggle(true)}
            className={cn(
              "bg-white/10 flex items-center justify-center rounded-lg py-1 text-left text-xs opacity-25 transition-colors text-white",
              toggle && "opacity-100",
            )}
          >
            ON
          </button>
          <button
            onClick={() => setToggle(false)}
            className={cn(
              "bg-white/10 flex items-center justify-center rounded-lg py-1 text-left text-xs opacity-25 transition-colors text-white",
              !toggle && "opacity-100",
            )}
          >
            OFF
          </button>
        </div>

        {/* Height Control */}
        <div className="grid w-full grid-cols-3 items-center py-1">
          <p className="text-sm opacity-50 text-white">Height :</p>
          <div className="flex w-full items-center justify-between gap-2">
            <input
              type="range"
              min={50}
              max={500}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="h-1.5 w-[150px] cursor-pointer appearance-none rounded-lg bg-white/20"
            />
            <span className="w-8 text-right text-xs opacity-50 text-white">
              {height}px
            </span>
          </div>
        </div>

        {/* Width Control */}
        <div className="grid w-full grid-cols-3 items-center py-1">
          <p className="text-sm opacity-50 text-white">Width :</p>
          <div className="flex items-center justify-between gap-2">
            <input
              type="range"
              min={100}
              max={600}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="h-1.5 w-[150px] cursor-pointer appearance-none rounded-lg bg-white/20"
            />
            <span className="w-8 text-right text-xs opacity-50 text-white">{width}px</span>
          </div>
        </div>

        {/* Blur Control */}
        <div className="grid w-full grid-cols-3 items-center py-1">
          <p className="text-sm opacity-50 text-white">Blur :</p>
          <div className="flex items-center justify-between gap-2">
            <input
              type="range"
              min={0}
              max={50}
              value={blurValue}
              onChange={(e) => setBlurValue(Number(e.target.value))}
              className="h-1.5 w-[150px] cursor-pointer appearance-none rounded-lg bg-white/20"
            />
            <span className="w-8 text-right text-xs opacity-50 text-white">
              {blurValue}
            </span>
          </div>
        </div>

        {/* Color Matrix Control */}
        <div className="grid w-full grid-cols-3 items-center py-1">
          <p className="text-sm opacity-50 text-white">Matrix :</p>
          <div className="flex items-center justify-between gap-2">
            <input
              type="range"
              min={1}
              max={50}
              value={colorMatrixValue}
              onChange={(e) => setColorMatrixValue(Number(e.target.value))}
              className="h-1.5 w-[150px] cursor-pointer appearance-none rounded-lg bg-white/20"
            />
            <span className="w-8 text-right text-xs opacity-50 text-white">
              {colorMatrixValue}
            </span>
          </div>
        </div>

        {/* Alpha Control */}
        <div className="grid w-full grid-cols-3 items-center py-1">
          <p className="text-sm opacity-50 text-white">Alpha :</p>
          <div className="flex items-center justify-between gap-2">
            <input
              type="range"
              min={-20}
              max={0}
              value={alphaValue}
              onChange={(e) => setAlphaValue(Number(e.target.value))}
              className="h-1.5 w-[150px] cursor-pointer appearance-none rounded-lg bg-white/20"
            />
            <span className="w-8 text-right text-xs opacity-50 text-white">
              {alphaValue}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
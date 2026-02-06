"use client";

import { motion } from "framer-motion";
import { GripHorizontal } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const Skiper26 = () => {
  const [variant, setVariant] = useState<AnimationVariant>("rectangle");
  const [start, setStart] = useState<AnimationStart>("bottom-up");
  const [blur, setBlur] = useState<boolean>(false);
  const [gifType, setGifType] = useState<"1" | "2" | "3" | "custom">("1");
  const [gifUrl, setGifUrl] = useState<string>(
    "https://media.giphy.com/media/KBbr4hHl9DSahKvInO/giphy.gif?cid=790b76112m5eeeydoe7et0cr3j3ekb1erunxozyshuhxx2vl&ep=v1_stickers_search&rid=giphy.gif&ct=s",
  );

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center min-h-[600px] text-white">
      <div className="mx-auto max-w-lg space-y-5">
        <h2 className="mt-36 text-4xl font-medium tracking-tight">
          07.09.2025 <br />
          Skiper ui is live now
        </h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, ex
          eligendi veniam praesentium temporibus natus quae laborum nemo
          repellendus cum!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, ex
          eligendi veniam praesentium temporibus natus quae laborum nemo
          repellendus cum!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, ex
          eligendi veniam praesentium temporibus natus quae laborum nemo
          repellendus cum!
        </p>
      </div>

      <div className="text-foreground grid content-start justify-items-center gap-6 py-20 text-center">
        <span className="after:from-background after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
          Click to toggle the theme
        </span>
      </div>

      <ThemeToggleButton
        variant={variant}
        start={start}
        blur={blur}
        gifUrl={gifUrl}
      />
      <Options
        variant={variant}
        start={start}
        blur={blur}
        gifType={gifType}
        gifUrl={gifUrl}
        setVariant={setVariant}
        setStart={setStart}
        setBlur={setBlur}
        setGifType={setGifType}
        setGifUrl={setGifUrl}
      />
    </div>
  );
};

export { Skiper26 };

const Options = ({
  variant,
  start,
  blur,
  gifType,
  gifUrl,
  setVariant,
  setStart,
  setBlur,
  setGifType,
  setGifUrl,
}: {
  variant: AnimationVariant;
  start: AnimationStart;
  blur: boolean;
  gifType: "1" | "2" | "3" | "custom";
  gifUrl: string;
  setVariant: (variant: AnimationVariant) => void;
  setStart: (start: AnimationStart) => void;
  setBlur: (blur: boolean) => void;
  setGifType: (type: "1" | "2" | "3" | "custom") => void;
  setGifUrl: (url: string) => void;
}) => {
  return (
    <motion.div
      drag
      className="border-white/10 bg-black/50 absolute top-4 right-4 flex w-[245px] flex-col gap-3 rounded-3xl border p-3 backdrop-blur-sm z-50 text-white"
    >
      <div className="flex items-center justify-between">
        <span className="size-4 cursor-grab active:cursor-grabbing">
          <GripHorizontal className="size-4 opacity-50" />
        </span>

        <p className="group flex cursor-pointer items-center justify-center gap-1 rounded-lg px-2 py-1 text-sm opacity-50">
          Options
        </p>
      </div>

      <div className="flex flex-col">
        <div className="mt-1 flex justify-between py-1 flex-col">
          <p className="w-20 whitespace-nowrap text-sm opacity-50 mb-1">variant :</p>
          <div className="flex flex-wrap items-center justify-start gap-1">
            <button
              onClick={() => setVariant("circle")}
              className={cn(
                "cursor-pointer px-1 text-sm transition-opacity border border-white/20 rounded",
                variant === "circle"
                  ? "opacity-100 bg-white/20"
                  : "hover:bg-foreground/10 opacity-50 hover:opacity-100",
              )}
            >
              circle
            </button>
            <button
              onClick={() => setVariant("rectangle")}
              className={cn(
                "cursor-pointer px-1 text-sm transition-opacity border border-white/20 rounded",
                variant === "rectangle"
                  ? "opacity-100 bg-white/20"
                  : "hover:bg-foreground/10 opacity-50 hover:opacity-100",
              )}
            >
              rectangle
            </button>
            <button
              onClick={() => setVariant("gif")}
              className={cn(
                "cursor-pointer px-1 text-sm transition-opacity border border-white/20 rounded",
                variant === "gif"
                  ? "opacity-100 bg-white/20"
                  : "hover:bg-foreground/10 opacity-50 hover:opacity-100",
              )}
            >
              gif
            </button>
            <button
              onClick={() => setVariant("polygon")}
              className={cn(
                "cursor-pointer px-1 text-sm transition-opacity border border-white/20 rounded",
                variant === "polygon"
                  ? "opacity-100 bg-white/20"
                  : "hover:bg-foreground/10 opacity-50 hover:opacity-100",
              )}
            >
              polygon
            </button>
            <button
              onClick={() => setVariant("circle-blur")}
              className={cn(
                "cursor-pointer px-1 text-sm transition-opacity border border-white/20 rounded",
                variant === "circle-blur"
                  ? "opacity-100 bg-white/20"
                  : "hover:bg-foreground/10 opacity-50 hover:opacity-100",
              )}
            >
              circle-blur
            </button>
          </div>
        </div>

        <div className="mt-1 flex justify-between py-1">
          <p className="w-20 whitespace-nowrap text-sm opacity-50">blur :</p>
          <div className="flex flex-wrap items-center justify-end gap-1">
            <button
              onClick={() => setBlur(false)}
              className={cn(
                "cursor-pointer px-1 text-sm transition-opacity border border-white/20 rounded",
                !blur
                  ? "opacity-100 bg-white/20"
                  : "hover:bg-foreground/10 opacity-50 hover:opacity-100",
              )}
            >
              off
            </button>
            <button
              onClick={() => setBlur(true)}
              className={cn(
                "cursor-pointer px-1 text-sm transition-opacity border border-white/20 rounded",
                blur
                  ? "opacity-100 bg-white/20"
                  : "hover:bg-foreground/10 opacity-50 hover:opacity-100",
              )}
            >
              on
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ///////////////////////////////////////////////////////////////////////////
// Custom hook for theme toggle functionality
export const useThemeToggle = ({
  variant = "circle",
  start = "center",
  blur = false,
  gifUrl = "",
}: {
  variant?: AnimationVariant;
  start?: AnimationStart;
  blur?: boolean;
  gifUrl?: string;
} = {}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [isDark, setIsDark] = useState(false);

  // Sync isDark state with resolved theme after hydration
  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const styleId = "theme-transition-styles";

  const updateStyles = useCallback((css: string, name: string) => {
    if (typeof window === "undefined") return;

    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = css;
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark(!isDark);

    const animation = createAnimation(variant, start, blur, gifUrl);

    updateStyles(animation.css, animation.name);

    if (typeof window === "undefined") return;

    const switchTheme = () => {
      setTheme(theme === "light" ? "dark" : "light");
    };

    if (!(document as any).startViewTransition) {
      switchTheme();
      return;
    }

    (document as any).startViewTransition(switchTheme);
  }, [
    theme,
    setTheme,
    variant,
    start,
    blur,
    gifUrl,
    updateStyles,
    isDark,
    setIsDark,
  ]);

  return {
    isDark,
    setIsDark,
    toggleTheme,
  };
};

// ///////////////////////////////////////////////////////////////////////////

export const ThemeToggleButton = ({
  className = "",
  variant = "circle",
  start = "center",
  blur = false,
  gifUrl = "",
}: {
  className?: string;
  variant?: AnimationVariant;
  start?: AnimationStart;
  blur?: boolean;
  gifUrl?: string;
}) => {
  const { isDark, toggleTheme } = useThemeToggle({
    variant,
    start,
    blur,
    gifUrl,
  });

  return (
    <button
      type="button"
      className={cn(
        "size-10 cursor-pointer rounded-full bg-black p-0 transition-all duration-300 active:scale-95 border border-white/20",
        className,
      )}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.g
          animate={{ rotate: isDark ? -180 : 0 }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
        >
          <path
            d="M120 67.5C149.25 67.5 172.5 90.75 172.5 120C172.5 149.25 149.25 172.5 120 172.5"
            fill="white"
          />
          <path
            d="M120 67.5C90.75 67.5 67.5 90.75 67.5 120C67.5 149.25 90.75 172.5 120 172.5"
            fill="black"
          />
        </motion.g>
        <motion.path
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
          d="M120 3.75C55.5 3.75 3.75 55.5 3.75 120C3.75 184.5 55.5 236.25 120 236.25C184.5 236.25 236.25 184.5 236.25 120C236.25 55.5 184.5 3.75 120 3.75ZM120 214.5V172.5C90.75 172.5 67.5 149.25 67.5 120C67.5 90.75 90.75 67.5 120 67.5V25.5C172.5 25.5 214.5 67.5 214.5 120C214.5 172.5 172.5 214.5 120 214.5Z"
          fill="white"
        />
      </svg>
    </button>
  );
};

// ///////////////////////////////////////////////////////////////////////////

export type AnimationVariant =
  | "circle"
  | "rectangle"
  | "gif"
  | "polygon"
  | "circle-blur";
export type AnimationStart =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center"
  | "top-center"
  | "bottom-center"
  | "bottom-up"
  | "top-down"
  | "left-right"
  | "right-left";

interface Animation {
  name: string;
  css: string;
}

const getPositionCoords = (position: AnimationStart) => {
  switch (position) {
    case "top-left":
      return { cx: "0", cy: "0" };
    case "top-right":
      return { cx: "40", cy: "0" };
    case "bottom-left":
      return { cx: "0", cy: "40" };
    case "bottom-right":
      return { cx: "40", cy: "40" };
    case "top-center":
      return { cx: "20", cy: "0" };
    case "bottom-center":
      return { cx: "20", cy: "40" };
    case "bottom-up":
    case "top-down":
    case "left-right":
    case "right-left":
      return { cx: "20", cy: "20" };
  }
};

const generateSVG = (variant: AnimationVariant, start: AnimationStart) => {
  if (variant === "circle-blur") {
    if (start === "center") {
      return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="20" cy="20" r="18" fill="white" filter="url(%23blur)"/></svg>`;
    }
    const positionCoords = getPositionCoords(start);
    if (!positionCoords) {
      throw new Error(`Invalid start position: ${start}`);
    }
    const { cx, cy } = positionCoords;
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="${cx}" cy="${cy}" r="18" fill="white" filter="url(%23blur)"/></svg>`;
  }

  if (start === "center") return;

  if (variant === "rectangle") return "";

  const positionCoords = getPositionCoords(start);
  if (!positionCoords) {
    throw new Error(`Invalid start position: ${start}`);
  }
  const { cx, cy } = positionCoords;

  if (variant === "circle") {
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="${cx}" cy="${cy}" r="20" fill="white"/></svg>`;
  }

  return "";
};

const getTransformOrigin = (start: AnimationStart) => {
  switch (start) {
    case "top-left":
      return "top left";
    case "top-right":
      return "top right";
    case "bottom-left":
      return "bottom left";
    case "bottom-right":
      return "bottom right";
    case "top-center":
      return "top center";
    case "bottom-center":
      return "bottom center";
    case "bottom-up":
    case "top-down":
    case "left-right":
    case "right-left":
      return "center";
  }
};

export const createAnimation = (
  variant: AnimationVariant,
  start: AnimationStart = "center",
  blur = false,
  url?: string,
): Animation => {
  const svg = generateSVG(variant, start);
  const transformOrigin = getTransformOrigin(start);

  if (variant === "rectangle") {
    return { name: "rectangle", css: "" };
  }
  if (variant === "circle" && start == "center") {
    return { name: "circle-center", css: "" };
  }
  if (variant === "gif") {
    return {
      name: `${variant}-${start}`,
      css: ``,
    };
  }

  if (variant === "circle-blur") {
    return { name: "circle-blur", css: "" };
  }

  if (variant === "polygon") {
    return { name: "polygon", css: "" };
  }

  if (variant === "circle" && start !== "center") {
    return { name: "circle-corner", css: "" };
  }

  return { name: "default", css: "" };
};
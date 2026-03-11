/**
 * Poison Library – Hardware-Inspired DAW Component Library
 * Self-contained demo with scoped CSS variables and all sub-components inlined.
 * Original source: poison-library project (React2Poison)
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Play, Square, Pause, RotateCcw, Power, Mic, Settings, Zap } from "lucide-react";
import poisonLibraryTitle from "@/assets/poison-library-title.png";
import poisonLogo from "@/assets/poison-logo.png";

/* ======================================================================
   CSS – injected via <style> scoped to .poison-scope
   ====================================================================== */

const POISON_CSS = `
.poison-scope {
  /* Industrial Base Colors - Midnight Steel */
  --p-background: 0 0% 5%;
  --p-foreground: 0 0% 59%;
  --p-panel-base: 0 0% 9%;
  --p-panel-highlight: 0 0% 15%;
  --p-panel-shadow: 0 0% 3%;
  --p-panel-border: 0 0% 18%;
  --p-metal-dark: 0 0% 5%;
  --p-metal-mid: 0 0% 9%;
  --p-metal-light: 0 0% 15%;
  --p-card: 0 0% 7%;
  --p-card-foreground: 0 0% 90%;
  --p-primary: 210 25% 77%;
  --p-primary-foreground: 0 0% 5%;
  --p-primary-glow: 210 30% 85%;
  --p-primary-shadow: 210 20% 55%;
  --p-primary-highlight: 210 35% 88%;
  --p-secondary: 0 0% 9%;
  --p-secondary-foreground: 0 0% 88%;
  --p-secondary-pressed: 0 0% 5%;
  --p-secondary-highlight: 0 0% 15%;
  --p-muted: 0 0% 10%;
  --p-muted-foreground: 0 0% 59%;
  --p-accent: 210 25% 77%;
  --p-accent-foreground: 0 0% 5%;
  --p-screen-bg: 220 60% 8%;
  --p-screen-border: 220 30% 25%;
  --p-screen-shadow: 220 60% 4%;
  --p-screen-glass: 220 40% 15%;
  --p-screen-reflection: 0 0% 100%;
  --p-lcd-bg: 210 80% 18%;
  --p-lcd-text: 195 100% 70%;
  --p-lcd-glow: 195 100% 60%;
  --p-lcd-scanline: 210 80% 8%;
  --p-destructive: 0 75% 52%;
  --p-destructive-foreground: 0 0% 98%;
  --p-destructive-shadow: 0 75% 30%;

  --p-gradient-panel:
    radial-gradient(ellipse at top, hsl(0 0% 12%) 0%, hsl(0 0% 7%) 50%, hsl(0 0% 5%) 100%),
    linear-gradient(135deg, hsl(0 0% 9%) 0%, hsl(0 0% 7%) 50%, hsl(0 0% 5%) 100%);
  --p-gradient-button-orange:
    radial-gradient(ellipse at 30% 20%, hsl(210 30% 85%) 0%, hsl(210 25% 77%) 40%, hsl(210 20% 65%) 100%),
    linear-gradient(135deg, hsl(210 28% 82%) 0%, hsl(210 25% 72%) 50%, hsl(210 20% 68%) 100%);
  --p-gradient-button-black:
    radial-gradient(ellipse at 30% 20%, hsl(0 0% 16%) 0%, hsl(0 0% 12%) 40%, hsl(0 0% 8%) 100%),
    linear-gradient(135deg, hsl(0 0% 14%) 0%, hsl(0 0% 10%) 50%, hsl(0 0% 6%) 100%);

  --p-shadow-panel:
    0 2px 4px -1px hsl(0 0% 2% / 0.6),
    0 8px 16px -4px hsl(0 0% 2% / 0.4),
    0 16px 32px -8px hsl(0 0% 2% / 0.3),
    inset 0 1px 0 hsl(0 0% 12% / 0.8);
  --p-shadow-button-raised:
    0 1px 2px hsl(0 0% 2% / 0.8),
    0 2px 8px hsl(0 0% 2% / 0.4),
    0 4px 16px hsl(0 0% 2% / 0.3),
    inset 0 1px 0 hsl(0 0% 100% / 0.1),
    inset 0 -1px 0 hsl(0 0% 2% / 0.3);
  --p-shadow-button-pressed:
    inset 0 2px 4px hsl(0 0% 2% / 0.6),
    inset 0 1px 2px hsl(0 0% 2% / 0.8),
    0 1px 2px hsl(0 0% 2% / 0.4);
  --p-shadow-orange-glow:
    0 0 8px hsl(210 25% 77% / 0.3),
    0 0 16px hsl(210 25% 77% / 0.2),
    0 0 24px hsl(210 25% 77% / 0.1);
  --p-texture-metal:
    repeating-linear-gradient(90deg, transparent, transparent 1px, hsl(0 0% 6% / 0.3) 1px, hsl(0 0% 6% / 0.3) 2px),
    repeating-linear-gradient(0deg, transparent, transparent 1px, hsl(0 0% 10% / 0.2) 1px, hsl(0 0% 10% / 0.2) 2px);

  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  color: hsl(var(--p-foreground));
  background:
    var(--p-texture-metal),
    radial-gradient(ellipse at center, hsl(var(--p-panel-base)) 0%, hsl(var(--p-background)) 100%);
}

/* Panel */
.poison-scope .p-panel {
  background: var(--p-gradient-panel);
  border: 1px solid hsl(var(--p-panel-border));
  border-radius: 6px;
  box-shadow: var(--p-shadow-panel);
  position: relative;
  overflow: hidden;
}
.poison-scope .p-panel::before {
  content: '';
  position: absolute; inset: 0;
  background: var(--p-texture-metal);
  opacity: 0.6;
  pointer-events: none;
}
.poison-scope .p-panel::after {
  content: '';
  position: absolute; inset: 0;
  background:
    radial-gradient(120% 90% at 20% 0%, hsl(var(--p-panel-highlight) / 0.06) 0%, transparent 45%),
    radial-gradient(140% 120% at 50% 120%, hsl(var(--p-panel-shadow) / 0.55) 0%, transparent 55%),
    radial-gradient(120% 120% at 110% 10%, hsl(var(--p-primary) / 0.06) 0%, transparent 55%);
  mix-blend-mode: screen;
  opacity: 0.75;
  pointer-events: none;
}

.poison-scope .p-panel-inset {
  position: relative;
  border-radius: 6px;
  background: linear-gradient(180deg, hsl(var(--p-metal-mid)) 0%, hsl(var(--p-metal-dark)) 100%);
  border: 1px solid hsl(var(--p-panel-border));
  box-shadow:
    inset 0 2px 6px hsl(var(--p-screen-shadow) / 0.8),
    inset 0 1px 0 hsl(0 0% 100% / 0.06),
    0 1px 2px hsl(var(--p-screen-shadow) / 0.55);
  overflow: hidden;
}
.poison-scope .p-panel-inset::before {
  content: '';
  position: absolute; inset: 0;
  background: var(--p-texture-metal);
  opacity: 0.35;
  pointer-events: none;
}

.poison-scope .p-panel-border-b {
  border-bottom: 1px solid hsl(var(--p-panel-border));
  box-shadow: inset 0 -1px 0 hsl(0 0% 100% / 0.04);
}

/* Legend */
.poison-scope .p-legend {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: hsl(var(--p-foreground));
  text-shadow:
    0 1px 0 hsl(var(--p-panel-highlight) / 0.6),
    0 -1px 0 hsl(var(--p-panel-shadow) / 0.4);
}

/* Indicator */
.poison-scope .p-indicator {
  width: 10px; height: 10px;
  border-radius: 50%;
  position: relative;
  background:
    radial-gradient(circle at 30% 30%, hsl(var(--p-metal-light)) 0%, hsl(var(--p-metal-mid)) 40%, hsl(var(--p-metal-dark)) 100%);
  border: 1px solid hsl(var(--p-panel-shadow));
  box-shadow:
    inset 0 1px 2px hsl(var(--p-panel-shadow) / 0.8),
    0 1px 3px hsl(var(--p-panel-shadow) / 0.4);
}
.poison-scope .p-indicator.active {
  background:
    radial-gradient(circle at 30% 30%, hsl(var(--p-primary-highlight)) 0%, hsl(var(--p-primary-glow)) 30%, hsl(var(--p-primary)) 70%, hsl(var(--p-primary-shadow)) 100%);
  border: 1px solid hsl(var(--p-primary-shadow));
  box-shadow:
    0 0 8px hsl(var(--p-primary) / 0.8),
    0 0 16px hsl(var(--p-primary) / 0.4),
    0 0 24px hsl(var(--p-primary) / 0.2),
    inset 0 1px 2px hsl(0 0% 100% / 0.3);
}

/* Buttons */
.poison-scope .p-btn-safety {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  white-space: nowrap; font-size: 0.75rem; font-weight: 600;
  font-family: ui-monospace, monospace;
  letter-spacing: 0.1em; text-transform: uppercase;
  position: relative; overflow: hidden;
  background: var(--p-gradient-button-orange);
  color: hsl(var(--p-primary-foreground));
  border: 1px solid hsl(var(--p-primary-shadow));
  border-radius: 4px;
  box-shadow: var(--p-shadow-button-raised);
  text-shadow: 0 1px 2px hsl(var(--p-primary-shadow) / 0.8);
  transform: translateY(0px);
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  height: 36px; padding: 0.5rem 1rem;
  cursor: pointer;
}
.poison-scope .p-btn-safety:hover {
  box-shadow: var(--p-shadow-button-raised), var(--p-shadow-orange-glow);
  transform: translateY(-0.5px);
}
.poison-scope .p-btn-safety:active {
  box-shadow: var(--p-shadow-button-pressed);
  transform: translateY(1px);
}

.poison-scope .p-btn-control {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  white-space: nowrap; font-size: 0.75rem; font-weight: 500;
  font-family: ui-monospace, monospace;
  letter-spacing: 0.1em; text-transform: uppercase;
  position: relative; overflow: hidden;
  background: var(--p-gradient-button-black);
  color: hsl(var(--p-secondary-foreground));
  border: 1px solid hsl(var(--p-panel-border));
  border-radius: 4px;
  box-shadow: var(--p-shadow-button-raised);
  text-shadow: 0 1px 2px hsl(var(--p-panel-shadow) / 0.8);
  transform: translateY(0px);
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  height: 36px; padding: 0.5rem 1rem;
  cursor: pointer;
}
.poison-scope .p-btn-control:hover { transform: translateY(-0.5px); }
.poison-scope .p-btn-control:active {
  box-shadow: var(--p-shadow-button-pressed);
  transform: translateY(1px);
}

.poison-scope .p-btn-emergency {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  white-space: nowrap; font-size: 0.75rem; font-weight: 700;
  font-family: ui-monospace, monospace;
  letter-spacing: 0.1em; text-transform: uppercase;
  position: relative; overflow: hidden;
  background:
    radial-gradient(ellipse at 30% 20%, hsl(0 75% 60%) 0%, hsl(0 75% 52%) 40%, hsl(0 75% 40%) 100%),
    linear-gradient(135deg, hsl(0 75% 55%) 0%, hsl(0 75% 45%) 50%, hsl(0 75% 38%) 100%);
  color: hsl(var(--p-destructive-foreground));
  border: 1px solid hsl(var(--p-destructive-shadow));
  border-radius: 4px;
  box-shadow: var(--p-shadow-button-raised);
  text-shadow: 0 1px 2px hsl(var(--p-destructive-shadow) / 0.8);
  height: 36px; padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
.poison-scope .p-btn-emergency:hover {
  box-shadow: var(--p-shadow-button-raised), 0 0 12px hsl(0 75% 52% / 0.4);
  transform: translateY(-0.5px);
}
.poison-scope .p-btn-emergency:active {
  box-shadow: var(--p-shadow-button-pressed);
  transform: translateY(1px);
}

.poison-scope .p-btn-status {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  white-space: nowrap; font-size: 0.75rem; font-weight: 500;
  font-family: ui-monospace, monospace;
  letter-spacing: 0.1em; text-transform: uppercase;
  background: hsl(var(--p-accent));
  color: hsl(var(--p-accent-foreground));
  border: 1px solid hsl(var(--p-accent) / 0.5);
  border-radius: 4px;
  box-shadow: 0 1px 2px hsl(0 0% 0% / 0.3);
  height: 36px; padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.15s;
}
.poison-scope .p-btn-status:hover { opacity: 0.8; }
.poison-scope .p-btn-status:active { transform: scale(0.95); }

.poison-scope .p-btn-ghost {
  display: inline-flex; align-items: center; justify-content: center;
  background: transparent;
  color: hsl(var(--p-foreground));
  border: 1px solid transparent;
  border-radius: 4px;
  height: 28px; width: 28px;
  cursor: pointer;
  transition: all 0.15s;
}
.poison-scope .p-btn-ghost:hover { background: hsl(var(--p-secondary)); }

/* Knob */
.poison-scope .p-knob {
  width: 3rem; height: 3rem;
  border-radius: 9999px;
  background: var(--p-gradient-button-black);
  border: 2px solid hsl(var(--p-panel-border));
  box-shadow: var(--p-shadow-button-raised);
  position: relative;
  cursor: grab;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  will-change: transform;
  transition: box-shadow 0.15s ease, border-color 0.15s ease;
}
.poison-scope .p-knob:hover {
  border-color: hsl(var(--p-primary) / 0.65);
  box-shadow: var(--p-shadow-button-raised), 0 0 10px hsl(var(--p-primary) / 0.14);
}
.poison-scope .p-knob:active { cursor: grabbing; box-shadow: var(--p-shadow-button-pressed); }
.poison-scope .p-knob .p-knurl {
  position: absolute; inset: 4px;
  border-radius: 9999px;
  background: repeating-conic-gradient(
    hsl(var(--p-secondary-highlight)) 0deg,
    hsl(var(--p-secondary-highlight)) 6deg,
    hsl(var(--p-secondary)) 6deg,
    hsl(var(--p-secondary)) 12deg
  );
  box-shadow: inset 0 1px 2px hsl(var(--p-panel-shadow) / 0.6);
}
.poison-scope .p-knob .p-marker {
  position: absolute; top: 4px; left: 50%;
  width: 2px; height: 12px;
  transform: translateX(-50%);
  background: linear-gradient(180deg, hsl(var(--p-primary-glow)) 0%, hsl(var(--p-primary)) 100%);
  border-radius: 1px;
  box-shadow: 0 0 6px hsl(var(--p-primary) / 0.5);
}

/* LCD Screen */
.poison-scope .p-lcd-screen {
  position: relative;
  border-radius: 4px;
  padding: 0.75rem 0.9rem;
  background: hsl(var(--p-screen-bg));
  border: 3px solid hsl(var(--p-screen-shadow));
  box-shadow:
    inset 0 3px 8px hsl(var(--p-screen-shadow) / 0.9),
    inset 0 -1px 0 hsl(var(--p-screen-glass) / 0.3),
    0 2px 4px hsl(var(--p-panel-shadow) / 0.5),
    0 4px 10px hsl(var(--p-panel-shadow) / 0.3);
  overflow: hidden;
}
.poison-scope .p-lcd-screen::before {
  content: '';
  position: absolute; inset: 2px;
  border-radius: 2px;
  background:
    radial-gradient(ellipse at 50% 30%,
      hsl(var(--p-lcd-bg)) 0%,
      hsl(var(--p-lcd-bg)) 72%,
      hsl(var(--p-lcd-scanline)) 100%);
  box-shadow:
    inset 0 1px 3px hsl(var(--p-screen-shadow) / 0.28),
    inset 0 -1px 2px hsl(var(--p-screen-reflection) / 0.10);
}
.poison-scope .p-lcd-screen::after {
  content: '';
  position: absolute; inset: 2px;
  border-radius: 2px;
  background:
    repeating-linear-gradient(0deg, transparent 0px, transparent 2px, hsl(var(--p-lcd-scanline) / 0.35) 2px, hsl(var(--p-lcd-scanline) / 0.35) 3px),
    repeating-linear-gradient(90deg, transparent 0px, transparent 2px, hsl(var(--p-lcd-scanline) / 0.16) 2px, hsl(var(--p-lcd-scanline) / 0.16) 3px),
    linear-gradient(115deg, hsl(0 0% 100% / 0.20) 0%, transparent 28%, transparent 68%, hsl(0 0% 100% / 0.08) 100%),
    radial-gradient(90% 60% at 20% 0%, hsl(0 0% 100% / 0.14) 0%, transparent 60%);
  pointer-events: none;
  opacity: 0.88;
  mix-blend-mode: overlay;
}
.poison-scope .p-lcd-screen.active::before {
  filter: brightness(1.06) contrast(1.02);
  box-shadow:
    inset 0 1px 3px hsl(var(--p-screen-shadow) / 0.22),
    inset 0 -1px 2px hsl(var(--p-screen-reflection) / 0.14),
    0 0 22px hsl(var(--p-lcd-bg) / 0.28);
}
.poison-scope .p-display-digits {
  position: relative; z-index: 1;
  color: hsl(var(--p-lcd-text));
  text-shadow: 0 0 1px hsl(var(--p-lcd-text)), 0 0 8px hsl(var(--p-lcd-glow) / 0.45);
  letter-spacing: 0.06em;
  font-weight: 600;
  font-family: ui-monospace, monospace;
}
.poison-scope .p-display-digits .p-unit {
  color: hsl(var(--p-lcd-text) / 0.72);
}

/* Slider */
.poison-scope .p-slider { width: 100%; }
.poison-scope .p-slider input[type="range"] { -webkit-appearance: none; width: 100%; background: transparent; }
.poison-scope .p-slider input[type="range"]:focus { outline: none; }
.poison-scope .p-slider .p-track {
  height: 6px;
  border-radius: 9999px;
  background: linear-gradient(180deg, hsl(var(--p-secondary)), hsl(var(--p-secondary-pressed)));
  border: 1px solid hsl(var(--p-panel-border));
  box-shadow: inset 0 2px 4px hsl(var(--p-panel-shadow) / 0.6);
  position: relative;
  overflow: hidden;
}
.poison-scope .p-slider .p-fill {
  position: absolute; top: 0; left: 0; height: 100%;
  border-radius: 9999px;
  background: linear-gradient(180deg, hsl(var(--p-primary-glow)), hsl(var(--p-primary)));
  box-shadow: inset 0 1px 0 hsl(0 0% 100% / 0.2), 0 0 8px hsl(var(--p-primary) / 0.3);
  pointer-events: none;
}
.poison-scope .p-slider input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px; height: 18px; border-radius: 9999px;
  background: var(--p-gradient-button-black);
  border: 2px solid hsl(var(--p-panel-border));
  box-shadow: var(--p-shadow-button-raised);
  margin-top: -6px;
}
.poison-scope .p-slider input[type="range"]::-moz-range-thumb {
  width: 18px; height: 18px; border-radius: 9999px;
  background: var(--p-gradient-button-black);
  border: 2px solid hsl(var(--p-panel-border));
  box-shadow: var(--p-shadow-button-raised);
}
.poison-scope .p-slider input[type="range"]::-webkit-slider-runnable-track { height: 6px; background: transparent; }
.poison-scope .p-slider input[type="range"]::-moz-range-track { height: 6px; background: transparent; }
`;

/* ======================================================================
   SUB-COMPONENTS
   ====================================================================== */

// HardwareKnob
const valueToAngle = (value: number, min: number, max: number) => {
  const clamped = Math.min(Math.max(value, min), max);
  const ratio = (clamped - min) / (max - min);
  return -135 + ratio * 270;
};

const angleToValue = (angle: number, min: number, max: number) => {
  const clampedAngle = Math.min(Math.max(angle, -135), 135);
  const ratio = (clampedAngle + 135) / 270;
  return Math.round((min + ratio * (max - min)) * 100) / 100;
};

interface HardwareKnobProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  legend?: string;
  onChange?: (value: number) => void;
  className?: string;
}

function HardwareKnob({ value, defaultValue = 50, min = 0, max = 100, step = 1, legend, onChange, className }: HardwareKnobProps) {
  const isControlled = typeof value === "number";
  const [internal, setInternal] = useState(defaultValue);
  const v = isControlled ? (value as number) : internal;
  const angle = useMemo(() => valueToAngle(v, min, max), [v, min, max]);
  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const startAngleRef = useRef(angle);
  const paramsRef = useRef({ min, max, step, isControlled, onChange });
  useEffect(() => { paramsRef.current = { min, max, step, isControlled, onChange }; }, [isControlled, max, min, onChange, step]);
  const moveRef = useRef<((e: PointerEvent) => void) | null>(null);
  const upRef = useRef<((e?: PointerEvent) => void) | null>(null);

  const stopDragging = useCallback(() => {
    draggingRef.current = false;
    if (moveRef.current) window.removeEventListener("pointermove", moveRef.current);
    if (upRef.current) { window.removeEventListener("pointerup", upRef.current); window.removeEventListener("pointercancel", upRef.current); }
    moveRef.current = null; upRef.current = null;
  }, []);

  useEffect(() => () => stopDragging(), [stopDragging]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
    draggingRef.current = true;
    startYRef.current = e.clientY;
    startAngleRef.current = valueToAngle(v, min, max);
    const onMove = (ev: PointerEvent) => {
      if (!draggingRef.current) return;
      ev.preventDefault?.();
      const { min, max, step, isControlled, onChange } = paramsRef.current;
      const dy = startYRef.current - ev.clientY;
      const nextAngle = startAngleRef.current + dy * 1.2;
      const nextValue = angleToValue(nextAngle, min, max);
      const snapped = Math.round(nextValue / step) * step;
      if (!isControlled) setInternal(snapped);
      onChange?.(snapped);
    };
    const onUp = () => stopDragging();
    moveRef.current = onMove; upRef.current = onUp;
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  }, [max, min, stopDragging, v]);

  return (
    <div className={`flex flex-col items-center gap-2 ${className ?? ""}`}>
      <div role="slider" aria-valuemin={min} aria-valuemax={max} aria-valuenow={v} onPointerDown={onPointerDown}
        className="p-knob" style={{ transform: `rotate(${angle}deg)` }}>
        <div className="p-knurl" />
        <div className="p-marker" />
      </div>
      {legend && <span className="p-legend" style={{ fontSize: "10px" }}>{legend}</span>}
    </div>
  );
}

// HardwareSlider
interface HardwareSliderProps {
  value?: number; defaultValue?: number; min?: number; max?: number; step?: number;
  legend?: string; onChange?: (value: number) => void; className?: string;
}
function HardwareSlider({ value, defaultValue = 50, min = 0, max = 100, step = 1, legend, onChange, className }: HardwareSliderProps) {
  const isControlled = typeof value === "number";
  const [internal, setInternal] = useState(defaultValue);
  const v = isControlled ? (value as number) : internal;
  const pct = useMemo(() => ((v - min) / (max - min)) * 100, [v, min, max]);

  return (
    <div className={`p-slider flex flex-col gap-2 ${className ?? ""}`}>
      {legend && <span className="p-legend" style={{ fontSize: "10px" }}>{legend}</span>}
      <div className="p-track">
        <div className="p-fill" style={{ width: `${pct}%` }} />
        <input type="range" min={min} max={max} step={step} value={v}
          onChange={(e) => { const next = Number(e.target.value); if (!isControlled) setInternal(next); onChange?.(next); }}
          aria-label={legend || "slider"} />
      </div>
    </div>
  );
}

// HardwareButton
type ButtonVariant = "safety" | "control" | "emergency" | "status" | "ghost";
interface HardwareButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  legend?: string;
  size?: "sm" | "default" | "lg";
}
const variantClass: Record<ButtonVariant, string> = {
  safety: "p-btn-safety",
  control: "p-btn-control",
  emergency: "p-btn-emergency",
  status: "p-btn-status",
  ghost: "p-btn-ghost",
};
function HardwareButton({ variant = "control", legend, children, className, size, ...props }: HardwareButtonProps) {
  const sizeStyle: React.CSSProperties = size === "sm" ? { height: 28, padding: "0.25rem 0.75rem", fontSize: "10px" }
    : size === "lg" ? { height: 44, padding: "0.5rem 1.5rem" } : {};
  return (
    <div className="flex flex-col items-center gap-1">
      <button className={`${variantClass[variant]} ${className ?? ""}`} style={sizeStyle} {...props}>{children}</button>
      {legend && <span className="p-legend" style={{ fontSize: "10px" }}>{legend}</span>}
    </div>
  );
}

// StatusDisplay
interface StatusDisplayProps { label: string; value: string | number; unit?: string; active?: boolean; className?: string; }
function StatusDisplay({ label, value, unit, active = false, className }: StatusDisplayProps) {
  return (
    <div className={`p-panel p-4 ${className ?? ""}`}>
      <div className="flex items-center justify-between mb-2" style={{ position: "relative", zIndex: 1 }}>
        <span className="p-legend" style={{ fontSize: "10px" }}>{label}</span>
        <div className={`p-indicator ${active ? "active" : ""}`} />
      </div>
      <div className={`p-lcd-screen ${active ? "active" : ""}`}>
        <div className="p-display-digits" style={{ fontFamily: "ui-monospace, monospace", fontSize: "1.5rem", fontWeight: 700 }}>
          {value}
          {unit && <span className="p-unit" style={{ fontSize: "0.875rem", marginLeft: 4 }}>{unit}</span>}
        </div>
      </div>
    </div>
  );
}

// VUMeter
function VUMeter({ value, label, segments = 12, className = "" }: { value: number; label?: string; segments?: number; className?: string }) {
  const activeSegments = useMemo(() => Math.round((value / 100) * segments), [value, segments]);
  const getColor = (i: number, t: number) => { const r = i / t; if (r > 0.85) return "red"; if (r > 0.7) return "yellow"; return "green"; };
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {label && <span className="p-legend" style={{ fontSize: "9px" }}>{label}</span>}
      <div style={{
        display: "flex", flexDirection: "column-reverse", gap: 2, padding: 4, borderRadius: 4,
        background: `linear-gradient(180deg, hsl(var(--p-secondary-pressed)) 0%, hsl(var(--p-secondary)) 100%)`,
        border: "1px solid hsl(var(--p-panel-border))",
        boxShadow: "inset 0 2px 6px hsl(0 0% 0% / 0.35), 0 1px 0 hsl(var(--p-panel-highlight) / 0.5)",
        width: 20, height: 100,
      }}>
        {Array.from({ length: segments }, (_, i) => {
          const isActive = i < activeSegments;
          const color = getColor(i, segments);
          const grad = color === "red" ? "hsl(0 85% 50%)" : color === "yellow" ? "hsl(45 100% 50%)" : "hsl(120 70% 40%)";
          return <div key={i} style={{
            flex: 1, borderRadius: 1,
            background: isActive ? grad : "hsl(var(--p-muted) / 0.4)",
            boxShadow: isActive ? `0 0 4px ${grad}55` : "none",
            border: `1px solid ${isActive ? `${grad}88` : "hsl(var(--p-panel-border) / 0.5)"}`,
            transition: "all 0.08s ease-out",
          }} />;
        })}
      </div>
    </div>
  );
}

function StereoVUMeter({ leftValue, rightValue, label, className = "" }: { leftValue: number; rightValue: number; label?: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {label && <span className="p-legend" style={{ fontSize: "10px" }}>{label}</span>}
      <div className="flex gap-1">
        <VUMeter value={leftValue} segments={16} />
        <VUMeter value={rightValue} segments={16} />
      </div>
      <div className="flex gap-3" style={{ fontSize: "8px", color: "hsl(var(--p-muted-foreground))", fontFamily: "ui-monospace, monospace" }}>
        <span>L</span><span>R</span>
      </div>
    </div>
  );
}

function MeterBridge({ channels, className = "" }: { channels: { label: string; value: number }[]; className?: string }) {
  return (
    <div className={`flex justify-center gap-3 p-2 ${className}`}>
      {channels.map((ch, i) => <VUMeter key={i} value={ch.value} label={ch.label} segments={12} />)}
    </div>
  );
}

/* ======================================================================
   MAIN DEMO COMPONENT
   ====================================================================== */

export function PoisonLibrary() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [masterVolume, setMasterVolume] = useState(75);
  const [position, setPosition] = useState(0);
  const [ch1, setCh1] = useState(75);
  const [ch2, setCh2] = useState(68);
  const [ch3, setCh3] = useState(82);
  const [gain, setGain] = useState(65);
  const [pan, setPan] = useState(50);
  const [eq, setEq] = useState(45);
  const [reverb, setReverb] = useState(30);
  const [delay, setDelay] = useState(15);
  const [drive, setDrive] = useState(40);
  const [tone, setTone] = useState(60);
  const [cutoff, setCutoff] = useState(75);
  const [resonance, setResonance] = useState(25);
  const [ratio, setRatio] = useState(55);
  const [attack, setAttack] = useState(35);
  const [threshold, setThreshold] = useState(80);
  const [release, setRelease] = useState(45);
  const [distortionOn, setDistortionOn] = useState(true);
  const [filterOn, setFilterOn] = useState(false);
  const [compressorOn, setCompressorOn] = useState(true);
  const [limiterOn, setLimiterOn] = useState(false);
  const [inputGain, setInputGain] = useState(50);
  const [isRecording, setIsRecording] = useState(false);
  const [recTime, setRecTime] = useState(0);

  // Animated VU meter values
  const [vuLevels, setVuLevels] = useState({ ch1: 0, ch2: 0, ch3: 0, masterL: 0, masterR: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isPlaying) { setVuLevels({ ch1: 0, ch2: 0, ch3: 0, masterL: 0, masterR: 0 }); return; }
    const animate = () => {
      setVuLevels((prev) => {
        const noise = () => (Math.random() - 0.5) * 20;
        const decay = 0.85;
        const t1 = (ch1 * gain / 100) * 0.9 + noise();
        const t2 = (ch2 * pan / 50) * 0.85 + noise();
        const t3 = (ch3 * eq / 50) * 0.8 + noise();
        const n1 = Math.max(0, Math.min(100, prev.ch1 * decay + t1 * (1 - decay)));
        const n2 = Math.max(0, Math.min(100, prev.ch2 * decay + t2 * (1 - decay)));
        const n3 = Math.max(0, Math.min(100, prev.ch3 * decay + t3 * (1 - decay)));
        const sL = ((n1 + n2 * 0.7 + n3 * 0.5) / 2.2) * (masterVolume / 100);
        const sR = ((n1 * 0.8 + n2 + n3 * 0.6) / 2.4) * (masterVolume / 100);
        return { ch1: n1, ch2: n2, ch3: n3, masterL: Math.max(0, Math.min(100, sL + noise() * 0.5)), masterR: Math.max(0, Math.min(100, sR + noise() * 0.5)) };
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [isPlaying, ch1, ch2, ch3, gain, pan, eq, masterVolume]);

  const cpuUsage = Math.round(20 + (drive / 100) * 15 + (reverb / 100) * 10);
  const bufferSize = 128;
  const latency = (2.7 + bufferSize / 512).toFixed(1);
  const temperature = Math.round(38 + cpuUsage * 0.2);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStop = () => { setIsPlaying(false); setPosition(0); };
  const handleReset = () => { setIsPlaying(false); setPosition(0); setTempo(120); };
  const handlePanic = () => { setIsPlaying(false); setIsRecording(false); setPosition(0); setMasterVolume(0); };

  const formatPosition = (pos: number) => {
    const mins = Math.floor(pos / 60);
    const secs = Math.floor(pos % 60);
    const ms = Math.floor((pos % 1) * 1000);
    return `${mins}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
  };
  const formatRecTime = (secs: number) => { const m = Math.floor(secs / 60); const s = secs % 60; return `${m}:${s.toString().padStart(2, "0")}`; };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setPosition((p) => p + 0.1), 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => setRecTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <>
      <style>{POISON_CSS}</style>
      <div className="poison-scope w-full h-full overflow-auto" style={{ minHeight: "100%" }}>
        {/* Header */}
        <header className="p-panel-border-b p-6">
          <div className="max-w-7xl mx-auto flex h-20 items-center gap-4">
            <img src={poisonLogo} alt="Poison Logo" className="h-14 w-auto flex-shrink-0 invert" />
            <img src={poisonLibraryTitle} alt="Poison Library" className="min-w-0 flex-1 h-12 w-auto max-w-full object-contain object-left invert" />
            <div className="flex items-center gap-4 flex-shrink-0">
              <StatusDisplay label="CPU" value={cpuUsage} unit="%" active={isPlaying} />
              <StatusDisplay label="RAM" value={8.2} unit="GB" active />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Transport + Mixer + Master */}
          <section className="p-panel p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={{ position: "relative", zIndex: 1 }}>
              {/* Transport */}
              <div className="space-y-6">
                <h2 className="p-legend" style={{ fontSize: "1.25rem" }}>TRANSPORT</h2>
                <div className="grid grid-cols-2 gap-4">
                  <HardwareButton variant="safety" legend="PLAY" onClick={handlePlay}><Play className="w-5 h-5" /></HardwareButton>
                  <HardwareButton variant="control" legend="STOP" onClick={handleStop}><Square className="w-5 h-5" /></HardwareButton>
                  <HardwareButton variant="control" legend="PAUSE" onClick={handlePause}><Pause className="w-5 h-5" /></HardwareButton>
                  <HardwareButton variant="control" legend="RESET" onClick={handleReset}><RotateCcw className="w-5 h-5" /></HardwareButton>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <HardwareKnob legend="TEMPO" value={tempo} onChange={setTempo} min={60} max={200} />
                    <div className="flex-1"><StatusDisplay label="TEMPO" value={tempo} unit="BPM" active={isPlaying} /></div>
                  </div>
                  <StatusDisplay label="POSITION" value={formatPosition(position)} active={isPlaying} />
                </div>
              </div>

              {/* Mixer */}
              <div className="space-y-6">
                <h2 className="p-legend" style={{ fontSize: "1.25rem" }}>MIXER</h2>
                <MeterBridge channels={[{ label: "CH1", value: vuLevels.ch1 }, { label: "CH2", value: vuLevels.ch2 }, { label: "CH3", value: vuLevels.ch3 }]} />
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-4">
                    <HardwareSlider legend="CH 1" value={ch1} onChange={setCh1} />
                    <div className="space-y-2">
                      <HardwareKnob legend="GAIN" value={gain} onChange={setGain} />
                      <div className="p-lcd-screen p-2"><div className="p-display-digits" style={{ fontSize: "0.875rem", textAlign: "center" }}>{gain}<span className="p-unit" style={{ fontSize: "10px", marginLeft: 4 }}>%</span></div></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <HardwareSlider legend="CH 2" value={ch2} onChange={setCh2} />
                    <div className="space-y-2">
                      <HardwareKnob legend="PAN" value={pan} onChange={setPan} />
                      <div className="p-lcd-screen p-2"><div className="p-display-digits" style={{ fontSize: "0.875rem", textAlign: "center" }}>{pan === 50 ? "C" : pan < 50 ? `L${50 - pan}` : `R${pan - 50}`}</div></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <HardwareSlider legend="CH 3" value={ch3} onChange={setCh3} />
                    <div className="space-y-2">
                      <HardwareKnob legend="EQ" value={eq} onChange={setEq} />
                      <div className="p-lcd-screen p-2"><div className="p-display-digits" style={{ fontSize: "0.875rem", textAlign: "center" }}>{eq}<span className="p-unit" style={{ fontSize: "10px", marginLeft: 4 }}>%</span></div></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Master */}
              <div className="space-y-6">
                <h2 className="p-legend" style={{ fontSize: "1.25rem" }}>MASTER</h2>
                <div className="space-y-6">
                  <StereoVUMeter leftValue={vuLevels.masterL} rightValue={vuLevels.masterR} label="OUTPUT" />
                  <HardwareSlider legend="MASTER" value={masterVolume} onChange={setMasterVolume} />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <HardwareKnob legend="REVERB" value={reverb} onChange={setReverb} />
                      <div className="p-lcd-screen p-2"><div className="p-display-digits" style={{ fontSize: "0.875rem", textAlign: "center" }}>{reverb}<span className="p-unit" style={{ fontSize: "10px", marginLeft: 4 }}>%</span></div></div>
                    </div>
                    <div className="space-y-2">
                      <HardwareKnob legend="DELAY" value={delay} onChange={setDelay} />
                      <div className="p-lcd-screen p-2"><div className="p-display-digits" style={{ fontSize: "0.875rem", textAlign: "center" }}>{delay}<span className="p-unit" style={{ fontSize: "10px", marginLeft: 4 }}>%</span></div></div>
                    </div>
                  </div>
                  <StatusDisplay label="LEVEL" value={masterVolume} unit="%" active />
                </div>
              </div>
            </div>
          </section>

          {/* Effects Rack */}
          <section className="p-panel p-8">
            <h2 className="p-legend" style={{ fontSize: "1.25rem", marginBottom: "1.5rem", position: "relative", zIndex: 1 }}>EFFECTS RACK</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ position: "relative", zIndex: 1 }}>
              {[
                { name: "DISTORTION", on: distortionOn, toggle: () => setDistortionOn(!distortionOn), knobs: [{ legend: "DRIVE", value: drive, onChange: setDrive }, { legend: "TONE", value: tone, onChange: setTone }] },
                { name: "FILTER", on: filterOn, toggle: () => setFilterOn(!filterOn), knobs: [{ legend: "CUTOFF", value: cutoff, onChange: setCutoff }, { legend: "RES", value: resonance, onChange: setResonance }] },
                { name: "COMPRESSOR", on: compressorOn, toggle: () => setCompressorOn(!compressorOn), knobs: [{ legend: "RATIO", value: ratio, onChange: setRatio }, { legend: "ATTACK", value: attack, onChange: setAttack }] },
                { name: "LIMITER", on: limiterOn, toggle: () => setLimiterOn(!limiterOn), knobs: [{ legend: "THRESH", value: threshold, onChange: setThreshold }, { legend: "RELEASE", value: release, onChange: setRelease }] },
              ].map((fx) => (
                <div key={fx.name} className={`p-panel-inset p-4 space-y-4 ${!fx.on ? "opacity-60" : ""}`}>
                  <div className="flex items-center justify-between" style={{ position: "relative", zIndex: 1 }}>
                    <div className="flex items-center gap-2">
                      <div className={`p-indicator ${fx.on ? "active" : ""}`} />
                      <h3 className="p-legend" style={{ fontSize: "0.875rem" }}>{fx.name}</h3>
                    </div>
                    <HardwareButton variant="ghost" size="sm" onClick={fx.toggle}>
                      {fx.name === "LIMITER" ? <Zap className="w-3 h-3" /> : <Power className="w-3 h-3" />}
                    </HardwareButton>
                  </div>
                  {fx.knobs.map((k) => (
                    <div key={k.legend} style={{ position: "relative", zIndex: 1 }}>
                      <HardwareKnob legend={k.legend} value={k.value} onChange={k.onChange} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* Performance + System */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Performance Pads */}
            <div className="p-panel p-8">
              <h2 className="p-legend" style={{ fontSize: "1.25rem", marginBottom: "1.5rem", position: "relative", zIndex: 1 }}>PERFORMANCE PADS</h2>
              <div className="grid grid-cols-4 gap-4" style={{ position: "relative", zIndex: 1 }}>
                {Array.from({ length: 16 }, (_, i) => (
                  <HardwareButton key={i} variant={i % 4 === 0 ? "safety" : i % 4 === 1 ? "control" : "status"} size="lg" legend={`PAD ${i + 1}`} />
                ))}
              </div>
            </div>

            {/* System */}
            <div className="p-panel p-8">
              <h2 className="p-legend" style={{ fontSize: "1.25rem", marginBottom: "1.5rem", position: "relative", zIndex: 1 }}>SYSTEM</h2>
              <div className="space-y-6" style={{ position: "relative", zIndex: 1 }}>
                <div className="grid grid-cols-2 gap-4">
                  <StatusDisplay label="SAMPLE RATE" value="48" unit="kHz" active />
                  <StatusDisplay label="BUFFER" value={bufferSize} unit="smp" />
                  <StatusDisplay label="LATENCY" value={latency} unit="ms" active />
                  <StatusDisplay label="TEMP" value={temperature} unit="°C" active={temperature > 45} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <HardwareButton variant="emergency" legend="PANIC" onClick={handlePanic}><Power className="w-5 h-5" /></HardwareButton>
                  <HardwareButton variant="control" legend="SAVE"><Settings className="w-5 h-5" /></HardwareButton>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <HardwareButton variant={isRecording ? "emergency" : "safety"} legend="REC"
                      onClick={() => { if (isRecording) { setIsRecording(false); } else { setRecTime(0); setIsRecording(true); } }}>
                      <Mic className="w-4 h-4" />
                    </HardwareButton>
                    <div className="flex-1"><StatusDisplay label="REC TIME" value={formatRecTime(recTime)} active={isRecording} /></div>
                  </div>
                  <HardwareSlider legend="INPUT GAIN" value={inputGain} onChange={setInputGain} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default PoisonLibrary;

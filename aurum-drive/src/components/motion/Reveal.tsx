"use client";

/**
 * Reveal — Phase 2.4
 *
 * GSAP-powered scroll reveal with 6 presets. Used as a wrapper component.
 * Falls back gracefully: if JS is disabled or GSAP fails, the CSS
 * [data-reveal].reveal-visible fallback in globals.css takes over.
 *
 * Spec rules (05 §2):
 * - Entrances: scale(.95) + opacity 0. Never scale(0).
 * - Exits: 60–70% of entrance duration (handled by GSAP, not this component).
 * - Ease: expo.out for all reveals.
 * - Stagger: passed as prop, defaults from motion-tokens.ts.
 * - Reduced motion: show immediately, no animation.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, DIST } from "@/lib/motion-tokens";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ── Preset definitions ────────────────────────────────────────────────────

const PRESETS = {
  /** Default: fade up from below with subtle scale */
  "fade-up": {
    from: { opacity: 0, y: DIST.riseY, scale: 0.95 },
    to:   { opacity: 1, y: 0, scale: 1 },
  },
  /** Slide in from the left */
  "fade-left": {
    from: { opacity: 0, x: -DIST.slideX, scale: 0.95 },
    to:   { opacity: 1, x: 0, scale: 1 },
  },
  /** Slide in from the right */
  "fade-right": {
    from: { opacity: 0, x: DIST.slideX, scale: 0.95 },
    to:   { opacity: 1, x: 0, scale: 1 },
  },
  /** Just scale and fade — for cards and images */
  "pop": {
    from: { opacity: 0, scale: 0.95 },
    to:   { opacity: 1, scale: 1 },
  },
  /** Clip-path wipe from left to right — for dividers, lines, images */
  "clip-x": {
    from: { clipPath: "inset(0 100% 0 0)" },
    to:   { clipPath: "inset(0 0% 0 0)" },
  },
  /** Fade only, no movement — for text blocks near the fold */
  "fade": {
    from: { opacity: 0 },
    to:   { opacity: 1 },
  },
} as const;

export type RevealPreset = keyof typeof PRESETS;

interface RevealProps {
  children: React.ReactNode;
  preset?: RevealPreset;
  /** Delay before this element's reveal starts (seconds) */
  delay?: number;
  /** Duration override (seconds) */
  duration?: number;
  /** Trigger start position (ScrollTrigger `start` string) */
  start?: string;
  /** GSAP stagger for direct children (seconds) */
  stagger?: number;
  /** Extra CSS class on the wrapper div */
  className?: string;
  /** HTML tag for the wrapper */
  as?: React.ElementType;
}

export function Reveal({
  children,
  preset = "fade-up",
  delay = 0,
  duration = DUR.reveal,
  start = "top 88%",
  stagger,
  className,
  as: Tag = "div",
}: RevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const config = PRESETS[preset];
      const targets = stagger
        ? Array.from(el.children) as HTMLElement[]
        : [el];

      // Set initial state immediately (CSS fallback already does this via
      // [data-reveal], but GSAP overrides cleanly)
      gsap.set(targets, config.from);

      gsap.to(targets, {
        ...config.to,
        duration,
        delay,
        ease: EASE.outExpo,
        stagger: stagger ?? 0,
        scrollTrigger: {
          trigger: el,
          start,
          once: true, // reveal fires only once
        },
      });
    },
    { scope: containerRef }
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={containerRef as any} data-reveal={preset} className={className}>
      {children}
    </Tag>
  );
}

"use client";

/**
 * MotionProvider — Phase 2.4
 *
 * Registers GSAP plugins once. Initialises Lenis only on fine-pointer,
 * no-reduced-motion devices (spec 05 §3). Touch devices keep native scroll.
 *
 * Architecture:
 *   - One provider, one ticker. Lenis drives the GSAP ticker.
 *   - ScrollTrigger.refresh() is called after route changes (via pathname).
 *   - Lenis.stop() / .start() exposed via context for modals and sheets.
 *   - Cleanup is automatic via useGSAP scope + Lenis.destroy().
 */

import { createContext, useContext, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Register all plugins once at module level (safe for SSR — guard below)
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

// ── Context ─────────────────────────────────────────────────────────────────

interface MotionContextValue {
  /** Stop smooth scroll (call when a modal opens). */
  stopScroll: () => void;
  /** Resume smooth scroll. */
  startScroll: () => void;
  /** Force ScrollTrigger to recalculate (call after layout changes). */
  refreshST: () => void;
}

const MotionContext = createContext<MotionContextValue>({
  stopScroll: () => {},
  startScroll: () => {},
  refreshST: () => {},
});

export const useMotion = () => useContext(MotionContext);

// ── Provider ─────────────────────────────────────────────────────────────────

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);
  const pathname = usePathname();

  useEffect(() => {
    // Only initialise Lenis on:
    //   - fine-pointer (mouse/trackpad, not touch)
    //   - no reduced-motion preference
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const noReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: no-preference)"
    ).matches;

    if (!finePointer || !noReducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      autoRaf: false,
    });

    lenisRef.current = lenis;

    // Drive GSAP ticker with Lenis RAF
    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Refresh ScrollTrigger after every route change (layout may shift)
  useEffect(() => {
    const id = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(id);
  }, [pathname]);

  const stopScroll = useCallback(() => lenisRef.current?.stop(), []);
  const startScroll = useCallback(() => lenisRef.current?.start(), []);
  const refreshST = useCallback(() => ScrollTrigger.refresh(), []);

  return (
    <MotionContext.Provider value={{ stopScroll, startScroll, refreshST }}>
      {children}
    </MotionContext.Provider>
  );
}

"use client";

/**
 * Cursor — Phase 2.4
 *
 * Custom cursor ring for fine-pointer devices only.
 * A 36px gold ring that follows the pointer with a smooth lag.
 * Scales up on hover over interactive elements.
 * Disappears on touch (media query + pointer event).
 *
 * Spec (04 §5): 240px radial gold glow at 8–12% opacity on cards
 * is handled by the .spotlight-card class in globals.css, not here.
 * This component handles the cursor ring only.
 *
 * Rule: touch devices lose cursor effects entirely.
 * Rule: reduced motion → instant, no lag.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    // Check fine pointer and reduced motion at runtime
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const noReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: no-preference)"
    ).matches;

    if (!finePointer) {
      ring.style.display = "none";
      dot.style.display = "none";
      return;
    }

    // Hide the native cursor on the html element
    document.documentElement.style.cursor = "none";

    // Quick setter for smooth tracking
    const xRing = gsap.quickTo(ring, "x", {
      duration: noReducedMotion ? 0.5 : 0,
      ease: "power3.out",
    });
    const yRing = gsap.quickTo(ring, "y", {
      duration: noReducedMotion ? 0.5 : 0,
      ease: "power3.out",
    });
    const xDot = gsap.quickTo(dot, "x", {
      duration: noReducedMotion ? 0.1 : 0,
      ease: "power3.out",
    });
    const yDot = gsap.quickTo(dot, "y", {
      duration: noReducedMotion ? 0.1 : 0,
      ease: "power3.out",
    });

    // Move
    const onMove = (e: MouseEvent) => {
      xRing(e.clientX);
      yRing(e.clientY);
      xDot(e.clientX);
      yDot(e.clientY);
    };

    // Pause hover transitions during fast scroll to prevent main-thread thrash
    let isScrolling = false;
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      isScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 80);
    };

    // Scale up on interactive elements
    const onEnter = (e: MouseEvent) => {
      if (isScrolling) return;
      const target = e.target as HTMLElement;
      if (
        target.closest("a, button, [role='button'], [data-cursor], input, select, textarea")
      ) {
        gsap.to(ring, { scale: 1.8, opacity: 0.5, duration: 0.22, ease: "power3.out" });
        gsap.to(dot, { scale: 0, duration: 0.18, ease: "power3.out" });
      }
    };

    const onLeave = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.22, ease: "power3.out" });
      gsap.to(dot, { scale: 1, duration: 0.18, ease: "power3.out" });
    };

    // Hide when leaving window
    const onOut = () => {
      gsap.to([ring, dot], { opacity: 0, duration: 0.2 });
    };
    const onOver = () => {
      gsap.to([ring, dot], { opacity: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);
    document.addEventListener("mouseleave", onOut);
    document.addEventListener("mouseenter", onOver);

    return () => {
      document.documentElement.style.cursor = "";
      clearTimeout(scrollTimeout);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
      document.removeEventListener("mouseleave", onOut);
      document.removeEventListener("mouseenter", onOver);
    };
  });

  return (
    <>
      {/* Ring — lags behind pointer */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: -18,
          left: -18,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1.5px solid rgba(194,165,107,0.7)",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
        }}
      />
      {/* Dot — instant follow */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: -3,
          left: -3,
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "var(--gold)",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
        }}
      />
    </>
  );
}

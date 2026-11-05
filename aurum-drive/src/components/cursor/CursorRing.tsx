"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * LimoDrive Luxury Magic Cursor:
 * - Fluid LERP ticker (ratio: 0.15) for smooth physical trailing
 * - Expands into an elegant golden magnetic selection halo (scale: 1.65, gold tinted fill)
 *   whenever hovering over any clickable button, card, link, or interactive shape
 * - Tactile recoil compression on click (scale: 0.85)
 * - Cleanly hides on text inputs so typing is never obstructed
 */
export function CursorRing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on desktop with fine pointer
    if (
      typeof window === "undefined" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }

    const container = containerRef.current;
    const ball = ballRef.current;
    if (!container || !ball) return;

    const mouse = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    const ratio = 0.15; // exact LimoDrive LERP follow ratio
    let isSelectable = false;
    let isTextInput = false;
    let isMouseDown = false;

    // Initial setup
    gsap.set(ball, {
      xPercent: -50,
      yPercent: -50,
      width: 34,
      height: 34,
      borderWidth: 2,
      borderColor: "#0B7584",
      backgroundColor: "transparent",
      opacity: 0.65,
      scale: 1,
    });

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      gsap.to(container, { duration: 0.25, autoAlpha: 1 });
    };

    // Ticker loop: fluid LERP lag
    const updatePosition = () => {
      pos.x += (mouse.x - pos.x) * ratio;
      pos.y += (mouse.y - pos.y) * ratio;
      gsap.set(ball, { x: pos.x, y: pos.y });
    };

    gsap.ticker.add(updatePosition);

    // Hover detection: clickable / selectable elements vs inputs
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Text input detection
      const textInput = target.closest("input:not([type='submit']):not([type='button']), textarea");
      if (textInput) {
        isTextInput = true;
        isSelectable = false;
        gsap.to(ball, {
          duration: 0.25,
          scale: 0,
          opacity: 0,
          ease: "power2.out",
        });
        return;
      }
      isTextInput = false;

      // Selectable / clickable detection (buttons, links, cards, shapes, tabs, controls)
      const clickable = target.closest(
        "a, button, [role='button'], .cursor-pointer, [data-cursor], .interactive-shape, .interactive-card, select, input[type='submit'], input[type='button'], summary"
      );

      if (clickable) {
        if (!isSelectable) {
          isSelectable = true;
          // Morph into golden selection halo
          gsap.to(ball, {
            duration: 0.3,
            scale: isMouseDown ? 1.1 : 1.65,
            borderWidth: 1.5,
            borderColor: "#FFA46B",
            backgroundColor: "rgba(255, 54, 0, 0.14)",
            opacity: 0.9,
            ease: "power2.out",
          });
        }
      } else {
        if (isSelectable) {
          isSelectable = false;
          // Restore idle luxury ring
          gsap.to(ball, {
            duration: 0.3,
            scale: isMouseDown ? 0.75 : 1,
            borderWidth: 2,
            borderColor: "#0B7584",
            backgroundColor: "transparent",
            opacity: 0.65,
            ease: "power2.out",
          });
        }
      }
    };

    const handleMouseDown = () => {
      isMouseDown = true;
      if (isTextInput) return;

      gsap.to(ball, {
        duration: 0.15,
        scale: isSelectable ? 1.15 : 0.75,
        backgroundColor: isSelectable ? "rgba(194, 165, 107, 0.28)" : "transparent",
        ease: "power2.out",
      });
    };

    const handleMouseUp = () => {
      isMouseDown = false;
      if (isTextInput) return;

      gsap.to(ball, {
        duration: 0.22,
        scale: isSelectable ? 1.65 : 1,
        backgroundColor: isSelectable ? "rgba(194, 165, 107, 0.14)" : "transparent",
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(container, { duration: 0.3, autoAlpha: 0 });
    };

    const handleMouseEnter = () => {
      gsap.to(container, { duration: 0.3, autoAlpha: 1 });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      gsap.ticker.remove(updatePosition);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="magic-cursor"
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[999999] opacity-0"
    >
      <div
        ref={ballRef}
        id="ball"
        className="fixed top-0 left-0 pointer-events-none rounded-full will-change-transform box-border"
        style={{
          width: "34px",
          height: "34px",
          boxShadow: "0 0 14px rgba(255, 54, 0, 0.18)",
        }}
      />
    </div>
  );
}

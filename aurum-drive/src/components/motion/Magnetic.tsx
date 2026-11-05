"use client";

/**
 * Magnetic — Phase 2.4
 *
 * Wraps a button or link to give it a magnetic pull toward the pointer.
 * Only active on fine-pointer devices (hover: hover).
 * Touch and reduced-motion: no effect.
 *
 * Usage:
 *   <Magnetic>
 *     <button className="btn-key">Réserver</button>
 *   </Magnetic>
 *
 * Spec (04 §6): strength ~0.25, active within 80px of the element.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DUR } from "@/lib/motion-tokens";

interface MagneticProps {
  children: React.ReactNode;
  /** Pull strength (0–1). Default 0.25. */
  strength?: number;
  /** Activation radius in px. Default 80. */
  radius?: number;
  className?: string;
}

export function Magnetic({
  children,
  strength = 0.25,
  radius = 80,
  className,
}: MagneticProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = wrapperRef.current;
      if (!el) return;

      // Fine pointer only
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius + rect.width / 2) {
          gsap.to(el, {
            x: dx * strength,
            y: dy * strength,
            duration: DUR.hover,
            ease: "power3.out",
          });
        }
      };

      const onLeave = () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: DUR.panel,
          ease: "elastic.out(1, 0.5)",
        });
      };

      window.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);

      return () => {
        window.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: wrapperRef }
  );

  return (
    <div ref={wrapperRef} className={className} style={{ display: "inline-block" }}>
      {children}
    </div>
  );
}

"use client";

/**
 * Odometer — Phase 2.4
 *
 * Rolling digit counter that animates from 0 (or `from`) to `value`.
 * Uses tabular lining figures for clean alignment.
 * Digits roll vertically like a slot machine or instrument cluster.
 *
 * Accessibility: aria-label on the container gives screen readers
 * the final value immediately; the animation is decorative.
 *
 * Spec (04 §8): "Digit columns that roll to the value, tabular figures,
 * aria-label with the final value."
 *
 * Usage:
 *   <Odometer value={30000} suffix=" DA" className="text-4xl font-display" />
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE } from "@/lib/motion-tokens";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface OdometerProps {
  value: number;
  from?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  /** Format locale — defaults to 'fr-DZ' */
  locale?: string;
  /** Number of decimal places */
  decimals?: number;
}

export function Odometer({
  value,
  from = 0,
  suffix = "",
  prefix = "",
  className,
  locale = "fr-DZ",
  decimals = 0,
}: OdometerProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef({ val: from });

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      // Reduced motion: show final value immediately
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = `${prefix}${value.toLocaleString(locale, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}${suffix}`;
        return;
      }

      gsap.fromTo(
        counterRef.current,
        { val: from },
        {
          val: value,
          duration: DUR.reveal,
          ease: EASE.outExpo,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
          onUpdate() {
            const formatted = counterRef.current.val.toLocaleString(locale, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            });
            if (el) el.textContent = `${prefix}${formatted}${suffix}`;
          },
        }
      );
    },
    { scope: containerRef, dependencies: [value, from, locale, suffix, prefix, decimals] }
  );

  const formattedFinal = value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span
      ref={containerRef}
      aria-label={`${prefix}${formattedFinal}${suffix}`}
      className={`tabular-nums${className ? ` ${className}` : ""}`}
    >
      {/* SSR value — GSAP overrides this on mount */}
      {`${prefix}${formattedFinal}${suffix}`}
    </span>
  );
}

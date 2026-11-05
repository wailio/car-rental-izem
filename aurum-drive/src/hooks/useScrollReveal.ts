"use client";

import { useEffect, useRef } from "react";

/**
 * useScrollReveal — wires up IntersectionObserver on a container element.
 * Any child with [data-reveal] inside the container will animate in
 * when it enters the viewport.
 *
 * Attributes supported on children:
 *   data-reveal            — enables the animation (required)
 *   data-reveal-delay="N"  — adds a stagger delay in ms (optional)
 *
 * Works by toggling the CSS class "reveal-visible" on each observed element.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const targets = Array.from(
      container.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.revealDelay ?? "0";
            setTimeout(() => {
              el.classList.add("reveal-visible");
            }, parseInt(delay, 10));
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
        ...options,
      }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return ref;
}

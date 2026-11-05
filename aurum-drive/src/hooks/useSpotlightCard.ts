"use client";

/**
 * useSpotlightCard — Phase 2.3
 *
 * Tracks the cursor position within a card to power the .spotlight-card
 * ::before radial gradient border effect defined in globals.css.
 *
 * Usage:
 *   const bindSpotlight = useSpotlightCard();
 *   <div className="spotlight-card" {...bindSpotlight()}>...</div>
 *
 * Touch devices: no effect (pointer: coarse).
 */
export function useSpotlightCard() {
  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--x", `${x}%`);
    el.style.setProperty("--y", `${y}%`);
  };

  return () => ({ onMouseMove });
}

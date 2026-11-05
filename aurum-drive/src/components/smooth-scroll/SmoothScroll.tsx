"use client";

/**
 * SmoothScroll — Phase 2.5
 *
 * Thin shell that:
 * 1. Wraps children in the MotionProvider (GSAP + Lenis setup)
 * 2. Renders the grain overlay (film grain texture, static, free)
 * 3. Renders the vignette overlay (for global dark edges)
 *
 * The Cursor is loaded here as a dynamic import so it only runs
 * on fine-pointer devices and never on the server.
 */

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { MotionProvider } from "@/components/motion/MotionProvider";

// Dynamic import — cursor is purely decorative and fine-pointer only.
// noSSR prevents it from blocking hydration.
const Cursor = dynamic(
  () => import("@/components/motion/Cursor").then((m) => m.Cursor),
  { ssr: false }
);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <MotionProvider>
      {/* Film grain: static noise at ~3.5% opacity, no animation, virtually free */}
      <div className="grain-overlay" aria-hidden="true" />
      {/* Custom cursor ring — fine pointer only, loaded async */}
      <Cursor />
      {children}
    </MotionProvider>
  );
}

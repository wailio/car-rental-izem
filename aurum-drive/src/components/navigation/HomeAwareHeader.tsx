"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";

/**
 * Renders the Header on every page EXCEPT the homepage.
 * On the homepage the navbar is embedded inside the HeroSection frame.
 */
export function HomeAwareHeader() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/contact" || pathname?.startsWith("/admin")) return null;
  return <Header />;
}

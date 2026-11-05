"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
          if (totalScroll > 0) {
            const currentProgress = (window.scrollY / totalScroll) * 100;
            setProgress(Math.min(100, Math.max(0, currentProgress)));
          }
          const isPast = window.scrollY > 300;
          setVisible((prev) => (prev !== isPast ? isPast : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Retour en haut de page"
      style={{
        position: "fixed", bottom: "5.5rem", right: "1.5rem", zIndex: 40,
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 44, height: 44, borderRadius: "50%",
        background: "var(--night-850)", border: "1px solid rgba(255,255,255,.08)",
        color: "var(--gold)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "scale(1)" : "scale(0.85)",
        transition: `opacity 220ms var(--ease-out-strong), transform 220ms var(--ease-out-strong), background var(--dur-hover) var(--ease-out-strong), color var(--dur-hover) var(--ease-out-strong)`,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--gold)"; (e.currentTarget as HTMLElement).style.color = "var(--night-950)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--night-850)"; (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
      className="hidden sm:flex"
    >
      {/* Circular Progress SVG */}
      <svg style={{ position: "absolute", width: 48, height: 48, transform: "rotate(-90deg)", pointerEvents: "none" }} viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={radius} stroke="rgba(194,165,107,.15)" strokeWidth="2.5" fill="transparent" />
        <circle
          cx="24" cy="24" r={radius}
          stroke="var(--gold)" strokeWidth="2.5" fill="transparent"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 150ms linear" }}
        />
      </svg>
      <ArrowUp style={{ width: 18, height: 18, position: "relative" }} />
    </button>
  );
}

"use client";

import React from "react";
import Image from "next/image";

interface IzemBrandLockupProps {
  /**
   * Theme variant:
   * - "dark": for dark backgrounds (Hero, Footer, Mobile Drawer, Dark Nav)
   * - "light": for white/light backgrounds (Sticky Header on white pages)
   * - "auto": dynamically styled
   */
  theme?: "dark" | "light" | "auto";
  /**
   * Size presets:
   * - "sm": header / compact navigation bar (emblem ~36px height)
   * - "md": standard hero / footer lockup (emblem ~46px height)
   * - "lg": large display / admin login (emblem ~58px height)
   */
  size?: "sm" | "md" | "lg";
  /**
   * Whether to include the Lion-Car silhouette emblem
   */
  showEmblem?: boolean;
  className?: string;
}

export function IzemBrandLockup({
  theme = "dark",
  size = "sm",
  showEmblem = true,
  className = "",
}: IzemBrandLockupProps) {
  // Dimensions tuning based on size
  const config = {
    sm: {
      emblemHeight: 34,
      emblemWidth: 68,
      izemSize: "1.25rem",
      izemTracking: "0.05em",
      motorsSize: "0.58rem",
      motorsTracking: "0.26em",
      gap: "0.75rem",
      lineWidth: "100%",
      lineHeight: 2,
    },
    md: {
      emblemHeight: 44,
      emblemWidth: 88,
      izemSize: "1.65rem",
      izemTracking: "0.06em",
      motorsSize: "0.72rem",
      motorsTracking: "0.28em",
      gap: "0.85rem",
      lineWidth: "100%",
      lineHeight: 2.5,
    },
    lg: {
      emblemHeight: 56,
      emblemWidth: 112,
      izemSize: "2.1rem",
      izemTracking: "0.07em",
      motorsSize: "0.88rem",
      motorsTracking: "0.3em",
      gap: "1rem",
      lineWidth: "100%",
      lineHeight: 3,
    },
  }[size];

  const isLight = theme === "light";

  return (
    <div
      className={`inline-flex items-center select-none group ${className}`}
      style={{
        gap: config.gap,
        textDecoration: "none",
      }}
    >
      {/* ── 1. The Chrome Lion-Car Emblem ── */}
      {showEmblem && (
        <div
          className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
          style={{
            height: config.emblemHeight,
            width: config.emblemWidth,
          }}
        >
          <img
            src="/images/izem-emblem.png"
            alt="IZEM MOTORS Emblem"
            width={config.emblemWidth}
            height={config.emblemHeight}
            className="w-full h-full object-contain filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
            loading="eager"
          />
        </div>
      )}

      {/* ── 2. The Text Lockup: IZEM + MOTORS + Tapered Line ── */}
      <div className="flex flex-col items-center justify-center leading-none text-center">
        {/* Top: IZEM in Brushed Metallic Silver */}
        <span
          className="font-sora font-black uppercase"
          style={{
            fontSize: config.izemSize,
            letterSpacing: config.izemTracking,
            lineHeight: 0.95,
            background: isLight
              ? "linear-gradient(180deg, #1E242B 0%, #333C48 45%, #181D24 100%)"
              : "linear-gradient(180deg, #FFFFFF 0%, #E3E6EB 38%, #A8ACB8 70%, #6E7382 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: isLight
              ? "drop-shadow(0 1px 1px rgba(0,0,0,0.15))"
              : "drop-shadow(0 2px 3px rgba(0,0,0,0.65))",
            display: "block",
            transform: "translateZ(0)",
          }}
        >
          IZEM
        </span>

        {/* Bottom: MOTORS in Deep Luxury Mineral Cyan */}
        <span
          className="font-sora font-bold uppercase mt-1"
          style={{
            fontSize: config.motorsSize,
            letterSpacing: config.motorsTracking,
            lineHeight: 1,
            color: "#0B7584",
            background: "linear-gradient(90deg, #075E6B 0%, #128795 50%, #075E6B 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 1px 2px rgba(11,117,132,0.25))",
            display: "block",
            width: "100%",
            textAlign: "center",
          }}
        >
          MOTORS
        </span>

        {/* Tapered Cyan Underline (Needle spear matching image) */}
        <div
          className="w-full mt-1 flex items-center justify-center overflow-visible"
          style={{ height: config.lineHeight }}
        >
          <svg
            viewBox="0 0 100 4"
            preserveAspectRatio="none"
            className="w-full h-full"
            style={{
              filter: "drop-shadow(0 1px 2px rgba(11,117,132,0.35))",
            }}
          >
            <defs>
              <linearGradient id={`cyan-spear-${size}-${theme}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0B7584" stopOpacity="0" />
                <stop offset="18%" stopColor="#075E6B" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#128795" stopOpacity="1" />
                <stop offset="82%" stopColor="#075E6B" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#0B7584" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 2 Q 50 0 100 2 Q 50 4 0 2 Z"
              fill={`url(#cyan-spear-${size}-${theme})`}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

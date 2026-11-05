/**
 * 404 — not-found.tsx
 *
 * Spec (06 §5 /404):
 * "A designed page: a car drives off the edge of the screen.
 *  'Cette page a pris la route. Revenez à l'accueil.'
 *  and a primary button."
 *
 * Technique: CSS keyframe drives the SVG car silhouette off-screen right.
 * No GSAP needed — pure CSS, works before JS.
 * Token system only, French only.
 */

import Link from "next/link";
import { ROUTES } from "@/lib/config";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main
      id="main"
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--section-y-lg) var(--gutter)",
        textAlign: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── Road strip ──────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "clamp(4rem, 12vw, 10rem)",
          left: 0, right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,.06) 20%, rgba(255,255,255,.06) 80%, transparent)",
        }}
      />

      {/* Dashed centre line */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "clamp(4rem, 12vw, 10rem)",
          left: 0, right: 0,
          height: 2,
          display: "flex",
          overflow: "hidden",
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: "0 0 5%", height: "100%",
              background: i % 2 === 0 ? "rgba(194,165,107,.2)" : "transparent",
            }}
          />
        ))}
      </div>

      {/* ── Car SVG — drives off to the right ───────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "clamp(4rem, 12vw, 10rem)",
          left: "5%",
          width: "clamp(180px, 28vw, 340px)",
          animation: "drive-off 2s cubic-bezier(.25,.46,.45,.94) 0.6s forwards",
          opacity: 1,
        }}
      >
        <svg
          viewBox="0 0 340 100"
          fill="none"
          style={{ width: "100%", stroke: "var(--gold)", strokeWidth: 1.5, opacity: .55 }}
        >
          {/* Body */}
          <path d="M20 68 L55 68 L80 38 L220 38 L265 55 L310 62 L318 70 L310 76 L28 76 Z" />
          {/* Windshield */}
          <path d="M90 38 L110 22 L195 22 L218 38" />
          {/* Windows */}
          <path d="M112 22 L112 37 M160 22 L160 37 M196 22 L194 37" opacity=".5" />
          {/* Wheels */}
          <circle cx="85" cy="76" r="14" />
          <circle cx="85" cy="76" r="5" fill="var(--gold)" opacity=".3" />
          <circle cx="250" cy="76" r="14" />
          <circle cx="250" cy="76" r="5" fill="var(--gold)" opacity=".3" />
          {/* Headlights */}
          <rect x="308" y="58" width="8" height="4" rx="2" fill="var(--gold)" opacity=".6" />
          {/* Roof detail */}
          <path d="M120 22 L118 14 L195 14 L196 22" opacity=".4" />
        </svg>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div
        style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(1rem, 2.5vw, 1.5rem)" }}
      >
        {/* 404 number */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(5rem, 18vw, 12rem)",
            lineHeight: 1,
            color: "rgba(194,165,107,.12)",
            margin: 0,
            letterSpacing: "-.04em",
            userSelect: "none",
            fontVariantNumeric: "tabular-nums",
          }}
          aria-hidden="true"
        >
          404
        </p>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--fs-h2)",
            color: "var(--ivory)",
            margin: "-2rem 0 0",
            maxWidth: "24rem",
          }}
        >
          Cette page a pris la route.
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--fs-body)",
            color: "var(--ivory-dim)",
            margin: 0,
            maxWidth: "28rem",
            lineHeight: 1.6,
          }}
        >
          La page que vous cherchez est introuvable. Revenez à l&apos;accueil ou parcourez notre flotte.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: ".75rem", justifyContent: "center", marginTop: ".5rem" }}>
          <Link href={ROUTES.home} className="btn-key" aria-label="Retour à la page d'accueil">
            <ArrowLeft size={15} aria-hidden="true" />
            Retour à l&apos;accueil
          </Link>
          <Link href={ROUTES.fleet} className="btn-secondary" aria-label="Voir tous les véhicules">
            Voir la flotte
          </Link>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes drive-off {
          0%   { transform: translateX(0); opacity: 1; }
          70%  { opacity: 1; }
          100% { transform: translateX(110vw); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="drive-off"] { animation: none !important; opacity: .4 !important; }
        }
      `}</style>
    </main>
  );
}

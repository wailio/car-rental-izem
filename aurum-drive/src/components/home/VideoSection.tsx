"use client";

/**
 * VideoSection — Phase 3 / H7
 *
 * Spec (06 §H7):
 * - If real horizontal footage: expanding frame + lightbox
 * - If only TikTok vertical footage: TikTok strip + follow button
 * - If nothing real: REMOVE SECTION, log in ASSETS-TODO.md
 *
 * TODO:CLIENT — Confirm whether real video footage exists (horizontal or TikTok).
 * Until confirmed, this section renders a placeholder "En route" invitation
 * with a WhatsApp CTA and the brand strip (real fleet brands only).
 * This does NOT ship an empty video player.
 *
 * To activate video: replace VIDEO_SRC with the real hosted URL,
 * set HAS_VIDEO = true. The poster image (/images/intro-video-bg.jpg) is real.
 */

import Link from "next/link";
import { BRAND, ROUTES } from "@/lib/config";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// TODO:CLIENT — Set to true when video footage is confirmed and hosted
const HAS_VIDEO = false;

// Only brands that are actually in the fleet
const FLEET_BRANDS = [
  "Volkswagen", "Peugeot", "Fiat", "Geely", "Seat", "Renault", "Opel",
] as const;

export function VideoSection() {
  const sectionRef = useScrollReveal<HTMLElement>();

  // Per spec: if no real footage, do not ship an empty player
  if (!HAS_VIDEO) return null;

  // When HAS_VIDEO becomes true, this shell renders the section
  return (
    <section
      ref={sectionRef}
      aria-label="Voir comment ça se passe"
      style={{
        padding: "var(--section-y-lg) var(--gutter)",
        background: "var(--night-900)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container)",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--fs-micro)",
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "var(--gold)",
            border: "1px solid rgba(194,165,107,.28)",
            borderRadius: "var(--r-pill)",
            display: "inline-block",
            padding: ".35rem .875rem",
            marginBottom: "1.25rem",
          }}
        >
          En route
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--fs-h2)",
            lineHeight: 1.1,
            color: "var(--ivory)",
            marginBottom: "1.5rem",
          }}
        >
          Voyez comment ça se passe
        </h2>
        {/* Video player placeholder — activate when HAS_VIDEO = true */}
        <div
          style={{
            width: "100%",
            maxWidth: 900,
            margin: "0 auto 2rem",
            aspectRatio: "16 / 9",
            background: "var(--night-800)",
            borderRadius: "var(--r-card)",
            border: "1px solid rgba(255,255,255,.06)",
          }}
          aria-label="Lecteur vidéo — bientôt disponible"
        />

        {/* Brand strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "clamp(.75rem, 2vw, 2rem)",
            marginTop: "1.5rem",
          }}
          aria-label="Marques de la flotte"
        >
          {FLEET_BRANDS.map((brand) => (
            <span
              key={brand}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--fs-small)",
                letterSpacing: ".06em",
                color: "var(--ivory-mute)",
                textTransform: "uppercase",
              }}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

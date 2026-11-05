"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { BRAND, ROUTES } from "@/lib/config";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif";

export function FinalCTASection() {
  const sectionRef = useScrollReveal<HTMLElement>();

  const waUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
    "Bonjour, je souhaite louer une voiture."
  )}`;

  return (
    <section
      id="final-cta"
      ref={sectionRef}
      style={{
        position: "relative",
        padding: "clamp(48px,6vw,80px) clamp(16px,4vw,40px)",
        maxWidth: 1280,
        margin: "0 auto",
        fontFamily: SF,
      }}
    >
      {/* Very subtle ambient shadow — just a soft dark haze, no orange smoke */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: 40,
          background: "rgba(15,23,42,0.08)",
          borderRadius: "50%",
          filter: "blur(24px)",
          pointerEvents: "none",
        }}
      />

      {/* Clean white card with very light shadow */}
      <div
        style={{
          position: "relative",
          borderRadius: 28,
          overflow: "hidden",
          padding: "clamp(40px,6vw,72px) clamp(24px,5vw,64px)",
          textAlign: "center",
          background: "linear-gradient(150deg, #F0F4F8 0%, #F8FAFC 50%, #FFFFFF 100%)",
          border: "1px solid rgba(0,0,0,0.07)",
          boxShadow:
            "0 4px 32px -8px rgba(15,23,42,0.10), 0 1px 4px rgba(15,23,42,0.04)",
        }}
      >
        {/* Barely-there top light */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto" }}>
          {/* Pill label */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 14px",
              borderRadius: 99,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: "rgba(11, 117, 132,0.07)",
              border: "1px solid rgba(11, 117, 132,0.18)",
              color: "#0B7584",
              marginBottom: 20,
              fontFamily: SF,
            }}
          >
            Réservation immédiate
          </div>

          {/* H2 — thin + bold split */}
          <h2
            style={{
              fontSize: "clamp(1.8rem,3.5vw,3rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              color: "#0F172A",
              margin: "0 0 16px",
              fontFamily: SF,
            }}
          >
            <span style={{ fontWeight: 300 }}>Prêt à prendre la route </span>
            <span style={{ fontWeight: 800 }}>en toute liberté ?</span>
          </h2>

          {/* Subtitle */}
          <p
            style={{
              color: "#64748B",
              fontSize: "clamp(13px,1.1vw,15px)",
              fontWeight: 400,
              lineHeight: 1.7,
              maxWidth: 500,
              margin: "0 auto 32px",
              fontFamily: SF,
            }}
          >
            Choisissez votre modèle, confirmez vos dates et récupérez vos clés
            sans attente dès votre atterrissage à l&apos;Aéroport d&apos;Alger.
          </p>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <Link
              href={ROUTES.fleet}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "#0B7584",
                color: "white",
                fontFamily: SF,
                fontWeight: 700,
                fontSize: 14,
                padding: "13px 28px",
                borderRadius: 99,
                textDecoration: "none",
                boxShadow: "0 4px 16px -4px rgba(11, 117, 132,0.35)",
                transition: "opacity 0.18s ease, transform 0.18s cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "0.88";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ArrowRight size={14} strokeWidth={2.5} />
              </span>
              Choisir un véhicule
            </Link>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#0F172A",
                color: "white",
                fontFamily: SF,
                fontWeight: 600,
                fontSize: 14,
                padding: "13px 28px",
                borderRadius: 99,
                textDecoration: "none",
                boxShadow: "0 4px 16px -4px rgba(0,0,0,0.22)",
                transition: "opacity 0.18s ease, transform 0.18s cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "0.85";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <MessageCircle size={17} style={{ color: "#25D366" }} />
              Écrire sur WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

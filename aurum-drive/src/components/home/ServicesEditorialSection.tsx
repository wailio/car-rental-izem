"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif";

const SERVICES = [
  {
    num: "01",
    title: "Livraison & retour gratuits à l'aéroport",
    shortDesc: "Remise directe au terminal Houari Boumediene.",
    desc: "Les clés vous attendent dès votre arrivée au terminal d'Alger Houari Boumediene. Restitution rapide et sans frais.",
    icon: (
      <svg viewBox="0 0 180 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <path d="M20 75 L90 40 L155 60 L130 68 L155 60 L130 68" stroke="#0B7584" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M20 75 L155 60" stroke="#0B7584" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M155 60 C160 58 165 57 165 62 C165 67 158 68 155 68 L130 75 Z" stroke="#0B7584" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M20 75 L30 82 L70 68" stroke="#0B7584" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M70 68 L90 40" stroke="#0B7584" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        <path d="M105 55 L110 45 L135 55" stroke="#0B7584" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="55" cy="105" r="12" stroke="#0B7584" strokeWidth="1.5" fill="none"/>
        <circle cx="55" cy="105" r="5" stroke="#0B7584" strokeWidth="1.2" fill="none"/>
        <line x1="67" y1="105" x2="90" y2="105" stroke="#0B7584" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="82" y1="105" x2="82" y2="112" stroke="#0B7584" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="88" y1="105" x2="88" y2="110" stroke="#0B7584" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: "02",
    title: "Location courte, moyenne ou longue durée",
    shortDesc: "Tarifs dégressifs du week-end au mois entier.",
    desc: "Du week-end au mois entier, bénéficiez de tarifs dégressifs transparents et d'une caution restituée dans les délais.",
    icon: (
      <svg viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <path d="M20 80 L30 58 C32 52 38 48 44 48 L136 48 C142 48 148 52 150 58 L160 80 L160 92 C160 96 156 99 152 99 L28 99 C24 99 20 96 20 92 Z" stroke="#0B7584" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M50 48 L62 28 C64 23 70 20 76 20 L104 20 C110 20 116 23 118 28 L130 48" stroke="#0B7584" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M66 44 L72 26 L108 26 L114 44" stroke="#0B7584" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <line x1="90" y1="44" x2="90" y2="26" stroke="#0B7584" strokeWidth="1.1" strokeLinecap="round"/>
        <circle cx="52" cy="99" r="14" stroke="#0B7584" strokeWidth="1.5" fill="none"/>
        <circle cx="52" cy="99" r="6" stroke="#0B7584" strokeWidth="1.2" fill="none"/>
        <circle cx="128" cy="99" r="14" stroke="#0B7584" strokeWidth="1.5" fill="none"/>
        <circle cx="128" cy="99" r="6" stroke="#0B7584" strokeWidth="1.2" fill="none"/>
        <path d="M20 72 L30 70" stroke="#0B7584" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M160 72 L150 70" stroke="#0B7584" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: "03",
    title: "Assistance routière 24h/24, 7j/7",
    shortDesc: "Équipe disponible à toute heure 24/7.",
    desc: "Une équipe dédiée disponible par téléphone et WhatsApp à toute heure pour vous dépanner ou répondre à vos questions.",
    icon: (
      <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <path d="M80 110 C60 95 50 75 50 55" stroke="#0B7584" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
        <path d="M80 110 C100 95 110 75 110 55" stroke="#0B7584" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
        <path d="M80 100 C65 88 58 70 58 52" stroke="#0B7584" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.7"/>
        <path d="M80 100 C95 88 102 70 102 52" stroke="#0B7584" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.7"/>
        <path d="M80 90 C70 80 66 65 66 50" stroke="#0B7584" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M80 90 C90 80 94 65 94 50" stroke="#0B7584" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <circle cx="80" cy="115" r="4" stroke="#0B7584" strokeWidth="1.5" fill="none"/>
        <line x1="80" y1="90" x2="80" y2="111" stroke="#0B7584" strokeWidth="1.3" strokeLinecap="round"/>
        <rect x="55" y="25" width="30" height="50" rx="4" stroke="#0B7584" strokeWidth="1.5" fill="none"/>
        <line x1="65" y1="30" x2="75" y2="30" stroke="#0B7584" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="70" cy="70" r="2.5" stroke="#0B7584" strokeWidth="1.2" fill="none"/>
      </svg>
    ),
  },
  {
    num: "04",
    title: "Assurance tous risques incluse",
    shortDesc: "Couverture intégrale sans franchise.",
    desc: "Couverture intégrale sur tous nos véhicules récents, pour voyager en toute sérénité à travers l'Algérie.",
    icon: (
      <svg viewBox="0 0 160 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <path d="M80 18 L140 40 L140 90 C140 115 112 135 80 145 C48 135 20 115 20 90 L20 40 Z" stroke="#0B7584" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M80 30 L128 48 L128 88 C128 108 106 124 80 132 C54 124 32 108 32 88 L32 48 Z" stroke="#0B7584" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5"/>
        <path d="M58 85 L72 99 L102 68" stroke="#0B7584" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export function ServicesEditorialSection() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const [hovered, setHovered] = useState<number | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<number | null>(null);

  return (
    <section
      ref={sectionRef}
      style={{
        fontFamily: SF,
        background: "#F5F5F7",
        padding: "clamp(40px,5vw,72px) clamp(16px,4vw,40px)",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          /* Background image shown fully at natural cover */
          backgroundImage: "url('/images/services-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#EFF2F6",
          borderRadius: 24,
          border: "1px solid rgba(15, 23, 42, 0.12)",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 20px 48px -10px rgba(8, 14, 22, 0.28), 0 38px 80px -16px rgba(4, 9, 15, 0.24), 0 16px 36px -8px rgba(11, 117, 132, 0.08)",
          padding: "clamp(24px,5vw,56px) clamp(14px,5vw,52px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Soft top gradient scrim so header is always pristine */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 160,
            background:
              "linear-gradient(to bottom, rgba(239, 242, 246, 0.98) 0%, rgba(239, 242, 246, 0.78) 70%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Header */}
        <div style={{ marginBottom: "clamp(20px,3vw,40px)", position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 100,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: "rgba(11, 117, 132, 0.08)",
              color: "#0B7584",
              marginBottom: 14,
              fontFamily: SF,
            }}
          >
            Nos Prestations
          </div>
          <h2
            style={{
              fontSize: "clamp(1.5rem,3vw,2.4rem)",
              color: "#0F172A",
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
              fontFamily: SF,
              margin: 0,
            }}
          >
            <span style={{ fontWeight: 300 }}>Des services pensés pour </span>
            <span style={{ fontWeight: 800 }}>votre confort</span>
          </h2>
        </div>

        {/* 2×2 Grid on desktop, 2 in a line on mobile */}
        <div
          className="grid grid-cols-2 gap-2.5 sm:gap-6"
          style={{
            position: "relative",
          }}
        >
          {SERVICES.map((svc, i) => {
            const isHovered = hovered === i;
            const isExpanded = expandedMobile === i;
            return (
              <div
                key={svc.num}
                data-reveal="fade-up"
                data-reveal-delay={String(i * 70)}
                onClick={() => setExpandedMobile(isExpanded ? null : i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="group/card"
                style={{
                  background: isHovered
                    ? "linear-gradient(145deg, #151C24 0%, #0D1217 100%)"
                    : "linear-gradient(145deg, #11161C 0%, #090C10 100%)",
                  border: isHovered
                    ? "1px solid rgba(11, 117, 132, 0.38)"
                    : isExpanded
                    ? "1px solid rgba(11, 117, 132, 0.28)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "clamp(14px, 2vw, 20px)",
                  padding: "clamp(12px, 2.5vw, 32px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "clamp(8px, 1.5vw, 14px)",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: isHovered
                    ? "0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 10px 24px -6px rgba(11, 117, 132, 0.18)"
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 14px 28px -6px rgba(0, 0, 0, 0.3), 0 4px 12px -3px rgba(11, 117, 132, 0.06)",
                  transition: "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: isHovered ? "translateY(-5px)" : "translateY(0)",
                  cursor: "pointer",
                }}
              >
                {/* Ambient Top Light Sheen */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "15%",
                    right: "15%",
                    height: 1,
                    background: isHovered
                      ? "linear-gradient(90deg, transparent 0%, rgba(18, 135, 149, 0.45) 50%, transparent 100%)"
                      : "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.12) 50%, transparent 100%)",
                    transition: "background 0.3s ease",
                  }}
                />

                {/* Ghost illustration — desktop only */}
                <div
                  className="hidden sm:block"
                  style={{
                    position: "absolute",
                    right: -6,
                    bottom: -6,
                    width: 155,
                    height: 125,
                    opacity: isHovered ? 0.24 : 0.15,
                    pointerEvents: "none",
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                    transform: isHovered ? "scale(1.05)" : "scale(1)",
                  }}
                  aria-hidden="true"
                >
                  {svc.icon}
                </div>

                {/* Top row: badge + title inline + arrow */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                    {/* High-tech tactile number badge */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "3px 8px",
                        borderRadius: 8,
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: "#0B7584",
                          boxShadow: "0 0 4px rgba(11, 117, 132, 0.5)",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: 800,
                          fontSize: "clamp(11px, 1.2vw, 13px)",
                          fontFamily: "ui-monospace, 'SF Mono', monospace",
                          lineHeight: 1,
                        }}
                      >
                        {svc.num}
                      </span>
                    </div>

                    <h3
                      className="line-clamp-2 sm:line-clamp-none"
                      style={{
                        color: "#FFFFFF",
                        fontWeight: 700,
                        fontSize: "clamp(12px, 1.25vw, 16px)",
                        margin: 0,
                        lineHeight: 1.3,
                        fontFamily: SF,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {svc.title}
                    </h3>
                  </div>

                  {/* Arrow button (desktop only) */}
                  <span
                    className="hidden sm:flex"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      background: isHovered
                        ? "linear-gradient(135deg, #158C9B 0%, #0B7584 100%)"
                        : "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      color: isHovered ? "#FFFFFF" : "#0B7584",
                      transform: isHovered ? "translateX(3px) scale(1.05)" : "translateX(0) scale(1)",
                      boxShadow: isHovered ? "0 4px 12px rgba(11, 117, 132, 0.28)" : "none",
                      transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    <ArrowRight size={15} strokeWidth={2.4} />
                  </span>
                </div>

                {/* Description — Full on desktop, Short/Expandable on mobile */}
                <p
                  className="hidden sm:block"
                  style={{
                    color: "#94A3B8",
                    fontSize: 12.5,
                    fontWeight: 400,
                    lineHeight: 1.68,
                    margin: 0,
                    maxWidth: "80%",
                    fontFamily: SF,
                  }}
                >
                  {svc.desc}
                </p>

                {/* Mobile view description */}
                <div className="sm:hidden">
                  <p
                    style={{
                      color: "#94A3B8",
                      fontSize: 10.5,
                      fontWeight: 400,
                      lineHeight: 1.48,
                      margin: 0,
                      fontFamily: SF,
                    }}
                  >
                    {isExpanded ? svc.desc : svc.shortDesc}
                  </p>
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      color: isExpanded ? "#94A3B8" : "#0B7584",
                      display: "block",
                      marginTop: 6,
                    }}
                  >
                    {isExpanded ? "Moins ▲" : "Détails +"}
                  </span>
                </div>

                {/* ── Sleek Tapered Cyan Needle Laser Shelf Under Each Shape ── */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "12%",
                    right: "12%",
                    height: 2.5,
                    overflow: "visible",
                    opacity: isHovered ? 0.9 : 0.45,
                    transform: isHovered ? "scaleX(1.1)" : "scaleX(1)",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <svg
                    viewBox="0 0 100 4"
                    preserveAspectRatio="none"
                    style={{
                      width: "100%",
                      height: "100%",
                      filter: isHovered
                        ? "drop-shadow(0 -1px 3px rgba(11, 117, 132, 0.45))"
                        : "none",
                    }}
                  >
                    <defs>
                      <linearGradient id={`card-laser-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0B7584" stopOpacity="0" />
                        <stop offset="20%" stopColor="#085A66" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#128795" stopOpacity="0.95" />
                        <stop offset="80%" stopColor="#085A66" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#0B7584" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M 0 2 Q 50 0 100 2 Q 50 4 0 2 Z" fill={`url(#card-laser-${i})`} />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Signature Grounding Laser Horizon Shelf on the big shape */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: "6%",
            right: "6%",
            height: 3,
            overflow: "visible",
            pointerEvents: "none",
          }}
        >
          <svg
            viewBox="0 0 100 4"
            preserveAspectRatio="none"
            style={{
              width: "100%",
              height: "100%",
              filter: "drop-shadow(0 -1px 3px rgba(11, 117, 132, 0.35))",
            }}
          >
            <defs>
              <linearGradient id="big-services-shelf-laser" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0B7584" stopOpacity="0" />
                <stop offset="15%" stopColor="#085A66" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#128795" stopOpacity="0.95" />
                <stop offset="85%" stopColor="#085A66" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0B7584" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M 0 2 Q 50 0 100 2 Q 50 4 0 2 Z" fill="url(#big-services-shelf-laser)" />
          </svg>
        </div>
      </div>

      {/* Deep Ground Contact Occlusion Shadow directly under the big shape */}
      <div
        aria-hidden="true"
        style={{
          maxWidth: 1040,
          margin: "-6px auto 0",
          height: 28,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(10, 16, 24, 0.32) 0%, rgba(11, 117, 132, 0.06) 35%, transparent 70%)",
          filter: "blur(10px)",
          pointerEvents: "none",
        }}
      />
    </section>
  );
}

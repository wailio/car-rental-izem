"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { faqs } from "@/lib/data";
import { ROUTES } from "@/lib/config";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif";

export function FAQSection() {
  const [activeHoverIndex, setActiveHoverIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const sectionRef = useScrollReveal<HTMLElement>();

  const preview = faqs.slice(0, 5);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preview.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section
      ref={sectionRef}
      style={{
        fontFamily: SF,
        background: '#FFFFFF',
        borderRadius: 28,
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 4px 24px -4px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        padding: "clamp(48px,6vw,72px) clamp(20px,4vw,44px)",
        maxWidth: 1280,
        width: "calc(100% - clamp(24px, 4vw, 48px))",
        margin: "clamp(72px, 9vw, 100px) auto clamp(64px, 8vw, 96px) auto",
      }}
    >
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column (Sticky) */}
        <div data-pop="left" className="lg:col-span-5 lg:sticky lg:top-28 space-y-5">
          <div
            data-pop="badge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 100,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              background: "rgba(11, 117, 132, 0.08)",
              color: "#0B7584",
              fontFamily: SF,
            }}
          >
            Questions Fréquentes
          </div>

          <h2
            style={{
              fontSize: "clamp(1.5rem,2.8vw,2.2rem)",
              color: "#0F172A",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              fontFamily: SF,
              margin: 0,
            }}
          >
            <span style={{ fontWeight: 300, display: "block" }}>
              Tout ce qu&apos;il faut savoir
            </span>
            <span style={{ fontWeight: 800 }}>avant de réserver</span>
          </h2>

          <p
            style={{
              color: "#64748B",
              fontSize: 14,
              fontWeight: 400,
              lineHeight: 1.65,
              maxWidth: 380,
              fontFamily: SF,
            }}
          >
            Des réponses claires et précises sur les formalités, les dépôts de
            garantie, l&apos;assurance et la livraison à l&apos;aéroport d&apos;Alger.
          </p>

          <div style={{ paddingTop: 4 }}>
            <Link
              href={ROUTES.faq}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid rgba(0,0,0,0.14)",
                background: "white",
                color: "#0F172A",
                borderRadius: 100,
                padding: "9px 20px",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: SF,
                textDecoration: "none",
                transition: "background 0.18s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background = "#F8F9FA")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background = "white")
              }
            >
              <span>Consulter toute la FAQ</span>
              <ArrowRight size={14} strokeWidth={2.4} />
            </Link>
          </div>
        </div>

        {/* Right Column: Interactive Accordion with Fluid Hover-Expand & Auto-Shrink on Leave */}
        <div className="lg:col-span-7" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {preview.map((faq, i) => {
            const isExpanded = activeHoverIndex === i || clickedIndex === i;
            return (
              <div
                key={i}
                data-reveal="fade-up"
                data-reveal-delay={String(i * 50)}
                data-pop="up"
                data-pop-stagger={String((i % 5) + 1)}
                onMouseEnter={() => setActiveHoverIndex(i)}
                onMouseLeave={() => {
                  setActiveHoverIndex(null);
                  setClickedIndex(null);
                }}
                onClick={() => setClickedIndex(clickedIndex === i ? null : i)}
                className="group/faq cursor-pointer"
                style={{
                  borderRadius: 16,
                  border: isExpanded
                    ? "1px solid rgba(11, 117, 132, 0.38)"
                    : "1px solid #E2E8F0",
                  background: isExpanded
                    ? "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)"
                    : "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)",
                  boxShadow: isExpanded
                    ? "0 18px 36px -8px rgba(15, 23, 42, 0.10), 0 6px 18px -2px rgba(11, 117, 132, 0.14), 0 1px 3px rgba(0, 0, 0, 0.04)"
                    : "0 4px 16px -2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
                  transform: isExpanded ? "translateY(-3px) scale(1.008)" : "translateY(0) scale(1)",
                  overflow: "hidden",
                  position: "relative",
                  transition:
                    "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  fontFamily: SF,
                }}
              >
                {/* Top Inner Light Sheen */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "15%",
                    right: "15%",
                    height: 1,
                    background: isExpanded
                      ? "linear-gradient(90deg, transparent 0%, rgba(11, 117, 132, 0.35) 50%, transparent 100%)"
                      : "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)",
                    transition: "background 0.25s ease",
                  }}
                />

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "16px 20px",
                    textAlign: "left",
                    background: "transparent",
                    fontFamily: SF,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Tactile Pro-Grey Number Badge */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "3.5px 8.5px",
                        borderRadius: 8,
                        background: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: "#0B7584",
                          boxShadow: isExpanded ? "0 0 4px rgba(11, 117, 132, 0.45)" : "none",
                          flexShrink: 0,
                          transition: "box-shadow 0.2s ease",
                        }}
                      />
                      <span
                        style={{
                          color: "#0F172A",
                          fontWeight: 800,
                          fontSize: 11,
                          fontFamily: "ui-monospace, 'SF Mono', monospace",
                          lineHeight: 1,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <span
                      style={{
                        color: "#0F172A",
                        fontWeight: 700,
                        fontSize: 14.5,
                        lineHeight: 1.4,
                        fontFamily: SF,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {faq.question}
                    </span>
                  </div>

                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      background: isExpanded
                        ? "linear-gradient(135deg, #158C9B 0%, #0B7584 100%)"
                        : "#FFFFFF",
                      border: isExpanded
                        ? "1px solid #0B7584"
                        : "1px solid #E2E8F0",
                      color: isExpanded ? "white" : "#64748B",
                      boxShadow: isExpanded
                        ? "0 3px 10px rgba(11, 117, 132, 0.25)"
                        : "0 1px 2px rgba(0, 0, 0, 0.04)",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "all 0.26s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <ChevronDown size={14} strokeWidth={2.5} />
                  </span>
                </div>

                {/* ── Fluid CSS-Grid Smooth Height Transition ── */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: isExpanded ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease",
                    opacity: isExpanded ? 1 : 0,
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <div
                      style={{
                        padding: "0 20px 20px 58px",
                        borderTop: "1px solid #E2E8F0",
                        paddingTop: 14,
                        color: "#475569",
                        fontWeight: 400,
                        fontSize: 13.5,
                        lineHeight: 1.7,
                        fontFamily: SF,
                      }}
                    >
                      {faq.answer}
                    </div>
                  </div>
                </div>

                {/* ── Signature Tapered Cyan Needle Laser Shelf Under Each Shape ── */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "10%",
                    right: "10%",
                    height: 2.5,
                    overflow: "visible",
                    opacity: isExpanded ? 0.9 : 0.35,
                    transform: isExpanded ? "scaleX(1.1)" : "scaleX(0.85)",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <svg
                    viewBox="0 0 100 4"
                    preserveAspectRatio="none"
                    style={{
                      width: "100%",
                      height: "100%",
                      filter: isExpanded
                        ? "drop-shadow(0 -1px 2px rgba(11, 117, 132, 0.4))"
                        : "none",
                    }}
                  >
                    <defs>
                      <linearGradient id={`faq-laser-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0B7584" stopOpacity="0" />
                        <stop offset="20%" stopColor="#085A66" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#128795" stopOpacity="0.95" />
                        <stop offset="80%" stopColor="#085A66" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#0B7584" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M 0 2 Q 50 0 100 2 Q 50 4 0 2 Z" fill={`url(#faq-laser-${i})`} />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

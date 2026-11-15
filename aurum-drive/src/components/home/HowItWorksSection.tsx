"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif";

interface StepItem {
  num: string;
  title: string;
  desc: string;
}

const STEPS: StepItem[] = [
  {
    num: "01",
    title: "Choisissez votre véhicule",
    desc: "Parcourez notre flotte, sélectionnez vos dates de location et votre lieu de remise.",
  },
  {
    num: "02",
    title: "Transmettez votre demande",
    desc: "Trois minutes suffisent en ligne. Aucun paiement par carte bancaire requis.",
  },
  {
    num: "03",
    title: "Confirmation rapide",
    desc: "Un conseiller vous contacte par téléphone ou WhatsApp pour valider la réservation.",
  },
  {
    num: "04",
    title: "Prenez la route",
    desc: "Retrait à l'aéroport Houari Boumediene ou à l'agence. Règlement et caution sur place.",
  },
];

export function HowItWorksSection() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const updateTrack = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.offsetWidth);
      }
    };
    updateTrack();
    window.addEventListener("resize", updateTrack);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsRevealed(true);
      setActiveStep(4);
      return () => window.removeEventListener("resize", updateTrack);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          setActiveStep(1);
          const t1 = setTimeout(() => setActiveStep(2), 400);
          const t2 = setTimeout(() => setActiveStep(3), 800);
          const t3 = setTimeout(() => setActiveStep(4), 1200);

          observer.unobserve(entry.target);
          return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
          };
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateTrack);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="comment-ca-marche"
      className="relative w-full overflow-hidden"
      style={{
        fontFamily: SF,
        maxWidth: 1280,
        width: "calc(100% - clamp(24px, 4vw, 48px))",
        margin: "clamp(48px, 6vw, 64px) auto clamp(60px, 8vw, 84px) auto",
        backgroundColor: "#FFFFFF",
        borderRadius: 28,
        border: "1px solid rgba(11, 117, 132, 0.14)",
        boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 20px 40px -20px rgba(15,23,42,0.10)",
        padding: "clamp(32px, 4vw, 52px) clamp(22px, 4vw, 40px) clamp(32px, 4vw, 48px) clamp(22px, 4vw, 40px)",
      }}
    >
      {/* 1px top-edge highlight with linear-gradient */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none z-20"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(11, 117, 132, 0.5) 50%, transparent 100%)",
        }}
      />

      {/* One faint radial glow (accent at 6%, max 500px wide) centered behind track */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[260px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(11, 117, 132, 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Absolutely positioned corner link on Desktop: 'Faire ma demande →' */}
      <Link
        href="#booking-box"
        className="hidden md:inline-flex items-center gap-1.5 absolute top-[22px] right-[28px] text-[14px] font-semibold text-[#0B7584] group/corner z-20 no-underline"
      >
        <span className="relative">
          Faire ma demande
          <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#0B7584] scale-x-0 group-hover/corner:scale-x-100 transition-transform duration-250 origin-left" />
        </span>
        <span className="group-hover/corner:translate-x-1 transition-transform duration-200">
          →
        </span>
      </Link>

      {/* ── Header (Eyebrow Pill + H2) ── */}
      <div
        className="text-center relative z-10 mx-auto"
        style={{ marginBottom: 36 }}
      >
        <div
          data-pop="badge"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.08em] uppercase bg-[#0B7584]/[0.08] text-[#0B7584]"
          style={{ marginBottom: 14 }}
        >
          PROCESSUS SIMPLE
        </div>
        <h2
          data-pop="up"
          className="text-[#0F172A] tracking-[-0.025em] m-0 leading-[1.18]"
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2.3rem)",
            fontFamily: SF,
          }}
        >
          <span style={{ fontWeight: 300 }}>Comment louer en </span>
          <span style={{ fontWeight: 800 }}>4 étapes</span>
        </h2>
      </div>

      {/* ── Desktop Timeline (4 Equal Columns, Gap 24px) ── */}
      <div className="hidden md:block relative z-10">
        {/* Continuous 1px Track behind the circles from center of circle 1 to center of circle 4 */}
        <div
          ref={trackRef}
          aria-hidden="true"
          className="absolute h-[1px] pointer-events-none z-0"
          style={{
            top: 24, // vertical center of 48px circle
            left: "calc((100% - 72px) / 8)",
            right: "calc((100% - 72px) / 8)",
          }}
        >
          {/* Base gradient track */}
          <div
            className="w-full h-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(11,117,132,0.18), rgba(11,117,132,0.35), rgba(11,117,132,0.18))",
            }}
          />

          {/* Accent progress line (1.5px, scaleX 0 to 1) */}
          <div
            className="absolute top-1/2 left-0 w-full h-[1.5px] -translate-y-1/2 origin-left pointer-events-none"
            style={{
              backgroundColor: "#0B7584",
              transform: isRevealed ? "scaleX(1)" : "scaleX(0)",
              transition: "transform 1.2s cubic-bezier(0.65, 0, 0.35, 1)",
            }}
          />

          {/* Small travelling dot: 6px, accent, halo shadow, rides leading edge, fades out at end */}
          <div
            className="absolute top-1/2 left-0 w-1.5 h-1.5 -mt-[3px] -ml-[3px] rounded-full pointer-events-none"
            style={{
              backgroundColor: "#0B7584",
              boxShadow: "0 0 0 5px rgba(11, 117, 132, 0.14)",
              transform: isRevealed ? `translateX(${trackWidth}px)` : "translateX(0)",
              opacity: isRevealed ? (activeStep >= 4 ? 0 : 1) : 1,
              transition: "transform 1.2s cubic-bezier(0.65, 0, 0.35, 1), opacity 300ms ease 1.15s",
            }}
          />
        </div>

        {/* 4 Equal Columns Grid */}
        <div className="grid grid-cols-4 gap-6 text-center">
          {STEPS.map((step, i) => {
            const isStepActive = activeStep >= i + 1;

            return (
              <div
                key={step.num}
                className="group flex flex-col items-center relative z-10"
              >
                {/* 48px Circle Node (Accent border, white bg, halo on active/hover) */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 mx-auto relative z-10 transition-all duration-400 group-hover:shadow-[0_0_0_9px_rgba(11,117,132,0.12)] cursor-default select-none"
                  style={{
                    border: "1.5px solid #0B7584",
                    backgroundColor: isStepActive ? "rgba(11, 117, 132, 0.10)" : "#FFFFFF",
                    boxShadow: isStepActive ? "0 0 0 6px rgba(11, 117, 132, 0.08)" : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "ui-monospace, 'SF Mono', monospace",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#0B7584",
                      letterSpacing: "0.06em",
                      lineHeight: 1,
                    }}
                  >
                    {step.num}
                  </span>
                </div>

                {/* Step title & description */}
                <div
                  style={{
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed ? "translateY(0)" : "translateY(16px)",
                    transition: `opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) ${
                      300 + i * 80
                    }ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${300 + i * 80}ms`,
                  }}
                >
                  <h3
                    style={{
                      marginTop: 16,
                      fontSize: 16,
                      lineHeight: 1.3,
                      fontWeight: 600,
                      color: "#0F172A",
                      fontFamily: SF,
                    }}
                    className="m-0 mt-4"
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      marginTop: 6,
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "rgba(15, 23, 42, 0.68)",
                      maxWidth: "30ch",
                      fontFamily: SF,
                    }}
                    className="m-0 mt-1.5 mx-auto line-clamp-3"
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mobile Vertical Timeline (under 768px) ── */}
      <div className="md:hidden relative z-10">
        {/* Continuous vertical track at x = 20px */}
        <div
          aria-hidden="true"
          className="absolute left-[20px] top-[20px] bottom-[20px] w-[1.5px] -translate-x-1/2 pointer-events-none z-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,117,132,0.18), rgba(11,117,132,0.35), rgba(11,117,132,0.18))",
          }}
        >
          <div
            className="w-full h-full origin-top pointer-events-none"
            style={{
              backgroundColor: "#0B7584",
              transform: isRevealed ? "scaleY(1)" : "scaleY(0)",
              transition: "transform 1.2s cubic-bezier(0.65, 0, 0.35, 1)",
            }}
          />
        </div>

        {/* Vertical Steps */}
        <div className="space-y-7">
          {STEPS.map((step, i) => {
            const isStepActive = activeStep >= i + 1;

            return (
              <div
                key={step.num}
                className="flex items-start gap-4 relative z-10"
                style={{
                  opacity: isRevealed ? 1 : 0,
                  transform: isRevealed ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 600ms cubic-bezier(0.22, 1, 0.36, 1) ${
                    250 + i * 80
                  }ms, transform 600ms cubic-bezier(0.22, 1, 0.36, 1) ${250 + i * 80}ms`,
                }}
              >
                {/* 40px Circle Node */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative z-10 transition-all duration-300"
                  style={{
                    border: "1.5px solid #0B7584",
                    backgroundColor: isStepActive ? "rgba(11, 117, 132, 0.10)" : "#FFFFFF",
                    boxShadow: isStepActive ? "0 0 0 5px rgba(11, 117, 132, 0.08)" : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "ui-monospace, 'SF Mono', monospace",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#0B7584",
                      letterSpacing: "0.06em",
                      lineHeight: 1,
                    }}
                  >
                    {step.num}
                  </span>
                </div>

                {/* Left-aligned text */}
                <div className="flex-1 min-w-0 pt-1">
                  <h3
                    className="text-[15px] font-semibold text-[#0F172A] leading-[1.3] m-0"
                    style={{ fontFamily: SF }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-[13.5px] text-[#0F172A]/[0.68] leading-[1.55] m-0 mt-1"
                    style={{ fontFamily: SF }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Corner link moved below the last step, centered, margin-top 24px */}
        <div className="mt-6 text-center">
          <Link
            href="#booking-box"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#0B7584] group/corner no-underline"
          >
            <span className="relative">
              Faire ma demande
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#0B7584] scale-x-0 group-hover/corner:scale-x-100 transition-transform duration-250 origin-left" />
            </span>
            <span className="group-hover/corner:translate-x-1 transition-transform duration-200">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

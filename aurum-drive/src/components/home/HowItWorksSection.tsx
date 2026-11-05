"use client";

import { useEffect, useRef } from "react";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif";

const STEPS = [
  {
    num: "01",
    title: "Choisissez votre véhicule",
    shortDesc: "Parcourez la flotte et sélectionnez vos dates.",
    desc: "Parcourez notre flotte, sélectionnez vos dates de location et votre lieu de remise.",
  },
  {
    num: "02",
    title: "Transmettez votre demande",
    shortDesc: "Trois minutes en ligne, aucun paiement bancaire.",
    desc: "Trois minutes suffisent en ligne. Aucun paiement par carte bancaire requis.",
  },
  {
    num: "03",
    title: "Confirmation rapide",
    shortDesc: "Validation directe par téléphone ou WhatsApp.",
    desc: "Un conseiller vous contacte par téléphone ou WhatsApp pour valider la réservation.",
  },
  {
    num: "04",
    title: "Prenez la route",
    shortDesc: "Retrait à l'aéroport ou agence, règlement sur place.",
    desc: "Retrait à l'aéroport Houari Boumediene ou à l'agence. Règlement et caution sur place.",
  },
];

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("hiw-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        /* Desktop styles (100% untouched) */
        .hiw-step-circle {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .hiw-step-text {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .hiw-connector-line::after {
          content: '';
          display: block;
          height: 100%;
          width: 0;
          background: #0B7584;
          transition: width 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        .hiw-visible .hiw-step-circle {
          opacity: 1;
          transform: translateY(0);
        }
        .hiw-visible .hiw-step-text {
          opacity: 1;
          transform: translateY(0);
        }
        .hiw-visible .hiw-connector-line::after {
          width: 100%;
        }

        /* ── Mobile Snake Animation ── */
        .hiw-m-card {
          opacity: 0;
          transform: translateY(8px) scale(0.95);
          transition: opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .hiw-m-line-fill {
          background: #0B7584;
          position: absolute;
          inset: 0;
        }

        /* Timing: 1 -> line1 -> 2 -> line2 -> 3 -> line3 -> 4 */
        .hiw-visible .hiw-m-card-1 {
          opacity: 1;
          transform: translateY(0) scale(1);
          transition-delay: 0.1s;
        }
        .hiw-m-l1 {
          width: 0;
          transition: width 0.45s cubic-bezier(0.16,1,0.3,1) 0.5s;
        }
        .hiw-visible .hiw-m-l1 {
          width: 100%;
        }

        .hiw-visible .hiw-m-card-2 {
          opacity: 1;
          transform: translateY(0) scale(1);
          transition-delay: 0.95s;
        }
        .hiw-m-l2 {
          height: 0;
          transition: height 0.45s cubic-bezier(0.16,1,0.3,1) 1.35s;
        }
        .hiw-visible .hiw-m-l2 {
          height: 100%;
        }

        .hiw-visible .hiw-m-card-3 {
          opacity: 1;
          transform: translateY(0) scale(1);
          transition-delay: 1.8s;
        }
        .hiw-m-l3 {
          width: 0;
          transition: width 0.45s cubic-bezier(0.16,1,0.3,1) 2.2s;
        }
        .hiw-visible .hiw-m-l3 {
          width: 100%;
        }

        .hiw-visible .hiw-m-card-4 {
          opacity: 1;
          transform: translateY(0) scale(1);
          transition-delay: 2.65s;
        }

        @media (prefers-reduced-motion: reduce) {
          .hiw-step-circle,
          .hiw-step-text,
          .hiw-m-card {
            opacity: 1;
            transform: none;
            transition: none;
          }
          .hiw-connector-line::after,
          .hiw-m-l1,
          .hiw-m-l2,
          .hiw-m-l3 {
            width: 100% !important;
            height: 100% !important;
            transition: none;
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        style={{
          backgroundImage: "url('/images/howitworks-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 28,
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 4px 24px -4px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
          padding: "clamp(36px,6vw,72px) clamp(16px,4vw,44px)",
          maxWidth: 1280,
          width: "calc(100% - clamp(24px, 4vw, 48px))",
          margin: "clamp(48px, 6vw, 64px) auto clamp(72px, 9vw, 100px) auto",
          fontFamily: SF,
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: "clamp(28px, 4vw, 52px)",
            textAlign: "center",
            maxWidth: 560,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: "rgba(11, 117, 132,0.08)",
              color: "#0B7584",
              marginBottom: 12,
            }}
          >
            Processus Simple
          </div>
          <h2
            style={{
              fontSize: "clamp(1.5rem,3vw,2.3rem)",
              color: "#0F172A",
              margin: 0,
              lineHeight: 1.15,
              fontFamily: SF,
            }}
          >
            <span style={{ fontWeight: 300 }}>Comment louer en </span>
            <span style={{ fontWeight: 800 }}>4 étapes</span>
          </h2>
        </div>

        {/* ── 1. Desktop Timeline (Unchanged) ── */}
        <div
          className="hidden sm:flex hiw-timeline-row"
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 0,
            position: "relative",
          }}
        >
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                flex: 1,
                minWidth: 0,
              }}
            >
              {/* Step column */}
              <div
                className="hiw-step-wrapper"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {/* Circle */}
                <div
                  className="hiw-step-circle"
                  style={{
                    transitionDelay: `${i * 150}ms`,
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#FFFFFF",
                    border: "2px solid #0B7584",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    zIndex: 1,
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: 15,
                      color: "#0B7584",
                      fontFamily: "ui-monospace, 'SF Mono', monospace",
                      lineHeight: 1,
                    }}
                  >
                    {step.num}
                  </span>
                </div>

                {/* Text below circle */}
                <div
                  className="hiw-step-text"
                  style={{
                    transitionDelay: `${i * 150 + 100}ms`,
                    textAlign: "center",
                    marginTop: 14,
                    padding: "0 8px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "#0F172A",
                      lineHeight: 1.35,
                      marginBottom: 6,
                      fontFamily: SF,
                    }}
                  >
                    {step.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "#64748B",
                      lineHeight: 1.6,
                      fontFamily: SF,
                      fontWeight: 400,
                    }}
                  >
                    {step.desc}
                  </div>
                </div>
              </div>

              {/* Horizontal connector between steps */}
              {i < STEPS.length - 1 && (
                <div
                  className="hiw-connector-horiz"
                  style={{
                    width: 40,
                    flexShrink: 0,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: 2,
                      background: "rgba(194,120,58,0.3)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="hiw-connector-line"
                      style={{
                        position: "absolute",
                        inset: 0,
                        transitionDelay: `${i * 200 + 200}ms`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── 2. Mobile 2x2 Snake Timeline ── */}
        <div className="sm:hidden relative">
          {/* Row 1: Step 1 (top-left) -> Line 1->2 -> Step 2 (top-right) */}
          <div className="grid grid-cols-2 gap-2.5 relative">
            {/* Step 1 */}
            <div className="hiw-m-card hiw-m-card-1 p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between min-h-[96px]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-[#0B7584]/10 border-2 border-[#0B7584] flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-black text-[#0B7584] font-mono leading-none">01</span>
                </div>
                <h4 className="text-[11px] font-bold text-slate-900 leading-tight m-0 line-clamp-2">
                  {STEPS[0].title}
                </h4>
              </div>
              <p className="text-[9.5px] text-slate-500 leading-snug m-0">
                {STEPS[0].shortDesc}
              </p>
            </div>

            {/* Connecting line 1 -> 2 */}
            <div className="absolute left-[45%] right-[45%] top-5 h-0.5 bg-[#0B7584]/25 z-10 pointer-events-none overflow-hidden">
              <div className="hiw-m-line-fill hiw-m-l1" />
            </div>

            {/* Step 2 */}
            <div className="hiw-m-card hiw-m-card-2 p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between min-h-[96px]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-[#0B7584]/10 border-2 border-[#0B7584] flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-black text-[#0B7584] font-mono leading-none">02</span>
                </div>
                <h4 className="text-[11px] font-bold text-slate-900 leading-tight m-0 line-clamp-2">
                  {STEPS[1].title}
                </h4>
              </div>
              <p className="text-[9.5px] text-slate-500 leading-snug m-0">
                {STEPS[1].shortDesc}
              </p>
            </div>
          </div>

          {/* Vertical Snake Connector (2 -> 3) on the right side */}
          <div className="flex justify-end pr-[22%] my-1.5 h-5">
            <div className="w-0.5 h-full bg-[#0B7584]/25 relative overflow-hidden">
              <div className="hiw-m-line-fill hiw-m-l2" />
            </div>
          </div>

          {/* Row 2: Step 4 (bottom-left) <- Line 3->4 <- Step 3 (bottom-right) */}
          <div className="grid grid-cols-2 gap-2.5 relative">
            {/* Step 4 (left) */}
            <div className="hiw-m-card hiw-m-card-4 p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between min-h-[96px]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-[#0B7584]/10 border-2 border-[#0B7584] flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-black text-[#0B7584] font-mono leading-none">04</span>
                </div>
                <h4 className="text-[11px] font-bold text-slate-900 leading-tight m-0 line-clamp-2">
                  {STEPS[3].title}
                </h4>
              </div>
              <p className="text-[9.5px] text-slate-500 leading-snug m-0">
                {STEPS[3].shortDesc}
              </p>
            </div>

            {/* Connecting line 3 -> 4 (draws from right to left) */}
            <div className="absolute left-[45%] right-[45%] top-5 h-0.5 bg-[#0B7584]/25 z-10 pointer-events-none overflow-hidden">
              <div
                className="hiw-m-line-fill hiw-m-l3"
                style={{
                  left: "auto",
                  right: 0,
                }}
              />
            </div>

            {/* Step 3 (right) */}
            <div className="hiw-m-card hiw-m-card-3 p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between min-h-[96px]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-[#0B7584]/10 border-2 border-[#0B7584] flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-black text-[#0B7584] font-mono leading-none">03</span>
                </div>
                <h4 className="text-[11px] font-bold text-slate-900 leading-tight m-0 line-clamp-2">
                  {STEPS[2].title}
                </h4>
              </div>
              <p className="text-[9.5px] text-slate-500 leading-snug m-0">
                {STEPS[2].shortDesc}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

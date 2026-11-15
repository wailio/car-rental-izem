"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MapPin, Calendar, Headphones, ShieldCheck } from "lucide-react";
import { ROUTES, BRAND } from "@/lib/config";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif";

interface ServiceItem {
  num: string;
  title: string;
  desc: string;
  tag: string;
  icon: typeof MapPin;
  href: string;
}

const SERVICES: ServiceItem[] = [
  {
    num: "01",
    title: "Livraison & retour gratuits à l'aéroport",
    desc: "Les clés vous attendent dès votre arrivée au terminal d'Alger Houari Boumediene. Restitution rapide et sans frais.",
    tag: "Gratuit",
    icon: MapPin,
    href: ROUTES.services,
  },
  {
    num: "02",
    title: "Location courte, moyenne ou longue durée",
    desc: "Du week-end au mois entier, bénéficiez de tarifs dégressifs transparents et d'une caution restituée dans les délais.",
    tag: "Tarifs dégressifs",
    icon: Calendar,
    href: ROUTES.services,
  },
  {
    num: "03",
    title: "Assistance routière 24h/24, 7j/7",
    desc: "Une équipe dédiée disponible par téléphone et WhatsApp à toute heure pour vous dépanner ou répondre à vos questions.",
    tag: "24h/24 · 7j/7",
    icon: Headphones,
    href: ROUTES.services,
  },
  {
    num: "04",
    title: "Assurance tous risques incluse",
    desc: "Couverture intégrale sur tous nos véhicules récents, pour voyager en toute sérénité à travers l'Algérie.",
    tag: "Tous risques",
    icon: ShieldCheck,
    href: ROUTES.services,
  },
];

export function ServicesEditorialSection() {
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const whatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
    "Bonjour IZEM MOTORS, j'ai une question concernant vos prestations de location."
  )}`;

  return (
    <section
      ref={sectionRef}
      id="prestations"
      className="relative w-full overflow-hidden"
      style={{
        fontFamily: SF,
        background: "#F5F5F7",
        paddingTop: "clamp(42px, 4.5vw, 64px)",
        paddingBottom: "clamp(42px, 4.5vw, 64px)",
        paddingLeft: "clamp(16px, 4vw, 40px)",
        paddingRight: "clamp(16px, 4vw, 40px)",
      }}
    >
      {/* Soft radial dark-cyan glow on top-right for depth */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(11, 117, 132, 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-[1000px] mx-auto z-10">
        {/* ── 1. Minimal Header (Eyebrow + Single-Line Title, 20px gap to container) ── */}
        <div className="mb-4 md:mb-5">
          <div
            data-pop="badge"
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold tracking-[0.08em] uppercase bg-[#0B7584]/[0.08] text-[#0B7584] mb-2"
          >
            Nos Prestations
          </div>
          <h2
            data-pop="up"
            className="text-[#0F172A] tracking-[-0.025em] leading-[1.2] m-0 sm:whitespace-nowrap"
            style={{
              fontSize: "clamp(22px, 2.6vw, 32px)",
              fontFamily: SF,
            }}
          >
            <span style={{ fontWeight: 300 }}>Des services pensés pour </span>
            <span style={{ fontWeight: 800 }}>votre confort</span>
          </h2>
        </div>

        {/* ── 2. Compact Rounded Grid Container (Radius 20px, max 1000px, Dark-Cyan Dividers & Center Dot) ── */}
        <div
          data-pop="scale"
          className="w-full rounded-[18px] md:rounded-[20px] bg-white border border-[#0B7584]/[0.14] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_40px_-20px_rgba(15,23,42,0.12)] overflow-hidden relative"
        >
          {/* Top edge highlight with dark-cyan fading gradient */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none z-20"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(11, 117, 132, 0.5) 50%, transparent 100%)",
            }}
          />

          {/* Horizontal fading divider line (Desktop only, centered at top 50%) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute left-0 right-0 top-1/2 h-[1px] pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(11, 117, 132, 0.45) 18%, rgba(11, 117, 132, 0.45) 82%, transparent 100%)",
              transformOrigin: "center",
              transform: isRevealed ? "translateY(-50%) scaleX(1)" : "translateY(-50%) scaleX(0)",
              transition: "transform 900ms cubic-bezier(0.22, 1, 0.36, 1) 150ms",
            }}
          />

          {/* Vertical fading divider line (Desktop only, centered at left 50%) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[1px] pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(11, 117, 132, 0.45) 18%, rgba(11, 117, 132, 0.45) 82%, transparent 100%)",
              transformOrigin: "center",
              transform: isRevealed ? "translateX(-50%) scaleY(1)" : "translateX(-50%) scaleY(0)",
              transition: "transform 900ms cubic-bezier(0.22, 1, 0.36, 1) 150ms",
            }}
          />

          {/* 6px Center Crossing Dot in accent with soft halo (Desktop only) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full pointer-events-none z-20"
            style={{
              backgroundColor: "#0B7584",
              boxShadow: "0 0 0 5px rgba(11, 117, 132, 0.12)",
              transformOrigin: "center",
              transform: isRevealed
                ? "translate(-50%, -50%) scale(1)"
                : "translate(-50%, -50%) scale(0)",
              opacity: isRevealed ? 1 : 0,
              transition: "opacity 300ms ease, transform 300ms ease",
            }}
          />

          {/* 2×2 Grid (Equal row heights with [grid-auto-rows:1fr], 1 col on Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 [grid-auto-rows:1fr]">
            {SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              const isNotLastMobile = i < SERVICES.length - 1;

              return (
                <React.Fragment key={svc.num}>
                  <Link
                    href={svc.href}
                    className="group relative flex flex-col justify-start text-left outline-none transition-colors duration-250 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0B7584] focus-visible:ring-inset hover:bg-[#0B7584]/[0.035] active:bg-[#0B7584]/[0.06] p-[16px_18px] md:p-[20px_26px]"
                    style={{
                      opacity: isRevealed ? 1 : 0,
                      transform: isRevealed ? "translateY(0)" : "translateY(16px)",
                      transition: `opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) ${
                        300 + i * 70
                      }ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${300 + i * 70}ms`,
                    }}
                  >
                    {/* Top row: 36px icon tile + Accent Number */}
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 md:w-9 md:h-9 rounded-[9px] md:rounded-[10px] bg-[#0B7584]/[0.08] group-hover:bg-[#0B7584] flex items-center justify-center transition-colors duration-250 shrink-0">
                        <Icon
                          size={17}
                          strokeWidth={1.5}
                          className="text-[#0B7584] group-hover:text-white transition-colors duration-250"
                        />
                      </div>
                      <span
                        className="text-[12px] md:text-[12.5px] font-mono tabular-nums tracking-[0.12em] text-[#0B7584] font-semibold select-none"
                        style={{
                          opacity: isRevealed ? 1 : 0,
                          transition: `opacity 500ms ease ${300 + 4 * 70 + 80}ms`,
                        }}
                      >
                        {svc.num}
                      </span>
                    </div>

                    {/* Title (margin-top 12px, 16-17px / 1.3, weight 600) */}
                    <h3 className="mt-3 md:mt-3 text-[16px] md:text-[17px] font-semibold text-[#0F172A] leading-[1.3] tracking-[-0.01em] m-0">
                      {svc.title}
                    </h3>

                    {/* Description (margin-top 5px, 13.5-14px / 1.55, ink@68%, max-width 46ch) */}
                    <p className="mt-1 md:mt-1.5 text-[13px] md:text-[13.5px] font-normal text-[#0F172A]/[0.68] leading-[1.55] max-w-[46ch] m-0">
                      {svc.desc}
                    </p>

                    {/* Value tag (margin-top 12px, height 24px) */}
                    <div className="mt-3 md:mt-3.5">
                      <span className="h-[22px] md:h-[24px] px-2.5 rounded-full text-[11px] md:text-[11.5px] font-medium text-[#0B7584] bg-[#0B7584]/[0.08] inline-flex items-center border-0 select-none">
                        {svc.tag}
                      </span>
                    </div>
                  </Link>

                  {/* Mobile horizontal fading divider line between items */}
                  {isNotLastMobile && (
                    <div
                      aria-hidden="true"
                      className="md:hidden w-full h-[1px]"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(11, 117, 132, 0.45) 18%, rgba(11, 117, 132, 0.45) 82%, transparent 100%)",
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ── 3. Bottom Row: One Slim Line (margin-top 16px) ── */}
        <div className="mt-4 text-center text-[13px] sm:text-[13.5px] text-[#0F172A]/70 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>Une question avant de réserver ?</span>
          <span className="hidden sm:inline text-[#0F172A]/30">·</span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/wa relative text-[#0B7584] font-medium inline-flex items-center no-underline"
          >
            <span>Écrire sur WhatsApp</span>
            <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#0B7584] scale-x-0 group-hover/wa:scale-x-100 transition-transform duration-250 origin-left" />
          </a>
          <span className="text-[#0F172A]/40">·</span>
          <a
            href={`tel:${BRAND.whatsapp ? `+${BRAND.whatsapp}` : "+213772233664"}`}
            className="group/call relative text-[#0B7584] font-medium inline-flex items-center no-underline"
          >
            <span>Appeler</span>
            <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#0B7584] scale-x-0 group-hover/call:scale-x-100 transition-transform duration-250 origin-left" />
          </a>
        </div>
      </div>
    </section>
  );
}

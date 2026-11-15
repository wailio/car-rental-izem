"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Calendar, Headphones, ShieldCheck } from "lucide-react";
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

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.507 14.307l-.009.075c-.239 1.042-1.258 1.956-2.28 2.054-.606.059-1.397-.101-2.091-.371-2.906-1.129-4.786-3.874-4.935-4.068-.141-.183-1.173-1.564-1.173-2.983 0-1.419.744-2.117 1.009-2.404.265-.288.58-.36.774-.36.195 0 .387.002.556.01.18.009.421-.069.658.502.246.594.84 2.05.914 2.2.073.15.122.327.024.521-.097.195-.147.316-.29.489-.145.172-.304.385-.436.516-.145.146-.296.305-.128.593.169.288.751 1.238 1.611 2.003 1.107.985 2.04 1.291 2.33 1.436.289.145.458.12.628-.073.17-.194.726-.845.92-1.136.194-.29.387-.243.654-.145.267.097 1.696.8 1.986.945.29.146.484.219.557.34.073.122.073.707-.166 1.749zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.434 5.178L2 22l4.981-1.397A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
    </svg>
  );
}

export function ServicesEditorialSection() {
  const whatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
    "Bonjour IZEM MOTORS, j'ai une question concernant vos prestations de location."
  )}`;

  return (
    <section
      id="prestations"
      className="relative w-full overflow-hidden"
      style={{
        fontFamily: SF,
        background: "#F5F5F7",
        paddingTop: "clamp(80px, 9vw, 128px)",
        paddingBottom: "clamp(80px, 9vw, 128px)",
        paddingLeft: "clamp(16px, 4vw, 40px)",
        paddingRight: "clamp(16px, 4vw, 40px)",
      }}
    >
      {/* Soft radial accent glow on top-right for elegant depth */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(11, 117, 132, 0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-[1160px] mx-auto z-10">
        {/* ── 1. Header (2 Columns on Desktop: 1.2fr / 1fr, aligned to bottom) ── */}
        <div
          className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] items-end gap-6 md:gap-12"
          style={{ marginBottom: 56 }}
        >
          {/* Left: Eyebrow + H2 */}
          <div>
            <div
              data-pop="badge"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.08em] uppercase bg-[#0B7584]/[0.08] text-[#0B7584] mb-3.5"
            >
              Nos Prestations
            </div>
            <h2
              data-pop="up"
              className="text-[#0F172A] tracking-[-0.025em] leading-[1.15] m-0"
              style={{
                fontSize: "clamp(1.75rem, 3.2vw, 2.6rem)",
                fontFamily: SF,
              }}
            >
              <span style={{ fontWeight: 300 }}>Des services pensés pour </span>
              <span style={{ fontWeight: 800 }}>votre confort</span>
            </h2>
          </div>

          {/* Right: Short intro line + Text Link */}
          <div className="md:text-left">
            <p
              data-pop="up"
              data-pop-delay="0.08s"
              className="text-[#0F172A]/[0.65] text-[15px] sm:text-[16px] leading-[1.6] max-w-[42ch] m-0 mb-3"
            >
              De l&apos;arrivée à l&apos;aéroport jusqu&apos;au retour du véhicule, tout est prévu pour vous.
            </p>
            <Link
              href={ROUTES.services}
              data-pop="up"
              data-pop-delay="0.16s"
              className="group/link inline-flex items-center gap-1.5 text-[14px] sm:text-[15px] font-semibold text-[#0B7584] no-underline relative w-fit"
            >
              <span className="relative">
                Voir tous les services
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#0B7584] scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left" />
              </span>
              <ArrowRight
                size={14}
                className="group-hover/link:translate-x-1 transition-transform duration-200"
              />
            </Link>
          </div>
        </div>

        {/* ── 2. The ONE Rounded Grid Container (2x2 Desktop, 1 Col Mobile) ── */}
        <div
          data-pop="scale"
          className="w-full rounded-[28px] bg-white border border-[#0F172A]/[0.08] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_48px_-24px_rgba(15,23,42,0.14)] overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              // Border logic for seamless 1px hairlines:
              // Mobile: all except the last item have border-b
              // Desktop: Col 0 has right border (i % 2 === 0 -> md:border-r)
              //          Row 0 has bottom border (i < 2 -> md:border-b)
              const isLastMobile = i === SERVICES.length - 1;
              const hasRightBorderMd = i % 2 === 0;
              const hasBottomBorderMd = i < 2;

              return (
                <Link
                  key={svc.num}
                  href={svc.href}
                  className={`group relative flex flex-col justify-between text-left transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#0B7584] focus-visible:ring-inset hover:bg-[#0B7584]/[0.035] active:bg-[#0B7584]/[0.06] ${
                    isLastMobile ? "border-b-0" : "border-b border-[#0F172A]/[0.08]"
                  } ${
                    hasRightBorderMd ? "md:border-r md:border-[#0F172A]/[0.08]" : "md:border-r-0"
                  } ${
                    hasBottomBorderMd ? "md:border-b md:border-[#0F172A]/[0.08]" : "md:border-b-0"
                  }`}
                  style={{
                    padding: "clamp(24px, 3vw, 44px)",
                    minHeight: 220,
                  }}
                >
                  {/* Top row: 48x48 icon tile + Muted number label */}
                  <div className="flex items-center justify-between w-full">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] bg-[#0B7584]/[0.08] group-hover:bg-[#0B7584]/[0.14] flex items-center justify-center transition-colors duration-300 shrink-0">
                      <Icon
                        size={22}
                        strokeWidth={1.5}
                        className="text-[#0B7584] group-hover:-translate-y-0.5 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[12px] font-mono tabular-nums tracking-[0.1em] text-[#0F172A]/35 font-medium select-none">
                      {svc.num}
                    </span>
                  </div>

                  {/* Middle row: Title + Description */}
                  <div className="my-4 sm:my-5 space-y-2">
                    <h3 className="text-[18px] sm:text-[20px] font-semibold text-[#0F172A] leading-[1.3] tracking-[-0.01em] m-0">
                      {svc.title}
                    </h3>
                    <p className="text-[14px] sm:text-[15px] font-normal text-[#0F172A]/[0.68] leading-[1.7] max-w-[44ch] m-0">
                      {svc.desc}
                    </p>
                  </div>

                  {/* Bottom row: Value tag pill + 36px Arrow Circle */}
                  <div className="mt-auto pt-2 flex items-center justify-between w-full">
                    <span className="h-7 px-3 rounded-full text-[12.5px] font-medium text-[#0B7584] bg-[#0B7584]/[0.08] inline-flex items-center border-0 select-none">
                      {svc.tag}
                    </span>

                    {/* Arrow circle: always visible on mobile, slides in and fills accent on desktop hover */}
                    <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 ease-out max-md:opacity-100 max-md:translate-x-0 max-md:bg-[#0B7584]/10 max-md:text-[#0B7584] md:opacity-0 md:-translate-x-2 md:bg-[#0B7584] md:text-white md:group-hover:opacity-100 md:group-hover:translate-x-0 md:shadow-md md:shadow-[#0B7584]/25 shrink-0">
                      <ArrowRight size={15} strokeWidth={2} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── 3. Below the Grid: Slim Space-between Row ── */}
        <div
          className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1"
        >
          <span className="text-[#0F172A]/75 text-[14px] sm:text-[15px] font-medium">
            Une question avant de réserver ?
          </span>

          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full border border-[#0B7584] text-[#0B7584] hover:bg-[#0B7584] hover:text-white text-[12.5px] sm:text-[13px] font-semibold transition-all duration-200 shadow-xs active:scale-[0.98]"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Écrire sur WhatsApp</span>
            </a>
            <a
              href={`tel:${BRAND.whatsapp ? `+${BRAND.whatsapp}` : "+213772233664"}`}
              className="px-3 py-2 text-[13px] sm:text-[13.5px] font-semibold text-[#0F172A]/75 hover:text-[#0B7584] transition-colors"
            >
              Appeler
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

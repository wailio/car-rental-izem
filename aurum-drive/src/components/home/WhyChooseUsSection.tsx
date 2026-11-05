"use client";

import { useState } from "react";
import Image from "next/image";
import { Plane, PhoneCall, ShieldCheck, Car } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const FEATURES = [
  {
    icon: Plane,
    title: "Livraison gratuite à l'aéroport",
    shortDesc: "Remise directe au terminal sans frais.",
    description:
      "Remise des clés dès votre arrivée au terminal d'Alger Houari Boumediene. Restitution sans frais au même endroit.",
  },
  {
    icon: PhoneCall,
    title: "Assistance 24h/24, 7j/7",
    shortDesc: "Équipe joignable à toute heure 24/7.",
    description:
      "Une équipe locale joignable par téléphone et WhatsApp à toute heure pour vous accompagner sur les routes.",
  },
  {
    icon: ShieldCheck,
    title: "Assurance tous risques",
    shortDesc: "Couverture totale sans frais cachés.",
    description:
      "Couverture complète incluse pour voyager en toute sérénité sans frais cachés ni franchise excessive.",
  },
  {
    icon: Car,
    title: "Véhicules récents et propres",
    shortDesc: "Voitures récentes, lavées et prêtes.",
    description:
      "Voitures récentes, boîte automatique ou manuelle, soigneusement entretenues et lavées avant chaque départ.",
  },
] as const;

export function WhyChooseUsSection() {
  const [activeFeature, setActiveFeature] = useState(0);
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: Asymmetric Photo Collage */}
        <div className="relative h-[420px] sm:h-[500px] lg:h-[540px] flex items-center">
          {/* Left Photo: hfla (Wedding / Cortège Event Car) */}
          <div className="absolute left-0 top-6 sm:top-8 w-[56%] sm:w-[58%] h-[78%] sm:h-[84%] rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200/90 shadow-xl bg-gray-100 z-0">
            <Image
              src="/images/hfla.png"
              alt="Véhicule de cortège et événementiel IZEM MOTORS"
              fill
              sizes="(max-width: 1024px) 60vw, 30vw"
              className="object-cover object-center"
            />
          </div>

          {/* Right Photo: bch (Tall Airport Handover & Contract) — Tall & Prominent */}
          <div className="absolute right-0 top-0 w-[50%] sm:w-[48%] h-full rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-gray-100 z-10">
            <Image
              src="/images/bch.jpg"
              alt="Contrat de location et remise des clés à l'Aéroport d'Alger - IZEM MOTORS"
              fill
              sizes="(max-width: 1024px) 60vw, 30vw"
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Airport Delivery Floating Badge */}
          <div className="absolute left-2 sm:left-4 bottom-1 sm:bottom-2 bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-2xl p-3 sm:p-3.5 shadow-xl flex items-center gap-3 z-20">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0B7584]/10 text-[#0B7584] flex items-center justify-center shrink-0">
              <Plane size={19} />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-950 m-0 leading-tight">
                Livraison Aéroport
              </p>
              <p className="text-[11px] sm:text-xs font-semibold text-[#0B7584] m-0 mt-0.5">
                Gratuite · 24h/24, 7j/7
              </p>
            </div>
          </div>
        </div>

        {/* Right: Content & Feature Cards */}
        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#0B7584]/10 text-[#0B7584] mb-3">
              Pourquoi nous choisir
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight leading-tight">
              La garantie d&apos;un voyage en toute sérénité
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
              Nous faisons de la simplicité et de la ponctualité nos priorités absolues pour vos séjours à Alger.
            </p>
          </div>

          {/* 4 Feature Cards — Distinctive Light Architectural Shapes with Ground Elevation & Cyan Needle Shelf */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-5 pt-2">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              const isActive = activeFeature === i;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setActiveFeature(i)}
                  className="relative group transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "clamp(14px, 1.8vw, 20px)",
                    border: isActive
                      ? "1px solid rgba(11, 117, 132, 0.35)"
                      : "1px solid rgba(15, 23, 42, 0.08)",
                    boxShadow: isActive
                      ? "0 20px 40px -10px rgba(15, 23, 42, 0.12), 0 8px 24px -4px rgba(11, 117, 132, 0.14), 0 2px 6px rgba(0, 0, 0, 0.04)"
                      : "0 8px 22px -6px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03)",
                    transform: isActive ? "translateY(-4px)" : "translateY(0)",
                    transition: "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
                    padding: "clamp(12px, 2vw, 22px)",
                  }}
                >
                  {/* Subtle Top Inner Sheen */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "15%",
                      right: "15%",
                      height: 1,
                      background: isActive
                        ? "linear-gradient(90deg, transparent 0%, rgba(11, 117, 132, 0.35) 50%, transparent 100%)"
                        : "linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.04) 50%, transparent 100%)",
                      transition: "background 0.3s ease",
                    }}
                  />

                  <div>
                    {/* Icon Tile with Cyan Depth */}
                    <div
                      style={{
                        width: "clamp(34px, 3.2vw, 42px)",
                        height: "clamp(34px, 3.2vw, 42px)",
                        borderRadius: 12,
                        background: isActive
                          ? "linear-gradient(135deg, rgba(11, 117, 132, 0.12) 0%, rgba(18, 135, 149, 0.06) 100%)"
                          : "rgba(11, 117, 132, 0.06)",
                        border: isActive
                          ? "1px solid rgba(11, 117, 132, 0.25)"
                          : "1px solid rgba(11, 117, 132, 0.12)",
                        color: "#0B7584",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "clamp(8px, 1.2vw, 14px)",
                        boxShadow: isActive ? "0 4px 12px rgba(11, 117, 132, 0.16)" : "none",
                        transition: "all 0.25s ease",
                      }}
                    >
                      <Icon size={18} />
                    </div>

                    {/* Title */}
                    <h3
                      className="text-xs sm:text-base font-bold text-gray-950 mb-1 leading-snug line-clamp-1 sm:line-clamp-none"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      {feat.title}
                    </h3>

                    {/* Description */}
                    <p className="hidden sm:block text-xs text-gray-600 leading-relaxed m-0">
                      {feat.description}
                    </p>
                    <p className="sm:hidden text-[10px] text-gray-500 leading-snug m-0">
                      {feat.shortDesc}
                    </p>
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
                      opacity: isActive ? 0.9 : 0.4,
                      transform: isActive ? "scaleX(1.1)" : "scaleX(0.85)",
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <svg
                      viewBox="0 0 100 4"
                      preserveAspectRatio="none"
                      style={{
                        width: "100%",
                        height: "100%",
                        filter: isActive
                          ? "drop-shadow(0 -1px 2px rgba(11, 117, 132, 0.4))"
                          : "none",
                      }}
                    >
                      <defs>
                        <linearGradient id={`why-laser-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#0B7584" stopOpacity="0" />
                          <stop offset="20%" stopColor="#085A66" stopOpacity="0.8" />
                          <stop offset="50%" stopColor="#128795" stopOpacity="0.95" />
                          <stop offset="80%" stopColor="#085A66" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#0B7584" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M 0 2 Q 50 0 100 2 Q 50 4 0 2 Z" fill={`url(#why-laser-${i})`} />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

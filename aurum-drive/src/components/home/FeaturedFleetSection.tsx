"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { vehicles, categories } from "@/lib/data";
import { ROUTES } from "@/lib/config";
import { Users, Fuel, Gauge, ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { VehicleModal } from "@/components/ui/VehicleModal";
import { Vehicle } from "@/content/fleet";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif";

export function FeaturedFleetSection() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const sectionRef = useScrollReveal<HTMLElement>();

  const filteredVehicles =
    activeTab === "all"
      ? vehicles
      : vehicles.filter((v) => v.categoryId === activeTab);

  return (
    <section ref={sectionRef} className="py-14 sm:py-20 relative overflow-hidden" style={{ fontFamily: SF, background: '#FFFFFF' }}>
      {/* Subtle ambient radial */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-br from-[#0B7584]/4 via-transparent to-transparent rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs tracking-wide uppercase"
              style={{ background: 'rgba(11, 117, 132,0.08)', color: '#0B7584', fontWeight: 700 }}
            >
              Notre Flotte
            </div>
            <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.6rem)', color: '#0F172A', lineHeight: 1.2 }}>
              <span style={{ fontWeight: 300 }}>Véhicules disponibles à </span>
              <span style={{ fontWeight: 800, color: '#0B7584' }}>Alger</span>
            </h2>
            <p style={{ color: '#64748B', fontSize: 14, fontWeight: 400, maxWidth: 460, lineHeight: 1.6 }}>
              Chaque véhicule fait l&apos;objet d&apos;un entretien rigoureux et d&apos;un nettoyage complet avant chaque livraison.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[{ id: "all", name: "Tous les modèles" }, ...categories.slice(0, 5)].map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveTab(c.id)}
                style={{
                  fontFamily: SF,
                  fontWeight: 600,
                  fontSize: 12,
                  borderRadius: 100,
                  padding: '7px 16px',
                  border: activeTab === c.id ? 'none' : '1px solid rgba(0,0,0,0.12)',
                  background: activeTab === c.id ? '#0B7584' : 'white',
                  color: activeTab === c.id ? 'white' : '#374151',
                  boxShadow: activeTab === c.id ? '0 2px 8px rgba(11, 117, 132,0.25)' : '0 1px 3px rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  transition: 'background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of White Vehicle Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
          {filteredVehicles.map((vehicle, i) => (
            <div
              key={vehicle.id}
              data-reveal="fade-up"
              data-reveal-delay={String(i * 60)}
              className="group flex flex-col justify-between"
              style={{
                background: '#F4F5F8',
                borderRadius: 16,
                padding: 'clamp(6px, 1.5vw, 12px)',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 16px -2px rgba(15,23,42,0.05), 0 1px 3px rgba(15,23,42,0.03)',
                transition: 'box-shadow 0.22s ease, transform 0.22s cubic-bezier(0.16,1,0.3,1), border-color 0.22s ease, outline-color 0.22s ease',
                fontFamily: SF,
                cursor: 'pointer',
                outline: '2px solid transparent',
                outlineOffset: '2px',
              }}
              onClick={() => setSelectedVehicle(vehicle as Vehicle)}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 16px 36px -8px rgba(15,23,42,0.12), 0 4px 12px -2px rgba(15,23,42,0.06)';
                e.currentTarget.style.borderColor = 'rgba(11, 117, 132,0.35)';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.outline = '2px solid rgba(11, 117, 132,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px -2px rgba(15,23,42,0.05), 0 1px 3px rgba(15,23,42,0.03)';
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.outline = '2px solid transparent';
              }}
            >
              {/* Image Frame — Crisp white backdrop inside the grey card */}
              <div className="relative h-28 sm:h-56 w-full rounded-xl sm:rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)' }}>
                <Image
                  src={vehicle.images[0]}
                  alt={vehicle.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 rounded-lg sm:rounded-xl"
                />
                {/* Status badge — dark green glassy, no dot, slightly rounded */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 pointer-events-none select-none">
                  <div
                    className="text-[8px] sm:text-[10.5px] px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg font-bold tracking-wider uppercase"
                    style={{
                      fontFamily: SF,
                      backdropFilter: 'blur(14px) saturate(1.5)',
                      WebkitBackdropFilter: 'blur(14px) saturate(1.5)',
                      background: vehicle.available
                        ? 'rgba(20, 83, 45, 0.85)'
                        : 'rgba(127, 29, 29, 0.80)',
                      border: vehicle.available
                        ? '1px solid rgba(74,222,128,0.20)'
                        : '1px solid rgba(252,165,165,0.16)',
                      color: vehicle.available ? 'rgba(220,252,231,0.96)' : 'rgba(254,226,226,0.92)',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.28)',
                    }}
                  >
                    {vehicle.available ? 'Disponible' : 'Indisponible'}
                  </div>
                </div>
                {/* Brand tag */}
                <div
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10"
                  style={{
                    fontSize: 8.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: '#374151', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
                    padding: '2px 7px', borderRadius: 99, border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  {vehicle.brand}
                </div>
              </div>

              {/* Card content */}
              <div className="p-1.5 sm:p-4 space-y-1.5 sm:space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1 sm:space-y-2.5">
                  <h3
                    className="group-hover:text-[#0B7584] transition-colors truncate"
                    style={{ fontSize: "clamp(12px, 1.3vw, 17px)", fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}
                  >
                    {vehicle.name}
                  </h3>

                  {/* Specs chips — Crisp white inset chips */}
                  <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
                    {[
                      { icon: <Users size={11} style={{ color: '#0B7584' }} />, label: `${vehicle.specs.seats} pl.` },
                      { icon: <Gauge size={11} style={{ color: '#0B7584' }} />, label: vehicle.specs.gearbox },
                      { icon: <Fuel size={11} style={{ color: '#0B7584' }} />, label: vehicle.specs.fuel },
                    ].map((spec, si) => (
                      <div
                        key={si}
                        className="flex items-center justify-center gap-0.5 sm:gap-1"
                        style={{
                          fontSize: "clamp(8.5px, 0.9vw, 11px)", fontWeight: 500, color: '#475569',
                          padding: 'clamp(3px, 0.5vw, 7px) clamp(2px, 0.5vw, 4px)', borderRadius: 8,
                          background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                        }}
                      >
                        {spec.icon}
                        <span className="truncate">{spec.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Feature tags — Crisp white tags (desktop only) */}
                  <div className="hidden sm:flex flex-wrap gap-1">
                    {vehicle.features.slice(0, 2).map((feat, fi) => (
                      <span
                        key={fi}
                        style={{
                          fontSize: 11, fontWeight: 500, color: '#475569',
                          padding: '4px 10px', borderRadius: 8,
                          background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                        }}
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & CTA */}
                <div
                  className="flex items-center justify-between gap-1.5 sm:gap-3 pt-1.5 sm:pt-3"
                  style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}
                >
                  <div>
                    <div style={{ fontSize: "clamp(8px, 0.8vw, 10px)", fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Tarif / jour
                    </div>
                    <div style={{ fontSize: "clamp(13px, 1.6vw, 22px)", fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                      {vehicle.pricePerDay.toLocaleString("fr-DZ")}{" "}
                      <span style={{ fontSize: "clamp(9px, 0.9vw, 12px)", fontWeight: 500, color: '#94A3B8' }}>DA</span>
                    </div>
                  </div>

                  {/* Reserve button (desktop only — mobile opens modal directly by clicking the card) */}
                  <Link
                    href={ROUTES.reserve(vehicle.id)}
                    className="hidden sm:inline-flex"
                    style={{
                      alignItems: 'center', gap: 6,
                      background: '#0B7584', color: 'white',
                      fontWeight: 600, fontSize: 13, borderRadius: 100,
                      padding: '9px 18px', boxShadow: '0 2px 8px rgba(11, 117, 132,0.28)',
                      textDecoration: 'none', whiteSpace: 'nowrap',
                      transition: 'background 0.18s ease, transform 0.18s cubic-bezier(0.16,1,0.3,1)',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; }}
                  >
                    Réserver
                    <ArrowRight size={13} strokeWidth={2.5} />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bouton voir toute la flotte */}
        <div className="text-center mt-10">
          <Link
            href={ROUTES.fleet}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: SF, fontWeight: 600, fontSize: 14,
              background: 'white', color: '#0F172A',
              border: '1px solid rgba(0,0,0,0.14)', borderRadius: 100,
              padding: '11px 28px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              textDecoration: 'none',
              transition: 'background 0.18s ease, box-shadow 0.18s ease, transform 0.18s cubic-bezier(0.16,1,0.3,1)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#F8F9FA';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 14px rgba(0,0,0,0.09)';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'white';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
            }}
          >
            <span>Voir toute la flotte ({vehicles.length} véhicules)</span>
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
      <VehicleModal vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
    </section>
  );
}
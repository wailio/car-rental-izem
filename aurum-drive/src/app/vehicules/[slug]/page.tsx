"use client";

/**
 * Vehicle detail page — Phase 4 / `/vehicules/[slug]`
 *
 * Spec:
 * - Defined elevated shapes with crisp shadows and sculpted grey contrast
 * - Gallery left + sticky booking card right
 * - Line-art SVG draws itself
 * - Custom stamp badges (DISPONIBLE / NON DISPONIBLE)
 * - Dynamic dates (never hard-coded)
 * - Similar vehicles rail below with elevated cards
 * - Lightbox modal
 * - JSON-LD Product + BreadcrumbList
 */

import { useState, useMemo, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { vehicles, categories } from "@/lib/data";
import { BRAND, ROUTES } from "@/lib/config";
import {
  Users, Fuel, Gauge, Calendar, Shield, Check,
  ChevronRight, ArrowUpRight, MessageCircle, X, Maximize2, Zap,
} from "lucide-react";

// ── Date helpers ──────────────────────────────────────────────────────────────

function pad(n: number) { return String(n).padStart(2, "0"); }

function makeDateStr(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(10, 0, 0, 0);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T10:00`;
}

function calcDays(pickup: string, ret: string): number {
  try {
    const p = new Date(pickup).getTime();
    const r = new Date(ret).getTime();
    if (r > p) return Math.max(1, Math.ceil((r - p) / (1000 * 60 * 60 * 24)));
  } catch { /* fall through */ }
  return 1;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const vehicle = vehicles.find((v) => v.slug === resolvedParams.slug);

  if (!vehicle) notFound();

  const category = categories.find((c) => c.id === vehicle.categoryId);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [pickupAt, setPickupAt] = useState(() => makeDateStr(1));
  const [returnAt, setReturnAt] = useState(() => makeDateStr(4));

  const rentalDays = useMemo(() => calcDays(pickupAt, returnAt), [pickupAt, returnAt]);
  const totalPrice = vehicle.pricePerDay * rentalDays;

  const similarVehicles = useMemo(() =>
    vehicles.filter((v) => v.id !== vehicle.id && v.categoryId === vehicle.categoryId).slice(0, 3),
    [vehicle.id, vehicle.categoryId]
  );

  const waText = `Bonjour, je souhaite réserver la ${vehicle.name}.\nDates : ${pickupAt.split("T")[0]} → ${returnAt.split("T")[0]}\nTotal estimé : ${totalPrice.toLocaleString("fr-DZ")} DA`;

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://izem.autos/" },
          { "@type": "ListItem", position: 2, name: "Véhicules", item: "https://izem.autos/vehicules" },
          { "@type": "ListItem", position: 3, name: vehicle.name },
        ],
      },
      {
        "@type": "Product",
        name: vehicle.name,
        image: vehicle.images[0],
        description: vehicle.description,
        offers: {
          "@type": "Offer",
          priceCurrency: "DZD",
          price: vehicle.pricePerDay,
          unitCode: "DAY",
          availability: vehicle.available
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main
        id="main"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"
      >
        {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
        <nav
          aria-label="Fil d'Ariane"
          className="flex items-center gap-1.5 mb-6 sm:mb-8 text-xs font-semibold text-gray-500 flex-wrap"
        >
          <Link
            href={ROUTES.home}
            className="hover:text-[#0B7584] transition-colors"
          >
            Accueil
          </Link>
          <ChevronRight size={13} className="text-gray-400 shrink-0" />
          <Link
            href={ROUTES.fleet}
            className="hover:text-[#0B7584] transition-colors"
          >
            Véhicules
          </Link>
          {category && (
            <>
              <ChevronRight size={13} className="text-gray-400 shrink-0" />
              <Link
                href={`${ROUTES.fleet}?category=${category.id}`}
                className="hover:text-[#0B7584] transition-colors"
              >
                {category.name}
              </Link>
            </>
          )}
          <ChevronRight size={13} className="text-gray-400 shrink-0" />
          <span className="text-[#0B7584] font-bold">
            {vehicle.name}
          </span>
        </nav>

        {/* ── Main 2-column grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left Column: Gallery + Specs ─────────────────────────────── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Image Gallery Card: Sharp defined shape with floating shadow */}
            <div
              role="button"
              tabIndex={0}
              aria-label={`Agrandir la photo de ${vehicle.name}`}
              onClick={() => setLightboxOpen(true)}
              onKeyDown={(e) => e.key === "Enter" && setLightboxOpen(true)}
              className="group relative w-full h-[300px] min-[450px]:h-[380px] sm:h-[460px] md:h-[500px] rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-[0_12px_36px_-8px_rgba(0,0,0,0.08),0_4px_12px_-2px_rgba(0,0,0,0.04)] cursor-pointer"
            >
              {/* Full-clarity photo without dark overlay */}
              <Image
                src={vehicle.images[selectedImageIndex] || vehicle.images[0]}
                alt={`${vehicle.name} — photo ${selectedImageIndex + 1}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              />

              {/* Status badge — dark green glassy, no dot */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none select-none">
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '5px 12px',
                  borderRadius: 8,
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  backdropFilter: 'blur(14px) saturate(1.5)',
                  WebkitBackdropFilter: 'blur(14px) saturate(1.5)',
                  background: vehicle.available
                    ? 'rgba(20, 83, 45, 0.85)'
                    : 'rgba(127, 29, 29, 0.80)',
                  border: vehicle.available
                    ? '1px solid rgba(74, 222, 128, 0.25)'
                    : '1px solid rgba(252, 165, 165, 0.2)',
                  color: vehicle.available
                    ? 'rgba(220, 252, 231, 0.98)'
                    : 'rgba(254, 226, 226, 0.95)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.28)',
                }}>
                  {vehicle.available ? 'Disponible' : 'Indisponible'}
                </div>
              </div>

              {/* Brand Tag Top Right */}
              <div className="absolute top-4 right-4 z-20 text-[11px] font-extrabold uppercase tracking-wider text-gray-800 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-black/[0.05]">
                {vehicle.brand}
              </div>

              {/* Expand badge */}
              <div
                aria-hidden="true"
                className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md border border-gray-200 shadow-md flex items-center justify-center text-gray-800 group-hover:text-[#0B7584] group-hover:scale-110 transition-all"
              >
                <Maximize2 size={16} />
              </div>

              {/* Viewfinder corners */}
              <div className="absolute inset-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#0B7584]" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#0B7584]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#0B7584]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#0B7584]" />
              </div>
            </div>

            {/* Thumbnail row */}
            {vehicle.images.length > 1 && (
              <div
                className="flex gap-3 overflow-x-auto pb-2 scrollbar-none"
                role="list"
                aria-label="Galerie de photos"
              >
                {vehicle.images.map((img, idx) => {
                  const isActive = selectedImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      role="listitem"
                      onClick={() => setSelectedImageIndex(idx)}
                      aria-label={`Photo ${idx + 1} de ${vehicle.name}`}
                      aria-pressed={isActive}
                      className={`relative w-24 h-16 sm:w-28 sm:h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        isActive
                          ? "border-[#0B7584] shadow-md shadow-[#0B7584]/20 scale-105"
                          : "border-gray-200 opacity-60 hover:opacity-100 bg-[#F8FAFC]"
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Vehicle Description Card: Clean white shape with subtle grey header */}
            <div className="rounded-3xl p-6 sm:p-8 bg-white border border-gray-200 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] space-y-6">
              <div>
                <h2 className="font-sora text-xl sm:text-2xl font-bold text-gray-950 tracking-tight mb-3">
                  Présentation du véhicule
                </h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                  {vehicle.description}
                </p>
              </div>

              {/* Technical Spec Cards: Sculpted inset cards */}
              {(vehicle.power || vehicle.zeroToHundred || vehicle.fuel_consumption || vehicle.bootVolume) && (
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-3">
                    Performances & Fiche Technique
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {vehicle.power && (
                      <div className="rounded-2xl p-3.5 bg-[#F8FAFC] border border-gray-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                          Puissance
                        </p>
                        <p className="font-sora text-lg sm:text-xl font-black text-gray-950 mt-1 tabular-nums">
                          {vehicle.power}
                        </p>
                      </div>
                    )}
                    {vehicle.zeroToHundred && (
                      <div className="rounded-2xl p-3.5 bg-[#F8FAFC] border border-gray-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                          0 à 100 km/h
                        </p>
                        <p className="font-sora text-lg sm:text-xl font-black text-gray-950 mt-1 tabular-nums">
                          {vehicle.zeroToHundred}
                        </p>
                      </div>
                    )}
                    {vehicle.fuel_consumption && (
                      <div className="rounded-2xl p-3.5 bg-[#F8FAFC] border border-gray-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                          Consommation
                        </p>
                        <p className="font-sora text-lg sm:text-xl font-black text-gray-950 mt-1 tabular-nums">
                          {vehicle.fuel_consumption}
                        </p>
                      </div>
                    )}
                    {vehicle.bootVolume && (
                      <div className="rounded-2xl p-3.5 bg-[#F8FAFC] border border-gray-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                          Coffre
                        </p>
                        <p className="font-sora text-lg sm:text-xl font-black text-gray-950 mt-1 tabular-nums">
                          {vehicle.bootVolume}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Features checklist */}
              {vehicle.features.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-3">
                    Équipements inclus
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {vehicle.features.map((feat, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-gray-800 p-2.5 rounded-xl bg-[#F8FAFC] border border-gray-200/60"
                      >
                        <div className="w-5 h-5 rounded-full bg-cyan-50 text-[#0B7584] flex items-center justify-center shrink-0 border border-cyan-200/60">
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right Column: Sticky Booking Card ────────────────────────── */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="relative rounded-3xl p-6 sm:p-7 bg-white border border-gray-200 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.09),0_4px_16px_-4px_rgba(0,0,0,0.04)] space-y-5 overflow-hidden">
              {/* Luxury Top Orange Hairline */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#0B7584] to-transparent" />

              {/* Header: Brand & Name & Vehicle Line-Art */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#0B7584]">
                    {vehicle.brand}
                  </span>
                  <span className="text-xs font-bold text-gray-400 capitalize">
                    {category?.name || "Véhicule"}
                  </span>
                </div>

                <h1 className="font-sora text-2xl sm:text-3xl font-black text-gray-950 tracking-tight leading-tight mb-3">
                  {vehicle.name}
                </h1>

                {/* Specs Inset Badges */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#F8FAFC] border border-gray-200 text-xs font-bold text-gray-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                    <Users size={13} className="text-[#0B7584]" />
                    <span>{vehicle.specs.seats} places</span>
                  </div>
                  <div className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#F8FAFC] border border-gray-200 text-xs font-bold text-gray-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                    <Gauge size={13} className="text-[#0B7584]" />
                    <span>{vehicle.specs.gearbox}</span>
                  </div>
                  <div className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#F8FAFC] border border-gray-200 text-xs font-bold text-gray-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                    <Fuel size={13} className="text-[#0B7584]" />
                    <span>{vehicle.specs.fuel}</span>
                  </div>
                </div>
              </div>

              {/* Price Block: Sculpted container */}
              <div className="rounded-2xl p-4 sm:p-5 bg-[#F8FAFC] border border-gray-200/90 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      Tarif journalier
                    </p>
                    <div className="font-sora text-3xl font-black text-gray-950 tracking-tight mt-0.5">
                      {vehicle.pricePerDay.toLocaleString("fr-DZ")}{" "}
                      <span className="text-xs font-bold text-[#0B7584]">
                        DA / jour
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200/80 text-xs">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Tarif semaine
                    </p>
                    <p className="font-sora font-extrabold text-gray-900 mt-0.5">
                      {vehicle.pricePerWeek ? `${vehicle.pricePerWeek.toLocaleString("fr-DZ")} DA` : "Sur demande"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Tarif mensuel
                    </p>
                    <p className="font-sora font-extrabold text-gray-900 mt-0.5">
                      {vehicle.pricePerMonth ? `${vehicle.pricePerMonth.toLocaleString("fr-DZ")} DA` : "Sur demande"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Category conditions */}
              {category && (
                <div className="rounded-2xl p-3.5 sm:p-4 bg-cyan-50/70 border border-cyan-200/80 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#0B7584]">
                    <Shield size={14} className="shrink-0" />
                    <span>Conditions · {category.name}</span>
                  </div>
                  <ul className="space-y-1 text-gray-700 font-medium text-[11px] sm:text-xs">
                    <li className="flex justify-between">
                      <span className="text-gray-500">Âge minimal</span>
                      <strong className="text-gray-900">{category.minAge} ans</strong>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">Permis requis</span>
                      <strong className="text-gray-900">{category.licenceYears} an{category.licenceYears > 1 ? "s" : ""}</strong>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">Caution restituée</span>
                      <strong className="text-gray-900">{category.deposit.toLocaleString("fr-DZ")} DA</strong>
                    </li>
                  </ul>
                </div>
              )}

              {/* Date Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl p-2.5 bg-[#F8FAFC] border border-gray-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                  <label
                    htmlFor="pickup-date"
                    className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1"
                  >
                    <Calendar size={12} className="text-[#0B7584]" /> Départ
                  </label>
                  <input
                    id="pickup-date"
                    type="datetime-local"
                    value={pickupAt}
                    onChange={(e) => setPickupAt(e.target.value)}
                    style={{ colorScheme: "light" }}
                    className="w-full bg-transparent text-xs font-semibold text-gray-900 focus:outline-none cursor-pointer"
                  />
                </div>

                <div className="rounded-xl p-2.5 bg-[#F8FAFC] border border-gray-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                  <label
                    htmlFor="return-date"
                    className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1"
                  >
                    <Calendar size={12} className="text-[#0B7584]" /> Retour
                  </label>
                  <input
                    id="return-date"
                    type="datetime-local"
                    value={returnAt}
                    onChange={(e) => setReturnAt(e.target.value)}
                    style={{ colorScheme: "light" }}
                    className="w-full bg-transparent text-xs font-semibold text-gray-900 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Estimated Total */}
              <div className="flex justify-between items-center p-3.5 sm:p-4 rounded-xl bg-[#F1F5F9] border border-gray-200/90 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
                    Total estimé
                  </p>
                  <p className="text-xs font-extrabold text-[#0B7584] mt-0.5">
                    {rentalDays}&nbsp;jour{rentalDays > 1 ? "s" : ""}
                  </p>
                </div>
                <p className="font-sora text-xl sm:text-2xl font-black text-gray-950 tabular-nums">
                  {totalPrice.toLocaleString("fr-DZ")}&nbsp;DA
                </p>
              </div>

              {/* CTAs */}
              <div className="space-y-2.5 pt-2">
                <Link
                  href={ROUTES.reserve(vehicle.id, pickupAt, returnAt)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-sora font-bold text-xs sm:text-sm bg-[#0B7584] hover:bg-[#085A66] text-white shadow-lg shadow-[#0B7584]/25 hover:shadow-xl hover:shadow-[#0B7584]/35 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  aria-label={`Réserver ${vehicle.name}`}
                >
                  <span>Réserver ce véhicule</span>
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </Link>

                <a
                  href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(waText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full font-bold text-xs sm:text-sm bg-[#F8FAFC] hover:bg-gray-100 text-gray-800 border border-gray-200 shadow-sm transition-all"
                  aria-label={`Demander ${vehicle.name} sur WhatsApp`}
                >
                  <MessageCircle size={16} className="text-emerald-600" />
                  <span>Demander sur WhatsApp</span>
                </a>

                <p className="text-[11px] text-gray-500 text-center font-medium pt-1">
                  Livraison gratuite à l&apos;Aéroport Houari Boumediene d&apos;Alger. Sans paiement en ligne.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Similar vehicles rail ────────────────────────────────────────── */}
        {similarVehicles.length > 0 && (
          <div className="mt-14 sm:mt-20 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-sora text-xl sm:text-2xl font-bold text-gray-950">
                Véhicules similaires
              </h2>
              <Link
                href={ROUTES.fleet}
                className="text-xs sm:text-sm font-bold text-[#0B7584] hover:text-[#085A66] flex items-center gap-1 transition-colors"
              >
                <span>Toute la flotte</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarVehicles.map((sim) => (
                <Link
                  key={sim.id}
                  href={ROUTES.vehicle(sim.slug)}
                  aria-label={`Voir ${sim.name} — ${sim.pricePerDay.toLocaleString("fr-DZ")} DA/j`}
                  className="group block rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06),0_2px_6px_-2px_rgba(0,0,0,0.03)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12)] hover:border-[#0B7584]/40 transition-all duration-300"
                >
                  <div className="relative h-44 sm:h-48 w-full bg-[#F8FAFC] overflow-hidden">
                    <Image
                      src={sim.images[0]}
                      alt={sim.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    {/* Status badge — dark green glassy, no dot */}
                    <div className="absolute top-3 left-3 z-10 pointer-events-none select-none">
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 9px',
                        borderRadius: 7,
                        fontSize: 9.5,
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        backdropFilter: 'blur(10px) saturate(1.5)',
                        WebkitBackdropFilter: 'blur(10px) saturate(1.5)',
                        background: sim.available
                          ? 'rgba(20, 83, 45, 0.85)'
                          : 'rgba(127, 29, 29, 0.80)',
                        border: sim.available
                          ? '1px solid rgba(74, 222, 128, 0.25)'
                          : '1px solid rgba(252, 165, 165, 0.2)',
                        color: sim.available
                          ? 'rgba(220, 252, 231, 0.98)'
                          : 'rgba(254, 226, 226, 0.95)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                      }}>
                        {sim.available ? 'Disponible' : 'Indisponible'}
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 z-10 text-[10px] font-extrabold uppercase tracking-wider text-gray-700 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm border border-black/[0.05]">
                      {sim.brand}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex justify-between items-center">
                    <div>
                      <h3 className="font-sora text-base font-bold text-gray-950 group-hover:text-[#0B7584] transition-colors">
                        {sim.name}
                      </h3>
                      <p className="text-[11px] font-semibold text-gray-400 capitalize">
                        {category?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-sora text-lg font-black text-gray-950 tabular-nums">
                        {sim.pricePerDay.toLocaleString("fr-DZ")}{" "}
                        <span className="text-[10px] font-bold text-[#0B7584]">DA/j</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── Lightbox Modal ──────────────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photos de ${vehicle.name}`}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Fermer"
            className="absolute top-6 right-6 z-60 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={20} />
          </button>

          <div className="relative w-full max-w-5xl h-[75vh]">
            <Image
              src={vehicle.images[selectedImageIndex] || vehicle.images[0]}
              alt={`${vehicle.name} — photo ${selectedImageIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {/* Lightbox thumbnails */}
          {vehicle.images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {vehicle.images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  aria-label={`Photo ${idx + 1}`}
                  aria-current={selectedImageIndex === idx}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? "w-7 bg-[#0B7584]"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

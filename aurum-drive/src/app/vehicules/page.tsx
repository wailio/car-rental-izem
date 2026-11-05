"use client";

import React, { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { vehicles, categories, Vehicle } from "@/lib/data";
import { buildWhatsAppLink } from "@/content/site-facts";
import { ROUTES } from "@/lib/config";
import { VehicleModal } from "@/components/ui/VehicleModal";
import {
  Calendar,
  MapPin,
  Filter,
  Users,
  Fuel,
  Gauge,
  ArrowUpRight,
  RotateCcw,
  CheckCircle2,
  X,
  MessageCircle,
  ChevronDown,
  Sparkles,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeDynamicDefault(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(10, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T10:00`;
}

// ─── Fleet Content ────────────────────────────────────────────────────────────

function FleetContent() {
  const searchParams = useSearchParams();

  // Dynamic defaults: tomorrow 10:00 → +3 days 10:00
  const defaultPickup = useMemo(() => makeDynamicDefault(1), []);
  const defaultReturn = useMemo(() => makeDynamicDefault(4), []);

  const initialCategory = searchParams.get("category") || "all";
  const initialPickup   = searchParams.get("pickup_at") || defaultPickup;
  const initialReturn   = searchParams.get("return_at") || defaultReturn;
  const initialLocation = searchParams.get("location") || "Aéroport d'Alger Houari Boumediene";

  // ── Filter state ──────────────────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand,    setSelectedBrand]    = useState<string>("all");
  const [selectedGearbox,  setSelectedGearbox]  = useState<string>("all");
  const [priceMax,         setPriceMax]         = useState<number>(40000);
  const [onlyAvailable,    setOnlyAvailable]    = useState<boolean>(false);
  const [pickupAt,         setPickupAt]         = useState<string>(initialPickup);
  const [returnAt,         setReturnAt]         = useState<string>(initialReturn);
  const [location,         setLocation]         = useState<string>(initialLocation);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [selectedCarId,    setSelectedCarId]    = useState<number | null>(null);
  const [selectedVehicle,  setSelectedVehicle]  = useState<Vehicle | null>(null);

  // ── Rental duration ───────────────────────────────────────────────────────
  const rentalDays = useMemo(() => {
    try {
      const p = new Date(pickupAt).getTime();
      const r = new Date(returnAt).getTime();
      if (r > p) {
        return Math.max(1, Math.ceil((r - p) / (1000 * 60 * 60 * 24)));
      }
      return 1;
    } catch {
      return 1;
    }
  }, [pickupAt, returnAt]);

  // ── Available brands ──────────────────────────────────────────────────────
  const availableBrands = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.brand))),
    []
  );

  // ── Active filters count ──────────────────────────────────────────────────
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (selectedBrand !== "all") count++;
    if (selectedGearbox !== "all") count++;
    if (priceMax < 40000) count++;
    if (onlyAvailable) count++;
    return count;
  }, [selectedCategory, selectedBrand, selectedGearbox, priceMax, onlyAvailable]);

  // ── Filtered results ──────────────────────────────────────────────────────
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (selectedCategory !== "all" && v.categoryId !== selectedCategory) return false;
      if (selectedBrand    !== "all" && v.brand !== selectedBrand)         return false;
      if (selectedGearbox  !== "all" && v.specs.gearbox !== selectedGearbox) return false;
      if (v.pricePerDay > priceMax)                                         return false;
      if (onlyAvailable && !v.available)                                    return false;
      return true;
    });
  }, [selectedCategory, selectedBrand, selectedGearbox, priceMax, onlyAvailable]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setSelectedGearbox("all");
    setPriceMax(40000);
    setOnlyAvailable(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main
        id="main"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-16"
      >
        {/* ── Compact Luxury Page Header (Brings fleet content up into view) ── */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#0B7584]/10 text-[#0B7584] border border-[#0B7584]/25">
                <Sparkles className="w-3 h-3 text-[#0B7584]" />
                Catalogue officiel
              </span>
              <span className="text-xs text-slate-500 font-medium">· Alger & Aéroport</span>
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl sm:text-4xl tracking-tight text-slate-900 font-bold" style={{ fontFamily: "var(--font-heading, inherit)" }}>
                <span className="font-light text-slate-600">Notre </span>
                <span className="font-black text-slate-950">Flotte</span>
              </h1>
              <span className="text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-2xs">
                {filteredVehicles.length}&nbsp;véhicule{filteredVehicles.length > 1 ? "s" : ""}
              </span>
            </div>

            <p className="text-xs sm:text-[13px] text-slate-600 max-w-xl mt-1 leading-normal font-normal">
              Véhicules récents, bien entretenus. Tarifs nets, assistance 24/7 et remise sans attente à l&apos;arrivée.
            </p>
          </div>

          {/* Quick contact / mobile filter trigger */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white shadow-sm hover:bg-slate-800 transition-colors"
              aria-label="Ouvrir les filtres"
            >
              <Filter className="w-3.5 h-3.5 text-[#0B7584]" />
              <span>Filtres</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#0B7584] text-white text-[10px] font-extrabold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <a
              href={buildWhatsAppLink({ text: "Bonjour, je souhaite louer un véhicule à Alger." })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-200 transition-colors shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">WhatsApp conseiller</span>
            </a>
          </div>
        </div>

        {/* ── Refined Search & Handover Ribbon (Compact, non-invasive) ── */}
        <div className="mb-6 rounded-2xl p-2.5 sm:p-3 bg-white border border-slate-200 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-center">
            {/* Location */}
            <div className="lg:col-span-4 flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 transition-colors">
              <MapPin className="w-4 h-4 shrink-0 text-[#0B7584]" />
              <div className="w-full min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider leading-none mb-0.5">
                  Lieu de prise
                </span>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent w-full focus:outline-none text-xs font-bold text-slate-900 cursor-pointer truncate"
                  style={{ colorScheme: "light" }}
                  aria-label="Lieu de prise en charge"
                >
                  <option value="Aéroport d'Alger Houari Boumediene">
                    Aéroport d&apos;Alger Houari Boumediene
                  </option>
                  <option value="Alger Centre — Agence Principale">
                    Alger Centre — Agence Principale
                  </option>
                  <option value="Livraison Hôtel / Résidence">
                    Livraison Hôtel / Résidence
                  </option>
                </select>
              </div>
            </div>

            {/* Pickup date */}
            <div className="lg:col-span-3 flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 transition-colors">
              <Calendar className="w-4 h-4 shrink-0 text-[#0B7584]" />
              <div className="w-full min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider leading-none mb-0.5">
                  Départ
                </span>
                <input
                  type="datetime-local"
                  value={pickupAt}
                  onChange={(e) => setPickupAt(e.target.value)}
                  className="bg-transparent w-full focus:outline-none text-xs font-bold text-slate-900 cursor-pointer"
                  style={{ colorScheme: "light" }}
                  aria-label="Date et heure de départ"
                />
              </div>
            </div>

            {/* Return date */}
            <div className="lg:col-span-3 flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 transition-colors">
              <Calendar className="w-4 h-4 shrink-0 text-[#0B7584]" />
              <div className="w-full min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider leading-none mb-0.5">
                  Retour
                </span>
                <input
                  type="datetime-local"
                  value={returnAt}
                  onChange={(e) => setReturnAt(e.target.value)}
                  className="bg-transparent w-full focus:outline-none text-xs font-bold text-slate-900 cursor-pointer"
                  style={{ colorScheme: "light" }}
                  aria-label="Date et heure de retour"
                />
              </div>
            </div>

            {/* Duration pill */}
            <div className="lg:col-span-2 flex items-center justify-between sm:justify-end gap-2">
              <div className="w-full sm:w-auto rounded-xl px-3.5 py-2.5 text-center text-xs font-extrabold tabular-nums bg-[#0B7584]/10 border border-[#0B7584]/25 text-[#0B7584]">
                {rentalDays}&nbsp;jour{rentalDays > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Layout: Scrollable Sticky Sidebar + Content ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Desktop Filter Sidebar (Independently scrollable, sticky top-24, zero cutoff) */}
          <aside
            className="hidden lg:flex lg:flex-col lg:col-span-3 rounded-2xl p-4 sm:p-5 space-y-5 sticky top-24 bg-white border border-slate-200/90 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.04)] max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#CBD5E1 transparent",
            }}
            aria-label="Filtres de la flotte"
          >
            {/* Sidebar header with active indicator and reset */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 tracking-tight" style={{ fontFamily: "var(--font-heading, inherit)" }}>
                  Filtres
                </span>
                {activeFiltersCount > 0 && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#0B7584]/10 text-[#0B7584] border border-[#0B7584]/25">
                    {activeFiltersCount} actif{activeFiltersCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[11px] font-bold flex items-center gap-1 text-slate-500 hover:text-[#0B7584] transition-colors cursor-pointer"
                  aria-label="Réinitialiser tous les filtres"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Effacer</span>
                </button>
              )}
            </div>

            {/* Availability Toggle: Apple iOS style switch card */}
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
              <label className="flex items-center justify-between cursor-pointer select-none">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full transition-colors ${
                      onlyAvailable ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-slate-300"
                    }`}
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-900">
                      Disponibles de suite
                    </span>
                    <span className="block text-[10px] text-slate-400 font-normal">
                      Prêts au départ aujourd&apos;hui
                    </span>
                  </div>
                </div>

                {/* Custom toggle pill */}
                <div
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                    onlyAvailable ? "bg-[#0B7584]" : "bg-slate-300"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setOnlyAvailable(!onlyAvailable);
                  }}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform duration-200 ${
                      onlyAvailable ? "left-4.5" : "left-0.5"
                    }`}
                  />
                </div>
              </label>
            </div>

            {/* Category filter: sleek vertical options */}
            <div className="space-y-2">
              <label className="text-[10.5px] uppercase tracking-wider font-bold text-slate-400 block">
                Catégorie
              </label>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCategory === "all"
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : "text-slate-700 hover:bg-[#F8FAFC] font-medium"
                  }`}
                >
                  <span>Toutes catégories</span>
                  <span className={`text-[11px] tabular-nums ${selectedCategory === "all" ? "text-slate-300" : "text-slate-400"}`}>
                    ({vehicles.length})
                  </span>
                </button>
                {categories.map((c) => {
                  const count = vehicles.filter((v) => v.categoryId === c.id).length;
                  const active = selectedCategory === c.id;
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                        active
                          ? "bg-slate-900 text-white font-bold shadow-xs"
                          : "text-slate-700 hover:bg-[#F8FAFC] font-medium"
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className={`text-[11px] tabular-nums ${active ? "text-slate-300" : "text-slate-400"}`}>
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gearbox filter: Apple segmented control */}
            <div className="space-y-2">
              <label className="text-[10.5px] uppercase tracking-wider font-bold text-slate-400 block">
                Boîte de vitesses
              </label>
              <div className="flex p-0.5 rounded-xl bg-[#F8FAFC] border border-slate-200">
                {(
                  [
                    { value: "all", label: "Toutes" },
                    { value: "Automatique", label: "Auto" },
                  ] as const
                ).map(({ value, label }) => {
                  const active = selectedGearbox === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelectedGearbox(value)}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        active
                          ? "bg-white text-slate-950 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price range */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline text-xs">
                <label
                  className="text-[10.5px] uppercase tracking-wider font-bold text-slate-400"
                  htmlFor="price-range"
                >
                  Budget journalier max
                </label>
                <span className="font-extrabold tabular-nums text-xs text-[#0B7584]">
                  {priceMax.toLocaleString("fr-DZ")}&nbsp;DA/j
                </span>
              </div>
              <input
                id="price-range"
                type="range"
                min="4000"
                max="40000"
                step="1000"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full cursor-pointer accent-[#0B7584]"
                aria-label={`Budget maximum : ${priceMax.toLocaleString("fr-DZ")} DA`}
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>4 000 DA</span>
                <span>40 000 DA</span>
              </div>
            </div>

            {/* Brand filter: Sleek select dropdown */}
            <div className="space-y-2">
              <label
                className="text-[10.5px] uppercase tracking-wider font-bold text-slate-400 block"
                htmlFor="brand-select"
              >
                Marque du constructeur
              </label>
              <div className="relative">
                <select
                  id="brand-select"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full appearance-none rounded-xl py-2 px-3 pr-8 text-xs bg-[#F8FAFC] border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-slate-900 transition-colors cursor-pointer"
                >
                  <option value="all">Toutes les marques ({vehicles.length})</option>
                  {availableBrands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </aside>

          {/* ── Results Column ─────────────────────────────────────────────── */}
          <div className="lg:col-span-9 space-y-4">
            {/* Quick Category Strip: horizontal interactive chips (Airbnb / Turo style) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 overscroll-contain no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-[#0B7584] text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                }`}
              >
                Tous ({vehicles.length})
              </button>
              {categories.map((c) => {
                const count = vehicles.filter((v) => v.categoryId === c.id).length;
                const active = selectedCategory === c.id;
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? "bg-[#0B7584] text-white shadow-xs"
                        : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className={`ml-1 text-[11px] tabular-nums ${active ? "text-white/80" : "text-slate-400"}`}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active filters removable tags (if any non-category filter applied) */}
            {(selectedBrand !== "all" || selectedGearbox !== "all" || priceMax < 40000 || onlyAvailable) && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 font-semibold mr-1">Filtres actifs :</span>
                {selectedBrand !== "all" && (
                  <button
                    type="button"
                    onClick={() => setSelectedBrand("all")}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
                  >
                    <span>{selectedBrand}</span>
                    <X className="w-3 h-3 text-slate-400" />
                  </button>
                )}
                {selectedGearbox !== "all" && (
                  <button
                    type="button"
                    onClick={() => setSelectedGearbox("all")}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
                  >
                    <span>Boîte {selectedGearbox}</span>
                    <X className="w-3 h-3 text-slate-400" />
                  </button>
                )}
                {priceMax < 40000 && (
                  <button
                    type="button"
                    onClick={() => setPriceMax(40000)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
                  >
                    <span>Max {priceMax.toLocaleString("fr-DZ")} DA</span>
                    <X className="w-3 h-3 text-slate-400" />
                  </button>
                )}
                {onlyAvailable && (
                  <button
                    type="button"
                    onClick={() => setOnlyAvailable(false)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800"
                  >
                    <span>Disponibles uniquement</span>
                    <X className="w-3 h-3 text-emerald-600" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-[#0B7584] font-bold hover:underline ml-1"
                >
                  Tout effacer
                </button>
              </div>
            )}

            {filteredVehicles.length === 0 ? (
              /* Empty state */
              <div className="rounded-3xl p-12 text-center space-y-4 bg-white border border-slate-200 shadow-xs">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto bg-[#0B7584]/10 text-[#0B7584] border border-[#0B7584]/20">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-heading, inherit)" }}>
                  Aucun véhicule disponible pour ces critères
                </h3>
                <p className="text-xs sm:text-sm max-w-md mx-auto text-slate-500 font-normal">
                  Élargissez vos filtres de budget ou écrivez directement à notre équipe sur WhatsApp pour une solution immédiate.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#0B7584] hover:bg-[#085A66] text-white shadow-xs transition-colors cursor-pointer"
                  >
                    Réinitialiser les filtres
                  </button>
                  <a
                    href={buildWhatsAppLink({ text: "Bonjour, je cherche un véhicule disponible à Alger." })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 text-slate-800 hover:bg-slate-100 transition-colors shadow-2xs"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp direct</span>
                  </a>
                </div>
              </div>
            ) : (
              /* Vehicle cards grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredVehicles.map((vehicle: Vehicle, i: number) => {
                  const totalEstimated = vehicle.pricePerDay * rentalDays;
                  const isSelected = selectedCarId === vehicle.id;

                  return (
                    <div
                      key={vehicle.id}
                      data-reveal="fade-up"
                      data-reveal-delay={i * 50}
                      onClick={() => {
                        setSelectedCarId(isSelected ? null : vehicle.id);
                        setSelectedVehicle(vehicle);
                      }}
                      className={`relative group flex flex-col justify-between rounded-2xl overflow-hidden bg-white border cursor-pointer select-none transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.10)] active:scale-[0.99] ${
                        isSelected
                          ? "border-[#0B7584] ring-2 ring-[#0B7584] shadow-[0_12px_28px_-6px_rgba(11, 117, 132,0.20)]"
                          : "border-slate-200 hover:border-slate-300 shadow-2xs"
                      }`}
                    >
                      {/* Image Area */}
                      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-100">
                        <Image
                          src={vehicle.images[0]}
                          alt={vehicle.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                        />

                        {/* Status badge */}
                        <div className="absolute top-3 left-3 z-10 pointer-events-none select-none">
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '3.5px 9px',
                            borderRadius: 8,
                            fontSize: 10,
                            fontWeight: 700,
                            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase' as const,
                            backdropFilter: 'blur(14px) saturate(1.5)',
                            WebkitBackdropFilter: 'blur(14px) saturate(1.5)',
                            background: vehicle.available
                              ? 'rgba(20, 83, 45, 0.80)'
                              : 'rgba(127, 29, 29, 0.75)',
                            border: vehicle.available
                              ? '1px solid rgba(74,222,128,0.25)'
                              : '1px solid rgba(252,165,165,0.20)',
                            color: vehicle.available ? 'rgba(220,252,231,0.96)' : 'rgba(254,226,226,0.92)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                          }}>
                            {vehicle.available ? 'Disponible' : 'Indisponible'}
                          </div>
                        </div>

                        {/* Brand badge */}
                        <div className="absolute top-3 right-3 z-10 text-[10px] font-extrabold uppercase tracking-wider text-slate-700 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-2xs border border-slate-200/80">
                          {vehicle.brand}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                        <div className="space-y-2.5">
                          {/* Title with thin brand + bold model split */}
                          <h3 className="text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-[#0B7584] transition-colors" style={{ fontFamily: "var(--font-heading, inherit)" }}>
                            <span className="font-light text-slate-600">{vehicle.brand}&nbsp;</span>
                            <span className="font-extrabold text-slate-950">
                              {vehicle.name.replace(vehicle.brand, "").trim()}
                            </span>
                          </h3>

                          {/* Inset Specs Chips */}
                          <div className="grid grid-cols-3 gap-1.5 py-0.5 text-xs text-slate-700 font-semibold">
                            <div className="flex items-center justify-center gap-1.5 py-1.5 px-1 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
                              <Users size={12} className="text-[#0B7584] shrink-0" />
                              <span className="truncate text-[11px]">{vehicle.specs.seats}&nbsp;places</span>
                            </div>
                            <div className="flex items-center justify-center gap-1.5 py-1.5 px-1 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
                              <Gauge size={12} className="text-[#0B7584] shrink-0" />
                              <span className="truncate text-[11px]">{vehicle.specs.gearbox}</span>
                            </div>
                            <div className="flex items-center justify-center gap-1.5 py-1.5 px-1 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
                              <Fuel size={12} className="text-[#0B7584] shrink-0" />
                              <span className="truncate text-[11px]">{vehicle.specs.fuel}</span>
                            </div>
                          </div>

                          {/* Feature chips */}
                          <div className="flex flex-wrap gap-1.5">
                            {vehicle.features.slice(0, 2).map((feat, fi) => (
                              <span
                                key={fi}
                                className="text-[10.5px] px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-600 font-medium flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3 h-3 text-[#0B7584]" />
                                {feat}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Price & Action Row */}
                        <div className="pt-3 border-t border-slate-100 flex items-end justify-between gap-3">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                              Tarif journalier
                            </div>
                            <div className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight" style={{ fontFamily: "var(--font-heading, inherit)" }}>
                              {vehicle.pricePerDay.toLocaleString("fr-DZ")}{" "}
                              <span className="text-xs font-bold text-[#0B7584]">
                                DA/j
                              </span>
                            </div>
                            {rentalDays > 1 && (
                              <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                Total ({rentalDays}&nbsp;j) :{" "}
                                <span className="text-slate-900 font-bold">
                                  {totalEstimated.toLocaleString("fr-DZ")} DA
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              href={ROUTES.vehicle(vehicle.slug)}
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 rounded-full bg-[#F8FAFC] hover:bg-[#0B7584] text-slate-700 hover:text-white border border-slate-200 transition-colors shadow-2xs"
                              aria-label={`Détails ${vehicle.name}`}
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </Link>

                            <Link
                              href={ROUTES.reserve(vehicle.id, pickupAt, returnAt)}
                              onClick={(e) => e.stopPropagation()}
                              className="bg-[#0B7584] hover:bg-[#085A66] text-white font-bold text-xs px-4.5 py-2 rounded-full shadow-xs hover:shadow-sm transition-all active:scale-95 shrink-0"
                            >
                              Réserver
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Vehicle Quick-View Modal */}
      <VehicleModal
        vehicle={selectedVehicle}
        onClose={() => {
          setSelectedVehicle(null);
          setSelectedCarId(null);
        }}
      />

      {/* ── Mobile Filters Drawer ─────────────────────────────────────────────── */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end lg:hidden bg-slate-950/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Filtres de la flotte"
        >
          <div className="w-full max-w-sm h-full p-5 overflow-y-auto space-y-5 bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between">
            <div className="space-y-5">
              {/* Drawer header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-heading, inherit)" }}>
                    Filtres
                  </span>
                  {activeFiltersCount > 0 && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#0B7584]/10 text-[#0B7584] border border-[#0B7584]/25">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  aria-label="Fermer les filtres"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Availability Switch */}
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200">
                <label className="flex items-center justify-between cursor-pointer select-none">
                  <div>
                    <span className="block text-xs font-bold text-slate-900">
                      Disponibles de suite
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      Prêts pour départ immédiat
                    </span>
                  </div>
                  <div
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      onlyAvailable ? "bg-[#0B7584]" : "bg-slate-300"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setOnlyAvailable(!onlyAvailable);
                    }}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform duration-200 ${
                        onlyAvailable ? "left-4.5" : "left-0.5"
                      }`}
                    />
                  </div>
                </label>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-[10.5px] uppercase font-bold text-slate-400 block">
                  Catégorie
                </label>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left text-xs p-2 rounded-xl transition-all flex items-center justify-between ${
                      selectedCategory === "all"
                        ? "bg-slate-900 text-white font-bold"
                        : "text-slate-700 hover:bg-[#F8FAFC] font-medium"
                    }`}
                  >
                    <span>Toutes</span>
                    <span className="text-[11px] opacity-70">({vehicles.length})</span>
                  </button>
                  {categories.map((c) => {
                    const count = vehicles.filter((v) => v.categoryId === c.id).length;
                    const active = selectedCategory === c.id;
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setSelectedCategory(c.id)}
                        className={`w-full text-left text-xs p-2 rounded-xl transition-all flex items-center justify-between ${
                          active
                            ? "bg-slate-900 text-white font-bold"
                            : "text-slate-700 hover:bg-[#F8FAFC] font-medium"
                        }`}
                      >
                        <span>{c.name}</span>
                        <span className="text-[11px] opacity-70">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gearbox */}
              <div className="space-y-2">
                <label className="text-[10.5px] uppercase font-bold text-slate-400 block">
                  Boîte de vitesses
                </label>
                <div className="flex p-0.5 rounded-xl bg-[#F8FAFC] border border-slate-200">
                  {(
                    [
                      { value: "all", label: "Toutes" },
                      { value: "Automatique", label: "Auto" },
                    ] as const
                  ).map(({ value, label }) => {
                    const active = selectedGearbox === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSelectedGearbox(value)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                          active
                            ? "bg-white text-slate-950 shadow-xs"
                            : "text-slate-600"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="uppercase tracking-wider font-bold text-[10.5px] text-slate-400">
                    Budget max
                  </span>
                  <span className="font-extrabold tabular-nums text-xs text-[#0B7584]">
                    {priceMax.toLocaleString("fr-DZ")}&nbsp;DA/j
                  </span>
                </div>
                <input
                  type="range"
                  min="4000"
                  max="40000"
                  step="1000"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full cursor-pointer accent-[#0B7584]"
                  aria-label={`Budget maximum : ${priceMax.toLocaleString("fr-DZ")} DA`}
                />
              </div>

              {/* Brand filter */}
              <div className="space-y-2">
                <label className="text-[10.5px] uppercase font-bold text-slate-400 block">
                  Marque
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full rounded-xl py-2 px-3 text-xs bg-[#F8FAFC] border border-slate-200 text-slate-900 font-bold focus:outline-none"
                >
                  <option value="all">Toutes les marques</option>
                  {availableBrands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bottom drawer buttons */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-2.5 rounded-full text-xs font-bold bg-[#0B7584] hover:bg-[#085A66] text-white shadow-xs transition-colors cursor-pointer"
              >
                Afficher ({filteredVehicles.length}) véhicules
              </button>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page Shell ───────────────────────────────────────────────────────────────

export default function FleetPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-pulse bg-[#F8FAFC]">
          <div className="h-6 w-36 rounded-full bg-slate-200" />
          <div className="h-10 w-72 rounded-xl bg-slate-200" />
          <div className="h-20 w-full rounded-2xl bg-slate-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-white border border-slate-200"
              />
            ))}
          </div>
        </div>
      }
    >
      <FleetContent />
    </Suspense>
  );
}

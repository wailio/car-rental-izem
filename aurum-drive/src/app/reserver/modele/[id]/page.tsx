"use client";

/**
 * Reservation workflow page — Phase 5 / `/reserver/modele/[id]`
 *
 * Spec:
 * - 2-Column Responsive Layout:
 *   - Left: Vehicle Summary card + Dates/Location card + Category conditions (sticky on desktop)
 *   - Right: Stepper + Interactive 3-step reservation form (all visible without scrolling)
 * - Custom stamp badges (DISPONIBLE / NON DISPONIBLE)
 * - URL search params (pickup_at, return_at) prefill dates
 * - Session storage handover to /reserver/confirmation/[ref]
 * - Zero hardcoded dates or banned words
 */

import { useState, useMemo, useEffect, Suspense, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { vehicles, categories, agencies } from "@/lib/data";
import { BRAND, ROUTES } from "@/lib/config";
import {
  Calendar, MapPin, ArrowRight, ArrowLeft,
  CheckCircle2, AlertTriangle, Shield, Car, Send, MessageCircle
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function fullYears(from: string, to: Date): number {
  if (!from) return 0;
  const f = new Date(from);
  let years = to.getFullYear() - f.getFullYear();
  const m = to.getMonth() - f.getMonth();
  if (m < 0 || (m === 0 && to.getDate() < f.getDate())) years--;
  return Math.max(0, years);
}

// ── Stepper ───────────────────────────────────────────────────────────────────

const STEPS = [
  { n: 1, label: "Vos coordonnées" },
  { n: 2, label: "Votre permis" },
  { n: 3, label: "Départ et envoi" },
];

function Stepper({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div
      className="grid grid-cols-3 gap-1.5 sm:gap-3 rounded-2xl p-2.5 sm:p-4 bg-white border border-gray-200 shadow-[0_6px_20px_-6px_rgba(0,0,0,0.05)]"
      role="list"
      aria-label="Étapes de la réservation"
    >
      {STEPS.map(({ n, label }) => {
        const done = current > n;
        const active = current === n;
        return (
          <div key={n} role="listitem" className="flex flex-col gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div
                aria-current={active ? "step" : undefined}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0 transition-all ${
                  done
                    ? "bg-emerald-600 text-white shadow-sm"
                    : active
                    ? "bg-[#0B7584] text-white shadow-md shadow-[#0B7584]/25"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {done ? "✓" : n}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-bold truncate transition-colors ${
                  active ? "text-[#0B7584]" : done ? "text-emerald-700" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
            {/* Progress bar segment */}
            <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  done ? "w-full bg-emerald-600" : active ? "w-full bg-[#0B7584]" : "w-0"
                }`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main content ──────────────────────────────────────────────────────────────

function ReserveContent({ modelId }: { modelId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const vehicleId = parseInt(modelId, 10);
  const vehicle = vehicles.find((v) => v.id === vehicleId) || vehicles[0];
  const category = categories.find((c) => c.id === vehicle.categoryId) || categories[0];

  const pickupAt = searchParams.get("pickup_at") || makeDateStr(1);
  const returnAt = searchParams.get("return_at") || makeDateStr(4);

  const rentalDays = useMemo(() => calcDays(pickupAt, returnAt), [pickupAt, returnAt]);
  const totalEstimated = vehicle.pricePerDay * rentalDays;

  // Step state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Ensure user lands at top of reservation page cleanly
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Form state — Step 1
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Form state — Step 2
  const [licenseDate, setLicenseDate] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  // Form state — Step 3
  const [agencyId, setAgencyId] = useState(agencies[0]?.id ?? "");
  const [clientNote, setClientNote] = useState("");
  const [confirmTerms, setConfirmTerms] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live eligibility
  const pickupDate = useMemo(() => new Date(pickupAt), [pickupAt]);
  const eligibility = useMemo(() => {
    if (!birthDate || !licenseDate) return { eligible: true, age: 0, seniority: 0, reason: "" };
    const age = fullYears(birthDate, pickupDate);
    const seniority = fullYears(licenseDate, pickupDate);
    if (age < category.minAge) {
      return { eligible: false, age, seniority, reason: `L'âge minimum requis pour cette catégorie est de ${category.minAge} ans (vous aurez ${age} ans le jour du départ).` };
    }
    if (seniority < category.licenceYears) {
      return { eligible: false, age, seniority, reason: `L'ancienneté de permis minimale requise est de ${category.licenceYears} an(s) (vous aurez ${seniority} an(s) le jour du départ).` };
    }
    return { eligible: true, age, seniority, reason: "" };
  }, [birthDate, licenseDate, pickupDate, category]);

  // Eligible categories for suggestions
  const eligibleCategories = useMemo(() =>
    categories.filter((c) => {
      if (!birthDate || !licenseDate) return false;
      const age = fullYears(birthDate, pickupDate);
      const seniority = fullYears(licenseDate, pickupDate);
      return c.id !== category.id && age >= c.minAge && seniority >= c.licenceYears;
    }).slice(0, 2),
    [birthDate, licenseDate, pickupDate, category]
  );

  // Handlers
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (!fullName.trim() || !phone.trim() || !email.trim()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!eligibility.eligible) return;
      setCurrentStep(3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    if (!confirmTerms) return;
    setIsSubmitting(true);

    const ref = `DZR-${new Date().toISOString().slice(2, 8).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

    setTimeout(() => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(ref, JSON.stringify({
          ref, fullName, phone, email,
          vehicle: vehicle.name, vehicleImage: vehicle.images[0],
          category: category.name,
          pickupAt, returnAt, rentalDays, totalEstimated,
          deposit: category.deposit,
          agency: agencies.find((a) => a.id === agencyId)?.name,
        }));
      }
      router.push(ROUTES.confirmation(ref));
    }, 800);
  };

  // WhatsApp text
  const waText = `Bonjour, je souhaite réserver la ${vehicle.name}.\nDates : ${pickupAt.split("T")[0]} → ${returnAt.split("T")[0]}\nTotal estimé : ${totalEstimated.toLocaleString("fr-DZ")} DA\nNom : ${fullName}`;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <main
        id="main"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"
      >
        {/* Back link */}
        <div className="mb-4">
          <Link
            href={`${ROUTES.fleet}?pickup_at=${pickupAt}&return_at=${returnAt}`}
            aria-label="Changer de véhicule ou de dates"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 hover:text-[#0B7584] transition-colors"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Changer de véhicule ou de dates
          </Link>
        </div>

        {/* Page heading */}
        <h1 className="font-sora text-2xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight mb-8">
          Demande de réservation
        </h1>

        {/* ── 2-Column Layout: Left Summary & Details / Right Form ── */}
        <div id="reservation-content" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-6">
          {/* ══════════════════════════════════════════════════════════
              LEFT COLUMN: Vehicle Summary + Dates + Conditions
              ══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
            {/* ── Shape 1: Vehicle Summary Card ── */}
            <div className="relative rounded-3xl p-5 sm:p-6 bg-white border border-gray-200 shadow-[0_14px_36px_-8px_rgba(0,0,0,0.08),0_4px_12px_-2px_rgba(0,0,0,0.04)] overflow-hidden">
              {/* Top luxury orange highlight line */}
              <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#0B7584] to-transparent pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-center gap-4 min-w-0">
                  {/* Car Photo with stamp badge */}
                  <div
                    style={{
                      width: "120px",
                      height: "82px",
                    }}
                    className="relative rounded-2xl overflow-hidden bg-[#F8FAFC] border border-gray-200 shrink-0 shadow-md"
                  >
                    <Image
                      src={vehicle.images[0]}
                      alt={vehicle.name}
                      fill
                      priority
                      sizes="120px"
                      className="object-cover object-center"
                    />
                    {/* Status badge — dark green glassy, no dot */}
                    <div className="absolute top-1 left-1 z-10 pointer-events-none select-none">
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '2.5px 7px',
                        borderRadius: 6,
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        backdropFilter: 'blur(10px) saturate(1.5)',
                        WebkitBackdropFilter: 'blur(10px) saturate(1.5)',
                        background: vehicle.available
                          ? 'rgba(20, 83, 45, 0.85)'
                          : 'rgba(127, 29, 29, 0.80)',
                        border: vehicle.available
                          ? '1px solid rgba(74, 222, 128, 0.25)'
                          : '1px solid rgba(252, 165, 165, 0.2)',
                        color: vehicle.available
                          ? 'rgba(220, 252, 231, 0.98)'
                          : 'rgba(254, 226, 226, 0.95)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                      }}>
                        {vehicle.available ? 'Disponible' : 'Indisponible'}
                      </div>
                    </div>
                  </div>

                  {/* Title & Category */}
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400 block mb-0.5 truncate">
                      Catégorie {category.name}
                    </span>
                    <h2 className="font-sora text-xl font-black text-gray-950 tracking-tight leading-tight mb-1 truncate">
                      {vehicle.name}
                    </h2>
                    <div className="inline-flex items-center gap-1.5 py-0.5 px-2 rounded-lg bg-cyan-50/90 border border-cyan-200/70">
                      <span className="text-xs font-extrabold text-[#0B7584] tracking-tight">
                        {rentalDays} jour{rentalDays > 1 ? "s" : ""} · {vehicle.pricePerDay.toLocaleString("fr-DZ")} DA/j
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total Price & Caution block */}
                <div className="pt-3 border-t border-gray-100 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                      Total estimé
                    </span>
                    <div className="font-sora text-2xl sm:text-3xl font-black text-[#0B7584] tracking-tight mt-0.5">
                      {totalEstimated.toLocaleString("fr-DZ")}{" "}
                      <span className="text-xs font-bold text-gray-600">DA</span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 text-right">
                    + caution {category.deposit.toLocaleString("fr-DZ")} DA<br />
                    <span className="text-[11px] text-gray-400">(restituée au retour)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* ── Shape 2: Dates & Location ── */}
            <div className="rounded-2xl p-3 sm:p-4 bg-white border border-gray-200 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06),0_2px_6px_-2px_rgba(0,0,0,0.03)] space-y-2.5">
              {/* Dates capsule */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-gray-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-200/60 flex items-center justify-center shrink-0 text-[#0B7584]">
                  <Calendar size={15} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider leading-none mb-0.5">
                    Période de location
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900 tabular-nums truncate block">
                    {pickupAt.split("T")[0]} → {returnAt.split("T")[0]}
                  </span>
                </div>
              </div>

              {/* Location capsule */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-gray-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-200/60 flex items-center justify-center shrink-0 text-[#0B7584]">
                  <MapPin size={15} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider leading-none mb-0.5">
                    Lieu de remise
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900 truncate block">
                    Aéroport Houari Boumediene d&apos;Alger
                  </span>
                </div>
              </div>
            </div>

            {/* ── Shape 3: Conditions banner ── */}
            <div className="flex items-start gap-3 rounded-2xl p-3.5 sm:p-4 bg-cyan-50/80 border border-cyan-200/80 shadow-sm text-xs sm:text-sm text-gray-700">
              <div className="w-7 h-7 rounded-lg bg-white border border-cyan-200 flex items-center justify-center shrink-0 text-[#0B7584] shadow-sm mt-0.5">
                <Shield size={14} />
              </div>
              <p className="m-0 leading-relaxed font-medium">
                <strong className="text-gray-950 font-bold">Conditions {category.name} :</strong>{" "}
                âge minimum <strong className="text-gray-950 font-bold">{category.minAge} ans</strong> ·
                permis depuis <strong className="text-gray-950 font-bold">{category.licenceYears} an{category.licenceYears > 1 ? "s" : ""}</strong>
              </p>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              RIGHT COLUMN: Stepper + Reservation Form
              ══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 space-y-4">
            {/* ── Shape 4: Stepper ── */}
            <Stepper current={currentStep} />

            {/* ── Shape 5: Form Card ── */}
            <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-white border border-gray-200 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.08),0_4px_16px_-4px_rgba(0,0,0,0.03)]">
              {/* ── STEP 1: Coordonnées ───────────────────────────────────── */}
              {currentStep === 1 && (
                <form onSubmit={handleNext} noValidate className="space-y-4 sm:space-y-5">
                  <h3 className="font-sora text-lg sm:text-2xl font-bold text-gray-950 tracking-tight">
                    Vos coordonnées
                  </h3>

                  <div className="space-y-1.5">
                    <label htmlFor="fullname" className="text-[11px] uppercase tracking-wider font-bold text-gray-500 block">
                      Nom et prénom <span className="text-[#0B7584]">*</span>
                    </label>
                    <input
                      id="fullname"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Karim Benali"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl px-4 py-3 bg-[#F8FAFC] border border-gray-200 focus:border-[#0B7584] focus:ring-2 focus:ring-[#0B7584]/20 text-xs sm:text-sm font-semibold text-gray-900 outline-none transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-[11px] uppercase tracking-wider font-bold text-gray-500 block">
                        Téléphone <span className="text-[#0B7584]">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        placeholder="0555 12 34 56"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl px-4 py-3 bg-[#F8FAFC] border border-gray-200 focus:border-[#0B7584] focus:ring-2 focus:ring-[#0B7584]/20 text-xs sm:text-sm font-semibold text-gray-900 outline-none transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                      />
                      <p className="text-[11px] text-gray-400 font-medium">L&apos;agence vous appelle pour confirmer l&apos;heure du départ.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-[11px] uppercase tracking-wider font-bold text-gray-500 block">
                        E-mail <span className="text-[#0B7584]">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="nom@exemple.dz"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl px-4 py-3 bg-[#F8FAFC] border border-gray-200 focus:border-[#0B7584] focus:ring-2 focus:ring-[#0B7584]/20 text-xs sm:text-sm font-semibold text-gray-900 outline-none transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                      />
                      <p className="text-[11px] text-gray-400 font-medium">L&apos;acceptation vous parvient par écrit.</p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="submit"
                      className="flex items-center gap-2 py-3.5 px-7 rounded-full font-sora font-bold text-xs sm:text-sm bg-[#0B7584] hover:bg-[#085A66] text-white shadow-lg shadow-[#0B7584]/25 hover:shadow-xl hover:shadow-[#0B7584]/35 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      aria-label="Continuer vers l'étape 2 : permis de conduire"
                    >
                      <span>Continuer</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              )}

              {/* ── STEP 2: Permis ────────────────────────────────────────── */}
              {currentStep === 2 && (
                <form onSubmit={handleNext} noValidate className="space-y-5">
                  <h3 className="font-sora text-xl sm:text-2xl font-bold text-gray-950 tracking-tight">
                    Votre permis de conduire
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="licence-date" className="text-[11px] uppercase tracking-wider font-bold text-gray-500 block">
                        Date de délivrance <span className="text-[#0B7584]">*</span>
                      </label>
                      <input
                        id="licence-date"
                        type="date"
                        required
                        style={{ colorScheme: "light" }}
                        value={licenseDate}
                        max={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setLicenseDate(e.target.value)}
                        className="w-full rounded-xl px-4 py-3 bg-[#F8FAFC] border border-gray-200 focus:border-[#0B7584] focus:ring-2 focus:ring-[#0B7584]/20 text-xs sm:text-sm font-semibold text-gray-900 outline-none transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer"
                      />
                      <p className="text-[11px] text-gray-400 font-medium">Ancienneté minimale : {category.licenceYears} an{category.licenceYears > 1 ? "s" : ""}</p>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="birth-date" className="text-[11px] uppercase tracking-wider font-bold text-gray-500 block">
                        Date de naissance <span className="text-[#0B7584]">*</span>
                      </label>
                      <input
                        id="birth-date"
                        type="date"
                        required
                        style={{ colorScheme: "light" }}
                        value={birthDate}
                        max={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full rounded-xl px-4 py-3 bg-[#F8FAFC] border border-gray-200 focus:border-[#0B7584] focus:ring-2 focus:ring-[#0B7584]/20 text-xs sm:text-sm font-semibold text-gray-900 outline-none transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer"
                      />
                      <p className="text-[11px] text-gray-400 font-medium">Âge minimum : {category.minAge} ans</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="licence-number" className="text-[11px] uppercase tracking-wider font-bold text-gray-500 block">
                      Numéro du permis (facultatif)
                    </label>
                    <input
                      id="licence-number"
                      type="text"
                      placeholder="16/123456"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="w-full rounded-xl px-4 py-3 bg-[#F8FAFC] border border-gray-200 focus:border-[#0B7584] focus:ring-2 focus:ring-[#0B7584]/20 text-xs sm:text-sm font-semibold text-gray-900 outline-none transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                    />
                  </div>

                  {/* Live eligibility feedback */}
                  {(licenseDate && birthDate) && (
                    !eligibility.eligible ? (
                      <div
                        role="alert"
                        className="p-4 rounded-2xl bg-rose-50 border border-rose-200/90 text-rose-800 space-y-2 text-xs sm:text-sm"
                      >
                        <div className="flex items-center gap-2 font-bold text-rose-700">
                          <AlertTriangle size={15} />
                          Critères non remplis
                        </div>
                        <p className="text-gray-700 font-medium m-0">
                          {eligibility.reason}
                        </p>
                        {eligibleCategories.length > 0 && (
                          <p className="text-gray-500 m-0 text-xs font-semibold">
                            Catégories accessibles pour vous :{" "}
                            {eligibleCategories.map((c, i) => (
                              <span key={c.id}>
                                <Link href={`${ROUTES.fleet}?category=${c.id}`} className="text-[#0B7584] underline font-bold">
                                  {c.name}
                                </Link>
                                {i < eligibleCategories.length - 1 && ", "}
                              </span>
                            ))}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div
                        role="status"
                        className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-800 shadow-sm"
                      >
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        <span>Éligible — {eligibility.age} ans, permis depuis {eligibility.seniority} an{eligibility.seniority !== 1 ? "s" : ""}</span>
                      </div>
                    )
                  )}

                  <div className="flex items-center justify-between pt-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex items-center gap-2 py-3 px-6 rounded-full font-bold text-xs sm:text-sm bg-[#F8FAFC] hover:bg-gray-100 text-gray-800 border border-gray-200 shadow-sm transition-all"
                      aria-label="Retour à l'étape 1"
                    >
                      <ArrowLeft size={15} />
                      Précédent
                    </button>
                    <button
                      type="submit"
                      disabled={!!(licenseDate && birthDate && !eligibility.eligible)}
                      className="flex items-center gap-2 py-3.5 px-7 rounded-full font-sora font-bold text-xs sm:text-sm bg-[#0B7584] hover:bg-[#085A66] text-white shadow-lg shadow-[#0B7584]/25 hover:shadow-xl hover:shadow-[#0B7584]/35 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Continuer vers l'étape 3 : lieu et envoi"
                    >
                      <span>Continuer</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              )}

              {/* ── STEP 3: Départ et envoi ───────────────────────────────── */}
              {currentStep === 3 && (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <h3 className="font-sora text-xl sm:text-2xl font-bold text-gray-950 tracking-tight">
                    Départ et envoi de la demande
                  </h3>

                  {/* Honeypot */}
                  <input
                    type="text"
                    name="honeypot_field"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ position: "absolute", left: "-9999px", opacity: 0 }}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  {/* Agency selector */}
                  <div className="space-y-1.5">
                    <label htmlFor="agency" className="text-[11px] uppercase tracking-wider font-bold text-gray-500 block">
                      Lieu de prise en charge <span className="text-[#0B7584]">*</span>
                    </label>
                    <select
                      id="agency"
                      value={agencyId}
                      onChange={(e) => setAgencyId(e.target.value)}
                      style={{ colorScheme: "light" }}
                      className="w-full rounded-xl px-4 py-3 bg-[#F8FAFC] border border-gray-200 focus:border-[#0B7584] focus:ring-2 focus:ring-[#0B7584]/20 text-xs sm:text-sm font-semibold text-gray-900 outline-none transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer"
                    >
                      {agencies.map((a) => (
                        <option key={a.id} value={a.id}>{a.name} — {a.address}</option>
                      ))}
                    </select>
                  </div>

                  {/* Exact model guarantee */}
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#F8FAFC] border border-gray-200/90 text-xs sm:text-sm text-gray-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                    <Car size={18} className="text-[#0B7584] shrink-0 mt-0.5" />
                    <p className="m-0 leading-relaxed font-medium">
                      <strong className="text-gray-950 font-bold">Véhicule réservé : {vehicle.name}.</strong>{" "}
                      Ce modèle précis vous est réservé, sous réserve de confirmation écrite.
                    </p>
                  </div>

                  {/* Note for agency */}
                  <div className="space-y-1.5">
                    <label htmlFor="note" className="text-[11px] uppercase tracking-wider font-bold text-gray-500 block">
                      Un mot pour l&apos;agence (facultatif)
                    </label>
                    <textarea
                      id="note"
                      rows={3}
                      value={clientNote}
                      onChange={(e) => setClientNote(e.target.value)}
                      placeholder="Besoins spécifiques, heure de vol, siège enfant…"
                      className="w-full rounded-xl px-4 py-3 bg-[#F8FAFC] border border-gray-200 focus:border-[#0B7584] focus:ring-2 focus:ring-[#0B7584]/20 text-xs sm:text-sm font-semibold text-gray-900 outline-none transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] resize-vertical"
                    />
                  </div>

                  {/* Consent */}
                  <label
                    htmlFor="consent"
                    className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-gray-600 font-medium"
                  >
                    <input
                      id="consent"
                      type="checkbox"
                      required
                      checked={confirmTerms}
                      onChange={(e) => setConfirmTerms(e.target.checked)}
                      className="rounded w-4 h-4 accent-[#0B7584] cursor-pointer mt-0.5 shrink-0"
                    />
                    <span>
                      Je confirme l&apos;exactitude de ces informations et j&apos;accepte d&apos;être contacté par téléphone et par e-mail au sujet de cette demande.
                    </span>
                  </label>

                  <div className="pt-3 border-t border-gray-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="flex items-center gap-2 py-3 px-6 rounded-full font-bold text-xs sm:text-sm bg-[#F8FAFC] hover:bg-gray-100 text-gray-800 border border-gray-200 shadow-sm transition-all"
                        aria-label="Retour à l'étape 2"
                      >
                        <ArrowLeft size={15} />
                        Précédent
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting || !confirmTerms}
                        className="flex items-center gap-2 py-3.5 px-8 rounded-full font-sora font-bold text-xs sm:text-sm bg-[#0B7584] hover:bg-[#085A66] text-white shadow-lg shadow-[#0B7584]/25 hover:shadow-xl hover:shadow-[#0B7584]/35 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Envoyer ma demande de réservation"
                        aria-busy={isSubmitting}
                      >
                        <Send size={15} />
                        <span>{isSubmitting ? "Envoi en cours…" : "Envoyer ma demande"}</span>
                      </button>
                    </div>

                    {/* WhatsApp fallback */}
                    <a
                      href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(waText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full font-bold text-xs sm:text-sm bg-[#F8FAFC] hover:bg-gray-100 text-gray-800 border border-gray-200 shadow-sm transition-all"
                      aria-label="Envoyer la demande par WhatsApp"
                    >
                      <MessageCircle size={16} className="text-emerald-600" />
                      <span>Préférez-vous WhatsApp ?</span>
                    </a>

                    <p className="text-[11px] text-gray-400 text-center font-medium">
                      Aucun paiement en ligne. Rien n&apos;est débité maintenant.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Page shell with Suspense ──────────────────────────────────────────────────

export default function ReservationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-pulse bg-[#F8F9FA]">
          <div className="h-6 w-32 rounded-lg bg-gray-200" />
          <div className="h-10 w-72 rounded-2xl bg-gray-200" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-4">
              <div className="h-44 w-full rounded-3xl bg-white border border-gray-200" />
              <div className="h-28 w-full rounded-2xl bg-white border border-gray-200" />
            </div>
            <div className="lg:col-span-7 space-y-4">
              <div className="h-20 w-full rounded-2xl bg-white border border-gray-200" />
              <div className="h-96 w-full rounded-3xl bg-white border border-gray-200" />
            </div>
          </div>
        </div>
      }
    >
      <ReserveContent modelId={resolvedParams.id} />
    </Suspense>
  );
}

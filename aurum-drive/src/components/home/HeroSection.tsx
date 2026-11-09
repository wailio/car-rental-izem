"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Menu } from "lucide-react";
import { ROUTES } from "@/lib/config";
import { MobileMenuDrawer } from "@/components/navigation/MobileMenuDrawer";
import { IzemBrandLockup } from "@/components/common/IzemBrandLockup";

const LOCATIONS = [
  "Aéroport d'Alger (ALG)",
  "Alger Centre — Agence",
  "Livraison sur Alger",
];

export function HeroSection() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [date, setDate] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileStep, setMobileStep] = useState<1 | 2 | 3>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      location,
      ...(date ? { pickup_at: date } : {}),
      ...(fullName ? { name: fullName } : {}),
      ...(phone ? { phone } : {}),
    });
    router.push(`${ROUTES.fleet}?${params.toString()}`);
  };

  const scrollToBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("booking-box");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      router.push(ROUTES.fleet);
    }
  };

  return (
    <section className="relative w-full px-3.5 sm:px-4 lg:px-[15px] pt-3 sm:pt-[15px] pb-6 sm:pb-8">
      {/* ── Framed Hero Container (Exact 67% Zoom Shape) ── */}
      <div className="relative w-full rounded-[20px] sm:rounded-[28px] overflow-hidden bg-[#0A0D12] min-h-[640px] lg:h-[clamp(650px,90vh,880px)] flex flex-col justify-between shadow-2xl border border-white/10">
        
        {/* Background Video — IZEM MOTORS footage */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/images/hero-fleet-poster.jpg"
            className="w-full h-full object-cover object-center"
          >
            <source src="/videos/herosec-vid.mp4" type="video/mp4" />
          </video>

          {/* Cinematic Scrims (Balanced for clear video car visibility + high text contrast) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0D12]/80 via-black/35 to-[#0A0D12]/90" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-[#0A0D12]/50" />
        </div>

        {/* ── 1. Embedded Navigation Header ─────────────────────────────── */}
        <header className="relative z-20 flex items-center justify-between px-4 sm:px-10 lg:px-14 py-4 sm:py-5 border-b border-white/10 shrink-0">
          {/* Logo */}
          <Link href="/" className="flex items-center text-white no-underline group">
            <IzemBrandLockup theme="dark" size="md" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-sora font-medium text-white/90">
            <Link href="/" className="text-[#0B7584] font-semibold hover:text-white transition-colors">
              Accueil
            </Link>
            <Link href={ROUTES.fleet} className="hover:text-[#0B7584] transition-colors">
              Flotte
            </Link>
            <Link href={ROUTES.services} className="hover:text-[#0B7584] transition-colors">
              Prestations
            </Link>
            <Link href={ROUTES.about} className="hover:text-[#0B7584] transition-colors">
              À Propos
            </Link>
            <Link href={ROUTES.faq} className="hover:text-[#0B7584] transition-colors">
              FAQ
            </Link>
            <Link href={ROUTES.contact} className="hover:text-[#0B7584] transition-colors">
              Contact
            </Link>
          </nav>

          {/* Header Action Button (Desktop only) & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:inline-flex">
              <Link
                href={ROUTES.fleet}
                className="btn-flip btn-flip-orange btn-flip-sm shadow-md shadow-[#0B7584]/30"
              >
                <span className="btn-flip-circle">
                  <ArrowRight size={13} strokeWidth={2.5} />
                </span>
                <span className="btn-flip-text">Réserver</span>
              </Link>
            </div>

            {/* Mobile Hamburger toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white cursor-pointer active:scale-95 transition-all"
              aria-label="Ouvrir le menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </header>

        {/* ── 2. Center Content Area (Eyebrow, H1, Subtitle, Two CTA Buttons) ── */}
        <div className="relative z-10 text-center px-4 sm:px-8 max-w-4xl mx-auto pt-1 sm:pt-2 pb-1 -translate-y-4 sm:-translate-y-6 lg:-translate-y-8">
          {/* Eyebrow Pill Badge (• Prise en charge à l'Aéroport d'Alger) */}
          <div
            data-pop="badge"
            className="inline-flex items-center gap-2 px-3.5 py-1 mb-2.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-md shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B7584] animate-pulse shrink-0 shadow-[0_0_10px_rgba(11, 117, 132,0.85)]" />
            <span className="font-sora text-[11px] sm:text-xs font-medium text-white/90 tracking-normal">
              Prise en charge à l&apos;Aéroport d&apos;Alger
            </span>
          </div>

          {/* H1 Heading — iOS thin+bold weight contrast */}
          <h1
            data-pop="up"
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
              fontSize: 'clamp(1.9rem, 4.5vw, 3.2rem)',
              lineHeight: 1.12,
              letterSpacing: '-0.025em',
              color: 'white',
              marginBottom: '0.6rem',
              maxWidth: '820px',
              margin: '0 auto 0.6rem',
            }}
          >
            <span style={{ fontWeight: 300 }}>Louez le véhicule idéal pour </span>
            <span style={{ fontWeight: 800 }}>chaque trajet à Alger</span>
          </h1>

          {/* Subtitle */}
          <div
            data-pop="up"
            data-pop-delay="0.1s"
            className="mb-4 sm:mb-5"
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
              maxWidth: '760px',
              margin: '0 auto 1.25rem',
            }}
          >
            {/* Mobile: Extra small text with only the requested line */}
            <p className="md:hidden text-[11px] text-white/75 font-normal tracking-normal leading-relaxed m-0">
              Trouvez la voiture idéale pour chaque trajet
            </p>
            {/* Desktop: original full text */}
            <p
              className="hidden md:block m-0"
              style={{
                fontSize: 'clamp(0.7rem, 1.1vw, 0.85rem)',
                color: 'rgba(255,255,255,0.68)',
                lineHeight: 1.7,
                fontWeight: 400,
              }}
            >
              <span className="block">
                Trouvez la voiture idéale pour chaque trajet parmi notre sélection de véhicules récents et parfaitement entretenus.
              </span>
              <span className="block">
                Livraison gratuite à l&apos;Aéroport d&apos;Alger, assistance 24h/24, assurance tous risques et sans paiement en ligne préalable.
              </span>
            </p>
          </div>

          {/* The Two Hero CTA Buttons (Same line & equal size on mobile) */}
          <div
            data-pop="up"
            data-pop-delay="0.18s"
            className="flex items-center justify-center gap-2 sm:gap-3 w-full max-w-sm sm:max-w-none mx-auto"
          >
            {/* Button 1: Signature Electric Orange (Réserver un véhicule) */}
            <button
              onClick={scrollToBooking}
              className="btn-flip btn-flip-orange flex-1 sm:flex-initial justify-center text-center !px-2.5 sm:!px-6 !py-2.5 sm:!py-3.5 !text-[11.5px] sm:!text-sm min-w-0"
            >
              <span className="btn-flip-circle">
                <ArrowRight size={13} strokeWidth={2.5} />
              </span>
              <span className="btn-flip-text truncate">Réserver</span>
            </button>

            {/* Button 2: White Pill (Voir la flotte) */}
            <Link
              href={ROUTES.fleet}
              className="btn-flip btn-flip-white flex-1 sm:flex-initial justify-center text-center !px-2.5 sm:!px-6 !py-2.5 sm:!py-3.5 !text-[11.5px] sm:!text-sm min-w-0"
            >
              <span className="btn-flip-circle">
                <ArrowRight size={13} strokeWidth={2.5} />
              </span>
              <span className="btn-flip-text truncate">Voir la flotte</span>
            </Link>
          </div>
        </div>

        {/* ── 3. Bottom Floating Booking Bar ── */}
        <div id="booking-box" data-pop="scale" data-pop-delay="0.25s" className="relative z-20 w-full px-3.5 sm:px-6 lg:px-8 pb-10 sm:pb-12 lg:pb-14 pt-2">
          {/* Desktop Booking Bar (Untouched) */}
          <form
            onSubmit={handleSubmit}
            className="rentgo-booking-card hidden md:block"
          >
            <div className="rentgo-booking-row">
              
              {/* Col 0: Title ("Need to Rent a Luxury Car?" -> "Besoin de louer un véhicule ?") */}
              <div className="rentgo-booking-col-title">
                <h3 className="font-sora font-semibold text-white text-[15px] sm:text-[16px] leading-[1.25] tracking-tight m-0">
                  Besoin de louer un<br />véhicule ?
                </h3>
              </div>

              {/* Col 1: Full Name / Nom complet */}
              <div className="rentgo-booking-col">
                <label className="rentgo-booking-label">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Votre nom"
                  className="rentgo-booking-input"
                />
              </div>

              {/* Col 2: Mobile Number / Téléphone mobile */}
              <div className="rentgo-booking-col">
                <label className="rentgo-booking-label">
                  Téléphone mobile
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0550 12 34 56"
                  className="rentgo-booking-input"
                />
              </div>

              {/* Col 3: Pickup Location / Lieu de retrait */}
              <div className="rentgo-booking-col">
                <label className="rentgo-booking-label">
                  Lieu de retrait
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="rentgo-booking-input cursor-pointer [&>option]:text-white [&>option]:bg-[#16181F]"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Col 4: Pickup Date / Date de retrait */}
              <div className="rentgo-booking-col">
                <label className="rentgo-booking-label">
                  Date de retrait
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rentgo-booking-input cursor-pointer [color-scheme:dark]"
                />
              </div>

              {/* Col 5: Submit / Envoyer Button (Interactive Directional Flip in Brand Orange) */}
              <div className="rentgo-booking-col-btn">
                <button
                  type="submit"
                  className="btn-flip btn-flip-orange shadow-md shadow-[#0B7584]/30 shrink-0"
                >
                  <span className="btn-flip-circle">
                    <ArrowRight size={13} strokeWidth={2.5} />
                  </span>
                  <span className="btn-flip-text">Envoyer</span>
                </button>
              </div>
            </div>
          </form>

          {/* ── Mobile iOS Micro Booking Wizard (One question at a time) ── */}
          <div className="md:hidden w-full max-w-sm mx-auto">
            <div
              className="w-full rounded-2xl p-3 border border-white/15 shadow-xl relative overflow-hidden backdrop-blur-xl"
              style={{
                background: "rgba(16, 20, 28, 0.92)",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
              }}
            >
              {/* Header row with step indicator */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B7584] animate-pulse" />
                  <span className="text-[11px] font-bold text-white tracking-tight">
                    {mobileStep === 1 && "1/3 · Lieu de retrait"}
                    {mobileStep === 2 && "2/3 · Date de retrait"}
                    {mobileStep === 3 && "3/3 · Vos coordonnées"}
                  </span>
                </div>
                {/* Step indicator dots */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((s) => (
                    <span
                      key={s}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        mobileStep === s
                          ? "w-4 bg-[#0B7584]"
                          : mobileStep > s
                          ? "w-2 bg-emerald-500"
                          : "w-2 bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Step 1: Lieu de retrait */}
              {mobileStep === 1 && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <div className="relative">
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#0B7584] appearance-none cursor-pointer [&>option]:text-slate-900 [&>option]:bg-white"
                    >
                      {LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/60 text-[10px]">
                      ▼
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMobileStep(2)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#0B7584] text-white text-xs font-bold shadow-md shadow-[#0B7584]/30 active:scale-[0.98] transition-transform cursor-pointer"
                  >
                    <span>Continuer</span>
                    <ArrowRight size={12} strokeWidth={2.5} />
                  </button>
                </div>
              )}

              {/* Step 2: Date de retrait */}
              {mobileStep === 2 && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#0B7584] cursor-pointer [color-scheme:dark]"
                  />

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMobileStep(1)}
                      className="flex-1 py-2 rounded-xl bg-white/10 border border-white/15 text-white/80 text-xs font-semibold hover:bg-white/15 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      Retour
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileStep(3)}
                      className="flex-[2] flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#0B7584] text-white text-xs font-bold shadow-md shadow-[#0B7584]/30 active:scale-[0.98] transition-transform cursor-pointer"
                    >
                      <span>Continuer</span>
                      <ArrowRight size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Nom et Téléphone */}
              {mobileStep === 3 && (
                <form onSubmit={handleSubmit} className="space-y-2 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Votre nom"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-2.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#0B7584]"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0550 12 34 56"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-2.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#0B7584]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMobileStep(2)}
                      className="flex-1 py-2 rounded-xl bg-white/10 border border-white/15 text-white/80 text-xs font-semibold hover:bg-white/15 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#0B7584] text-white text-xs font-bold shadow-md shadow-[#0B7584]/30 active:scale-[0.98] transition-transform cursor-pointer"
                    >
                      <span>Envoyer</span>
                      <ArrowRight size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      <MobileMenuDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </section>
  );
}

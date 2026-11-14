'use client'

import React, { useState } from 'react'
import { LiveRentalVehicle } from '@/lib/fleet-state'
import {
  Car,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  FileText,
  ChevronDown,
  ChevronUp,
  Bell,
  Home,
  CreditCard,
  MessageSquare,
  ArrowRight,
  Fuel,
  Gauge,
  Check,
  Sparkles,
} from 'lucide-react'

interface CustomerAppViewProps {
  car: LiveRentalVehicle
  /**
   * If true, renders inside the iPhone 15 admin preview container.
   * If false, renders as full standalone mobile view.
   */
  isMockup?: boolean
}

export function CustomerAppView({ car, isMockup = false }: CustomerAppViewProps) {
  // 'welcome' = Screen 1 (matching Image 1 with sunset cars fade-out)
  // 'dashboard' = Screen 2 (matching Image 3 with car card, client name, and tracking)
  const [screen, setScreen] = useState<'welcome' | 'dashboard'>('welcome')
  const [isTrackingExpanded, setIsTrackingExpanded] = useState(true)

  // Active client name derived from rental or realistic assigned client
  const isRented = car.status === 'rented' && !!car.rental?.clientName
  const activeClientName = isRented
    ? car.rental!.clientName
    : car.id === 2
    ? 'Dr. Amina Dahmani'
    : car.id === 5
    ? 'Sofiane Mebarki'
    : car.id === 7
    ? 'Nassim Boudiaf'
    : 'Karim Belkacem'

  // First name for friendly iOS greeting (e.g. "Bonjour, Karim")
  const firstName = activeClientName.split(' ')[0]

  // Client initials for iOS top avatar (e.g. "KB")
  const initials = activeClientName
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  // Rental details
  const days = 6
  const totalPrice = car.pricePerDay * days
  const formattedPrice = totalPrice.toLocaleString('fr-DZ')
  const periodText = car.rental?.startDate
    ? `${car.rental.startDate.split(' ')[0]} - ${car.rental.endDate.split(' ')[0]} oct.`
    : '18 - 24 oct.'
  const remainingText = car.rental?.remainingText || '4j 12h'
  const returnLocation = car.rental?.pickupLocation || "Aéroport Houari Boumediene (T4)"

  return (
    <div
      className="relative w-full h-full flex flex-col justify-between overflow-y-auto select-none"
      style={{
        background: '#F7F5F0', // Warm ivory/cream iOS background matching reference images
        color: '#1C1C1E',
        fontFamily: 'var(--font-heading), -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        @keyframes iosScreenEnter {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-ios-screen {
          animation: iosScreenEnter 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════════════
          SCREEN 1 : WELCOME & AUTOMATIC CLIENT IDENTIFICATION (IMAGE 1 REFERENCE)
          ══════════════════════════════════════════════════════════════════════════ */}
      {screen === 'welcome' && (
        <div className="relative w-full min-h-full flex flex-col justify-between animate-ios-screen">
          {/* Top Hero Image with Luxury iOS Downward Gradient Fade */}
          <div className="relative w-full h-[240px] flex-shrink-0 overflow-hidden">
            <img
              src="/images/fleet-sunset.jpg"
              alt="Flotte DZ Rent Car au coucher du soleil"
              className="w-full h-full object-cover object-center"
              style={{
                maskImage:
                  'linear-gradient(to bottom, rgba(0,0,0,1) 45%, rgba(0,0,0,0.8) 65%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, rgba(0,0,0,1) 45%, rgba(0,0,0,0.8) 65%, rgba(0,0,0,0) 100%)',
              }}
            />
          </div>

          {/* Body Content below the fade */}
          <div className="flex-1 px-6 -mt-10 relative z-10 flex flex-col justify-between pb-6">
            <div>
              {/* Brand Squircle Lockup (replacing blue logo from reference) */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#0D6D70] flex items-center justify-center shadow-md">
                  <Car className="w-5 h-5 text-white" strokeWidth={2.2} />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold tracking-tight text-[#111827] leading-none mb-0.5">
                    DZ RENT CAR
                  </h2>
                  <p className="text-[11px] font-medium text-[#6B7280] tracking-wide">
                    Service Privilège · Alger
                  </p>
                </div>
              </div>

              {/* Big Headline */}
              <h1 className="text-[26px] font-extrabold text-[#111827] tracking-tight leading-[1.18] mb-2">
                Votre véhicule vous attend.
              </h1>

              {/* Explanatory subtitle */}
              <p className="text-[13px] text-[#4B5563] leading-relaxed mb-5 font-normal">
                Contrat validé, véhicule préparé et disponible pour votre séjour en Algérie.
              </p>

              {/* Auto-filled Client Name Field (No user input requested) */}
              <div className="bg-white rounded-2xl p-3.5 mb-3.5 border border-black/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8E8E93]">
                    Conducteur enregistré
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0D6D70] bg-[#E6F4F4] px-2 py-0.5 rounded-full">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                    Contrat actif
                  </span>
                </div>
                <div className="text-[17px] font-bold text-[#111827] tracking-tight">
                  {activeClientName}
                </div>
              </div>

              {/* Assigned Vehicle Preview Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 mb-4 border border-black/[0.05] flex items-center gap-3">
                <div className="w-12 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-[#111827] truncate">
                    {car.name}
                  </div>
                  <div className="text-[11px] text-[#6B7280] font-mono">
                    Immatriculation : {car.plate}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-1">
              {/* Primary Action Button: "C'est moi" */}
              <button
                type="button"
                onClick={() => setScreen('dashboard')}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#2DD4BF] hover:bg-[#14B8A6] active:scale-[0.98] text-[#042F2E] font-bold text-[15px] tracking-tight transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(45,212,191,0.35)] cursor-pointer"
              >
                <span>C&apos;est moi</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Biometric / Security row */}
              <div className="flex items-center justify-center gap-2 text-[11.5px] text-[#4B5563] font-medium py-1">
                <ShieldCheck className="w-4 h-4 text-[#0D6D70]" />
                <span>Session sécurisée · Clé digitale vérifiée</span>
              </div>

              {/* Tiny Footer Note */}
              <p className="text-[10px] text-center text-[#9CA3AF] leading-tight">
                DZ Rent Car · Remise aéroportuaire 24/7 sans formalité d&apos;attente.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          SCREEN 2 : STATS & REAL-TIME TRACKING DASHBOARD (IMAGE 3 REFERENCE)
          ══════════════════════════════════════════════════════════════════════════ */}
      {screen === 'dashboard' && (
        <div className="relative w-full min-h-full flex flex-col justify-between animate-ios-screen">
          {/* Scrollable Main Area */}
          <div
            className="flex-1 px-5 pb-6 overflow-y-auto"
            style={{
              paddingTop: isMockup ? '56px' : '20px',
            }}
          >
            {/* Top iOS Header Bar: Logo, Notification Bell, User Avatar */}
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setScreen('welcome')}
                  className="w-9 h-9 rounded-2xl bg-[#0D6D70] flex items-center justify-center shadow-sm cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                  title="Revenir à l'accueil"
                >
                  <Car className="w-4 h-4 text-white" strokeWidth={2.2} />
                </button>
                <div>
                  <div className="text-[13px] font-bold text-[#111827] leading-none mb-0.5">
                    DZ RENT CAR
                  </div>
                  <div className="text-[10px] font-medium text-[#6B7280]">
                    Location en cours
                  </div>
                </div>
              </div>

              {/* Right side: Bell icon with unread dot + Client Avatar Initials */}
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-full bg-white border border-black/[0.08] flex items-center justify-center shadow-sm">
                  <Bell className="w-4 h-4 text-[#4B5563]" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EF4444]" />
                </div>
                <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center text-[11px] font-bold tracking-tight shadow-sm">
                  {initials}
                </div>
              </div>
            </div>

            {/* Greeting */}
            <div className="mb-3.5">
              <div className="text-[12px] font-medium text-[#6B7280]">
                Bonjour, {firstName}
              </div>
              <h2 className="text-[22px] font-extrabold text-[#111827] tracking-tight leading-tight">
                Votre location est active
              </h2>
            </div>

            {/* ── THE HERO VEHICLE SHAPE (IMAGE 3 EXACT STRUCTURE) ─────────────── */}
            <div
              className="relative w-full rounded-[26px] overflow-hidden shadow-xl mb-4 border border-black/[0.08] text-white"
              style={{
                minHeight: '235px',
                background: '#0F172A',
              }}
            >
              {/* Background Car Photo */}
              <img
                src={car.image}
                alt={car.name}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />

              {/* Dark luxury gradient for maximum text readability */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.58) 50%, rgba(10,15,25,0.92) 100%)',
                }}
              />

              {/* Card Interior Content */}
              <div className="relative z-10 p-4 flex flex-col justify-between min-h-[235px]">
                {/* Top Row inside card */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-emerald-400/40 text-[10.5px] font-semibold text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    En circulation
                  </span>

                  <span className="text-[11px] font-semibold text-white/90 drop-shadow-sm truncate max-w-[150px]">
                    {car.name}
                  </span>
                </div>

                {/* Middle: Prominent Client Name (replacing 28.7°C from image 3) */}
                <div className="my-auto pt-2 pb-1">
                  <div className="text-[9.5px] uppercase font-bold tracking-widest text-emerald-300/90 mb-0.5">
                    Conducteur vérifié
                  </div>
                  <h3 className="text-[24px] font-black text-white tracking-tight leading-none drop-shadow-md">
                    {activeClientName}
                  </h3>
                  <div className="mt-1 inline-block text-[10.5px] font-mono text-white/80 bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm border border-white/15">
                    {car.plate} · Alger
                  </div>
                </div>

                {/* 3 Frosted Glass Shapes (Chips from image 3) */}
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {/* Chip 1: Total / Price */}
                  <div className="bg-white/15 backdrop-blur-md rounded-xl p-2 border border-white/20 text-center">
                    <div className="text-[9.5px] text-white/70 font-medium uppercase tracking-wider mb-0.5">
                      Tarif total
                    </div>
                    <div className="text-[11.5px] font-bold text-white tracking-tight leading-tight">
                      {formattedPrice} DA
                    </div>
                  </div>

                  {/* Chip 2: Period */}
                  <div className="bg-white/15 backdrop-blur-md rounded-xl p-2 border border-white/20 text-center">
                    <div className="text-[9.5px] text-white/70 font-medium uppercase tracking-wider mb-0.5">
                      Période
                    </div>
                    <div className="text-[11.5px] font-bold text-white tracking-tight leading-tight">
                      {periodText}
                    </div>
                  </div>

                  {/* Chip 3: Deposit */}
                  <div className="bg-white/15 backdrop-blur-md rounded-xl p-2 border border-white/20 text-center">
                    <div className="text-[9.5px] text-white/70 font-medium uppercase tracking-wider mb-0.5">
                      Caution
                    </div>
                    <div className="text-[11.5px] font-bold text-emerald-300 tracking-tight leading-tight">
                      Déposée
                    </div>
                  </div>
                </div>

                {/* Button inside the card: "Suivi de cette location" */}
                <button
                  type="button"
                  onClick={() => setIsTrackingExpanded(!isTrackingExpanded)}
                  className="mt-3 w-full py-2.5 px-4 rounded-xl bg-[#2DD4BF] hover:bg-[#14B8A6] active:scale-[0.98] text-[#042F2E] font-bold text-[13px] tracking-tight transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Gauge className="w-4 h-4 text-[#042F2E]" />
                  <span>Suivi de cette location</span>
                  {isTrackingExpanded ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </button>
              </div>
            </div>

            {/* ── TRACKING INFO EXPANDED SECTION (POPS UP UNDER THE CAR SHAPE) ── */}
            {isTrackingExpanded && (
              <div className="space-y-3">
                {/* 1. Real-time Donut Time Tracker Card */}
                <div className="bg-white rounded-2xl p-4 border border-black/[0.06] shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">
                      Compte à rebours du séjour
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      En cours · 65%
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* SVG Donut Circle */}
                    <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                        {/* Background track */}
                        <circle
                          cx="40"
                          cy="40"
                          r="34"
                          stroke="#E5E7EB"
                          strokeWidth="7"
                          fill="transparent"
                        />
                        {/* Elapsed progress stroke */}
                        <circle
                          cx="40"
                          cy="40"
                          r="34"
                          stroke="#14B8A6"
                          strokeWidth="7"
                          fill="transparent"
                          strokeDasharray="213.6"
                          strokeDashoffset={213.6 - (213.6 * 65) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Center remaining text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-[13px] font-black text-[#111827] leading-none">
                          {remainingText}
                        </span>
                        <span className="text-[9px] font-medium text-[#6B7280] mt-0.5">
                          restants
                        </span>
                      </div>
                    </div>

                    {/* Donut Details */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-bold text-[#111827] mb-1">
                        Restitution prévue
                      </div>
                      <div className="text-[11px] text-[#4B5563] flex items-center gap-1.5 mb-1">
                        <Clock className="w-3.5 h-3.5 text-[#0D6D70] flex-shrink-0" />
                        <span>{car.rental?.endDate || '24 oct. 2026 à 18:00'}</span>
                      </div>
                      <div className="text-[11px] text-[#4B5563] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#0D6D70] flex-shrink-0" />
                        <span className="truncate">{returnLocation}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Vehicle Health & Inclusions */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-white rounded-xl p-3 border border-black/[0.06] shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Fuel className="w-4 h-4 text-emerald-600" />
                      <span className="text-[11px] font-bold text-[#111827]">Carburant</span>
                    </div>
                    <div className="text-[11px] text-[#4B5563]">100% Plein au départ</div>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-black/[0.06] shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldCheck className="w-4 h-4 text-[#0D6D70]" />
                      <span className="text-[11px] font-bold text-[#111827]">Assurance</span>
                    </div>
                    <div className="text-[11px] text-[#4B5563]">Tous risques incluse</div>
                  </div>
                </div>

                {/* 3. Direct 24/7 Assistance Call Button */}
                <a
                  href="tel:+213555333316"
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-black/[0.08] shadow-sm flex items-center justify-between text-[#111827] active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-[12px] font-bold leading-none mb-0.5">
                        Assistance 24/7 DZ Rent Car
                      </div>
                      <div className="text-[10px] text-[#6B7280]">
                        Agent dédié à l&apos;Aéroport d&apos;Alger
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700">Appeler</span>
                </a>
              </div>
            )}
          </div>

          {/* ── BOTTOM IOS 5-ICON TAB BAR (MATCHING IMAGE 3) ─────────────────── */}
          <div className="w-full bg-white/90 backdrop-blur-md border-t border-black/[0.08] px-4 py-2 flex items-center justify-around flex-shrink-0">
            {/* 1. Accueil */}
            <button
              type="button"
              className="flex flex-col items-center gap-0.5 text-[#0D6D70]"
            >
              <Home className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[9.5px] font-bold">Accueil</span>
            </button>

            {/* 2. Véhicule */}
            <button
              type="button"
              onClick={() => setIsTrackingExpanded(!isTrackingExpanded)}
              className="flex flex-col items-center gap-0.5 text-[#8E8E93] hover:text-[#111827]"
            >
              <Car className="w-5 h-5 stroke-[2]" />
              <span className="text-[9.5px] font-medium">Véhicule</span>
            </button>

            {/* 3. Caution */}
            <button
              type="button"
              className="flex flex-col items-center gap-0.5 text-[#8E8E93] hover:text-[#111827]"
            >
              <CreditCard className="w-5 h-5 stroke-[2]" />
              <span className="text-[9.5px] font-medium">Caution</span>
            </button>

            {/* 4. Contrat */}
            <button
              type="button"
              className="flex flex-col items-center gap-0.5 text-[#8E8E93] hover:text-[#111827]"
            >
              <FileText className="w-5 h-5 stroke-[2]" />
              <span className="text-[9.5px] font-medium">Contrat</span>
            </button>

            {/* 5. Support with red notification dot */}
            <button
              type="button"
              className="relative flex flex-col items-center gap-0.5 text-[#8E8E93] hover:text-[#111827]"
            >
              <div className="relative">
                <MessageSquare className="w-5 h-5 stroke-[2]" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#EF4444] text-[7.5px] font-bold text-white flex items-center justify-center">
                  1
                </span>
              </div>
              <span className="text-[9.5px] font-medium">Support</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

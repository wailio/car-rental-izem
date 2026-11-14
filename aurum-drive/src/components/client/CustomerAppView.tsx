'use client'

import React, { useState } from 'react'
import { LiveRentalVehicle } from '@/lib/fleet-state'
import { BRAND } from '@/lib/config'
import {
  Car,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  ChevronDown,
  Bell,
  ArrowRight,
  Fuel,
  Gauge,
  Check,
  Star,
  Copy,
  ExternalLink,
  Edit3,
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
  // 'welcome' = Screen 1 (Welcome & Identity)
  // 'dashboard' = Screen 2 (Vehicle Card & Tracking)
  const [screen, setScreen] = useState<'welcome' | 'dashboard'>('welcome')

  // Per user request: ONLY the first shape shows initially.
  // Tracking info slides down smoothly when clicking "Suivi de cette location".
  const [isTrackingExpanded, setIsTrackingExpanded] = useState(false)

  // Google Review state
  const [isWritingReview, setIsWritingReview] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [reviewCopiedToast, setReviewCopiedToast] = useState(false)

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

  const firstName = activeClientName.split(' ')[0]

  const initials = activeClientName
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const days = 6
  const totalPrice = car.pricePerDay * days
  const formattedPrice = totalPrice.toLocaleString('fr-DZ')
  const periodText = car.rental?.startDate
    ? `${car.rental.startDate.split(' ')[0]} - ${car.rental.endDate.split(' ')[0]} oct.`
    : '18 - 24 oct.'
  const remainingText = car.rental?.remainingText || '4j 12h'
  const returnLocation = car.rental?.pickupLocation || "Aéroport Houari Boumediene (T4)"

  // Safe clipboard helper that works on iOS, mobile Safari, Chrome and desktop
  const handlePublishGoogleReview = () => {
    const textToCopy = reviewText.trim()
    if (textToCopy) {
      if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).catch(() => {})
      } else {
        try {
          const textArea = document.createElement('textarea')
          textArea.value = textToCopy
          textArea.style.position = 'fixed'
          textArea.style.left = '-999999px'
          textArea.style.top = '-999999px'
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()
          document.execCommand('copy')
          textArea.remove()
        } catch {}
      }
      setReviewCopiedToast(true)
      setTimeout(() => setReviewCopiedToast(false), 3500)
    }

    // Open real Google reviews URL in a new tab
    if (typeof window !== 'undefined') {
      window.open(BRAND.googleReviews, '_blank')
    }
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      style={{
        background: '#F7F5F0', // Clean warm ivory iOS background throughout
        color: '#1C1C1E',
        fontFamily: 'var(--font-heading), -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 1 : WELCOME & AUTOMATIC CLIENT IDENTIFICATION (IMAGE 1 STYLE)
          ══════════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 w-full h-full overflow-y-auto overscroll-contain transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between"
        style={{
          transform: screen === 'welcome' ? 'translateX(0%)' : 'translateX(-100%)',
          opacity: screen === 'welcome' ? 1 : 0,
          pointerEvents: screen === 'welcome' ? 'auto' : 'none',
          visibility: screen === 'welcome' ? 'visible' : 'hidden',
          WebkitOverflowScrolling: 'touch',
          background: '#F7F5F0',
        }}
      >
        <div>
          {/* Top Hero Image with Smooth Layered Gradient Overlay (Zero Rendering Glitches) */}
          <div className="relative w-full h-[250px] flex-shrink-0 overflow-hidden bg-[#F7F5F0]">
            <img
              src="/images/fleet-sunset.jpg"
              alt="Flotte DZ Rent Car au coucher du soleil"
              className="w-full h-full object-cover object-center"
            />
            {/* Smooth transition from photo to warm cream background */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(247,245,240,0) 30%, rgba(247,245,240,0.5) 60%, rgba(247,245,240,0.92) 85%, #F7F5F0 100%)',
              }}
            />
          </div>

          {/* Body Content below the fade */}
          <div className="px-6 -mt-8 relative z-10">
            {/* Brand Squircle Lockup */}
            <div className="flex items-center gap-3 mb-3.5">
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
            <p className="text-[13px] text-[#4B5563] leading-relaxed mb-4 font-normal">
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
        </div>

        {/* Bottom Actions with Smooth Transition Trigger */}
        <div className="px-6 pb-6 pt-2 space-y-3">
          <button
            type="button"
            onClick={() => setScreen('dashboard')}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#2DD4BF] hover:bg-[#14B8A6] active:scale-[0.98] text-[#042F2E] font-bold text-[15px] tracking-tight transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(45,212,191,0.35)] cursor-pointer"
          >
            <span>C&apos;est moi</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[11.5px] text-[#4B5563] font-medium py-1">
            <ShieldCheck className="w-4 h-4 text-[#0D6D70]" />
            <span>Session sécurisée · Clé digitale vérifiée</span>
          </div>

          <p className="text-[10px] text-center text-[#9CA3AF] leading-tight">
            DZ Rent Car · Remise aéroportuaire 24/7 sans formalité d&apos;attente.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 2 : STATS & REAL-TIME TRACKING DASHBOARD (NO TASK BAR)
          ══════════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 w-full h-full overflow-y-auto overscroll-contain transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between"
        style={{
          transform: screen === 'dashboard' ? 'translateX(0%)' : 'translateX(100%)',
          opacity: screen === 'dashboard' ? 1 : 0,
          pointerEvents: screen === 'dashboard' ? 'auto' : 'none',
          visibility: screen === 'dashboard' ? 'visible' : 'hidden',
          WebkitOverflowScrolling: 'touch',
          background: '#F7F5F0',
        }}
      >
        {/* Main Dashboard Content */}
        <div
          className="flex-1 px-5 pb-10"
          style={{
            paddingTop: isMockup ? '56px' : 'calc(env(safe-area-inset-top, 0px) + 20px)',
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

            {/* Right: Bell icon with unread dot + Client Avatar Initials */}
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

          {/* ── THE HERO VEHICLE SHAPE (NEW CLEAN ASYMMETRICAL STRUCTURE) ───────
              1. Removed 'en circulation' badge completely.
              2. Put the 3 lines in top taking its place (leaving middle spacious).
              3. The car image shines through cleanly in the middle.
              4. The 3 frosted glass chips and the button sit at bottom.
          ──────────────────────────────────────────────────────────────────────── */}
          <div
            className="relative w-full rounded-[26px] overflow-hidden shadow-xl mb-4 border border-black/[0.08] text-white"
            style={{
              minHeight: '250px',
              background: '#0F172A',
            }}
          >
            {/* Background Car Photo */}
            <img
              src={car.image}
              alt={car.name}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* Dark luxury gradient for maximum text contrast */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.2) 42%, rgba(10,15,25,0.95) 100%)',
              }}
            />

            {/* Card Interior Content */}
            <div className="relative z-10 p-4 flex flex-col justify-between min-h-[250px]">
              {/* ── TOP: The 3 lines taking the place of 'en circulation' ── */}
              <div>
                <div className="text-[9.5px] uppercase font-bold tracking-widest text-emerald-300 drop-shadow-sm mb-0.5">
                  Conducteur vérifié
                </div>
                <h3 className="text-[23px] font-black text-white tracking-tight leading-none drop-shadow-md">
                  {activeClientName}
                </h3>
                <div className="mt-1.5 inline-flex items-center gap-1.5 text-[10.5px] font-mono text-white/90 bg-black/40 px-2.5 py-0.5 rounded-md backdrop-blur-md border border-white/15">
                  <span>{car.plate}</span>
                  <span className="text-white/40">·</span>
                  <span className="text-emerald-300 font-sans font-semibold">{car.name}</span>
                </div>
              </div>

              {/* ── MIDDLE: Spacious open area showing the vehicle picture cleanly ── */}
              <div className="my-auto min-h-[35px]" />

              {/* ── BOTTOM: 3 Frosted Glass Shapes & 'Suivi de cette location' Button ── */}
              <div>
                <div className="grid grid-cols-3 gap-2 mb-2.5">
                  {/* Chip 1: Total */}
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-2 border border-white/20 text-center">
                    <div className="text-[9.5px] text-white/75 font-medium uppercase tracking-wider mb-0.5">
                      Tarif total
                    </div>
                    <div className="text-[11.5px] font-bold text-white tracking-tight leading-tight">
                      {formattedPrice} DA
                    </div>
                  </div>

                  {/* Chip 2: Period */}
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-2 border border-white/20 text-center">
                    <div className="text-[9.5px] text-white/75 font-medium uppercase tracking-wider mb-0.5">
                      Période
                    </div>
                    <div className="text-[11.5px] font-bold text-white tracking-tight leading-tight">
                      {periodText}
                    </div>
                  </div>

                  {/* Chip 3: Deposit */}
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-2 border border-white/20 text-center">
                    <div className="text-[9.5px] text-white/75 font-medium uppercase tracking-wider mb-0.5">
                      Caution
                    </div>
                    <div className="text-[11.5px] font-bold text-emerald-300 tracking-tight leading-tight">
                      Déposée
                    </div>
                  </div>
                </div>

                {/* Toggle Button: "Suivi de cette location" */}
                <button
                  type="button"
                  onClick={() => setIsTrackingExpanded(!isTrackingExpanded)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2DD4BF] hover:bg-[#14B8A6] active:scale-[0.98] text-[#042F2E] font-bold text-[13px] tracking-tight transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Gauge className="w-4 h-4 text-[#042F2E]" />
                  <span>Suivi de cette location</span>
                  <ChevronDown
                    className="w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      transform: isTrackingExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* ── TRACKING INFO SECTION (SLIDES DOWN SMOOTHLY AND SLOWLY WHEN CLICKED) ── */}
          <div
            className="transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden"
            style={{
              maxHeight: isTrackingExpanded ? '1400px' : '0px',
              opacity: isTrackingExpanded ? 1 : 0,
              transform: isTrackingExpanded ? 'translateY(0px)' : 'translateY(-12px)',
              pointerEvents: isTrackingExpanded ? 'auto' : 'none',
            }}
          >
            <div className="space-y-3 pt-1">
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
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        stroke="#E5E7EB"
                        strokeWidth="7"
                        fill="transparent"
                      />
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

              {/* ── 3. GOOGLE REVIEW SHAPE (AUTHENTIC GOOGLE BADGE & USER REVIEW WRITER) ── */}
              <div className="bg-white rounded-2xl p-4 border border-black/[0.06] shadow-sm transition-all duration-300">
                {/* Header Row: Google G icon, Rating and Review Count */}
                <div
                  onClick={() => setIsWritingReview(!isWritingReview)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {/* Authentic Multicolored Google G Icon */}
                    <div className="w-10 h-10 rounded-2xl bg-white border border-black/[0.08] shadow-sm flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    </div>

                    {/* Brand & Rating Details */}
                    <div>
                      <div className="text-[13px] font-bold text-[#111827] leading-none mb-1">
                        Avis Google · IZEM MOTORS
                      </div>
                      <div className="flex items-center gap-1.5 text-[11.5px]">
                        <span className="font-extrabold text-[#111827]">4,9</span>
                        <div className="flex items-center text-[#F59E0B]">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className="w-3 h-3 fill-[#F59E0B] stroke-[#F59E0B]"
                            />
                          ))}
                        </div>
                        <span className="text-[#6B7280] font-medium">(142 avis vérifiés)</span>
                      </div>
                    </div>
                  </div>

                  {/* Right button pill */}
                  <button
                    type="button"
                    className="px-2.5 py-1 rounded-full bg-[#E6F4F4] text-[#0D6D70] font-bold text-[11px] flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isWritingReview ? 'Fermer' : 'Noter'}</span>
                  </button>
                </div>

                {/* Interactive Review Writing Drawer */}
                {isWritingReview && (
                  <div className="mt-3.5 pt-3.5 border-t border-black/[0.06] space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#4B5563]">
                        Votre note globale :
                      </span>
                      {/* Interactive Star Picker */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="p-0.5 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= reviewRating
                                    ? 'fill-[#F59E0B] stroke-[#F59E0B]'
                                    : 'fill-transparent stroke-[#D1D5DB]'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Clean iOS Review Textarea */}
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={3}
                      placeholder="Écrivez votre avis ici (accueil à l'aéroport d'Alger, propreté du véhicule, ponctualité...)..."
                      className="w-full rounded-xl p-3 bg-[#F9FAFB] border border-black/[0.08] text-[12.5px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2DD4BF] focus:bg-white transition-all resize-none"
                    />

                    {/* Copy Toast Alert when published */}
                    {reviewCopiedToast && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11.5px] font-medium flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                        <span>Texte copié ! Collez-le simplement dans Google Maps.</span>
                      </div>
                    )}

                    {/* Actions: Terminé / Publier sur Google */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handlePublishGoogleReview}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-[#2DD4BF] hover:bg-[#14B8A6] active:scale-[0.98] text-[#042F2E] font-bold text-[12.5px] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Publier sur Google</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsWritingReview(false)}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 text-[#4B5563] font-medium text-[12px] hover:bg-slate-200 cursor-pointer"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Direct 24/7 Assistance Call Button */}
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
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useEffect, useState, useRef, use } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import QRCode from 'qrcode'
import {
  INITIAL_LIVE_FLEET,
  LiveRentalVehicle,
} from '@/lib/fleet-state'
import { CustomerAppView } from '@/components/client/CustomerAppView'
import {
  QrCode as QrIcon,
  ExternalLink,
  Copy,
  Check,
  Download,
  Printer,
  Sparkles,
  ChevronDown,
  User,
  Calendar,
  Wifi,
  ShieldCheck,
} from 'lucide-react'

export default function AdminCarQrPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const carId = parseInt(id, 10) || 1
  const router = useRouter()

  const [fleet, setFleet] = useState<LiveRentalVehicle[]>(INITIAL_LIVE_FLEET)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [isCarDropdownOpen, setIsCarDropdownOpen] = useState(false)
  const [baseUrl, setBaseUrl] = useState<string>('https://izem-motors.vercel.app')
  const carDropdownRef = useRef<HTMLDivElement>(null)

  // Load live fleet from localStorage or API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin)
      try {
        const raw = localStorage.getItem('izem_live_fleet')
        if (raw) {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFleet(parsed)
          }
        }
      } catch {}
    }
  }, [])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (carDropdownRef.current && !carDropdownRef.current.contains(event.target as Node)) {
        setIsCarDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentCar = fleet.find((c) => c.id === carId) || fleet[0]

  // Permanent target URL encoded in the static QR Code
  const targetUrl = `${baseUrl}/car/${currentCar.id}`

  // Generate transparent PNG QR code with pure white modules directly on qrbg
  useEffect(() => {
    QRCode.toDataURL(targetUrl, {
      width: 520,
      margin: 1,
      color: {
        dark: '#FFFFFF', // Pure white modules
        light: '#00000000', // Completely transparent background
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR generation error:', err))
  }, [targetUrl])

  const copyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(targetUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const downloadQrCode = () => {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = `QR-Voiture-${currentCar.id}-${currentCar.name.replace(/\s+/g, '-').toLowerCase()}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const isRented = currentCar.status === 'rented' && !!currentCar.rental?.clientName
  const activeClientName = isRented ? currentCar.rental!.clientName : 'Disponible au parc'

  // Scale calculation: Native iPhone 15 outer chassis is 414x868 (390x844 screen + 12px bezel).
  // Scaled by 0.603, it renders at exactly ~250px x 524px on desktop.
  const PHONE_SCALE = 0.603
  const PHONE_DISPLAY_WIDTH = Math.round(414 * PHONE_SCALE) // 250px
  const PHONE_DISPLAY_HEIGHT = Math.round(868 * PHONE_SCALE) // 523px

  return (
    <div className="max-w-[1400px] mx-auto px-2 sm:px-6 py-2 space-y-4">
      {/* ── TOP HEADER (CLEAN, NO BREADCRUMB) ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 m-0">
            <span className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
              <QrIcon className="w-4.5 h-4.5" />
            </span>
            QR Codes Statiques Flotte
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            QR code permanent pour chaque voiture. L&apos;interface smartphone s&apos;adapte automatiquement en direct.
          </p>
        </div>

        {/* Quick action: Open Client View */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            Ouvrir l&apos;écran client
          </a>
        </div>
      </div>

      {/* ── 2-COLUMN MAIN VIEW: CLOSER GAP & ELEVATED PHONE ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-start">
        {/* LEFT COLUMN: QR CODE CARD & ACTIONS (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
            {/* ── CARD HEADER: LEFT (CAR INFO & STATUS UNDER) · RIGHT (CAR SELECTOR) ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 pb-4.5 border-b border-slate-100">
              {/* Left: Car Title + Plate + Status badge placed directly UNDER car name */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Véhicule #{currentCar.id}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    {currentCar.plate}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate m-0">
                  {currentCar.name}
                </h2>

                {/* Status badge placed UNDER car name */}
                <div className="mt-2">
                  {isRented ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      En circulation
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11.5px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      Disponible au parc
                    </span>
                  )}
                </div>
              </div>

              {/* Right: The car choosing shape inside the card at far right */}
              <div ref={carDropdownRef} className="relative z-30 shrink-0 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => setIsCarDropdownOpen(!isCarDropdownOpen)}
                  className="flex items-center justify-between gap-3 px-3 py-2 rounded-2xl bg-[#F8FAFC] border border-slate-200 hover:border-slate-400 shadow-2xs transition-all text-left w-full sm:w-72 cursor-pointer"
                  style={{
                    borderColor: isCarDropdownOpen ? '#0F172A' : undefined,
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-11 h-7 rounded-lg overflow-hidden bg-slate-200 border border-slate-300/60 shrink-0">
                      <Image
                        src={currentCar.image}
                        alt={currentCar.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                        priority
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                        {currentCar.name}
                      </p>
                      <p className="text-[10.5px] text-slate-500 font-mono truncate">
                        {currentCar.plate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 pl-1 text-slate-500 shrink-0">
                    <span className="text-[10.5px] font-semibold text-slate-700">Changer</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isCarDropdownOpen ? 'rotate-180 text-slate-900' : 'text-slate-400'
                      }`}
                    />
                  </div>
                </button>

                {/* Dropdown Menu listing all fleet cars */}
                {isCarDropdownOpen && (
                  <div className="absolute top-[calc(100%+6px)] right-0 w-full sm:w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-1.5 z-50 animate-in fade-in-50 duration-150">
                    <div className="px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                      Sélectionner un véhicule ({fleet.length})
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      {fleet.map((car) => {
                        const isSelected = car.id === currentCar.id
                        const isCarRented = car.status === 'rented' && !!car.rental?.clientName

                        return (
                          <button
                            key={car.id}
                            type="button"
                            onClick={() => {
                              setIsCarDropdownOpen(false)
                              router.push(`/admin/qr/${car.id}`)
                            }}
                            className={`flex items-center justify-between w-full p-2 rounded-xl text-left transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-slate-900 text-white'
                                : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="relative w-9 h-6 rounded-md overflow-hidden bg-slate-100 shrink-0">
                                <Image
                                  src={car.image}
                                  alt={car.name}
                                  fill
                                  sizes="36px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <span className="text-xs font-bold truncate block leading-tight">
                                  {car.name}
                                </span>
                                <span
                                  className={`text-[10px] font-mono block ${
                                    isSelected ? 'text-white/70' : 'text-slate-400'
                                  }`}
                                >
                                  {car.plate}
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0 pl-2">
                              <span
                                className={`text-[9.5px] font-semibold px-1.5 py-0.5 rounded-full ${
                                  isSelected
                                    ? 'bg-white/20 text-white'
                                    : isCarRented
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {isCarRented ? 'Louée' : 'Libre'}
                              </span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── QR CODE FRAME: DIRECTLY ON QRBG, TRANSPARENT PNG, CENTERED, NO TEXT ── */}
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-7 py-1">
              {/* Square QR shape with qrbg.webp background and transparent white QR directly in perfect center */}
              <div
                className="relative shrink-0 rounded-3xl shadow-xl overflow-hidden flex items-center justify-center select-none"
                style={{
                  backgroundImage: "url('/images/qrbg.webp')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  width: 245,
                  height: 245,
                  boxShadow: '0 16px 36px -10px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06) inset',
                }}
              >
                {/* Transparent PNG QR code directly on bg with no white block, perfectly centered */}
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR Code Voiture #${currentCar.id}`}
                    className="w-48 h-48 object-contain filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-white/40">
                    <QrIcon className="w-12 h-12 animate-pulse" />
                  </div>
                )}
              </div>

              {/* Live Client Information Block */}
              <div className="flex-1 min-w-0 space-y-3.5 text-center sm:text-left w-full">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-left">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Conducteur actuel détecté
                  </span>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-700 shrink-0" />
                    <span className="text-base font-extrabold text-slate-900 truncate">
                      {activeClientName}
                    </span>
                  </div>
                  {isRented && currentCar.rental?.endDate && (
                    <div className="flex items-center gap-2 text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Restitution : <strong className="text-slate-800">{currentCar.rental.endDate}</strong></span>
                    </div>
                  )}
                </div>

                {/* Scannable Target URL with Copy Button */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Lien permanent encodé
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 p-2 bg-slate-100 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 truncate select-all">
                      {targetUrl}
                    </div>
                    <button
                      type="button"
                      onClick={copyLink}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs shrink-0 flex items-center gap-1.5 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                      <span>{copied ? 'Copié' : 'Copier'}</span>
                    </button>
                  </div>
                </div>

                {/* Actions: Download & Print */}
                <div className="flex items-center gap-2 pt-1 flex-wrap justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={downloadQrCode}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    Télécharger PNG
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    Imprimer le badge
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Subtle Dynamic Timeline Information Banner */}
          <div className="bg-emerald-50/60 rounded-3xl border border-emerald-200/80 p-3.5 flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs text-slate-700 space-y-0.5">
              <h4 className="font-bold text-emerald-950 text-xs sm:text-sm">
                QR Code 100% Statique & Permanent
              </h4>
              <p className="leading-relaxed">
                Le QR code reste identique et ne change jamais une fois imprimé sur le véhicule. Dès qu&apos;une réservation change dans <strong>Locations en cours</strong>, le smartphone affiche instantanément la nouvelle timeline du client.
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: PURE CSS IPHONE (390x844 VIEWPORT, CONCENTRIC 55/43 CORNERS, SCALED VIA TRANSFORM) ── */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-start justify-start">
          <div className="w-full max-w-[260px] space-y-2">
            {/* Top clean header */}
            <div className="flex items-center justify-between px-1">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500">
                Aperçu Smartphone
              </span>
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10.5px] font-bold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
              >
                Plein écran <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* ── PURE CSS IPHONE CONTAINER (SCALED TO FIT WITHOUT CONTENT SHRINKING) ── */}
            <div
              className="relative mx-auto select-none"
              style={{
                width: PHONE_DISPLAY_WIDTH,
                height: PHONE_DISPLAY_HEIGHT,
              }}
            >
              {/* Full-resolution Phone Chassis (414px x 868px) scaled via CSS transform */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 414,
                  height: 868,
                  transform: `scale(${PHONE_SCALE})`,
                  transformOrigin: 'top left',
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden',
                  /* 1. Outer Chassis: radius 55px, bezel 12px, subtle 1px inner border, soft top highlight */
                  borderRadius: 55,
                  padding: 12,
                  background: '#16191E',
                  boxShadow: `
                    0 0 0 1px rgba(255, 255, 255, 0.12) inset,
                    0 1px 0 0 rgba(255, 255, 255, 0.25) inset,
                    0 24px 48px -12px rgba(0, 0, 0, 0.32),
                    0 8px 16px -4px rgba(0, 0, 0, 0.15)
                  `,
                }}
              >
                {/* ── PHYSICAL HARDWARE BUTTONS (PURE CSS) ── */}
                {/* Left Side: Action Button */}
                <div
                  style={{
                    position: 'absolute',
                    left: -3.5,
                    top: 115,
                    width: 3.5,
                    height: 28,
                    background: '#2B2F38',
                    borderTopLeftRadius: 3,
                    borderBottomLeftRadius: 3,
                  }}
                />
                {/* Left Side: Volume Up */}
                <div
                  style={{
                    position: 'absolute',
                    left: -3.5,
                    top: 158,
                    width: 3.5,
                    height: 52,
                    background: '#2B2F38',
                    borderTopLeftRadius: 3,
                    borderBottomLeftRadius: 3,
                  }}
                />
                {/* Left Side: Volume Down */}
                <div
                  style={{
                    position: 'absolute',
                    left: -3.5,
                    top: 222,
                    width: 3.5,
                    height: 52,
                    background: '#2B2F38',
                    borderTopLeftRadius: 3,
                    borderBottomLeftRadius: 3,
                  }}
                />
                {/* Right Side: Power Button */}
                <div
                  style={{
                    position: 'absolute',
                    right: -3.5,
                    top: 175,
                    width: 3.5,
                    height: 75,
                    background: '#2B2F38',
                    borderTopRightRadius: 3,
                    borderBottomRightRadius: 3,
                  }}
                />

                {/* ── 2. SCREEN CONTAINER: REAL 390x844 VIEWPORT, RADIUS 43px, ISOLATION ISOLATE ── */}
                <div
                  style={{
                    position: 'relative',
                    width: 390,
                    height: 844,
                    borderRadius: 43,
                    overflow: 'hidden',
                    isolation: 'isolate',
                    background: '#F7F5F0',
                    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.08) inset',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* ── LIVE INTERACTIVE CUSTOMER APP VIEW ── */}
                  <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                    <CustomerAppView car={currentCar} isMockup={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

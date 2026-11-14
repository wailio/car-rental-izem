'use client'

import React, { useEffect, useState, useRef, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import QRCode from 'qrcode'
import {
  INITIAL_LIVE_FLEET,
  LiveRentalVehicle,
} from '@/lib/fleet-state'
import {
  QrCode as QrIcon,
  ExternalLink,
  Copy,
  Check,
  Download,
  Printer,
  Smartphone,
  Sparkles,
  ChevronRight,
  ChevronDown,
  User,
  Calendar,
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

  // Generate QR Code data URL
  useEffect(() => {
    QRCode.toDataURL(targetUrl, {
      width: 440,
      margin: 2,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
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

  return (
    <div className="max-w-[1400px] mx-auto px-2 sm:px-6 py-4 space-y-6">
      {/* ── TOP HEADER & BREADCRUMB ───────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/admin/dashboard" className="hover:text-slate-900 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/admin/sales" className="hover:text-slate-900 transition-colors">
              Locations en cours
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">QR Codes Flotte</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
              <QrIcon className="w-4.5 h-4.5" />
            </span>
            QR Codes Statiques Flotte
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            QR code permanent pour chaque voiture. L&apos;interface smartphone s&apos;adapte automatiquement en direct.
          </p>
        </div>

        {/* ── SINGLE CAR SELECTOR SHAPE (EXACT SAME AS CALENDAR) ─────── */}
        <div ref={carDropdownRef} className="relative z-30 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setIsCarDropdownOpen(!isCarDropdownOpen)}
            className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-400 shadow-2xs transition-all text-left w-full md:w-80 cursor-pointer"
            style={{
              borderColor: isCarDropdownOpen ? '#0F172A' : undefined,
            }}
          >
            {/* Car Photo Thumbnail + Info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-12 h-8 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/70 shrink-0">
                <Image
                  src={currentCar.image}
                  alt={currentCar.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                    {currentCar.name}
                  </p>
                  <span
                    className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded ${
                      isRented
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    #{currentCar.id}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                  {currentCar.plate}
                </p>
              </div>
            </div>

            {/* Change trigger */}
            <div className="flex items-center gap-1 pl-2 text-slate-500 shrink-0">
              <span className="text-[11px] font-semibold text-slate-700 hidden sm:inline">Changer</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isCarDropdownOpen ? 'rotate-180 text-slate-900' : 'text-slate-400'
                }`}
              />
            </div>
          </button>

          {/* Dropdown Menu listing all fleet cars */}
          {isCarDropdownOpen && (
            <div className="absolute top-[calc(100%+6px)] right-0 md:left-auto w-full md:w-84 bg-white rounded-2xl border border-slate-200 shadow-xl p-1.5 z-50 animate-in fade-in-50 duration-150">
              <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                Choisir un véhicule ({fleet.length} voitures)
              </div>
              <div className="max-h-72 overflow-y-auto space-y-1">
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
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative w-10 h-7 rounded-md overflow-hidden bg-slate-100 shrink-0">
                          <Image
                            src={car.image}
                            alt={car.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold truncate leading-tight">
                              {car.name}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1 rounded ${
                                isSelected
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              #{car.id}
                            </span>
                          </div>
                          <p
                            className={`text-[10.5px] font-mono truncate mt-0.5 ${
                              isSelected ? 'text-white/70' : 'text-slate-400'
                            }`}
                          >
                            {car.plate}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : isCarRented
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {isCarRented ? 'En cours' : 'Libre'}
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

      {/* ── MAIN 2-COLUMN LAYOUT: SPACIOUS & FIT TO SCREEN ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start pt-1">
        {/* LEFT COLUMN: QR CODE CARD & ACTIONS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main White Card with generous padding & calm aesthetic */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Top row of card: Vehicle Name & Live Status */}
            <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-400">
                    Véhicule #{currentCar.id}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    {currentCar.plate}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                  {currentCar.name}
                </h2>
              </div>

              <div className="shrink-0">
                {isRented ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    En circulation
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    Disponible au parc
                  </span>
                )}
              </div>
            </div>

            {/* QR Code Presentation Frame with comfortable breathing room */}
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 py-2">
              <div className="relative shrink-0 p-4 bg-white rounded-2xl border-2 border-slate-900/10 shadow-sm flex flex-col items-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR Code Voiture #${currentCar.id}`}
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-48 h-48 sm:w-56 sm:h-56 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                    <QrIcon className="w-10 h-10 animate-pulse" />
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2 text-[11px] font-mono font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Scanner avec l&apos;appareil photo</span>
                </div>
              </div>

              {/* Live Client Information Block */}
              <div className="flex-1 min-w-0 space-y-4 text-center sm:text-left">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-left">
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
                <div className="space-y-1.5 text-left">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
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
                <div className="flex items-center gap-2.5 pt-1 flex-wrap justify-center sm:justify-start">
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                    Tester dans le navigateur
                  </a>
                  <button
                    type="button"
                    onClick={downloadQrCode}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    Télécharger PNG
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    Imprimer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Subtle Dynamic Timeline Information Banner */}
          <div className="bg-emerald-50/60 rounded-3xl border border-emerald-200/80 p-4.5 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-700 space-y-1">
              <h4 className="font-bold text-emerald-950 text-xs sm:text-sm">
                QR Code 100% Statique & Permanent
              </h4>
              <p className="leading-relaxed">
                Le QR code reste identique et ne change jamais une fois imprimé sur le véhicule. Dès qu&apos;une réservation change ou se termine dans <strong>Locations en cours</strong>, le smartphone affiche instantanément la nouvelle timeline du client.
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: FULL IPHONE 18 SHAPE (NO SCROLLING) ───────── */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-start">
          <div className="w-full max-w-[300px] space-y-2.5">
            {/* Top label above phone */}
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Aperçu Smartphone (iPhone 18)
              </span>
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
              >
                Plein écran <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* ── IPHONE 18 TITANIUM SHAPE (Sleek ultra-thin bezels, fits screen) ── */}
            <div
              className="relative mx-auto w-full aspect-[9/18.6] max-h-[530px] rounded-[48px] bg-slate-950 p-2.5 shadow-[0_22px_60px_-15px_rgba(0,0,0,0.4)] border-[3.5px] border-slate-700/80 ring-1 ring-white/10 overflow-hidden flex flex-col select-none"
              style={{
                boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.08) inset',
              }}
            >
              {/* iPhone 18 Titanium Action Button on Left Side */}
              <div className="absolute -left-[3.5px] top-24 w-[3.5px] h-7 bg-slate-600 rounded-l" />
              {/* iPhone 18 Volume Buttons on Left Side */}
              <div className="absolute -left-[3.5px] top-36 w-[3.5px] h-11 bg-slate-600 rounded-l" />
              <div className="absolute -left-[3.5px] top-50 w-[3.5px] h-11 bg-slate-600 rounded-l" />
              {/* iPhone 18 Power Button on Right Side */}
              <div className="absolute -right-[3.5px] top-32 w-[3.5px] h-14 bg-slate-600 rounded-r" />

              {/* iPhone 18 Futuristic Minimal Dynamic Island */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-18 h-4 bg-black rounded-full z-30 pointer-events-none flex items-center justify-end pr-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
              </div>

              {/* Screen Glass Reflection Sheen */}
              <div
                className="absolute inset-0 pointer-events-none z-20 rounded-[40px] opacity-40"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 35%, transparent 60%)',
                }}
              />

              {/* iPhone 18 Display Screen (iOS Blur + Direct Text) */}
              <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-slate-950 flex flex-col justify-between p-4 text-white">
                {/* Background Car Image with iOS Blur */}
                <img
                  src={currentCar.image}
                  alt={currentCar.name}
                  className="absolute inset-0 w-full h-full object-cover object-center filter blur-[5px] brightness-[0.32] scale-110 pointer-events-none"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 35%, rgba(15,23,42,0.08) 0%, rgba(15,23,42,0.65) 75%, rgba(10,15,30,0.92) 100%)',
                  }}
                />

                {/* Top Status Bar & Identity */}
                <div className="relative z-10 pt-5 flex items-center justify-between text-white/80">
                  <span className="text-[9px] uppercase tracking-[0.16em] font-light">
                    DZ RENT CAR
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold border backdrop-blur-md ${
                      isRented
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                        : 'bg-white/10 text-white/80 border-white/20'
                    }`}
                  >
                    {isRented ? 'En circulation' : 'Libre au parc'}
                  </span>
                </div>

                {/* Center / Hero: Thin & Thick Typography */}
                <div className="relative z-10 my-auto py-3">
                  <span className="text-[9.5px] uppercase tracking-[0.2em] text-white/70 font-light block mb-1">
                    Conducteur Enregistré
                  </span>
                  <h3
                    className="text-2xl font-black text-white tracking-tight leading-tight m-0"
                    style={{ textShadow: '0 4px 16px rgba(0,0,0,0.65)' }}
                  >
                    {activeClientName}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="font-light text-white/85 text-[11.5px]">{currentCar.name}</span>
                    <span className="text-white/30">·</span>
                    <span className="font-mono font-bold text-[10px] bg-white/10 px-1.5 py-0.5 rounded border border-white/20">
                      {currentCar.plate}
                    </span>
                  </div>
                </div>

                {/* Bottom Signature */}
                <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[8.5px] text-white/40">
                  <span>Voiture #{currentCar.id}</span>
                  <span>Session active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

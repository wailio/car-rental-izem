'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
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
  Info,
  Car,
  ChevronRight,
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
  const [mounted, setMounted] = useState(false)
  const [baseUrl, setBaseUrl] = useState<string>('https://izem-motors.vercel.app')

  // Load live fleet from localStorage or API
  useEffect(() => {
    setMounted(true)
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

  const currentCar = fleet.find((c) => c.id === carId) || fleet[0]

  // The permanent target URL encoded in the static QR Code
  // e.g. https://izem-motors.vercel.app/car/1
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
    <div className="space-y-6 pb-20">
      {/* ── TOP HEADER & BREADCRUMB ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
              <QrIcon className="w-5 h-5" />
            </span>
            Codes QR Statiques · Véhicule #{currentCar.id}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Chaque voiture dispose d&apos;un QR code permanent. L&apos;interface client s&apos;adapte automatiquement en temps réel.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            {copied ? 'Lien copié !' : 'Copier le lien'}
          </button>
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-white/80" />
            Tester l&apos;interface client
          </a>
        </div>
      </div>

      {/* ── FLEET VEHICLE TABS (1 to N) ───────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            Sélectionner un véhicule de la flotte ({fleet.length} voitures)
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            URL directe : /admin/qr/[1..{fleet.length}]
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {fleet.map((car) => {
            const isSelected = car.id === currentCar.id
            const isCarRented = car.status === 'rented' && !!car.rental?.clientName

            return (
              <Link
                key={car.id}
                href={`/admin/qr/${car.id}`}
                className={`group relative p-3 rounded-2xl border transition-all text-left flex flex-col justify-between select-none ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-1.5 mb-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    #{car.id}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 mt-1 ${
                      isCarRented ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                    title={isCarRented ? 'En location' : 'Disponible'}
                  />
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs font-bold truncate leading-tight">
                    {car.name}
                  </h4>
                  <p
                    className={`text-[10.5px] font-mono truncate mt-0.5 ${
                      isSelected ? 'text-white/70' : 'text-slate-400'
                    }`}
                  >
                    {car.plate}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-current/10">
                  <span
                    className={`text-[10px] font-semibold truncate block ${
                      isSelected ? 'text-emerald-300' : isCarRented ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {isCarRented ? car.rental?.clientName : 'Libre au parc'}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── MAIN CONTENT GRID: QR CODE CARD + PHONE PREVIEW ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: QR Code Badge & Details (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Scannable QR Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              {/* QR Code Graphic Frame */}
              <div className="relative shrink-0 p-4 bg-white rounded-2xl border-2 border-slate-900/10 shadow-sm flex flex-col items-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR Code Voiture #${currentCar.id} ${currentCar.name}`}
                    className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-56 h-56 sm:w-64 sm:h-64 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                    <QrIcon className="w-12 h-12 animate-pulse" />
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2 text-[11px] font-mono font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Scanner avec l&apos;appareil photo</span>
                </div>
              </div>

              {/* Vehicle & Real-time Client Specs */}
              <div className="flex-1 min-w-0 space-y-4 text-center sm:text-left">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 mb-2">
                    <Car className="w-3.5 h-3.5" />
                    Voiture #{currentCar.id} de la flotte
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                    {currentCar.name}
                  </h2>
                  <p className="text-xs sm:text-sm font-mono font-bold text-slate-500 mt-1">
                    Plaque : <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{currentCar.plate}</span>
                  </p>
                </div>

                {/* Current Client Status in System */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-left">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Client actuellement détecté dans le système
                  </span>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-700 shrink-0" />
                    <span className="text-sm font-black text-slate-900 truncate">
                      {activeClientName}
                    </span>
                  </div>
                  {isRented && currentCar.rental?.endDate && (
                    <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Fin de location : <strong>{currentCar.rental.endDate}</strong></span>
                    </div>
                  )}
                </div>

                {/* Target Link preview */}
                <div className="space-y-1 text-left">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                    URL encodée dans le QR Code
                  </label>
                  <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 truncate select-all">
                    <span className="truncate">{targetUrl}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-1 flex-wrap justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={downloadQrCode}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    Télécharger PNG
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    Imprimer le badge
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feature explaination card */}
          <div className="bg-emerald-50/60 rounded-3xl border border-emerald-200/80 p-5 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-700 space-y-1">
              <h4 className="font-bold text-emerald-950 text-sm">
                Fonctionnement dynamique du QR Code
              </h4>
              <p className="leading-relaxed">
                Le QR code de chaque véhicule est <strong>statique et permanent</strong> (vous pouvez l&apos;imprimer et le coller une seule fois sur le pare-brise ou le tableau de bord). Lorsque vous validez une nouvelle réservation ou assignez un client dans <strong>Locations en cours</strong>, le téléphone du client affiche instantanément son propre nom sans avoir besoin de réimprimer le QR code.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Phone Simulation Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Aperçu écran client (Smartphone)
              </span>
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
              >
                Ouvrir plein écran <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Realistic iPhone Bezel Mockup */}
            <div className="relative mx-auto w-full aspect-[9/18.5] max-h-[620px] rounded-[44px] bg-slate-950 p-3 shadow-2xl border-[6px] border-slate-800 ring-1 ring-slate-900/50 overflow-hidden flex flex-col">
              {/* iPhone Dynamic Island */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 pointer-events-none flex items-center justify-end pr-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
              </div>

              {/* Phone Screen Container with iOS blur & direct text */}
              <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-slate-950 flex flex-col justify-between p-4 text-white select-none">
                {/* Blurred Car Background */}
                <img
                  src={currentCar.image}
                  alt={currentCar.name}
                  className="absolute inset-0 w-full h-full object-cover object-center filter blur-[5px] brightness-[0.32] scale-110 pointer-events-none"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 40%, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.65) 75%, rgba(10,15,30,0.92) 100%)',
                  }}
                />

                {/* Top Status */}
                <div className="relative z-10 pt-6 flex items-center justify-between text-white/80">
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
                <div className="relative z-10 my-auto py-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-light block mb-1">
                    Conducteur Enregistré
                  </span>
                  <h3
                    className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight m-0"
                    style={{ textShadow: '0 4px 16px rgba(0,0,0,0.6)' }}
                  >
                    {activeClientName}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="font-light text-white/80">{currentCar.name}</span>
                    <span className="text-white/30">·</span>
                    <span className="font-mono font-bold text-[10.5px] bg-white/10 px-1.5 py-0.5 rounded border border-white/20">
                      {currentCar.plate}
                    </span>
                  </div>
                </div>

                {/* Bottom Signature */}
                <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-white/40">
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

'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { INITIAL_LIVE_FLEET, LiveRentalVehicle } from '@/lib/fleet-state'
import { ShieldCheck, Sparkles, Car } from 'lucide-react'

export default function CustomerCarInterfacePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const carId = parseInt(id, 10) || 1

  const [car, setCar] = useState<LiveRentalVehicle | null>(() => {
    return INITIAL_LIVE_FLEET.find((c) => c.id === carId) || INITIAL_LIVE_FLEET[0]
  })
  const [mounted, setMounted] = useState(false)

  // Sync with live fleet from localStorage or API
  useEffect(() => {
    setMounted(true)

    const syncCarData = () => {
      try {
        const raw = localStorage.getItem('izem_live_fleet')
        if (raw) {
          const fleet: LiveRentalVehicle[] = JSON.parse(raw)
          const found = fleet.find((c) => c.id === carId)
          if (found) {
            setCar(found)
            return
          }
        }
      } catch {}

      // Fallback: fetch from /api/fleet
      fetch(`/api/fleet?id=${carId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.id) setCar(data)
        })
        .catch(() => {})
    }

    syncCarData()

    // Listen to storage events (if modified on same device in another tab)
    window.addEventListener('storage', syncCarData)
    // Periodic refresh every 4 seconds to reflect timeline changes
    const interval = setInterval(syncCarData, 4000)

    return () => {
      window.removeEventListener('storage', syncCarData)
      clearInterval(interval)
    }
  }, [carId])

  if (!car) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center">
        <div>
          <Car className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-1">Véhicule introuvable</h2>
          <p className="text-sm text-slate-400 mb-4">Ce QR code ne correspond à aucun véhicule de la flotte.</p>
          <Link href="/" className="text-xs text-emerald-400 underline">Retour à l&apos;accueil</Link>
        </div>
      </div>
    )
  }

  const isRented = car.status === 'rented' && !!car.rental?.clientName
  const clientName = isRented ? car.rental!.clientName : 'Véhicule Disponible'

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex flex-col justify-between p-5 sm:p-8 select-none"
      style={{
        WebkitFontSmoothing: 'antialiased',
        fontFamily: 'var(--font-heading)',
      }}
    >
      {/* ── BACKGROUND CAR IMAGE WITH IOS BLUR ────────────────────────── */}
      {/* Exact style from Locations en cours / Fiche Véhicule & Attribution */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover object-center filter blur-[6px] sm:blur-[8px] brightness-[0.32] scale-110 transition-all duration-700"
        />
        {/* Subtle iOS Vignette Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 40%, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.65) 75%, rgba(10,15,30,0.92) 100%)',
          }}
        />
      </div>

      {/* ── TOP HEADER / BRAND & STATUS ───────────────────────────────── */}
      <header className="relative z-10 w-full flex items-center justify-between gap-3 pt-2">
        {/* Brand identity: Thin uppercase tracking */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <div>
            <span
              className="text-[11px] uppercase tracking-[0.2em] text-white/70 block"
              style={{ fontWeight: 300 }}
            >
              DZ RENT CAR
            </span>
            <span
              className="text-[9px] uppercase tracking-[0.14em] text-white/45 block"
              style={{ fontWeight: 400 }}
            >
              Service Client Connecté
            </span>
          </div>
        </div>

        {/* Dynamic iOS Status Pill */}
        <div className="flex items-center">
          {isRented ? (
            <span
              className="px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md transition-all shadow-xs"
              style={{
                background: 'rgba(16, 185, 129, 0.22)',
                color: '#6EE7B7',
                borderColor: 'rgba(16, 185, 129, 0.4)',
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.25)',
              }}
            >
              En circulation
            </span>
          ) : (
            <span
              className="px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                color: 'rgba(255, 255, 255, 0.85)',
                borderColor: 'rgba(255, 255, 255, 0.22)',
              }}
            >
              Au parc · Prêt
            </span>
          )}
        </div>
      </header>

      {/* ── CENTER / HERO: CLIENT NAME IN THIN / THICK FONT ───────────── */}
      <div className="relative z-10 my-auto py-10 flex flex-col items-start justify-center max-w-xl">
        {/* Subtitle in ultra-thin tracking */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[12px] sm:text-[13px] uppercase tracking-[0.24em] text-white/70"
            style={{ fontWeight: 300 }}
          >
            {isRented ? 'Conducteur Enregistré' : 'Disponibilité Actuelle'}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
        </div>

        {/* Client Name: Luxurious, Big, Thick typography with drop-shadow */}
        <h1
          className="text-white tracking-tight leading-[1.05] drop-shadow-lg m-0 select-text"
          style={{
            fontSize: 'clamp(2.4rem, 8.5vw, 4.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            textShadow: '0 6px 24px rgba(0, 0, 0, 0.6)',
          }}
        >
          {clientName}
        </h1>

        {/* Car Name & Plate: Thin & Thick balance */}
        <div
          className="mt-5 flex items-center gap-3 flex-wrap"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <span
            className="text-white/90 text-base sm:text-lg"
            style={{ fontWeight: 300, letterSpacing: '-0.01em' }}
          >
            {car.name}
          </span>
          <span className="text-white/30">·</span>
          <span
            className="font-mono text-xs sm:text-[13px] tracking-wider text-white px-2.5 py-0.5 rounded-md backdrop-blur-md"
            style={{
              fontWeight: 800,
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
            }}
          >
            {car.plate}
          </span>
        </div>

        {/* Small verified assurance note */}
        <div className="mt-8 flex items-center gap-2 text-white/60 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span style={{ fontWeight: 300 }}>
            Session active vérifiée · Flotte officielle DZ Rent Car
          </span>
        </div>
      </div>

      {/* ── BOTTOM FOOTER: SIMPLE MINIMAL IOS SIGNATURE ───────────────── */}
      <footer className="relative z-10 w-full pt-4 border-t border-white/10 flex items-center justify-between gap-3 text-[11px] text-white/50">
        <span style={{ fontWeight: 300 }}>
          Véhicule #{car.id} de la flotte
        </span>
        <span style={{ fontWeight: 400 }}>
          DZ RENT CAR © 2026
        </span>
      </footer>
    </main>
  )
}

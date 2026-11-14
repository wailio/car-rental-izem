'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { INITIAL_LIVE_FLEET, LiveRentalVehicle } from '@/lib/fleet-state'
import { CustomerAppView } from '@/components/client/CustomerAppView'
import { Car } from 'lucide-react'

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

    window.addEventListener('storage', syncCarData)
    const interval = setInterval(syncCarData, 4000)

    return () => {
      window.removeEventListener('storage', syncCarData)
      clearInterval(interval)
    }
  }, [carId])

  if (!car) {
    return (
      <div className="min-h-screen bg-[#F6F4EE] text-[#111827] flex items-center justify-center p-6 text-center">
        <div>
          <Car className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-1">Véhicule introuvable</h2>
          <p className="text-sm text-slate-500 mb-4">Ce QR code ne correspond à aucun véhicule de la flotte.</p>
          <Link href="/" className="text-xs text-[#0D6D70] font-bold underline">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen w-full bg-[#F7F5F0] flex items-center justify-center">
      <div className="w-full sm:max-w-[430px] h-[100dvh] min-h-[100dvh] overflow-hidden relative bg-[#F7F5F0] flex flex-col sm:shadow-2xl sm:border sm:border-black/10">
        <CustomerAppView car={car} />
      </div>
    </main>
  )
}

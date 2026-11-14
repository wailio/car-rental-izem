import { NextRequest, NextResponse } from 'next/server'
import { INITIAL_LIVE_FLEET, LiveRentalVehicle } from '@/lib/fleet-state'

// Server memory cache for live fleet sessions
let serverFleetState: LiveRentalVehicle[] = [...INITIAL_LIVE_FLEET]

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const idParam = searchParams.get('id')

  if (idParam) {
    const id = parseInt(idParam, 10)
    const car = serverFleetState.find((c) => c.id === id) || INITIAL_LIVE_FLEET.find((c) => c.id === id)
    if (!car) {
      return NextResponse.json({ error: 'Véhicule non trouvé' }, { status: 404 })
    }
    return NextResponse.json(car)
  }

  return NextResponse.json(serverFleetState)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (Array.isArray(body) && body.length > 0) {
      serverFleetState = body
      return NextResponse.json({ success: true, count: serverFleetState.length })
    }

    // Single car update
    if (body && typeof body.id === 'number') {
      const idx = serverFleetState.findIndex((c) => c.id === body.id)
      if (idx !== -1) {
        serverFleetState[idx] = { ...serverFleetState[idx], ...body }
      } else {
        serverFleetState.push(body)
      }
      return NextResponse.json({ success: true, car: serverFleetState[idx] })
    }

    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}

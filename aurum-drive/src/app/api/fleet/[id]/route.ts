import { NextRequest, NextResponse } from 'next/server'
import { INITIAL_LIVE_FLEET } from '@/lib/fleet-state'

export const runtime = 'nodejs'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const carId = parseInt(id, 10)
  const car = INITIAL_LIVE_FLEET.find((c) => c.id === carId)

  if (!car) {
    return NextResponse.json({ error: 'Véhicule non trouvé' }, { status: 404 })
  }

  return NextResponse.json(car)
}

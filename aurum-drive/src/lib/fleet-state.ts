export interface LiveRentalVehicle {
  id: number
  name: string
  plate: string
  image: string
  pricePerDay: number
  status: 'rented' | 'available'
  rental?: {
    clientName: string
    phone: string
    startDate: string
    endDate: string
    totalHours: number
    remainingHours: number
    remainingText: string
    pickupLocation: string
  }
  nextInLine?: {
    clientName: string
    phone: string
    dates: string
    startDate: string
    endDate: string
    pickupLocation: string
    orderId?: string
  }
}

export const INITIAL_LIVE_FLEET: LiveRentalVehicle[] = [
  {
    id: 1,
    name: 'Audi A3 Sportback',
    plate: '01892-126-16',
    image: '/cars/audi-a3-sportback.jpg',
    pricePerDay: 22000,
    status: 'rented',
    rental: {
      clientName: 'Karim Benali',
      phone: '0550 12 34 56',
      startDate: '18 oct. 2026',
      endDate: '24 oct. 2026 à 18:00',
      totalHours: 144,
      remainingHours: 108,
      remainingText: '4j 12h',
      pickupLocation: 'Aéroport Houari Boumediene (T4)',
    },
  },
  {
    id: 2,
    name: 'MG 7 Fastback',
    plate: '04899-126-16',
    image: '/cars/mg-7.png',
    pricePerDay: 26000,
    status: 'available',
  },
  {
    id: 3,
    name: 'Volkswagen T-Cross',
    plate: '03411-125-16',
    image: '/cars/volkswagen-t-cross.jpg',
    pricePerDay: 17000,
    status: 'rented',
    rental: {
      clientName: 'Yacine Mansouri',
      phone: '0661 88 92 14',
      startDate: '19 oct. 2026',
      endDate: '23 oct. 2026 à 14:00',
      totalHours: 96,
      remainingHours: 24,
      remainingText: '24h',
      pickupLocation: 'Aéroport Alger (Terminal 1)',
    },
  },
  {
    id: 4,
    name: 'Geely Coolray Sport',
    plate: '08345-125-16',
    image: '/cars/geely-coolray.jpg',
    pricePerDay: 15000,
    status: 'rented',
    rental: {
      clientName: 'Amine Zerrouk',
      phone: '0662 33 44 55',
      startDate: '20 oct. 2026',
      endDate: '27 oct. 2026 à 18:00',
      totalHours: 168,
      remainingHours: 164,
      remainingText: '6j 20h',
      pickupLocation: 'Aéroport Houari Boumediene (T4)',
    },
  },
  {
    id: 5,
    name: 'Kia Sonet Crossover',
    plate: '05122-125-16',
    image: '/cars/kia-sonet.jpg',
    pricePerDay: 12000,
    status: 'available',
  },
  {
    id: 6,
    name: 'MG 5 Berline',
    plate: '03788-124-16',
    image: '/cars/mg-5.jpg',
    pricePerDay: 10500,
    status: 'rented',
    rental: {
      clientName: 'Farid Khelifi',
      phone: '0770 45 67 89',
      startDate: '17 oct. 2026',
      endDate: '22 oct. 2026 à 12:00',
      totalHours: 120,
      remainingHours: 16,
      remainingText: '16h',
      pickupLocation: 'Aéroport Alger (Hall Arrivées)',
    },
  },
  {
    id: 7,
    name: 'Geely GX3 Pro',
    plate: '06214-124-16',
    image: '/cars/geely-gx3-pro.jpg',
    pricePerDay: 8500,
    status: 'available',
  },
]

export const FLEET_STORAGE_KEY = 'izem_live_fleet'

/**
 * Returns current fleet by reading localStorage in client, or falling back to default master data.
 */
export function getLiveFleetClient(): LiveRentalVehicle[] {
  if (typeof window === 'undefined') return INITIAL_LIVE_FLEET
  try {
    const raw = localStorage.getItem(FLEET_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return INITIAL_LIVE_FLEET
}

/**
 * Find car by numeric ID (1 to N)
 */
export function getCarByIdClient(id: number): LiveRentalVehicle | undefined {
  const fleet = getLiveFleetClient()
  return fleet.find((c) => c.id === id) || INITIAL_LIVE_FLEET.find((c) => c.id === id)
}

'use client'

export const runtime = 'edge'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Car,
  Clock,
  Phone,
  MessageCircle,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Search,
  Filter,
  Plus,
  X,
  SlidersHorizontal,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Percent,
  Check,
  RotateCcw,
} from 'lucide-react'

// ── Types ───────────────────────────────────────────────────────────────────

export type BookingStatus = 'active' | 'confirmed' | 'pending' | 'completed' | 'maintenance'

export interface CalendarBooking {
  id: string
  carId: number
  clientNumber: number // Sequential client number (e.g. 101, 102...)
  clientName: string
  phone: string
  startDate: string    // YYYY-MM-DD
  endDate: string      // YYYY-MM-DD
  status: BookingStatus
  location: string
  totalAmount: number  // DA
  deposit: number      // DA
  flightNumber?: string
  notes?: string
}

export interface FleetVehicle {
  id: number
  name: string
  brand: string
  category: string
  plate: string
  pricePerDay: number
  image: string
  specs: string
  gearbox: string
  status: 'rented' | 'available' | 'maintenance'
}

// ── Fleet Master Data ───────────────────────────────────────────────────────

const FLEET_VEHICLES: FleetVehicle[] = [
  {
    id: 1,
    name: 'Audi A3 Sportback',
    brand: 'Audi',
    category: 'Berline compacte premium',
    plate: '01892-126-16',
    pricePerDay: 22000,
    image: '/cars/audi-a3-sportback.jpg',
    specs: 'Automatique · Essence · 5 places · 150 ch',
    gearbox: 'Automatique S-Tronic',
    status: 'rented',
  },
  {
    id: 2,
    name: 'MG 7 Fastback',
    brand: 'MG',
    category: 'Berline sportive haut de gamme',
    plate: '04899-126-16',
    pricePerDay: 26000,
    image: '/cars/mg-7.png',
    specs: 'Automatique · Essence · 5 places · 261 ch',
    gearbox: 'Automatique 9 rapports',
    status: 'available',
  },
  {
    id: 3,
    name: 'Volkswagen T-Cross',
    brand: 'Volkswagen',
    category: 'SUV compact',
    plate: '03411-125-16',
    pricePerDay: 17000,
    image: '/cars/volkswagen-t-cross.jpg',
    specs: 'Automatique · Essence · 5 places · 110 ch',
    gearbox: 'Automatique DSG',
    status: 'rented',
  },
  {
    id: 4,
    name: 'Geely Coolray Sport',
    brand: 'Geely',
    category: 'Crossover compact',
    plate: '02812-124-16',
    pricePerDay: 15000,
    image: '/cars/geely-coolray.jpg',
    specs: 'Automatique · Essence · 5 places · 174 ch',
    gearbox: 'Double embrayage 7 rapports',
    status: 'rented',
  },
  {
    id: 5,
    name: 'Kia Sonet Crossover',
    brand: 'Kia',
    category: 'Crossover urbain',
    plate: '05122-125-16',
    pricePerDay: 12000,
    image: '/cars/kia-sonet.jpg',
    specs: 'Automatique · Essence · 5 places · 115 ch',
    gearbox: 'Automatique IVT',
    status: 'available',
  },
  {
    id: 6,
    name: 'MG 5 Berline',
    brand: 'MG',
    category: 'Berline familiale',
    plate: '03788-124-16',
    pricePerDay: 10500,
    image: '/cars/mg-5.jpg',
    specs: 'Automatique · Essence · 5 places · 115 ch',
    gearbox: 'Automatique CVT',
    status: 'rented',
  },
  {
    id: 7,
    name: 'Geely GX3 Pro',
    brand: 'Geely',
    category: 'Crossover économique',
    plate: '06214-124-16',
    pricePerDay: 8500,
    image: '/cars/geely-gx3-pro.jpg',
    specs: 'Automatique · Essence · 5 places · 102 ch',
    gearbox: 'Automatique CVT',
    status: 'available',
  },
]

// ── Realistic seed clients for schedule across 2 years ──────────────────────

const CLIENT_ROSTER = [
  { name: 'Karim Benali', phone: '0550 12 34 56', location: 'Aéroport Houari Boumediene (T4)' },
  { name: 'Dr. Amina Dahmani', phone: '0771 99 88 77', location: 'Aéroport Alger (Hall Arrivées)' },
  { name: 'Sofiane Kaci', phone: '0560 11 22 33', location: 'Aéroport Houari Boumediene (T4)' },
  { name: 'Mourad Belkacem', phone: '0552 44 66 88', location: 'Livraison Aéroport (Terminal Ouest)' },
  { name: 'Yacine Mansouri', phone: '0661 88 92 14', location: 'Aéroport Alger (Terminal 1)' },
  { name: 'Amine Zerrouk', phone: '0662 33 44 55', location: 'Aéroport Houari Boumediene (T4)' },
  { name: 'Farid Khelifi', phone: '0770 45 67 89', location: 'Aéroport Alger (Hall Arrivées)' },
  { name: 'Walid Bouzid', phone: '0555 78 90 12', location: 'Aéroport Houari Boumediene (T4)' },
  { name: 'Tariq Haddad', phone: '0660 33 22 11', location: 'Hôtel Sheraton Club des Pins' },
  { name: 'Bilal Amrani', phone: '0778 12 45 67', location: 'Aéroport Alger (Terminal 1)' },
  { name: 'Nassima Cherif', phone: '0540 66 77 88', location: 'Aéroport Houari Boumediene (T4)' },
  { name: 'Rachid Mebarki', phone: '0661 22 44 66', location: 'Centre-ville Alger / Didouche' },
  { name: 'Samir Zouaoui', phone: '0558 90 12 34', location: 'Aéroport Alger (Terminal Ouest)' },
  { name: 'Hamza Brahimi', phone: '0770 11 22 99', location: 'Aéroport Houari Boumediene (T4)' },
  { name: 'Kenza Saidi', phone: '0561 34 56 78', location: 'Aéroport Alger (Hall Arrivées)' },
]

// ── 2-Year Deterministic Schedule Generator ────────────────────────────────

function generateTwoYearSchedule(): CalendarBooking[] {
  const bookings: CalendarBooking[] = []
  let clientCounter = 101

  // Start from base year 2026, month 10 (October 2026) up to October 2028 (25 months)
  const startYear = 2026
  const startMonth = 9 // 0-indexed: 9 = October

  FLEET_VEHICLES.forEach(car => {
    let carClientNum = clientCounter

    for (let mOffset = 0; mOffset < 26; mOffset++) {
      const curYear = startYear + Math.floor((startMonth + mOffset) / 12)
      const curMonth = (startMonth + mOffset) % 12 // 0-11

      const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate()
      const pad = (n: number) => String(n).padStart(2, '0')
      const mStr = pad(curMonth + 1)

      // Slot 1: First half of month
      const startDay1 = Math.min(1 + ((car.id * 3 + mOffset * 2) % 6), daysInMonth - 14)
      const duration1 = 4 + ((car.id + mOffset) % 5)
      const endDay1 = Math.min(startDay1 + duration1, daysInMonth - 10)

      if (startDay1 < endDay1 && endDay1 <= daysInMonth) {
        const client1 = CLIENT_ROSTER[(car.id + mOffset) % CLIENT_ROSTER.length]
        const isCurrentActive = (mOffset === 1 && curYear === 2026 && curMonth === 10 && car.status === 'rented' && startDay1 <= 14 && endDay1 >= 14)
        const isPast = mOffset === 0 || (mOffset === 1 && endDay1 < 14)
        const status: BookingStatus = isCurrentActive ? 'active' : isPast ? 'completed' : 'confirmed'

        bookings.push({
          id: `bk-${car.id}-${curYear}-${curMonth}-1`,
          carId: car.id,
          clientNumber: carClientNum++,
          clientName: client1.name,
          phone: client1.phone,
          startDate: `${curYear}-${mStr}-${pad(startDay1)}`,
          endDate: `${curYear}-${mStr}-${pad(endDay1)}`,
          status,
          location: client1.location,
          totalAmount: car.pricePerDay * (endDay1 - startDay1 + 1),
          deposit: car.pricePerDay * 6,
        })
      }

      // Slot 2: Second half of month
      const startDay2 = Math.min(endDay1 + 3 + ((car.id + mOffset) % 4), daysInMonth - 5)
      const duration2 = 3 + ((car.id * 2 + mOffset) % 5)
      const endDay2 = Math.min(startDay2 + duration2, daysInMonth)

      if (startDay2 < endDay2 && endDay2 <= daysInMonth) {
        const client2 = CLIENT_ROSTER[(car.id * 2 + mOffset + 3) % CLIENT_ROSTER.length]
        const isPending = (mOffset === 1 && (car.id === 3 || car.id === 5)) || ((car.id + mOffset) % 7 === 0)
        const isMaintenance = ((car.id + mOffset) % 11 === 0)
        const status: BookingStatus = isMaintenance
          ? 'maintenance'
          : isPending
          ? 'pending'
          : (mOffset === 0 ? 'completed' : 'confirmed')

        bookings.push({
          id: `bk-${car.id}-${curYear}-${curMonth}-2`,
          carId: car.id,
          clientNumber: isMaintenance ? 0 : carClientNum++,
          clientName: isMaintenance ? 'Entretien & Révision technique' : client2.name,
          phone: isMaintenance ? 'Service Atelier Izem' : client2.phone,
          startDate: `${curYear}-${mStr}-${pad(startDay2)}`,
          endDate: `${curYear}-${mStr}-${pad(endDay2)}`,
          status,
          location: isMaintenance ? 'Atelier Central Dar El Beïda' : client2.location,
          totalAmount: isMaintenance ? 0 : car.pricePerDay * (endDay2 - startDay2 + 1),
          deposit: isMaintenance ? 0 : car.pricePerDay * 6,
          notes: isMaintenance ? 'Vidange complète + contrôle système de freinage' : undefined,
        })
      }
    }
  })

  return bookings
}

// ── Color styles matching image & Apple UI tokens ───────────────────────────

const STATUS_CONFIG: Record<BookingStatus, {
  label: string
  bg: string
  text: string
  border: string
  chipBg: string
  chipText: string
  dot: string
}> = {
  active: {
    label: 'Contrat Actif',
    bg: '#059669',
    text: '#FFFFFF',
    border: 'rgba(5, 150, 105, 0.4)',
    chipBg: 'rgba(255, 255, 255, 0.22)',
    chipText: '#FFFFFF',
    dot: '#10B981',
  },
  confirmed: {
    label: 'Réservation Confirmée',
    bg: '#0B7584',
    text: '#FFFFFF',
    border: 'rgba(11, 117, 132, 0.4)',
    chipBg: 'rgba(255, 255, 255, 0.22)',
    chipText: '#FFFFFF',
    dot: '#0EA5E9',
  },
  pending: {
    label: 'Réservation En Attente',
    bg: '#D97706',
    text: '#FFFFFF',
    border: 'rgba(217, 119, 6, 0.4)',
    chipBg: 'rgba(255, 255, 255, 0.25)',
    chipText: '#FFFFFF',
    dot: '#F59E0B',
  },
  completed: {
    label: 'Contrat Terminé',
    bg: '#475569',
    text: '#FFFFFF',
    border: 'rgba(71, 85, 105, 0.3)',
    chipBg: 'rgba(255, 255, 255, 0.2)',
    chipText: '#FFFFFF',
    dot: '#94A3B8',
  },
  maintenance: {
    label: 'Maintenance / Révision',
    bg: '#DC2626',
    text: '#FFFFFF',
    border: 'rgba(220, 38, 38, 0.4)',
    chipBg: 'rgba(255, 255, 255, 0.25)',
    chipText: '#FFFFFF',
    dot: '#EF4444',
  },
}

const MONTH_NAMES_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

const DAY_NAMES_FR = ['DIM.', 'LUN.', 'MAR.', 'MER.', 'JEU.', 'VEN.', 'SAM.']

// Helper number format
function N(num: number): string {
  return num.toLocaleString('fr-DZ')
}

// ── Main Page Component ─────────────────────────────────────────────────────

export default function CalendarPage() {
  // Calendar base: November 2026 (matching app state)
  const [currentYear, setCurrentYear] = useState<number>(2026)
  const [currentMonth, setCurrentMonth] = useState<number>(10) // 10 = Novembre (0-indexed)

  // Selected vehicle for dedicated view
  const [selectedCarId, setSelectedCarId] = useState<number>(FLEET_VEHICLES[0].id)

  // View mode: 'dedicated' (per vehicle + car hero) vs 'matrix' (all cars in rows like image)
  const [viewMode, setViewMode] = useState<'dedicated' | 'matrix'>('dedicated')

  // Status filter
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all')

  // Search filter
  const [searchQuery, setSearchQuery] = useState('')

  // Modal inspection
  const [selectedBooking, setSelectedBooking] = useState<CalendarBooking | null>(null)

  // Master schedule
  const [schedule] = useState<CalendarBooking[]>(() => generateTwoYearSchedule())

  // Days in current month
  const daysInCurrentMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate()
  }, [currentYear, currentMonth])

  // Current month string YYYY-MM
  const currentMonthStr = useMemo(() => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`
  }, [currentYear, currentMonth])

  // Array of days for table header: [{ dayNum: 1, dayName: 'LUN.', isWeekend: false, isToday: boolean }]
  const monthDays = useMemo(() => {
    const list = []
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const date = new Date(currentYear, currentMonth, d)
      const dayOfWeek = date.getDay() // 0 = Sun, 6 = Sat
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const isToday = currentYear === 2026 && currentMonth === 10 && d === 14 // 14 Nov 2026
      list.push({
        dayNum: d,
        dayName: DAY_NAMES_FR[dayOfWeek],
        isWeekend,
        isToday,
      })
    }
    return list
  }, [currentYear, currentMonth, daysInCurrentMonth])

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      if (currentYear > 2026) {
        setCurrentYear(currentYear - 1)
        setCurrentMonth(11)
      }
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      if (currentYear < 2028) {
        setCurrentYear(currentYear + 1)
        setCurrentMonth(0)
      }
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleResetToday = () => {
    setCurrentYear(2026)
    setCurrentMonth(10) // Novembre 2026
  }

  // Selected car object
  const selectedCar = useMemo(() => {
    return FLEET_VEHICLES.find(c => c.id === selectedCarId) || FLEET_VEHICLES[0]
  }, [selectedCarId])

  // Bookings for selected car in this month
  const carBookingsThisMonth = useMemo(() => {
    return schedule.filter(b => {
      if (b.carId !== selectedCarId) return false
      if (statusFilter !== 'all' && b.status !== statusFilter) return false
      // Check if overlaps with current month
      const start = new Date(b.startDate)
      const end = new Date(b.endDate)
      const monthStart = new Date(currentYear, currentMonth, 1)
      const monthEnd = new Date(currentYear, currentMonth, daysInCurrentMonth, 23, 59, 59)
      return start <= monthEnd && end >= monthStart
    })
  }, [schedule, selectedCarId, currentYear, currentMonth, daysInCurrentMonth, statusFilter])

  // Stats for the selected car in this month
  const selectedCarStats = useMemo(() => {
    let daysBooked = 0
    let totalRevenueEst = 0
    carBookingsThisMonth.forEach(b => {
      if (b.status !== 'maintenance') {
        const start = new Date(b.startDate)
        const end = new Date(b.endDate)
        const monthStart = new Date(currentYear, currentMonth, 1)
        const monthEnd = new Date(currentYear, currentMonth, daysInCurrentMonth)
        const s = Math.max(start.getTime(), monthStart.getTime())
        const e = Math.min(end.getTime(), monthEnd.getTime())
        const days = Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1)
        daysBooked += days
        totalRevenueEst += days * selectedCar.pricePerDay
      }
    })
    const occupancyRate = Math.min(100, Math.round((daysBooked / daysInCurrentMonth) * 100))
    return {
      occupancyRate,
      daysBooked: Math.min(daysInCurrentMonth, daysBooked),
      totalRevenueEst,
      activeClientCount: carBookingsThisMonth.filter(b => b.status !== 'maintenance').length,
    }
  }, [carBookingsThisMonth, daysInCurrentMonth, selectedCar.pricePerDay, currentYear, currentMonth])

  // Fleet overview statistics for current month
  const fleetOverviewStats = useMemo(() => {
    const activeVehicles = FLEET_VEHICLES.filter(c => c.status === 'rented').length
    const totalVehicles = FLEET_VEHICLES.length
    const monthBookings = schedule.filter(b => {
      const start = new Date(b.startDate)
      const end = new Date(b.endDate)
      const monthStart = new Date(currentYear, currentMonth, 1)
      const monthEnd = new Date(currentYear, currentMonth, daysInCurrentMonth, 23, 59, 59)
      return start <= monthEnd && end >= monthStart && b.status !== 'maintenance'
    })
    const projectedRev = monthBookings.reduce((sum, b) => sum + b.totalAmount, 0)
    return {
      activeVehicles,
      totalVehicles,
      totalBookings: monthBookings.length,
      projectedRev,
      fleetOccupancy: Math.round((activeVehicles / totalVehicles) * 100),
    }
  }, [schedule, currentYear, currentMonth, daysInCurrentMonth])

  // 2-Year quick jump options
  const twoYearMonthOptions = useMemo(() => {
    const options = []
    const startY = 2026
    const startM = 9 // Oct 2026
    for (let i = 0; i < 26; i++) {
      const y = startY + Math.floor((startM + i) / 12)
      const m = (startM + i) % 12
      options.push({
        year: y,
        month: m,
        label: `${MONTH_NAMES_FR[m]} ${y}`,
      })
    }
    return options
  }, [])

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', paddingBottom: 60 }}>
      {/* ── Global Styles for Calendar ────────────────────────────────────── */}
      <style jsx global>{`
        .cal-matrix-grid {
          display: grid;
          grid-template-columns: 240px repeat(${daysInCurrentMonth}, minmax(36px, 1fr));
          min-width: ${240 + daysInCurrentMonth * 38}px;
        }
        .cal-stripes {
          background-image: repeating-linear-gradient(
            45deg,
            rgba(241, 245, 249, 0.8),
            rgba(241, 245, 249, 0.8) 6px,
            rgba(255, 255, 255, 0.8) 6px,
            rgba(255, 255, 255, 0.8) 12px
          );
        }
        .cal-tab-btn {
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 99px;
          cursor: pointer;
          border: 1px solid transparent;
          background: transparent;
          color: #64748B;
          transition: all 0.15s ease;
        }
        .cal-tab-btn:hover {
          color: #0F172A;
          background: #F1F5F9;
        }
        .cal-tab-btn.active {
          background: #0B7584;
          color: #FFFFFF;
          border-color: #0B7584;
          box-shadow: 0 1px 3px rgba(11, 117, 132, 0.25);
        }
        .car-thumb-btn {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .car-thumb-btn:hover {
          transform: translateY(-2px);
        }
      `}</style>

      {/* ── TOP HEADER SECTION ────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 20,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CalendarIcon style={{ width: 22, height: 22, color: '#0B7584' }} />
            <h1 style={{
              fontSize: 24,
              fontWeight: 800,
              color: '#0F172A',
              margin: 0,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.02em',
            }}>
              Planning & Calendrier Flotte
            </h1>
          </div>
          <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0 32px' }}>
            Disponibilité temps réel, réservations confirmées et plannings sur 2 ans (2026 – 2028).
          </p>
        </div>

        {/* View Mode Switcher + Month Navigator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Mode Switcher */}
          <div style={{
            display: 'inline-flex',
            background: '#F1F5F9',
            padding: 3,
            borderRadius: 99,
            border: '1px solid #E2E8F0',
          }}>
            <button
              onClick={() => setViewMode('dedicated')}
              className={`cal-tab-btn${viewMode === 'dedicated' ? ' active' : ''}`}
            >
              Vue Véhicule Dédié
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`cal-tab-btn${viewMode === 'matrix' ? ' active' : ''}`}
            >
              Planning Global Flotte
            </button>
          </div>

          {/* Month Navigator Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 14,
            padding: '4px 8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            gap: 6,
          }}>
            <button
              onClick={handlePrevMonth}
              title="Mois précédent"
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: 'none',
                background: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#334155',
              }}
            >
              <ChevronLeft style={{ width: 16, height: 16 }} />
            </button>

            {/* Jump Selector */}
            <select
              value={`${currentYear}-${currentMonth}`}
              onChange={(e) => {
                const [y, m] = e.target.value.split('-').map(Number)
                setCurrentYear(y)
                setCurrentMonth(m)
              }}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: 13,
                fontWeight: 700,
                color: '#0F172A',
                fontFamily: 'var(--font-heading)',
                cursor: 'pointer',
                padding: '2px 6px',
                outline: 'none',
              }}
            >
              {twoYearMonthOptions.map(opt => (
                <option key={`${opt.year}-${opt.month}`} value={`${opt.year}-${opt.month}`}>
                  {opt.label}
                </option>
              ))}
            </select>

            <button
              onClick={handleNextMonth}
              title="Mois suivant"
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: 'none',
                background: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#334155',
              }}
            >
              <ChevronRight style={{ width: 16, height: 16 }} />
            </button>

            <button
              onClick={handleResetToday}
              style={{
                marginLeft: 4,
                padding: '3px 8px',
                fontSize: 11,
                fontWeight: 600,
                borderRadius: 6,
                border: '1px solid #E2E8F0',
                background: '#F8FAFC',
                color: '#0B7584',
                cursor: 'pointer',
              }}
            >
              Aujourd&apos;hui
            </button>
          </div>
        </div>
      </div>

      {/* ── 4 QUICK METRICS SHAPES (USEFUL EXTRA WIDGETS) ─────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 14,
        marginBottom: 20,
      }}>
        <div className="admin-card" style={{ borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(11, 117, 132, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B7584' }}>
            <Car style={{ width: 20, height: 20 }} />
          </div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Véhicules en circulation
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
              <span className="tnum" style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-heading)' }}>
                {fleetOverviewStats.activeVehicles} / {fleetOverviewStats.totalVehicles}
              </span>
              <span style={{ fontSize: 11.5, color: '#059669', fontWeight: 600 }}>
                {fleetOverviewStats.fleetOccupancy}% actif
              </span>
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
            <Percent style={{ width: 20, height: 20 }} />
          </div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Taux d&apos;occupation mois
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
              <span className="tnum" style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-heading)' }}>
                {selectedCarStats.occupancyRate}%
              </span>
              <span style={{ fontSize: 11.5, color: '#64748B' }}>
                sur {selectedCar.name}
              </span>
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
            <Clock style={{ width: 20, height: 20 }} />
          </div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Locations enregistrées
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
              <span className="tnum" style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-heading)' }}>
                {fleetOverviewStats.totalBookings}
              </span>
              <span style={{ fontSize: 11.5, color: '#64748B' }}>
                contrats en {MONTH_NAMES_FR[currentMonth]}
              </span>
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(217, 119, 6, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
            <TrendingUp style={{ width: 20, height: 20 }} />
          </div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Revenus projetés mois
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
              <span className="tnum" style={{ fontSize: 19, fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-heading)' }}>
                {N(fleetOverviewStats.projectedRev)}
              </span>
              <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>DA</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── FLEET CAR SWITCHER BAR ────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Choisir un véhicule pour afficher son calendrier dédié
          </span>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>
            7 véhicules en flotte
          </span>
        </div>

        {/* Horizontal scrollable track of cars */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 10,
        }}>
          {FLEET_VEHICLES.map(car => {
            const isSelected = car.id === selectedCarId
            return (
              <button
                key={car.id}
                onClick={() => setSelectedCarId(car.id)}
                className="car-thumb-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 12px',
                  borderRadius: 14,
                  background: isSelected ? '#FFFFFF' : '#F8FAFC',
                  border: isSelected ? '2px solid #0B7584' : '1px solid #E2E8F0',
                  boxShadow: isSelected ? '0 4px 12px rgba(11, 117, 132, 0.15)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{
                  position: 'relative',
                  width: 44,
                  height: 32,
                  borderRadius: 6,
                  overflow: 'hidden',
                  background: '#F1F5F9',
                  flexShrink: 0,
                }}>
                  <Image
                    src={car.image}
                    alt={car.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{
                    fontSize: 12,
                    fontWeight: isSelected ? 800 : 700,
                    color: isSelected ? '#0B7584' : '#0F172A',
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {car.name}
                  </p>
                  <p style={{
                    fontSize: 10,
                    color: '#64748B',
                    margin: '1px 0 0 0',
                    fontFamily: 'monospace',
                    whiteSpace: 'nowrap',
                  }}>
                    {car.plate}
                  </p>
                </div>

                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: 99,
                  background: car.status === 'rented' ? '#0B7584' : '#10B981',
                  flexShrink: 0,
                }} />
              </button>
            )
          })}
        </div>
      </div>

      {/* ── DEDICATED CAR SHOWCASE CARD (WHEN IN DEDICATED VIEW) ───────────── */}
      {viewMode === 'dedicated' && (
        <div className="admin-card" style={{
          borderRadius: 20,
          padding: '20px 24px',
          marginBottom: 20,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
          }}>
            {/* Left side: Photo + Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, minWidth: 280 }}>
              <div style={{
                position: 'relative',
                width: 140,
                height: 90,
                borderRadius: 14,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                flexShrink: 0,
              }}>
                <Image
                  src={selectedCar.image}
                  alt={selectedCar.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: '#F1F5F9',
                    color: '#475569',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {selectedCar.category}
                  </span>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: '#FEF3C7',
                    color: '#92400E',
                    fontFamily: 'monospace',
                  }}>
                    {selectedCar.plate}
                  </span>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 99,
                    background: selectedCar.status === 'rented' ? '#ECFDF5' : '#F0FDF4',
                    color: selectedCar.status === 'rented' ? '#047857' : '#15803D',
                    border: '1px solid #A7F3D0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: 99, background: '#10B981' }} />
                    {selectedCar.status === 'rented' ? 'En location active' : 'Disponible immédiatement'}
                  </span>
                </div>

                <h2 style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: '6px 0 2px 0',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '-0.02em',
                }}>
                  {selectedCar.name}
                </h2>

                <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>
                  {selectedCar.specs} · {selectedCar.gearbox}
                </p>
              </div>
            </div>

            {/* Right side: 3 Performance Stats for this car */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              flexWrap: 'wrap',
              borderLeft: '1px solid #F1F5F9',
              paddingLeft: 24,
            }}>
              <div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Tarif journalier
                </span>
                <p style={{ margin: '2px 0 0 0', whiteSpace: 'nowrap' }}>
                  <span className="tnum" style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-heading)' }}>
                    {N(selectedCar.pricePerDay)}
                  </span>
                  <span style={{ fontSize: 11, color: '#64748B', marginLeft: 4 }}>DA / jour</span>
                </p>
              </div>

              <div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Jours réservés ce mois
                </span>
                <p style={{ margin: '2px 0 0 0', whiteSpace: 'nowrap' }}>
                  <span className="tnum" style={{ fontSize: 18, fontWeight: 800, color: '#0B7584', fontFamily: 'var(--font-heading)' }}>
                    {selectedCarStats.daysBooked}
                  </span>
                  <span style={{ fontSize: 11, color: '#64748B', marginLeft: 4 }}>/ {daysInCurrentMonth} j ({selectedCarStats.occupancyRate}%)</span>
                </p>
              </div>

              <div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Revenu projeté
                </span>
                <p style={{ margin: '2px 0 0 0', whiteSpace: 'nowrap' }}>
                  <span className="tnum" style={{ fontSize: 18, fontWeight: 800, color: '#059669', fontFamily: 'var(--font-heading)' }}>
                    {N(selectedCarStats.totalRevenueEst)}
                  </span>
                  <span style={{ fontSize: 11, color: '#64748B', marginLeft: 4 }}>DA</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── LEGEND BAR (MATCHING USER IMAGE 1) ────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        padding: '10px 18px',
        background: '#FFFFFF',
        borderRadius: 14,
        border: '1px solid #E2E8F0',
        marginBottom: 16,
      }}>
        {/* Status Legends */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          {(['active', 'confirmed', 'pending', 'completed', 'maintenance'] as BookingStatus[]).map(st => {
            const cfg = STATUS_CONFIG[st]
            const isFilterActive = statusFilter === st
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(isFilterActive ? 'all' : st)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  color: isFilterActive ? '#0F172A' : '#475569',
                  background: isFilterActive ? '#F1F5F9' : 'transparent',
                  padding: '3px 8px',
                  borderRadius: 6,
                  border: isFilterActive ? '1px solid #CBD5E1' : '1px solid transparent',
                  cursor: 'pointer',
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: 2, background: cfg.bg }} />
                <span>{cfg.label}</span>
              </button>
            )
          })}
        </div>

        {/* Current Month Name Headline */}
        <div style={{
          fontSize: 14,
          fontWeight: 800,
          color: '#0F172A',
          fontFamily: 'var(--font-heading)',
          letterSpacing: '-0.01em',
        }}>
          {MONTH_NAMES_FR[currentMonth]} {currentYear}
        </div>
      </div>

      {/* ── THE BIG CALENDAR TIMELINE MATRIX (PLANIFICATEUR) ─────────────── */}
      <div className="admin-card" style={{
        borderRadius: 18,
        overflow: 'hidden',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {/* Header Row: Vehicles label on left, Day numbers & Day names on right */}
          <div className="cal-matrix-grid" style={{
            borderBottom: '1px solid #CBD5E1',
            background: '#F8FAFC',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}>
            {/* Left Header Cell */}
            <div style={{
              padding: '12px 16px',
              fontSize: 11,
              fontWeight: 800,
              color: '#334155',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              borderRight: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F1F5F9',
            }}>
              <span>VÉHICULES</span>
              <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>
                {viewMode === 'dedicated' ? '1 dédié' : '7 flotte'}
              </span>
            </div>

            {/* Day Columns */}
            {monthDays.map(d => (
              <div
                key={d.dayNum}
                style={{
                  padding: '6px 2px',
                  textAlign: 'center',
                  borderRight: '1px solid #E2E8F0',
                  background: d.isToday
                    ? 'rgba(11, 117, 132, 0.12)'
                    : d.isWeekend
                    ? '#F1F5F9'
                    : '#F8FAFC',
                }}
              >
                <div style={{
                  fontSize: 12,
                  fontWeight: d.isToday ? 800 : 700,
                  color: d.isToday ? '#0B7584' : '#0F172A',
                  lineHeight: 1.1,
                }}>
                  {d.dayNum}
                </div>
                <div style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: d.isToday ? '#0B7584' : '#64748B',
                  letterSpacing: '0.02em',
                  marginTop: 2,
                }}>
                  {d.dayName}
                </div>
              </div>
            ))}
          </div>

          {/* Vehicle Rows */}
          {(viewMode === 'dedicated' ? [selectedCar] : FLEET_VEHICLES).map(car => {
            // Find bookings for this car in current month
            const carBookings = schedule.filter(b => {
              if (b.carId !== car.id) return false
              if (statusFilter !== 'all' && b.status !== statusFilter) return false
              const start = new Date(b.startDate)
              const end = new Date(b.endDate)
              const monthStart = new Date(currentYear, currentMonth, 1)
              const monthEnd = new Date(currentYear, currentMonth, daysInCurrentMonth, 23, 59, 59)
              return start <= monthEnd && end >= monthStart
            })

            return (
              <div
                key={car.id}
                className="cal-matrix-grid"
                style={{
                  borderBottom: '1px solid #E2E8F0',
                  minHeight: 64,
                  alignItems: 'stretch',
                  background: '#FFFFFF',
                  position: 'relative',
                }}
              >
                {/* Left Column: Vehicle Info Cell */}
                <div style={{
                  padding: '10px 14px',
                  borderRight: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  position: 'sticky',
                  left: 0,
                  zIndex: 5,
                  boxShadow: '2px 0 4px rgba(0,0,0,0.02)',
                }}>
                  <div style={{
                    position: 'relative',
                    width: 48,
                    height: 34,
                    borderRadius: 6,
                    overflow: 'hidden',
                    background: '#F1F5F9',
                    flexShrink: 0,
                  }}>
                    <Image
                      src={car.image}
                      alt={car.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <p style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: '#0F172A',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {car.name}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <span style={{ fontSize: 9.5, color: '#64748B', fontFamily: 'monospace' }}>
                        {car.plate}
                      </span>
                      <span style={{
                        fontSize: 9,
                        fontWeight: 700,
                        padding: '1px 4px',
                        borderRadius: 3,
                        background: car.status === 'rented' ? '#0B7584' : '#10B981',
                        color: '#FFFFFF',
                        textTransform: 'uppercase',
                      }}>
                        {car.status === 'rented' ? 'LOUÉE' : 'DISPO'}
                      </span>
                    </div>

                    <p style={{ fontSize: 9.5, color: '#059669', fontWeight: 600, margin: '2px 0 0 0' }}>
                      {N(car.pricePerDay)} DA/jour
                    </p>
                  </div>
                </div>

                {/* Day Matrix Cells (Background grid with stripes for available areas) */}
                <div
                  style={{
                    gridColumn: `2 / span ${daysInCurrentMonth}`,
                    position: 'relative',
                    display: 'grid',
                    gridTemplateColumns: `repeat(${daysInCurrentMonth}, 1fr)`,
                    minHeight: 64,
                  }}
                  className="cal-stripes"
                >
                  {/* Grid vertical separator lines */}
                  {monthDays.map(d => (
                    <div
                      key={d.dayNum}
                      style={{
                        borderRight: '1px solid #E2E8F0',
                        height: '100%',
                        background: d.isToday
                          ? 'rgba(11, 117, 132, 0.06)'
                          : d.isWeekend
                          ? 'rgba(241, 245, 249, 0.6)'
                          : 'transparent',
                      }}
                    />
                  ))}

                  {/* Booking Blocks placed horizontally on top */}
                  {carBookings.map(booking => {
                    const cfg = STATUS_CONFIG[booking.status]

                    // Calculate start and end column (1-indexed based on month)
                    const bStart = new Date(booking.startDate)
                    const bEnd = new Date(booking.endDate)

                    // Clamp to current month days
                    let startDay = 1
                    let endDay = daysInCurrentMonth

                    if (bStart.getFullYear() === currentYear && bStart.getMonth() === currentMonth) {
                      startDay = bStart.getDate()
                    } else if (bStart > new Date(currentYear, currentMonth, 1)) {
                      startDay = bStart.getDate()
                    }

                    if (bEnd.getFullYear() === currentYear && bEnd.getMonth() === currentMonth) {
                      endDay = bEnd.getDate()
                    }

                    const colStart = Math.max(1, startDay)
                    const colSpan = Math.max(1, endDay - colStart + 1)

                    return (
                      <div
                        key={booking.id}
                        onClick={() => setSelectedBooking(booking)}
                        title={`${booking.clientName} (${booking.startDate} → ${booking.endDate})`}
                        style={{
                          position: 'absolute',
                          left: `calc(${((colStart - 1) / daysInCurrentMonth) * 100}% + 2px)`,
                          width: `calc(${(colSpan / daysInCurrentMonth) * 100}% - 4px)`,
                          top: 10,
                          bottom: 10,
                          background: cfg.bg,
                          borderRadius: 8,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 8px',
                          cursor: 'pointer',
                          zIndex: 2,
                          overflow: 'hidden',
                          border: `1px solid ${cfg.border}`,
                          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.12)'
                        }}
                      >
                        {/* Number icon badge + Client Name ONLY (as requested) */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          color: '#FFFFFF',
                        }}>
                          {/* Sequential client number pill */}
                          <span style={{
                            fontSize: 10,
                            fontWeight: 800,
                            padding: '1px 6px',
                            borderRadius: 4,
                            background: cfg.chipBg,
                            color: cfg.chipText,
                            fontFamily: 'monospace',
                            flexShrink: 0,
                          }}>
                            {booking.status === 'maintenance' ? '🔧' : `C ${booking.clientNumber}`}
                          </span>

                          {/* Client name next to it */}
                          <span style={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            letterSpacing: '0.01em',
                          }}>
                            {booking.clientName}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── DETAIL TABLE: ALL RESERVATIONS FOR THIS CAR / MONTH ───────────── */}
      <div className="admin-card" style={{
        borderRadius: 18,
        padding: '20px 24px',
        marginTop: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CalendarIcon style={{ width: 16, height: 16, color: '#0B7584' }} />
            <h3 style={{
              fontSize: 14,
              fontWeight: 800,
              color: '#0F172A',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              Réservations & Planning détaillé · {selectedCar.name} ({MONTH_NAMES_FR[currentMonth]} {currentYear})
            </h3>
          </div>

          <span style={{ fontSize: 12, color: '#64748B' }}>
            {carBookingsThisMonth.length} mouvement{carBookingsThisMonth.length > 1 ? 's' : ''} ce mois
          </span>
        </div>

        {carBookingsThisMonth.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: '#64748B' }}>
            <Car style={{ width: 32, height: 32, margin: '0 auto 8px auto', opacity: 0.4 }} />
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Aucune réservation enregistrée sur ce véhicule pour ce mois.</p>
            <p style={{ margin: '4px 0 0 0', fontSize: 11.5, color: '#94A3B8' }}>Véhicule 100% disponible pour de nouvelles prises en charge.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {carBookingsThisMonth.map((booking) => {
              const cfg = STATUS_CONFIG[booking.status]
              return (
                <div
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1.5fr 1.3fr 1.5fr 1fr 120px 36px',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 16px',
                    borderRadius: 12,
                    background: '#FFFFFF',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F8FAFC'
                    e.currentTarget.style.borderColor = '#CBD5E1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#FFFFFF'
                    e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.05)'
                  }}
                >
                  {/* Client number pill */}
                  <div>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: '#F1F5F9',
                      color: '#0F172A',
                      fontFamily: 'monospace',
                    }}>
                      {booking.status === 'maintenance' ? '🔧 ATELIER' : `C ${booking.clientNumber}`}
                    </span>
                  </div>

                  {/* Client Name + Phone */}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {booking.clientName}
                    </p>
                    <p style={{ fontSize: 11, color: '#64748B', margin: '1px 0 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Phone style={{ width: 10, height: 10, color: '#94A3B8' }} />
                      {booking.phone}
                    </p>
                  </div>

                  {/* Dates */}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#334155', margin: 0, whiteSpace: 'nowrap' }}>
                      {booking.startDate} → {booking.endDate}
                    </p>
                    <p style={{ fontSize: 10.5, color: '#94A3B8', margin: '1px 0 0 0' }}>
                      Dates de réservation
                    </p>
                  </div>

                  {/* Location */}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 11.5, color: '#475569', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin style={{ width: 11, height: 11, color: '#0B7584', flexShrink: 0 }} />
                      {booking.location}
                    </p>
                  </div>

                  {/* Amount */}
                  <div style={{ minWidth: 0, whiteSpace: 'nowrap' }}>
                    <span className="tnum" style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
                      {N(booking.totalAmount)}
                    </span>
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: '#64748B', marginLeft: 3 }}>DA</span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '2px 8px',
                      borderRadius: 99,
                      fontSize: 10.5,
                      fontWeight: 600,
                      background: `${cfg.dot}15`,
                      color: cfg.bg,
                      border: `1px solid ${cfg.dot}30`,
                      whiteSpace: 'nowrap',
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: 99, background: cfg.dot }} />
                      {cfg.label}
                    </span>
                  </div>

                  {/* WhatsApp Quick Action */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {booking.status !== 'maintenance' ? (
                      <a
                        href={`https://wa.me/213${booking.phone.replace(/\s+/g, '').replace(/^0/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Contacter sur WhatsApp"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: '#ECFDF5',
                          border: '1px solid #A7F3D0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#059669',
                          textDecoration: 'none',
                        }}
                      >
                        <MessageCircle style={{ width: 13, height: 13 }} />
                      </a>
                    ) : (
                      <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
                        <Wrench style={{ width: 13, height: 13 }} />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── MODAL FICHE CLIENT & RÉSERVATION ──────────────────────────────── */}
      {selectedBooking && (
        <div
          onClick={() => setSelectedBooking(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="admin-card"
            style={{
              width: '100%',
              maxWidth: 520,
              borderRadius: 20,
              padding: 24,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              position: 'relative',
              animation: 'modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedBooking(null)}
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                width: 32,
                height: 32,
                borderRadius: 8,
                border: '1px solid #E2E8F0',
                background: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B',
              }}
            >
              <X style={{ width: 16, height: 16 }} />
            </button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{
                fontSize: 12,
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: 6,
                background: '#0B7584',
                color: '#FFFFFF',
                fontFamily: 'monospace',
              }}>
                {selectedBooking.status === 'maintenance' ? '🔧 ATELIER' : `CLIENT N° ${selectedBooking.clientNumber}`}
              </span>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 99,
                background: `${STATUS_CONFIG[selectedBooking.status].dot}15`,
                color: STATUS_CONFIG[selectedBooking.status].bg,
                border: `1px solid ${STATUS_CONFIG[selectedBooking.status].dot}30`,
              }}>
                {STATUS_CONFIG[selectedBooking.status].label}
              </span>
            </div>

            <h3 style={{
              fontSize: 20,
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 4px 0',
              fontFamily: 'var(--font-heading)',
            }}>
              {selectedBooking.clientName}
            </h3>

            <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 16px 0' }}>
              Véhicule assigné : <strong>{FLEET_VEHICLES.find(c => c.id === selectedBooking.carId)?.name}</strong>
            </p>

            {/* Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
              background: '#F8FAFC',
              padding: 16,
              borderRadius: 12,
              border: '1px solid #E2E8F0',
              marginBottom: 16,
            }}>
              <div>
                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Date de prise en charge</span>
                <p style={{ margin: '2px 0 0 0', fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                  {selectedBooking.startDate}
                </p>
              </div>

              <div>
                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Date de restitution</span>
                <p style={{ margin: '2px 0 0 0', fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                  {selectedBooking.endDate}
                </p>
              </div>

              <div>
                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Numéro de contact</span>
                <p style={{ margin: '2px 0 0 0', fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                  {selectedBooking.phone}
                </p>
              </div>

              <div>
                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Lieu convenu</span>
                <p style={{ margin: '2px 0 0 0', fontSize: 12.5, fontWeight: 600, color: '#0F172A' }}>
                  {selectedBooking.location}
                </p>
              </div>

              <div>
                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Montant total</span>
                <p style={{ margin: '2px 0 0 0', fontSize: 14, fontWeight: 800, color: '#059669' }}>
                  {N(selectedBooking.totalAmount)} DA
                </p>
              </div>

              <div>
                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Caution bloquée</span>
                <p style={{ margin: '2px 0 0 0', fontSize: 13, fontWeight: 700, color: '#475569' }}>
                  {N(selectedBooking.deposit)} DA
                </p>
              </div>
            </div>

            {selectedBooking.notes && (
              <p style={{
                fontSize: 12,
                color: '#64748B',
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                padding: '8px 12px',
                borderRadius: 8,
                marginBottom: 16,
              }}>
                <strong>Note :</strong> {selectedBooking.notes}
              </p>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              {selectedBooking.status !== 'maintenance' && (
                <a
                  href={`https://wa.me/213${selectedBooking.phone.replace(/\s+/g, '').replace(/^0/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 10,
                    background: '#10B981',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: 12,
                    textDecoration: 'none',
                  }}
                >
                  <MessageCircle style={{ width: 14, height: 14 }} />
                  WhatsApp
                </a>
              )}

              <Link
                href="/admin/orders"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 10,
                  background: '#0F172A',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: 12,
                  textDecoration: 'none',
                }}
              >
                Voir dans Commandes <ArrowUpRight style={{ width: 14, height: 14 }} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

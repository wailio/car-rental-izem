'use client'

export const runtime = 'edge'

import { useState, useMemo, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
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
  X,
  ArrowUpRight,
  ShieldCheck,
  Check,
  CalendarCheck,
  RotateCcw,
} from 'lucide-react'

// ── Types ───────────────────────────────────────────────────────────────────

export type BookingStatus = 'active' | 'confirmed' | 'pending' | 'completed' | 'maintenance'

export interface CalendarBooking {
  id: string
  carId: number
  clientIndex: number // 0 for current active client, 1 for next approved, 2 for next...
  clientName: string
  phone: string
  startDate: string    // YYYY-MM-DD
  endDate: string      // YYYY-MM-DD
  status: BookingStatus
  location: string
  totalAmount: number  // DA
  deposit: number      // DA
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
    specs: 'Automatique · Essence · 5 places',
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
    specs: 'Automatique · Essence · 5 places',
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
    specs: 'Automatique · Essence · 5 places',
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
    specs: 'Automatique · Essence · 5 places',
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
    specs: 'Automatique · Essence · 5 places',
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
    specs: 'Automatique · Essence · 5 places',
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
    specs: 'Automatique · Essence · 5 places',
    gearbox: 'Automatique CVT',
    status: 'available',
  },
]

// ── Realistic client rosters ────────────────────────────────────────────────

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

// ── 2-Year Schedule Generator with N° 0, N° 1, N° 2 per car ─────────────────

function generateSchedule(): CalendarBooking[] {
  const bookings: CalendarBooking[] = []
  const startYear = 2026
  const startMonth = 10 // November 2026 (0-indexed: 10 = Nov)

  FLEET_VEHICLES.forEach(car => {
    // For each car: client numbering begins at 0 (the current active one is N° 0, next is N° 1, N° 2...)
    let clientIdx = 0

    // Month 0: November 2026
    if (car.status === 'rented') {
      // Active current client is N° 0
      const c0 = CLIENT_ROSTER[(car.id - 1) % CLIENT_ROSTER.length]
      bookings.push({
        id: `bk-${car.id}-m0-0`,
        carId: car.id,
        clientIndex: clientIdx++,
        clientName: c0.name,
        phone: c0.phone,
        startDate: '2026-11-08',
        endDate: '2026-11-18',
        status: 'active',
        location: c0.location,
        totalAmount: car.pricePerDay * 10,
        deposit: car.pricePerDay * 6,
      })

      // Next approved reservation is N° 1
      const c1 = CLIENT_ROSTER[(car.id + 2) % CLIENT_ROSTER.length]
      bookings.push({
        id: `bk-${car.id}-m0-1`,
        carId: car.id,
        clientIndex: clientIdx++,
        clientName: c1.name,
        phone: c1.phone,
        startDate: '2026-11-20',
        endDate: '2026-11-27',
        status: 'confirmed',
        location: c1.location,
        totalAmount: car.pricePerDay * 7,
        deposit: car.pricePerDay * 6,
      })
    } else {
      // Car is currently available, so first upcoming client is N° 0
      const c0 = CLIENT_ROSTER[(car.id * 2) % CLIENT_ROSTER.length]
      bookings.push({
        id: `bk-${car.id}-m0-0`,
        carId: car.id,
        clientIndex: clientIdx++,
        clientName: c0.name,
        phone: c0.phone,
        startDate: '2026-11-17',
        endDate: '2026-11-24',
        status: 'confirmed',
        location: c0.location,
        totalAmount: car.pricePerDay * 7,
        deposit: car.pricePerDay * 6,
      })
    }

    // Generate schedule for subsequent months up to 2 years (24 months)
    for (let mOffset = 1; mOffset <= 24; mOffset++) {
      const curYear = startYear + Math.floor((startMonth + mOffset) / 12)
      const curMonth = (startMonth + mOffset) % 12
      const pad = (n: number) => String(n).padStart(2, '0')
      const mStr = pad(curMonth + 1)
      const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate()

      // Slot A in month
      const startDay1 = 3 + ((car.id * 3 + mOffset * 2) % 6)
      const dur1 = 5 + ((car.id + mOffset) % 4)
      const endDay1 = Math.min(startDay1 + dur1, daysInMonth - 11)

      const clientA = CLIENT_ROSTER[(car.id + mOffset * 2) % CLIENT_ROSTER.length]
      bookings.push({
        id: `bk-${car.id}-${curYear}-${curMonth}-a`,
        carId: car.id,
        clientIndex: clientIdx++,
        clientName: clientA.name,
        phone: clientA.phone,
        startDate: `${curYear}-${mStr}-${pad(startDay1)}`,
        endDate: `${curYear}-${mStr}-${pad(endDay1)}`,
        status: 'confirmed',
        location: clientA.location,
        totalAmount: car.pricePerDay * (endDay1 - startDay1 + 1),
        deposit: car.pricePerDay * 6,
      })

      // Slot B in month
      const startDay2 = Math.min(endDay1 + 4, daysInMonth - 6)
      const dur2 = 4 + ((car.id + mOffset * 3) % 4)
      const endDay2 = Math.min(startDay2 + dur2, daysInMonth)

      const clientB = CLIENT_ROSTER[(car.id * 3 + mOffset) % CLIENT_ROSTER.length]
      const isMaint = (mOffset % 5 === 0 && car.id % 2 === 1)
      bookings.push({
        id: `bk-${car.id}-${curYear}-${curMonth}-b`,
        carId: car.id,
        clientIndex: isMaint ? 0 : clientIdx++,
        clientName: isMaint ? 'Entretien technique' : clientB.name,
        phone: isMaint ? 'Atelier Izem' : clientB.phone,
        startDate: `${curYear}-${mStr}-${pad(startDay2)}`,
        endDate: `${curYear}-${mStr}-${pad(endDay2)}`,
        status: isMaint ? 'maintenance' : 'confirmed',
        location: isMaint ? 'Atelier Dar El Beïda' : clientB.location,
        totalAmount: isMaint ? 0 : car.pricePerDay * (endDay2 - startDay2 + 1),
        deposit: isMaint ? 0 : car.pricePerDay * 6,
      })
    }
  })

  return bookings
}

const MONTH_NAMES_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

// Day columns matching user image (Monday to Sunday)
const WEEKDAY_NAMES_SHORT = ['LU', 'MA', 'ME', 'JE', 'VE', 'SA', 'DI']

function N(num: number): string {
  return num.toLocaleString('fr-DZ')
}

// ── Main Page Component ─────────────────────────────────────────────────────

export default function CalendarPage() {
  // Calendar base: November 2026 (matching app reference)
  const [currentYear, setCurrentYear] = useState<number>(2026)
  const [currentMonth, setCurrentMonth] = useState<number>(10) // 10 = Novembre (0-indexed)

  // Selected vehicle: default to first car
  const [selectedCarId, setSelectedCarId] = useState<number>(FLEET_VEHICLES[0].id)

  // Car picker dropdown open state
  const [isCarDropdownOpen, setIsCarDropdownOpen] = useState(false)
  const carDropdownRef = useRef<HTMLDivElement>(null)

  // Selected date (for gold circle selection in calendar, default to today = 14 Nov 2026)
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-11-14')

  // View mode: 'dedicated' (DEFAULT) vs 'matrix'
  const [viewMode, setViewMode] = useState<'dedicated' | 'matrix'>('dedicated')

  // Master schedule
  const [schedule] = useState<CalendarBooking[]>(() => generateSchedule())

  // Close car dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (carDropdownRef.current && !carDropdownRef.current.contains(event.target as Node)) {
        setIsCarDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Month navigation (advances by 1 month)
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
    setSelectedDateStr('2026-11-14')
  }

  // Next month info for dual-month view (matching image 2: July 2023 | August 2023)
  const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear
  const nextMonthIdx = currentMonth === 11 ? 0 : currentMonth + 1

  // Selected car object
  const selectedCar = useMemo(() => {
    return FLEET_VEHICLES.find(c => c.id === selectedCarId) || FLEET_VEHICLES[0]
  }, [selectedCarId])

  // Bookings for selected car
  const carBookings = useMemo(() => {
    return schedule.filter(b => b.carId === selectedCarId)
  }, [schedule, selectedCarId])

  // Build calendar matrix for any given (year, month)
  function buildMonthCalendar(year: number, month: number) {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    // First day of month (0 = Sun, 1 = Mon... convert to Mon=0 .. Sun=6)
    const firstDayRaw = new Date(year, month, 1).getDay()
    const firstDayIndex = firstDayRaw === 0 ? 6 : firstDayRaw - 1 // 0 = Mon, 6 = Sun

    const cells: {
      dayNum: number | null
      dateStr: string | null
      booking: CalendarBooking | null
      isStartOfBooking: boolean
      isEndOfBooking: boolean
      isToday: boolean
      isSelected: boolean
    }[] = []

    // Empty cells before start of month
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({
        dayNum: null,
        dateStr: null,
        booking: null,
        isStartOfBooking: false,
        isEndOfBooking: false,
        isToday: false,
        isSelected: false,
      })
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const pad = (n: number) => String(n).padStart(2, '0')
      const dStr = `${year}-${pad(month + 1)}-${pad(d)}`
      const isToday = dStr === '2026-11-14'
      const isSelected = dStr === selectedDateStr

      // Check if this date has a booking for the selected car
      const foundBooking = carBookings.find(b => {
        return dStr >= b.startDate && dStr <= b.endDate
      }) || null

      const isStartOfBooking = foundBooking ? dStr === foundBooking.startDate : false
      const isEndOfBooking = foundBooking ? dStr === foundBooking.endDate : false

      cells.push({
        dayNum: d,
        dateStr: dStr,
        booking: foundBooking,
        isStartOfBooking,
        isEndOfBooking,
        isToday,
        isSelected,
      })
    }

    return cells
  }

  const month1Cells = useMemo(() => buildMonthCalendar(currentYear, currentMonth), [currentYear, currentMonth, carBookings, selectedDateStr])
  const month2Cells = useMemo(() => buildMonthCalendar(nextMonthYear, nextMonthIdx), [nextMonthYear, nextMonthIdx, carBookings, selectedDateStr])

  // Selected date booking info
  const selectedDateBooking = useMemo(() => {
    return carBookings.find(b => selectedDateStr >= b.startDate && selectedDateStr <= b.endDate) || null
  }, [carBookings, selectedDateStr])

  // Formatted selected date
  const selectedDateFormatted = useMemo(() => {
    if (!selectedDateStr) return ''
    const [y, m, d] = selectedDateStr.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }, [selectedDateStr])

  // For the Global Fleet Matrix view
  const daysInCurrentMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate()
  }, [currentYear, currentMonth])

  const matrixDays = useMemo(() => {
    const list = []
    const dayNames = ['DI', 'LU', 'MA', 'ME', 'JE', 'VE', 'SA']
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const date = new Date(currentYear, currentMonth, d)
      const dayOfWeek = date.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const isToday = currentYear === 2026 && currentMonth === 10 && d === 14
      list.push({
        dayNum: d,
        dayName: dayNames[dayOfWeek],
        isWeekend,
        isToday,
      })
    }
    return list
  }, [currentYear, currentMonth, daysInCurrentMonth])

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', paddingBottom: 60 }}>
      {/* ── STYLES ────────────────────────────────────────────────────────── */}
      <style jsx global>{`
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
        .cal-day-cell {
          position: relative;
          height: 44px;
          display: flex;
          align-items: center;
          justifyContent: center;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          user-select: none;
          transition: all 0.15s ease;
        }
        .cal-stripes {
          background-image: repeating-linear-gradient(
            45deg,
            rgba(241, 245, 249, 0.7),
            rgba(241, 245, 249, 0.7) 6px,
            rgba(255, 255, 255, 0.7) 6px,
            rgba(255, 255, 255, 0.7) 12px
          );
        }
      `}</style>

      {/* ── TOP BAR: TITLE + VIEW MODE TOGGLE ──────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 20,
      }}>
        <div>
          <h1 style={{
            fontSize: 22,
            fontWeight: 800,
            color: '#0F172A',
            margin: 0,
            fontFamily: 'var(--font-heading)',
            letterSpacing: '-0.02em',
          }}>
            Calendrier & Disponibilité
          </h1>
          <p style={{ fontSize: 13, color: '#64748B', margin: '3px 0 0 0' }}>
            Consultez les disponibilités par véhicule et les clients réservés de N° 0 à N°.
          </p>
        </div>

        {/* View Switcher: Vue Véhicule Dédié (DEFAULT) vs Planning Global Flotte */}
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
      </div>

      {/* ── VIEW 1: VUE VÉHICULE DÉDIÉ (DEFAULT VIEW) ─────────────────────── */}
      {viewMode === 'dedicated' && (
        <div>
          {/* ── COMPACT CAR SELECTOR SHAPE (SINGLE SHAPE ABOVE CALENDAR) ──── */}
          <div ref={carDropdownRef} style={{ position: 'relative', marginBottom: 18, zIndex: 30 }}>
            <button
              onClick={() => setIsCarDropdownOpen(!isCarDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: 420,
                padding: '10px 14px',
                borderRadius: 16,
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0B7584'
              }}
              onMouseLeave={(e) => {
                if (!isCarDropdownOpen) e.currentTarget.style.borderColor = '#E2E8F0'
              }}
            >
              {/* Car photo + Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div style={{
                  position: 'relative',
                  width: 52,
                  height: 36,
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: '#F8FAFC',
                  border: '1px solid rgba(0,0,0,0.06)',
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

                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <p style={{
                      fontSize: 13.5,
                      fontWeight: 800,
                      color: '#0F172A',
                      margin: 0,
                      whiteSpace: 'nowrap',
                      fontFamily: 'var(--font-heading)',
                    }}>
                      {selectedCar.name}
                    </p>
                    <span style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      padding: '1px 5px',
                      borderRadius: 4,
                      background: selectedCar.status === 'rented' ? '#ECFDF5' : '#F0FDF4',
                      color: selectedCar.status === 'rented' ? '#047857' : '#15803D',
                    }}>
                      {selectedCar.status === 'rented' ? 'Louée' : 'Disponible'}
                    </span>
                  </div>

                  <p style={{ fontSize: 11, color: '#64748B', margin: '2px 0 0 0', whiteSpace: 'nowrap' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{selectedCar.plate}</span> · {N(selectedCar.pricePerDay)} DA/jour
                  </p>
                </div>
              </div>

              {/* Chevron icon */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                paddingLeft: 8,
                color: '#64748B',
              }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#0B7584' }}>Changer</span>
                <ChevronDown style={{
                  width: 16,
                  height: 16,
                  transform: isCarDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }} />
              </div>
            </button>

            {/* Dropdown Menu listing all cars */}
            {isCarDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                width: '100%',
                maxWidth: 420,
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
                padding: 6,
                zIndex: 50,
                animation: 'fadeIn 0.15s ease',
              }}>
                {FLEET_VEHICLES.map(car => {
                  const isSelected = car.id === selectedCarId
                  return (
                    <button
                      key={car.id}
                      onClick={() => {
                        setSelectedCarId(car.id)
                        setIsCarDropdownOpen(false)
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 10,
                        background: isSelected ? 'rgba(11, 117, 132, 0.08)' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.1s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = '#F8FAFC'
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <div style={{
                          position: 'relative',
                          width: 44,
                          height: 30,
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

                        <div>
                          <p style={{
                            fontSize: 12.5,
                            fontWeight: isSelected ? 800 : 700,
                            color: isSelected ? '#0B7584' : '#0F172A',
                            margin: 0,
                            whiteSpace: 'nowrap',
                          }}>
                            {car.name}
                          </p>
                          <p style={{ fontSize: 10.5, color: '#64748B', margin: '1px 0 0 0', fontFamily: 'monospace' }}>
                            {car.plate} · {N(car.pricePerDay)} DA/j
                          </p>
                        </div>
                      </div>

                      {isSelected ? (
                        <Check style={{ width: 16, height: 16, color: '#0B7584', flexShrink: 0 }} />
                      ) : (
                        <span style={{
                          width: 6,
                          height: 6,
                          borderRadius: 99,
                          background: car.status === 'rented' ? '#0B7584' : '#10B981',
                          flexShrink: 0,
                        }} />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── BIG DUAL-MONTH CALENDAR (MATCHING IMAGE 2 EXACTLY) ─────────── */}
          <div className="admin-card" style={{
            borderRadius: 20,
            padding: '24px 28px',
            background: '#FFFFFF',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            border: '1px solid #E2E8F0',
          }}>
            {/* Grid of 2 Months side by side (with responsive fallback to 1 col on mobile) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 40,
            }}>
              {/* ── MONTH 1 (e.g. Novembre 2026 with < previous button) ──── */}
              <div>
                {/* Month 1 Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                  padding: '0 4px',
                }}>
                  <button
                    onClick={handlePrevMonth}
                    title="Mois précédent"
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      border: 'none',
                      background: 'transparent',
                      color: '#0B7584',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <ChevronLeft style={{ width: 20, height: 20 }} />
                  </button>

                  <h3 style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#1E293B',
                    margin: 0,
                    letterSpacing: '-0.01em',
                  }}>
                    {MONTH_NAMES_FR[currentMonth]} {currentYear}
                  </h3>

                  <div style={{ width: 30 }} /> {/* Spacer */}
                </div>

                {/* Weekday Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  textAlign: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#64748B',
                  letterSpacing: '0.04em',
                  paddingBottom: 10,
                  borderBottom: '1px solid #E2E8F0',
                  marginBottom: 8,
                }}>
                  {WEEKDAY_NAMES_SHORT.map(w => (
                    <div key={w}>{w}</div>
                  ))}
                </div>

                {/* Days Grid Month 1 */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  rowGap: 4,
                }}>
                  {month1Cells.map((cell, idx) => {
                    if (cell.dayNum === null) {
                      return <div key={`empty-1-${idx}`} style={{ height: 44 }} />
                    }

                    const isBooked = !!cell.booking
                    const isSelected = cell.isSelected
                    const isToday = cell.isToday
                    const booking = cell.booking

                    return (
                      <div
                        key={`m1-${cell.dayNum}`}
                        onClick={() => cell.dateStr && setSelectedDateStr(cell.dateStr)}
                        className="cal-day-cell"
                        style={{
                          // If booked: soft horizontal connector
                          background: isBooked
                            ? (booking?.status === 'active'
                              ? 'rgba(16, 185, 129, 0.12)'
                              : 'rgba(11, 117, 132, 0.10)')
                            : 'transparent',
                          borderTopLeftRadius: cell.isStartOfBooking ? 10 : 0,
                          borderBottomLeftRadius: cell.isStartOfBooking ? 10 : 0,
                          borderTopRightRadius: cell.isEndOfBooking ? 10 : 0,
                          borderBottomRightRadius: cell.isEndOfBooking ? 10 : 0,
                        }}
                      >
                        {/* Day Number Circle */}
                        <div style={{
                          width: 34,
                          height: 34,
                          borderRadius: 99,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          // Gold Circle when selected (exact look from user's image day 26!)
                          background: isSelected
                            ? '#EAB308'
                            : isToday && !isBooked
                            ? '#F1F5F9'
                            : 'transparent',
                          color: isSelected
                            ? '#FFFFFF'
                            : isBooked
                            ? (booking?.status === 'active' ? '#047857' : '#0B7584')
                            : '#334155',
                          fontWeight: isSelected ? 800 : isBooked ? 700 : 500,
                          boxShadow: isSelected ? '0 3px 8px rgba(234, 179, 8, 0.35)' : 'none',
                          border: isToday && !isSelected ? '1px solid #CBD5E1' : 'none',
                        }}>
                          <span style={{ fontSize: 13, lineHeight: 1 }}>{cell.dayNum}</span>

                          {/* Client Index Pill below date if booked (e.g. N° 0, N° 1) */}
                          {isBooked && !isSelected && (
                            <span style={{
                              fontSize: 8.5,
                              fontWeight: 800,
                              lineHeight: 1,
                              marginTop: 2,
                              color: booking?.status === 'active' ? '#059669' : '#0B7584',
                            }}>
                              N°{booking?.clientIndex}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ── MONTH 2 (e.g. Décembre 2026 with > next button) ──── */}
              <div>
                {/* Month 2 Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                  padding: '0 4px',
                }}>
                  <div style={{ width: 30 }} /> {/* Spacer */}

                  <h3 style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#1E293B',
                    margin: 0,
                    letterSpacing: '-0.01em',
                  }}>
                    {MONTH_NAMES_FR[nextMonthIdx]} {nextMonthYear}
                  </h3>

                  <button
                    onClick={handleNextMonth}
                    title="Mois suivant"
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      border: 'none',
                      background: 'transparent',
                      color: '#0B7584',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <ChevronRight style={{ width: 20, height: 20 }} />
                  </button>
                </div>

                {/* Weekday Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  textAlign: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#64748B',
                  letterSpacing: '0.04em',
                  paddingBottom: 10,
                  borderBottom: '1px solid #E2E8F0',
                  marginBottom: 8,
                }}>
                  {WEEKDAY_NAMES_SHORT.map(w => (
                    <div key={w}>{w}</div>
                  ))}
                </div>

                {/* Days Grid Month 2 */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  rowGap: 4,
                }}>
                  {month2Cells.map((cell, idx) => {
                    if (cell.dayNum === null) {
                      return <div key={`empty-2-${idx}`} style={{ height: 44 }} />
                    }

                    const isBooked = !!cell.booking
                    const isSelected = cell.isSelected
                    const isToday = cell.isToday
                    const booking = cell.booking

                    return (
                      <div
                        key={`m2-${cell.dayNum}`}
                        onClick={() => cell.dateStr && setSelectedDateStr(cell.dateStr)}
                        className="cal-day-cell"
                        style={{
                          background: isBooked
                            ? (booking?.status === 'active'
                              ? 'rgba(16, 185, 129, 0.12)'
                              : 'rgba(11, 117, 132, 0.10)')
                            : 'transparent',
                          borderTopLeftRadius: cell.isStartOfBooking ? 10 : 0,
                          borderBottomLeftRadius: cell.isStartOfBooking ? 10 : 0,
                          borderTopRightRadius: cell.isEndOfBooking ? 10 : 0,
                          borderBottomRightRadius: cell.isEndOfBooking ? 10 : 0,
                        }}
                      >
                        {/* Day Number Circle */}
                        <div style={{
                          width: 34,
                          height: 34,
                          borderRadius: 99,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isSelected
                            ? '#EAB308'
                            : isToday && !isBooked
                            ? '#F1F5F9'
                            : 'transparent',
                          color: isSelected
                            ? '#FFFFFF'
                            : isBooked
                            ? (booking?.status === 'active' ? '#047857' : '#0B7584')
                            : '#334155',
                          fontWeight: isSelected ? 800 : isBooked ? 700 : 500,
                          boxShadow: isSelected ? '0 3px 8px rgba(234, 179, 8, 0.35)' : 'none',
                          border: isToday && !isSelected ? '1px solid #CBD5E1' : 'none',
                        }}>
                          <span style={{ fontSize: 13, lineHeight: 1 }}>{cell.dayNum}</span>

                          {isBooked && !isSelected && (
                            <span style={{
                              fontSize: 8.5,
                              fontWeight: 800,
                              lineHeight: 1,
                              marginTop: 2,
                              color: booking?.status === 'active' ? '#059669' : '#0B7584',
                            }}>
                              N°{booking?.clientIndex}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* ── CALENDAR LEGEND (EXACTLY MATCHING IMAGE 2) ──────────────── */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
              marginTop: 28,
              paddingTop: 18,
              borderTop: '1px solid #F1F5F9',
              fontSize: 12,
              fontWeight: 600,
              color: '#475569',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: '#1E293B' }} />
                <span>Disponible</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: '#0B7584' }} />
                <span>Non disponible (Réservé / Loué)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: '#EAB308' }} />
                <span>Date sélectionnée</span>
              </div>
            </div>
          </div>

          {/* ── DETAIL CARD FOR THE SELECTED DATE ─────────────────────────── */}
          <div className="admin-card" style={{
            borderRadius: 18,
            padding: '16px 20px',
            marginTop: 16,
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CalendarCheck style={{ width: 18, height: 18, color: '#0B7584' }} />
                <div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', textTransform: 'capitalize' }}>
                    {selectedDateFormatted}
                  </span>
                  <span style={{ fontSize: 11.5, color: '#64748B', marginLeft: 8 }}>
                    · {selectedCar.name} ({selectedCar.plate})
                  </span>
                </div>
              </div>

              <button
                onClick={handleResetToday}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: 6,
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  color: '#0B7584',
                  cursor: 'pointer',
                }}
              >
                Aller à aujourd&apos;hui (14 nov.)
              </button>
            </div>

            {/* Content for this date */}
            {selectedDateBooking ? (
              <div style={{
                marginTop: 12,
                padding: '12px 16px',
                borderRadius: 12,
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {/* Client Number Badge N° 0, N° 1... */}
                  <span style={{
                    fontSize: 12,
                    fontWeight: 800,
                    padding: '3px 9px',
                    borderRadius: 6,
                    background: selectedDateBooking.status === 'active' ? '#059669' : '#0B7584',
                    color: '#FFFFFF',
                    fontFamily: 'monospace',
                  }}>
                    CLIENT N° {selectedDateBooking.clientIndex}
                  </span>

                  <div>
                    <p style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {selectedDateBooking.clientName}
                    </p>
                    <p style={{ fontSize: 11, color: '#64748B', margin: '2px 0 0 0' }}>
                      Période : {selectedDateBooking.startDate} → {selectedDateBooking.endDate} · {selectedDateBooking.location}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ textAlign: 'right' }}>
                    <span className="tnum" style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
                      {N(selectedDateBooking.totalAmount)} DA
                    </span>
                    <p style={{ fontSize: 10, color: '#059669', fontWeight: 600, margin: 0 }}>
                      {selectedDateBooking.status === 'active' ? '● En cours actuellement' : '● Réservation confirmée'}
                    </p>
                  </div>

                  <a
                    href={`https://wa.me/213${selectedDateBooking.phone.replace(/\s+/g, '').replace(/^0/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Contacter sur WhatsApp"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '6px 12px',
                      borderRadius: 8,
                      background: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      color: '#047857',
                      fontSize: 11.5,
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    <MessageCircle style={{ width: 13, height: 13 }} />
                    WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <div style={{
                marginTop: 12,
                padding: '10px 14px',
                borderRadius: 10,
                background: '#F0FDF4',
                border: '1px solid #DCFCE7',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#15803D',
                fontSize: 12.5,
                fontWeight: 600,
              }}>
                <CheckCircle2 style={{ width: 16, height: 16, color: '#16A34A', flexShrink: 0 }} />
                <span>Véhicule 100% disponible à cette date (aucun client réservé pour cette journée).</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── VIEW 2: PLANNING GLOBAL FLOTTE (GANTT MATRIX VIEW) ───────────── */}
      {viewMode === 'matrix' && (
        <div className="admin-card" style={{
          borderRadius: 18,
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          background: '#FFFFFF',
        }}>
          {/* Header INSIDE the calendar card with month changing buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderBottom: '1px solid #E2E8F0',
            background: '#FFFFFF',
          }}>
            {/* Left: Previous month button */}
            <button
              onClick={handlePrevMonth}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                background: '#1E3A8A',
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <ChevronLeft style={{ width: 14, height: 14 }} />
              Mois précédent
            </button>

            {/* Center: Current Month Title */}
            <h2 style={{
              fontSize: 17,
              fontWeight: 800,
              color: '#0F172A',
              margin: 0,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.01em',
            }}>
              {MONTH_NAMES_FR[currentMonth]} {currentYear}
            </h2>

            {/* Right: Next month button */}
            <button
              onClick={handleNextMonth}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                background: '#1E3A8A',
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Mois suivant
              <ChevronRight style={{ width: 14, height: 14 }} />
            </button>
          </div>

          {/* Matrix table */}
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {/* Table Header: Vehicles column + Days columns */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `220px repeat(${daysInCurrentMonth}, minmax(36px, 1fr))`,
              minWidth: 220 + daysInCurrentMonth * 36,
              background: '#F8FAFC',
              borderBottom: '1px solid #CBD5E1',
            }}>
              <div style={{
                padding: '10px 14px',
                fontSize: 11,
                fontWeight: 800,
                color: '#334155',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                borderRight: '1px solid #E2E8F0',
                background: '#F1F5F9',
              }}>
                VÉHICULES
              </div>

              {matrixDays.map(d => (
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
                    fontSize: 11.5,
                    fontWeight: d.isToday ? 800 : 700,
                    color: d.isToday ? '#0B7584' : '#0F172A',
                  }}>
                    {d.dayNum}
                  </div>
                  <div style={{
                    fontSize: 8.5,
                    fontWeight: 600,
                    color: d.isToday ? '#0B7584' : '#64748B',
                  }}>
                    {d.dayName}
                  </div>
                </div>
              ))}
            </div>

            {/* Matrix Rows: Each Vehicle */}
            {FLEET_VEHICLES.map(car => {
              const carBks = schedule.filter(b => {
                if (b.carId !== car.id) return false
                const start = new Date(b.startDate)
                const end = new Date(b.endDate)
                const mStart = new Date(currentYear, currentMonth, 1)
                const mEnd = new Date(currentYear, currentMonth, daysInCurrentMonth, 23, 59, 59)
                return start <= mEnd && end >= mStart
              })

              return (
                <div
                  key={car.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `220px repeat(${daysInCurrentMonth}, minmax(36px, 1fr))`,
                    minWidth: 220 + daysInCurrentMonth * 36,
                    borderBottom: '1px solid #E2E8F0',
                    minHeight: 56,
                    alignItems: 'stretch',
                    background: '#FFFFFF',
                    position: 'relative',
                  }}
                >
                  {/* Left Vehicle cell */}
                  <div style={{
                    padding: '8px 12px',
                    borderRight: '1px solid #E2E8F0',
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    position: 'sticky',
                    left: 0,
                    zIndex: 5,
                    boxShadow: '2px 0 4px rgba(0,0,0,0.02)',
                  }}>
                    <div style={{
                      position: 'relative',
                      width: 40,
                      height: 28,
                      borderRadius: 4,
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

                    <div style={{ minWidth: 0 }}>
                      <p style={{
                        fontSize: 11.5,
                        fontWeight: 800,
                        color: '#0F172A',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {car.name}
                      </p>
                      <p style={{ fontSize: 9.5, color: '#64748B', margin: 0, fontFamily: 'monospace' }}>
                        {car.plate}
                      </p>
                    </div>
                  </div>

                  {/* Day cells with striped background */}
                  <div
                    style={{
                      gridColumn: `2 / span ${daysInCurrentMonth}`,
                      position: 'relative',
                      display: 'grid',
                      gridTemplateColumns: `repeat(${daysInCurrentMonth}, 1fr)`,
                      minHeight: 56,
                    }}
                    className="cal-stripes"
                  >
                    {/* Vertical grid lines */}
                    {matrixDays.map(d => (
                      <div
                        key={d.dayNum}
                        style={{
                          borderRight: '1px solid #E2E8F0',
                          height: '100%',
                          background: d.isToday ? 'rgba(11, 117, 132, 0.05)' : 'transparent',
                        }}
                      />
                    ))}

                    {/* Booking bars */}
                    {carBks.map(b => {
                      const bStart = new Date(b.startDate)
                      const bEnd = new Date(b.endDate)

                      let startDay = 1
                      let endDay = daysInCurrentMonth

                      if (bStart.getFullYear() === currentYear && bStart.getMonth() === currentMonth) {
                        startDay = bStart.getDate()
                      }
                      if (bEnd.getFullYear() === currentYear && bEnd.getMonth() === currentMonth) {
                        endDay = bEnd.getDate()
                      }

                      const colStart = Math.max(1, startDay)
                      const colSpan = Math.max(1, endDay - colStart + 1)

                      return (
                        <div
                          key={b.id}
                          style={{
                            position: 'absolute',
                            left: `calc(${((colStart - 1) / daysInCurrentMonth) * 100}% + 2px)`,
                            width: `calc(${(colSpan / daysInCurrentMonth) * 100}% - 4px)`,
                            top: 8,
                            bottom: 8,
                            background: b.status === 'active' ? '#059669' : '#0B7584',
                            borderRadius: 6,
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 6px',
                            color: '#FFFFFF',
                            overflow: 'hidden',
                            zIndex: 2,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                          }}
                        >
                          <span style={{
                            fontSize: 9.5,
                            fontWeight: 800,
                            padding: '1px 4px',
                            borderRadius: 3,
                            background: 'rgba(255,255,255,0.25)',
                            marginRight: 4,
                            fontFamily: 'monospace',
                            flexShrink: 0,
                          }}>
                            N°{b.clientIndex}
                          </span>
                          <span style={{
                            fontSize: 11,
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {b.clientName}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

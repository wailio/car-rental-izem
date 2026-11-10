'use client'

export const runtime = 'edge'

import { useState, useMemo, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import {
  Car,
  Search,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Calendar,
  X,
  Filter,
  Trash2,
  Check,
  ChevronRight,
  ChevronDown,
  User,
  Plus,
  Key,
} from 'lucide-react'
import { showIosToast, showIosConfirm } from '@/components/ui/ios-dialog'

// ── Date Selection Constants ──────────────────────────────────────────────────
const MONTHS = [
  { num: 1, name: 'Janvier', short: 'Janv.' },
  { num: 2, name: 'Février', short: 'Févr.' },
  { num: 3, name: 'Mars', short: 'Mars' },
  { num: 4, name: 'Avril', short: 'Avr.' },
  { num: 5, name: 'Mai', short: 'Mai' },
  { num: 6, name: 'Juin', short: 'Juin' },
  { num: 7, name: 'Juillet', short: 'Juil.' },
  { num: 8, name: 'Août', short: 'Août' },
  { num: 9, name: 'Septembre', short: 'Sept.' },
  { num: 10, name: 'Octobre', short: 'Oct.' },
  { num: 11, name: 'Novembre', short: 'Nov.' },
  { num: 12, name: 'Décembre', short: 'Déc.' },
]

const CURRENT_YEAR = 2026
const NEXT_YEAR = 2027

// ── Color Interpolation System towards Red ────────────────────────────────────
// As rental time passes, color transitions:
// 100% -> Dark Green (Just taken) -> Lime -> Yellow -> Orange -> Intense Red (<= 24h / expired)
// When not rented (available) -> Fully Red ring
function getTimeRemainingColor(percentRemaining: number): string {
  const p = Math.max(0, Math.min(100, percentRemaining))
  if (p >= 75) {
    const t = (p - 75) / 25 // 0 (at 75) to 1 (at 100)
    // Lime rgb(132, 204, 22) -> Dark Green rgb(16, 185, 129)
    const r = Math.round(132 + (16 - 132) * t)
    const g = Math.round(204 + (185 - 204) * t)
    const b = Math.round(22 + (129 - 22) * t)
    return `rgb(${r}, ${g}, ${b})`
  } else if (p >= 50) {
    const t = (p - 50) / 25 // 0 (at 50) to 1 (at 75)
    // Yellow rgb(234, 179, 8) -> Lime rgb(132, 204, 22)
    const r = Math.round(234 + (132 - 234) * t)
    const g = Math.round(179 + (204 - 179) * t)
    const b = Math.round(8 + (22 - 8) * t)
    return `rgb(${r}, ${g}, ${b})`
  } else if (p >= 25) {
    const t = (p - 25) / 25 // 0 (at 25) to 1 (at 50)
    // Orange rgb(249, 115, 22) -> Yellow rgb(234, 179, 8)
    const r = Math.round(249 + (234 - 249) * t)
    const g = Math.round(115 + (179 - 115) * t)
    const b = Math.round(22 + (8 - 22) * t)
    return `rgb(${r}, ${g}, ${b})`
  } else {
    const t = p / 25 // 0 (at 0) to 1 (at 25)
    // Intense Red rgb(239, 68, 68) -> Orange rgb(249, 115, 22)
    const r = Math.round(239 + (249 - 239) * t)
    const g = Math.round(68 + (115 - 68) * t)
    const b = Math.round(68 + (22 - 68) * t)
    return `rgb(${r}, ${g}, ${b})`
  }
}

function getRgbaColor(percentRemaining: number, alpha: number): string {
  const p = Math.max(0, Math.min(100, percentRemaining))
  let r = 239, g = 68, b = 68
  if (p >= 75) {
    const t = (p - 75) / 25
    r = Math.round(132 + (16 - 132) * t)
    g = Math.round(204 + (185 - 204) * t)
    b = Math.round(22 + (129 - 22) * t)
  } else if (p >= 50) {
    const t = (p - 50) / 25
    r = Math.round(234 + (132 - 234) * t)
    g = Math.round(179 + (204 - 179) * t)
    b = Math.round(8 + (22 - 8) * t)
  } else if (p >= 25) {
    const t = (p - 25) / 25
    r = Math.round(249 + (234 - 249) * t)
    g = Math.round(115 + (179 - 115) * t)
    b = Math.round(22 + (8 - 22) * t)
  } else {
    const t = p / 25
    r = Math.round(239 + (249 - 239) * t)
    g = Math.round(68 + (115 - 68) * t)
    b = Math.round(68 + (22 - 68) * t)
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

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

const LIVE_FLEET: LiveRentalVehicle[] = [
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
];

function formatCarTitle(name: string) {
  const parts = name.split(' ')
  if (parts.length <= 2) {
    return (
      <span style={{ fontFamily: 'var(--font-heading)' }}>
        <span style={{ fontWeight: 400 }}>{name}</span>
      </span>
    )
  }
  const main = parts.slice(0, 2).join(' ')
  const rest = parts.slice(2).join(' ')
  return (
    <span style={{ fontFamily: 'var(--font-heading)' }}>
      <span style={{ fontWeight: 300 }}>{main} </span>
      <span style={{ fontWeight: 800 }}>{rest}</span>
    </span>
  )
}

function getCarDisplayName(product?: string): string {
  if (!product || !product.trim()) return 'Audi A3 Sportback'
  const p = product.trim()

  const match = LIVE_FLEET.find(
    c => c.name.toLowerCase() === p.toLowerCase() || p.toLowerCase().includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(p.toLowerCase())
  )
  if (match) return match.name

  if (/salon|salle|chambre|meuble|prestige|table/i.test(p)) {
    return 'Audi A3 Sportback'
  }

  return p
}

export default function LiveRentalsPage() {
  const [fleet, setFleet] = useState<LiveRentalVehicle[]>(LIVE_FLEET)
  const [filter, setFilter] = useState<'all' | 'rented' | 'available'>('all')
  const [search, setSearch] = useState('')

  // ── Right Slide Drawer State ──
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null)
  const [isDrawerMounted, setIsDrawerMounted] = useState(false)
  const [isDrawerActive, setIsDrawerActive] = useState(false)
  const drawerBodyRef = useRef<HTMLDivElement>(null)

  // ── Assignment Mode State (Triggered by "Associer à un véhicule") ──
  const [isAssignmentMode, setIsAssignmentMode] = useState(false)
  const [assignSelectedCarId, setAssignSelectedCarId] = useState<number>(1)
  const [assignClientName, setAssignClientName] = useState('')
  const [assignClientPhone, setAssignClientPhone] = useState('')
  const [assignDates, setAssignDates] = useState('')
  const [assignPickupLocation, setAssignPickupLocation] = useState('Aéroport Houari Boumediene (T4)')
  const [assignOrderId, setAssignOrderId] = useState('')
  const [assignRequestedModel, setAssignRequestedModel] = useState('')

  // Load saved fleet from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('izem_live_fleet')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFleet(parsed)
        }
      }
    } catch {}
  }, [])

  // ── Date of Today Auto Pre-Fill ──
  const today = useMemo(() => new Date(), [])
  const todayDay = useMemo(() => String(today.getDate()).padStart(2, '0'), [today])
  const todayMonth = useMemo(() => today.getMonth() + 1, [today])
  const todayYear = useMemo(() => today.getFullYear(), [today])

  // ── Driver Assignment Form State ──
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [handoverDay, setHandoverDay] = useState(todayDay)
  const [handoverMonth, setHandoverMonth] = useState<number>(todayMonth)
  const [handoverYear, setHandoverYear] = useState<number>(todayYear)
  const [rentalDays, setRentalDays] = useState<number>(3)
  const [durationInput, setDurationInput] = useState('3 jours')
  const [pickupPlace, setPickupPlace] = useState('Aéroport Houari Boumediene (T4)')

  // ── Vertical Dropdown Toggles ──
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false)
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false)
  const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false)

  // Duration options: smart filtering on typed digits (max 30 days)
  const durationOptions = useMemo(() => {
    const base = [1, 2, 3, 4, 5, 6, 7]
    const raw = durationInput.trim()

    // If input is formatted like "X jours" or "X jour" (not typing digits alone)
    if (raw.includes('jour')) {
      return base
    }

    const digits = raw.replace(/\D/g, '')
    if (!digits) {
      return base
    }

    const parsed = parseInt(digits, 10)
    if (parsed > 30) {
      return [30]
    }

    // Filter 1..30 for numbers starting with the typed digits (e.g. 1 -> 1, 10..19; 14 -> 14; 22 -> 22)
    const matches = Array.from({ length: 30 }, (_, i) => i + 1).filter((d) =>
      String(d).startsWith(digits)
    )

    if (matches.length > 0) {
      return matches
    }

    return [Math.min(parsed, 30)]
  }, [durationInput])

  const selectedCar = useMemo(() => {
    if (selectedCarId === null) return null
    return fleet.find((c) => c.id === selectedCarId) || null
  }, [fleet, selectedCarId])

  const selectedCarPercent = useMemo(() => {
    if (!selectedCar || selectedCar.status !== 'rented' || !selectedCar.rental) return 0
    return Math.max(
      0,
      Math.min(
        100,
        Math.round((selectedCar.rental.remainingHours / selectedCar.rental.totalHours) * 100)
      )
    )
  }, [selectedCar])

  const selectedCarConditionColor = useMemo(() => {
    return getTimeRemainingColor(selectedCarPercent)
  }, [selectedCarPercent])

  const openDrawer = (carId: number) => {
    setIsAssignmentMode(false)
    setSelectedCarId(carId)
    setClientName('')
    setClientPhone('')
    setHandoverDay(todayDay)
    setHandoverMonth(todayMonth)
    setHandoverYear(todayYear)
    setRentalDays(3)
    setDurationInput('3 jours')
    setIsMonthDropdownOpen(false)
    setIsYearDropdownOpen(false)
    setIsDurationDropdownOpen(false)
    setIsDrawerMounted(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsDrawerActive(true)
      })
    })
  }

  const openAssignmentDrawer = (info: any) => {
    setIsAssignmentMode(true)
    setSelectedCarId(null)
    setAssignClientName(info.clientName || 'Client')
    setAssignClientPhone(info.clientPhone || '')
    setAssignDates(info.dates || '1 nov. → 8 nov. 2026')
    setAssignPickupLocation(info.pickupLocation || 'Aéroport Houari Boumediene (T4)')
    setAssignOrderId(info.orderId || '')
    const carModel = getCarDisplayName(info.requestedCar)
    setAssignRequestedModel(carModel)

    // Match requested car with fleet
    let foundId = 1
    if (carModel) {
      const q = String(carModel).toLowerCase().trim()
      const match = fleet.find(c => c.name.toLowerCase().includes(q) || q.includes(c.name.toLowerCase()))
      if (match) foundId = match.id
    }
    setAssignSelectedCarId(foundId)

    setIsDrawerMounted(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsDrawerActive(true)
      })
    })
  }

  // Auto-detect incoming assignment request from /admin/orders or sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    const searchParams = new URLSearchParams(window.location.search)
    const assignParam = searchParams.get('assign')
    const sessionRaw = sessionStorage.getItem('pending_car_assignment')

    let data: any = null
    if (sessionRaw) {
      try { data = JSON.parse(sessionRaw) } catch {}
    } else if (assignParam === '1') {
      data = {
        orderId: searchParams.get('order_id') || '',
        clientName: searchParams.get('name') || '',
        clientPhone: searchParams.get('phone') || '',
        requestedCar: searchParams.get('car') || '',
        dates: searchParams.get('dates') || '1 nov. → 8 nov. 2026',
      }
    }

    if (data && (data.clientName || data.orderId)) {
      openAssignmentDrawer(data)
    }
  }, [])

  const handleConfirmAssignment = () => {
    if (!assignClientName.trim()) {
      showIosToast('Veuillez renseigner le nom du client', 'error')
      return
    }

    const targetCar = fleet.find(c => c.id === assignSelectedCarId)
    if (!targetCar) return

    const updatedFleet = fleet.map(c => {
      if (c.id === assignSelectedCarId) {
        return {
          ...c,
          nextInLine: {
            clientName: assignClientName.trim(),
            phone: assignClientPhone.trim() || '0550 12 34 56',
            dates: assignDates.trim() || '1 nov. → 8 nov. 2026',
            startDate: assignDates.split('→')[0]?.trim() || '1 nov.',
            endDate: assignDates.split('→')[1]?.trim() || '8 nov.',
            pickupLocation: assignPickupLocation,
            orderId: assignOrderId,
          }
        }
      }
      return c
    })

    setFleet(updatedFleet)
    try {
      localStorage.setItem('izem_live_fleet', JSON.stringify(updatedFleet))
      if (assignOrderId) {
        const prev = JSON.parse(localStorage.getItem('assigned_order_ids') || '[]')
        if (!prev.includes(assignOrderId)) {
          prev.push(assignOrderId)
          localStorage.setItem('assigned_order_ids', JSON.stringify(prev))
        }
      }
      sessionStorage.removeItem('pending_car_assignment')
    } catch {}

    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/admin/sales')
    }

    showIosToast(`${assignClientName.trim()} est désormais suivant en ligne sur ${targetCar.name} ✓`, 'success')
    closeDrawer()
  }

  const handleRemoveNextInLine = async (carId: number) => {
    const car = fleet.find(c => c.id === carId)
    const client = car?.nextInLine?.clientName || 'le client'
    const confirmed = await showIosConfirm({
      title: 'Retirer de la file d\'attente ?',
      message: `Voulez-vous retirer ${client} de la liste "Suivant en ligne" pour ce véhicule ?`,
      confirmText: 'Retirer',
      cancelText: 'Annuler',
      isDestructive: true,
    })
    if (!confirmed) return

    const updatedFleet = fleet.map(c => {
      if (c.id === carId) {
        const { nextInLine, ...rest } = c
        return rest
      }
      return c
    })

    setFleet(updatedFleet)
    try {
      localStorage.setItem('izem_live_fleet', JSON.stringify(updatedFleet))
    } catch {}
    showIosToast('Client retiré de la file d\'attente ✓', 'info')
  }

  const closeDrawer = () => {
    setIsDrawerActive(false)
    setIsMonthDropdownOpen(false)
    setIsYearDropdownOpen(false)
    setIsDurationDropdownOpen(false)
    setTimeout(() => {
      setIsDrawerMounted(false)
      setSelectedCarId(null)
      setIsAssignmentMode(false)
    }, 320)
  }

  // Prevent background website scrolling while drawer is open
  useEffect(() => {
    if (!isDrawerMounted) return
    const originalBody = document.body.style.overflow
    const originalHtml = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMonthDropdownOpen || isYearDropdownOpen || isDurationDropdownOpen) {
          setIsMonthDropdownOpen(false)
          setIsYearDropdownOpen(false)
          setIsDurationDropdownOpen(false)
          return
        }
        closeDrawer()
      }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = originalBody
      document.documentElement.style.overflow = originalHtml
      window.removeEventListener('keydown', onKey)
    }
  }, [isDrawerMounted, isMonthDropdownOpen, isYearDropdownOpen, isDurationDropdownOpen])

  // Close any open date or duration dropdown if clicking outside
  useEffect(() => {
    if (!isMonthDropdownOpen && !isYearDropdownOpen && !isDurationDropdownOpen) return

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      if (!target.closest('[data-dropdown-container]')) {
        setIsMonthDropdownOpen(false)
        setIsYearDropdownOpen(false)
        setIsDurationDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
    }
  }, [isMonthDropdownOpen, isYearDropdownOpen, isDurationDropdownOpen])

  const handleDeleteDriver = async (carId: number) => {
    const car = fleet.find(c => c.id === carId)
    const clientLabel = car?.rental?.clientName ? `le conducteur ${car.rental.clientName}` : 'le conducteur actuel'
    const confirmed = await showIosConfirm({
      title: 'Supprimer le conducteur ?',
      message: `Voulez-vous retirer ${clientLabel} et libérer ce véhicule ?`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      isDestructive: true,
    })
    if (!confirmed) return

    setFleet((prev) =>
      prev.map((c) => {
        if (c.id === carId) {
          return {
            ...c,
            status: 'available',
            rental: undefined,
          }
        }
        return c
      })
    )
    setClientName('')
    setClientPhone('')
    setHandoverDay(todayDay)
    setHandoverMonth(todayMonth)
    setHandoverYear(todayYear)
    setRentalDays(3)
    setDurationInput('3 jours')
    showIosToast('Conducteur retiré. Le véhicule est disponible pour une nouvelle attribution.', 'info')
  }

  const handleAssignDriver = (carId: number) => {
    if (!clientName.trim()) {
      showIosToast('Veuillez écrire le nom du client', 'error')
      return
    }
    const dayNum = parseInt(handoverDay, 10)
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
      showIosToast('Veuillez écrire un jour valide (entre 1 et 31)', 'error')
      return
    }

    const monthObj = MONTHS.find((m) => m.num === handoverMonth) || MONTHS[9]
    const startDateText = `${dayNum} ${monthObj.short.toLowerCase()} ${handoverYear}`

    const startObj = new Date(handoverYear, handoverMonth - 1, dayNum, 10, 0)
    const days = Math.min(rentalDays || 3, 30)
    const endObj = new Date(startObj.getTime() + days * 24 * 3600 * 1000)
    const endDay = endObj.getDate()
    const endMonthObj = MONTHS[endObj.getMonth()] || monthObj
    const endYear = endObj.getFullYear()
    const endDateText = `${endDay} ${endMonthObj.short.toLowerCase()} ${endYear} à 18:00`

    const totalHours = days * 24
    const remainingHours = totalHours
    const remainingText = days >= 1 ? `${days}j` : `${totalHours}h`

    setFleet((prev) =>
      prev.map((c) => {
        if (c.id === carId) {
          return {
            ...c,
            status: 'rented',
            rental: {
              clientName: clientName.trim(),
              phone: clientPhone.trim() || '0550 12 34 56',
              startDate: startDateText,
              endDate: endDateText,
              totalHours,
              remainingHours,
              remainingText,
              pickupLocation: pickupPlace,
            },
          }
        }
        return c
      })
    )

    setClientName('')
    setClientPhone('')
    setHandoverDay(todayDay)
    setHandoverMonth(todayMonth)
    setHandoverYear(todayYear)
    setRentalDays(3)
    setDurationInput('3 jours')
    showIosToast(`Le véhicule a été attribué à ${clientName.trim()} avec succès !`, 'success')
  }

  const filteredCars = useMemo(() => {
    return fleet.filter((car) => {
      if (filter === 'rented' && car.status !== 'rented') return false
      if (filter === 'available' && car.status !== 'available') return false

      if (search.trim()) {
        const q = search.toLowerCase().trim()
        const matchName = car.name.toLowerCase().includes(q)
        const matchClient = car.rental?.clientName.toLowerCase().includes(q)
        const matchPlate = car.plate.toLowerCase().includes(q)
        return matchName || matchClient || matchPlate
      }
      return true
    })
  }, [fleet, filter, search])

  // Donut geometry constants
  const size = 96
  const strokeWidth = 8
  const center = size / 2
  const radius = center - strokeWidth
  const circumference = 2 * Math.PI * radius

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', cursor: 'default' }}>
      <style>{`
        /* ── Apple Build OS Floating White Cards with Ambient Halo & Interactive Clicking ── */
        .live-car-card {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 24px;
          box-shadow: 
            0 1px 2px rgba(15, 23, 42, 0.02),
            0 4px 16px -2px rgba(15, 23, 42, 0.04),
            0 12px 32px -4px rgba(15, 23, 42, 0.025);
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease, border-color 0.22s ease;
          cursor: pointer;
          user-select: none;
        }
        .live-car-card:hover {
          border-color: rgba(0, 0, 0, 0.14);
          box-shadow: 
            0 2px 6px rgba(15, 23, 42, 0.04),
            0 12px 32px -4px rgba(15, 23, 42, 0.08),
            0 24px 48px -8px rgba(15, 23, 42, 0.05);
          transform: translateY(-2.5px) scale(1.003);
        }
        .live-car-card:active {
          transform: translateY(0px) scale(0.993);
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
        }

        /* ── Apple iOS Segmented Control Tabs ── */
        .adm-tab-bar {
          display: inline-flex;
          background: #E8EAED;
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 14px;
          padding: 3px;
          gap: 2px;
        }
        .adm-tab {
          padding: 6px 14px;
          border-radius: 11px;
          font-size: 12px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
          background: transparent;
          color: #64748B;
        }
        .adm-tab:hover { color: #0F172A; }
        .adm-tab-active {
          background: #FFFFFF !important;
          color: #0F172A !important;
          font-weight: 600 !important;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04) !important;
        }

        .tnum { font-variant-numeric: tabular-nums; }
      `}</style>

      {/* ── Sticky Top Header: Apple frosted header ─────────────────────────────── */}
      <div style={{
        background: 'rgba(245, 245, 247, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        padding: '16px clamp(16px,3vw,28px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        {/* Title with Thin + Bold signature */}
        <div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 20,
            fontWeight: 400,
            color: '#0F172A',
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            Locations en cours <span style={{ fontWeight: 800 }}>• Direct Parc</span>
          </h1>
          <p style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
            Surveillance du parc en temps réel · {fleet.filter(c => c.status === 'rented').length} véhicules en circulation · Cliquez sur une voiture pour gérer sa fiche
          </p>
        </div>

        {/* Filter controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Quick tab switcher */}
          <div className="adm-tab-bar">
            <button
              onClick={() => setFilter('all')}
              className={`adm-tab ${filter === 'all' ? 'adm-tab-active' : ''}`}
            >
              Tous ({fleet.length})
            </button>
            <button
              onClick={() => setFilter('rented')}
              className={`adm-tab ${filter === 'rented' ? 'adm-tab-active' : ''}`}
            >
              En circulation ({fleet.filter(c => c.status === 'rented').length})
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`adm-tab ${filter === 'available' ? 'adm-tab-active' : ''}`}
            >
              Au parc ({fleet.filter(c => c.status === 'available').length})
            </button>
          </div>

          {/* Quick Association Button */}
          <button
            type="button"
            onClick={() => openAssignmentDrawer({
              clientName: 'Nouveau client',
              clientPhone: '',
              requestedCar: fleet[0]?.name || '',
              dates: '1 nov. → 8 nov. 2026',
            })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 13px',
              borderRadius: 12,
              background: '#0F172A',
              color: '#FFFFFF',
              fontSize: 12,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.15s ease',
            }}
            className="hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="hidden sm:inline">Associer un client</span>
            <span className="sm:hidden">Associer</span>
          </button>
        </div>
      </div>

      {/* ── Main Container: Clean white cards and controls ─────────────────── */}
      <div style={{ padding: 'clamp(16px,2.5vw,26px) clamp(16px,3vw,32px)' }}>

        {/* Search bar */}
        <div style={{
          position: 'relative',
          maxWidth: 440,
          marginBottom: 20,
        }}>
          <Search style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 14,
            height: 14,
            color: '#94A3B8',
          }} />
          <input
            type="text"
            placeholder="Rechercher par véhicule ou client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: '#FFFFFF',
              border: '1px solid #DFE3E8',
              borderRadius: 9999,
              padding: '10px 14px 10px 38px',
              fontSize: 13,
              color: '#0F172A',
              outline: 'none',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
              }}
            >
              <X style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>

        {/* ── Big Horizontal Car Lines ─────────────────────────────────────── */}
        <div className="flex flex-col gap-4" data-pop-stagger>
          {filteredCars.map((car, idx) => {
            const isRented = car.status === 'rented' && car.rental

            // Calculate percentage of time remaining
            const percentRemaining = isRented
              ? Math.max(0, Math.min(100, Math.round((car.rental!.remainingHours / car.rental!.totalHours) * 100)))
              : 0

            const ringColor = isRented
              ? getTimeRemainingColor(percentRemaining)
              : '#EF4444' // solid red for available/empty

            // Arc draws FROM full circumference (empty, 12 o'clock) TO the target offset
            // The CSS animation arcDrawIn handles the draw; we set CSS vars for the keyframe
            const targetOffset = isRented
              ? circumference - (percentRemaining / 100) * circumference
              : 0 // 0 = full ring for "available" (100% red ring)
            const strokeDashoffset = targetOffset

            return (
              <div
                key={car.id}
                data-pop={idx % 2 === 0 ? 'left' : 'right'}
                role="button"
                tabIndex={0}
                onClick={() => openDrawer(car.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openDrawer(car.id)
                  }
                }}
                className="live-car-card group min-h-[145px] sm:min-h-[160px] flex flex-col md:flex-row items-center justify-between gap-6 p-5 sm:py-4 sm:pl-6 sm:pr-4 overflow-hidden relative"
              >
                {/* ── BACKGROUND DOT TEXTURE — full card, behind content ── */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    zIndex: 0,
                    overflow: 'hidden',
                    borderRadius: 24,
                  }}
                >
                  {/* LEFT: primary dot grid — bold anchor, long luxury dissolve to right */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `radial-gradient(circle, ${isRented ? getRgbaColor(percentRemaining, 0.72) : 'rgba(239,68,68,0.68)'} 1.5px, transparent 1.5px)`,
                      backgroundSize: '12px 12px',
                      backgroundPosition: '0px 0px',
                      WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,0.75) 16%, rgba(0,0,0,0.45) 26%, rgba(0,0,0,0.2) 38%, rgba(0,0,0,0.06) 54%, rgba(0,0,0,0.01) 70%, transparent 88%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, transparent 100%)',
                      maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,0.75) 16%, rgba(0,0,0,0.45) 26%, rgba(0,0,0,0.2) 38%, rgba(0,0,0,0.06) 54%, rgba(0,0,0,0.01) 70%, transparent 88%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, transparent 100%)',
                      WebkitMaskComposite: 'source-in',
                      maskComposite: 'intersect',
                    }}
                  />
                  {/* LEFT: secondary offset dot layer — depth rhythm */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `radial-gradient(circle, ${isRented ? getRgbaColor(percentRemaining, 0.3) : 'rgba(239,68,68,0.28)'} 1px, transparent 1px)`,
                      backgroundSize: '12px 12px',
                      backgroundPosition: '6px 6px',
                      WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 12%, rgba(0,0,0,0.14) 28%, rgba(0,0,0,0.02) 46%, transparent 62%)',
                      maskImage: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 12%, rgba(0,0,0,0.14) 28%, rgba(0,0,0,0.02) 46%, transparent 62%)',
                    }}
                  />
                  {/* LEFT: 3px edge glow anchor */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '10%',
                      left: 0,
                      bottom: '10%',
                      width: 3,
                      borderRadius: 99,
                      background: isRented
                        ? `linear-gradient(to bottom, transparent, ${getRgbaColor(percentRemaining, 0.42)} 20%, ${getRgbaColor(percentRemaining, 0.52)} 50%, ${getRgbaColor(percentRemaining, 0.42)} 80%, transparent)`
                        : 'linear-gradient(to bottom, transparent, rgba(239,68,68,0.4) 20%, rgba(239,68,68,0.5) 50%, rgba(239,68,68,0.4) 80%, transparent)',
                    }}
                  />

                  {/* RIGHT CORNER: faint echo dots — mirrored, very subtle */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `radial-gradient(circle, ${isRented ? getRgbaColor(percentRemaining, 0.2) : 'rgba(239,68,68,0.18)'} 1px, transparent 1px)`,
                      backgroundSize: '12px 12px',
                      backgroundPosition: '0px 0px',
                      WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 10%, rgba(0,0,0,0.15) 22%, transparent 38%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, transparent 100%)',
                      maskImage: 'linear-gradient(to left, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 10%, rgba(0,0,0,0.15) 22%, transparent 38%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, transparent 100%)',
                      WebkitMaskComposite: 'source-in',
                      maskComposite: 'intersect',
                    }}
                  />
                  {/* RIGHT CORNER: 3px right edge glow — mirror of left */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '15%',
                      right: 0,
                      bottom: '15%',
                      width: 2,
                      borderRadius: 99,
                      background: isRented
                        ? `linear-gradient(to bottom, transparent, ${getRgbaColor(percentRemaining, 0.18)} 30%, ${getRgbaColor(percentRemaining, 0.24)} 50%, ${getRgbaColor(percentRemaining, 0.18)} 70%, transparent)`
                        : 'linear-gradient(to bottom, transparent, rgba(239,68,68,0.16) 30%, rgba(239,68,68,0.22) 50%, rgba(239,68,68,0.16) 70%, transparent)',
                    }}
                  />

                  {/* Full-card soft color wash — ties left + right together */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: isRented
                        ? `radial-gradient(ellipse 80% 100% at 0% 50%, ${getRgbaColor(percentRemaining, 0.06)} 0%, transparent 70%), radial-gradient(ellipse 30% 60% at 100% 50%, ${getRgbaColor(percentRemaining, 0.03)} 0%, transparent 80%)`
                        : 'radial-gradient(ellipse 80% 100% at 0% 50%, rgba(239,68,68,0.055) 0%, transparent 70%), radial-gradient(ellipse 30% 60% at 100% 50%, rgba(239,68,68,0.025) 0%, transparent 80%)',
                    }}
                  />
                </div>

                {/* ── MAX LEFT SIDE: BIG DONUT CHART + CAR NAME ─────────────────── */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 22,
                  flex: 1,
                  minWidth: 0,
                  zIndex: 2,
                }}>
                  {/* Big Donut Chart — sits above dot texture with a white bg halo */}
                  <div style={{
                    width: size,
                    height: size,
                    position: 'relative',
                    flexShrink: 0,
                    borderRadius: '50%',
                    background: '#ffffff',
                    boxShadow: `0 0 0 6px rgba(255,255,255,0.92), 0 0 18px 8px rgba(255,255,255,0.75), 0 0 32px 12px ${isRented ? getRgbaColor(percentRemaining, 0.08) : 'rgba(239,68,68,0.07)'}`,
                  }}>
                    <svg
                      width={size}
                      height={size}
                      viewBox={`0 0 ${size} ${size}`}
                      style={{
                        transform: 'rotate(-90deg)',
                        filter: `drop-shadow(0 2px 8px ${ringColor}35)`,
                        overflow: 'visible',
                      }}
                    >
                      <defs>
                        <linearGradient id={`donutGrad-${car.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={ringColor} stopOpacity="0.85" />
                          <stop offset="100%" stopColor={ringColor} stopOpacity="1" />
                        </linearGradient>
                      </defs>

                      {/* Background track circle */}
                      <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="transparent"
                        stroke="rgba(0, 0, 0, 0.06)"
                        strokeWidth={strokeWidth}
                      />

                      {/* Dynamic drawing arc starting from 12 o'clock */}
                      <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="transparent"
                        stroke={`url(#donutGrad-${car.id})`}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                        className="donut-arc-draw"
                        style={{
                          '--arc-circ': `${circumference}px`,
                          '--arc-offset': `${strokeDashoffset}px`,
                          animationDelay: `${Math.min(car.id * 0.12, 0.6)}s`,
                        } as React.CSSProperties}
                      />
                    </svg>

                    {/* Donut Center Display */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      pointerEvents: 'none',
                    }}>
                      {isRented ? (
                        <>
                          <span
                            className="tnum"
                            style={{
                              fontSize: 14,
                              fontWeight: 800,
                              color: '#0F172A',
                              lineHeight: 1,
                              letterSpacing: '-0.02em',
                            }}
                          >
                            {car.rental!.remainingText}
                          </span>
                          <span style={{
                            fontSize: 9,
                            fontWeight: 800,
                            color: ringColor,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            marginTop: 3,
                          }}>
                            {percentRemaining}% REST.
                          </span>
                        </>
                      ) : (
                        <>
                          <span style={{
                            fontSize: 12.5,
                            fontWeight: 800,
                            color: '#EF4444',
                            letterSpacing: '0.04em',
                            lineHeight: 1,
                          }}>
                            LIBRE
                          </span>
                          <span style={{
                            fontSize: 9,
                            fontWeight: 600,
                            color: '#EF4444',
                            textTransform: 'uppercase',
                            marginTop: 3,
                          }}>
                            Au parc
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Just the car's name + minimal control status */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Car Name + Interactive Hint */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 style={{
                        fontSize: 'clamp(17px, 2vw, 21px)',
                        fontWeight: 700,
                        color: '#0F172A',
                        letterSpacing: '-0.02em',
                        margin: 0,
                        lineHeight: 1.2,
                      }}>
                        {car.name}
                      </h2>
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 group-hover:bg-slate-900 group-hover:text-white px-2 py-0.5 rounded-lg transition-all shrink-0">
                        <span>Gérer</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>

                    {/* Clean Status & Customer Info */}
                    <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {isRented ? (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              fontSize: 13,
                              color: '#475569',
                              fontWeight: 500,
                            }}>
                              Client : <strong style={{ color: '#0F172A', fontWeight: 700 }}>{car.rental!.clientName}</strong>
                            </span>
                            <span style={{ color: '#CBD5E1' }}>·</span>
                            <span style={{ fontSize: 12.5, color: ringColor, fontWeight: 700 }}>
                              Retour : {car.rental!.endDate}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 11.5, color: '#64748B' }}>
                            <span>Matricule : <span style={{ fontFamily: 'monospace', color: '#0F172A', background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>{car.plate}</span></span>
                            <span>·</span>
                            <span>{car.rental!.pickupLocation}</span>
                          </div>

                          {/* Quick call / WhatsApp action buttons */}
                          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                            <a
                              href={`https://wa.me/213${car.rental!.phone.replace(/\s+/g, '').replace(/^0/, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 5,
                                padding: '5px 12px',
                                borderRadius: 8,
                                background: '#ECFDF5',
                                border: '1px solid #A7F3D0',
                                color: '#047857',
                                fontSize: 11.5,
                                fontWeight: 600,
                                textDecoration: 'none',
                              }}
                            >
                              <MessageCircle style={{ width: 12, height: 12 }} />
                              WhatsApp
                            </a>
                            <a
                              href={`tel:${car.rental!.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 5,
                                padding: '5px 12px',
                                borderRadius: 8,
                                background: '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                color: '#0F172A',
                                fontSize: 11.5,
                                fontWeight: 600,
                                textDecoration: 'none',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                              }}
                            >
                              <Phone style={{ width: 12, height: 12, color: '#64748B' }} />
                              {car.rental!.phone}
                            </a>
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              padding: '2px 8px',
                              borderRadius: 99,
                              fontSize: 11,
                              fontWeight: 600,
                              background: '#FEF2F2',
                              color: '#DC2626',
                              border: '1px solid #FECACA',
                            }}>
                              <span style={{ width: 5, height: 5, borderRadius: 99, background: '#EF4444' }} />
                              Non loué · Disponible
                            </span>
                            <span style={{ fontSize: 12.5, color: '#0F172A', fontWeight: 800 }}>
                              {car.pricePerDay.toLocaleString('fr-DZ')} DA / jour
                            </span>
                          </div>

                          <p style={{ fontSize: 11.5, color: '#64748B', margin: 0, marginTop: 3 }}>
                            Matricule : <span style={{ fontFamily: 'monospace', color: '#0F172A', background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>{car.plate}</span> · Stationné au parc Agence Alger
                          </p>
                        </>
                      )}

                      {/* Suivant en ligne (Prochain client réservé) */}
                      {car.nextInLine && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation()
                            openDrawer(car.id)
                          }}
                          style={{
                            marginTop: 6,
                            padding: '6px 10px',
                            borderRadius: 10,
                            background: '#F0F9FF',
                            border: '1px solid #BAE6FD',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 8,
                            flexWrap: 'wrap',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flexWrap: 'wrap' }}>
                            <span style={{
                              fontSize: 9.5,
                              fontWeight: 800,
                              color: '#0369A1',
                              background: '#E0F2FE',
                              padding: '2px 7px',
                              borderRadius: 99,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                            }}>
                              Suivant en ligne
                            </span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                              {car.nextInLine.clientName}
                            </span>
                            <span style={{ fontSize: 11, color: '#0284C7', fontWeight: 600 }}>
                              · {car.nextInLine.dates}
                            </span>
                          </div>
                          {car.nextInLine.phone && (
                            <span style={{ fontSize: 11, color: '#0369A1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Phone style={{ width: 10, height: 10, color: '#0284C7' }} />
                              {car.nextInLine.phone}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── FAR RIGHT SIDE: BIG UNIFORM CAR IMAGE ─────────────── */}
                <div
                  style={{
                    position: 'relative',
                    borderRadius: 16,
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    zIndex: 1,
                    background: '#F1F5F9',
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                  }}
                  className="w-full sm:w-[280px] md:w-[320px] lg:w-[360px] h-[150px] sm:h-[165px]"
                >
                  <img
                    src={car.image}
                    alt={car.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className="group-hover:scale-105"
                  />
                </div>
              </div>
            )
          })}

          {filteredCars.length === 0 && (
            <div className="live-car-card p-10 text-center">
              <p style={{ color: '#64748B', fontSize: 13, margin: 0 }}>
                Aucun véhicule trouvé pour cette recherche.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* ── Right-Side Slide-Over Drawer for Car Info & Driver Management ── */}
      {isDrawerMounted && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] overflow-hidden"
        >
          {/* Backdrop (Left side ignored background effect with blur and dimming) */}
          <div
            onClick={closeDrawer}
            className={`fixed inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity duration-300 ease-out cursor-pointer ${
              isDrawerActive ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Slide-over Drawer Panel */}
          <div
            className={`fixed inset-y-0 right-0 z-[101] max-w-full flex w-full sm:max-w-xl md:max-w-2xl transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isDrawerActive ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{ willChange: 'transform' }}
          >
            <div
              className="w-full h-full bg-white border-l border-slate-200/90 shadow-[-24px_0_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden text-slate-900 overscroll-contain"
              style={{ overscrollBehavior: 'contain' }}
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
            >
              {/* Drawer Top Header */}
              <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-200/80 bg-white/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-800">
                    {isAssignmentMode ? <Key className="w-4 h-4 text-[#0284C7]" /> : <Car className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-slate-900 tracking-tight m-0 truncate">
                      {isAssignmentMode ? "Associer un Véhicule · Réservation" : "Fiche Véhicule & Attribution"}
                    </h2>
                    <p className="text-xs text-slate-500 font-normal m-0 truncate">
                      {isAssignmentMode ? "Choisissez un véhicule et confirmez les dates du client" : "Locations en cours · Parc direct"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isAssignmentMode ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-sky-50 text-sky-800 border-sky-200">
                      Attribution en cours
                    </span>
                  ) : (
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      selectedCar?.status === 'rented'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {selectedCar?.status === 'rented' ? 'En circulation' : 'Disponible au parc'}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={closeDrawer}
                    aria-label="Fermer la fiche véhicule"
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Body */}
              <div
                ref={drawerBodyRef}
                className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4 bg-[#F8FAFC] overscroll-contain pb-24"
                style={{ overscrollBehavior: 'contain' }}
              >
                {isAssignmentMode ? (
                  /* ── ASSIGNMENT WORKFLOW (Right Slide Drawer) ── */
                  <div className="space-y-4">
                    {/* Client Lead Banner */}
                    <div style={{
                      background: '#FFFFFF',
                      borderRadius: 16,
                      border: '1px solid #E2E8F0',
                      padding: '16px 18px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                        <div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Client à associer
                          </span>
                          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: '2px 0 0 0' }}>
                            {assignClientName || 'Nouveau client'}
                          </h3>
                        </div>
                        {assignRequestedModel && (
                          <span style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#92400E',
                            background: '#FEF3C7',
                            border: '1px solid #FDE68A',
                            padding: '3px 8px',
                            borderRadius: 6,
                          }}>
                            Demande : {assignRequestedModel}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8, fontSize: 12, color: '#64748B', flexWrap: 'wrap' }}>
                        {assignClientPhone && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Phone className="w-3.5 h-3.5 text-[#94A3B8]" />
                            {assignClientPhone}
                          </span>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />
                          Dates au calendrier : <strong style={{ color: '#0F172A' }}>{assignDates}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Fleet Selector (All 7 cars) */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <label style={{ fontSize: 11.5, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          1. Choisir le véhicule dans la flotte ({fleet.length} véhicules)
                        </label>
                        <span style={{ fontSize: 11, color: '#64748B' }}>
                          Sélectionnez une voiture
                        </span>
                      </div>

                      <div className="space-y-2">
                        {fleet.map((car) => {
                          const isSelected = assignSelectedCarId === car.id
                          const isRented = car.status === 'rented'
                          return (
                            <div
                              key={car.id}
                              onClick={() => setAssignSelectedCarId(car.id)}
                              style={{
                                background: isSelected ? '#FFFFFF' : '#FAFAFA',
                                border: isSelected ? '2px solid #0F172A' : '1px solid #E2E8F0',
                                borderRadius: 14,
                                padding: '10px 14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 12,
                                cursor: 'pointer',
                                boxShadow: isSelected ? '0 4px 14px rgba(15,23,42,0.08)' : 'none',
                                transition: 'all 0.15s ease',
                              }}
                              className="hover:border-slate-400"
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                                <div style={{
                                  width: 68,
                                  height: 46,
                                  borderRadius: 8,
                                  overflow: 'hidden',
                                  background: '#F1F5F9',
                                  border: '1px solid #E2E8F0',
                                  flexShrink: 0,
                                }}>
                                  <img
                                    src={car.image}
                                    alt={car.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                </div>

                                <div style={{ minWidth: 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <h4 style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                                      {car.name}
                                    </h4>
                                    {isSelected && (
                                      <span style={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: 99,
                                        background: '#0F172A',
                                        color: '#FFFFFF',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}>
                                        <Check className="w-2.5 h-2.5 text-white" />
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#64748B', marginTop: 2, flexWrap: 'wrap' }}>
                                    <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{car.plate}</span>
                                    <span>·</span>
                                    <span style={{ fontWeight: 700, color: '#0F172A' }}>
                                      {car.pricePerDay.toLocaleString('fr-DZ')} DA / jour
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                {isRented ? (
                                  <span style={{
                                    fontSize: 10.5,
                                    fontWeight: 700,
                                    color: '#B45309',
                                    background: '#FEF3C7',
                                    border: '1px solid #FDE68A',
                                    padding: '2px 8px',
                                    borderRadius: 99,
                                    display: 'inline-block',
                                  }}>
                                    En circulation (Sera suivant)
                                  </span>
                                ) : (
                                  <span style={{
                                    fontSize: 10.5,
                                    fontWeight: 700,
                                    color: '#047857',
                                    background: '#ECFDF5',
                                    border: '1px solid #A7F3D0',
                                    padding: '2px 8px',
                                    borderRadius: 99,
                                    display: 'inline-block',
                                  }}>
                                    Libre au parc
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Editable Customer Details */}
                    <div style={{
                      background: '#FFFFFF',
                      borderRadius: 16,
                      border: '1px solid #E2E8F0',
                      padding: '16px 18px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    }} className="space-y-3">
                      <label style={{ fontSize: 11.5, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
                        2. Données de la réservation (modifiables)
                      </label>

                      {/* Name input */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Nom du client *
                        </label>
                        <input
                          type="text"
                          value={assignClientName}
                          onChange={(e) => setAssignClientName(e.target.value)}
                          placeholder="Nom complet"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-slate-900 transition-colors"
                        />
                      </div>

                      {/* Phone input */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Numéro de téléphone
                        </label>
                        <input
                          type="text"
                          value={assignClientPhone}
                          onChange={(e) => setAssignClientPhone(e.target.value)}
                          placeholder="0550 12 34 56"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-slate-900 transition-colors"
                        />
                      </div>

                      {/* Dates input */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Dates choisies au calendrier
                        </label>
                        <input
                          type="text"
                          value={assignDates}
                          onChange={(e) => setAssignDates(e.target.value)}
                          placeholder="1 nov. → 8 nov. 2026"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-slate-900 transition-colors"
                        />
                      </div>

                      {/* Pickup location */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Lieu de remise des clés
                        </label>
                        <select
                          value={assignPickupLocation}
                          onChange={(e) => setAssignPickupLocation(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-colors cursor-pointer"
                        >
                          <option value="Aéroport Houari Boumediene (T4)">Aéroport Houari Boumediene (Terminal 4 International)</option>
                          <option value="Aéroport Alger (Terminal 1)">Aéroport Alger (Terminal 1 National)</option>
                          <option value="Agence Alger Centre">Agence IZEM Alger Centre</option>
                        </select>
                      </div>

                      {/* Dynamic explanation notice */}
                      {(() => {
                        const target = fleet.find(c => c.id === assignSelectedCarId)
                        if (target?.status === 'rented' && target.rental) {
                          return (
                            <div style={{
                              padding: '10px 12px',
                              borderRadius: 10,
                              background: '#FEF3C7',
                              border: '1px solid #FDE68A',
                              fontSize: 11.5,
                              color: '#92400E',
                              lineHeight: 1.4,
                            }}>
                              ℹ Ce véhicule est actuellement loué par <strong>{target.rental.clientName}</strong> jusqu&apos;au <strong>{target.rental.endDate}</strong>. En confirmant, <strong>{assignClientName || 'ce client'}</strong> sera automatiquement enregistré comme <strong>Suivant en ligne (Prochain client)</strong>.
                            </div>
                          )
                        } else {
                          return (
                            <div style={{
                              padding: '10px 12px',
                              borderRadius: 10,
                              background: '#ECFDF5',
                              border: '1px solid #A7F3D0',
                              fontSize: 11.5,
                              color: '#047857',
                              lineHeight: 1.4,
                            }}>
                              Ce véhicule est actuellement libre au parc. En confirmant, la réservation sera validée avec remise prévue pour <strong>{assignClientName || 'ce client'}</strong>.
                            </div>
                          )
                        }
                      })()}

                      {/* Confirmation button */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleConfirmAssignment}
                          className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Confirmer l&apos;attribution (Suivant en ligne)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : selectedCar ? (
                  <>
                      {/* Suivant en ligne card in normal car inspection */}
                      {selectedCar.nextInLine && (
                        <div style={{
                          background: '#F0F9FF',
                          borderRadius: 16,
                          border: '1px solid #BAE6FD',
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 12,
                        }}>
                          <div>
                            <span style={{ fontSize: 10, fontWeight: 800, color: '#0369A1', background: '#E0F2FE', padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              Suivant en ligne
                            </span>
                            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: '4px 0 0 0' }}>
                              {selectedCar.nextInLine.clientName}
                            </h4>
                            <p style={{ fontSize: 11.5, color: '#64748B', margin: '2px 0 0 0' }}>
                              Dates : {selectedCar.nextInLine.dates} · Tél : {selectedCar.nextInLine.phone}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveNextInLine(selectedCar.id)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 8,
                              background: '#FFFFFF',
                              border: '1px solid #BAE6FD',
                              color: '#DC2626',
                              fontSize: 11.5,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                            className="hover:bg-red-50"
                          >
                            Retirer
                          </button>
                        </div>
                      )}

                      {/* Uniform Car Image with Blurry effect and direct text overlay (no inner card/shape between image and text) */}
                      <div className="relative w-full h-[220px] sm:h-[235px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/90 shadow-xs shrink-0 select-none">
                        <img
                          src={selectedCar.image}
                          alt={selectedCar.name}
                          className="w-full h-full object-cover object-center filter blur-[4px] brightness-[0.34] scale-105"
                        />

                        {/* Direct text on image (NO shape/box between them), bigger text, spacious, readable, thick & thin typography */}
                        <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between text-white drop-shadow-md">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span
                              className="text-[11px] uppercase tracking-wider text-white/70 block"
                              style={{ fontWeight: 300, fontFamily: 'var(--font-heading)' }}
                            >
                              Véhicule sélectionné
                            </span>
                            <h3 className="m-0 text-lg sm:text-xl tracking-tight text-white leading-tight drop-shadow-sm mt-0.5">
                              {formatCarTitle(selectedCar.name)}
                            </h3>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 drop-shadow-sm ${
                              selectedCar.status === 'rented'
                                ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400/40'
                                : 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
                            }`}
                          >
                            {selectedCar.status === 'rented' ? 'En circulation' : 'Libre au parc'}
                          </span>
                        </div>

                        <div
                          className="grid grid-cols-2 gap-y-2.5 gap-x-4 pt-2.5 border-t border-white/20"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          <div>
                            <span className="block text-[11px]" style={{ fontWeight: 300, color: 'rgba(255, 255, 255, 0.75)' }}>
                              Immatriculation
                            </span>
                            <span className="font-mono text-xs sm:text-[13px] tracking-wider text-white" style={{ fontWeight: 800 }}>
                              {selectedCar.plate}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[11px]" style={{ fontWeight: 300, color: 'rgba(255, 255, 255, 0.75)' }}>
                              Tarif journalier
                            </span>
                            <span className="text-xs sm:text-[13px] text-white" style={{ fontWeight: 800 }}>
                              {selectedCar.pricePerDay.toLocaleString('fr-DZ')} DA / jour
                            </span>
                          </div>
                          <div>
                            <span className="block text-[11px]" style={{ fontWeight: 300, color: 'rgba(255, 255, 255, 0.75)' }}>
                              Statut actuel
                            </span>
                            <span
                              className={`text-xs sm:text-[13px] ${selectedCar.status === 'rented' ? 'text-emerald-300' : 'text-amber-200'}`}
                              style={{ fontWeight: 800 }}
                            >
                              {selectedCar.status === 'rented' ? 'En circulation' : 'Disponible au parc'}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[11px]" style={{ fontWeight: 300, color: 'rgba(255, 255, 255, 0.75)' }}>
                              Emplacement habituel
                            </span>
                            <span className="text-xs sm:text-[13px] text-white truncate block" style={{ fontWeight: 700 }}>
                              Aéroport Alger & Agence
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Driver Management Section (Brought right up so almost all is visible without scrolling) */}
                    {selectedCar.status === 'rented' && selectedCar.rental ? (
                      <div
                        className="relative overflow-hidden rounded-2xl p-3.5 sm:p-4 border transition-all duration-300 shadow-sm space-y-3"
                        style={{
                          background: `
                            radial-gradient(ellipse 65% 55% at 0% 0%, ${getRgbaColor(selectedCarPercent, 0.16)} 0%, transparent 60%),
                            radial-gradient(ellipse 65% 55% at 100% 0%, ${getRgbaColor(selectedCarPercent, 0.14)} 0%, transparent 60%),
                            radial-gradient(ellipse 70% 60% at 100% 100%, ${getRgbaColor(selectedCarPercent, 0.17)} 0%, transparent 65%),
                            radial-gradient(ellipse 70% 60% at 0% 100%, ${getRgbaColor(selectedCarPercent, 0.15)} 0%, transparent 65%),
                            radial-gradient(circle at 50% 50%, #ffffff 40%, rgba(255, 255, 255, 0.88) 100%),
                            #ffffff
                          `,
                          borderColor: getRgbaColor(selectedCarPercent, 0.32),
                          boxShadow: `0 10px 30px -6px ${getRgbaColor(selectedCarPercent, 0.15)}, 0 0 0 1px ${getRgbaColor(selectedCarPercent, 0.12)}`,
                        }}
                      >
                        {/* Luxury ambient corner depth: density fades smoothly towards the center */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl transition-all duration-500 opacity-60"
                          style={{ backgroundColor: getRgbaColor(selectedCarPercent, 0.28) }}
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -bottom-12 -left-12 w-36 h-36 rounded-full blur-2xl transition-all duration-500 opacity-55"
                          style={{ backgroundColor: getRgbaColor(selectedCarPercent, 0.24) }}
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -top-10 -left-10 w-28 h-28 rounded-full blur-xl transition-all duration-500 opacity-40"
                          style={{ backgroundColor: getRgbaColor(selectedCarPercent, 0.18) }}
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -bottom-10 -right-10 w-28 h-28 rounded-full blur-xl transition-all duration-500 opacity-40"
                          style={{ backgroundColor: getRgbaColor(selectedCarPercent, 0.18) }}
                        />

                        {/* Card Header with condition-colored pulse dot and badge */}
                        <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{
                                backgroundColor: selectedCarConditionColor,
                                boxShadow: `0 0 8px ${selectedCarConditionColor}`,
                              }}
                            />
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider m-0">
                              Conducteur actuel
                            </h4>
                          </div>
                          <span
                            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-colors flex items-center gap-1.5"
                            style={{
                              backgroundColor: getRgbaColor(selectedCarPercent, 0.12),
                              borderColor: getRgbaColor(selectedCarPercent, 0.35),
                              color: selectedCarConditionColor,
                            }}
                          >
                            <span>En cours · {selectedCar.rental.remainingText}</span>
                          </span>
                        </div>

                        <div className="relative z-10 space-y-1.5 text-xs sm:text-[12.5px] text-slate-700 pt-0.5" style={{ fontFamily: 'var(--font-heading)' }}>
                          <p className="m-0 flex items-center justify-between">
                            <span style={{ fontWeight: 300, color: '#64748B' }}>Nom du client :</span>
                            <span style={{ fontWeight: 800, color: '#0F172A' }}>{selectedCar.rental.clientName}</span>
                          </p>
                          <p className="m-0 flex items-center justify-between">
                            <span style={{ fontWeight: 300, color: '#64748B' }}>Téléphone :</span>
                            <span style={{ fontWeight: 700, color: '#0F172A' }}>{selectedCar.rental.phone}</span>
                          </p>
                          <p className="m-0 flex items-center justify-between">
                            <span style={{ fontWeight: 300, color: '#64748B' }}>Remise des clés :</span>
                            <span style={{ fontWeight: 700, color: '#0F172A' }}>{selectedCar.rental.startDate}</span>
                          </p>
                          <p className="m-0 flex items-center justify-between">
                            <span style={{ fontWeight: 300, color: '#64748B' }}>Restitution prévue :</span>
                            <span style={{ fontWeight: 800, color: '#0F172A' }}>{selectedCar.rental.endDate}</span>
                          </p>
                          <p className="m-0 flex items-center justify-between">
                            <span style={{ fontWeight: 300, color: '#64748B' }}>Lieu de prise :</span>
                            <span style={{ fontWeight: 700, color: '#0F172A' }} className="truncate max-w-[220px]">
                              {selectedCar.rental.pickupLocation}
                            </span>
                          </p>
                        </div>

                        {/* Delete current driver button */}
                        <div
                          className="relative z-10 pt-1.5 border-t"
                          style={{ borderColor: getRgbaColor(selectedCarPercent, 0.18) }}
                        >
                          <button
                            type="button"
                            onClick={() => handleDeleteDriver(selectedCar.id)}
                            className="w-full py-2.5 px-4 rounded-xl border border-red-200 bg-red-50/90 hover:bg-red-100 text-red-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 hover:border-red-300 active:scale-[0.99] shadow-2xs"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-600" />
                            <span>Supprimer le conducteur actuel</span>
                          </button>
                          <p className="text-[11px] text-slate-400 text-center mt-1 m-0">
                            Permet de libérer le véhicule et d&apos;attribuer un nouveau conducteur.
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Add Driver Form: luxury red corner-fade card (same as condition card, red for available/libre) */
                      <div
                        className="relative rounded-2xl p-3.5 sm:p-4 border transition-all duration-300 shadow-sm space-y-3"
                        style={{
                          background: `
                            radial-gradient(ellipse 65% 55% at 0% 0%, rgba(239,68,68,0.16) 0%, transparent 60%),
                            radial-gradient(ellipse 65% 55% at 100% 0%, rgba(239,68,68,0.14) 0%, transparent 60%),
                            radial-gradient(ellipse 70% 60% at 100% 100%, rgba(239,68,68,0.17) 0%, transparent 65%),
                            radial-gradient(ellipse 70% 60% at 0% 100%, rgba(239,68,68,0.15) 0%, transparent 65%),
                            radial-gradient(circle at 50% 50%, #ffffff 40%, rgba(255,255,255,0.88) 100%),
                            #ffffff
                          `,
                          borderColor: 'rgba(239,68,68,0.32)',
                          boxShadow: '0 10px 30px -6px rgba(239,68,68,0.15), 0 0 0 1px rgba(239,68,68,0.12)',
                        }}
                      >
                        {/* Luxury ambient corner blobs clipped inside */}
                        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                          <div aria-hidden="true" className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl transition-all duration-500 opacity-60" style={{ backgroundColor: 'rgba(239,68,68,0.28)' }} />
                          <div aria-hidden="true" className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full blur-2xl transition-all duration-500 opacity-55" style={{ backgroundColor: 'rgba(239,68,68,0.24)' }} />
                          <div aria-hidden="true" className="absolute -top-10 -left-10 w-28 h-28 rounded-full blur-xl transition-all duration-500 opacity-40" style={{ backgroundColor: 'rgba(239,68,68,0.18)' }} />
                          <div aria-hidden="true" className="absolute -bottom-10 -right-10 w-28 h-28 rounded-full blur-xl transition-all duration-500 opacity-40" style={{ backgroundColor: 'rgba(239,68,68,0.18)' }} />
                        </div>

                          <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: '#EF4444', boxShadow: '0 0 8px #EF4444' }}
                              />
                              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider m-0">
                                Attribuer un conducteur
                              </h4>
                            </div>
                            <span
                              className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5"
                              style={{ backgroundColor: 'rgba(239,68,68,0.10)', borderColor: 'rgba(239,68,68,0.32)', color: '#EF4444' }}
                            >
                              Libre au parc
                            </span>
                          </div>

                          {/* Client Name Input */}
                          <div className="relative z-10">
                            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                              Nom du conducteur / client *
                            </label>
                            <input
                              type="text"
                              value={clientName}
                              onChange={(e) => setClientName(e.target.value)}
                              placeholder="ex: Farid Khelifi"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-slate-900 transition-colors shadow-2xs"
                            />
                          </div>

                          <div className={`relative ${isMonthDropdownOpen || isYearDropdownOpen ? 'z-50' : 'z-20'}`}>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                              Date de remise des clés
                            </label>
                            <div className="grid grid-cols-3 gap-2 relative">
                              {/* Day (left): write with keyboard, auto-today */}
                              <div className="relative z-0">
                                <span className="block text-[10px] text-slate-400 mb-0.5 font-medium">Jour</span>
                                <input
                                  type="text"
                                  maxLength={2}
                                  value={handoverDay}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '')
                                    if (val === '' || (Number(val) >= 1 && Number(val) <= 31)) {
                                      setHandoverDay(val)
                                    }
                                  }}
                                  placeholder={todayDay}
                                  className="w-full py-2 px-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-xs font-bold text-slate-900 text-center outline-none focus:bg-white focus:border-slate-900 transition-colors shadow-2xs"
                                />
                              </div>

                              {/* Month (middle): vertical dropdown menu */}
                              <div className={`relative ${isMonthDropdownOpen ? 'z-50' : 'z-10'}`} data-dropdown-container="month">
                                <span className="block text-[10px] text-slate-400 mb-0.5 font-medium">Mois</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsMonthDropdownOpen(!isMonthDropdownOpen)
                                    setIsYearDropdownOpen(false)
                                    setIsDurationDropdownOpen(false)
                                  }}
                                  className="w-full py-2 px-2 rounded-xl border border-slate-200 bg-[#F8FAFC] hover:bg-white text-xs font-bold text-slate-900 flex items-center justify-between transition-colors shadow-2xs cursor-pointer"
                                >
                                  <span className="truncate">{MONTHS.find((m) => m.num === handoverMonth)?.name || 'Mois'}</span>
                                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isMonthDropdownOpen ? 'rotate-180 text-slate-900' : ''}`} />
                                </button>

                                {isMonthDropdownOpen && (
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[140px] mt-1.5 z-50 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-2xl max-h-52 overflow-y-auto py-1 overscroll-contain animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5">
                                    {MONTHS.map((m) => {
                                      const isSel = handoverMonth === m.num
                                      return (
                                        <button
                                          key={m.num}
                                          type="button"
                                          onClick={() => {
                                            setHandoverMonth(m.num)
                                            setIsMonthDropdownOpen(false)
                                          }}
                                          className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                                            isSel ? 'bg-slate-900 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
                                          }`}
                                        >
                                          <span>{m.name}</span>
                                          {isSel && <Check className="w-3 h-3 text-white" />}
                                        </button>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>

                              {/* Year (right): vertical menu with this year and next */}
                              <div className={`relative ${isYearDropdownOpen ? 'z-50' : 'z-10'}`} data-dropdown-container="year">
                                <span className="block text-[10px] text-slate-400 mb-0.5 font-medium">Année</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsYearDropdownOpen(!isYearDropdownOpen)
                                    setIsMonthDropdownOpen(false)
                                    setIsDurationDropdownOpen(false)
                                  }}
                                  className="w-full py-2 px-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] hover:bg-white text-xs font-bold text-slate-900 flex items-center justify-between transition-colors shadow-2xs cursor-pointer"
                                >
                                  <span>{handoverYear}</span>
                                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isYearDropdownOpen ? 'rotate-180 text-slate-900' : ''}`} />
                                </button>

                                {isYearDropdownOpen && (
                                  <div className="absolute top-full right-0 w-[110px] mt-1.5 z-50 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-2xl py-1 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5">
                                    {[CURRENT_YEAR, NEXT_YEAR].map((yr) => {
                                      const isSel = handoverYear === yr
                                      return (
                                        <button
                                          key={yr}
                                          type="button"
                                          onClick={() => {
                                            setHandoverYear(yr)
                                            setIsYearDropdownOpen(false)
                                          }}
                                          className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                                            isSel ? 'bg-slate-900 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
                                          }`}
                                        >
                                          <span>{yr}</span>
                                          {isSel && <Check className="w-3 h-3 text-white" />}
                                        </button>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Duration of rental (auto 3 days, custom typing + 1-7 vertical options) */}
                          <div className={`relative ${isDurationDropdownOpen ? 'z-40' : 'z-10'}`} data-dropdown-container="duration">
                            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 cursor-default">
                              Durée de la location
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={durationInput}
                                onFocus={(e) => {
                                  setIsDurationDropdownOpen(true)
                                  setIsMonthDropdownOpen(false)
                                  setIsYearDropdownOpen(false)
                                  e.target.select()
                                }}
                                onClick={() => {
                                  setIsDurationDropdownOpen(true)
                                  setIsMonthDropdownOpen(false)
                                  setIsYearDropdownOpen(false)
                                }}
                                onChange={(e) => {
                                  let text = e.target.value
                                  const digits = text.replace(/\D/g, '')
                                  if (digits) {
                                    const num = parseInt(digits, 10)
                                    if (num > 30) {
                                      setRentalDays(30)
                                      setDurationInput('30')
                                      showIosToast('La durée maximale de réservation est de 30 jours', 'info')
                                      return
                                    }
                                    setRentalDays(num)
                                  }
                                  setDurationInput(text)
                                }}
                                onBlur={() => {
                                  const digits = durationInput.replace(/\D/g, '')
                                  const parsed = parseInt(digits, 10)
                                  if (!isNaN(parsed) && parsed > 0) {
                                    const clamped = Math.min(parsed, 30)
                                    setRentalDays(clamped)
                                    setDurationInput(`${clamped} jour${clamped > 1 ? 's' : ''}`)
                                  } else {
                                    setRentalDays(3)
                                    setDurationInput('3 jours')
                                  }
                                }}
                                placeholder="ex: 3 jours"
                                className="w-full py-2 pl-3 pr-8 rounded-xl border border-slate-200 bg-[#F8FAFC] text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-slate-900 transition-colors shadow-2xs cursor-text"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setIsDurationDropdownOpen(!isDurationDropdownOpen)
                                  setIsMonthDropdownOpen(false)
                                  setIsYearDropdownOpen(false)
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                              >
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDurationDropdownOpen ? 'rotate-180 text-slate-900' : ''}`} />
                              </button>
                            </div>

                            {/* Vertical options: filtered by typed number, max 30 */}
                            {isDurationDropdownOpen && (
                              <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-2xl max-h-48 overflow-y-auto py-1 overscroll-contain animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5">
                                {durationOptions.map((d) => {
                                  const isSel = rentalDays === d
                                  return (
                                    <button
                                      key={d}
                                      type="button"
                                      onMouseDown={(e) => {
                                        e.preventDefault()
                                      }}
                                      onClick={() => {
                                        setRentalDays(d)
                                        setDurationInput(`${d} jour${d > 1 ? 's' : ''}`)
                                        setIsDurationDropdownOpen(false)
                                      }}
                                      className={`w-full px-3.5 py-1.5 text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                                        isSel ? 'bg-slate-900 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
                                      }`}
                                    >
                                      <span>{d} jour{d > 1 ? 's' : ''}</span>
                                      {isSel && <Check className="w-3.5 h-3.5 text-white" />}
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                          </div>

                          {/* Client Phone (optional) */}
                          <div className="relative z-0">
                            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                              Téléphone du client (optionnel)
                            </label>
                            <input
                              type="text"
                              value={clientPhone}
                              onChange={(e) => setClientPhone(e.target.value)}
                              placeholder="0550 12 34 56"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-slate-900 transition-colors shadow-2xs"
                            />
                          </div>

                          {/* Validate Button */}
                          <div className="relative z-0 pt-1">
                            <button
                              type="button"
                              onClick={() => handleAssignDriver(selectedCar.id)}
                              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-[0.99]"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Valider et mettre en circulation</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
  )
}


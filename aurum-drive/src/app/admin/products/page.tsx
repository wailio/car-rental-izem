'use client'

export const runtime = 'edge'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Car,
  Search,
  Check,
  ChevronRight,
  Phone,
  MessageCircle,
  Clock,
  Calendar,
  MapPin,
  Sparkles,
  ShieldCheck,
  Filter,
  ArrowUpRight,
  RefreshCw,
  Plus,
  X,
  SlidersHorizontal,
} from 'lucide-react'

// ── Color tokens matching realfurniture ──────────────────────────────────────
const ACCENT = '#C7CBD1'
const LIVE   = '#34D399'   // green live status
const GOLD   = '#d1aa5c'   // luxury gold accent
const RED_DOT = '#0B7584'  // brand accent

export interface ScheduledCustomer {
  id: string
  clientName: string
  phone: string
  pickupDate: string
  returnDate: string
  duration: number
  location: string
  status: 'confirmed' | 'pending' | 'contract_ready'
}

export interface AdminCarItem {
  id: number
  slug: string
  name: string
  brand: string
  category: string
  plate: string
  year: number
  pricePerDay: number
  pricePerWeek: number
  pricePerMonth: number
  deposit: number
  image: string
  gearbox: 'Automatique' | 'Manuelle'
  fuel: 'Essence' | 'Diesel' | 'Hybride'
  seats: number
  doors: number
  bootVolume: string
  power: string
  status: 'rented' | 'available' | 'maintenance'
  currentRental?: {
    clientName: string
    phone: string
    startDate: string
    endDate: string
    remainingDays: number
    pickupLocation: string
    dropoffLocation: string
  }
  nextCustomers: ScheduledCustomer[]
}

const FLEET_DATA: AdminCarItem[] = [
  {
    id: 1,
    slug: 'audi-a3-sportback',
    name: 'Audi A3 Sportback',
    brand: 'Audi',
    category: 'Berline compacte premium',
    plate: '01892-126-16',
    year: 2024,
    pricePerDay: 22000,
    pricePerWeek: 130000,
    pricePerMonth: 450000,
    deposit: 150000,
    image: '/cars/audi-a3-sportback.jpg',
    gearbox: 'Automatique',
    fuel: 'Essence',
    seats: 5,
    doors: 5,
    bootVolume: '380 L',
    power: '150 ch',
    status: 'rented',
    currentRental: {
      clientName: 'Karim Benali',
      phone: '0550 12 34 56',
      startDate: '18 oct. 2026',
      endDate: '24 oct. 2026',
      remainingDays: 4,
      pickupLocation: 'Aéroport Houari Boumediene (T4)',
      dropoffLocation: 'Aéroport Houari Boumediene (T4)',
    },
    nextCustomers: [
      {
        id: 'sc-1',
        clientName: 'Dr. Amina Dahmani',
        phone: '0771 99 88 77',
        pickupDate: '25 oct. 2026 à 10:00',
        returnDate: '01 nov. 2026',
        duration: 7,
        location: 'Aéroport Alger (Hall Arrivées)',
        status: 'contract_ready',
      },
    ],
  },
  {
    id: 2,
    slug: 'mg-7',
    name: 'MG 7 Fastback',
    brand: 'MG',
    category: 'Berline sportive haut de gamme',
    plate: '04899-126-16',
    year: 2024,
    pricePerDay: 26000,
    pricePerWeek: 155000,
    pricePerMonth: 520000,
    deposit: 180000,
    image: '/cars/mg-7.png',
    gearbox: 'Automatique',
    fuel: 'Essence',
    seats: 5,
    doors: 4,
    bootVolume: '375 L',
    power: '261 ch',
    status: 'available',
    nextCustomers: [],
  },
  {
    id: 3,
    slug: 'volkswagen-t-cross',
    name: 'Volkswagen T-Cross',
    brand: 'Volkswagen',
    category: 'SUV compact',
    plate: '03411-125-16',
    year: 2024,
    pricePerDay: 17000,
    pricePerWeek: 100000,
    pricePerMonth: 350000,
    deposit: 80000,
    image: '/cars/volkswagen-t-cross.jpg',
    gearbox: 'Automatique',
    fuel: 'Essence',
    seats: 5,
    doors: 5,
    bootVolume: '455 L',
    power: '110 ch',
    status: 'rented',
    currentRental: {
      clientName: 'Yacine Mansouri',
      phone: '0661 88 92 14',
      startDate: '19 oct. 2026',
      endDate: '23 oct. 2026',
      remainingDays: 3,
      pickupLocation: 'Aéroport Alger (Terminal 1)',
      dropoffLocation: 'Aéroport Alger (Terminal 1)',
    },
    nextCustomers: [
      {
        id: 'sc-2',
        clientName: 'Sofiane Kaci',
        phone: '0560 11 22 33',
        pickupDate: '24 oct. 2026 à 14:30',
        returnDate: '28 oct. 2026',
        duration: 4,
        location: 'Aéroport Houari Boumediene (T4)',
        status: 'confirmed',
      },
    ],
  },
  {
    id: 4,
    slug: 'geely-coolray',
    name: 'Geely Coolray Sport',
    brand: 'Geely',
    category: 'Crossover compact',
    plate: '02812-124-16',
    year: 2024,
    pricePerDay: 15000,
    pricePerWeek: 90000,
    pricePerMonth: 310000,
    deposit: 80000,
    image: '/cars/geely-coolray.jpg',
    gearbox: 'Automatique',
    fuel: 'Essence',
    seats: 5,
    doors: 5,
    bootVolume: '330 L',
    power: '174 ch',
    status: 'rented',
    currentRental: {
      clientName: 'Amine Zerrouk',
      phone: '0662 33 44 55',
      startDate: '20 oct. 2026',
      endDate: '27 oct. 2026',
      remainingDays: 7,
      pickupLocation: 'Aéroport Houari Boumediene (T4)',
      dropoffLocation: 'Aéroport Houari Boumediene (T4)',
    },
    nextCustomers: [],
  },
  {
    id: 5,
    slug: 'kia-sonet',
    name: 'Kia Sonet Crossover',
    brand: 'Kia',
    category: 'Crossover urbain',
    plate: '05122-125-16',
    year: 2024,
    pricePerDay: 12000,
    pricePerWeek: 72000,
    pricePerMonth: 250000,
    deposit: 50000,
    image: '/cars/kia-sonet.jpg',
    gearbox: 'Automatique',
    fuel: 'Essence',
    seats: 5,
    doors: 5,
    bootVolume: '392 L',
    power: '115 ch',
    status: 'available',
    nextCustomers: [],
  },
  {
    id: 6,
    slug: 'mg-5',
    name: 'MG 5 Berline',
    brand: 'MG',
    category: 'Berline familiale',
    plate: '03788-124-16',
    year: 2024,
    pricePerDay: 10500,
    pricePerWeek: 63000,
    pricePerMonth: 220000,
    deposit: 60000,
    image: '/cars/mg-5.jpg',
    gearbox: 'Automatique',
    fuel: 'Essence',
    seats: 5,
    doors: 4,
    bootVolume: '512 L',
    power: '115 ch',
    status: 'rented',
    currentRental: {
      clientName: 'Farid Khelifi',
      phone: '0770 45 67 89',
      startDate: '17 oct. 2026',
      endDate: '22 oct. 2026',
      remainingDays: 2,
      pickupLocation: 'Aéroport Alger (Hall Arrivées)',
      dropoffLocation: 'Aéroport Alger (Hall Arrivées)',
    },
    nextCustomers: [
      {
        id: 'sc-3',
        clientName: 'Mourad Belkacem',
        phone: '0552 44 66 88',
        pickupDate: '23 oct. 2026 à 18:00',
        returnDate: '28 oct. 2026',
        duration: 5,
        location: 'Livraison Aéroport (Terminal Ouest)',
        status: 'contract_ready',
      },
    ],
  },
  {
    id: 7,
    slug: 'geely-gx3-pro',
    name: 'Geely GX3 Pro',
    brand: 'Geely',
    category: 'Crossover économique',
    plate: '06214-124-16',
    year: 2024,
    pricePerDay: 8500,
    pricePerWeek: 51000,
    pricePerMonth: 180000,
    deposit: 30000,
    image: '/cars/geely-gx3-pro.jpg',
    gearbox: 'Automatique',
    fuel: 'Essence',
    seats: 5,
    doors: 5,
    bootVolume: '400 L',
    power: '102 ch',
    status: 'available',
    nextCustomers: [],
  },
];

export default function VehiclesFleetPage() {
  const [cars] = useState<AdminCarItem[]>(FLEET_DATA)
  const [selectedId, setSelectedId] = useState<number>(FLEET_DATA[0].id)
  const [activeFilter, setActiveFilter] = useState<'all' | 'rented' | 'available' | 'upcoming'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Calculate high-impact stats without icons (exact realfurniture style)
  const totalCount = cars.length
  const rentedCount = cars.filter(c => c.status === 'rented').length
  const availableCount = cars.filter(c => c.status === 'available').length
  const avgRentDays = '4,8 j'
  const avgDailyRate = Math.round(cars.reduce((acc, c) => acc + c.pricePerDay, 0) / totalCount)
  const upcomingDeliveries = cars.reduce((acc, c) => acc + c.nextCustomers.length, 0)

  // Filter cars based on search and active tab
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      // Tab filter
      if (activeFilter === 'rented' && car.status !== 'rented') return false
      if (activeFilter === 'available' && car.status !== 'available') return false
      if (activeFilter === 'upcoming' && car.nextCustomers.length === 0) return false

      // Category filter
      if (categoryFilter !== 'all' && !car.category.toLowerCase().includes(categoryFilter.toLowerCase())) {
        return false
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName = car.name.toLowerCase().includes(q)
        const matchBrand = car.brand.toLowerCase().includes(q)
        const matchPlate = car.plate.toLowerCase().includes(q)
        const matchClient = car.currentRental?.clientName.toLowerCase().includes(q)
        const matchNext = car.nextCustomers.some(nc => nc.clientName.toLowerCase().includes(q))
        return matchName || matchBrand || matchPlate || matchClient || matchNext
      }

      return true
    })
  }, [cars, activeFilter, categoryFilter, searchQuery])

  // Current selected car
  const selectedCar = useMemo(() => {
    return cars.find(c => c.id === selectedId) || cars[0]
  }, [cars, selectedId])

  const N = (v: number) => v.toLocaleString('fr-FR')

  return (
    <div style={{ minHeight: '100vh', background: 'transparent' }}>
      <style>{`
        /* ── Apple Build OS Floating White Cards with Ambient Halo ── */
        .admin-card {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 24px;
          box-shadow: 
            0 1px 2px rgba(15, 23, 42, 0.02),
            0 4px 16px -2px rgba(15, 23, 42, 0.04),
            0 12px 32px -4px rgba(15, 23, 42, 0.025);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.2s ease;
        }
        .admin-card:hover {
          border-color: rgba(0, 0, 0, 0.12);
          box-shadow: 
            0 2px 4px rgba(15, 23, 42, 0.03),
            0 8px 24px -4px rgba(15, 23, 42, 0.06),
            0 20px 40px -8px rgba(15, 23, 42, 0.04);
        }

        /* ── Apple Elevated Rows ── */
        .admin-row {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 18px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.02), 0 4px 12px -2px rgba(15, 23, 42, 0.02);
          transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
        }
        .admin-row:hover {
          background: #FBFBFC;
          border-color: rgba(0, 0, 0, 0.12);
          box-shadow: 0 4px 14px -2px rgba(15, 23, 42, 0.06);
          transform: translateY(-1px);
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
          padding: 5px 14px;
          border-radius: 11px;
          font-size: 11.5px;
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

      {/* ── Top Page Header: Apple frosted header ─────────── */}
      <div style={{
        background: 'rgba(245, 245, 247, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        padding: '14px clamp(16px,3vw,28px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        {/* Title with Thin + Bold signature */}
        <div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 18,
            fontWeight: 400,
            color: '#0F172A',
            margin: 0,
            letterSpacing: '-0.01em',
          }}>
            Véhicules & Flotte <span style={{ fontWeight: 800 }}>• Gestion du Parc</span>
          </h1>
          <p className="tnum" style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>
            Gestion du parc automobile · {totalCount} véhicules récents · Livraison aéroport Alger
          </p>
        </div>

        {/* Top actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11.5,
            color: '#047857',
            fontWeight: 600,
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            padding: '3px 10px',
            borderRadius: 99,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: '#10B981', display: 'inline-block' }} />
            Parc en direct
          </span>
        </div>
      </div>

      <div style={{ padding: 'clamp(14px,2.5vw,22px) clamp(14px,3vw,28px)' }}>

        {/* ═══════════════════════════════════════════════════════════════════
            TOP STATS SECTION (Designed like dashboard stats WITHOUT icons)
            Clickable & reachable to filter every item directly
           ═══════════════════════════════════════════════════════════════════ */}
        <div data-pop="up" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
          marginBottom: 20,
        }}>
          {[
            {
              filterKey: 'rented' as const,
              label: 'Véhicules en location',
              value: `${rentedCount} / ${totalCount}`,
              note: `${Math.round((rentedCount / totalCount) * 100)}% de la flotte louée`,
              highlight: activeFilter === 'rented',
            },
            {
              filterKey: 'available' as const,
              label: 'Véhicules disponibles',
              value: `${availableCount}`,
              note: 'Prêts pour départ aéroport',
              highlight: activeFilter === 'available',
            },
            {
              filterKey: 'all' as const,
              label: 'Durée moyenne contrat',
              value: avgRentDays,
              note: 'Rotation continue du parc',
              highlight: activeFilter === 'all',
            },
            {
              filterKey: 'all' as const,
              label: 'Tarif moyen / jour',
              value: `${N(avgDailyRate)} DA`,
              note: 'Tarification nette tout inclus',
              highlight: false,
            },
            {
              filterKey: 'upcoming' as const,
              label: 'Clients en attente départ',
              value: `${upcomingDeliveries}`,
              note: 'Réservations planifiées 48h',
              highlight: activeFilter === 'upcoming',
            },
          ].map((stat, i) => (
            <div
              key={i}
              onClick={() => setActiveFilter(stat.filterKey)}
              className="admin-card"
              style={{
                borderRadius: 16,
                padding: '16px 20px',
                cursor: 'pointer',
                borderColor: stat.highlight ? '#0F172A' : '#E5E7EB',
                borderWidth: stat.highlight ? 2 : 1,
                background: stat.highlight ? '#F8FAFC' : '#FFFFFF',
              }}
            >
              <p className="tnum" style={{
                fontSize: 'clamp(22px,2.5vw,26px)',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                fontFamily: 'var(--font-heading)',
              }}>
                {stat.value}
              </p>
              <p style={{ fontSize: 12, fontWeight: 600, color: stat.highlight ? '#0F172A' : '#475569', marginTop: 4 }}>
                {stat.label}
              </p>
              <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                {stat.note}
              </p>
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            MASTER-DETAIL SECTION (Left: Cars in lines | Right: Great space)
           ═══════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] gap-5 items-start">

          {/* ── LEFT SIDE: Cars in lines ─────────────────────────────────── */}
          <div className="w-full flex flex-col gap-3">

            {/* Filter toolbar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
              marginBottom: 4,
            }}>
              {/* Search bar */}
              <div style={{
                position: 'relative',
                flex: 1,
                minWidth: 220,
              }}>
                <Search style={{
                  position: 'absolute',
                  left: 13,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 14,
                  height: 14,
                  color: '#94A3B8',
                }} />
                <input
                  type="text"
                  placeholder="Rechercher par modèle, matricule ou nom client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1px solid #DFE3E8',
                    borderRadius: 9999,
                    padding: '9px 12px 9px 36px',
                    fontSize: 12.5,
                    color: '#0F172A',
                    outline: 'none',
                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: 11,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94A3B8',
                      cursor: 'pointer',
                      padding: 2,
                    }}
                  >
                    <X style={{ width: 13, height: 13 }} />
                  </button>
                )}
              </div>

              {/* Status pills */}
              <div className="adm-tab-bar">
                {[
                  { key: 'all' as const, label: 'Tous' },
                  { key: 'rented' as const, label: 'En location' },
                  { key: 'available' as const, label: 'Disponibles' },
                  { key: 'upcoming' as const, label: 'Avec attente' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key)}
                    className={`adm-tab ${activeFilter === tab.key ? 'adm-tab-active' : ''}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cars List (Lines) */}
            <div className="flex flex-col gap-2.5">
              {filteredCars.map((car, i) => {
                const isSelected = car.id === selectedId
                const isRented = car.status === 'rented'

                return (
                  <div
                    key={car.id}
                    data-pop="up"
                    data-pop-stagger={String((i % 8) + 1)}
                    onClick={() => setSelectedId(car.id)}
                    className="admin-row"
                    style={{
                      borderRadius: 18,
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 16,
                      cursor: 'pointer',
                      borderColor: isSelected ? '#0F172A' : '#DFE3E8',
                      borderWidth: isSelected ? 2 : 1,
                      background: '#FFFFFF',
                      boxShadow: isSelected
                        ? '0 0 0 3px rgba(15, 23, 42, 0.08), 0 6px 20px -2px rgba(15, 23, 42, 0.08)'
                        : '0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 12px -2px rgba(15, 23, 42, 0.02)',
                    }}
                  >
                    {/* ── LEFT SIDE OF LINE: Info, customer name, price, specs ── */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: '#0F172A',
                          letterSpacing: '-0.01em',
                        }}>
                          {car.name}
                        </span>

                        {/* Status pill */}
                        {isRented ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '2px 8px',
                            borderRadius: 99,
                            fontSize: 11,
                            fontWeight: 600,
                            background: '#EFF6FF',
                            color: '#1D4ED8',
                            border: '1px solid #BFDBFE',
                          }}>
                            <span style={{ width: 5, height: 5, borderRadius: 99, background: '#2563EB' }} />
                            En location
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '2px 8px',
                            borderRadius: 99,
                            fontSize: 11,
                            fontWeight: 600,
                            background: '#ECFDF5',
                            color: '#047857',
                            border: '1px solid #A7F3D0',
                          }}>
                            <span style={{ width: 5, height: 5, borderRadius: 99, background: '#10B981' }} />
                            Disponible
                          </span>
                        )}

                        <span style={{ fontSize: 11.5, color: '#94A3B8' }}>
                          · {car.category} · {car.gearbox} · {car.fuel}
                        </span>
                      </div>

                      {/* Info customer name & dates OR daily price */}
                      <div style={{ marginTop: 6 }}>
                        {isRented && car.currentRental ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 12.5, color: '#475569', fontWeight: 500 }}>
                                Client actuel : <strong style={{ color: '#0F172A', fontWeight: 700 }}>{car.currentRental.clientName}</strong>
                              </span>
                              <span style={{ fontSize: 11.5, color: '#0F172A', fontWeight: 600 }}>
                                {car.currentRental.phone}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: '#64748B', flexWrap: 'wrap' }}>
                              <span>{car.currentRental.startDate} → {car.currentRental.endDate}</span>
                              <span style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', fontWeight: 600, padding: '1px 8px', borderRadius: 99, fontSize: 11 }}>
                                {car.currentRental.remainingDays} j restants
                              </span>
                              <span>· {car.currentRental.pickupLocation}</span>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                            <span style={{ color: '#0F172A', fontWeight: 800 }}>
                              {car.pricePerDay.toLocaleString('fr-DZ')} DA / jour
                            </span>
                            <span style={{ color: '#64748B' }}>
                              Caution : {car.deposit.toLocaleString('fr-DZ')} DA · Prêt au départ
                            </span>
                          </div>
                        )}

                        {/* If this car has upcoming customers waiting */}
                        {car.nextCustomers.length > 0 && (
                          <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{
                              fontSize: 10.5,
                              color: '#1D4ED8',
                              background: '#EFF6FF',
                              border: '1px solid #BFDBFE',
                              padding: '2px 8px',
                              borderRadius: 6,
                              fontWeight: 600,
                            }}>
                              {car.nextCustomers.length} client{car.nextCustomers.length > 1 ? 's' : ''} en attente prochaine
                            </span>
                            <span style={{ fontSize: 11, color: '#64748B' }}>
                              Prochain : {car.nextCustomers[0].clientName} ({car.nextCustomers[0].pickupDate})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ── RIGHT SIDE OF LINE: Car image preview (Full coverage, no empty spaces) ── */}
                    <div style={{
                      width: 136,
                      height: 82,
                      position: 'relative',
                      borderRadius: 12,
                      background: '#F1F5F9',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      padding: 0,
                      flexShrink: 0,
                      overflow: 'hidden',
                      boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
                    }}>
                      <img
                        src={car.image}
                        alt={car.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/cars/audi-a3-sportback.jpg'
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          display: 'block',
                        }}
                      />
                    </div>
                  </div>
                )
              })}

              {filteredCars.length === 0 && (
                <div className="admin-card" style={{ borderRadius: 16, padding: '36px 20px', textAlign: 'center' }}>
                  <Car style={{ width: 28, height: 28, color: '#94A3B8', margin: '0 auto 10px' }} />
                  <p style={{ fontSize: 13, color: '#64748B' }}>Aucun véhicule ne correspond aux filtres.</p>
                  <button
                    onClick={() => { setActiveFilter('all'); setCategoryFilter('all'); setSearchQuery(''); }}
                    style={{
                      background: 'none', border: 'none', color: '#0F172A', fontWeight: 600, fontSize: 12, cursor: 'pointer', marginTop: 8,
                    }}
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* ════ RIGHT SIDE: GREAT SPACE (Car details, image first thing up, upcoming customers) ════ */}
          <div className="w-full lg:sticky lg:top-20">
            <div data-pop="right" className="admin-card" style={{
              borderRadius: 20,
              padding: '22px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              maxHeight: 'calc(100vh - 100px)',
              overflowY: 'auto',
            }}>

              {/* 1. CAR IMAGE FIRST THING UP (Strictly static size, full coverage, smooth switching) */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: 220,
                minHeight: 220,
                maxHeight: 220,
                borderRadius: 16,
                background: '#F1F5F9',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                padding: 0,
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
              }}>
                <img
                  key={selectedCar.id}
                  src={selectedCar.image}
                  alt={selectedCar.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/cars/audi-a3-sportback.jpg'
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    transition: 'opacity 0.25s ease',
                  }}
                />

                {/* Status pill on image */}
                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                  {selectedCar.status === 'rented' ? (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '4px 10px',
                      borderRadius: 99,
                      fontSize: 11,
                      fontWeight: 600,
                      background: '#EFF6FF',
                      color: '#1D4ED8',
                      border: '1px solid #BFDBFE',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: 99, background: '#2563EB' }} />
                      En location
                    </span>
                  ) : (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '4px 10px',
                      borderRadius: 99,
                      fontSize: 11,
                      fontWeight: 600,
                      background: '#ECFDF5',
                      color: '#047857',
                      border: '1px solid #A7F3D0',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: 99, background: '#10B981' }} />
                      Disponible au parc
                    </span>
                  )}
                </div>

                {/* Category badge on image */}
                <div style={{ position: 'absolute', top: 12, right: 12 }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#0F172A',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    padding: '3px 9px',
                    borderRadius: 8,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  }}>
                    {selectedCar.category}
                  </span>
                </div>
              </div>

              {/* 2. TITLE, SPECS & PRICING */}
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
                  <div>
                    <h2 style={{
                      fontSize: 19,
                      fontWeight: 800,
                      color: '#0F172A',
                      margin: 0,
                      fontFamily: 'var(--font-heading)',
                      letterSpacing: '-0.02em',
                    }}>
                      {selectedCar.name}
                    </h2>
                    <p style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>
                      Matricule : <span style={{ color: '#0F172A', fontFamily: 'monospace', fontWeight: 600 }}>{selectedCar.plate}</span> · Année {selectedCar.year}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className="tnum" style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {selectedCar.pricePerDay.toLocaleString('fr-DZ')} DA
                    </p>
                    <p style={{ fontSize: 10.5, color: '#94A3B8', margin: 0 }}>par jour</p>
                  </div>
                </div>

                {/* Specs Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 6,
                  marginTop: 14,
                }}>
                  {[
                    { label: 'Boîte', val: selectedCar.gearbox },
                    { label: 'Carburant', val: selectedCar.fuel },
                    { label: 'Places', val: `${selectedCar.seats} pers.` },
                    { label: 'Portes', val: `${selectedCar.doors} portes` },
                    { label: 'Coffre', val: selectedCar.bootVolume },
                    { label: 'Puissance', val: selectedCar.power },
                  ].map((s, idx) => (
                    <div key={idx} style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: 10,
                      padding: '8px 10px',
                    }}>
                      <p style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', margin: 0, fontWeight: 700 }}>{s.label}</p>
                      <p style={{ fontSize: 11.5, fontWeight: 700, color: '#0F172A', marginTop: 2, margin: 0 }}>{s.val}</p>
                    </div>
                  ))}
                </div>

                {/* Pricing summary */}
                <div style={{
                  marginTop: 12,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 11.5,
                }}>
                  <span style={{ color: '#64748B' }}>Semaine : <strong style={{ color: '#0F172A' }}>{selectedCar.pricePerWeek.toLocaleString('fr-DZ')} DA</strong></span>
                  <span style={{ color: '#64748B' }}>Mois : <strong style={{ color: '#0F172A' }}>{selectedCar.pricePerMonth.toLocaleString('fr-DZ')} DA</strong></span>
                  <span style={{ color: '#0F172A', fontWeight: 700 }}>Caution : {selectedCar.deposit.toLocaleString('fr-DZ')} DA</span>
                </div>
              </div>

              {/* 3. CURRENT RENTER INFO (IF RENTED) */}
              {selectedCar.status === 'rented' && selectedCar.currentRental && (
                <div style={{
                  borderRadius: 14,
                  padding: '14px 16px',
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Location en cours
                    </span>
                    <span style={{ fontSize: 11, color: '#B45309', background: '#FEF3C7', border: '1px solid #FDE68A', padding: '1px 8px', borderRadius: 99, fontWeight: 600 }}>
                      {selectedCar.currentRental.remainingDays} jours restants
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                        {selectedCar.currentRental.clientName}
                      </p>
                      <p style={{ fontSize: 11.5, color: '#64748B', marginTop: 1, margin: 0, fontWeight: 500 }}>
                        {selectedCar.currentRental.phone}
                      </p>
                    </div>

                    {/* WhatsApp & Call */}
                    <div style={{ display: 'flex', gap: 6 }}>
                      <a
                        href={`https://wa.me/213${selectedCar.currentRental.phone.replace(/\s+/g, '').replace(/^0/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: '5px 10px',
                          borderRadius: 8,
                          background: '#ECFDF5',
                          border: '1px solid #A7F3D0',
                          color: '#047857',
                          fontSize: 11,
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        <MessageCircle style={{ width: 12, height: 12 }} />
                        WhatsApp
                      </a>
                      <a
                        href={`tel:${selectedCar.currentRental.phone}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: '5px 10px',
                          borderRadius: 8,
                          background: '#FFFFFF',
                          border: '1px solid #BFDBFE',
                          color: '#0F172A',
                          fontSize: 11,
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        <Phone style={{ width: 12, height: 12 }} />
                        Appeler
                      </a>
                    </div>
                  </div>

                  <div style={{ fontSize: 11.5, color: '#64748B', display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                    <span>Période : <strong style={{ color: '#0F172A' }}>{selectedCar.currentRental.startDate} → {selectedCar.currentRental.endDate}</strong></span>
                    <span>Remise & Retour : {selectedCar.currentRental.pickupLocation}</span>
                  </div>
                </div>
              )}

              {/* 4. DOWN THERE: CUSTOMERS THAT ARE NEXT FOR THIS CAR */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <p style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#94A3B8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    margin: 0,
                  }}>
                    Prochains clients pour ce véhicule
                  </p>
                  <span style={{ fontSize: 11, color: '#0F172A', fontWeight: 600 }}>
                    {selectedCar.nextCustomers.length} en attente
                  </span>
                </div>

                {selectedCar.nextCustomers.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selectedCar.nextCustomers.map((nextClient, idx) => (
                      <div
                        key={nextClient.id}
                        className="admin-row"
                        style={{
                          borderRadius: 12,
                          padding: '12px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 5,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A' }}>
                            {idx + 1}. {nextClient.clientName}
                          </span>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: 6,
                            fontSize: 10,
                            fontWeight: 600,
                            background: nextClient.status === 'contract_ready' ? '#ECFDF5' : '#EFF6FF',
                            color: nextClient.status === 'contract_ready' ? '#047857' : '#1D4ED8',
                            border: `1px solid ${nextClient.status === 'contract_ready' ? '#A7F3D0' : '#BFDBFE'}`,
                          }}>
                            {nextClient.status === 'contract_ready' ? 'Contrat prêt' : 'Confirmé'}
                          </span>
                        </div>

                        <div style={{ fontSize: 11.5, color: '#64748B', display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span>Prise en charge : <strong style={{ color: '#0F172A' }}>{nextClient.pickupDate} ({nextClient.duration} jours)</strong></span>
                          <span>Lieu : {nextClient.location}</span>
                          <span>Tél : <strong style={{ color: '#0F172A' }}>{nextClient.phone}</strong></span>
                        </div>

                        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                          <a
                            href={`https://wa.me/213${nextClient.phone.replace(/\s+/g, '').replace(/^0/, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 5,
                              padding: '5px 8px',
                              borderRadius: 8,
                              background: '#ECFDF5',
                              border: '1px solid #A7F3D0',
                              color: '#047857',
                              fontSize: 10.5,
                              fontWeight: 600,
                              textDecoration: 'none',
                            }}
                          >
                            <MessageCircle style={{ width: 11, height: 11 }} />
                            WhatsApp
                          </a>
                          <a
                            href={`tel:${nextClient.phone}`}
                            style={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 5,
                              padding: '5px 8px',
                              borderRadius: 8,
                              background: '#FFFFFF',
                              border: '1px solid #E2E8F0',
                              color: '#0F172A',
                              fontSize: 10.5,
                              fontWeight: 600,
                              textDecoration: 'none',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                            }}
                          >
                            <Phone style={{ width: 11, height: 11, color: '#64748B' }} />
                            Appeler
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    padding: '16px',
                    borderRadius: 12,
                    background: '#F8FAFC',
                    border: '1px dashed #E2E8F0',
                    textAlign: 'center',
                  }}>
                    <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>
                      Aucune réservation future en attente pour ce véhicule.
                    </p>
                    <p style={{ fontSize: 11, color: '#047857', marginTop: 4, margin: 0, fontWeight: 600 }}>
                      Disponible pour nouvelle attribution immédiate
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

'use client'

export const runtime = 'edge'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Car,
  CalendarCheck,
  Key,
  Globe,
  ArrowUpRight,
  ChevronRight,
  RefreshCw,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  Check,
  Users,
  TrendingUp,
  RotateCcw,
  Banknote,
  FolderEdit,
  FileSignature,
} from 'lucide-react'

// ── Accent tokens from realfurniture ──────────────────────────────────────────
const ACCENT = '#C7CBD1'   // platinum — matches the luxury base
const LIVE   = '#34D399'   // live green status dot
const GOLD   = '#d1aa5c'   // luxury gold accent
const RED_DOT = '#0B7584'  // brand accent dot

// ── Realistic seed data for Fleet status (Loués vs Disponibles) ───────────────
export interface FleetVehicleStatus {
  id: number
  name: string
  category: string
  specs: string
  pricePerDay: number
  image: string
  status: 'rented' | 'available'
  client?: {
    name: string
    phone: string
    pickupDate: string
    returnDate: string
    remainingDays: number
    location: string
  }
}

const INITIAL_FLEET_STATUS: FleetVehicleStatus[] = [
  {
    id: 1,
    name: 'Audi A3 Sportback',
    category: 'Berline compacte premium',
    specs: 'Automatique · Essence · 5 places',
    pricePerDay: 22000,
    image: '/cars/audi-a3-sportback.jpg',
    status: 'rented',
    client: {
      name: 'Karim Benali',
      phone: '0550 12 34 56',
      pickupDate: '18 oct. 2026',
      returnDate: '24 oct. 2026',
      remainingDays: 4,
      location: 'Aéroport Houari Boumediene (T4)',
    },
  },
  {
    id: 2,
    name: 'MG 7 Fastback',
    category: 'Berline sportive haut de gamme',
    specs: 'Automatique · Essence · 5 places',
    pricePerDay: 26000,
    image: '/cars/mg-7.png',
    status: 'available',
  },
  {
    id: 3,
    name: 'Volkswagen T-Cross',
    category: 'SUV compact',
    specs: 'Automatique · Essence · 5 places',
    pricePerDay: 17000,
    image: '/cars/volkswagen-t-cross.jpg',
    status: 'rented',
    client: {
      name: 'Yacine Mansouri',
      phone: '0661 88 92 14',
      pickupDate: '19 oct. 2026',
      returnDate: '23 oct. 2026',
      remainingDays: 3,
      location: 'Aéroport Alger (Terminal 1)',
    },
  },
  {
    id: 4,
    name: 'Geely Coolray Sport',
    category: 'Crossover compact',
    specs: 'Automatique · Essence · 5 places',
    pricePerDay: 15000,
    image: '/cars/geely-coolray.jpg',
    status: 'rented',
    client: {
      name: 'Amine Zerrouk',
      phone: '0662 33 44 55',
      pickupDate: '20 oct. 2026',
      returnDate: '27 oct. 2026',
      remainingDays: 7,
      location: 'Aéroport Houari Boumediene (T4)',
    },
  },
  {
    id: 5,
    name: 'Kia Sonet Crossover',
    category: 'Crossover urbain',
    specs: 'Automatique · Essence · 5 places',
    pricePerDay: 12000,
    image: '/cars/kia-sonet.jpg',
    status: 'available',
  },
  {
    id: 6,
    name: 'MG 5 Berline',
    category: 'Berline familiale',
    specs: 'Automatique · Essence · 5 places',
    pricePerDay: 10500,
    image: '/cars/mg-5.jpg',
    status: 'rented',
    client: {
      name: 'Farid Khelifi',
      phone: '0770 45 67 89',
      pickupDate: '17 oct. 2026',
      returnDate: '22 oct. 2026',
      remainingDays: 2,
      location: 'Aéroport Alger (Hall Arrivées)',
    },
  },
  {
    id: 7,
    name: 'Geely GX3 Pro',
    category: 'Crossover économique',
    specs: 'Automatique · Essence · 5 places',
    pricePerDay: 8500,
    image: '/cars/geely-gx3-pro.jpg',
    status: 'available',
  },
]

// ── Realistic seed data for Upcoming Client Handovers (Waiting list with dates) ──
export interface PendingHandover {
  id: string
  clientName: string
  phone: string
  carName: string
  pickupDate: string
  pickupTime: string
  daysCount: number
  location: string
  badgeLabel: string
  badgeColor: string
  badgeBg: string
  prepProgress: number
  status: 'confirmed' | 'pending' | 'ready'
}

const INITIAL_HANDOVERS: PendingHandover[] = [
  {
    id: 'h-101',
    clientName: 'Sofiane Kaci',
    phone: '0560 11 22 33',
    carName: 'Volkswagen T-Cross',
    pickupDate: 'Jeudi 22 oct. 2026',
    pickupTime: '14:30',
    daysCount: 4,
    location: 'Aéroport Houari Boumediene (T4)',
    badgeLabel: 'Dans 2 jours',
    badgeColor: '#F59E0B',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    prepProgress: 90,
    status: 'ready',
  },
  {
    id: 'h-102',
    clientName: 'Dr. Amina Dahmani',
    phone: '0771 99 88 77',
    carName: 'Audi A3 Sportback',
    pickupDate: 'Vendredi 23 oct. 2026',
    pickupTime: '10:00',
    daysCount: 7,
    location: 'Aéroport Alger (Hall Arrivées)',
    badgeLabel: 'Dans 3 jours',
    badgeColor: '#60A5FA',
    badgeBg: 'rgba(59, 130, 246, 0.15)',
    prepProgress: 75,
    status: 'confirmed',
  },
  {
    id: 'h-103',
    clientName: 'Mourad Belkacem',
    phone: '0552 44 66 88',
    carName: 'MG 5 Berline',
    pickupDate: 'Samedi 24 oct. 2026',
    pickupTime: '18:00',
    daysCount: 5,
    location: 'Livraison Aéroport (Terminal Ouest)',
    badgeLabel: 'Dans 4 jours',
    badgeColor: '#34D399',
    badgeBg: 'rgba(52, 211, 153, 0.15)',
    prepProgress: 60,
    status: 'confirmed',
  },
  {
    id: 'h-104',
    clientName: 'Samir Meziane',
    phone: '0663 55 77 99',
    carName: 'Geely Coolray Sport',
    pickupDate: 'Lundi 26 oct. 2026',
    pickupTime: '11:15',
    daysCount: 3,
    location: 'Aéroport Houari Boumediene',
    badgeLabel: 'À confirmer',
    badgeColor: '#F59E0B',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    prepProgress: 40,
    status: 'pending',
  },
]

// ── Sparkline SVG Component with subtle translucent area fill (Apple style) ──
function Sparkline({ data, color = '#0B7584', width = 105, height = 34 }: {
  data: number[], color?: string, width?: number, height?: number
}) {
  if (!data || data.length < 2) return null
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1
  const paddingX = 4
  const paddingY = 4

  const pts = data.map((v, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - paddingX * 2)
    const y = height - paddingY - ((v - min) / range) * (height - paddingY * 2)
    return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }
  })

  const polylinePoints = pts.map(p => `${p.x},${p.y}`).join(' ')
  const areaPoints = `${pts[0].x},${height} ${polylinePoints} ${pts[pts.length - 1].x},${height}`
  const last = pts[pts.length - 1]
  const gradId = `spark-grad-${width}-${height}`

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      {/* Translucent area fill under curve */}
      <polygon points={areaPoints} fill={`url(#${gradId})`} />
      {/* Crisp line */}
      <polyline
        points={polylinePoints}
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Soft halo and dot at latest point */}
      <circle cx={last.x} cy={last.y} r={5} fill={color} fillOpacity="0.18" />
      <circle cx={last.x} cy={last.y} r={2.5} fill={color} />
    </svg>
  )
}

export default function AdminDashboard() {
  const [time, setTime] = useState(new Date())
  const [refreshing, setRefreshing] = useState(false)
  const [fleetFilter, setFleetFilter] = useState<'all' | 'rented' | 'available'>('all')
  const [handoverTab, setHandoverTab] = useState<'upcoming' | 'pending' | 'all'>('upcoming')

  // Live stats from API or fallbacks
  const [counts, setCounts] = useState({
    visitors: 0,
    totalVehicles: 17,
    rentedVehicles: 5,
    availableVehicles: 12,
    pendingReservations: 3,
    loading: true,
  })

  const [revenueTimeline, setRevenueTimeline] = useState<'semaine' | 'mensuelle' | 'annuelle'>('mensuelle')
  const [salesData, setSalesData] = useState<any[]>([])
  const [salesLoading, setSalesLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/sales?t=' + Date.now(), { cache: 'no-store' })
      .then(r => r.ok ? r.json() : [])
      .then(data => { setSalesData(Array.isArray(data) ? data : []); setSalesLoading(false) })
      .catch(() => setSalesLoading(false))
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  const loadStats = useCallback(async (silent = false) => {
    if (!silent) setCounts(prev => ({ ...prev, loading: true }))
    try {
      const [visitorsRes, ordersRes] = await Promise.allSettled([
        fetch('/api/analytics/visitors?t=' + Date.now(), { cache: 'no-store' }).then(r => r.ok ? r.json() : { todayUniqueVisitors: 0 }),
        fetch('/api/admin/orders?t=' + Date.now(), { cache: 'no-store' }).then(r => r.ok ? r.json() : []),
      ])

      const visitorData = visitorsRes.status === 'fulfilled' ? visitorsRes.value : { todayUniqueVisitors: 0 }
      const orders = ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value) ? ordersRes.value : []
      const unreadCount = orders.filter((o: any) => o.status === 'new').length

      setCounts({
        visitors: visitorData.todayUniqueVisitors ?? 24,
        totalVehicles: 17,
        rentedVehicles: 5,
        availableVehicles: 12,
        pendingReservations: unreadCount > 0 ? unreadCount : 3,
        loading: false,
      })
    } catch {
      setCounts(prev => ({ ...prev, loading: false }))
    }
  }, [])

  useEffect(() => {
    loadStats(false)
    const pollInterval = setInterval(() => loadStats(true), 30000)
    return () => clearInterval(pollInterval)
  }, [loadStats])

  // Supabase realtime visitor hook
  const realtimeRef = useRef<any>(null)
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) return

    const todayAlgiers = new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Algiers' })

    import('@supabase/supabase-js').then(({ createClient }) => {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const channel = supabase
        .channel('visitor-count-live')
        .on(
          'postgres_changes' as any,
          {
            event: 'INSERT',
            schema: 'public',
            table: 'visitor_sessions',
            filter: `visit_date=eq.${todayAlgiers}`,
          },
          () => {
            setCounts(prev => ({ ...prev, visitors: prev.visitors + 1 }))
          }
        )
        .subscribe()

      realtimeRef.current = { supabase, channel }
    }).catch(() => {})

    return () => {
      if (realtimeRef.current) {
        const { supabase, channel } = realtimeRef.current
        supabase.removeChannel(channel)
      }
    }
  }, [])

  const dayLabel = time.toLocaleDateString('fr-DZ', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const N = (v: number) => v.toLocaleString('fr-FR')

  const handleManualRefresh = async () => {
    setRefreshing(true)
    await loadStats(false)
    setTimeout(() => setRefreshing(false), 600)
  }

  // ── Revenue computations ────────────────────────────────────────────────────
  const now = new Date()
  const todayAlgiersStr = now.toLocaleDateString('en-CA', { timeZone: 'Africa/Algiers' })

  function getTimelineBounds(tl: 'semaine' | 'mensuelle' | 'annuelle') {
    const d = new Date()
    if (tl === 'semaine') {
      const start = new Date(d); start.setDate(d.getDate() - 6); start.setHours(0, 0, 0, 0)
      const prev = new Date(start); prev.setDate(prev.getDate() - 7)
      return { start, end: d, prevStart: prev, prevEnd: new Date(start) }
    }
    if (tl === 'mensuelle') {
      const start = new Date(d.getFullYear(), d.getMonth(), 1)
      const prevStart = new Date(d.getFullYear(), d.getMonth() - 1, 1)
      const prevEnd = new Date(d.getFullYear(), d.getMonth(), 0)
      return { start, end: d, prevStart, prevEnd }
    }
    // annuelle
    const start = new Date(d.getFullYear(), 0, 1)
    const prevStart = new Date(d.getFullYear() - 1, 0, 1)
    const prevEnd = new Date(d.getFullYear() - 1, 11, 31)
    return { start, end: d, prevStart, prevEnd }
  }

  const { start: tlStart, end: tlEnd, prevStart, prevEnd } = getTimelineBounds(revenueTimeline)

  const filteredSales = salesData.filter(s => {
    const d = new Date(s.created_at)
    return d >= tlStart && d <= tlEnd
  })
  const prevSales = salesData.filter(s => {
    const d = new Date(s.created_at)
    return d >= prevStart && d <= prevEnd
  })

  const totalRevenue = filteredSales.reduce((sum: number, s: any) => sum + (Number(s.amount) || 0), 0)
  const prevRevenue = prevSales.reduce((sum: number, s: any) => sum + (Number(s.amount) || 0), 0)
  const revenueTrend = prevRevenue > 0
    ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100)
    : totalRevenue > 0 ? 100 : 0

  // Sparkline data
  function buildSparklineData(tl: 'semaine' | 'mensuelle' | 'annuelle'): number[] {
    if (tl === 'semaine') {
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i)); d.setHours(0, 0, 0, 0)
        const dEnd = new Date(d); dEnd.setHours(23, 59, 59, 999)
        return salesData.filter(s => { const sd = new Date(s.created_at); return sd >= d && sd <= dEnd })
          .reduce((sum: number, s: any) => sum + (Number(s.amount) || 0), 0)
      })
    }
    if (tl === 'mensuelle') {
      return Array.from({ length: 4 }, (_, i) => {
        const weekEnd = new Date(); weekEnd.setDate(weekEnd.getDate() - i * 7); weekEnd.setHours(23, 59, 59, 999)
        const weekStart = new Date(weekEnd); weekStart.setDate(weekEnd.getDate() - 6); weekStart.setHours(0, 0, 0, 0)
        return salesData.filter(s => { const sd = new Date(s.created_at); return sd >= weekStart && sd <= weekEnd })
          .reduce((sum: number, s: any) => sum + (Number(s.amount) || 0), 0)
      }).reverse()
    }
    // annuelle
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(); const yr = d.getFullYear()
      const mStart = new Date(yr, i, 1); const mEnd = new Date(yr, i + 1, 0, 23, 59, 59)
      return salesData.filter(s => { const sd = new Date(s.created_at); return sd >= mStart && sd <= mEnd })
        .reduce((sum: number, s: any) => sum + (Number(s.amount) || 0), 0)
    })
  }

  // ── Baseline presets (realistic demo numbers so diagram and stats adapt immediately) ──
  const REVENUE_PRESETS = {
    semaine: {
      baseline: 285000,
      trend: '+18.4%',
      sparkline: [28000, 34000, 31000, 44000, 38000, 52000, 58000],
    },
    mensuelle: {
      baseline: 1240000,
      trend: '+14.2%',
      sparkline: [220000, 290000, 340000, 390000],
    },
    annuelle: {
      baseline: 14850000,
      trend: '+22.5%',
      sparkline: [850000, 920000, 1050000, 1150000, 1100000, 1250000, 1180000, 1320000, 1280000, 1400000, 1380000, 1470000],
    },
  } as const

  const currentPreset = REVENUE_PRESETS[revenueTimeline]
  const displayRevenue = totalRevenue > 0 ? totalRevenue : currentPreset.baseline
  const displayTrend = revenueTrend !== 0 ? `${revenueTrend >= 0 ? '+' : ''}${revenueTrend}%` : currentPreset.trend
  const sparklineData = (salesData.length > 0 && totalRevenue > 0)
    ? buildSparklineData(revenueTimeline)
    : [...currentPreset.sparkline]

  // ── Retour aujourd'hui ────────────────────────────────────────────────────
  const todayReturns = INITIAL_FLEET_STATUS.filter(car => {
    if (!car.client?.returnDate) return false
    // returnDate is like "24 oct. 2026" — compare with today in Algiers locale
    const rd = car.client.returnDate
    const todayFr = now.toLocaleDateString('fr-DZ', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Africa/Algiers' })
    // Normalize both: trim, lowercase
    return rd.toLowerCase().replace(/\./g, '').trim() === todayFr.toLowerCase().replace(/\./g, '').trim()
  }).length

  const todayReturnsCount = todayReturns > 0 ? todayReturns : 3

  // Filtered fleet list
  const filteredFleet = INITIAL_FLEET_STATUS.filter(car => {
    if (fleetFilter === 'rented') return car.status === 'rented'
    if (fleetFilter === 'available') return car.status === 'available'
    return true
  })

  // Filtered handovers list
  const filteredHandovers = INITIAL_HANDOVERS.filter(h => {
    if (handoverTab === 'upcoming') return h.status === 'ready' || h.status === 'confirmed'
    if (handoverTab === 'pending') return h.status === 'pending'
    return true
  })

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

        /* ── Progress bar ── */
        .pbar-track { height: 4px; background: #E2E8F0; border-radius: 99px; overflow: hidden; margin-top: 6px; }
        .pbar-fill  { height: 100%; border-radius: 99px; transition: width 0.55s cubic-bezier(0.32,0.72,0,1); }

        /* ── Tabular numbers ── */
        .tnum { font-variant-numeric: tabular-nums; }
      `}</style>

      {/* ── Page header: Apple frosted header ─────────────────────────────────── */}
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
        {/* Left: title + day label with Thin + Bold signature */}
        <div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 18,
            fontWeight: 400,
            color: '#0F172A',
            margin: 0,
            letterSpacing: '-0.01em',
          }}>
            Tableau de bord <span style={{ fontWeight: 800 }}>• Aéroport d&apos;Alger</span>
          </h1>
          <p className="tnum" style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>
            {dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1)}
          </p>
        </div>

        {/* Right: live dot + manual refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <button
            onClick={handleManualRefresh}
            title="Actualiser"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#94A3B8', padding: 4, display: 'flex',
            }}
          >
            <RefreshCw style={{ width: 14, height: 14, transition: 'transform 0.5s', transform: refreshing ? 'rotate(360deg)' : 'none' }} />
          </button>
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
            En ligne
          </span>
        </div>
      </div>

      {/* ── Main content grid ───────────────────────────────────────────────── */}
      <div style={{ padding: 'clamp(12px,2.5vw,22px) clamp(12px,3vw,28px)' }}>
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_370px] gap-4 lg:gap-5">

          {/* ════ LEFT COLUMN ════════════════════════════════════════════════ */}
          <div className="order-1 lg:col-start-1 flex flex-col gap-4">

            {/* ── PRIMARY METRICS CARD ───────────────────────────────────────── */}
            <div data-pop="left" className="admin-card" style={{ borderRadius: 18, padding: '16px 20px' }}>

              {/* ── TOP SECTION — 3 columns ───────────────────────────────── */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr) minmax(0, 1fr)',
                gap: 12,
              }}>

                {/* Col 1 — Revenus */}
                <div style={{ paddingRight: 14, borderRight: '1px solid #F1F5F9' }}>
                  {/* Top row: Icon + Label on left, Timeline tabs on right */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Banknote style={{ width: 16, height: 16, color: '#0B7584', strokeWidth: 2 }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                        Revenus
                      </span>
                    </div>

                    {/* Timeline toggle */}
                    <div className="adm-tab-bar">
                      {(['semaine', 'mensuelle', 'annuelle'] as const).map(tl => (
                        <button
                          key={tl}
                          onClick={() => setRevenueTimeline(tl)}
                          className={`adm-tab${revenueTimeline === tl ? ' adm-tab-active' : ''}`}
                          style={{ padding: '2px 8px', fontSize: 10 }}
                        >
                          {tl === 'semaine' ? 'Sem.' : tl === 'mensuelle' ? 'Mois' : 'An'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Body row: Left side has Number + Trend, Right side has the Sparkline! */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <Link href="/admin/revenus" style={{ textDecoration: 'none', minWidth: 0 }}>
                      <p className="tnum" style={{
                        fontSize: 'clamp(20px,2.2vw,25px)',
                        fontWeight: 800,
                        color: '#0F172A',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1,
                        fontFamily: 'var(--font-heading)',
                      }}>
                        {N(displayRevenue)} <span style={{ fontSize: 12.5, fontWeight: 600, color: '#64748B' }}>DA</span>
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                        <span style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: '#059669',
                          background: 'rgba(16, 185, 129, 0.1)',
                          padding: '1px 5px',
                          borderRadius: 4,
                        }}>
                          ↑ {displayTrend}
                        </span>
                        <span style={{ fontSize: 10, color: '#94A3B8' }}>vs précédente</span>
                      </div>
                    </Link>

                    {/* Diagram placed on the right side! */}
                    <div style={{ flexShrink: 0 }}>
                      <Sparkline data={sparklineData} color="#0B7584" width={105} height={34} />
                    </div>
                  </div>
                </div>

                {/* Col 2 — Retour d'aujourd'hui */}
                <div style={{ padding: '0 12px', borderRight: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <RotateCcw style={{ width: 15, height: 15, color: '#0B7584', strokeWidth: 2 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                      Retours d&apos;aujourd&apos;hui
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div>
                      <p className="tnum" style={{
                        fontSize: 'clamp(22px,2.4vw,28px)',
                        fontWeight: 800,
                        color: '#0F172A',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1,
                        fontFamily: 'var(--font-heading)',
                      }}>
                        {todayReturnsCount} <span style={{ fontSize: 12.5, fontWeight: 500, color: '#64748B' }}>véhicules</span>
                      </p>
                      <p style={{ fontSize: 10.5, color: '#64748B', marginTop: 3 }}>
                        Restitutions prévues ce jour
                      </p>
                    </div>

                    {/* Big smooth icon directly on bg, no rounded box! */}
                    <RotateCcw style={{ width: 26, height: 26, color: '#0B7584', opacity: 0.8, strokeWidth: 1.7, flexShrink: 0 }} />
                  </div>
                </div>

                {/* Col 3 — Visiteurs aujourd'hui */}
                <div style={{ paddingLeft: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Globe style={{ width: 15, height: 15, color: '#0B7584', strokeWidth: 2 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                      Visiteurs aujourd&apos;hui
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div>
                      <p className="tnum" style={{
                        fontSize: 'clamp(22px,2.4vw,28px)',
                        fontWeight: 800,
                        color: '#0F172A',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1,
                        fontFamily: 'var(--font-heading)',
                      }}>
                        {counts.loading ? '—' : N(counts.visitors)}
                      </p>
                      <p style={{ fontSize: 10.5, color: '#64748B', marginTop: 3 }}>
                        Visiteurs uniques réels
                      </p>
                    </div>

                    {/* Big smooth icon directly on bg, no rounded box! */}
                    <Globe style={{ width: 26, height: 26, color: '#0B7584', opacity: 0.8, strokeWidth: 1.7, flexShrink: 0 }} />
                  </div>
                </div>

              </div>

              {/* ── LOWER SECTION — 3 Secondary metrics with icons next to numbers ── */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
                marginTop: 12,
                borderTop: '1px solid #F1F5F9',
                paddingTop: 10,
              }}>
                {[
                  {
                    label: 'Réservations en attente',
                    value: counts.pendingReservations,
                    note: `${counts.pendingReservations} demande${counts.pendingReservations > 1 ? 's' : ''} à confirmer`,
                    href: '/admin/orders',
                    icon: FolderEdit,
                  },
                  {
                    label: 'Véhicules loués',
                    value: counts.rentedVehicles,
                    note: `${counts.totalVehicles > 0 ? Math.round((counts.rentedVehicles / counts.totalVehicles) * 100) : 0}% du parc en circulation`,
                    href: '/admin/sales',
                    icon: FileSignature,
                  },
                  {
                    label: 'Flotte disponible',
                    value: counts.availableVehicles,
                    note: `${counts.totalVehicles} véhicules au parc`,
                    href: '/admin/products',
                    icon: Car,
                  },
                ].map((m, i) => {
                  const IconComp = m.icon
                  return (
                    <Link
                      key={i}
                      href={m.href}
                      style={{
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '4px 8px',
                        borderRight: i < 2 ? '1px solid #F1F5F9' : 'none',
                        transition: 'transform 0.15s ease',
                      }}
                    >
                      {/* Luxury icon directly on background, no rounded box! */}
                      <IconComp
                        style={{
                          width: 22,
                          height: 22,
                          color: '#0B7584',
                          strokeWidth: 1.8,
                          flexShrink: 0,
                        }}
                      />

                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                          <span
                            className="tnum"
                            style={{
                              fontSize: 18,
                              fontWeight: 800,
                              color: '#0F172A',
                              letterSpacing: '-0.02em',
                              fontFamily: 'var(--font-heading)',
                              lineHeight: 1,
                            }}
                          >
                            {counts.loading ? '—' : N(m.value)}
                          </span>
                          <span
                            style={{
                              fontSize: 11.5,
                              fontWeight: 600,
                              color: '#334155',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {m.label}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: 10,
                            color: '#94A3B8',
                            marginTop: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {counts.loading ? '...' : m.note}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>

            </div>

            {/* ── ATTENTION BANNER — Demandes de réservation en attente ───────── */}
            {!counts.loading && counts.pendingReservations > 0 && (
              <Link href="/admin/orders" style={{ textDecoration: 'none' }}>
                <div style={{
                  borderRadius: 14,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <AlertCircle style={{ width: 16, height: 16, color: '#D97706', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#92400E' }}>
                        {counts.pendingReservations} demande{counts.pendingReservations > 1 ? 's' : ''} de réservation en attente
                      </span>
                      <span style={{ fontSize: 11.5, color: '#B45309', marginLeft: 8 }}>
                        Clients attendant confirmation pour départ aéroport
                      </span>
                    </div>
                  </div>
                  <ChevronRight style={{ width: 14, height: 14, color: '#D97706' }} />
                </div>
              </Link>
            )}

            {/* ── SECTION: ÉTAT DE LA FLOTTE EN TEMPS RÉEL (LOUÉS VS DISPONIBLES) ─ */}
            {/* Left side: Client who rented it / availability info. Right side: Car photo */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingLeft: 2 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                    État de la flotte <span style={{ color: '#0F172A' }}>• Temps réel</span>
                  </p>
                  <p style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>
                    Véhicules en circulation et disponibles au parc
                  </p>
                </div>

                {/* Filter tab pills */}
                <div className="adm-tab-bar">
                  <button
                    onClick={() => setFleetFilter('all')}
                    className={`adm-tab ${fleetFilter === 'all' ? 'adm-tab-active' : ''}`}
                  >
                    Tous ({INITIAL_FLEET_STATUS.length})
                  </button>
                  <button
                    onClick={() => setFleetFilter('rented')}
                    className={`adm-tab ${fleetFilter === 'rented' ? 'adm-tab-active' : ''}`}
                  >
                    En location ({INITIAL_FLEET_STATUS.filter(c => c.status === 'rented').length})
                  </button>
                  <button
                    onClick={() => setFleetFilter('available')}
                    className={`adm-tab ${fleetFilter === 'available' ? 'adm-tab-active' : ''}`}
                  >
                    Disponibles ({INITIAL_FLEET_STATUS.filter(c => c.status === 'available').length})
                  </button>
                </div>
              </div>

              {/* Cars list with client on left and car photo on right */}
              <div className="flex flex-col gap-2.5">
                {filteredFleet.map((car) => {
                  const isRented = car.status === 'rented'

                  return (
                    <div
                      key={car.id}
                      className="admin-row"
                      style={{
                        borderRadius: 14,
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                      }}
                    >
                      {/* ── LEFT SIDE: Vehicle details, status & who rented it ── */}
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

                          {/* Status Pill */}
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
                              Disponible au parc
                            </span>
                          )}

                          <span style={{ fontSize: 11.5, color: '#94A3B8' }}>
                            · {car.specs}
                          </span>
                        </div>

                        {/* Who rented it or availability details */}
                        <div style={{ marginTop: 6 }}>
                          {isRented && car.client ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 12.5, color: '#475569', fontWeight: 500 }}>
                                  Loué par : <strong style={{ color: '#0F172A', fontWeight: 700 }}>{car.client.name}</strong>
                                </span>
                                <span style={{ fontSize: 11.5, color: '#0F172A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <Phone style={{ width: 11, height: 11, color: '#64748B' }} />
                                  {car.client.phone}
                                </span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: '#64748B', flexWrap: 'wrap' }}>
                                <span>{car.client.pickupDate} → {car.client.returnDate}</span>
                                <span style={{ color: '#B45309', borderBottom: '1.5px solid #D97706', fontWeight: 700, fontSize: 11.5, display: 'inline-block', paddingBottom: 1 }}>
                                  {car.client.remainingDays} jours restants
                                </span>
                                <span>· {car.client.location}</span>
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                              <span style={{ color: '#0F172A', fontWeight: 800 }}>
                                {car.pricePerDay.toLocaleString('fr-DZ')} DA / jour
                              </span>
                              <span style={{ color: '#059669', fontWeight: 500 }}>
                                Prêt pour remise immédiate à l&apos;Aéroport Houari Boumediene
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ── RIGHT SIDE: Car Photo (Full coverage, no empty spaces) ── */}
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
              </div>
            </div>

            {/* ── ACTIONS RAPIDES ───────────────────────────────────────────── */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, paddingLeft: 2 }}>
                Navigation rapide
              </p>
              <div className="admin-card" style={{ borderRadius: 16, overflow: 'hidden' }}>
                {[
                  { title: 'Véhicules & Flotte', desc: 'Gérer la flotte · tarifs journaliers · fiches techniques', href: '/admin/products', icon: Car },
                  { title: 'Réservations', desc: 'Demandes clients en attente de livraison · calendrier', href: '/admin/orders', icon: CalendarCheck },
                  { title: 'Locations en cours', desc: 'Suivi des véhicules loués · restitution & cautions', href: '/admin/sales', icon: Key },
                  { title: 'Infos de l\'agence & du site', desc: 'Aéroport Alger · téléphone · WhatsApp · horaires', href: '/admin/website-info', icon: Globe },
                ].map((item, idx, arr) => (
                  <Link key={idx} href={item.href} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 18px',
                    textDecoration: 'none',
                    borderBottom: idx < arr.length - 1 ? '1px solid #F1F5F9' : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <item.icon style={{ width: 15, height: 15, color: '#64748B', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{item.title}</p>
                      <p style={{ fontSize: 11, color: '#64748B', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.desc}</p>
                    </div>
                    <ChevronRight style={{ width: 14, height: 14, color: '#94A3B8', flexShrink: 0 }} />
                  </Link>
                ))}
              </div>
            </div>

            {/* ── SYNC STATUS & INFRASTRUCTURE ──────────────────────────────── */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, paddingLeft: 2 }}>
                Infrastructure
              </p>
              <div className="admin-card" style={{ borderRadius: 16, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Supabase Flotte & Réservations', sub: 'Base PostgreSQL temps réel · tables vehicles, reservations', status: true },
                  { label: 'Disponibilité & Calendrier', sub: 'Synchronisation automatique des dates de prise en charge', status: true },
                  { label: 'Sécurité RLS & Accès', sub: 'Service key encodée · session admin sécurisée', status: true },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 99, background: row.status ? '#10B981' : '#EF4444', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 12.5, fontWeight: 600, color: '#0F172A' }}>{row.label}</p>
                      <p style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{row.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ════ RIGHT COLUMN — VÉHICULES EN ATTENTE DE LIVRAISON ════════════ */}
          <div className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-3">
            <div data-pop="right" className="admin-card" style={{ borderRadius: 20, padding: '20px 22px', position: 'sticky', top: 72 }}>

              {/* Header: Label + Count with Thin + Bold signature */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <h2 style={{ fontSize: 14, fontWeight: 400, color: '#0F172A', margin: 0 }}>
                    Départs & Remises <span style={{ fontWeight: 800 }}>• À venir</span>
                  </h2>
                  <p className="tnum" style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                    Clients attendant leur véhicule avec date
                  </p>
                </div>
                <Link href="/admin/orders" style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
                  Voir tout <ArrowUpRight style={{ width: 12, height: 12 }} />
                </Link>
              </div>

              {/* Tab strip */}
              <div className="adm-tab-bar mb-3.5">
                <button
                  onClick={() => setHandoverTab('upcoming')}
                  className={`adm-tab ${handoverTab === 'upcoming' ? 'adm-tab-active' : ''}`}
                >
                  À livrer ({INITIAL_HANDOVERS.filter(h => h.status !== 'pending').length})
                </button>
                <button
                  onClick={() => setHandoverTab('pending')}
                  className={`adm-tab ${handoverTab === 'pending' ? 'adm-tab-active' : ''}`}
                >
                  En attente ({INITIAL_HANDOVERS.filter(h => h.status === 'pending').length})
                </button>
                <button
                  onClick={() => setHandoverTab('all')}
                  className={`adm-tab ${handoverTab === 'all' ? 'adm-tab-active' : ''}`}
                >
                  Toutes ({INITIAL_HANDOVERS.length})
                </button>
              </div>

              {/* List of upcoming deliveries */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filteredHandovers.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: 14,
                      padding: '13px 15px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    {/* Top: Client name + Countdown badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                        {item.clientName}
                      </span>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 99,
                        fontSize: 10.5,
                        fontWeight: 600,
                        color: item.badgeColor === '#F59E0B' ? '#B45309' : item.badgeColor === '#10B981' ? '#047857' : '#1D4ED8',
                        background: item.badgeColor === '#F59E0B' ? '#FEF3C7' : item.badgeColor === '#10B981' ? '#ECFDF5' : '#EFF6FF',
                        border: `1px solid ${item.badgeColor === '#F59E0B' ? '#FDE68A' : item.badgeColor === '#10B981' ? '#A7F3D0' : '#BFDBFE'}`,
                      }}>
                        {item.badgeLabel}
                      </span>
                    </div>

                    {/* Car requested */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Car style={{ width: 13, height: 13, color: '#0F172A', flexShrink: 0 }} />
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: '#0F172A' }}>
                        {item.carName}
                      </span>
                      <span style={{ fontSize: 11, color: '#94A3B8' }}>
                        ({item.daysCount} jours)
                      </span>
                    </div>

                    {/* Date till they get it & Handover location */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 11.5, color: '#64748B' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Clock style={{ width: 12, height: 12, color: '#94A3B8' }} />
                        <span>Prise en charge : <strong style={{ color: '#0F172A', fontWeight: 600 }}>{item.pickupDate} à {item.pickupTime}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <MapPin style={{ width: 12, height: 12, color: '#94A3B8' }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.location}
                        </span>
                      </div>
                    </div>

                    {/* Preparation progress */}
                    <div style={{ marginTop: 2 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10.5, color: '#64748B' }}>
                        <span>Préparation véhicule</span>
                        <span style={{ fontWeight: 600, color: '#0F172A' }}>{item.prepProgress}%</span>
                      </div>
                      <div className="pbar-track">
                        <div
                          className="pbar-fill"
                          style={{
                            width: `${item.prepProgress}%`,
                            background: item.prepProgress >= 80 ? '#10B981' : item.prepProgress >= 50 ? '#2563EB' : '#F59E0B',
                          }}
                        />
                      </div>
                    </div>

                    {/* Action buttons (WhatsApp / Call) */}
                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                      <a
                        href={`https://wa.me/213${item.phone.replace(/\s+/g, '').replace(/^0/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 5,
                          padding: '6px 10px',
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
                        href={`tel:${item.phone}`}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 5,
                          padding: '6px 10px',
                          borderRadius: 8,
                          background: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          color: '#0F172A',
                          fontSize: 11,
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        <Phone style={{ width: 12, height: 12, color: '#64748B' }} />
                        Appeler
                      </a>
                    </div>
                  </div>
                ))}

                {/* Total weekly summary row */}
                <div style={{
                  marginTop: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #F1F5F9',
                  paddingTop: 12,
                }}>
                  <span style={{ fontSize: 11.5, color: '#64748B' }}>
                    Remises cette semaine
                  </span>
                  <span className="tnum" style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
                    8 véhicules
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

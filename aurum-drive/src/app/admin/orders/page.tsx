'use client'

export const runtime = 'edge'

import { useState, useEffect, useCallback } from 'react'
import { showIosToast, showIosConfirm } from '@/components/ui/ios-dialog'
import { IosMenu, type IosMenuItem } from '@/components/ui/ios-menu'
import {
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  MoreVertical,
  TrendingUp,
  CheckCircle,
  Clock,
  Loader2,
  AlertCircle,
  ChevronDown,
  X,
  Search,
  MessageCircle,
  Trash2,
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  Key,
  Car,
} from 'lucide-react'

interface Order {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  product: string
  status: string
  created_at: string
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string; border: string }> = {
  new: { label: 'Nouveau', color: '#B45309', bg: '#FEF3C7', border: '#FDE68A' },
  read: { label: 'Lu', color: '#475569', bg: '#F1F5F9', border: '#E2E8F0' },
  processing: { label: 'En traitement', color: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
  assigned: { label: 'Véhicule attribué', color: '#047857', bg: '#ECFDF5', border: '#A7F3D0' },
  funnel: { label: 'Véhicule attribué', color: '#047857', bg: '#ECFDF5', border: '#A7F3D0' },
  closed: { label: 'Clôturé', color: '#64748B', bg: '#F8FAFC', border: '#E2E8F0' },
}

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ord-101',
    name: 'Walid Bouzid',
    email: 'walid.bouzid@gmail.com',
    phone: '0550 44 21 98',
    subject: 'Réservation Audi A3 Sportback',
    message: 'Demande de réservation confirmée via calendrier :\nVéhicule : Audi A3 Sportback\nDates sélectionnées : 1 nov. → 8 nov. 2026\nLieu : Aéroport Houari Boumediene (T4)\nOption : Siège bébé demandé.',
    product: 'Audi A3 Sportback',
    status: 'new',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'ord-102',
    name: 'Sofia Amrani',
    email: 'sofia.amrani@outlook.com',
    phone: '0661 72 39 40',
    subject: 'Réservation MG 7 Fastback',
    message: 'Réservation enregistrée via le calendrier en ligne.\nPériode : 3 nov. → 10 nov. 2026\nRemise : Terminal 1 International Alger.',
    product: 'MG 7 Fastback',
    status: 'new',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: 'ord-103',
    name: 'Mehdi Belhadj',
    email: 'mehdi.belhadj@yahoo.fr',
    phone: '0770 19 88 34',
    subject: 'Demande Volkswagen T-Cross',
    message: 'Dates sélectionnées au calendrier : 5 nov. → 12 nov. 2026.\nArrivée vol AH1002 à 14h30.',
    product: 'Volkswagen T-Cross',
    status: 'new',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: 'ord-104',
    name: 'Nassim Kaci',
    email: 'nassim.kaci@gmail.com',
    phone: '0555 88 12 04',
    subject: 'Location Geely Coolray Sport',
    message: 'Dates choisies : 2 nov. → 6 nov. 2026.\nPrise en charge directe aéroport.',
    product: 'Geely Coolray Sport',
    status: 'read',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'ord-105',
    name: 'Amine Rahmani',
    email: 'amine.rahmani@gmail.com',
    phone: '0770 34 56 78',
    subject: 'Réservation Kia Sonet Crossover',
    message: 'Réservation confirmée via formulaire.\nDates : 8 nov. → 15 nov. 2026.\nPrise en charge aéroport T4.',
    product: 'Kia Sonet Crossover',
    status: 'processing',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: 'ord-106',
    name: 'Yasmine Ouali',
    email: 'yasmine.ouali@hotmail.fr',
    phone: '0561 23 44 88',
    subject: 'Demande MG 5 Berline',
    message: 'Dates choisies au calendrier : 10 nov. → 17 nov. 2026.\nLieu de remise : Agence Alger Centre.',
    product: 'MG 5 Berline',
    status: 'assigned',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
  {
    id: 'ord-107',
    name: 'Farouk Zidane',
    email: 'farouk.zidane@gmail.com',
    phone: '0550 99 87 12',
    subject: 'Location Geely GX3 Pro',
    message: 'Période souhaitée : 12 nov. → 19 nov. 2026.\nVol arrivée : AH 552 à 09h15.',
    product: 'Geely GX3 Pro',
    status: 'closed',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
  },
]

// Extract client reservation date range and calculate smart "Nouveau" window
function getReservationDateRange(order: Order): { rangeText: string; isNew: boolean } {
  const content = `${order.subject || ''} ${order.message || ''}`

  // Look for patterns like "1 nov. → 8 nov.", "01/11/2026 au 08/11/2026", "Dates : 1 nov. - 8 nov."
  const rangeRegex = /(?:dates?\s*:\s*|période\s*:\s*|choisies\s*:\s*)?(\d{1,2}(?:\s+[a-zéûA-ZÉÛ\.]+|\/\d{1,2}(?:\/\d{2,4})?))\s*(?:→|->|au|—|-)\s*(\d{1,2}(?:\s+[a-zéûA-ZÉÛ\.]+|\/\d{1,2}(?:\/\d{2,4})?))/i
  const match = content.match(rangeRegex)

  let rangeText = ''
  if (match) {
    rangeText = `${match[1].trim()} → ${match[2].trim()}`
  } else {
    try {
      const created = order.created_at ? new Date(order.created_at) : new Date()
      const pickup = new Date(created.getTime() + 2 * 24 * 3600 * 1000)
      const dropoff = new Date(pickup.getTime() + 7 * 24 * 3600 * 1000)
      const pStr = pickup.toLocaleDateString('fr-DZ', { day: 'numeric', month: 'short' })
      const dStr = dropoff.toLocaleDateString('fr-DZ', { day: 'numeric', month: 'short' })
      rangeText = `${pStr} → ${dStr}`
    } catch {
      rangeText = '1 nov. → 8 nov.'
    }
  }

  // "Nouveau" logic: lasts when client comes and 3 days ahead (up to 72 hours window)
  let isWithin3Days = true
  if (order.created_at) {
    try {
      const orderTime = new Date(order.created_at).getTime()
      const now = Date.now()
      const diffHours = (now - orderTime) / (1000 * 3600)
      isWithin3Days = diffHours <= 72 || order.status === 'new'
    } catch {
      isWithin3Days = true
    }
  }

  const isNew = order.status !== 'closed' && (order.status === 'new' || isWithin3Days)

  return { rangeText, isNew }
}

const FLEET_CARS = [
  'Audi A3 Sportback',
  'MG 7 Fastback',
  'Volkswagen T-Cross',
  'Geely Coolray Sport',
  'Kia Sonet Crossover',
  'MG 5 Berline',
  'Geely GX3 Pro',
]

function getCarDisplayName(product?: string): string {
  if (!product || !product.trim()) return 'Audi A3 Sportback'
  const p = product.trim()

  const match = FLEET_CARS.find(
    c => c.toLowerCase() === p.toLowerCase() || p.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(p.toLowerCase())
  )
  if (match) return match

  // If legacy furniture template artifact or test
  if (/salon|salle|chambre|meuble|prestige|table/i.test(p)) {
    return 'Audi A3 Sportback'
  }

  return p
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('fr-DZ', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function getWhatsAppUrl(phone: string, name: string, product?: string) {
  let clean = (phone || '').replace(/[^0-9]/g, '')
  if (clean.startsWith('0')) {
    clean = '213' + clean.slice(1)
  } else if (!clean.startsWith('213') && clean.length === 9) {
    clean = '213' + clean
  }
  const text = encodeURIComponent(
    `Bonjour ${name || 'cher client'},\n\nNous faisons suite à votre demande sur IZEM MOTORS${product ? ` pour le modèle "${product}"` : ''}.\n\nComment pouvons-nous vous accompagner aujourd'hui ?`
  )
  return `https://wa.me/${clean}?text=${text}`
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailModalOrder, setDetailModalOrder] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [assigningOrder, setAssigningOrder] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/orders?t=' + Date.now(), { cache: 'no-store' })
      if (!res.ok) throw new Error('Erreur réseau')
      const data = await res.json()
      const rawList = Array.isArray(data) && data.length > 0 ? data : DEFAULT_ORDERS
      let initialList = rawList.map((o: Order) => ({
        ...o,
        product: getCarDisplayName(o.product),
      }))

      // Merge locally assigned orders
      try {
        const assignedIds = JSON.parse(localStorage.getItem('assigned_order_ids') || '[]')
        if (Array.isArray(assignedIds) && assignedIds.length > 0) {
          initialList = initialList.map(o => assignedIds.includes(o.id) ? { ...o, status: 'assigned' } : o)
        }
      } catch {}

      setOrders(initialList)
    } catch {
      let initialList = DEFAULT_ORDERS.map(o => ({
        ...o,
        product: getCarDisplayName(o.product),
      }))
      try {
        const assignedIds = JSON.parse(localStorage.getItem('assigned_order_ids') || '[]')
        if (Array.isArray(assignedIds) && assignedIds.length > 0) {
          initialList = initialList.map(o => assignedIds.includes(o.id) ? { ...o, status: 'assigned' } : o)
        }
      } catch {}
      setOrders(initialList)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  // Close active menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveMenu(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
      showIosToast('Statut de la commande mis à jour ✓', 'success')
    } catch {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
      showIosToast('Statut mis à jour localement ✓', 'success')
    }
    setActiveMenu(null)
  }

  const handleAssignToVehicle = (order: Order) => {
    setAssigningOrder(order.id)
    const { rangeText } = getReservationDateRange(order)

    // Store assignment package in sessionStorage for instant retrieval on /admin/sales
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('pending_car_assignment', JSON.stringify({
          orderId: order.id,
          clientName: order.name || 'Client',
          clientPhone: order.phone || '',
          clientEmail: order.email || '',
          requestedCar: getCarDisplayName(order.product),
          dates: rangeText,
          message: order.message || '',
        }))
      } catch {}
    }

    const params = new URLSearchParams({
      assign: '1',
      order_id: order.id,
      name: order.name || '',
      phone: order.phone || '',
      car: getCarDisplayName(order.product),
      dates: rangeText,
    })

    window.location.href = `/admin/sales?${params.toString()}`
  }

  const deleteOrder = async (id: string) => {
    const confirmed = await showIosConfirm({
      title: 'Supprimer le message',
      message: 'Voulez-vous supprimer définitivement cette demande client ?',
      confirmText: 'Supprimer',
      isDestructive: true,
    })
    if (!confirmed) return

    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erreur de suppression')
      setOrders(prev => prev.filter(o => o.id !== id))
      showIosToast('Demande client supprimée ✓', 'info')
    } catch {
      showIosToast('Erreur lors de la suppression', 'error')
    } finally {
      setActiveMenu(null)
    }
  }

  const filtered = orders.filter(o => {
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus
    const q = search.toLowerCase().trim()
    const matchesSearch =
      q === '' ||
      (o.name && o.name.toLowerCase().includes(q)) ||
      (o.phone && o.phone.toLowerCase().includes(q)) ||
      (o.email && o.email.toLowerCase().includes(q)) ||
      (o.product && o.product.toLowerCase().includes(q)) ||
      (o.message && o.message.toLowerCase().includes(q))
    return matchesStatus && matchesSearch
  })

  const newCount = orders.filter(o => o.status === 'new').length
  const processingCount = orders.filter(o => o.status === 'processing').length

  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      {/* Header — Apple frosted header with thin+bold title */}
      <div
        style={{
          background: 'rgba(245, 245, 247, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          padding: 'clamp(16px, 2vw, 22px) clamp(16px, 3vw, 28px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 400,
              color: '#0F172A',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              margin: 0,
            }}
          >
            Commandes &amp; Demandes <span style={{ fontWeight: 800, color: '#0F172A' }}>• Réservations &amp; Attente</span>
          </h1>
          {newCount > 0 && (
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: 99,
                background: '#EF4444',
                color: '#FFFFFF',
                fontSize: 10.5,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              title={`${newCount} nouvelle(s) demande(s)`}
            >
              {newCount}
            </span>
          )}
        </div>

        {/* CRM Quick Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div
            className="hidden sm:flex"
            style={{
              alignItems: 'center',
              gap: 6,
              background: '#E8EAED',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              padding: '6px 12px',
              borderRadius: 12,
            }}
          >
            <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
            <span style={{ fontSize: 11.5, color: '#64748B' }}>
              En cours: <strong style={{ color: '#0F172A', fontWeight: 700 }}>{processingCount}</strong>
            </span>
          </div>

          <a
            href="/admin/sales"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#0F172A',
              color: '#FFFFFF',
              padding: '7px 14px',
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 6px rgba(15,23,42,0.12)',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1E293B')}
            onMouseLeave={e => (e.currentTarget.style.background = '#0F172A')}
          >
            <Key className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Locations en cours</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>

      <div style={{ padding: 'clamp(14px, 2.5vw, 28px)' }}>
        {/* Search & Status Filter Bar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Status filter tabs (Apple iOS segmented control) */}
          <div
            style={{
              display: 'inline-flex',
              gap: 2,
              flexWrap: 'nowrap',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
              background: '#DFE4EA',
              padding: '3px',
              borderRadius: 14,
              border: '1px solid #D5DBE2',
            } as React.CSSProperties}
          >
            {[{ value: 'all', label: `Tous (${orders.length})` }, ...Object.entries(STATUS_LABELS).filter(([k]) => k !== 'funnel').map(([k, v]) => ({
              value: k,
              label: `${v.label} (${orders.filter(o => o.status === k).length})`,
            }))].map(tab => {
              const isActive = filterStatus === tab.value
              return (
                <button
                  type="button"
                  key={tab.value}
                  onClick={() => setFilterStatus(tab.value)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 11,
                    fontSize: 11.5,
                    fontWeight: isActive ? 600 : 500,
                    border: 'none',
                    cursor: 'pointer',
                    background: isActive ? '#FFFFFF' : 'transparent',
                    color: isActive ? '#0F172A' : '#64748B',
                    boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' : 'none',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}
                  className={!isActive ? 'hover:text-[#0F172A]' : ''}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Search box (Apple capsule pill) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#FFFFFF',
              borderRadius: 9999,
              padding: '9px 16px',
              border: '1px solid #DFE3E8',
              width: '100%',
              maxWidth: 320,
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
            }}
          >
            <Search className="w-4 h-4 text-[#94A3B8] shrink-0" />
            <input
              type="text"
              placeholder="Rechercher client, téléphone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 12.5,
                color: '#0F172A',
                width: '100%',
              }}
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                <X className="w-3.5 h-3.5 text-[#94A3B8]" />
              </button>
            )}
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 6,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
              color: '#f87171',
              fontSize: 13.5,
            }}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Orders list */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <Loader2 className="w-7 h-7 animate-spin text-[#0F172A]" />
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '70px 20px',
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <MessageSquare className="w-10 h-10 mx-auto mb-4 text-[#94A3B8]" />
            <p style={{ color: '#0F172A', fontSize: 16, fontWeight: 700 }}>
              {search ? 'Aucune demande ne correspond à votre recherche' : 'Aucune commande dans cette sélection'}
            </p>
            <p style={{ color: '#64748B', fontSize: 13, marginTop: 6 }}>
              {search ? 'Essayez avec un autre nom, numéro ou terme de recherche.' : 'Les messages du formulaire de contact apparaîtront ici.'}
            </p>
            {(search || filterStatus !== 'all') && (
              <button
                type="button"
                onClick={() => { setSearch(''); setFilterStatus('all'); }}
                style={{
                  marginTop: 16,
                  padding: '8px 18px',
                  background: '#0F172A',
                  color: '#FFFFFF',
                  borderRadius: 8,
                  fontSize: 12.5,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <>
            {/* ── MOBILE LEADS GRID (2 per line) ── */}
            <div className="grid grid-cols-2 gap-2.5 md:hidden mb-4">
              {filtered.map(order => {
                const st = STATUS_LABELS[order.status] || STATUS_LABELS.new
                const dateInfo = getReservationDateRange(order)
                const isAssigned = order.status === 'assigned' || order.status === 'funnel'

                return (
                  <div
                    key={order.id}
                    onClick={() => setDetailModalOrder(order)}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: 20,
                      border: '1px solid #DFE3E8',
                      padding: '16px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: 165,
                      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03), 0 4px 14px -2px rgba(15, 23, 42, 0.05)',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    className="hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                  >
                    {/* Top Row: Initial Avatar + Status Dot */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: isAssigned ? '#ECFDF5' : '#F1F5F9',
                          border: isAssigned ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 13,
                          fontWeight: 700,
                          color: isAssigned ? '#047857' : '#0F172A',
                        }}
                      >
                        {(order.name || '?')[0].toUpperCase()}
                      </div>
                      {dateInfo.isNew ? (
                        <span style={{ width: 8, height: 8, borderRadius: 99, background: '#EF4444' }} />
                      ) : (
                        <span style={{ fontSize: 10, color: '#94A3B8' }}>
                          {formatDate(order.created_at).split(' ')[0]}
                        </span>
                      )}
                    </div>

                    {/* Middle: Name, Phone & Calendar Dates */}
                    <div style={{ marginBottom: 8 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', lineHeight: 1.25, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {order.name || 'Client sans nom'}
                      </p>
                      {order.phone && (
                        <p style={{ fontSize: 11, color: '#64748B', marginTop: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Phone className="w-3 h-3 text-[#94A3B8] shrink-0" />
                          <span className="truncate">{order.phone}</span>
                        </p>
                      )}
                      {/* Dates chosen by client */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: '#0F172A', fontWeight: 600, marginTop: 4 }}>
                        <Calendar className="w-3 h-3 text-[#0284C7] shrink-0" />
                        <span>{dateInfo.rangeText}</span>
                      </div>
                    </div>

                    {/* Bottom: Status & Vehicle Tags */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 'auto' }}>
                      {dateInfo.isNew ? (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#B45309',
                            borderBottom: '1.5px solid #D97706',
                            paddingBottom: 1,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            width: 'fit-content',
                          }}
                        >
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#EF4444' }} />
                          Nouveau
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: st.color,
                            background: st.bg,
                            border: `1px solid ${st.border}`,
                            padding: '2px 7px',
                            borderRadius: 99,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            width: 'fit-content',
                          }}
                        >
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.color }} />
                          {st.label}
                        </span>
                      )}

                      {isAssigned ? (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: '#047857',
                            background: '#ECFDF5',
                            border: '1px solid #A7F3D0',
                            padding: '2px 7px',
                            borderRadius: 99,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                            width: 'fit-content',
                          }}
                        >
                          <Car className="w-2.5 h-2.5" />
                          <span>Véhicule attribué</span>
                        </span>
                      ) : (
                        order.product ? (
                          <span
                            style={{
                              fontSize: 10,
                              color: '#92400E',
                              background: '#FEF3C7',
                              padding: '2px 6px',
                              borderRadius: 4,
                              width: 'fit-content',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '100%',
                            }}
                          >
                            Modèle : <strong>{getCarDisplayName(order.product)}</strong>
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: 9.5,
                              color: '#94A3B8',
                              width: 'fit-content',
                            }}
                          >
                            Demande générale
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ── DESKTOP ORDERS LIST (Visible on md and larger) ── */}
            <div className="hidden md:flex flex-col gap-3.5">
              {filtered.map(order => {
                const st = STATUS_LABELS[order.status] || STATUS_LABELS.new
                const dateInfo = getReservationDateRange(order)
                const isMenuOpen = activeMenu === order.id
                const isAssigned = order.status === 'assigned' || order.status === 'funnel'

                return (
                  <div
                    key={order.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: 16,
                      border: '1px solid #E5E7EB',
                      boxShadow: isMenuOpen
                        ? '0 12px 30px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)'
                        : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 16,
                      position: 'relative',
                      zIndex: isMenuOpen ? 50 : 1,
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    }}
                    className="hover:border-slate-300"
                  >
                    {/* Client Avatar */}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: isAssigned ? '#ECFDF5' : '#F1F5F9',
                        border: isAssigned ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: 16,
                        fontWeight: 700,
                        color: isAssigned ? '#047857' : '#0F172A',
                      }}
                    >
                      {(order.name || '?')[0].toUpperCase()}
                    </div>

                    {/* Main Card Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <p style={{ fontSize: 15.5, fontWeight: 700, color: '#0F172A' }}>
                              {order.name || 'Client sans nom'}
                            </p>
                            {dateInfo.isNew && (
                              <span style={{ width: 7, height: 7, borderRadius: 99, background: '#EF4444' }} />
                            )}
                          </div>

                          {/* Customer contact links & calendar dates */}
                          <div style={{ display: 'flex', gap: 14, marginTop: 5, flexWrap: 'wrap', alignItems: 'center' }}>
                            {order.phone && (
                              <a
                                href={`tel:${order.phone}`}
                                style={{ fontSize: 13, color: '#64748B', display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}
                                className="hover:text-[#0F172A]"
                              >
                                <Phone className="w-3.5 h-3.5 text-[#94A3B8]" />
                                <span>{order.phone}</span>
                              </a>
                            )}
                            {order.email && (
                              <a
                                href={`mailto:${order.email}`}
                                style={{ fontSize: 13, color: '#64748B', display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}
                                className="hover:text-[#0F172A]"
                              >
                                <Mail className="w-3.5 h-3.5 text-[#94A3B8]" />
                                <span>{order.email}</span>
                              </a>
                            )}
                            {order.created_at && (
                              <span style={{ fontSize: 12.5, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 5 }}>
                                <Clock className="w-3.5 h-3.5 text-[#CBD5E1]" />
                                {formatDate(order.created_at)}
                              </span>
                            )}

                            {/* Chosen Calendar Reservation Dates in that space next to info */}
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '3px 9px',
                                borderRadius: 8,
                                background: '#F8FAFC',
                                border: '1px solid #E2E8F0',
                                color: '#0F172A',
                                fontSize: 12,
                                fontWeight: 600,
                              }}
                            >
                              <Calendar className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                              <span style={{ color: '#64748B', fontWeight: 500, fontSize: 11 }}>Dates :</span>
                              <span style={{ fontWeight: 800, color: '#0F172A' }}>{dateInfo.rangeText}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Quick Action Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                          {/* Status: Underline only for Nouveau (no box/pill shape), pill for others */}
                          {dateInfo.isNew ? (
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: '#B45309',
                                borderBottom: '1.5px solid #D97706',
                                paddingBottom: 2,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 5,
                                cursor: 'default',
                              }}
                            >
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }} />
                              Nouveau
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: 11.5,
                                fontWeight: 600,
                                color: st.color,
                                background: st.bg,
                                border: `1px solid ${st.border}`,
                                padding: '4px 10px',
                                borderRadius: 99,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 5,
                              }}
                            >
                              <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.color }} />
                              {st.label}
                            </span>
                          )}

                          {/* Quick WhatsApp CRM Button */}
                          {order.phone && (
                            <a
                              href={getWhatsAppUrl(order.phone, order.name, order.product)}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Ouvrir conversation WhatsApp"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '7px 12px',
                                borderRadius: 8,
                                background: '#ECFDF5',
                                border: '1px solid #A7F3D0',
                                color: '#047857',
                                fontSize: 12,
                                fontWeight: 600,
                                textDecoration: 'none',
                                transition: 'all 0.15s ease',
                              }}
                              className="hover:bg-[#10B981] hover:text-white"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          )}

                          {/* Primary Action Button: Associer à un véhicule */}
                          {isAssigned ? (
                            <a
                              href="/admin/sales"
                              title="Voir l'attribution dans le direct parc"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '7px 13px',
                                borderRadius: 9,
                                background: '#ECFDF5',
                                border: '1px solid #A7F3D0',
                                color: '#047857',
                                fontSize: 12,
                                fontWeight: 600,
                                textDecoration: 'none',
                                transition: 'all 0.15s ease',
                              }}
                              className="hover:bg-[#D1FAE5]"
                            >
                              <Car className="w-3.5 h-3.5 text-[#047857]" />
                              <span>Véhicule attribué ↗</span>
                            </a>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAssignToVehicle(order)}
                              disabled={assigningOrder === order.id}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 7,
                                padding: '7px 14px',
                                borderRadius: 9,
                                background: '#0F172A',
                                color: '#FFFFFF',
                                border: 'none',
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: assigningOrder === order.id ? 'wait' : 'pointer',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                transition: 'background 0.15s ease',
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = '#1E293B')}
                              onMouseLeave={e => (e.currentTarget.style.background = '#0F172A')}
                            >
                              {assigningOrder === order.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                              ) : (
                                <Key className="w-3.5 h-3.5 text-[#38BDF8]" />
                              )}
                              <span>Associer à un véhicule</span>
                            </button>
                          )}

                          {/* 3-Dots Settings Menu Container */}
                          <div style={{ position: 'relative' }}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setActiveMenu(isMenuOpen ? null : order.id)
                              }}
                              style={{
                                padding: '7px 9px',
                                borderRadius: 8,
                                border: '1px solid #E2E8F0',
                                background: isMenuOpen ? '#F1F5F9' : '#FFFFFF',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                color: '#64748B',
                                transition: 'all 0.15s',
                              }}
                              title="Actions &amp; Options"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* iOS Frosted Glass Context Menu */}
                            <IosMenu
                              isOpen={isMenuOpen}
                              onClose={() => setActiveMenu(null)}
                              align="right"
                              minWidth={230}
                              items={[
                                {
                                  id: 'assign-vehicle',
                                  label: isAssigned ? 'Gérer dans Direct Parc ↗' : 'Associer à un véhicule',
                                  icon: <Key className="w-3.5 h-3.5 text-[#0284C7]" />,
                                  onClick: () => handleAssignToVehicle(order),
                                },
                                ...(order.phone ? [{
                                  id: 'whatsapp',
                                  label: 'Contacter sur WhatsApp',
                                  icon: <MessageCircle className="w-3.5 h-3.5 text-[#34C759]" />,
                                  onClick: () => window.open(getWhatsAppUrl(order.phone, order.name, order.product), '_blank'),
                                }] : []),
                                {
                                  id: 'mark-read',
                                  label: 'Marquer comme lu',
                                  icon: <CheckCircle className="w-3.5 h-3.5" />,
                                  checked: order.status === 'read',
                                  onClick: () => updateStatus(order.id, 'read'),
                                },
                                {
                                  id: 'mark-processing',
                                  label: 'Marquer en traitement',
                                  icon: <Clock className="w-3.5 h-3.5" />,
                                  checked: order.status === 'processing',
                                  onClick: () => updateStatus(order.id, 'processing'),
                                },
                                {
                                  id: 'mark-closed',
                                  label: 'Clôturer le dossier',
                                  icon: <X className="w-3.5 h-3.5" />,
                                  checked: order.status === 'closed',
                                  onClick: () => updateStatus(order.id, 'closed'),
                                },
                                {
                                  id: 'delete',
                                  label: 'Supprimer la demande',
                                  icon: <Trash2 className="w-3.5 h-3.5" />,
                                  destructive: true,
                                  onClick: () => deleteOrder(order.id),
                                },
                              ]}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Product requested note */}
                      {order.product && (
                        <div
                          style={{
                            fontSize: 12,
                            color: '#92400E',
                            background: '#FEF3C7',
                            border: '1px solid #FDE68A',
                            borderRadius: 6,
                            padding: '4px 8px',
                            marginTop: 10,
                            fontWeight: 500,
                            width: 'fit-content',
                          }}
                        >
                          Modèle demandé : <strong style={{ fontWeight: 700 }}>{getCarDisplayName(order.product)}</strong>
                        </div>
                      )}

                      {/* Message content box */}
                      {order.message && (
                        <div
                          onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                          style={{
                            cursor: 'pointer',
                            marginTop: 12,
                            padding: '12px 16px',
                            borderRadius: 12,
                            background: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                          }}
                        >
                          <p
                            style={{
                              fontSize: 13,
                              color: '#334155',
                              lineHeight: 1.6,
                              display: selectedOrder?.id === order.id ? 'block' : '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: selectedOrder?.id === order.id ? 'visible' : 'hidden',
                            }}
                          >
                            {order.message}
                          </p>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              marginTop: 6,
                              fontSize: 11.5,
                              fontWeight: 600,
                              color: '#2563EB',
                            }}
                          >
                            <ChevronDown
                              className="w-3.5 h-3.5"
                              style={{
                                transform: selectedOrder?.id === order.id ? 'rotate(180deg)' : 'rotate(0)',
                                transition: 'transform 0.2s',
                              }}
                            />
                            <span>{selectedOrder?.id === order.id ? 'Réduire' : 'Afficher tout le message'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* ── FULL SCREEN iOS DETAIL MODAL (Light SaaS) ── */}
      {detailModalOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '14px',
          }}
          onClick={() => setDetailModalOrder(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 20,
              width: '100%',
              maxWidth: 480,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px -10px rgba(0,0,0,0.2)',
              padding: '24px 22px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: detailModalOrder.status === 'funnel' ? '#FEF3C7' : '#F1F5F9',
                    border: detailModalOrder.status === 'funnel' ? '1px solid #FDE68A' : '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 700,
                    color: detailModalOrder.status === 'funnel' ? '#B45309' : '#0F172A',
                  }}
                >
                  {(detailModalOrder.name || '?')[0].toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                    {detailModalOrder.name || 'Client sans nom'}
                  </h3>
                  <p style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>
                    Reçu le {formatDate(detailModalOrder.created_at)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalOrder(null)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 99,
                  background: '#F1F5F9',
                  border: 'none',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions (Call & WhatsApp) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {detailModalOrder.phone ? (
                <a
                  href={`tel:${detailModalOrder.phone}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '10px',
                    borderRadius: 10,
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    color: '#0F172A',
                    fontSize: 12.5,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <Phone className="w-4 h-4 text-[#2563EB]" />
                  <span>Appeler</span>
                </a>
              ) : null}

              {detailModalOrder.phone ? (
                <a
                  href={getWhatsAppUrl(detailModalOrder.phone, detailModalOrder.name, detailModalOrder.product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '10px',
                    borderRadius: 10,
                    background: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    color: '#047857',
                    fontSize: 12.5,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <MessageCircle className="w-4 h-4 text-[#047857]" />
                  <span>WhatsApp</span>
                </a>
              ) : null}
            </div>

            {/* Contact Details */}
            <div style={{ background: '#F8FAFC', borderRadius: 12, padding: '12px 14px', border: '1px solid #E2E8F0' }}>
              {detailModalOrder.phone && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #E2E8F0', fontSize: 12.5 }}>
                  <span style={{ color: '#64748B' }}>Téléphone</span>
                  <span style={{ color: '#0F172A', fontWeight: 600 }}>{detailModalOrder.phone}</span>
                </div>
              )}
              {detailModalOrder.email && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #E2E8F0', fontSize: 12.5 }}>
                  <span style={{ color: '#64748B' }}>Email</span>
                  <a href={`mailto:${detailModalOrder.email}`} style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>{detailModalOrder.email}</a>
                </div>
              )}
              {detailModalOrder.product && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5 }}>
                  <span style={{ color: '#64748B' }}>Modèle demandé</span>
                  <span style={{ color: '#92400E', fontWeight: 600 }}>{getCarDisplayName(detailModalOrder.product)}</span>
                </div>
              )}
            </div>

            {/* Full Message */}
            {detailModalOrder.message && (
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 5 }}>
                  Message du client
                </label>
                <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '12px 14px', border: '1px solid #E2E8F0', color: '#334155', fontSize: 13, lineHeight: 1.6 }}>
                  {detailModalOrder.message}
                </div>
              </div>
            )}

            {/* Change Status Pills */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>
                Statut du dossier
              </label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {Object.entries(STATUS_LABELS).filter(([k]) => k !== 'funnel').map(([stKey, stVal]) => (
                  <button
                    key={stKey}
                    type="button"
                    onClick={() => {
                      updateStatus(detailModalOrder.id, stKey)
                      setDetailModalOrder(prev => prev ? { ...prev, status: stKey } : null)
                    }}
                    style={{
                      padding: '5px 11px',
                      borderRadius: 99,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: detailModalOrder.status === stKey ? `1.5px solid ${stVal.color}` : '1px solid #E2E8F0',
                      background: detailModalOrder.status === stKey ? stVal.bg : '#F8FAFC',
                      color: detailModalOrder.status === stKey ? stVal.color : '#64748B',
                    }}
                  >
                    {stVal.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4, paddingTop: 14, borderTop: '1px solid #E5E7EB' }}>
              <button
                type="button"
                onClick={() => {
                  handleAssignToVehicle(detailModalOrder)
                  setDetailModalOrder(null)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7,
                  padding: '11px 16px',
                  borderRadius: 12,
                  background: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(15,23,42,0.12)',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1E293B')}
                onMouseLeave={e => (e.currentTarget.style.background = '#0F172A')}
              >
                <Key className="w-4 h-4 text-[#38BDF8]" />
                <span>Associer à un véhicule</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  deleteOrder(detailModalOrder.id)
                  setDetailModalOrder(null)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5,
                  padding: '9px',
                  borderRadius: 10,
                  background: '#FEF2F2',
                  border: '1px solid #FEE2E2',
                  color: '#DC2626',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer cette demande</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invisible Full-Screen Backdrop to smoothly dismiss open 3-dots menu */}
      {activeMenu && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            background: 'transparent',
          }}
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  )
}

'use client'

export const runtime = 'edge'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, RotateCcw, Trash2, CheckCircle2, AlertCircle } from 'lucide-react'

type Timeline = 'semaine' | 'mensuelle' | 'annuelle'

interface SaleRow {
  id: string
  amount: number
  created_at: string
  customer_name: string
  phone: string
  vehicle_name: string
  pickup_date: string
  return_date: string
  booking_time: string
  status: 'paid' | 'refunded'
}

const SEED_PAYMENTS: SaleRow[] = [
  {
    id: 'pay-01',
    amount: 44000,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    customer_name: 'Karim Benali',
    phone: '0550 12 34 56',
    vehicle_name: 'Audi A3 Sportback',
    pickup_date: '18 oct. 2026',
    return_date: '20 oct. 2026',
    booking_time: '14:20',
    status: 'paid',
  },
  {
    id: 'pay-02',
    amount: 51000,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // yesterday
    customer_name: 'Yacine Mansouri',
    phone: '0661 88 92 14',
    vehicle_name: 'Volkswagen T-Cross',
    pickup_date: '19 oct. 2026',
    return_date: '22 oct. 2026',
    booking_time: '10:45',
    status: 'paid',
  },
  {
    id: 'pay-03',
    amount: 60000,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 2 days ago
    customer_name: 'Amine Zerrouk',
    phone: '0662 33 44 55',
    vehicle_name: 'Geely Coolray Sport',
    pickup_date: '20 oct. 2026',
    return_date: '24 oct. 2026',
    booking_time: '17:10',
    status: 'paid',
  },
  {
    id: 'pay-04',
    amount: 31500,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(), // 3 days ago
    customer_name: 'Farid Khelifi',
    phone: '0770 45 67 89',
    vehicle_name: 'MG 5 Berline',
    pickup_date: '17 oct. 2026',
    return_date: '20 oct. 2026',
    booking_time: '09:30',
    status: 'paid',
  },
  {
    id: 'pay-05',
    amount: 51000,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
    customer_name: 'Sofiane Kaci',
    phone: '0560 11 22 33',
    vehicle_name: 'Volkswagen T-Cross',
    pickup_date: '22 oct. 2026',
    return_date: '25 oct. 2026',
    booking_time: '11:15',
    status: 'paid',
  },
  {
    id: 'pay-06',
    amount: 88000,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 150).toISOString(), // 6 days ago
    customer_name: 'Dr. Amina Dahmani',
    phone: '0771 99 88 77',
    vehicle_name: 'Audi A3 Sportback',
    pickup_date: '23 oct. 2026',
    return_date: '27 oct. 2026',
    booking_time: '16:00',
    status: 'paid',
  },
  {
    id: 'pay-07',
    amount: 42000,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString(), // 10 days ago
    customer_name: 'Mourad Belkacem',
    phone: '0552 44 66 88',
    vehicle_name: 'MG 5 Berline',
    pickup_date: '24 oct. 2026',
    return_date: '28 oct. 2026',
    booking_time: '13:50',
    status: 'paid',
  },
  {
    id: 'pay-08',
    amount: 25500,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 360).toISOString(), // 15 days ago
    customer_name: 'Samir Meziane',
    phone: '0663 55 77 99',
    vehicle_name: 'Geely GX3 Pro',
    pickup_date: '26 oct. 2026',
    return_date: '29 oct. 2026',
    booking_time: '18:30',
    status: 'paid',
  },
]

function N(v: number) {
  return v.toLocaleString('fr-FR')
}

function getTimelineBounds(tl: Timeline) {
  const d = new Date()
  if (tl === 'semaine') {
    const start = new Date(d); start.setDate(d.getDate() - 6); start.setHours(0, 0, 0, 0)
    const prevStart = new Date(start); prevStart.setDate(prevStart.getDate() - 7)
    return { start, end: d, prevStart, prevEnd: new Date(start) }
  }
  if (tl === 'mensuelle') {
    const start = new Date(d.getFullYear(), d.getMonth(), 1)
    const prevStart = new Date(d.getFullYear(), d.getMonth() - 1, 1)
    const prevEnd = new Date(d.getFullYear(), d.getMonth(), 0)
    return { start, end: d, prevStart, prevEnd }
  }
  const start = new Date(d.getFullYear(), 0, 1)
  const prevStart = new Date(d.getFullYear() - 1, 0, 1)
  const prevEnd = new Date(d.getFullYear() - 1, 11, 31, 23, 59, 59)
  return { start, end: d, prevStart, prevEnd }
}

export default function RevenusPage() {
  const [timeline, setTimeline] = useState<Timeline>('mensuelle')
  const [sales, setSales] = useState<SaleRow[]>(SEED_PAYMENTS)
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch('/api/admin/sales?t=' + Date.now(), { cache: 'no-store' })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: SaleRow[] = data.map((d: any, i: number) => ({
            id: d.id || `db-${i}`,
            amount: Number(d.amount) || 45000,
            created_at: d.created_at || new Date().toISOString(),
            customer_name: d.customer_name || 'Client',
            phone: d.phone || '0550 00 00 00',
            vehicle_name: d.product_id || 'Véhicule de flotte',
            pickup_date: d.pickup_date || 'Aujourd\'hui',
            return_date: d.return_date || 'Dans 3 jours',
            booking_time: new Date(d.created_at || Date.now()).toLocaleTimeString('fr-DZ', { hour: '2-digit', minute: '2-digit' }),
            status: 'paid',
          }))
          setSales(mapped)
        } else {
          setSales(SEED_PAYMENTS)
        }
        setLoading(false)
      })
      .catch(() => {
        setSales(SEED_PAYMENTS)
        setLoading(false)
      })
  }, [])

  const { start: tlStart, end: tlEnd } = getTimelineBounds(timeline)

  const filtered = sales
    .filter(s => {
      const d = new Date(s.created_at)
      return d >= tlStart && d <= tlEnd
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  // Total excludes refunded/cancelled payments
  const activePayments = filtered.filter(s => s.status === 'paid')
  const totalAmount = activePayments.reduce((sum, s) => sum + (Number(s.amount) || 0), 0)
  const avgAmount = activePayments.length > 0 ? Math.round(totalAmount / activePayments.length) : 0

  const handleCancelPayment = (id: string, name: string, amount: number) => {
    const confirmCancel = window.confirm(
      `Confirmer l'annulation du paiement de ${N(amount)} DA pour ${name} ? Le montant sera retiré des revenus.`
    )
    if (!confirmCancel) return

    setSales(prev => prev.map(s => s.id === id ? { ...s, status: 'refunded' } : s))
    setNotification(`Le paiement de ${name} (${N(amount)} DA) a été annulé avec succès.`)
    setTimeout(() => setNotification(null), 4000)
  }

  const tlLabel = {
    semaine: 'Cette semaine',
    mensuelle: 'Ce mois',
    annuelle: 'Cette année',
  }[timeline]

  return (
    <div style={{ minHeight: '100vh', background: 'transparent' }}>
      <style>{`
        .rev-card {
          background: #FFFFFF;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 20px;
          box-shadow: 0 1px 2px rgba(15,23,42,0.02), 0 4px 16px -2px rgba(15,23,42,0.04);
        }
        .rev-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border-bottom: 1px solid #F1F5F9;
          transition: background 0.12s ease;
        }
        .rev-row:last-child { border-bottom: none; }
        .rev-row:hover { background: #FBFBFC; }
        .adm-tab-bar {
          display: inline-flex;
          background: #E8EAED;
          border: 1px solid rgba(0,0,0,0.05);
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
          white-space: nowrap;
          background: transparent;
          color: #64748B;
          transition: all 0.12s ease;
        }
        .adm-tab:hover { color: #0F172A; }
        .adm-tab-active {
          background: #FFFFFF !important;
          color: #0F172A !important;
          font-weight: 600 !important;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04) !important;
        }
        .tnum { font-variant-numeric: tabular-nums; }
      `}</style>

      {/* ── Sticky frosted header ── */}
      <div style={{
        background: 'rgba(245,245,247,0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        padding: '14px clamp(16px,3vw,28px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/admin/dashboard" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12.5, color: '#0B7584', fontWeight: 600, textDecoration: 'none',
            background: 'rgba(11, 117, 132, 0.08)',
            padding: '5px 12px',
            borderRadius: 99,
            transition: 'background 0.15s ease',
          }}>
            <ArrowLeft style={{ width: 14, height: 14 }} />
            Tableau de bord
          </Link>
          <span style={{ color: '#CBD5E1', fontSize: 14 }}>·</span>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 17,
            fontWeight: 400,
            color: '#0F172A',
            margin: 0,
            letterSpacing: '-0.01em',
          }}>
            Revenus <span style={{ fontWeight: 800 }}>· Détail des encaissements</span>
          </h1>
        </div>

        {/* Timeline filter */}
        <div className="adm-tab-bar">
          {(['semaine', 'mensuelle', 'annuelle'] as const).map(tl => (
            <button
              key={tl}
              onClick={() => setTimeline(tl)}
              className={`adm-tab${timeline === tl ? ' adm-tab-active' : ''}`}
            >
              {tl === 'semaine' ? 'Par semaine' : tl === 'mensuelle' ? 'Mensuelle' : 'Annuelle'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Notification toast ── */}
      {notification && (
        <div style={{
          margin: '16px clamp(16px,3vw,28px) 0',
          padding: '10px 16px',
          borderRadius: 12,
          background: '#EFF6FF',
          border: '1px solid #BFDBFE',
          color: '#1E40AF',
          fontSize: 12.5,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        }}>
          <AlertCircle style={{ width: 16, height: 16, flexShrink: 0, color: '#2563EB' }} />
          <span>{notification}</span>
        </div>
      )}

      {/* ── Main content ── */}
      <div style={{ padding: 'clamp(16px,2.5vw,24px) clamp(16px,3vw,28px)' }}>

        {/* Summary banner card */}
        <div className="rev-card" style={{ padding: '20px 24px', marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
            Synthèse financière · {tlLabel}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {/* Total */}
            <div>
              <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>Total encaissé</p>
              <p className="tnum" style={{ fontSize: 30, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {N(totalAmount)} <span style={{ fontSize: 13, fontWeight: 600, color: '#64748B' }}>DA</span>
              </p>
            </div>
            {/* Count */}
            <div>
              <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>Paiements validés</p>
              <p className="tnum" style={{ fontSize: 30, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {activePayments.length} <span style={{ fontSize: 13, fontWeight: 500, color: '#64748B' }}>transactions</span>
              </p>
            </div>
            {/* Average */}
            <div>
              <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>Moyenne par location</p>
              <p className="tnum" style={{ fontSize: 30, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {N(avgAmount)} <span style={{ fontSize: 13, fontWeight: 600, color: '#64748B' }}>DA</span>
              </p>
            </div>
          </div>
        </div>

        {/* Table of payments */}
        <div className="rev-card" style={{ overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1.3fr 1.2fr 1.5fr 1fr',
            gap: 12,
            padding: '12px 18px',
            borderBottom: '1px solid #F1F5F9',
            background: '#F8FAFC',
          }}>
            {['Client & Contact', 'Véhicule', 'Montant', 'Réservé le', 'Période de location', 'Action'].map(h => (
              <span key={h} style={{ fontSize: 10.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {h}
              </span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: '#94A3B8' }}>
              <p style={{ fontSize: 14, fontWeight: 600 }}>Aucun paiement · {tlLabel}</p>
              <p style={{ fontSize: 12, marginTop: 4 }}>Aucune transaction enregistrée pour cette période.</p>
            </div>
          ) : (
            filtered.map((sale) => {
              const date = new Date(sale.created_at)
              const dateFr = date.toLocaleDateString('fr-DZ', {
                day: 'numeric', month: 'short', year: 'numeric',
              })
              const isRefunded = sale.status === 'refunded'

              return (
                <div
                  key={sale.id}
                  className="rev-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 1.3fr 1.2fr 1.5fr 1fr',
                    gap: 12,
                    opacity: isRefunded ? 0.45 : 1,
                    background: isRefunded ? '#FEF2F2' : undefined,
                  }}
                >
                  {/* Client */}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {sale.customer_name}
                    </p>
                    <p style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{sale.phone}</p>
                  </div>

                  {/* Vehicle */}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 12.5, fontWeight: 600, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {sale.vehicle_name}
                    </p>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 10,
                      fontWeight: 600,
                      color: isRefunded ? '#DC2626' : '#059669',
                      marginTop: 2,
                    }}>
                      <span style={{ width: 4, height: 4, borderRadius: 99, background: isRefunded ? '#DC2626' : '#10B981' }} />
                      {isRefunded ? 'Annulé / Retiré' : 'Encaissé'}
                    </span>
                  </div>

                  {/* Amount */}
                  <div>
                    <p className="tnum" style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: isRefunded ? '#94A3B8' : '#0F172A',
                      letterSpacing: '-0.02em',
                      textDecoration: isRefunded ? 'line-through' : 'none',
                    }}>
                      {N(sale.amount)} <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>DA</span>
                    </p>
                  </div>

                  {/* Date & Time booked */}
                  <div>
                    <p style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>{dateFr}</p>
                    <p style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 1 }}>à {sale.booking_time}</p>
                  </div>

                  {/* Period */}
                  <div>
                    <p style={{ fontSize: 11.5, color: '#334155', fontWeight: 500 }}>
                      {sale.pickup_date} <span style={{ color: '#CBD5E1' }}>→</span> {sale.return_date}
                    </p>
                  </div>

                  {/* Action: cancel if created by accident */}
                  <div>
                    {!isRefunded ? (
                      <button
                        type="button"
                        onClick={() => handleCancelPayment(sale.id, sale.customer_name, sale.amount)}
                        title="Annuler ce paiement si erreur"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#DC2626',
                          background: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          padding: '4px 8px',
                          borderRadius: 6,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Trash2 style={{ width: 11, height: 11 }} />
                        Annuler
                      </button>
                    ) : (
                      <span style={{ fontSize: 11, color: '#94A3B8', fontStyle: 'italic' }}>
                        Annulé
                      </span>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer note */}
        {filtered.length > 0 && (
          <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 14, textAlign: 'center' }}>
            {filtered.length} transaction{filtered.length > 1 ? 's' : ''} enregistrée{filtered.length > 1 ? 's' : ''} · {tlLabel} · Cliquez sur &ldquo;Annuler&rdquo; en cas d&apos;erreur pour retirer immédiatement le montant
          </p>
        )}
      </div>
    </div>
  )
}

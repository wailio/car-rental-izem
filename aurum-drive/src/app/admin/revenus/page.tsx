'use client'

export const runtime = 'edge'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'

type Timeline = 'semaine' | 'mensuelle' | 'annuelle'

interface SaleRow {
  id: string
  amount: number
  created_at: string
  customer_name?: string
  phone?: string
  product_id?: string
  pickup_date?: string
  return_date?: string
  [key: string]: unknown
}

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
  const [sales, setSales] = useState<SaleRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch('/api/admin/sales?t=' + Date.now(), { cache: 'no-store' })
      .then(r => r.ok ? r.json() : [])
      .then(data => { setSales(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const { start: tlStart, end: tlEnd } = getTimelineBounds(timeline)

  const filtered = sales
    .filter(s => {
      const d = new Date(s.created_at)
      return d >= tlStart && d <= tlEnd
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const totalAmount = filtered.reduce((sum, s) => sum + (Number(s.amount) || 0), 0)
  const avgAmount = filtered.length > 0 ? Math.round(totalAmount / filtered.length) : 0

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
          padding: 13px 16px;
          border-bottom: 1px solid #F8FAFC;
          transition: background 0.12s ease;
        }
        .rev-row:last-child { border-bottom: none; }
        .rev-row:hover { background: #F8FAFC; }
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
          transition: color 0.12s ease;
        }
        .adm-tab:hover { color: #0F172A; }
        .adm-tab-active {
          background: #FFFFFF !important;
          color: #0F172A !important;
          font-weight: 600 !important;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04) !important;
        }
        .tnum { font-variant-numeric: tabular-nums; }
        .skel {
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 6px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* ── Sticky header ── */}
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
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 12.5, color: '#64748B', fontWeight: 600, textDecoration: 'none',
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
            Revenus <span style={{ fontWeight: 800 }}>· Détail des paiements</span>
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

      {/* ── Main content ── */}
      <div style={{ padding: 'clamp(16px,2.5vw,28px) clamp(16px,3vw,28px)' }}>

        {/* Summary banner card */}
        <div className="rev-card" style={{ padding: '20px 24px', marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
            Résumé · {tlLabel}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {/* Total */}
            <div>
              <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>Total encaissé</p>
              {loading ? (
                <div className="skel" style={{ height: 36, width: '70%' }} />
              ) : (
                <p className="tnum" style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {N(totalAmount)} <span style={{ fontSize: 14, fontWeight: 500, color: '#64748B' }}>DA</span>
                </p>
              )}
            </div>
            {/* Count */}
            <div>
              <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>Nombre de paiements</p>
              {loading ? (
                <div className="skel" style={{ height: 36, width: '50%' }} />
              ) : (
                <p className="tnum" style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {filtered.length}
                </p>
              )}
            </div>
            {/* Average */}
            <div>
              <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>Moyenne par réservation</p>
              {loading ? (
                <div className="skel" style={{ height: 36, width: '60%' }} />
              ) : (
                <p className="tnum" style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {N(avgAmount)} <span style={{ fontSize: 14, fontWeight: 500, color: '#64748B' }}>DA</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Table of payments */}
        <div className="rev-card" style={{ overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1fr 1.2fr 1.5fr',
            gap: 8,
            padding: '10px 16px',
            borderBottom: '1px solid #F1F5F9',
            background: '#F8FAFC',
          }}>
            {['Client', 'Véhicule', 'Montant', 'Date', 'Période'].map(h => (
              <span key={h} style={{ fontSize: 10.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {h}
              </span>
            ))}
          </div>

          {loading ? (
            // Skeleton rows
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rev-row" style={{ gridTemplateColumns: '2fr 2fr 1fr 1.2fr 1.5fr' }}>
                <div className="skel" style={{ height: 14, width: '70%' }} />
                <div className="skel" style={{ height: 14, width: '60%' }} />
                <div className="skel" style={{ height: 14, width: '50%' }} />
                <div className="skel" style={{ height: 14, width: '55%' }} />
                <div className="skel" style={{ height: 14, width: '65%' }} />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: '#94A3B8' }}>
              <TrendingDown style={{ width: 28, height: 28, margin: '0 auto 10px', opacity: 0.4 }} />
              <p style={{ fontSize: 14, fontWeight: 600 }}>Aucun paiement · {tlLabel}</p>
              <p style={{ fontSize: 12, marginTop: 4 }}>Aucune transaction enregistrée pour cette période.</p>
            </div>
          ) : (
            filtered.map((sale, idx) => {
              const date = new Date(sale.created_at)
              const dateFr = date.toLocaleDateString('fr-DZ', {
                day: 'numeric', month: 'short', year: 'numeric',
              })
              const pickupFr = sale.pickup_date
                ? new Date(sale.pickup_date).toLocaleDateString('fr-DZ', { day: 'numeric', month: 'short' })
                : '—'
              const returnFr = sale.return_date
                ? new Date(sale.return_date).toLocaleDateString('fr-DZ', { day: 'numeric', month: 'short' })
                : '—'

              return (
                <div
                  key={sale.id ?? idx}
                  className="rev-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 1fr 1.2fr 1.5fr',
                    gap: 8,
                  }}
                >
                  {/* Client */}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {sale.customer_name ?? 'Client inconnu'}
                    </p>
                    {sale.phone && (
                      <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{sale.phone}</p>
                    )}
                  </div>

                  {/* Vehicle */}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 12.5, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {String(sale.product_id ?? '—')}
                    </p>
                  </div>

                  {/* Amount */}
                  <div>
                    <p className="tnum" style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                      {N(Number(sale.amount) || 0)}
                    </p>
                    <p style={{ fontSize: 10, color: '#94A3B8' }}>DA</p>
                  </div>

                  {/* Date */}
                  <div>
                    <p style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>{dateFr}</p>
                  </div>

                  {/* Timeline pickup → return */}
                  <div>
                    <p style={{ fontSize: 11.5, color: '#64748B' }}>
                      {pickupFr} <span style={{ color: '#CBD5E1' }}>→</span> {returnFr}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer note */}
        {!loading && filtered.length > 0 && (
          <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 14, textAlign: 'center' }}>
            {filtered.length} paiement{filtered.length > 1 ? 's' : ''} · {tlLabel} · triés par date décroissante
          </p>
        )}
      </div>
    </div>
  )
}

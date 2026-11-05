'use client'

export const runtime = 'edge'

import { useState, useEffect, useCallback } from 'react'
import {
  Shield,
  Database,
  Bell,
  Palette,
  HardDrive,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ShoppingBag,
  TrendingUp,
  Package,
} from 'lucide-react'
import { showIosToast, showIosConfirm } from '@/components/ui/ios-dialog'

interface StorageAudit {
  totalFiles: number
  totalSizeBytes: number
  totalSizeFormatted: string
  activeCount: number
  orphanCount: number
  orphanSizeBytes: number
  orphanSizeFormatted: string
  orphanFiles: { name: string; size: number; formattedSize: string; createdAt?: string }[]
}

interface DbCounts {
  products: number | null
  messages: number | null
  orders: number | null
}

export default function AdminSettingsPage() {
  const [audit, setAudit] = useState<StorageAudit | null>(null)
  const [loadingAudit, setLoadingAudit] = useState(true)
  const [cleaning, setCleaning] = useState(false)
  const [dbCounts, setDbCounts] = useState<DbCounts>({ products: null, messages: null, orders: null })

  const fetchStorageAudit = useCallback(async () => {
    setLoadingAudit(true)
    try {
      const res = await fetch('/api/admin/storage-cleanup')
      if (res.ok) {
        const data = await res.json()
        setAudit(data)
      }
    } catch (err) {
      console.error('Failed to load storage audit:', err)
    } finally {
      setLoadingAudit(false)
    }
  }, [])

  const fetchDbCounts = useCallback(async () => {
    try {
      const [prodsRes, ordersRes, salesRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/sales'),
      ])

      const prods = prodsRes.ok ? await prodsRes.json() : []
      const orders = ordersRes.ok ? await ordersRes.json() : []
      const sales = salesRes.ok ? await salesRes.json() : []

      setDbCounts({
        products: Array.isArray(prods) ? prods.length : 0,
        messages: Array.isArray(orders) ? orders.length : 0,
        orders: Array.isArray(sales) ? sales.length : 0,
      })
    } catch (err) {
      console.error('Failed to fetch DB counts:', err)
    }
  }, [])

  useEffect(() => {
    fetchStorageAudit()
    fetchDbCounts()
  }, [fetchStorageAudit, fetchDbCounts])

  const handleCleanOrphans = async () => {
    if (!audit || audit.orphanCount === 0) {
      showIosToast('Aucun fichier orphelin à nettoyer ✓', 'info')
      return
    }

    const confirmed = await showIosConfirm({
      title: 'Libérer l\'espace Supabase',
      message: `Voulez-vous supprimer définitivement les ${audit.orphanCount} fichiers orphelins (${audit.orphanSizeFormatted}) du stockage Supabase ?`,
      confirmText: 'Nettoyer et libérer',
      isDestructive: true,
    })
    if (!confirmed) return

    setCleaning(true)
    try {
      const res = await fetch('/api/admin/storage-cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clean-orphans' }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Erreur lors du nettoyage')
      }

      const data = await res.json()
      showIosToast(`${data.freedFormatted || ''} libérés avec succès dans Supabase ✓`, 'success')
      await fetchStorageAudit()
    } catch (err: any) {
      showIosToast(err.message || 'Erreur lors du nettoyage', 'error')
    } finally {
      setCleaning(false)
    }
  }

  const handleDeleteSingleFile = async (fileName: string) => {
    const confirmed = await showIosConfirm({
      title: 'Supprimer le fichier',
      message: `Supprimer définitivement "${fileName}" de Supabase ?`,
      confirmText: 'Supprimer',
      isDestructive: true,
    })
    if (!confirmed) return

    try {
      const res = await fetch('/api/admin/storage-cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete-file', fileName }),
      })
      if (!res.ok) throw new Error('Échec de la suppression')
      showIosToast('Fichier supprimé définitivement ✓', 'info')
      await fetchStorageAudit()
    } catch (err: any) {
      showIosToast(err.message || 'Erreur', 'error')
    }
  }

  const totalSizeBytes = audit?.totalSizeBytes || 0
  const FREE_TIER_BYTES = 1024 * 1024 * 1024 // 1 Go (Supabase free tier quota)
  const usedPercentage = Math.min(100, (totalSizeBytes / FREE_TIER_BYTES) * 100)

  let formattedPercent = '0%'
  if (usedPercentage > 0 && usedPercentage < 0.1) {
    formattedPercent = '<0.1%'
  } else if (usedPercentage >= 0.1) {
    formattedPercent = `${usedPercentage.toFixed(1)}%`
  }

  const ringRadius = 30
  const ringCircumference = 2 * Math.PI * ringRadius // ~188.5
  const visualProgress = totalSizeBytes > 0 ? Math.max(3, usedPercentage) : 0
  const strokeDashoffset = ringCircumference - (visualProgress / 100) * ringCircumference
  const ringColor =
    usedPercentage > 85 ? '#EF4444' : usedPercentage > 65 ? '#F59E0B' : '#10B981'

  return (
    <div className="min-h-screen pb-16" style={{ background: 'transparent' }}>
      {/* Header */}
      <div
        style={{
          background: 'rgba(245, 245, 247, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          padding: '24px 36px',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 24,
                fontWeight: 300,
                color: '#0F172A',
                letterSpacing: '-0.02em',
              }}
            >
              Paramètres &amp; Infrastructure <span className="font-extrabold text-[#0F172A]">• Cloud &amp; Stockage</span>
            </h1>
            <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
              Gestion du stockage Supabase, base de données et déploiement Cloudflare
            </p>
          </div>

          <button
            onClick={() => {
              fetchStorageAudit()
              fetchDbCounts()
            }}
            disabled={loadingAudit}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#0F172A] bg-white hover:bg-[#F8FAFC] border border-[#E5E7EB] shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingAudit ? 'animate-spin text-[#0F172A]' : 'text-[#64748B]'}`} />
            <span>Actualiser l&apos;état</span>
          </button>
        </div>
      </div>

      <div style={{ padding: '36px', maxWidth: 880 }} className="space-y-6">
        {/* ── Supabase Storage & Space Cleaner Card ── */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 24,
            padding: '26px 28px',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.02), 0 4px 16px -2px rgba(15, 23, 42, 0.04), 0 12px 32px -4px rgba(15, 23, 42, 0.025)',
          }}
        >
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Stockage Supabase (Photos &amp; Médias)</h2>
                <p className="text-xs text-[#64748B] mt-0.5">Bucket &laquo; products &raquo; connecté à Cloudflare Pages</p>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              Synchronisé en direct
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {/* Box 1: Espace total utilisé with thick empty from inside circular shape */}
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold">Espace total utilisé</p>
                <p className="text-xl font-black text-[#0F172A] mt-1">
                  {loadingAudit ? '...' : audit?.totalSizeFormatted || '0 Mo'}
                </p>
                <p className="text-[10px] text-[#94A3B8] mt-1 font-medium">
                  {audit?.totalFiles || 0} fichiers &bull; Quota 1 Go
                </p>
              </div>

              {/* Thick Empty From Inside Circular Shape */}
              <div
                className="relative flex items-center justify-center shrink-0 w-[72px] h-[72px]"
                title={`Utilisation du stockage : ${formattedPercent} de 1 Go`}
              >
                <svg className="w-full h-full -rotate-90" viewBox="0 0 76 76">
                  {/* Thick Background Track (hollow / empty inside) */}
                  <circle
                    cx="38"
                    cy="38"
                    r={ringRadius}
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="8"
                  />
                  {/* Thick Foreground Progress Arc */}
                  <circle
                    cx="38"
                    cy="38"
                    r={ringRadius}
                    fill="none"
                    stroke={ringColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                {/* Hollow Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                  <span className="text-[11px] font-bold text-[#0F172A] font-mono leading-none tracking-tight">
                    {loadingAudit ? '...' : formattedPercent}
                  </span>
                  <span className="text-[8px] text-[#94A3B8] uppercase tracking-wider font-semibold mt-0.5">
                    1 Go
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex flex-col justify-between">
              <div>
                <p className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold">Fichiers actifs / En ligne</p>
                <p className="text-xl font-black text-emerald-600 mt-1">
                  {loadingAudit ? '...' : audit?.activeCount || 0}
                </p>
              </div>
              <p className="text-[10px] text-[#94A3B8] mt-2 font-medium">Attachés au catalogue &amp; config</p>
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex flex-col justify-between">
              <div>
                <p className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold">Fichiers orphelins</p>
                <p className={`text-xl font-black mt-1 ${audit && audit.orphanCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {loadingAudit ? '...' : audit?.orphanCount || 0}
                </p>
              </div>
              <p className="text-[10px] text-[#94A3B8] mt-2 font-medium">
                {audit && audit.orphanCount > 0 ? `${audit.orphanSizeFormatted} récupérables` : 'Aucun espace gaspillé'}
              </p>
            </div>
          </div>

          {/* Action & Explanation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="space-y-1">
              <p className="text-xs text-[#0F172A] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Suppression automatique garantie à 100%</span>
              </p>
              <p className="text-[11px] text-[#64748B] max-w-lg leading-relaxed">
                Toute suppression effectuée dans le panneau Produits efface immédiatement la ligne dans la base de données ET détruit physiquement les fichiers photos du stockage Supabase.
              </p>
            </div>

            <button
              onClick={handleCleanOrphans}
              disabled={cleaning || loadingAudit || (audit?.orphanCount || 0) === 0}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                audit && audit.orphanCount > 0
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                  : 'bg-[#F1F5F9] text-[#94A3B8] border border-[#E2E8F0] cursor-not-allowed'
              }`}
            >
              {cleaning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Nettoyage en cours...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Libérer l&apos;espace ({audit?.orphanSizeFormatted || '0 Mo'})</span>
                </>
              )}
            </button>
          </div>

          {/* Detailed Orphan Files List (if any) */}
          {audit && audit.orphanFiles && audit.orphanFiles.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
              <p className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{audit.orphanFiles.length} fichier(s) orphelin(s) détecté(s) (non rattachés) :</span>
              </p>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {audit.orphanFiles.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between text-xs px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg"
                  >
                    <span className="font-mono text-[#334155] truncate max-w-md text-[11px]">{file.name}</span>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[#94A3B8] text-[10px] font-medium">{file.formattedSize}</span>
                      <button
                        onClick={() => handleDeleteSingleFile(file.name)}
                        className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                        title="Supprimer ce fichier"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Supabase PostgreSQL Database Records Card ── */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 24,
            padding: '26px 28px',
            border: '1px solid #DFE3E8',
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03), 0 4px 16px -2px rgba(15, 23, 42, 0.05), 0 12px 32px -4px rgba(15, 23, 42, 0.03)',
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Base de Données PostgreSQL Supabase</h2>
              <p className="text-xs text-[#64748B] mt-0.5">Tables synchronisées en temps réel</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-[#F4F6F9] border border-[#E5E9EE] rounded-2xl flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] shadow-xs">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-[#64748B] font-medium">Table &laquo; products &raquo;</p>
                <p className="text-lg font-black text-[#0F172A]">
                  {dbCounts.products === null ? '...' : `${dbCounts.products} modèles`}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#F4F6F9] border border-[#E5E9EE] rounded-2xl flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] shadow-xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-[#64748B] font-medium">Table &laquo; messages &raquo;</p>
                <p className="text-lg font-black text-[#0F172A]">
                  {dbCounts.messages === null ? '...' : `${dbCounts.messages} commandes`}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#F4F6F9] border border-[#E5E9EE] rounded-2xl flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] shadow-xs">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-[#64748B] font-medium">Table &laquo; orders &raquo;</p>
                <p className="text-lg font-black text-[#0F172A]">
                  {dbCounts.orders === null ? '...' : `${dbCounts.orders} ventes/leads`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── System Status Items ── */}
        <div className="space-y-3">
          {[
            {
              icon: Layers,
              title: 'Déploiement Cloudflare & GitHub',
              desc: 'Intégration continue via GitHub & runtime Edge Cloudflare Pages',
              status: 'Connecté (Live)',
              statusColor: '#047857',
              statusBg: '#ECFDF5',
              statusBorder: '#A7F3D0',
            },
            {
              icon: Shield,
              title: 'Sécurité & Accès',
              desc: 'Sessions sécurisées et protection du panneau d\'administration',
              status: 'Actif',
              statusColor: '#047857',
              statusBg: '#ECFDF5',
              statusBorder: '#A7F3D0',
            },
            {
              icon: Bell,
              title: 'Notifications & Alertes',
              desc: 'Alertes en direct lors de la réception de nouvelles commandes clients',
              status: 'Actif',
              statusColor: '#1D4ED8',
              statusBg: '#EFF6FF',
              statusBorder: '#BFDBFE',
            },
            {
              icon: Palette,
              title: 'Thème SaaS White Studio',
              desc: 'Interface exclusive épurée blanche & marine haute performance',
              status: 'Actif',
              statusColor: '#1D4ED8',
              statusBg: '#EFF6FF',
              statusBorder: '#BFDBFE',
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: '#FFFFFF',
                borderRadius: 20,
                padding: '16px 22px',
                border: '1px solid #DFE3E8',
                boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03), 0 4px 14px -2px rgba(15, 23, 42, 0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#0F172A',
                }}
              >
                <item.icon className="w-5 h-5 text-[#0F172A]" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14.5, fontWeight: 700, color: '#0F172A' }}>{item.title}</p>
                <p style={{ fontSize: 12.5, color: '#64748B', marginTop: 2 }}>{item.desc}</p>
              </div>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: item.statusColor,
                  background: item.statusBg,
                  border: `1px solid ${item.statusBorder}`,
                  padding: '3px 10px',
                  borderRadius: 99,
                  flexShrink: 0,
                }}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { IzemBrandLockup } from '@/components/common/IzemBrandLockup'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Car,
  Globe,
  CalendarCheck,
  Key,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Users2,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: any
  permKey?: 'dashboard' | 'products' | 'website-info' | 'orders' | 'sales' | 'users'
  adminOnly?: boolean
}

const NAV: { group: string | null; items: NavItem[] }[] = [
  {
    group: null,
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, permKey: 'dashboard' },
    ],
  },
  {
    group: 'Gestion Parc',
    items: [
      { label: 'Locations en cours', href: '/admin/sales', icon: Key, permKey: 'sales' },
      { label: 'Véhicules & Flotte', href: '/admin/products', icon: Car, permKey: 'products' },
      { label: 'Réservations & Attente', href: '/admin/orders', icon: CalendarCheck, permKey: 'orders' },
    ],
  },
  {
    group: 'Configuration',
    items: [
      { label: 'Infos agence & site', href: '/admin/website-info', icon: Globe, permKey: 'website-info' },
      { label: 'Utilisateurs', href: '/admin/users', icon: Users2, permKey: 'users', adminOnly: true },
    ],
  },
]

// Shared clean SaaS hover state for all sidebar items
const HOVER_STYLE = {
  border: '1px solid #E2E8F0',
  background: '#F1F5F9',
  color: '#0F172A',
  boxShadow: 'none',
}

const REST_STYLE = {
  border: '1px solid transparent',
  background: 'transparent',
  color: '#64748B',
  boxShadow: 'none',
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [currentUser, setCurrentUser] = useState<{
    username: string
    role: string
    displayName: string
    permissions?: string[]
  }>({
    username: 'admin',
    role: 'admin',
    displayName: 'Admin',
    permissions: ['dashboard', 'products', 'orders', 'sales', 'website-info', 'users'],
  })

  // Close mobile drawer whenever route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Prevent background scrolling when mobile drawer is open OR confirm is shown
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (mobileOpen || showLogoutConfirm) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  }, [mobileOpen, showLogoutConfirm])

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('admin_user')
      if (stored) {
        setCurrentUser(JSON.parse(stored))
      }
    } catch {}

    fetch('/api/admin/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setCurrentUser(data.user)
          try {
            sessionStorage.setItem('admin_user', JSON.stringify(data.user))
          } catch {}
        }
      })
      .catch(() => {})
  }, [])

  // Show iOS action-sheet confirm instead of logging out immediately
  function confirmLogout() {
    setMobileOpen(false)
    setTimeout(() => setShowLogoutConfirm(true), 50)
  }

  async function handleLogout() {
    setShowLogoutConfirm(false)
    setLoggingOut(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } catch {}
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('admin_auth')
        sessionStorage.removeItem('admin_user')
      } catch {}
      window.location.href = '/admin/login'
    }
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const isSettingsActive = pathname === '/admin/settings' || pathname.startsWith('/admin/settings/')

  function applyHover(el: HTMLElement) {
    el.style.border = HOVER_STYLE.border
    el.style.background = HOVER_STYLE.background
    el.style.color = HOVER_STYLE.color
    el.style.boxShadow = HOVER_STYLE.boxShadow
  }
  function removeHover(el: HTMLElement, keepActive: boolean) {
    if (keepActive) return
    el.style.border = REST_STYLE.border
    el.style.background = REST_STYLE.background
    el.style.color = REST_STYLE.color
    el.style.boxShadow = REST_STYLE.boxShadow
  }

  function hasItemAccess(item: NavItem) {
    if (currentUser.role === 'developer' || currentUser.username === 'wailio' || currentUser.username === 'toweradmin') {
      return true
    }
    const perms = Array.isArray(currentUser.permissions) ? currentUser.permissions : []
    if (item.adminOnly || item.permKey === 'users') {
      return perms.includes('users')
    }
    if (item.permKey) {
      return perms.includes(item.permKey)
    }
    return true
  }

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────
          MOBILE TOP BAR (Visible only on small screens < md)
         ───────────────────────────────────────────────────────────────── */}
      <header
        className="flex md:hidden items-center justify-between px-4 h-14 shrink-0 sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB]"
      >
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center w-10 h-10 rounded-xl active:scale-95 transition-all text-[#0F172A] hover:bg-slate-100 border border-[#E5E7EB]"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/admin/dashboard" className="flex items-center text-[#0F172A] no-underline group">
          <IzemBrandLockup theme="light" size="sm" />
        </Link>

        {/* User Pill / Logout on mobile header */}
        <button
          type="button"
          onClick={confirmLogout}
          className="flex items-center justify-center w-9 h-9 rounded-xl border border-[#E5E7EB] bg-slate-100 text-[#0F172A] active:scale-95 transition-all shadow-xs"
          title="Se déconnecter"
        >
          <span className="text-xs font-bold">
            {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'A'}
          </span>
        </button>
      </header>

      {/* ─────────────────────────────────────────────────────────────────
          MOBILE DRAWER OVERLAY (Slides in over the screen on < md)
         ───────────────────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 md:hidden w-[280px] bg-[#FAFAFB] border-r border-[#E5E7EB] flex flex-col transition-transform duration-300 ease-out shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-[#E5E7EB]">
          <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center text-[#0F172A] no-underline group">
            <IzemBrandLockup theme="light" size="sm" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Nav links (auto-closes on click) */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV.map((section, si) => {
            const visibleItems = section.items.filter(hasItemAccess)
            if (visibleItems.length === 0) return null
            return (
              <div key={si} className="mb-3">
                {section.group && (
                  <p className="text-[10px] font-bold tracking-wider text-[#94A3B8] uppercase px-3 py-2">
                    {section.group}
                  </p>
                )}
                {visibleItems.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1"
                      style={{
                        background: active ? '#0F172A' : 'transparent',
                        color: active ? '#FFFFFF' : '#64748B',
                        border: active ? '1px solid #0F172A' : '1px solid transparent',
                        boxShadow: active ? '0 2px 6px rgba(15,23,42,0.12)' : 'none',
                        fontWeight: active ? 600 : 500,
                      }}
                    >
                      <item.icon className="w-4 h-4 shrink-0" style={{ color: active ? '#FFFFFF' : '#64748B' }} />
                      <span>{item.label}</span>
                      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
                    </Link>
                  )
                })}
              </div>
            )
          })}
        </nav>

        {/* Drawer Bottom */}
        <div className="border-t border-[#E5E7EB] p-3 space-y-2">
          {(currentUser.role === 'developer' || currentUser.username === 'wailio' || currentUser.username === 'toweradmin') && (
            <Link
              href="/admin/settings"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
              style={{
                background: isSettingsActive ? '#0F172A' : 'transparent',
                color: isSettingsActive ? '#FFFFFF' : '#64748B',
                border: isSettingsActive ? '1px solid #0F172A' : '1px solid transparent',
                fontWeight: isSettingsActive ? 600 : 500,
              }}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Paramètres</span>
            </Link>
          )}

          <div
            onClick={confirmLogout}
            className="flex items-center gap-3 p-2.5 rounded-xl border border-[#E5E7EB] bg-white cursor-pointer hover:bg-slate-50 transition-colors shadow-xs"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 bg-[#0F172A] text-white"
            >
              {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#0F172A] truncate">{currentUser.displayName || 'Admin'}</p>
              <p className="text-[10px] text-[#64748B] truncate">
                {currentUser.role === 'developer' ? 'Développeur' : 'Administrateur'}
              </p>
            </div>
            <LogOut className={`w-4 h-4 ${loggingOut ? 'text-red-500' : 'text-[#94A3B8]'}`} />
          </div>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────────
          DESKTOP SIDEBAR (Visible only on screens >= md)
         ───────────────────────────────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col shrink-0 transition-all duration-300"
        style={{
          width: collapsed ? 72 : 252,
          background: '#FAFAFB',
          borderRight: '1px solid #E5E7EB',
          height: '100vh',
          position: 'sticky',
          top: 0,
        }}
      >
        {/* Logo / Collapse */}
        <div
          className="flex items-center shrink-0"
          style={{
            height: 72,
            padding: collapsed ? '0 16px' : '0 20px',
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          {collapsed ? (
            <button
              onClick={() => setCollapsed(false)}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 transition-colors mx-auto text-[#64748B] hover:text-[#0F172A]"
              aria-label="Ouvrir le menu"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <Link href="/admin/dashboard" className="flex items-center text-[#0F172A] no-underline group">
                <IzemBrandLockup theme="light" size="sm" />
              </Link>
              <button
                onClick={() => setCollapsed(true)}
                className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-slate-100 transition-colors ml-2 text-[#94A3B8] hover:text-[#0F172A]"
                aria-label="Collapse sidebar"
              >
                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto space-y-1" style={{ padding: '16px 0' }}>
          {NAV.map((section, si) => {
            const visibleItems = section.items.filter(hasItemAccess)
            if (visibleItems.length === 0) return null
            return (
              <div key={si}>
                {section.group && !collapsed && (
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      color: '#94A3B8',
                      textTransform: 'uppercase',
                      padding: '16px 20px 6px',
                    }}
                  >
                    {section.group}
                  </p>
                )}
                {section.group && collapsed && (
                  <div style={{ height: 1, background: '#E5E7EB', margin: '12px 10px' }} />
                )}
                {visibleItems.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className="flex items-center gap-3 transition-all duration-150 group"
                      style={{
                        padding: collapsed ? '9px 0' : '9px 16px',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        margin: '3px 10px',
                        borderRadius: 12,
                        border: active ? '1px solid #0F172A' : '1px solid transparent',
                        background: active ? '#0F172A' : 'transparent',
                        color: active ? '#FFFFFF' : '#64748B',
                        boxShadow: active ? '0 2px 6px rgba(15,23,42,0.12)' : 'none',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!active) applyHover(e.currentTarget as HTMLElement)
                      }}
                      onMouseLeave={(e) => {
                        if (!active) removeHover(e.currentTarget as HTMLElement, false)
                      }}
                    >
                      <item.icon
                        className="shrink-0 transition-colors"
                        style={{ width: 17, height: 17, color: active ? '#FFFFFF' : '#64748B' }}
                      />
                      {!collapsed && (
                        <span
                          style={{
                            fontSize: 13.5,
                            fontWeight: active ? 600 : 500,
                            letterSpacing: '0.01em',
                            transition: 'color 0.15s',
                          }}
                        >
                          {item.label}
                        </span>
                      )}
                      {!collapsed && (
                        <div
                          className={`ml-auto transition-opacity duration-200 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                          style={{ width: 5, height: 5, borderRadius: 99, background: active ? '#FFFFFF' : '#94A3B8' }}
                        />
                      )}
                    </Link>
                  )
                })}
              </div>
            )
          })}
        </nav>

        {/* Bottom Block */}
        <div style={{ borderTop: '1px solid #E5E7EB', padding: '12px 10px' }}>
          {/* Settings */}
          {(currentUser.role === 'developer' || currentUser.username === 'wailio' || currentUser.username === 'toweradmin') && (
            <Link
              href="/admin/settings"
              title={collapsed ? 'Paramètres' : undefined}
              className="flex items-center gap-3"
              style={{
                padding: collapsed ? '9px 0' : '9px 16px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 12,
                border: isSettingsActive ? '1px solid #0F172A' : '1px solid transparent',
                background: isSettingsActive ? '#0F172A' : 'transparent',
                color: isSettingsActive ? '#FFFFFF' : '#64748B',
                boxShadow: isSettingsActive ? '0 2px 6px rgba(15,23,42,0.12)' : 'none',
                transition: 'all 0.15s cubic-bezier(0.32,0.72,0,1)',
                textDecoration: 'none',
                margin: '2px 0',
              }}
              onMouseEnter={(e) => { if (!isSettingsActive) applyHover(e.currentTarget as HTMLElement) }}
              onMouseLeave={(e) => { if (!isSettingsActive) removeHover(e.currentTarget as HTMLElement, false) }}
            >
              <Settings style={{ width: 17, height: 17, flexShrink: 0, color: isSettingsActive ? '#FFFFFF' : '#64748B' }} />
              {!collapsed && <span style={{ fontSize: 13.5, fontWeight: isSettingsActive ? 600 : 500, letterSpacing: '0.01em' }}>Paramètres</span>}
            </Link>
          )}

          {/* Account row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: collapsed ? 0 : 10,
              padding: collapsed ? '9px 0' : '9px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              marginTop: 6,
              borderRadius: 12,
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'all 0.15s cubic-bezier(0.32,0.72,0,1)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#F8FAFC' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#FFFFFF' }}
            onClick={confirmLogout}
            title="Se déconnecter"
          >
            <div
              style={{
                width: 32, height: 32, borderRadius: 99, flexShrink: 0,
                background: '#0F172A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: '#FFFFFF', fontWeight: 600,
              }}
            >
              {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'A'}
            </div>
            {!collapsed && (
              <>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12.5, color: '#0F172A', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentUser.displayName || 'Admin'}
                  </p>
                  <p style={{ fontSize: 11, color: '#64748B', marginTop: 1, fontWeight: 500 }}>
                    {currentUser.role === 'developer' ? 'Développeur' : 'Administrateur'}
                  </p>
                </div>
                <LogOut style={{ width: 14, height: 14, color: loggingOut ? '#EF4444' : '#94A3B8', flexShrink: 0, transition: 'color 0.2s' }} />
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────────
          LOGOUT CONFIRMATION MODAL
         ───────────────────────────────────────────────────────────────── */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[9999] flex items-end justify-center md:items-center"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {/* Scrim */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
            onClick={() => setShowLogoutConfirm(false)}
          />

          {/* Action Sheet */}
          <div
            className="relative w-full mx-4 mb-6 md:mb-0 md:w-[360px] flex flex-col gap-2.5"
            style={{ maxWidth: 380, animation: 'iosSheetIn 0.38s cubic-bezier(0.32, 0.72, 0, 1) both' }}
          >
            {/* Main card */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 18,
                overflow: 'hidden',
                boxShadow: '0 20px 45px -10px rgba(0,0,0,0.18)',
                border: '1px solid #E5E7EB',
              }}
            >
              {/* Title + message */}
              <div
                style={{
                  padding: '20px 22px 16px',
                  textAlign: 'center',
                  borderBottom: '1px solid #F1F5F9',
                }}
              >
                <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                  Se déconnecter ?
                </p>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>
                  Vous allez quitter l'espace d'administration de IZEM MOTORS.
                </p>
              </div>

              {/* Confirm (Destructive) */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  textAlign: 'center',
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#DC2626',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
              >
                <LogOut style={{ width: 17, height: 17 }} />
                {loggingOut ? 'Déconnexion...' : 'Se déconnecter'}
              </button>
            </div>

            {/* Cancel button */}
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(false)}
              style={{
                width: '100%',
                padding: '14px 20px',
                textAlign: 'center',
                fontSize: 15,
                fontWeight: 600,
                color: '#0F172A',
                background: '#FFFFFF',
                borderRadius: 14,
                border: '1px solid #E5E7EB',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F8FAFC' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF' }}
            >
              Annuler
            </button>
          </div>

          <style>{`
            @keyframes iosSheetIn {
              from { opacity: 0; transform: translateY(30px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0)    scale(1); }
            }
          `}</style>
        </div>
      )}
    </>
  )
}

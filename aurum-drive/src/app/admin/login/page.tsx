'use client'

export const runtime = 'edge'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { IzemBrandLockup } from '@/components/common/IzemBrandLockup'
import { Eye, EyeOff, User, Lock, AlertCircle, Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(false)
  const [shake, setShake] = useState(false)
  const [userFocused, setUserFocused] = useState(false)
  const [pwFocused, setPwFocused] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/admin/me')
        if (res.ok) {
          const data = await res.json()
          if (data.authenticated) {
            const perms: string[] = data.user?.permissions || []
            const isSuper = data.user?.role === 'developer' || data.user?.username === 'toweradmin'

            if (!isSuper && perms.length > 0 && !perms.includes('dashboard')) {
              if (perms.includes('orders')) router.replace('/admin/orders')
              else if (perms.includes('sales')) router.replace('/admin/sales')
              else if (perms.includes('products')) router.replace('/admin/products')
              else if (perms.includes('website-info')) router.replace('/admin/website-info')
              else router.replace('/admin/dashboard')
            } else {
              router.replace('/admin/dashboard')
            }
            return
          }
        }
      } catch {}
      setCheckingAuth(false)
    }
    checkSession()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim() || !password) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('admin_auth', '1')
          sessionStorage.setItem('admin_user', JSON.stringify(data.user))
        }
        const perms: string[] = data.user?.permissions || []
        const isSuper = data.user?.role === 'developer' || data.user?.username === 'toweradmin'

        if (!isSuper && perms.length > 0 && !perms.includes('dashboard')) {
          if (perms.includes('orders')) {
            router.replace('/admin/orders')
          } else if (perms.includes('sales')) {
            router.replace('/admin/sales')
          } else if (perms.includes('products')) {
            router.replace('/admin/products')
          } else if (perms.includes('website-info')) {
            router.replace('/admin/website-info')
          } else {
            router.replace('/admin/dashboard')
          }
        } else {
          router.replace('/admin/dashboard')
        }
      } else {
        setError(data.error || 'Identifiant ou mot de passe incorrect')
        setShake(true)
        setTimeout(() => setShake(false), 550)
        setLoading(false)
      }
    } catch {
      setError('Erreur réseau. Veuillez réessayer.')
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F6F7F9]">
        <div className="w-8 h-8 border-2 border-[#E2E8F0] border-t-[#0F172A] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-8 relative overflow-hidden bg-[#F6F7F9]"
      style={{
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Main card */}
      <div
        ref={cardRef}
        className="relative z-10 w-full rounded-[24px] bg-white border border-[#E5E7EB] p-8 sm:p-10"
        style={{
          maxWidth: 'min(420px, calc(100vw - 32px))',
          boxShadow: '0 20px 45px -12px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
          animation: shake ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' : undefined,
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="mb-6 flex items-center justify-center">
            <IzemBrandLockup theme="light" size="md" />
          </div>

          {/* Heading */}
          <h1
            className="text-[22px] sm:text-[24px] font-bold text-[#0F172A] tracking-[-0.02em] text-center"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Espace Administration
          </h1>

          {/* Subtitle */}
          <p className="text-[13px] text-[#64748B] text-center mt-1.5 mb-7">
            Saisissez vos identifiants pour accéder à la gestion du parc
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            {/* Username field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#334155] pl-0.5">
                Identifiant
              </label>
              <div
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 bg-white"
                style={{
                  border: error
                    ? '1.5px solid #EF4444'
                    : userFocused
                    ? '1.5px solid #0F172A'
                    : '1.5px solid #E2E8F0',
                  boxShadow: userFocused
                    ? '0 0 0 3px rgba(15, 23, 42, 0.08)'
                    : 'none',
                }}
              >
                <User className="w-4 h-4 shrink-0" style={{ color: userFocused ? '#0F172A' : '#94A3B8' }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError('') }}
                  onFocus={() => setUserFocused(true)}
                  onBlur={() => setUserFocused(false)}
                  placeholder="Nom d'utilisateur"
                  autoComplete="username"
                  required
                  className="w-full bg-transparent text-[13.5px] text-[#0F172A] placeholder-[#94A3B8] border-none"
                  style={{ outline: 'none', boxShadow: 'none' }}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#334155] pl-0.5">
                Mot de passe
              </label>
              <div
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 bg-white"
                style={{
                  border: error
                    ? '1.5px solid #EF4444'
                    : pwFocused
                    ? '1.5px solid #0F172A'
                    : '1.5px solid #E2E8F0',
                  boxShadow: pwFocused
                    ? '0 0 0 3px rgba(15, 23, 42, 0.08)'
                    : 'none',
                }}
              >
                <Lock className="w-4 h-4 shrink-0" style={{ color: pwFocused ? '#0F172A' : '#94A3B8' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  onFocus={() => setPwFocused(true)}
                  onBlur={() => setPwFocused(false)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full bg-transparent text-[13.5px] text-[#0F172A] placeholder-[#94A3B8] border-none flex-1"
                  style={{ outline: 'none', boxShadow: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  tabIndex={-1}
                  className="text-[#94A3B8] hover:text-[#0F172A] transition-colors p-1 shrink-0"
                  title={showPw ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[12px] font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Sign In button */}
            <button
              type="submit"
              disabled={loading || !username.trim() || !password}
              className="w-full mt-2 py-3.5 rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.99] cursor-pointer"
              style={{
                background:
                  loading || !username.trim() || !password
                    ? '#E2E8F0'
                    : '#0F172A',
                color: loading || !username.trim() || !password ? '#94A3B8' : '#FFFFFF',
                boxShadow:
                  loading || !username.trim() || !password
                    ? 'none'
                    : '0 4px 14px rgba(15, 23, 42, 0.18)',
                cursor: loading || !username.trim() || !password ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <span>Se connecter</span>
              )}
            </button>
          </form>

          <p className="text-[11.5px] text-[#94A3B8] text-center mt-6">
            Accès sécurisé réservé aux administrateurs de l&apos;agence IZEM MOTORS
          </p>
        </div>
      </div>

      {/* Global style: remove ALL native input focus outlines */}
      <style>{`
        input:focus {
          outline: none !important;
          box-shadow: none !important;
          -webkit-box-shadow: none !important;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  )
}

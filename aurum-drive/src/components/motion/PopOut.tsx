'use client'

import React, { useEffect, useRef, useState } from 'react'

interface PopOutProps {
  children: React.ReactNode
  preset?: 'pop' | 'pop-up' | 'pop-scale' | 'pop-left' | 'pop-right' | 'pop-badge'
  stagger?: boolean
  delay?: number // ms
  duration?: number // ms
  threshold?: number
  className?: string
  style?: React.CSSProperties
  as?: React.ElementType
}

export function PopOut({
  children,
  preset = 'pop-up',
  stagger = false,
  delay = 0,
  duration,
  threshold = 0.15,
  className = '',
  style = {},
  as: Component = 'div',
}: PopOutProps) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(el)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  const initialStyle: React.CSSProperties = {
    ...style,
    willChange: 'transform, opacity',
    transition: `opacity ${duration || 750}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration || 750}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
  }

  let transformFrom = 'translate3d(0, 26px, 0) scale(0.94)'
  if (preset === 'pop-scale' || preset === 'pop-badge') {
    transformFrom = 'scale(0.88)'
  } else if (preset === 'pop-left') {
    transformFrom = 'translate3d(-32px, 0, 0) scale(0.95)'
  } else if (preset === 'pop-right') {
    transformFrom = 'translate3d(32px, 0, 0) scale(0.95)'
  } else if (preset === 'pop') {
    transformFrom = 'scale(0.94)'
  }

  return (
    <Component
      ref={ref}
      className={`${stagger ? 'pop-stagger' : ''} ${className}`}
      style={{
        ...initialStyle,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translate3d(0, 0, 0) scale(1)' : transformFrom,
      }}
    >
      {children}
    </Component>
  )
}

'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollPopObserver() {
  const pathname = usePathname()

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('[data-pop]').forEach((el) => {
        el.classList.add('pop-in')
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('pop-in')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px',
      }
    )

    const scanAndObserve = () => {
      const elements = document.querySelectorAll('[data-pop]:not(.pop-in)')
      elements.forEach((el) => {
        el.classList.add('pop-init')
        observer.observe(el)
      })
    }

    // Initial scan and slight delayed scan for dynamically hydrated content
    scanAndObserve()
    const t = setTimeout(scanAndObserve, 300)

    // MutationObserver to auto-catch freshly added dynamic content (modals, drawers, lists)
    const mutObserver = new MutationObserver(() => {
      scanAndObserve()
    })

    mutObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutObserver.disconnect()
      clearTimeout(t)
    }
  }, [pathname])

  return null
}

'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollPopObserver() {
  const pathname = usePathname()

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/car/") ||
    pathname?.startsWith("/c/")
  ) {
    return null
  }

  useEffect(() => {
    // Respect reduced motion — reveal everything immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('[data-pop]').forEach((el) => {
        el.classList.add('pop-in')
      })
      return
    }

    // Trigger early ahead of viewport bottom so shapes are smoothly visible as user arrives
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            el.classList.add('pop-in')
            observer.unobserve(el)
          }
        })
      },
      {
        threshold: 0.01,
        rootMargin: '100px 0px 80px 0px',
      }
    )

    const scanAndObserve = () => {
      document.querySelectorAll('[data-pop]:not(.pop-in)').forEach((el) => {
        const rect = el.getBoundingClientRect()
        // If element is already in or near viewport, show immediately without delay
        const isNearOrInViewport = rect.top < window.innerHeight + 80 && rect.bottom > -80
        if (isNearOrInViewport) {
          el.classList.add('pop-in')
        } else {
          el.classList.add('pop-init')
          observer.observe(el)
        }
      })
    }

    // Initial scan + safety net reveals
    scanAndObserve()
    const t1 = setTimeout(scanAndObserve, 200)
    // Safety net: reveal all elements so nothing is ever stuck invisible
    const t2 = setTimeout(() => {
      document.querySelectorAll('[data-pop]:not(.pop-in)').forEach((el) => {
        el.classList.add('pop-in')
      })
    }, 1200)

    // Catch dynamically injected content (modals, drawers, lists)
    const mutObserver = new MutationObserver(() => {
      scanAndObserve()
    })
    mutObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutObserver.disconnect()
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [pathname])

  return null
}

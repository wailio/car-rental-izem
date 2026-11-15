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

    // Trigger smoothly as elements approach the viewport bottom (natural eye-comfy reveal)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            // Stagger children fire on parent reveal
            el.classList.add('pop-in')
            observer.unobserve(el)
          }
        })
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    const scanAndObserve = () => {
      document.querySelectorAll('[data-pop]:not(.pop-in)').forEach((el) => {
        // Elements already above fold should NOT animate (they're visible on load)
        const rect = el.getBoundingClientRect()
        const alreadyVisible = rect.top < window.innerHeight - 40 && rect.bottom > 0
        if (alreadyVisible) {
          el.classList.add('pop-in')
        } else {
          el.classList.add('pop-init')
          observer.observe(el)
        }
      })
    }

    // Initial scan + slight delay for hydrated content
    scanAndObserve()
    const t = setTimeout(scanAndObserve, 400)

    // Catch dynamically injected content (modals, drawers, lists)
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

'use client'

import React, { useEffect, useRef } from 'react'
import { MapPin, Check } from 'lucide-react'

interface IosLocationDropdownProps {
  locations: string[]
  selectedLocation: string
  onSelect: (location: string) => void
  isOpen: boolean
  onClose: () => void
}

export function IosLocationDropdown({
  locations,
  selectedLocation,
  onSelect,
  isOpen,
  onClose,
}: IosLocationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      role="listbox"
      aria-label="Lieux de prise en charge"
      className="absolute left-0 bottom-[calc(100%+12px)] z-50 w-72 sm:w-80 rounded-2xl p-2 bg-[#121620]/95 backdrop-blur-2xl border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.85)] text-white animate-in fade-in zoom-in-95 duration-300"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3 py-2 border-b border-white/10 mb-1 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
          Point de retrait
        </span>
        <span className="text-[10px] text-[#0B7584] font-medium">
          Remise 24h/24
        </span>
      </div>

      <div className="space-y-1">
        {locations.map((loc) => {
          const isSelected = loc === selectedLocation
          return (
            <button
              key={loc}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => {
                onSelect(loc)
                onClose()
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-[#0B7584]/20 border border-[#0B7584]/40 text-white'
                  : 'text-white/85 hover:bg-white/10 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#0B7584] text-white' : 'bg-white/10 text-white/70'
                  }`}
                >
                  <MapPin size={14} />
                </div>
                <div className="truncate">
                  <div className="text-[13px] font-semibold leading-tight truncate">
                    {loc}
                  </div>
                  <div className="text-[10.5px] text-white/50 font-normal">
                    {loc.includes('Aéroport') ? 'Terminal International & National' : 'Agence DZ Rent Car'}
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-[#0B7584] flex items-center justify-center text-white shrink-0 ml-2 shadow-sm">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

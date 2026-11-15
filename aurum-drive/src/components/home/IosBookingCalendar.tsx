'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, Check } from 'lucide-react'

interface IosBookingCalendarProps {
  selectedDate: string
  selectedTime?: string
  onChange: (dateStr: string, timeStr: string) => void
  isOpen: boolean
  onClose: () => void
}

const MONTH_NAMES_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

const DAYS_SHORT_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const TIME_PRESETS = [
  '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'
]

export function IosBookingCalendar({
  selectedDate,
  selectedTime = '10:00',
  onChange,
  isOpen,
  onClose,
}: IosBookingCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize current view from selectedDate or today
  const initialDate = selectedDate ? new Date(selectedDate) : new Date()
  const [currentYear, setCurrentYear] = useState(
    isNaN(initialDate.getFullYear()) ? new Date().getFullYear() : initialDate.getFullYear()
  )
  const [currentMonth, setCurrentMonth] = useState(
    isNaN(initialDate.getMonth()) ? new Date().getMonth() : initialDate.getMonth()
  )
  const [activeDateStr, setActiveDateStr] = useState(selectedDate || '')
  const [activeTimeStr, setActiveTimeStr] = useState(selectedTime)

  useEffect(() => {
    if (selectedDate) {
      setActiveDateStr(selectedDate)
      const d = new Date(selectedDate)
      if (!isNaN(d.getTime())) {
        setCurrentYear(d.getFullYear())
        setCurrentMonth(d.getMonth())
      }
    }
  }, [selectedDate])

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

  // Helpers for calendar calculation
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Number of days in currentMonth
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // First day of week (0 = Sunday in JS, we want Monday = 0)
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay()
  const offsetDays = (firstDayIndex + 6) % 7 // Shift so Monday is 0

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  const handleSelectDay = (day: number) => {
    const monthFormatted = String(currentMonth + 1).padStart(2, '0')
    const dayFormatted = String(day).padStart(2, '0')
    const formatted = `${currentYear}-${monthFormatted}-${dayFormatted}`
    setActiveDateStr(formatted)
  }

  const handleConfirm = () => {
    const dateToEmit = activeDateStr || new Date().toISOString().split('T')[0]
    onChange(dateToEmit, activeTimeStr)
    onClose()
  }

  return (
    <div
      ref={containerRef}
      className="absolute right-0 sm:left-0 bottom-[calc(100%+12px)] z-50 w-[310px] sm:w-[340px] rounded-3xl p-4 sm:p-5 bg-[#121620]/95 backdrop-blur-2xl border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.85)] text-white animate-in fade-in zoom-in-95 duration-300"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* ── 1. Top Month Navigation ── */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <CalendarIcon size={14} className="text-[#0B7584]" />
          <h4 className="text-[14px] font-bold tracking-tight text-white m-0">
            {MONTH_NAMES_FR[currentMonth]} {currentYear}
          </h4>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white/80 transition-all cursor-pointer"
            aria-label="Mois précédent"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white/80 transition-all cursor-pointer"
            aria-label="Mois suivant"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* ── 2. Days of Week Labels ── */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
        {DAYS_SHORT_FR.map((d) => (
          <span
            key={d}
            className="text-[10.5px] font-semibold text-white/45 tracking-wider uppercase py-0.5"
          >
            {d}
          </span>
        ))}
      </div>

      {/* ── 3. Days Grid ── */}
      <div className="grid grid-cols-7 gap-1 text-center mb-4">
        {/* Empty cells for leading offset */}
        {Array.from({ length: offsetDays }).map((_, i) => (
          <div key={`blank-${i}`} className="h-8" />
        ))}

        {/* Month days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNumber = i + 1
          const monthFormatted = String(currentMonth + 1).padStart(2, '0')
          const dayFormatted = String(dayNumber).padStart(2, '0')
          const thisDateStr = `${currentYear}-${monthFormatted}-${dayFormatted}`
          const thisDateObj = new Date(currentYear, currentMonth, dayNumber)

          const isPast = thisDateObj < today
          const isSelected = activeDateStr === thisDateStr
          const isCurrentToday = thisDateObj.getTime() === today.getTime()

          return (
            <button
              key={dayNumber}
              type="button"
              disabled={isPast}
              onClick={() => handleSelectDay(dayNumber)}
              className={`h-8 w-8 sm:h-9 sm:w-9 mx-auto rounded-full flex items-center justify-center text-[12px] font-medium transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-[#0B7584] text-white font-bold shadow-md shadow-[#0B7584]/40 scale-105'
                  : isPast
                  ? 'text-white/20 cursor-not-allowed'
                  : isCurrentToday
                  ? 'text-[#0B7584] border border-[#0B7584]/50 hover:bg-white/10 font-bold'
                  : 'text-white/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              {dayNumber}
            </button>
          )
        })}
      </div>

      {/* ── 4. Pickup Time Selector (iOS Segmented Pills) ── */}
      <div className="pt-2.5 pb-3 border-t border-white/10">
        <div className="flex items-center gap-1.5 mb-2">
          <Clock size={12} className="text-[#0B7584]" />
          <span className="text-[11px] font-semibold text-white/70 tracking-tight">
            Heure estimée de prise en charge
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {TIME_PRESETS.map((t) => {
            const isTimeSelected = activeTimeStr === t
            return (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTimeStr(t)}
                className={`py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 cursor-pointer ${
                  isTimeSelected
                    ? 'bg-[#0B7584] text-white shadow-sm'
                    : 'bg-white/5 hover:bg-white/10 text-white/75 border border-white/10'
                }`}
              >
                {t}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── 5. Action Footer ── */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/75 text-xs font-semibold transition-colors cursor-pointer"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="flex-[2] py-2 rounded-xl bg-[#0B7584] hover:bg-[#0c8697] text-white text-xs font-bold transition-all shadow-md shadow-[#0B7584]/30 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Check size={13} strokeWidth={2.5} />
          <span>Confirmer</span>
        </button>
      </div>
    </div>
  )
}

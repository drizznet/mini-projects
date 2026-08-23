'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useTheme, type Theme } from '@/components/features/theme/theme-context'
import { Sun, Moon, Coffee, ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ThemeSelector() {
  const { theme, setTheme, toggleDarkMode } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const themes: { value: Theme; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      value: 'light',
      label: 'Warm Light',
      icon: <Sun className="h-4 w-4 text-amber-500" />,
      desc: 'Warm gray minimalist desk',
    },
    {
      value: 'dark',
      label: 'Matte Dark',
      icon: <Moon className="h-4 w-4 text-blue-400" />,
      desc: 'Sleek dark with copper accent',
    },
    {
      value: 'cozy',
      label: 'Cozy Oak',
      icon: <Coffee className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
      desc: 'Warm oak and amber glow',
    },
  ]

  const activeThemeInfo = themes.find((t) => t.value === theme) || themes[0]

  return (
    <div className="relative flex items-center gap-1" ref={dropdownRef}>
      {/* Quick Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        title="Toggle dark mode"
      >
        {theme === 'dark' ? (
          <Moon className="h-4 w-4 text-blue-400 transition-transform hover:rotate-12" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500 transition-transform hover:rotate-45" />
        )}
      </button>

      {/* Dropdown Menu Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <span className="flex items-center gap-1.5">
          {activeThemeInfo.icon}
          <span className="hidden sm:inline">{activeThemeInfo.label}</span>
        </span>
        <ChevronDown className={`h-3.5 w-3.5 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full z-50 mt-1 w-56 rounded-lg border border-border bg-card p-1 shadow-lg"
          >
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              Select Workspace Ambience
            </div>
            <div className="h-[1px] bg-border my-1" />
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => {
                  setTheme(t.value)
                  setIsOpen(false)
                }}
                className={`flex w-full items-start gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                  theme === t.value ? 'bg-accent/50 text-foreground font-medium' : 'text-foreground/80'
                }`}
              >
                <div className="mt-0.5">{t.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span>{t.label}</span>
                    {theme === t.value && <Check className="h-3.5 w-3.5 text-primary" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-none">
                    {t.desc}
                  </p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

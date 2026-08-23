'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { siteConfig } from '@/config/site'

export type Theme = 'light' | 'dark' | 'cozy'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(siteConfig.themeStorageKey) as Theme
    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'cozy') {
      setThemeState(savedTheme)
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setThemeState(prefersDark ? 'dark' : 'light')
    }
    setMounted(true)
  }, [])

  // Apply theme classes and attributes when theme changes
  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    
    // Remove all theme classes and attributes
    root.classList.remove('dark')
    root.removeAttribute('data-theme')

    // Apply active theme
    root.setAttribute('data-theme', theme)
    if (theme === 'dark') {
      root.classList.add('dark')
    }

    localStorage.setItem(siteConfig.themeStorageKey, theme)
  }, [theme, mounted])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const toggleDarkMode = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleDarkMode }}>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', visibility: mounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

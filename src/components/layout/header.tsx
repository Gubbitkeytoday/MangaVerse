'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Moon,
  Sun,
  Library,
  Shield,
  Menu,
  X,
  BookOpen,
  Compass,
  Home as HomeIcon,
  Sparkles,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import type { Manga } from '@/lib/types'
import { CoverImage } from '@/components/manga/cover-image'
import { formatNumber } from '@/lib/utils'

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')

  const view = useAppStore((s) => s.view)
  const goHome = useAppStore((s) => s.goHome)
  const goBrowse = useAppStore((s) => s.goBrowse)
  const goLibrary = useAppStore((s) => s.goLibrary)
  const goAdmin = useAppStore((s) => s.goAdmin)
  const goDetail = useAppStore((s) => s.goDetail)

  // Track mount to avoid hydration mismatch when reading the theme.
  // This is a one-time flag, the intended use of a mount effect.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Live search
  const { data: searchResults } = useQuery<{ items: Manga[] }>({
    queryKey: ['search', searchVal],
    queryFn: async () => {
      const res = await fetch(`/api/manga?q=${encodeURIComponent(searchVal)}&limit=6`)
      return res.json()
    },
    enabled: searchVal.length >= 2,
  })

  const [showResults, setShowResults] = useState(false)

  const navItems = [
    { label: 'หน้าแรก', icon: HomeIcon, view: 'home' as const, action: goHome },
    { label: 'สำรวจ', icon: Compass, view: 'browse' as const, action: goBrowse },
    { label: 'คลังของฉัน', icon: Library, view: 'library' as const, action: goLibrary },
    { label: 'หลังบ้าน', icon: Shield, view: 'admin' as const, action: goAdmin },
  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-sm'
          : 'border-b border-transparent bg-background/40 backdrop-blur-md'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        {/* Logo */}
        <button
          onClick={goHome}
          className="flex shrink-0 items-center gap-2 transition-transform hover:scale-105"
        >
          <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-rose-600 shadow-lg shadow-primary/30">
            <BookOpen className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="hidden sm:block">
            <span className="block text-lg font-black leading-none tracking-tight">
              Manga<span className="text-primary">Verse</span>
            </span>
            <span className="block text-[10px] font-medium text-muted-foreground">
              แหล่งรวมมังงะแปลไทย
            </span>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = view === item.view
            return (
              <button
                key={item.view}
                onClick={item.action}
                className={cn(
                  'relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <Icon size={16} />
                {item.label}
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-lg bg-primary/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </nav>

        {/* Search */}
        <div className="relative ml-auto w-full max-w-xs">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value)
                setShowResults(true)
              }}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              placeholder="ค้นหามังงะ..."
              className="h-9 rounded-full border-border/60 bg-muted/50 pl-9 pr-4 text-sm"
            />
          </div>

          <AnimatePresence>
            {showResults && searchResults && searchResults.items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
              >
                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                  {searchResults.items.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        goDetail(m.slug)
                        setSearchVal('')
                        setShowResults(false)
                      }}
                      className="flex w-full items-center gap-3 border-b border-border/40 px-3 py-2 text-left transition-colors last:border-0 hover:bg-muted/60"
                    >
                      <CoverImage
                        src={m.cover}
                        alt={m.title}
                        title={m.title}
                        className="h-12 w-9 shrink-0 rounded"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{m.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {m.author} • {formatNumber(m.views)} อ่าน
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    goBrowse({ q: searchVal })
                    setShowResults(false)
                  }}
                  className="flex w-full items-center justify-center gap-1.5 bg-muted/40 py-2 text-xs font-semibold text-primary transition-colors hover:bg-muted"
                >
                  <Sparkles size={12} /> ดูผลลัพธ์ทั้งหมด
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-full"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="เปลี่ยนธีม"
        >
          {mounted && theme === 'dark' ? (
            <Sun className="h-[18px] w-[18px]" />
          ) : (
            <Moon className="h-[18px] w-[18px]" />
          )}
        </Button>

        {/* Mobile menu */}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-full md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="เมนู"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 p-3">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = view === item.view
                return (
                  <button
                    key={item.view}
                    onClick={() => {
                      item.action()
                      setMobileOpen(false)
                    }}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium',
                      active ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                    )}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

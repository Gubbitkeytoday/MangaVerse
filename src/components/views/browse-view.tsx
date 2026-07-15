'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { SlidersHorizontal, X, Search, Loader2 } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { MangaCard, MangaCardSkeleton } from '@/components/manga/manga-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Manga, Genre } from '@/lib/types'

const STATUSES = ['ONGOING', 'COMPLETED', 'HIATUS']
const TYPES = ['MANGA', 'MANHWA', 'MANHUA', 'WEBTOON']
const SORTS = [
  { value: 'popular', label: 'ยอดนิยม' },
  { value: 'views', label: 'ยอดเข้าชม' },
  { value: 'rating', label: 'คะแนน' },
  { value: 'latest', label: 'มาใหม่' },
  { value: 'updated', label: 'อัปเดตล่าสุด' },
  { value: 'followers', label: 'ผู้ติดตาม' },
  { value: 'name', label: 'ชื่อ A-Z' },
]

const LIMIT = 24

export function BrowseView() {
  // Source of truth from store — no local syncing effects
  const q = useAppStore((s) => s.browseQuery)
  const genre = useAppStore((s) => s.browseGenre)
  const sort = useAppStore((s) => s.browseSort)
  const setQ = useAppStore((s) => s.setBrowseQuery)
  const setGenre = useAppStore((s) => s.setBrowseGenre)
  const setSort = useAppStore((s) => s.setBrowseSort)

  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const [offset, setOffset] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  const { data, isLoading, isFetching } = useQuery<{ items: Manga[]; total: number }>({
    queryKey: ['browse', q, genre, status, type, sort, offset],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: String(LIMIT),
        offset: String(offset),
        sort,
      })
      if (q) params.set('q', q)
      if (genre) params.set('genre', genre)
      if (status) params.set('status', status)
      if (type) params.set('type', type)
      const res = await fetch(`/api/manga?${params}`)
      return res.json()
    },
  })

  const { data: genresData } = useQuery<Genre[]>({
    queryKey: ['genres'],
    queryFn: async () => {
      const res = await fetch('/api/genres')
      return res.json()
    },
  })
  const genres = Array.isArray(genresData) ? genresData : []

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const hasMore = offset + items.length < total
  const activeFilterCount = (genre ? 1 : 0) + (status ? 1 : 0) + (type ? 1 : 0)

  // Reset offset whenever filters change — done in the handlers, not effects
  const resetOffset = () => setOffset(0)

  const clearFilters = () => {
    setGenre('')
    setStatus('')
    setType('')
    setQ('')
    resetOffset()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">คลังมังงะ</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ค้นหาและกรองมังงะทั้งหมด {total} เรื่อง
        </p>
      </div>

      {/* Search + sort bar */}
      <div className="sticky top-16 z-30 mb-5 flex flex-col gap-3 rounded-xl border border-border/60 bg-background/85 p-3 backdrop-blur-xl sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              resetOffset()
            }}
            placeholder="ค้นหาชื่อมังงะ..."
            className="h-10 rounded-lg pl-9"
          />
          {q && (
            <button
              onClick={() => {
                setQ('')
                resetOffset()
              }}
              className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-muted/70"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
              resetOffset()
            }}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <Button
            variant={showFilters ? 'default' : 'outline'}
            onClick={() => setShowFilters((v) => !v)}
            className="h-10 shrink-0 gap-1.5 rounded-lg lg:hidden"
          >
            <SlidersHorizontal size={16} />
            ตัวกรอง
            {activeFilterCount > 0 && (
              <span className="grid h-5 w-5 place-items-center rounded-full bg-primary-foreground text-xs font-bold text-primary">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Filters sidebar */}
        <aside className={cn('space-y-5 lg:block', showFilters ? 'block' : 'hidden')}>
          <div className="rounded-xl border border-border/60 bg-card/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 text-sm font-bold">
                <SlidersHorizontal size={15} /> ตัวกรอง
              </h3>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-xs font-semibold text-primary hover:underline">
                  ล้างทั้งหมด
                </button>
              )}
            </div>

            <div className="mb-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                หมวดหมู่
              </p>
              <div className="flex flex-wrap gap-1.5">
                <FilterChip active={!genre} onClick={() => { setGenre(''); resetOffset() }}>ทั้งหมด</FilterChip>
                {genres.map((g) => (
                  <FilterChip
                    key={g.id}
                    active={genre === g.slug}
                    onClick={() => { setGenre(genre === g.slug ? '' : g.slug); resetOffset() }}
                  >
                    {g.name}
                  </FilterChip>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                สถานะ
              </p>
              <div className="flex flex-wrap gap-1.5">
                <FilterChip active={!status} onClick={() => { setStatus(''); resetOffset() }}>ทั้งหมด</FilterChip>
                {STATUSES.map((s) => (
                  <FilterChip key={s} active={status === s} onClick={() => { setStatus(status === s ? '' : s); resetOffset() }}>
                    {s}
                  </FilterChip>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                ประเภท
              </p>
              <div className="flex flex-wrap gap-1.5">
                <FilterChip active={!type} onClick={() => { setType(''); resetOffset() }}>ทั้งหมด</FilterChip>
                {TYPES.map((t) => (
                  <FilterChip key={t} active={type === t} onClick={() => { setType(type === t ? '' : t); resetOffset() }}>
                    {t}
                  </FilterChip>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5">
              {Array.from({ length: 15 }).map((_, i) => (
                <MangaCardSkeleton key={i} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="grid place-items-center rounded-xl border border-dashed border-border py-20 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-bold">ไม่พบมังงะที่ค้นหา</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                ลองเปลี่ยนคำค้นหาหรือล้างตัวกรอง
              </p>
              <Button onClick={clearFilters} variant="outline" className="mt-4">
                ล้างตัวกรอง
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  แสดง {offset + 1}–{offset + items.length} จาก {total} เรื่อง
                </p>
              </div>
              <motion.div
                layout
                className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5"
              >
                {items.map((m, i) => (
                  <MangaCard key={m.id} manga={m} index={i} showLatest />
                ))}
              </motion.div>

              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setOffset((o) => o + LIMIT)}
                    disabled={isFetching}
                    className="gap-2 rounded-full"
                  >
                    {isFetching && <Loader2 size={16} className="animate-spin" />}
                    โหลดเพิ่มเติม
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border hover:border-primary/50 hover:bg-muted'
      )}
    >
      {children}
    </button>
  )
}

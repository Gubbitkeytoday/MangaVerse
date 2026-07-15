'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Info, Star, Eye, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Manga } from '@/lib/types'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { CoverImage } from '@/components/manga/cover-image'
import { StarRating } from '@/components/manga/star-rating'
import { cn, formatNumber, statusColor, typeColor } from '@/lib/utils'

interface HeroCarouselProps {
  items: Manga[]
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const [idx, setIdx] = useState(0)
  const goDetail = useAppStore((s) => s.goDetail)
  const goReader = useAppStore((s) => s.goReader)

  const next = useCallback(() => setIdx((i) => (i + 1) % items.length), [items.length])
  const prev = useCallback(() => setIdx((i) => (i - 1 + items.length) % items.length), [items.length])

  useEffect(() => {
    if (items.length <= 1) return
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next, items.length])

  if (items.length === 0) return null
  const m = items[idx]

  return (
    <div className="relative h-[460px] w-full overflow-hidden rounded-2xl border border-border/60 sm:h-[520px] md:h-[560px]">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={m.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <CoverImage
            src={m.banner}
            alt={m.title}
            title={m.title}
            className="h-full w-full"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/30 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end p-5 sm:p-8 md:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="max-w-2xl"
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={cn('rounded-md border px-2 py-0.5 text-xs font-bold uppercase', typeColor(m.type))}>
                {m.type}
              </span>
              <span className={cn('rounded-md border px-2 py-0.5 text-xs font-bold uppercase', statusColor(m.status))}>
                {m.status}
              </span>
              <span className="flex items-center gap-1 rounded-md bg-black/50 px-2 py-0.5 text-xs font-semibold text-amber-400 backdrop-blur-sm">
                <Star size={12} className="fill-amber-400" /> {m.rating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1 rounded-md bg-black/50 px-2 py-0.5 text-xs font-medium text-white/80 backdrop-blur-sm">
                <Eye size={12} /> {formatNumber(m.views)}
              </span>
              <span className="flex items-center gap-1 rounded-md bg-black/50 px-2 py-0.5 text-xs font-medium text-white/80 backdrop-blur-sm">
                <Bookmark size={12} /> {formatNumber(m.followers)}
              </span>
            </div>

            <h1 className="text-shadow-lg text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {m.title}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/70">
              <span>{m.author}</span>
              <span>•</span>
              <span>{m.year}</span>
              <span>•</span>
              <span>{m._count?.chapters ?? 0} ตอน</span>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {m.genres.slice(0, 4).map((g) => (
                <span key={g.id} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/90 backdrop-blur-sm">
                  {g.name}
                </span>
              ))}
            </div>

            <p className="mt-3 line-clamp-2 max-w-xl text-sm text-white/80 sm:text-base">
              {m.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <Button
                size="lg"
                onClick={() => goReader(m.slug, m.latestChapter?.id ?? '')}
                className="rounded-full bg-primary px-6 shadow-lg shadow-primary/30 hover:bg-primary/90"
              >
                <Play size={18} className="fill-current" /> อ่านตอนล่าสุด
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => goDetail(m.slug)}
                className="rounded-full bg-white/15 px-6 text-white backdrop-blur-sm hover:bg-white/25"
              >
                <Info size={18} /> รายละเอียด
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60 sm:left-4"
            aria-label="ก่อนหน้า"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60 sm:right-4"
            aria-label="ถัดไป"
          >
            <ChevronRight size={22} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 right-5 flex gap-1.5 sm:bottom-6 sm:right-8">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === idx ? 'w-6 bg-primary' : 'w-1.5 bg-white/40 hover:bg-white/60'
                )}
                aria-label={`สไลด์ ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

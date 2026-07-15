'use client'

import { motion } from 'framer-motion'
import { Eye, Bookmark } from 'lucide-react'
import type { Manga } from '@/lib/types'
import { useAppStore } from '@/lib/store'
import { CoverImage } from './cover-image'
import { StarRating } from './star-rating'
import { cn, formatNumber, statusColor, typeColor } from '@/lib/utils'

interface MangaCardProps {
  manga: Manga
  index?: number
  showLatest?: boolean
  compact?: boolean
}

export function MangaCard({ manga, index = 0, showLatest, compact }: MangaCardProps) {
  const goDetail = useAppStore((s) => s.goDetail)

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3) }}
      whileHover={{ y: -6 }}
      onClick={() => goDetail(manga.slug)}
      className="group relative flex flex-col text-left focus:outline-none"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-border/60 bg-muted shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/40 group-hover:ring-2 group-hover:ring-primary/20">
        <CoverImage
          src={manga.cover}
          alt={manga.title}
          title={manga.title}
          className="h-full w-full"
        />

        {/* Top badges */}
        <div className="absolute left-1.5 top-1.5 flex flex-col gap-1">
          <span
            className={cn(
              'rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm',
              typeColor(manga.type)
            )}
          >
            {manga.type}
          </span>
        </div>

        {/* Rating badge */}
        <div className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 backdrop-blur-sm">
          <StarRating rating={manga.rating} size={10} />
        </div>

        {/* Bottom gradient + info on hover */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2 pt-8">
          {showLatest && manga.latestChapter && (
            <span className="mb-1 inline-block rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
              Ch.{manga.latestChapter.number}
            </span>
          )}
          {!compact && (
            <div className="flex items-center gap-2 text-[10px] text-white/80">
              <span className="flex items-center gap-0.5">
                <Eye size={10} /> {formatNumber(manga.views)}
              </span>
              <span className="flex items-center gap-0.5">
                <Bookmark size={10} /> {formatNumber(manga.followers)}
              </span>
            </div>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-lg">
            อ่านเลย
          </span>
        </div>
      </div>

      <div className="mt-2 px-0.5">
        <h3 className="line-clamp-1 text-sm font-semibold leading-tight transition-colors group-hover:text-primary">
          {manga.title}
        </h3>
        {!compact && (
          <div className="mt-1 flex items-center gap-1.5">
            <span
              className={cn(
                'rounded border px-1 py-0.5 text-[9px] font-medium',
                statusColor(manga.status)
              )}
            >
              {manga.status}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {manga._count?.chapters ?? 0} ตอน
            </span>
          </div>
        )}
      </div>
    </motion.button>
  )
}

export function MangaCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="aspect-[3/4] w-full animate-pulse rounded-xl bg-muted" />
      <div className="mt-2 h-3.5 w-3/4 animate-pulse rounded bg-muted" />
      <div className="mt-1.5 h-2.5 w-1/2 animate-pulse rounded bg-muted" />
    </div>
  )
}

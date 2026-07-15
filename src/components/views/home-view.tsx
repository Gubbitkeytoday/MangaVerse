'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Flame,
  TrendingUp,
  Sparkles,
  Star,
  Clock,
  Crown,
  Tag,
  ChevronRight,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { HeroCarousel } from '@/components/manga/hero-carousel'
import { MangaCard, MangaCardSkeleton } from '@/components/manga/manga-card'
import { SectionHeader, MangaRail, RailCard } from '@/components/manga/section'
import { CoverImage } from '@/components/manga/cover-image'
import { formatNumber, timeAgo, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Manga, Genre } from '@/lib/types'

interface HomeData {
  hero: Manga[]
  trending: Manga[]
  popular: Manga[]
  topRated: Manga[]
  newReleases: Manga[]
  latestUpdates: { chapter: any; manga: Manga }[]
  genres: Genre[]
}

const GENRE_ICONS: Record<string, string> = {
  Action: '⚔️', Adventure: '🧭', Fantasy: '🐉', Romance: '💜', 'Sci-Fi': '🚀',
  Horror: '💀', Mystery: '🔍', Comedy: '😂', Drama: '🎭', 'Slice of Life': '☕',
  Supernatural: '👻', Mecha: '🤖', Historical: '🏯', Psychological: '🧠',
  School: '🏫', Cyberpunk: '🌃',
}

const GENRE_COLORS = [
  'from-rose-500/20 to-rose-500/5 text-rose-400 hover:from-rose-500/30',
  'from-violet-500/20 to-violet-500/5 text-violet-400 hover:from-violet-500/30',
  'from-amber-500/20 to-amber-500/5 text-amber-400 hover:from-amber-500/30',
  'from-emerald-500/20 to-emerald-500/5 text-emerald-400 hover:from-emerald-500/30',
  'from-sky-500/20 to-sky-500/5 text-sky-400 hover:from-sky-500/30',
  'from-fuchsia-500/20 to-fuchsia-500/5 text-fuchsia-400 hover:from-fuchsia-500/30',
  'from-teal-500/20 to-teal-500/5 text-teal-400 hover:from-teal-500/30',
  'from-orange-500/20 to-orange-500/5 text-orange-400 hover:from-orange-500/30',
]

export function HomeView() {
  const goBrowse = useAppStore((s) => s.goBrowse)
  const goDetail = useAppStore((s) => s.goDetail)
  const goReader = useAppStore((s) => s.goReader)

  const { data, isLoading } = useQuery<HomeData>({
    queryKey: ['home'],
    queryFn: async () => {
      const res = await fetch('/api/home')
      return res.json()
    },
  })

  if (isLoading || !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="h-[460px] w-full animate-pulse rounded-2xl bg-muted sm:h-[560px]" />
        <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <MangaCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Hero */}
      <HeroCarousel items={data.hero} />

      {/* Quick stats banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {[
          { label: 'มังงะทั้งหมด', value: '12+', icon: '📚' },
          { label: 'ตอนทั้งหมด', value: '470+', icon: '📖' },
          { label: 'ยอดเข้าชม', value: '40M+', icon: '👁️' },
          { label: 'ผู้ติดตาม', value: '1.6M+', icon: '❤️' },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-3 backdrop-blur-sm"
          >
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-lg font-black leading-none">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Latest Updates — chapter feed */}
      <section className="mt-10">
        <SectionHeader
          title="อัปเดตล่าสุด"
          subtitle="ตอนใหม่ล่าสุดที่เพิ่งอัปเดต"
          icon={<Clock className="h-5 w-5" />}
          onSeeAll={() => goBrowse({ sort: 'updated' as any })}
        />
        <div className="grid gap-2 sm:grid-cols-2">
          {data.latestUpdates.slice(0, 8).map(({ chapter, manga }, i) => (
            <motion.button
              key={chapter.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => goReader(manga.slug, chapter.id)}
              className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card/40 p-2.5 text-left transition-all hover:border-primary/40 hover:bg-card/80 hover:shadow-md"
            >
              <CoverImage
                src={manga.cover}
                alt={manga.title}
                title={manga.title}
                className="h-16 w-12 shrink-0 rounded-lg"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold group-hover:text-primary">
                  {manga.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  ตอนที่ {chapter.number} • {chapter.title}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Clock size={10} /> {timeAgo(chapter.publishedAt)}
                  </span>
                  <span>•</span>
                  <span>{formatNumber(chapter.views)} อ่าน</span>
                </div>
              </div>
              <div className="hidden shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:block">
                อ่าน
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="mt-10">
        <SectionHeader
          title="กำลังมาแรง"
          subtitle="มังงะยอดนิยมตอนนี้"
          icon={<Flame className="h-5 w-5" />}
          onSeeAll={() => goBrowse({ sort: 'views' as any })}
        />
        <MangaRail>
          {data.trending.map((m, i) => (
            <RailCard key={m.id}>
              <div className="relative">
                <span className="absolute -left-1 -top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-orange-500 text-xs font-black text-white shadow-lg">
                  {i + 1}
                </span>
                <MangaCard manga={m} index={i} showLatest compact />
              </div>
            </RailCard>
          ))}
        </MangaRail>
      </section>

      {/* Popular grid */}
      <section className="mt-10">
        <SectionHeader
          title="ยอดนิยมตลอดกาล"
          subtitle="มังงะที่ผู้คนติดตามมากที่สุด"
          icon={<Crown className="h-5 w-5" />}
          onSeeAll={() => goBrowse({ sort: 'followers' as any })}
        />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-6">
          {data.popular.slice(0, 12).map((m, i) => (
            <MangaCard key={m.id} manga={m} index={i} showLatest />
          ))}
        </div>
      </section>

      {/* Genres */}
      <section className="mt-10">
        <SectionHeader
          title="หมวดหมู่"
          subtitle="เลือกอ่านตามแนวที่ชอบ"
          icon={<Tag className="h-5 w-5" />}
        />
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {data.genres.map((g, i) => (
            <button
              key={g.id}
              onClick={() => goBrowse({ genre: g.slug })}
              className={cn(
                'group flex items-center gap-2 rounded-xl border border-border/50 bg-gradient-to-br p-3 text-left transition-all hover:scale-[1.03] hover:shadow-lg',
                GENRE_COLORS[i % GENRE_COLORS.length]
              )}
            >
              <span className="text-lg">{GENRE_ICONS[g.name] ?? '📚'}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{g.name}</p>
                <p className="text-[10px] opacity-70">{g._count?.mangas ?? 0} เรื่อง</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Top rated + new releases two columns */}
      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <SectionHeader
            title="คะแนนสูงสุด"
            icon={<Star className="h-5 w-5" />}
            onSeeAll={() => goBrowse({ sort: 'rating' as any })}
          />
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {data.topRated.slice(0, 4).map((m, i) => (
              <MangaCard key={m.id} manga={m} index={i} />
            ))}
          </div>
        </div>
        <div>
          <SectionHeader
            title="มาใหม่"
            icon={<Sparkles className="h-5 w-5" />}
            onSeeAll={() => goBrowse({ sort: 'latest' as any })}
          />
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {data.newReleases.slice(0, 4).map((m, i) => (
              <MangaCard key={m.id} manga={m} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-rose-500/10 to-transparent p-6 sm:p-8"
      >
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-2xl font-black">ยังไม่เจอเรื่องที่ใช่?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              สำรวจคลังมังงะทั้งหมดกว่า 12 เรื่อง 470+ ตอน พร้อมตัวกรองและการค้นหาที่ทรงพลัง
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => goBrowse()}
            className="shrink-0 rounded-full bg-primary px-6 shadow-lg shadow-primary/30"
          >
            สำรวจทั้งหมด <ChevronRight size={18} />
          </Button>
        </div>
      </motion.section>
    </div>
  )
}

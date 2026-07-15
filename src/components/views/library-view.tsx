'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  Clock,
  Trash2,
  Play,
  BookmarkX,
  History,
  BookOpen,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { CoverImage } from '@/components/manga/cover-image'
import { MangaCard } from '@/components/manga/manga-card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { cn, formatNumber, timeAgo, statusColor } from '@/lib/utils'
import type { Manga, FavoriteItem, HistoryItem } from '@/lib/types'

export function LibraryView() {
  const goReader = useAppStore((s) => s.goReader)
  const goDetail = useAppStore((s) => s.goDetail)
  const goBrowse = useAppStore((s) => s.goBrowse)
  const qc = useQueryClient()

  const { data: favorites = [], isLoading: favLoading } = useQuery<FavoriteItem[]>({
    queryKey: ['favorites'],
    queryFn: async () => {
      const res = await fetch('/api/favorites?userId=guest')
      return res.json()
    },
  })

  const { data: history = [], isLoading: histLoading } = useQuery<HistoryItem[]>({
    queryKey: ['history'],
    queryFn: async () => {
      const res = await fetch('/api/history?userId=guest')
      return res.json()
    },
  })

  const clearHistMut = useMutation({
    mutationFn: () => fetch('/api/history?userId=guest', { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('ล้างประวัติการอ่านแล้ว')
      qc.invalidateQueries({ queryKey: ['history'] })
    },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight sm:text-3xl">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-rose-600 text-primary-foreground shadow-lg shadow-primary/30">
            <BookOpen size={20} />
          </span>
          คลังของฉัน
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          มังงะที่คุณถูกใจและประวัติการอ่านของคุณ
        </p>
      </div>

      <Tabs defaultValue="history">
        <TabsList className="mb-6 grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="history" className="gap-1.5">
            <History size={15} /> ประวัติการอ่าน
            {history.length > 0 && (
              <span className="ml-1 rounded-full bg-primary/15 px-1.5 text-xs font-bold text-primary">
                {history.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="favorites" className="gap-1.5">
            <Heart size={15} /> รายการโปรด
            {favorites.length > 0 && (
              <span className="ml-1 rounded-full bg-primary/15 px-1.5 text-xs font-bold text-primary">
                {favorites.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* History */}
        <TabsContent value="history" className="mt-0">
          {histLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <EmptyState
              icon={<History size={32} />}
              title="ยังไม่มีประวัติการอ่าน"
              desc="เริ่มอ่านมังงะเพื่อบันทึกความคืบหน้าของคุณ"
              actionLabel="สำรวจมังงะ"
              onAction={goBrowse}
            />
          ) : (
            <>
              <div className="mb-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => clearHistMut.mutate()}
                  disabled={clearHistMut.isPending}
                  className="gap-1.5 rounded-full text-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={14} /> ล้างประวัติ
                </Button>
              </div>
              <div className="space-y-2.5">
                <AnimatePresence>
                  {history.map((h, i) => (
                    <motion.button
                      key={h.id}
                      layout
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => goReader(h.manga.slug, h.chapterId)}
                      className="group flex w-full items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3 text-left transition-all hover:border-primary/40 hover:bg-card/80 hover:shadow-md"
                    >
                      <CoverImage
                        src={h.manga.cover}
                        alt={h.manga.title}
                        title={h.manga.title}
                        className="h-16 w-12 shrink-0 rounded-lg"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold group-hover:text-primary">
                          {h.manga.title}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          ตอนที่ {h.chapter.number} • {h.chapter.title}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary to-rose-500"
                              style={{ width: `${Math.round(h.progress * 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-medium text-muted-foreground">
                            {Math.round(h.progress * 100)}% • {timeAgo(h.updatedAt)}
                          </span>
                        </div>
                      </div>
                      <div className="hidden shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:flex">
                        <Play size={12} className="fill-current" /> อ่านต่อ
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </TabsContent>

        {/* Favorites */}
        <TabsContent value="favorites" className="mt-0">
          {favLoading ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <EmptyState
              icon={<Heart size={32} />}
              title="ยังไม่มีรายการโปรด"
              desc="กดหัวใจที่หน้ารายละเอียดมังงะเพื่อบันทึกไว้อ่านทีหลัง"
              actionLabel="ค้นหามังงะ"
              onAction={goBrowse}
            />
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-6">
              {favorites.map((f, i) => (
                <MangaCard key={f.id} manga={f.manga} index={i} showLatest />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyState({
  icon,
  title,
  desc,
  actionLabel,
  onAction,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  actionLabel: string
  onAction: () => void
}) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border py-20 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{desc}</p>
      <Button onClick={onAction} className="mt-5 gap-1.5 rounded-full bg-primary">
        {actionLabel} <ChevronRight size={16} />
      </Button>
    </div>
  )
}

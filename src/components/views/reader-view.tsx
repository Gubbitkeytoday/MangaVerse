'use client'

import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  List,
  Settings,
  Home,
  Loader2,
  PanelTop,
  BookOpen,
  Check,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { MangaPage } from '@/components/manga/manga-page'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { toast } from 'sonner'
import { cn, timeAgo, formatNumber } from '@/lib/utils'
import type { Chapter } from '@/lib/types'

interface ChapterDetail extends Chapter {
  manga: { id: string; title: string; slug: string; cover: string }
  prev: { id: string; number: number; title: string } | null
  next: { id: string; number: number; title: string } | null
  totalChapters: number
  chapterIndex: number
}

export function ReaderView({ slug, chapterId }: { slug: string; chapterId: string }) {
  const goDetail = useAppStore((s) => s.goDetail)
  const goHome = useAppStore((s) => s.goHome)
  const goReader = useAppStore((s) => s.goReader)
  const readerMode = useAppStore((s) => s.readerMode)
  const readerFit = useAppStore((s) => s.readerFit)
  const setReaderMode = useAppStore((s) => s.setReaderMode)
  const setReaderFit = useAppStore((s) => s.setReaderFit)

  const [showControls, setShowControls] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [pagedIndex, setPagedIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const recordedRef = useRef<string | null>(null)

  const { data: chapter, isLoading } = useQuery<ChapterDetail>({
    queryKey: ['chapter', chapterId],
    queryFn: async () => {
      const res = await fetch(`/api/chapters/${chapterId}`)
      return res.json()
    },
  })

  const { data: allChapters = [] } = useQuery<Chapter[]>({
    queryKey: ['manga-chapters', slug],
    queryFn: async () => {
      const res = await fetch(`/api/manga/${slug}/chapters`)
      return res.json()
    },
  })

  const viewMut = useMutation({
    mutationFn: (progress: number) =>
      fetch(`/api/chapters/${chapterId}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'guest', progress }),
      }),
  })

  // Record a view once per chapter load (no setState here — keeps lint happy)
  useEffect(() => {
    if (chapter && recordedRef.current !== chapter.id) {
      recordedRef.current = chapter.id
      viewMut.mutate(0)
    }
  }, [chapter])

  // Track reading progress in vertical mode
  useEffect(() => {
    if (readerMode !== 'vertical' || !scrollRef.current) return
    const el = scrollRef.current
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight
      const progress = max > 0 ? Math.min(1, el.scrollTop / max) : 0
      if (Math.abs(progress - 1) < 0.05) viewMut.mutate(1)
      else if (progress > 0.5) viewMut.mutate(progress)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [readerMode, chapterId])

  // Auto-hide controls
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const reset = () => {
      setShowControls(true)
      clearTimeout(timer)
      timer = setTimeout(() => setShowControls(false), 3000)
    }
    reset()
    window.addEventListener('mousemove', reset)
    window.addEventListener('scroll', reset, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('mousemove', reset)
      window.removeEventListener('scroll', reset)
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        if (readerMode === 'paged' && pagedIndex > 0) setPagedIndex((i) => i - 1)
        else if (chapter?.prev) goReader(slug, chapter.prev.id)
      } else if (e.key === 'ArrowRight') {
        if (readerMode === 'paged' && chapter && pagedIndex < chapter.pages.length - 1)
          setPagedIndex((i) => i + 1)
        else if (chapter?.next) goReader(slug, chapter.next.id)
      } else if (e.key === 'Escape') {
        goDetail(slug)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [readerMode, pagedIndex, chapter, slug, goReader, goDetail])

  if (isLoading || !chapter) {
    return (
      <div className="grid h-[70vh] place-items-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">กำลังโหลดตอน...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-40 bg-background">
      {/* Top bar */}
      <AnimatePresence>
        {showControls && (
          <motion.header
            initial={{ y: -64 }}
            animate={{ y: 0 }}
            exit={{ y: -64 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl"
          >
            <div className="mx-auto flex h-14 max-w-5xl items-center gap-2 px-3">
              <Button variant="ghost" size="icon" onClick={() => goDetail(slug)} className="rounded-full">
                <ArrowLeft size={18} />
              </Button>
              <Button variant="ghost" size="icon" onClick={goHome} className="rounded-full">
                <Home size={18} />
              </Button>

              <div className="min-w-0 flex-1 px-2">
                <p className="truncate text-sm font-bold">{chapter.manga.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  ตอนที่ {chapter.number} — {chapter.title}
                </p>
              </div>

              {/* Chapter selector */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <List size={18} />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-sm">
                  <SheetHeader>
                    <SheetTitle>รายการตอน ({allChapters.length})</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-thin pr-2">
                    {allChapters.slice().reverse().map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          goReader(slug, c.id)
                        }}
                        className={cn(
                          'mb-1 flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors',
                          c.id === chapterId
                            ? 'border-primary bg-primary/10'
                            : 'border-transparent hover:bg-muted'
                        )}
                      >
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-black text-primary">
                          {c.number}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{c.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {timeAgo(c.publishedAt)} • {formatNumber(c.views)} อ่าน
                          </p>
                        </div>
                        {c.id === chapterId && <Check size={16} className="text-primary" />}
                      </button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSettingsOpen((v) => !v)}
                className="rounded-full"
              >
                <Settings size={18} />
              </Button>
            </div>

            {/* Settings panel */}
            <AnimatePresence>
              {settingsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-border/60"
                >
                  <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase text-muted-foreground">โหมด</span>
                      <div className="flex rounded-lg border border-border p-0.5">
                        <button
                          onClick={() => setReaderMode('vertical')}
                          className={cn(
                            'flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                            readerMode === 'vertical' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                          )}
                        >
                          <PanelTop size={13} /> เลื่อน
                        </button>
                        <button
                          onClick={() => setReaderMode('paged')}
                          className={cn(
                            'flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                            readerMode === 'paged' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                          )}
                        >
                          <BookOpen size={13} /> ทีละหน้า
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase text-muted-foreground">ขนาด</span>
                      <Select value={readerFit} onValueChange={(v) => setReaderFit(v as any)}>
                        <SelectTrigger className="h-8 w-28 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="width">เต็มความกว้าง</SelectItem>
                          <SelectItem value="original">ขนาดเดิม</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Reader content */}
      {readerMode === 'vertical' ? (
        <div
          ref={scrollRef}
          className="h-screen overflow-y-auto scrollbar-thin pt-14"
        >
          <div className="mx-auto max-w-3xl space-y-1 px-2 py-4">
            {chapter.pages.map((pageKey, i) => (
              <MangaPage
                key={i}
                pageKey={pageKey}
                index={i}
                total={chapter.pages.length}
                mangaTitle={chapter.manga.title}
                chapterNumber={chapter.number}
                fit={readerFit}
              />
            ))}

            {/* End of chapter */}
            <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-border/60 bg-card/50 p-6 text-center">
              <p className="text-sm text-muted-foreground">จบตอนที่ {chapter.number}</p>
              <div className="mt-3 flex justify-center gap-2.5">
                {chapter.prev && (
                  <Button variant="outline" onClick={() => goReader(slug, chapter.prev!.id)} className="gap-1.5 rounded-full">
                    <ChevronLeft size={16} /> ตอนก่อนหน้า
                  </Button>
                )}
                {chapter.next ? (
                  <Button onClick={() => goReader(slug, chapter.next!.id)} className="gap-1.5 rounded-full bg-primary">
                    ตอนถัดไป <ChevronRight size={16} />
                  </Button>
                ) : (
                  <p className="grid place-items-center px-4 text-sm text-muted-foreground">
                    เป็นตอนล่าสุดแล้ว
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-screen flex-col items-center justify-center pt-14">
          <div className="flex-1 grid place-items-center px-2">
            <MangaPage
              pageKey={chapter.pages[pagedIndex]}
              index={pagedIndex}
              total={chapter.pages.length}
              mangaTitle={chapter.manga.title}
              chapterNumber={chapter.number}
              fit={readerFit}
            />
          </div>

          {/* Page nav */}
          <div className="flex w-full items-center justify-between gap-3 border-t border-border/60 bg-background/90 p-3 backdrop-blur-xl">
            <Button
              variant="ghost"
              disabled={pagedIndex === 0 && !chapter.prev}
              onClick={() => {
                if (pagedIndex > 0) setPagedIndex((i) => i - 1)
                else if (chapter.prev) goReader(slug, chapter.prev.id)
              }}
              className="gap-1.5 rounded-full"
            >
              <ChevronLeft size={18} /> ก่อนหน้า
            </Button>

            <div className="flex items-center gap-1.5">
              {chapter.pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPagedIndex(i)}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    i === pagedIndex ? 'w-5 bg-primary' : 'w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/60'
                  )}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              disabled={pagedIndex === chapter.pages.length - 1 && !chapter.next}
              onClick={() => {
                if (pagedIndex < chapter.pages.length - 1) setPagedIndex((i) => i + 1)
                else if (chapter.next) goReader(slug, chapter.next.id)
              }}
              className="gap-1.5 rounded-full"
            >
              ถัดไป <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      )}

      {/* Floating prev/next (vertical) */}
      {readerMode === 'vertical' && (chapter.prev || chapter.next) && (
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border/60 bg-background/90 px-2 py-1.5 shadow-2xl backdrop-blur-xl"
            >
              {chapter.prev && (
                <Button variant="ghost" size="sm" onClick={() => goReader(slug, chapter.prev!.id)} className="gap-1 rounded-full">
                  <ChevronLeft size={16} /> ก่อนหน้า
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => goDetail(slug)} className="rounded-full">
                <List size={16} />
              </Button>
              {chapter.next && (
                <Button variant="ghost" size="sm" onClick={() => goReader(slug, chapter.next!.id)} className="gap-1 rounded-full">
                  ถัดไป <ChevronRight size={16} />
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

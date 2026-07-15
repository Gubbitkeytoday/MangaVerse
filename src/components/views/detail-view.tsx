'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Heart,
  Share2,
  Eye,
  Bookmark,
  Calendar,
  User,
  PenTool,
  Play,
  ChevronDown,
  MessageCircle,
  Star,
  Send,
  ThumbsUp,
  Trash2,
  ArrowLeft,
  BookOpen,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { CoverImage } from '@/components/manga/cover-image'
import { StarRating } from '@/components/manga/star-rating'
import { MangaCard } from '@/components/manga/manga-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { cn, formatNumber, statusColor, timeAgo, typeColor } from '@/lib/utils'
import type { Manga, Chapter, Comment, Review } from '@/lib/types'

export function DetailView({ slug }: { slug: string }) {
  const goBack = useAppStore((s) => s.goHome)
  const goBrowse = useAppStore((s) => s.goBrowse)
  const goReader = useAppStore((s) => s.goReader)
  const [expanded, setExpanded] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [commentAuthor, setCommentAuthor] = useState('')
  const [reviewAuthor, setReviewAuthor] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [chapterSearch, setChapterSearch] = useState('')

  const qc = useQueryClient()

  const { data: manga, isLoading } = useQuery<Manga>({
    queryKey: ['manga', slug],
    queryFn: async () => {
      const res = await fetch(`/api/manga/${slug}`)
      if (!res.ok) throw new Error('not found')
      return res.json()
    },
  })

  const { data: chapters = [] } = useQuery<Chapter[]>({
    queryKey: ['manga-chapters', slug],
    queryFn: async () => {
      const res = await fetch(`/api/manga/${slug}/chapters`)
      return res.json()
    },
    enabled: !!manga,
  })

  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ['manga-comments', slug],
    queryFn: async () => {
      const res = await fetch(`/api/manga/${slug}/comments`)
      return res.json()
    },
    enabled: !!manga,
  })

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ['manga-reviews', slug],
    queryFn: async () => {
      const res = await fetch(`/api/manga/${slug}/reviews`)
      return res.json()
    },
    enabled: !!manga,
  })

  const { data: related = [] } = useQuery<Manga[]>({
    queryKey: ['manga-related', slug],
    queryFn: async () => {
      const res = await fetch(`/api/manga/${slug}/related`)
      return res.json()
    },
    enabled: !!manga,
  })

  const { data: favStatus } = useQuery<{ favorited: boolean }>({
    queryKey: ['fav-status', slug],
    queryFn: async () => {
      const res = await fetch(`/api/manga/${slug}/favorite?userId=guest`)
      return res.json()
    },
    enabled: !!manga,
  })

  // Record view once on mount
  useEffect(() => {
    fetch(`/api/manga/${slug}/record-view`, { method: 'POST' }).catch(() => {})
  }, [slug])

  const favMut = useMutation({
    mutationFn: () =>
      fetch(`/api/manga/${slug}/favorite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'guest' }),
      }),
    onSuccess: (data: any) => {
      toast.success(data.favorited ? 'เพิ่มในคลังของฉันแล้ว ❤️' : 'นำออกจากคลังของฉันแล้ว')
      qc.invalidateQueries({ queryKey: ['fav-status', slug] })
      qc.invalidateQueries({ queryKey: ['manga', slug] })
      qc.invalidateQueries({ queryKey: ['favorites'] })
    },
  })

  const commentMut = useMutation({
    mutationFn: (content: string) =>
      fetch(`/api/manga/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: commentAuthor || 'ผู้อ่านไม่ระบุตัวตน',
          content,
        }),
      }),
    onSuccess: () => {
      toast.success('แสดงความคิดเห็นแล้ว')
      setCommentText('')
      qc.invalidateQueries({ queryKey: ['manga-comments', slug] })
    },
  })

  const reviewMut = useMutation({
    mutationFn: () =>
      fetch(`/api/manga/${slug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: reviewAuthor || 'ผู้วิจารณ์',
          rating: reviewRating,
          content: reviewText,
        }),
      }),
    onSuccess: () => {
      toast.success('ส่งรีวิวแล้ว ขอบคุณครับ')
      setReviewText('')
      setReviewRating(5)
      qc.invalidateQueries({ queryKey: ['manga-reviews', slug] })
      qc.invalidateQueries({ queryKey: ['manga', slug] })
    },
  })

  const likeMut = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like' }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['manga-comments', slug] }),
  })

  if (isLoading || !manga) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="h-56 w-full animate-pulse rounded-2xl bg-muted sm:h-72" />
        <div className="mt-6 flex gap-6">
          <div className="h-56 w-40 animate-pulse rounded-xl bg-muted" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-20 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  const filteredChapters = chapterSearch
    ? chapters.filter((c) => String(c.number).includes(chapterSearch) || c.title.toLowerCase().includes(chapterSearch.toLowerCase()))
    : chapters

  return (
    <div>
      {/* Banner */}
      <div className="relative h-56 w-full overflow-hidden sm:h-72 md:h-80">
        <CoverImage src={manga.banner} alt={manga.title} title={manga.title} className="h-full w-full" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        <button
          onClick={goBack}
          className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <ArrowLeft size={16} /> กลับ
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Title section */}
        <div className="relative -mt-24 flex flex-col gap-5 sm:-mt-28 sm:flex-row sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto w-40 shrink-0 sm:mx-0 sm:w-48"
          >
            <CoverImage
              src={manga.cover}
              alt={manga.title}
              title={manga.title}
              className="aspect-[3/4] w-full rounded-xl border-4 border-background shadow-2xl"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 pt-2 sm:pt-20"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className={cn('rounded-md border px-2 py-0.5 text-xs font-bold uppercase', typeColor(manga.type))}>
                {manga.type}
              </span>
              <span className={cn('rounded-md border px-2 py-0.5 text-xs font-bold uppercase', statusColor(manga.status))}>
                {manga.status}
              </span>
              {manga.year && (
                <span className="flex items-center gap-1 rounded-md border border-border/60 px-2 py-0.5 text-xs font-medium">
                  <Calendar size={11} /> {manga.year}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-4xl">
              {manga.title}
            </h1>
            {manga.altTitles.length > 0 && (
              <p className="mt-1 text-sm text-muted-foreground">
                {manga.altTitles.join(' · ')}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
              <span className="flex items-center gap-1.5">
                <User size={14} className="text-muted-foreground" /> {manga.author}
              </span>
              {manga.artist && manga.artist !== manga.author && (
                <span className="flex items-center gap-1.5">
                  <PenTool size={14} className="text-muted-foreground" /> {manga.artist}
                </span>
              )}
            </div>

            {/* Rating + stats */}
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <StarRating rating={manga.rating} size={18} showValue />
                <span className="text-xs text-muted-foreground">
                  ({formatNumber(manga.ratingCount)} คะแนน)
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye size={14} /> {formatNumber(manga.views)}
                </span>
                <span className="flex items-center gap-1">
                  <Bookmark size={14} /> {formatNumber(manga.followers)}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen size={14} /> {manga._count?.chapters ?? 0} ตอน
                </span>
              </div>
            </div>

            {/* Genres */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {manga.genres.map((g) => (
                <button
                  key={g.id}
                  onClick={() => goBrowse({ genre: g.slug })}
                  className="rounded-full border border-border/60 bg-card/50 px-2.5 py-1 text-xs font-medium transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                >
                  {g.name}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex flex-wrap gap-2.5">
              <Button
                size="lg"
                onClick={() => goReader(manga.slug, chapters[0]?.id ?? '')}
                className="gap-2 rounded-full bg-primary px-6 shadow-lg shadow-primary/30"
              >
                <Play size={18} className="fill-current" /> เริ่มอ่าน
              </Button>
              <Button
                size="lg"
                variant={favStatus?.favorited ? 'default' : 'outline'}
                onClick={() => favMut.mutate()}
                className="gap-2 rounded-full"
              >
                <Heart size={18} className={favStatus?.favorited ? 'fill-current' : ''} />
                {favStatus?.favorited ? 'อยู่ในคลังแล้ว' : 'เพิ่มในคลัง'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href)
                  toast.success('คัดลอกลิงก์แล้ว')
                }}
                className="gap-2 rounded-full"
              >
                <Share2 size={18} /> แชร์
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Synopsis */}
        <section className="mt-8">
          <h2 className="mb-2 text-lg font-bold">เรื่องย่อ</h2>
          <motion.p
            layout
            className={cn(
              'text-sm leading-relaxed text-muted-foreground sm:text-base',
              !expanded && 'line-clamp-4'
            )}
          >
            {manga.description}
          </motion.p>
          {manga.description.length > 200 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              {expanded ? 'ย่อ' : 'อ่านเพิ่ม'}
              <ChevronDown size={14} className={cn('transition-transform', expanded && 'rotate-180')} />
            </button>
          )}
        </section>

        {/* Chapters */}
        <section className="mt-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold">
              รายการตอน <span className="text-muted-foreground">({chapters.length})</span>
            </h2>
            <Input
              value={chapterSearch}
              onChange={(e) => setChapterSearch(e.target.value)}
              placeholder="ค้นหาตอน..."
              className="h-9 w-40 rounded-full text-sm sm:w-52"
            />
          </div>
          <div className="max-h-[480px] overflow-y-auto scrollbar-thin rounded-xl border border-border/60">
            {filteredChapters.slice().reverse().map((c, i) => (
              <motion.button
                key={c.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(i * 0.01, 0.3) }}
                onClick={() => goReader(manga.slug, c.id)}
                className="group flex w-full items-center gap-3 border-b border-border/40 px-4 py-3 text-left transition-colors last:border-0 hover:bg-muted/50"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-sm font-black text-primary">
                  {c.number}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold group-hover:text-primary">
                    {c.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {timeAgo(c.publishedAt)} • {formatNumber(c.views)} อ่าน
                  </p>
                </div>
                <Play size={16} className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
              </motion.button>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Star size={18} className="text-amber-400" /> รีวิวจากผู้อ่าน
          </h2>

          {/* Write review */}
          <div className="mb-4 rounded-xl border border-border/60 bg-card/40 p-4">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <Input
                value={reviewAuthor}
                onChange={(e) => setReviewAuthor(e.target.value)}
                placeholder="ชื่อของคุณ"
                className="h-9 w-40 rounded-lg text-sm"
              />
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setReviewRating(n)}
                    className="transition-transform hover:scale-125"
                  >
                    <Star
                      size={22}
                      className={cn(
                        n <= reviewRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-muted-foreground/40'
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="แบ่งปันความคิดเห็นของคุณเกี่ยวกับเรื่องนี้..."
              className="mb-2 min-h-[80px] text-sm"
            />
            <Button
              size="sm"
              onClick={() => {
                if (!reviewText.trim()) return toast.error('กรุณาเขียนรีวิว')
                reviewMut.mutate()
              }}
              disabled={reviewMut.isPending}
              className="gap-1.5"
            >
              <Send size={14} /> ส่งรีวิว
            </Button>
          </div>

          <div className="space-y-3">
            {reviews.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                ยังไม่มีรีวิว เป็นคนแรกที่รีวิวเรื่องนี้!
              </p>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="rounded-xl border border-border/60 bg-card/40 p-4">
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                        {r.author[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{r.author}</p>
                        <p className="text-[11px] text-muted-foreground">{timeAgo(r.createdAt)}</p>
                      </div>
                    </div>
                    <StarRating rating={r.rating} size={13} />
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{r.content}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Comments */}
        <section className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <MessageCircle size={18} /> ความคิดเห็น ({comments.length})
          </h2>

          <div className="mb-4 rounded-xl border border-border/60 bg-card/40 p-4">
            <Input
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              placeholder="ชื่อของคุณ (ไม่บังคับ)"
              className="mb-2 h-9 rounded-lg text-sm"
            />
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="แสดงความคิดเห็น..."
              className="mb-2 min-h-[70px] text-sm"
            />
            <Button
              size="sm"
              onClick={() => {
                if (!commentText.trim()) return toast.error('กรุณาพิมพ์ความคิดเห็น')
                commentMut.mutate(commentText)
              }}
              disabled={commentMut.isPending}
              className="gap-1.5"
            >
              <Send size={14} /> ส่งความคิดเห็น
            </Button>
          </div>

          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                ยังไม่มีความคิดเห็น เริ่มสนทนากันเถอะ!
              </p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="rounded-xl border border-border/60 bg-card/40 p-4">
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-rose-500 text-xs font-bold text-primary-foreground">
                        {c.author[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{c.author}</p>
                        <p className="text-[11px] text-muted-foreground">{timeAgo(c.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">{c.content}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      onClick={() => likeMut.mutate(c.id)}
                      className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      <ThumbsUp size={13} /> {c.likes}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-bold">เรื่องที่เกี่ยวข้อง</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-6">
              {related.map((m, i) => (
                <MangaCard key={m.id} manga={m} index={i} />
              ))}
            </div>
          </section>
        )}

        <div className="h-10" />
      </div>
    </div>
  )
}

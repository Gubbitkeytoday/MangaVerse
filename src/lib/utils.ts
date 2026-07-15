import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}

export function timeAgo(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return 'just now'
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 7) return `${day}d ago`
  const wk = Math.floor(day / 7)
  if (wk < 4) return `${wk}w ago`
  const mo = Math.floor(day / 30)
  if (mo < 12) return `${mo}mo ago`
  return `${Math.floor(day / 365)}y ago`
}

export function statusColor(status: string): string {
  switch (status) {
    case 'ONGOING':
      return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
    case 'COMPLETED':
      return 'bg-sky-500/15 text-sky-500 border-sky-500/30'
    case 'HIATUS':
      return 'bg-amber-500/15 text-amber-500 border-amber-500/30'
    case 'CANCELLED':
      return 'bg-rose-500/15 text-rose-500 border-rose-500/30'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

export function typeColor(type: string): string {
  switch (type) {
    case 'MANHWA':
      return 'bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30'
    case 'MANHUA':
      return 'bg-orange-500/15 text-orange-400 border-orange-500/30'
    case 'WEBTOON':
      return 'bg-teal-500/15 text-teal-400 border-teal-500/30'
    default:
      return 'bg-violet-500/15 text-violet-400 border-violet-500/30'
  }
}

// Deterministic gradient for a manga page panel (used as placeholder art)
const PALETTES: [string, string, string][] = [
  ['#7c3aed', '#ec4899', '#f59e0b'],
  ['#0ea5e9', '#6366f1', '#a855f7'],
  ['#ef4444', '#f59e0b', '#fbbf24'],
  ['#10b981', '#06b6d4', '#3b82f6'],
  ['#f43f5e', '#8b5cf6', '#6366f1'],
  ['#14b8a6', '#22c55e', '#84cc16'],
  ['#f97316', '#ef4444', '#ec4899'],
  ['#6366f1', '#a855f7', '#ec4899'],
  ['#0891b2', '#0d9488', '#16a34a'],
  ['#db2777', '#9333ea', '#4f46e5'],
]

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function pageGradient(pageKey: string): {
  from: string
  via: string
  to: string
  angle: number
} {
  const h = hashStr(pageKey)
  const p = PALETTES[h % PALETTES.length]
  return {
    from: p[0],
    via: p[1],
    to: p[2],
    angle: (h % 8) * 45,
  }
}

export function coverGradient(title: string): string {
  const p = PALETTES[hashStr(title) % PALETTES.length]
  return `linear-gradient(135deg, ${p[0]}, ${p[1]}, ${p[2]})`
}

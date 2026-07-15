'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  onSeeAll?: () => void
  className?: string
}

export function SectionHeader({ title, subtitle, icon, onSeeAll, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-4 flex items-end justify-between gap-4', className)}>
      <div className="flex items-center gap-2.5">
        {icon && (
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-xl font-black tracking-tight sm:text-2xl">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground sm:text-sm">{subtitle}</p>}
        </div>
      </div>
      {onSeeAll && (
        <button
          onClick={onSeeAll}
          className="group flex shrink-0 items-center gap-0.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          ดูทั้งหมด
          <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      )}
    </div>
  )
}

interface MangaRailProps {
  children: ReactNode
  className?: string
}

export function MangaRail({ children, className }: MangaRailProps) {
  return (
    <div
      className={cn(
        'no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6',
        className
      )}
    >
      {children}
    </div>
  )
}

export function RailCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      className={cn('w-40 shrink-0 sm:w-44', className)}
    >
      {children}
    </motion.div>
  )
}

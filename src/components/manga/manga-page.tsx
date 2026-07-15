'use client'

import { pageGradient } from '@/lib/utils'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'

interface MangaPageProps {
  pageKey: string
  index: number
  total: number
  mangaTitle: string
  chapterNumber: number
  fit: 'width' | 'height' | 'original'
}

/**
 * Renders a stylized manga page from a deterministic gradient + panel layout.
 * In a production system these would be real uploaded page images.
 */
export function MangaPage({ pageKey, index, total, mangaTitle, chapterNumber, fit }: MangaPageProps) {
  const grad = pageGradient(pageKey)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative mx-auto w-full"
      style={{
        maxWidth: fit === 'original' ? 800 : undefined,
      }}
    >
      <div
        className="relative w-full overflow-hidden rounded-sm shadow-2xl"
        style={{
          aspectRatio: '2 / 3',
          background: `linear-gradient(${grad.angle}deg, ${grad.from}, ${grad.via} 50%, ${grad.to})`,
        }}
      >
        {/* Panel layout — deterministic based on index */}
        <PanelLayout index={index} />

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Page number */}
        <div className="absolute bottom-3 right-4 rounded bg-black/40 px-2 py-0.5 text-xs font-medium text-white/80 backdrop-blur-sm">
          {index + 1} / {total}
        </div>

        {/* Watermark title */}
        <div className="absolute left-4 top-3 max-w-[60%]">
          <p className="text-shadow-lg text-xs font-bold uppercase tracking-widest text-white/50">
            {mangaTitle}
          </p>
          <p className="text-shadow-lg text-[10px] font-medium text-white/40">
            Chapter {chapterNumber}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

function PanelLayout({ index }: { index: number }) {
  // A few deterministic panel layouts to create visual variety
  const layout = index % 5

  return (
    <div className="absolute inset-0 p-4">
      {layout === 0 && (
        <>
          <Panel className="absolute left-4 top-4 right-4 h-[45%]" opacity={0.25} />
          <Panel className="absolute bottom-4 left-4 h-[45%] w-[48%]" opacity={0.3} />
          <Panel className="absolute bottom-4 right-4 h-[45%] w-[48%]" opacity={0.2} />
        </>
      )}
      {layout === 1 && (
        <>
          <Panel className="absolute left-4 top-4 bottom-4 w-[40%]" opacity={0.3} />
          <Panel className="absolute top-4 right-4 h-[55%] w-[55%]" opacity={0.2} />
          <Panel className="absolute bottom-4 right-4 h-[35%] w-[55%]" opacity={0.35} />
        </>
      )}
      {layout === 2 && (
        <>
          <Panel className="absolute left-4 top-4 right-4 h-[30%]" opacity={0.2} />
          <Panel className="absolute left-4 top-[36%] right-4 h-[28%]" opacity={0.35} />
          <Panel className="absolute left-4 bottom-4 right-4 h-[28%]" opacity={0.25} />
        </>
      )}
      {layout === 3 && (
        <>
          <Panel className="absolute left-4 top-4 right-[52%] h-[55%]" opacity={0.3} />
          <Panel className="absolute right-4 top-4 left-[52%] h-[40%]" opacity={0.2} />
          <Panel className="absolute right-4 bottom-4 left-4 h-[35%]" opacity={0.35} />
        </>
      )}
      {layout === 4 && (
        <>
          <Panel className="absolute left-4 top-4 right-4 h-[60%]" opacity={0.2} />
          <Panel className="absolute bottom-4 left-4 h-[30%] w-[30%]" opacity={0.35} />
          <Panel className="absolute bottom-4 left-[37%] h-[30%] w-[28%]" opacity={0.25} />
          <Panel className="absolute bottom-4 right-4 h-[30%] w-[30%]" opacity={0.3} />
        </>
      )}
    </div>
  )
}

function Panel({ className, opacity }: { className: string; opacity: number }) {
  return (
    <div
      className={`rounded border-2 border-white/20 ${className}`}
      style={{ background: `rgba(255,255,255,${opacity})` }}
    />
  )
}

'use client'

import { useState } from 'react'
import { cn, coverGradient } from '@/lib/utils'

interface CoverImageProps {
  src: string
  alt: string
  title: string
  className?: string
  priority?: boolean
}

export function CoverImage({ src, alt, title, className, priority }: CoverImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ background: coverGradient(title) }}
    >
      {!loaded && !failed && (
        <div className="absolute inset-0 bg-grid opacity-20 animate-pulse" />
      )}

      {!failed && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-all duration-700',
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          )}
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
    </div>
  )
}

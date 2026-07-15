'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  size?: number
  className?: string
  showValue?: boolean
}

export function StarRating({ rating, size = 14, className, showValue }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - (i - 1)))
        return (
          <div key={i} className="relative" style={{ width: size, height: size }}>
            <Star
              size={size}
              className="absolute inset-0 text-muted-foreground/40"
              strokeWidth={1.5}
            />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star
                size={size}
                className="text-amber-400 fill-amber-400"
                strokeWidth={1.5}
              />
            </div>
          </div>
        )
      })}
      {showValue && (
        <span className="ml-1 text-xs font-semibold text-amber-400">{rating.toFixed(1)}</span>
      )}
    </div>
  )
}

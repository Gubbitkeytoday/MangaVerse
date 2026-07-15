import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/genres
export async function GET(_req: NextRequest) {
  const genres = await db.genre.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { mangas: true } } },
  })
  return NextResponse.json(
    genres.map((g) => ({
      id: g.id,
      name: g.name,
      slug: g.slug,
      _count: { mangas: g._count.mangas },
    }))
  )
}

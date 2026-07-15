import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/manga/[slug]/reviews
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const manga = await db.manga.findUnique({ where: { slug }, select: { id: true } })
  if (!manga) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const reviews = await db.review.findMany({
    where: { mangaId: manga.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(
    reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))
  )
}

// POST /api/manga/[slug]/reviews
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const manga = await db.manga.findUnique({ where: { slug } })
  if (!manga) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const rating = Math.max(1, Math.min(5, Number(body.rating) || 5))

  const review = await db.review.create({
    data: {
      mangaId: manga.id,
      author: body.author || 'Anonymous',
      rating,
      content: body.content || '',
    },
  })

  // Recalculate aggregate rating
  const agg = await db.review.aggregate({
    where: { mangaId: manga.id },
    _avg: { rating: true },
    _count: { rating: true },
  })
  await db.manga.update({
    where: { id: manga.id },
    data: {
      rating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
      ratingCount: agg._count.rating,
    },
  })

  return NextResponse.json(
    { ...review, createdAt: review.createdAt.toISOString() },
    { status: 201 }
  )
}

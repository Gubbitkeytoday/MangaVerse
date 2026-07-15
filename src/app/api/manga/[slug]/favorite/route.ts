import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/manga/[slug]/favorite — toggle favorite for guest user
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const body = await req.json().catch(() => ({}))
  const userId = body.userId || 'guest'

  const manga = await db.manga.findUnique({ where: { slug }, select: { id: true } })
  if (!manga) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const existing = await db.favorite.findUnique({
    where: { mangaId_userId: { mangaId: manga.id, userId } },
  })

  if (existing) {
    await db.favorite.delete({ where: { id: existing.id } })
    await db.manga.update({
      where: { id: manga.id },
      data: { followers: { decrement: 1 } },
    })
    return NextResponse.json({ favorited: false })
  }

  await db.favorite.create({ data: { mangaId: manga.id, userId } })
  await db.manga.update({
    where: { id: manga.id },
    data: { followers: { increment: 1 } },
  })
  return NextResponse.json({ favorited: true })
}

// GET /api/manga/[slug]/favorite — check favorite status
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId') || 'guest'

  const manga = await db.manga.findUnique({ where: { slug }, select: { id: true } })
  if (!manga) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const existing = await db.favorite.findUnique({
    where: { mangaId_userId: { mangaId: manga.id, userId } },
  })
  return NextResponse.json({ favorited: !!existing })
}

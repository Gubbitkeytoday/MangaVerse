import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/manga/[slug]/comments
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const manga = await db.manga.findUnique({ where: { slug }, select: { id: true } })
  if (!manga) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const comments = await db.comment.findMany({
    where: { mangaId: manga.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(
    comments.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    }))
  )
}

// POST /api/manga/[slug]/comments
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const manga = await db.manga.findUnique({ where: { slug }, select: { id: true } })
  if (!manga) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const comment = await db.comment.create({
    data: {
      mangaId: manga.id,
      chapterId: body.chapterId || null,
      author: body.author || 'Anonymous',
      avatar: body.avatar || null,
      content: body.content,
      likes: 0,
    },
  })

  return NextResponse.json(
    { ...comment, createdAt: comment.createdAt.toISOString() },
    { status: 201 }
  )
}

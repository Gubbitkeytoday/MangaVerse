import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function parsePages(s: string): string[] {
  try { return JSON.parse(s) } catch { return [] }
}

// GET /api/manga/[slug]/chapters
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const { searchParams } = new URL(req.url)
  const withPages = searchParams.get('withPages') === 'true'

  const manga = await db.manga.findUnique({ where: { slug }, select: { id: true } })
  if (!manga) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const chapters = await db.chapter.findMany({
    where: { mangaId: manga.id },
    orderBy: { number: 'asc' },
    select: {
      id: true,
      mangaId: true,
      number: true,
      title: true,
      pages: withPages,
      views: true,
      publishedAt: true,
      createdAt: true,
    },
  })

  return NextResponse.json(
    chapters.map((c) => ({
      ...c,
      pages: c.pages ? parsePages(c.pages as unknown as string) : [],
      publishedAt: c.publishedAt.toISOString(),
      createdAt: c.createdAt.toISOString(),
    }))
  )
}

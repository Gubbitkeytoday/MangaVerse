import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function parsePages(s: string): string[] {
  try { return JSON.parse(s) } catch { return [] }
}

// POST /api/admin/manga/[slug] — add a chapter to a manga
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const manga = await db.manga.findUnique({ where: { slug }, select: { id: true } })
  if (!manga) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const pageCount = Math.max(1, Number(body.pageCount) || 10)
  const pages = JSON.stringify(
    Array.from({ length: pageCount }, (_, p) => `page:${slug}:${body.number}:${p}`)
  )

  const chapter = await db.chapter.create({
    data: {
      mangaId: manga.id,
      number: Number(body.number),
      title: body.title || `Chapter ${body.number}`,
      pages,
      views: 0,
      publishedAt: new Date(),
    },
  })

  return NextResponse.json(
    {
      ...chapter,
      pages: parsePages(chapter.pages),
      publishedAt: chapter.publishedAt.toISOString(),
      createdAt: chapter.createdAt.toISOString(),
    },
    { status: 201 }
  )
}

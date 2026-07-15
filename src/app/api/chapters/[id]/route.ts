import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function parsePages(s: string): string[] {
  try { return JSON.parse(s) } catch { return [] }
}

// GET /api/chapters/[id] — full chapter with pages
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const chapter = await db.chapter.findUnique({
    where: { id },
    include: { manga: { select: { id: true, title: true, slug: true, cover: true } } },
  })
  if (!chapter) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Also fetch sibling chapters for prev/next navigation
  const siblings = await db.chapter.findMany({
    where: { mangaId: chapter.mangaId },
    orderBy: { number: 'asc' },
    select: { id: true, number: true, title: true },
  })
  const idx = siblings.findIndex((s) => s.id === id)
  const prev = idx > 0 ? siblings[idx - 1] : null
  const next = idx < siblings.length - 1 ? siblings[idx + 1] : null

  return NextResponse.json({
    id: chapter.id,
    mangaId: chapter.mangaId,
    number: chapter.number,
    title: chapter.title,
    pages: parsePages(chapter.pages),
    views: chapter.views,
    publishedAt: chapter.publishedAt.toISOString(),
    createdAt: chapter.createdAt.toISOString(),
    manga: {
      id: chapter.manga.id,
      title: chapter.manga.title,
      slug: chapter.manga.slug,
      cover: chapter.manga.cover,
    },
    prev,
    next,
    totalChapters: siblings.length,
    chapterIndex: idx,
  })
}

// PUT /api/chapters/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const updated = await db.chapter.update({
    where: { id },
    data: {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.number !== undefined ? { number: Number(body.number) } : {}),
      ...(body.pages ? { pages: JSON.stringify(body.pages) } : {}),
    },
  })
  return NextResponse.json({
    ...updated,
    pages: parsePages(updated.pages),
    publishedAt: updated.publishedAt.toISOString(),
    createdAt: updated.createdAt.toISOString(),
  })
}

// DELETE /api/chapters/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await db.chapter.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

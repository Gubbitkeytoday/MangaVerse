import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeManga, mangaInclude } from '@/lib/manga-serializer'

function parsePages(s: string): string[] {
  try { return JSON.parse(s) } catch { return [] }
}

// GET /api/history?userId=guest
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId') || 'guest'

  const history = await db.readingHistory.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: {
      manga: { include: mangaInclude },
      chapter: true,
    },
  })

  return NextResponse.json(
    history.map((h) => ({
      id: h.id,
      mangaId: h.mangaId,
      chapterId: h.chapterId,
      manga: serializeManga(h.manga),
      chapter: {
        id: h.chapter.id,
        mangaId: h.chapter.mangaId,
        number: h.chapter.number,
        title: h.chapter.title,
        pages: parsePages(h.chapter.pages),
        views: h.chapter.views,
        publishedAt: h.chapter.publishedAt.toISOString(),
        createdAt: h.chapter.createdAt.toISOString(),
      },
      progress: h.progress,
      updatedAt: h.updatedAt.toISOString(),
      createdAt: h.createdAt.toISOString(),
    }))
  )
}

// DELETE /api/history?userId=guest — clear history
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId') || 'guest'
  await db.readingHistory.deleteMany({ where: { userId } })
  return NextResponse.json({ ok: true })
}

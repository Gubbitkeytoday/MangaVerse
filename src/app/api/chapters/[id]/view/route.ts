import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/chapters/[id]/view — increment chapter views & record history
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const userId = body.userId || 'guest'
  const progress = body.progress !== undefined ? Number(body.progress) : 0

  const chapter = await db.chapter.findUnique({
    where: { id },
    select: { mangaId: true },
  })
  if (!chapter) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.chapter.update({
    where: { id },
    data: { views: { increment: 1 } },
  })

  await db.readingHistory.upsert({
    where: { mangaId_userId: { mangaId: chapter.mangaId, userId } },
    create: { mangaId: chapter.mangaId, chapterId: id, userId, progress },
    update: { chapterId: id, progress, updatedAt: new Date() },
  })

  return NextResponse.json({ ok: true })
}

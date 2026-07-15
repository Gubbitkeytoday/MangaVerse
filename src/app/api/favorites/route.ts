import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeManga, mangaInclude } from '@/lib/manga-serializer'

// GET /api/favorites?userId=guest
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId') || 'guest'

  const favs = await db.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { manga: { include: mangaInclude } },
  })

  return NextResponse.json(
    favs.map((f) => ({
      id: f.id,
      mangaId: f.mangaId,
      manga: serializeManga(f.manga),
      createdAt: f.createdAt.toISOString(),
    }))
  )
}

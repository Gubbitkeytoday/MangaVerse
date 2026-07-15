import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeManga, mangaInclude } from '@/lib/manga-serializer'

// GET /api/manga/[slug]/related — manga sharing genres
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const manga = await db.manga.findUnique({
    where: { slug },
    include: { genres: { select: { genreId: true } } },
  })
  if (!manga) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const genreIds = manga.genres.map((g) => g.genreId)
  const related = await db.manga.findMany({
    where: {
      id: { not: manga.id },
      genres: { some: { genreId: { in: genreIds } } },
    },
    include: mangaInclude,
    take: 6,
    orderBy: { views: 'desc' },
  })

  return NextResponse.json(related.map(serializeManga))
}

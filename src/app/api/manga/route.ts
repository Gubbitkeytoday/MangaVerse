import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeManga, mangaInclude } from '@/lib/manga-serializer'

// GET /api/manga — list with filters/search/sort/pagination
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim() || ''
  const genre = searchParams.get('genre') || ''
  const status = searchParams.get('status') || ''
  const type = searchParams.get('type') || ''
  const sort = searchParams.get('sort') || 'popular'
  const featured = searchParams.get('featured')
  const limit = Math.min(parseInt(searchParams.get('limit') || '24'), 100)
  const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0)

  const where: any = {}
  if (q) where.title = { contains: q }
  if (status) where.status = status
  if (type) where.type = type
  if (featured === 'true') where.featured = true
  if (genre) {
    where.genres = { some: { genre: { slug: genre } } }
  }

  let orderBy: any = { views: 'desc' }
  if (sort === 'rating') orderBy = { rating: 'desc' }
  else if (sort === 'latest') orderBy = { createdAt: 'desc' }
  else if (sort === 'views') orderBy = { views: 'desc' }
  else if (sort === 'name') orderBy = { title: 'asc' }
  else if (sort === 'followers') orderBy = { followers: 'desc' }
  else if (sort === 'updated') orderBy = { updatedAt: 'desc' }

  const [total, mangas] = await Promise.all([
    db.manga.count({ where }),
    db.manga.findMany({
      where,
      include: mangaInclude,
      orderBy,
      take: limit,
      skip: offset,
    }),
  ])

  return NextResponse.json({
    items: mangas.map(serializeManga),
    total,
    limit,
    offset,
  })
}

// POST /api/manga — create (admin)
export async function POST(req: NextRequest) {
  const body = await req.json()
  const genres: string[] = body.genres || []
  const slug: string =
    body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const manga = await db.manga.create({
    data: {
      title: body.title,
      slug,
      altTitles: JSON.stringify(body.altTitles || []),
      description: body.description || '',
      cover: body.cover || '/covers/shadow-realm.png',
      banner: body.banner || body.cover || '/covers/shadow-realm.png',
      author: body.author || 'Unknown',
      artist: body.artist || body.author || 'Unknown',
      status: body.status || 'ONGOING',
      type: body.type || 'MANGA',
      year: body.year ? Number(body.year) : null,
      rating: body.rating ? Number(body.rating) : 0,
      ratingCount: body.ratingCount ? Number(body.ratingCount) : 0,
      views: 0,
      followers: 0,
      featured: !!body.featured,
      genres: {
        create: genres.map((gid: string) => ({ genreId: gid })),
      },
    },
    include: mangaInclude,
  })

  return NextResponse.json(serializeManga(manga), { status: 201 })
}

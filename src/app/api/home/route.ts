import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeManga, mangaInclude } from '@/lib/manga-serializer'

const chapterSelect = {
  id: true,
  mangaId: true,
  number: true,
  title: true,
  pages: true,
  views: true,
  publishedAt: true,
  createdAt: true,
} as const

// GET /api/home — aggregated home page data
export async function GET(_req: NextRequest) {
  const [hero, trending, popular, topRated, newReleases, latestChapters, featuredGenres] =
    await Promise.all([
      // Hero: featured manga with latest chapter
      db.manga.findMany({
        where: { featured: true },
        include: {
          ...mangaInclude,
          chapters: { orderBy: { number: 'desc' }, take: 1 },
        },
        orderBy: { rating: 'desc' },
        take: 5,
      }),
      // Trending: high views + recent
      db.manga.findMany({
        include: mangaInclude,
        orderBy: [{ views: 'desc' }],
        take: 12,
      }),
      // Popular: by followers
      db.manga.findMany({
        include: mangaInclude,
        orderBy: { followers: 'desc' },
        take: 12,
      }),
      // Top rated
      db.manga.findMany({
        include: mangaInclude,
        orderBy: { rating: 'desc' },
        take: 12,
      }),
      // New releases: by year desc then createdAt
      db.manga.findMany({
        include: mangaInclude,
        orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
        take: 12,
      }),
      // Latest chapter updates
      db.chapter.findMany({
        orderBy: { publishedAt: 'desc' },
        take: 24,
        include: { manga: { include: mangaInclude } },
      }),
      // Genres with counts
      db.genre.findMany({
        include: { _count: { select: { mangas: true } } },
        orderBy: { name: 'asc' },
      }),
    ])

  return NextResponse.json({
    hero: hero.map((m) => ({
      ...serializeManga({ ...m, latestChapter: m.chapters[0] || undefined }),
    })),
    trending: trending.map(serializeManga),
    popular: popular.map(serializeManga),
    topRated: topRated.map(serializeManga),
    newReleases: newReleases.map(serializeManga),
    latestUpdates: latestChapters.map((c) => ({
      chapter: {
        id: c.id,
        mangaId: c.mangaId,
        number: c.number,
        title: c.title,
        views: c.views,
        publishedAt: c.publishedAt.toISOString(),
        createdAt: c.createdAt.toISOString(),
      },
      manga: serializeManga(c.manga),
    })),
    genres: featuredGenres.map((g) => ({
      id: g.id,
      name: g.name,
      slug: g.slug,
      _count: { mangas: g._count.mangas },
    })),
  })
}

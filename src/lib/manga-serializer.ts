import type { Manga } from './types'

export function parseAlt(s: string): string[] {
  try {
    return JSON.parse(s)
  } catch {
    return []
  }
}

export function parsePages(s: string): string[] {
  try {
    return JSON.parse(s)
  } catch {
    return []
  }
}

export function serializeManga(m: any): Manga {
  return {
    id: m.id,
    title: m.title,
    slug: m.slug,
    altTitles: parseAlt(m.altTitles),
    description: m.description,
    cover: m.cover,
    banner: m.banner ?? m.cover,
    author: m.author,
    artist: m.artist ?? m.author,
    status: m.status,
    type: m.type,
    year: m.year,
    rating: m.rating,
    ratingCount: m.ratingCount,
    views: m.views,
    followers: m.followers,
    featured: m.featured,
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
    genres: (m.genres ?? []).map((g: any) => g.genre ?? g),
    _count: m._count
      ? {
          chapters: m._count.chapters ?? 0,
          comments: m._count.comments ?? 0,
          favorites: m._count.favorites ?? 0,
          reviews: m._count.reviews ?? 0,
        }
      : undefined,
    latestChapter: m.latestChapter
      ? {
          id: m.latestChapter.id,
          mangaId: m.latestChapter.mangaId,
          number: m.latestChapter.number,
          title: m.latestChapter.title,
          pages: parsePages(m.latestChapter.pages),
          views: m.latestChapter.views,
          publishedAt: m.latestChapter.publishedAt.toISOString(),
          createdAt: m.latestChapter.createdAt.toISOString(),
        }
      : undefined,
  }
}

export const mangaInclude = {
  genres: { include: { genre: true } },
  _count: { select: { chapters: true, comments: true, favorites: true, reviews: true } },
} as const

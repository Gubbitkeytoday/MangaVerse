import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/stats — admin dashboard stats
export async function GET(_req: NextRequest) {
  const [
    mangaCount,
    chapterCount,
    commentCount,
    reviewCount,
    favoriteCount,
    totalViewsAgg,
    avgRatingAgg,
    topManga,
    recentManga,
  ] = await Promise.all([
    db.manga.count(),
    db.chapter.count(),
    db.comment.count(),
    db.review.count(),
    db.favorite.count(),
    db.manga.aggregate({ _sum: { views: true } }),
    db.manga.aggregate({ _avg: { rating: true } }),
    db.manga.findMany({
      orderBy: { views: 'desc' },
      take: 5,
      include: { _count: { select: { chapters: true } } },
    }),
    db.manga.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { _count: { select: { chapters: true } } },
    }),
  ])

  // Views per manga (for chart) — top 10
  const viewsChart = await db.manga.findMany({
    orderBy: { views: 'desc' },
    take: 10,
    select: { title: true, views: true },
  })

  // Genre distribution
  const genres = await db.genre.findMany({
    include: { _count: { select: { mangas: true } } },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json({
    totals: {
      manga: mangaCount,
      chapters: chapterCount,
      comments: commentCount,
      reviews: reviewCount,
      favorites: favoriteCount,
      totalViews: totalViewsAgg._sum.views ?? 0,
      avgRating: Math.round((avgRatingAgg._avg.rating ?? 0) * 10) / 10,
    },
    topManga: topManga.map((m) => ({
      id: m.id,
      title: m.title,
      slug: m.slug,
      cover: m.cover,
      views: m.views,
      followers: m.followers,
      rating: m.rating,
      chapters: m._count.chapters,
    })),
    recentManga: recentManga.map((m) => ({
      id: m.id,
      title: m.title,
      slug: m.slug,
      cover: m.cover,
      createdAt: m.createdAt.toISOString(),
      chapters: m._count.chapters,
    })),
    viewsChart: viewsChart.map((m) => ({ name: m.title, views: m.views })),
    genres: genres.map((g) => ({ name: g.name, count: g._count.mangas })),
  })
}

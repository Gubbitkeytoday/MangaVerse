import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeManga, mangaInclude } from '@/lib/manga-serializer'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const manga = await db.manga.findUnique({
    where: { slug },
    include: mangaInclude,
  })
  if (!manga) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(serializeManga(manga))
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const body = await req.json()
  const existing = await db.manga.findUnique({ where: { slug } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (body.genres) {
    await db.mangaGenre.deleteMany({ where: { mangaId: existing.id } })
    await db.mangaGenre.createMany({
      data: body.genres.map((gid: string) => ({ mangaId: existing.id, genreId: gid })),
    })
  }

  const updated = await db.manga.update({
    where: { slug },
    data: {
      ...(body.title ? { title: body.title } : {}),
      ...(body.slug ? { slug: body.slug } : {}),
      ...(body.altTitles ? { altTitles: JSON.stringify(body.altTitles) } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(body.cover ? { cover: body.cover } : {}),
      ...(body.banner ? { banner: body.banner } : {}),
      ...(body.author ? { author: body.author } : {}),
      ...(body.artist ? { artist: body.artist } : {}),
      ...(body.status ? { status: body.status } : {}),
      ...(body.type ? { type: body.type } : {}),
      ...(body.year !== undefined ? { year: body.year ? Number(body.year) : null } : {}),
      ...(body.rating !== undefined ? { rating: Number(body.rating) } : {}),
      ...(body.ratingCount !== undefined ? { ratingCount: Number(body.ratingCount) } : {}),
      ...(body.featured !== undefined ? { featured: !!body.featured } : {}),
    },
    include: mangaInclude,
  })
  return NextResponse.json(serializeManga(updated))
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  await db.manga.delete({ where: { slug } })
  return NextResponse.json({ ok: true })
}

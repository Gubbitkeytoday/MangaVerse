import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/manga/[slug]/record-view — increment manga views
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  await db.manga.update({
    where: { slug },
    data: { views: { increment: 1 } },
  })
  return NextResponse.json({ ok: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// DELETE /api/comments/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await db.comment.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

// PUT /api/comments/[id] — like a comment
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  if (body.action === 'like') {
    const updated = await db.comment.update({
      where: { id },
      data: { likes: { increment: 1 } },
    })
    return NextResponse.json(updated)
  }
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

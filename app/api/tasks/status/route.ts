import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { id, status } = body
  if (!id || !status) return NextResponse.json({ error: 'id and status required' }, { status: 400 })

  const task = await prisma.task.findUnique({ where: { id }, include: { project: true } })
  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const isOwner = task.project.ownerId === (session.user as any).id
  const isAdmin = (session.user as any).role === 'admin'
  if (!isOwner && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const updated = await prisma.task.update({ where: { id }, data: { status } })
  return NextResponse.json(updated)
}

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { projectId, title, description, priority, status } = body

  if (!projectId || !title) {
    return NextResponse.json({ error: 'projectId and title are required' }, { status: 400 })
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const isOwner = project.ownerId === (session.user as any).id
  const isAdmin = (session.user as any).role === 'admin'
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      priority: priority || 'medium',
      status: status || 'todo',
      projectId,
      assigneeId: (session.user as any).id,
    },
  })

  return NextResponse.json(task)
}

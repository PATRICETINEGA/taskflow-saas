import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      tasks: { include: { assignee: { select: { name: true, email: true } } } },
      owner: { select: { name: true, email: true } },
    },
  })

  if (!project) {
    return <div className="p-8">Project not found</div>
  }

  const isOwner = project.ownerId === (session.user as any).id
  const isAdmin = (session.user as any).role === 'admin'
  if (!isOwner && !isAdmin) {
    return <div className="p-8">Access denied</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4">
        <Link href="/dashboard" className="text-blue-600">← Back to Dashboard</Link>
      </nav>
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
        <p className="text-gray-600 mb-6">{project.description}</p>
        <p className="text-sm text-gray-500 mb-6">
          Owner: {project.owner.name || project.owner.email} · Status: {project.status}
        </p>

        <h2 className="text-xl font-semibold mb-4">Tasks</h2>
        <div className="bg-white rounded-lg shadow divide-y">
          {project.tasks.map((task) => (
            <div key={task.id} className="px-6 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-500">{task.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  task.status === 'done' ? 'bg-green-100 text-green-800' :
                  task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Priority: {task.priority}
                {task.assignee && ` · Assigned to ${task.assignee.name || task.assignee.email}`}
              </p>
            </div>
          ))}
          {project.tasks.length === 0 && (
            <p className="px-6 py-8 text-center text-gray-500">No tasks yet</p>
          )}
        </div>
      </main>
    </div>
  )
}

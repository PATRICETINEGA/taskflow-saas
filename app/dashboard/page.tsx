import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const userId = (session.user as any).id
  const isAdmin = (session.user as any).role === 'admin'

  const projects = await prisma.project.findMany({
    where: isAdmin ? {} : { ownerId: userId },
    include: {
      tasks: true,
      owner: { select: { name: true, email: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })

  const totalTasks = projects.reduce((sum, p) => sum + p.tasks.length, 0)
  const completedTasks = projects.reduce(
    (sum, p) => sum + p.tasks.filter((t) => t.status === 'done').length,
    0
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">TaskFlow</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{session.user?.email}</span>
          <Link href="/api/auth/signout" className="text-sm text-red-600">
            Sign out
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500">Projects</p>
            <p className="text-3xl font-bold">{projects.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Tasks</p>
            <p className="text-3xl font-bold">{totalTasks}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-3xl font-bold">{completedTasks}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Projects</h3>
            <Link
              href="/projects/new"
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
            >
              New Project
            </Link>
          </div>
          <div className="divide-y">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block px-6 py-4 hover:bg-gray-50"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-gray-500">
                      {project.tasks.length} tasks · {project.status}
                    </p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {project.owner.name || project.owner.email}
                  </span>
                </div>
              </Link>
            ))}
            {projects.length === 0 && (
              <p className="px-6 py-8 text-center text-gray-500">
                No projects yet. Create your first one.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

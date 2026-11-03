import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await getSession()
  if (!session || (session.user as any).role !== 'admin') {
    redirect('/dashboard')
  }

  const users = await prisma.user.findMany({
    include: { _count: { select: { projects: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const allProjects = await prisma.project.findMany({
    include: { owner: { select: { email: true } }, _count: { select: { tasks: true } } },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between">
        <Link href="/dashboard" className="text-blue-600">← Dashboard</Link>
        <span className="font-semibold">Admin Panel</span>
      </nav>
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Overview</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b font-semibold">Users ({users.length})</div>
            <div className="divide-y">
              {users.map((u) => (
                <div key={u.id} className="px-6 py-3 flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{u.name || u.email}</p>
                    <p className="text-gray-500">{u.email} · {u.role}</p>
                  </div>
                  <span>{u._count.projects} projects</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b font-semibold">All Projects ({allProjects.length})</div>
            <div className="divide-y">
              {allProjects.map((p) => (
                <div key={p.id} className="px-6 py-3 text-sm">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-gray-500">{p.owner.email} · {p._count.tasks} tasks · {p.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

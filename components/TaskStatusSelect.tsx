'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const statuses = ['todo', 'in_progress', 'review', 'done']

export default function TaskStatusSelect({ taskId, current }: { taskId: string; current: string }) {
  const [status, setStatus] = useState(current)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function change(newStatus: string) {
    setLoading(true)
    setStatus(newStatus)
    await fetch('/api/tasks/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: taskId, status: newStatus }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <select
      value={status}
      onChange={(e) => change(e.target.value)}
      disabled={loading}
      className="text-xs border rounded px-2 py-1"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>{s.replace('_', ' ')}</option>
      ))}
    </select>
  )
}

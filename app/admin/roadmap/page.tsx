'use client'

import { AdminShell } from '@/components/admin/admin-shell'
import { RoadmapPhasesManager } from '@/components/admin/roadmap-phases-manager'

export default function AdminRoadmapPage() {
  return (
    <AdminShell
      title="Roadmap Phases"
      description="Manage development timeline and phases"
    >
      <RoadmapPhasesManager />
    </AdminShell>
  )
}

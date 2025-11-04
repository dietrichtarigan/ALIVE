'use client'

import { AdminShell } from '@/components/admin/admin-shell'
import { ProgramItemsManager } from '@/components/admin/program-items-manager'

export default function AdminProgramsPage() {
  return (
    <AdminShell
      title="Program Items"
      description="Manage 4 core programs: INFOPROF, SINERGI, CeritaKita, ALIVE"
    >
      <ProgramItemsManager />
    </AdminShell>
  )
}

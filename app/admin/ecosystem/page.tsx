'use client'

import { AdminShell } from '@/components/admin/admin-shell'
import { EcosystemCardsManager } from '@/components/admin/ecosystem-cards-manager'

export default function AdminEcosystemPage() {
  return (
    <AdminShell
      title="Ecosystem Cards"
      description="Manage ecosystem integration and pipeline cards"
    >
      <EcosystemCardsManager />
    </AdminShell>
  )
}

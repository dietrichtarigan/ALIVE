'use client'

import { AdminShell } from '@/components/admin/admin-shell'
import { SpotlightItemsManager } from '@/components/admin/spotlight-items-manager'

export default function AdminSpotlightPage() {
  return (
    <AdminShell
      title="Spotlight Items"
      description="Manage highlighted content for Karier, Event, and Cerita categories"
    >
      <SpotlightItemsManager />
    </AdminShell>
  )
}

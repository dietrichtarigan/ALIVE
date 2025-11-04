'use client'

import { AdminShell } from '@/components/admin/admin-shell'
import { CTABlocksManager } from '@/components/admin/cta-blocks-manager'

export default function AdminCTAPage() {
  return (
    <AdminShell
      title="CTA Blocks"
      description="Manage call-to-action sections"
    >
      <CTABlocksManager />
    </AdminShell>
  )
}

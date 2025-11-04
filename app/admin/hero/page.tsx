'use client'

import { AdminShell } from '@/components/admin/admin-shell'
import { HeroSectionsManager } from '@/components/admin/hero-sections-manager'

export default function AdminHeroPage() {
  return (
    <AdminShell
      title="Hero Sections"
      description="Manage hero banners for homepage and landing pages"
    >
      <HeroSectionsManager />
    </AdminShell>
  )
}

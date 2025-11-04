'use client'

import { AdminShell } from '@/components/admin/admin-shell'
import { FAQItemsManager } from '@/components/admin/faq-items-manager'

export default function AdminFAQPage() {
  return (
    <AdminShell
      title="FAQ Items"
      description="Manage frequently asked questions"
    >
      <FAQItemsManager />
    </AdminShell>
  )
}

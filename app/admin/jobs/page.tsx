"use client";

import { AdminJobsManager } from "@/components/admin/admin-jobs-manager";
import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminJobsPage() {
  return (
    <AdminShell
      title="Kelola Info Karier"
      description="Tambahkan, perbarui, dan arsipkan data INFOPROF langsung dari Supabase."
    >
      <AdminJobsManager />
    </AdminShell>
  );
}

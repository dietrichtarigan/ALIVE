"use client";

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminHomePage() {
  return (
    <AdminShell
      title="Dasbor Admin"
      description="Pantau ringkasan konten ARCADE dan akses modul manajemen."
    >
      <AdminDashboard />
    </AdminShell>
  );
}

"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStoriesManager } from "@/components/admin/admin-stories-manager";

export default function AdminStoriesPage() {
  return (
    <AdminShell
      title="Kelola Cerita Alumni"
      description="Kurasi dan publikasikan cerita alumni melalui backend CeritaKita."
    >
      <AdminStoriesManager />
    </AdminShell>
  );
}

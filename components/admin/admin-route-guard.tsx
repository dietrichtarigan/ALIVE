"use client";

import { ReactNode } from "react";

import { AdminLogin } from "@/components/admin/admin-login";
import { useAdminSession } from "@/components/admin/admin-session-provider";

export function AdminRouteGuard({ children }: { children: ReactNode }) {
  const { status, error } = useAdminSession();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
        <div className="rounded-xl border border-border/60 bg-background px-6 py-8 text-center text-sm text-muted-foreground">
          Memverifikasi sesi admin...
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <AdminLogin />;
  }

  if (status === "authenticated" && error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
        <div className="space-y-4 rounded-xl border border-border/60 bg-background px-6 py-8 text-center text-sm text-foreground">
          <p>{error}</p>
          <p className="text-muted-foreground">Silakan masuk kembali.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

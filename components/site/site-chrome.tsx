"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import SiteFooter from "@/components/site/site-footer";
import SiteNavbar from "@/components/site/site-navbar";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

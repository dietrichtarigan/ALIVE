import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin Dashboard - ARCADE HIMAFI",
  description: "Kelola konten INFOPROF, CeritaKita, dan sumber daya ARCADE HIMAFI.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

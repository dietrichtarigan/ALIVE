"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import ArcadeLogo from "@/components/logos/arcade";
import { Button } from "@/components/ui/button";

interface AdminShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

const navItems = [
  { href: "/admin", label: "Dasbor" },
  { href: "/admin/jobs", label: "Info Karier" },
  { href: "/admin/stories", label: "Cerita Alumni" },
];

export function AdminShell({ title, description, actions, children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border/40 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="flex items-center gap-3 text-sm font-semibold tracking-tight">
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ArcadeLogo className="size-5" />
            </span>
            <span>ARCADE Admin</span>
          </Link>
          <Button asChild size="sm" variant="outline">
            <Link href="/">Kembali ke situs</Link>
          </Button>
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-8">
        <aside className="hidden w-56 shrink-0 rounded-xl border border-border/40 bg-background/80 p-4 lg:block">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
  </aside>
  <main className="flex-1 space-y-6">
          <nav className="flex gap-2 overflow-x-auto rounded-lg border border-border/40 bg-background/90 p-2 text-sm lg:hidden">
            {navItems.map((item) => {
              const isActive = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-md px-3 py-2 font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="rounded-xl border border-border/40 bg-background/90 p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
              </div>
              {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
            </div>
          </div>
          <div className="pb-12">{children}</div>
        </main>
      </div>
    </div>
  );
}

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode } from 'react'

import { AdminSessionProvider } from '@/components/admin/admin-session-provider'
import { Button } from '@/components/ui/button'
import { createSupabaseBrowserClient } from '@/lib/supabase-client'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/hero', label: 'Hero' },
    { href: '/admin/programs', label: 'Programs' },
    { href: '/admin/spotlight', label: 'Spotlight' },
    { href: '/admin/ecosystem', label: 'Ecosystem' },
    { href: '/admin/roadmap', label: 'Roadmap' },
    { href: '/admin/cta', label: 'CTA' },
    { href: '/admin/faq', label: 'FAQ' },
  ]

  return (
    <AdminSessionProvider>
      <div className="min-h-screen bg-background">
        {/* Top Navigation */}
        <nav className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-8">
                <Link href="/admin" className="text-xl font-bold">
                  CMS Admin
                </Link>
                <div className="hidden md:flex gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/" target="_blank" className="text-sm text-muted-foreground hover:text-foreground">
                  View Site →
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </nav>
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      </div>
    </AdminSessionProvider>
  )
}

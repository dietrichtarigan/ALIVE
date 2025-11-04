
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useAdminSession } from '@/components/admin/admin-session-provider'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { login, status } = useAdminSession()

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/admin')
    }
  }, [status, router])

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const result = await login({ email, password })

    if (!result.ok) {
      setError(result.message ?? 'Autentikasi admin gagal.')
      setLoading(false)
      return
    }

    setLoading(false)
    router.replace('/admin')
    router.refresh()
  }

  return (
    <Section className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg border">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground mt-2">Sign in to manage content</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md bg-background"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md bg-background"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </Section>
  )
}

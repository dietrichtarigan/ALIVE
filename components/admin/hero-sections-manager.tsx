'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Database } from '@/types/database'

type HeroSection = Database['public']['Tables']['hero_sections']['Row']

export function HeroSectionsManager() {
  const [items, setItems] = useState<HeroSection[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<HeroSection>>({})

  const API_BASE_URL = '/api/admin/content/hero_sections'

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    setLoading(true)

    try {
      const response = await fetch(API_BASE_URL, { cache: 'no-store' })
      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        console.error('Error loading hero sections:', error)
        return
      }

      const { data } = await response.json()
      if (data) setItems(data)
    } catch (error) {
      console.error('Error loading hero sections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    const isExisting = editingId !== null && editingId !== 'new'

    const payload: Record<string, unknown> = { ...formData }
    if (isExisting) {
      payload.id = editingId
    }

    const response = await fetch(API_BASE_URL, {
      method: isExisting ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      console.error('Error saving hero section:', error)
      alert('Error saving hero section')
      return
    }

    setEditingId(null)
    setFormData({})
    loadItems()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this item?')) {
      const response = await fetch(`${API_BASE_URL}?id=${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        console.error('Error deleting hero section:', error)
        alert('Error deleting hero section')
        return
      }

      loadItems()
    }
  }

  const startEdit = (item: HeroSection) => {
    setEditingId(item.id)
    setFormData(item)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hero Sections</h2>
        <Button onClick={() => { setEditingId('new'); setFormData({ is_published: false, position: 0 }) }}>
          Add New
        </Button>
      </div>

      {/* Edit Form */}
      {editingId && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">{editingId === 'new' ? 'Add New' : 'Edit'} Hero Section</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">Slug</label>
            <input
              type="text"
              value={formData.slug || ''}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="home-hero"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="Your amazing title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subtitle</label>
            <textarea
              value={formData.subtitle || ''}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full px-3 py-2 border rounded-md bg-background"
              rows={3}
              placeholder="Compelling subtitle"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Primary CTA Text</label>
              <input
                type="text"
                value={formData.cta_primary_text || ''}
                onChange={(e) => setFormData({ ...formData, cta_primary_text: e.target.value })}
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Primary CTA URL</label>
              <input
                type="text"
                value={formData.cta_primary_url || ''}
                onChange={(e) => setFormData({ ...formData, cta_primary_url: e.target.value })}
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Secondary CTA Text</label>
              <input
                type="text"
                value={formData.cta_secondary_text || ''}
                onChange={(e) => setFormData({ ...formData, cta_secondary_text: e.target.value })}
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Secondary CTA URL</label>
              <input
                type="text"
                value={formData.cta_secondary_url || ''}
                onChange={(e) => setFormData({ ...formData, cta_secondary_url: e.target.value })}
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_published || false}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Published</span>
            </label>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Position:</label>
              <input
                type="number"
                value={formData.position || 0}
                onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
                className="w-20 px-2 py-1 border rounded-md bg-background"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={() => { setEditingId(null); setFormData({}) }}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Items List */}
      <div className="space-y-2">
        {items.map((item) => (
          <Card key={item.id} className="p-4 flex justify-between items-center">
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-muted-foreground">
                {item.slug} • Position: {item.position} • {item.is_published ? '✅ Published' : '⚠️ Draft'}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => startEdit(item)}>
                Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface SpotlightItem {
  id: string
  category: 'Karier' | 'Event' | 'Cerita'
  title: string
  description: string
  link: string
  meta: string | null
  cta_text: string | null
  is_published: boolean
  display_order: number
}

export function SpotlightItemsManager() {
  const [items, setItems] = useState<SpotlightItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<SpotlightItem>>({
    category: 'Karier',
    title: '',
    description: '',
    link: '',
    meta: '',
    cta_text: 'Lihat detail',
    is_published: true,
    display_order: 0
  })
  const API_BASE_URL = '/api/admin/content/spotlight_items'

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    setLoading(true)

    try {
      const response = await fetch(API_BASE_URL, { cache: 'no-store' })
      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        console.error('Error loading spotlight items:', error)
        return
      }

      const { data } = await response.json()
      setItems(data || [])
    } catch (error) {
      console.error('Error loading spotlight items:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!formData.category || !formData.title || !formData.description || !formData.link) {
      alert('Category, title, description, and link are required')
      return
    }

    const isExisting = Boolean(editingId)
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
      console.error('Error saving spotlight item:', error)
      alert(
        `Error ${isExisting ? 'updating' : 'creating'} spotlight item${error?.details ? `: ${error.details}` : ''}`
      )
      return
    }

    setEditingId(null)
    setFormData({
      category: 'Karier',
      title: '',
      description: '',
      link: '',
      meta: '',
      cta_text: 'Lihat detail',
      is_published: true,
      display_order: 0
    })
    loadItems()
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this spotlight item?')) return

    const response = await fetch(`${API_BASE_URL}?id=${id}`, { method: 'DELETE' })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      console.error('Error deleting spotlight item:', error)
      alert('Error deleting spotlight item')
      return
    }

    loadItems()
  }

  function handleEdit(item: SpotlightItem) {
    setEditingId(item.id)
    setFormData(item)
  }

  function handleCancel() {
    setEditingId(null)
    setFormData({
      category: 'Karier',
      title: '',
      description: '',
      link: '',
      meta: '',
      cta_text: 'Lihat detail',
      is_published: true,
      display_order: 0
    })
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  const categoryColors = {
    Karier: 'bg-blue-100 text-blue-800',
    Event: 'bg-purple-100 text-purple-800',
    Cerita: 'bg-green-100 text-green-800'
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {editingId ? 'Edit Spotlight Item' : 'Add New Spotlight Item'}
        </h3>
        
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={formData.category || 'Karier'}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value as SpotlightItem['category'] })
              }
            >
              <option value="Karier">Karier</option>
              <option value="Event">Event</option>
              <option value="Cerita">Cerita</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Data Scientist - Tech Company"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Peluang posisi data scientist untuk fresh graduate..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Link *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.link || ''}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="/karier or /events or /cerita/slug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Meta Info</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.meta || ''}
              onChange={(e) => setFormData({ ...formData, meta: e.target.value })}
              placeholder="PT Company · Batas 31 Des 2024"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Organization/date/location info
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">CTA Button Text</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.cta_text || ''}
              onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
              placeholder="Lihat di INFOPROF"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Display Order</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.display_order || 0}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_published"
              className="mr-2"
              checked={formData.is_published || false}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
            />
            <label htmlFor="is_published" className="text-sm font-medium">Published</label>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave}>
              {editingId ? 'Update' : 'Create'}
            </Button>
            {editingId && (
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Existing Spotlight Items</h3>
        
        {items.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            No spotlight items found. Create one above.
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded ${categoryColors[item.category]}`}>
                      {item.category}
                    </span>
                    <h4 className="font-semibold">{item.title}</h4>
                    {!item.is_published && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  {item.meta && (
                    <p className="text-xs text-muted-foreground mb-1">📍 {item.meta}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>→ {item.link}</span>
                    {item.cta_text && <span>CTA: &quot;{item.cta_text}&quot;</span>}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleEdit(item)}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    variant="destructive"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

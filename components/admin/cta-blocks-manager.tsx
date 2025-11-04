'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface CTABlock {
  id: string
  slug: string
  title: string
  description: string | null
  primary_button_text: string | null
  primary_button_url: string | null
  secondary_button_text: string | null
  secondary_button_url: string | null
  is_published: boolean
  display_order: number
}

export function CTABlocksManager() {
  const [items, setItems] = useState<CTABlock[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<CTABlock>>({
    slug: '',
    title: '',
    description: '',
    primary_button_text: '',
    primary_button_url: '',
    secondary_button_text: '',
    secondary_button_url: '',
    is_published: true,
    display_order: 0
  })
  const API_BASE_URL = '/api/admin/content/cta_blocks'

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    setLoading(true)

    try {
      const response = await fetch(API_BASE_URL, { cache: 'no-store' })
      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        console.error('Error loading CTA blocks:', error)
        return
      }

      const { data } = await response.json()
      setItems(data || [])
    } catch (error) {
      console.error('Error loading CTA blocks:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!formData.slug || !formData.title) {
      alert('Slug and title are required')
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
      console.error('Error saving CTA block:', error)
      alert(
        `Error ${isExisting ? 'updating' : 'creating'} CTA block${error?.details ? `: ${error.details}` : ''}`
      )
      return
    }

    setEditingId(null)
    setFormData({
      slug: '',
      title: '',
      description: '',
      primary_button_text: '',
      primary_button_url: '',
      secondary_button_text: '',
      secondary_button_url: '',
      is_published: true,
      display_order: 0
    })
    loadItems()
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this CTA block?')) return

    const response = await fetch(`${API_BASE_URL}?id=${id}`, { method: 'DELETE' })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      console.error('Error deleting CTA block:', error)
      alert('Error deleting CTA block')
      return
    }

    loadItems()
  }

  function handleEdit(item: CTABlock) {
    setEditingId(item.id)
    setFormData(item)
  }

  function handleCancel() {
    setEditingId(null)
    setFormData({
      slug: '',
      title: '',
      description: '',
      primary_button_text: '',
      primary_button_url: '',
      secondary_button_text: '',
      secondary_button_url: '',
      is_published: true,
      display_order: 0
    })
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {editingId ? 'Edit CTA Block' : 'Add New CTA Block'}
        </h3>
        
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Slug *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.slug || ''}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="home-cta"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ready to get started?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Join thousands of satisfied customers..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Primary Button Text</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.primary_button_text || ''}
                onChange={(e) => setFormData({ ...formData, primary_button_text: e.target.value })}
                placeholder="Get Started"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Primary Button URL</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.primary_button_url || ''}
                onChange={(e) => setFormData({ ...formData, primary_button_url: e.target.value })}
                placeholder="/signup"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Secondary Button Text</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.secondary_button_text || ''}
                onChange={(e) => setFormData({ ...formData, secondary_button_text: e.target.value })}
                placeholder="Learn More"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Secondary Button URL</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.secondary_button_url || ''}
                onChange={(e) => setFormData({ ...formData, secondary_button_url: e.target.value })}
                placeholder="/about"
              />
            </div>
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
        <h3 className="text-lg font-semibold">Existing CTA Blocks</h3>
        
        {items.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            No CTA blocks found. Create one above.
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{item.title}</h4>
                    <span className="text-xs text-muted-foreground">({item.slug})</span>
                    {!item.is_published && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Draft
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  )}
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    {item.primary_button_text && (
                      <span>Primary: {item.primary_button_text}</span>
                    )}
                    {item.secondary_button_text && (
                      <span>• Secondary: {item.secondary_button_text}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
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

'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface EcosystemCard {
  id: string
  title: string
  description: string
  is_published: boolean
  display_order: number
}

export function EcosystemCardsManager() {
  const [items, setItems] = useState<EcosystemCard[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<EcosystemCard>>({
    title: '',
    description: '',
    is_published: true,
    display_order: 0
  })
  const API_BASE_URL = '/api/admin/content/ecosystem_cards'

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    setLoading(true)

    try {
      const response = await fetch(API_BASE_URL, { cache: 'no-store' })
      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        console.error('Error loading ecosystem cards:', error)
        return
      }

      const { data } = await response.json()
      setItems(data || [])
    } catch (error) {
      console.error('Error loading ecosystem cards:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!formData.title || !formData.description) {
      alert('Title and description are required')
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
      console.error('Error saving ecosystem card:', error)
      alert(
        `Error ${isExisting ? 'updating' : 'creating'} ecosystem card${error?.details ? `: ${error.details}` : ''}`
      )
      return
    }

    setEditingId(null)
    setFormData({
      title: '',
      description: '',
      is_published: true,
      display_order: 0
    })
    loadItems()
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this ecosystem card?')) return

    const response = await fetch(`${API_BASE_URL}?id=${id}`, { method: 'DELETE' })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      console.error('Error deleting ecosystem card:', error)
      alert('Error deleting ecosystem card')
      return
    }

    loadItems()
  }

  function handleEdit(item: EcosystemCard) {
    setEditingId(item.id)
    setFormData(item)
  }

  function handleCancel() {
    setEditingId(null)
    setFormData({
      title: '',
      description: '',
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
          {editingId ? 'Edit Ecosystem Card' : 'Add New Ecosystem Card'}
        </h3>
        
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Integrasi Media Sosial"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Sinkron konten CeritaKita dan highlight event ke Instagram..."
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
        <h3 className="text-lg font-semibold">Existing Ecosystem Cards</h3>
        
        {items.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            No ecosystem cards found. Create one above.
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{item.title}</h4>
                    {!item.is_published && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
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

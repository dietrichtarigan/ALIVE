'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ProgramItem {
  id: string
  program_code: string
  title: string
  description: string
  icon: string | null
  link: string
  is_published: boolean
  display_order: number
}

const ICON_OPTIONS = [
  'BriefcaseBusiness',
  'CalendarDays',
  'Sparkles',
  'Database',
  'Users',
  'Award',
  'Target'
]

export function ProgramItemsManager() {
  const [items, setItems] = useState<ProgramItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<ProgramItem>>({
    program_code: '',
    title: '',
    description: '',
    icon: 'BriefcaseBusiness',
    link: '',
    is_published: true,
    display_order: 0
  })
  const API_BASE_URL = '/api/admin/content/program_items'

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    setLoading(true)

    try {
      const response = await fetch(API_BASE_URL, { cache: 'no-store' })
      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        console.error('Error loading program items:', error)
        return
      }

      const { data } = await response.json()
      setItems(data || [])
    } catch (error) {
      console.error('Error loading program items:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!formData.program_code || !formData.title || !formData.description || !formData.link) {
      alert('Program code, title, description, and link are required')
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
      console.error('Error saving program item:', error)
      alert(
        `Error ${isExisting ? 'updating' : 'creating'} program item${error?.details ? `: ${error.details}` : ''}`
      )
      return
    }

    setEditingId(null)
    setFormData({
      program_code: '',
      title: '',
      description: '',
      icon: 'BriefcaseBusiness',
      link: '',
      is_published: true,
      display_order: 0
    })
    loadItems()
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this program item?')) return

    const response = await fetch(`${API_BASE_URL}?id=${id}`, { method: 'DELETE' })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      console.error('Error deleting program item:', error)
      alert('Error deleting program item')
      return
    }

    loadItems()
  }

  function handleEdit(item: ProgramItem) {
    setEditingId(item.id)
    setFormData(item)
  }

  function handleCancel() {
    setEditingId(null)
    setFormData({
      program_code: '',
      title: '',
      description: '',
      icon: 'BriefcaseBusiness',
      link: '',
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
          {editingId ? 'Edit Program Item' : 'Add New Program Item'}
        </h3>
        
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Program Code *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.program_code || ''}
              onChange={(e) => setFormData({ ...formData, program_code: e.target.value })}
              placeholder="INFOPROF, SINERGI, CeritaKita, ALIVE"
              disabled={!!editingId} // Can't change code when editing
            />
            <p className="text-xs text-muted-foreground mt-1">
              Unique code for this program (cannot be changed after creation)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Info Karier & Beasiswa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Kurasi peluang kerja, magang, dan beasiswa..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Icon</label>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={formData.icon || 'BriefcaseBusiness'}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            >
              {ICON_OPTIONS.map(icon => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Lucide icon name for the program card
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Link *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.link || ''}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="/karier"
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
        <h3 className="text-lg font-semibold">Existing Program Items</h3>
        
        {items.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            No program items found. Create one above.
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">
                      {item.program_code}
                    </span>
                    <h4 className="font-semibold">{item.title}</h4>
                    {!item.is_published && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {item.icon && <span>Icon: {item.icon}</span>}
                    <span>→ {item.link}</span>
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

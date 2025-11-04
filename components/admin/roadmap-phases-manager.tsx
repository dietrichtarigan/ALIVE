'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface RoadmapPhase {
  id: string
  phase_name: string
  period: string
  title: string
  description: string | null
  status: 'completed' | 'in_progress' | 'planned'
  milestones: string[]
  is_published: boolean
  display_order: number
}

export function RoadmapPhasesManager() {
  const [items, setItems] = useState<RoadmapPhase[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<RoadmapPhase>>({
    phase_name: '',
    period: '',
    title: '',
    description: '',
    status: 'planned',
    milestones: [],
    is_published: true,
    display_order: 0
  })
  const [milestonesText, setMilestonesText] = useState('')
  const API_BASE_URL = '/api/admin/content/roadmap_phases'

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    setLoading(true)

    try {
      const response = await fetch(API_BASE_URL, { cache: 'no-store' })
      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        console.error('Error loading roadmap phases:', error)
        return
      }

      const { data } = await response.json()
      setItems(data || [])
    } catch (error) {
      console.error('Error loading roadmap phases:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!formData.phase_name || !formData.period || !formData.title) {
      alert('Phase name, period, and title are required')
      return
    }

    const milestones = milestonesText
      .split('\n')
      .map(m => m.trim())
      .filter(m => m.length > 0)

    const dataToSave = {
      ...formData,
      milestones
    }

    const isExisting = Boolean(editingId)
    const payload: Record<string, unknown> = {
      ...dataToSave,
      milestones,
    }

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
      console.error('Error saving roadmap phase:', error)
      alert(
        `Error ${isExisting ? 'updating' : 'creating'} roadmap phase${error?.details ? `: ${error.details}` : ''}`
      )
      return
    }

    setEditingId(null)
    setFormData({
      phase_name: '',
      period: '',
      title: '',
      description: '',
      status: 'planned',
      milestones: [],
      is_published: true,
      display_order: 0
    })
    setMilestonesText('')
    loadItems()
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this roadmap phase?')) return

    const response = await fetch(`${API_BASE_URL}?id=${id}`, { method: 'DELETE' })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      console.error('Error deleting roadmap phase:', error)
      alert('Error deleting roadmap phase')
      return
    }

    loadItems()
  }

  function handleEdit(item: RoadmapPhase) {
    setEditingId(item.id)
    setFormData(item)
    setMilestonesText(item.milestones.join('\n'))
  }

  function handleCancel() {
    setEditingId(null)
    setFormData({
      phase_name: '',
      period: '',
      title: '',
      description: '',
      status: 'planned',
      milestones: [],
      is_published: true,
      display_order: 0
    })
    setMilestonesText('')
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  const statusOptions: RoadmapPhase['status'][] = ['planned', 'in_progress', 'completed']

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800',
    planned: 'bg-gray-100 text-gray-800'
  }

  const statusLabels = {
    completed: 'Completed ✓',
    in_progress: 'In Progress ⟳',
    planned: 'Planned ○'
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {editingId ? 'Edit Roadmap Phase' : 'Add New Roadmap Phase'}
        </h3>
        
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phase Name *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.phase_name || ''}
                onChange={(e) => setFormData({ ...formData, phase_name: e.target.value })}
                placeholder="Phase 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Period *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.period || ''}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="Q4 2024 or Jan-Mar 2025"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Foundation & Data Collection"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border rounded-md"
              rows={2}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Membangun infrastruktur dasar dan mengumpulkan data alumni"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status *</label>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={formData.status || 'planned'}
              onChange={(e) => {
                const selectedStatus = statusOptions.find((option) => option === e.target.value)
                if (!selectedStatus) {
                  console.warn('Received unknown roadmap status value:', e.target.value)
                  return
                }

                setFormData({ ...formData, status: selectedStatus })
              }}
            >
              {statusOptions.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusLabels[statusOption]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Milestones (one per line)
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-md font-mono text-sm"
              rows={5}
              value={milestonesText}
              onChange={(e) => setMilestonesText(e.target.value)}
              placeholder="Setup website & admin panel&#10;Migrasi data alumni dari spreadsheet&#10;Launch Instagram @careerhimafi&#10;Publikasi 5 cerita alumni pertama"
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
        <h3 className="text-lg font-semibold">Existing Roadmap Phases</h3>
        
        {items.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            No roadmap phases found. Create one above.
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-semibold">
                      {item.phase_name}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.period}</span>
                    <span className={`text-xs px-2 py-1 rounded ${statusColors[item.status]}`}>
                      {statusLabels[item.status]}
                    </span>
                    {!item.is_published && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Draft
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  )}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Milestones:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      {item.milestones.map((milestone, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{milestone}</span>
                        </li>
                      ))}
                    </ul>
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

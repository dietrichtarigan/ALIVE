import { NextResponse } from 'next/server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createSupabaseServiceClient } from '@/lib/supabase-service-client'
import type { Database } from '@/types/database'

const TABLE_CONFIG = {
  hero_sections: { orderBy: { column: 'position', ascending: true } },
  program_items: { orderBy: { column: 'display_order', ascending: true } },
  spotlight_items: { orderBy: { column: 'display_order', ascending: true } },
  ecosystem_cards: { orderBy: { column: 'display_order', ascending: true } },
  roadmap_phases: { orderBy: { column: 'display_order', ascending: true } },
  cta_blocks: { orderBy: { column: 'display_order', ascending: true } },
  faq_items: { orderBy: { column: 'display_order', ascending: true } },
} as const

type TableKey = keyof typeof TABLE_CONFIG
type TableInsertPayload<T extends TableKey> = Database['public']['Tables'][T]['Insert']
type TableUpdatePayload<T extends TableKey> = Database['public']['Tables'][T]['Update']

const NUMBER_FIELDS: Record<TableKey, string[]> = {
  hero_sections: ['position'],
  program_items: ['display_order'],
  spotlight_items: ['display_order'],
  ecosystem_cards: ['display_order'],
  roadmap_phases: ['display_order'],
  cta_blocks: ['display_order'],
  faq_items: ['display_order'],
}

const BOOLEAN_FIELDS: Partial<Record<TableKey, string[]>> = {
  hero_sections: ['is_published'],
  program_items: ['is_published'],
  spotlight_items: ['is_published'],
  ecosystem_cards: ['is_published'],
  roadmap_phases: ['is_published'],
  cta_blocks: ['is_published'],
  faq_items: ['is_published'],
}

function isAllowedTable(table: string): table is TableKey {
  return Object.hasOwn(TABLE_CONFIG, table)
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function ensureAuthenticated() {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error('Error validating Supabase session:', error)
      return NextResponse.json({ error: 'Failed to validate session' }, { status: 500 })
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return null
  } catch (error) {
    console.error('Error creating Supabase server client:', error)
    return NextResponse.json({ error: 'Failed to validate session' }, { status: 500 })
  }
}

function normalizePayload(table: TableKey, raw: Record<string, unknown>) {
  const payload: Record<string, unknown> = { ...raw }

  delete payload.id
  delete payload.created_at
  delete payload.updated_at

  const numberFields = NUMBER_FIELDS[table] ?? []
  for (const field of numberFields) {
    if (payload[field] !== undefined && payload[field] !== null) {
      const value = payload[field]
      if (typeof value === 'string') {
        const parsed = Number(value)
        payload[field] = Number.isFinite(parsed) ? parsed : 0
      }
    }
  }

  const booleanFields = BOOLEAN_FIELDS[table] ?? []
  for (const field of booleanFields) {
    if (payload[field] !== undefined && payload[field] !== null) {
      const value = payload[field]
      if (typeof value === 'string') {
        payload[field] = ['true', '1', 'yes', 'on'].includes(value.toLowerCase())
      } else {
        payload[field] = Boolean(value)
      }
    }
  }

  if (table === 'faq_items') {
    if (!payload.slug && typeof payload.question === 'string') {
      payload.slug = slugify(payload.question)
    }
  }

  if (table === 'roadmap_phases') {
    if (typeof payload.milestones === 'string') {
      payload.milestones = (payload.milestones as string)
        .split('\n')
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0)
    } else if (Array.isArray(payload.milestones)) {
      payload.milestones = (payload.milestones as unknown[])
        .map((entry) => (typeof entry === 'string' ? entry.trim() : entry))
        .filter((entry): entry is string => typeof entry === 'string' && entry.length > 0)
    }
  }

  return payload
}

function supabaseErrorResponse(
  table: string,
  action: string,
  error: { message: string; hint?: string | null }
) {
  console.error(`Supabase ${action} error on ${table}:`, error)
  return NextResponse.json(
    {
      error: `Failed to ${action} ${table.replace(/_/g, ' ')}`,
      details: error.message,
      hint: error.hint,
    },
    { status: 500 }
  )
}

async function parseJsonBody(req: Request) {
  try {
    const body = await req.json()
    if (!body || typeof body !== 'object') {
      return null
    }

    return body as Record<string, unknown>
  } catch {
    return null
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ table: TableKey }> }) {
  const { table } = await params

  if (!isAllowedTable(table)) {
    return NextResponse.json({ error: 'Unknown table' }, { status: 404 })
  }

  const authResponse = await ensureAuthenticated()
  if (authResponse) return authResponse

  const supabase = createSupabaseServiceClient()
  const searchParams = new URL(req.url).searchParams
  const id = searchParams.get('id')

  try {
    if (id) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) {
        return supabaseErrorResponse(table, 'load', error)
      }

      return NextResponse.json({ data })
    }

    const { column, ascending } = TABLE_CONFIG[table].orderBy
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order(column, { ascending })

    if (error) {
      return supabaseErrorResponse(table, 'load', error)
    }

    return NextResponse.json({ data: data ?? [] })
  } catch (error) {
    console.error(`Unexpected error fetching ${table}:`, error)
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ table: TableKey }> }) {
  const { table } = await params

  if (!isAllowedTable(table)) {
    return NextResponse.json({ error: 'Unknown table' }, { status: 404 })
  }

  const authResponse = await ensureAuthenticated()
  if (authResponse) return authResponse

  const body = await parseJsonBody(req)
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const supabase = createSupabaseServiceClient()
  const payload = normalizePayload(table, body) as TableInsertPayload<typeof table>

  try {
    const { data, error } = await supabase
      .from(table)
      .insert([payload as never])
      .select('*')
      .single()

    if (error) {
      return supabaseErrorResponse(table, 'create', error)
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error(`Unexpected error creating record in ${table}:`, error)
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ table: TableKey }> }) {
  const { table } = await params

  if (!isAllowedTable(table)) {
    return NextResponse.json({ error: 'Unknown table' }, { status: 404 })
  }

  const authResponse = await ensureAuthenticated()
  if (authResponse) return authResponse

  const body = await parseJsonBody(req)
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { id, ...rest } = body
  if (typeof id !== 'string' || id.length === 0) {
    return NextResponse.json({ error: 'Missing record id' }, { status: 400 })
  }

  const payload = normalizePayload(table, rest) as TableUpdatePayload<typeof table>
  const supabase = createSupabaseServiceClient()

  try {
    const { data, error } = await supabase
      .from(table)
      .update(payload as never)
      .eq('id', id)
      .select('*')
      .maybeSingle()

    if (error) {
      return supabaseErrorResponse(table, 'update', error)
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error(`Unexpected error updating record in ${table}:`, error)
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ table: TableKey }> }) {
  const { table } = await params

  if (!isAllowedTable(table)) {
    return NextResponse.json({ error: 'Unknown table' }, { status: 404 })
  }

  const authResponse = await ensureAuthenticated()
  if (authResponse) return authResponse

  const supabase = createSupabaseServiceClient()

  let id = new URL(req.url).searchParams.get('id')

  if (!id) {
    const body = await parseJsonBody(req)
    if (body && typeof body.id === 'string') {
      id = body.id
    }
  }

  if (!id) {
    return NextResponse.json({ error: 'Missing record id' }, { status: 400 })
  }

  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)

    if (error) {
      return supabaseErrorResponse(table, 'delete', error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Unexpected error deleting record in ${table}:`, error)
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 })
  }
}

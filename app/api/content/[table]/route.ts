import { NextResponse } from 'next/server'

import { createSupabaseServerClient } from '@/lib/supabase-server'

type AllowedTable = 'hero_sections' | 'cta_blocks' | 'faq_items' | 'pricing_tiers' | 'feature_items' | 'program_items' | 'spotlight_items' | 'ecosystem_cards' | 'roadmap_phases'

export async function GET(request: Request, { params }: { params: Promise<{ table: AllowedTable }> }) {
  const { table } = await params
  try {
    const supabase = await createSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (slug) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

      if (error) throw error
      return NextResponse.json(data)
    }

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('is_published', true)
      .order('position')

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Public content fetch failed:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

import 'server-only'

import type { JobPosting } from '@/lib/domain/jobs'
import type { AlumniStory } from '@/lib/domain/stories'
import { mapJobRow, mapStoryRow } from '@/lib/supabase/mappers'
import { getSupabaseAnonClient, isSupabaseConfigured } from '@/lib/supabase/server-client'
import type { JobRow, StoryRow } from '@/lib/supabase/types'

interface ProgramRow {
  id: string
  program_code: string
  title: string
  description: string
  icon: string | null
  link: string
  display_order: number
}

interface SpotlightRow {
  id: string
  category: string
  title: string
  description: string
  link: string
  meta: string | null
  cta_text: string | null
  display_order: number
}

interface EcosystemRow {
  id: string
  title: string
  description: string
  display_order: number
}

interface RoadmapRow {
  id: string
  title: string
  period: string
  description: string | null
  status: 'completed' | 'in_progress' | 'planned'
  milestones: string[]
  display_order: number
}

export interface JobListResult {
  jobs: JobPosting[]
  total: number
  fallback: boolean
}

export interface StoryListResult {
  stories: AlumniStory[]
  total: number
  fallback: boolean
}

export interface ProgramListResult {
  programs: ProgramRow[]
  fallback: boolean
}

export interface SpotlightListResult {
  spotlights: SpotlightRow[]
  fallback: boolean
}

export interface EcosystemListResult {
  ecosystems: EcosystemRow[]
  fallback: boolean
}

export interface RoadmapListResult {
  phases: RoadmapRow[]
  fallback: boolean
}

function buildFallbackJobResult(): JobListResult {
  return {
    jobs: [],
    total: 0,
    fallback: true,
  }
}

function buildFallbackStoryResult(): StoryListResult {
  return {
    stories: [],
    total: 0,
    fallback: true,
  }
}

export async function fetchJobList(): Promise<JobListResult> {
  if (!isSupabaseConfigured()) {
    return buildFallbackJobResult()
  }

  const supabase = getSupabaseAnonClient()
  const { data, error, count } = await supabase
    .from('jobs')
    .select('*', { count: 'exact' })
    .order('deadline', { ascending: true })

  if (error) {
    console.error('[fetchJobList] Failed to load jobs:', error)
    return buildFallbackJobResult()
  }

  const rows = (data as JobRow[] | null) ?? []
  return {
    jobs: rows.map(mapJobRow),
    total: typeof count === 'number' ? count : rows.length,
    fallback: false,
  }
}

export async function fetchStoryList(): Promise<StoryListResult> {
  if (!isSupabaseConfigured()) {
    return buildFallbackStoryResult()
  }

  const supabase = getSupabaseAnonClient()
  const { data, error, count } = await supabase
    .from('stories')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[fetchStoryList] Failed to load stories:', error)
    return buildFallbackStoryResult()
  }

  const rows = (data as StoryRow[] | null) ?? []
  return {
    stories: rows.map(mapStoryRow),
    total: typeof count === 'number' ? count : rows.length,
    fallback: false,
  }
}

export async function fetchPrograms(): Promise<ProgramListResult> {
  if (!isSupabaseConfigured()) {
    return { programs: [], fallback: true }
  }

  const supabase = getSupabaseAnonClient()
  const { data, error } = await supabase
    .from('program_items')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('[fetchPrograms] Failed to load program items:', error)
    return { programs: [], fallback: true }
  }

  return { programs: (data as ProgramRow[] | null) ?? [], fallback: false }
}

export async function fetchSpotlights(): Promise<SpotlightListResult> {
  if (!isSupabaseConfigured()) {
    return { spotlights: [], fallback: true }
  }

  const supabase = getSupabaseAnonClient()
  const { data, error } = await supabase
    .from('spotlight_items')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('[fetchSpotlights] Failed to load spotlight items:', error)
    return { spotlights: [], fallback: true }
  }

  return { spotlights: (data as SpotlightRow[] | null) ?? [], fallback: false }
}

export async function fetchEcosystems(): Promise<EcosystemListResult> {
  if (!isSupabaseConfigured()) {
    return { ecosystems: [], fallback: true }
  }

  const supabase = getSupabaseAnonClient()
  const { data, error } = await supabase
    .from('ecosystem_cards')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('[fetchEcosystems] Failed to load ecosystem cards:', error)
    return { ecosystems: [], fallback: true }
  }

  return { ecosystems: (data as EcosystemRow[] | null) ?? [], fallback: false }
}

export async function fetchRoadmap(): Promise<RoadmapListResult> {
  if (!isSupabaseConfigured()) {
    return { phases: [], fallback: true }
  }

  const supabase = getSupabaseAnonClient()
  const { data, error } = await supabase
    .from('roadmap_phases')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('[fetchRoadmap] Failed to load roadmap phases:', error)
    return { phases: [], fallback: true }
  }

  return { phases: (data as RoadmapRow[] | null) ?? [], fallback: false }
}

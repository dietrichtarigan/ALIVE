export interface Database {
  public: {
    Tables: {
      hero_sections: {
        Row: {
          id: string
          slug: string
          title: string
          subtitle: string | null
          cta_primary_text: string | null
          cta_primary_url: string | null
          cta_secondary_text: string | null
          cta_secondary_url: string | null
          background_image: string | null
          is_published: boolean
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          subtitle?: string | null
          cta_primary_text?: string | null
          cta_primary_url?: string | null
          cta_secondary_text?: string | null
          cta_secondary_url?: string | null
          background_image?: string | null
          is_published?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          subtitle?: string | null
          cta_primary_text?: string | null
          cta_primary_url?: string | null
          cta_secondary_text?: string | null
          cta_secondary_url?: string | null
          background_image?: string | null
          is_published?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
      }
      cta_blocks: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          cta_text: string | null
          cta_url: string | null
          is_published: boolean
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          cta_text?: string | null
          cta_url?: string | null
          is_published?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          cta_text?: string | null
          cta_url?: string | null
          is_published?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
      }
      faq_items: {
        Row: {
          id: string
          slug: string
          question: string
          answer: string
          category: string | null
          is_published: boolean
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          question: string
          answer: string
          category?: string | null
          is_published?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          question?: string
          answer?: string
          category?: string | null
          is_published?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
      }
      pricing_tiers: {
        Row: {
          id: string
          slug: string
          name: string
          price: number
          currency: string
          billing_period: string
          description: string | null
          features: Array<string>
          cta_text: string | null
          cta_url: string | null
          is_popular: boolean
          is_published: boolean
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          price: number
          currency?: string
          billing_period?: string
          description?: string | null
          features?: Array<string>
          cta_text?: string | null
          cta_url?: string | null
          is_popular?: boolean
          is_published?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          price?: number
          currency?: string
          billing_period?: string
          description?: string | null
          features?: Array<string>
          cta_text?: string | null
          cta_url?: string | null
          is_popular?: boolean
          is_published?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
      }
      feature_items: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          icon_name: string | null
          image_url: string | null
          category: string | null
          is_published: boolean
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          icon_name?: string | null
          image_url?: string | null
          category?: string | null
          is_published?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          icon_name?: string | null
          image_url?: string | null
          category?: string | null
          is_published?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
      }
      program_items: {
        Row: {
          id: string
          program_code: string
          title: string
          description: string
          icon: string | null
          link: string
          is_published: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          program_code: string
          title: string
          description: string
          icon?: string | null
          link: string
          is_published?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          program_code?: string
          title?: string
          description?: string
          icon?: string | null
          link?: string
          is_published?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      spotlight_items: {
        Row: {
          id: string
          category: string
          title: string
          description: string
          link: string
          meta: string | null
          cta_text: string | null
          is_published: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category: string
          title: string
          description: string
          link: string
          meta?: string | null
          cta_text?: string | null
          is_published?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: string
          title?: string
          description?: string
          link?: string
          meta?: string | null
          cta_text?: string | null
          is_published?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      ecosystem_cards: {
        Row: {
          id: string
          title: string
          description: string
          is_published: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          is_published?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          is_published?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      roadmap_phases: {
        Row: {
          id: string
          phase_name: string
          period: string
          title: string
          description: string | null
          status: 'completed' | 'in_progress' | 'planned'
          milestones: string[]
          is_published: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          phase_name: string
          period: string
          title: string
          description?: string | null
          status?: 'completed' | 'in_progress' | 'planned'
          milestones?: string[]
          is_published?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phase_name?: string
          period?: string
          title?: string
          description?: string | null
          status?: 'completed' | 'in_progress' | 'planned'
          milestones?: string[]
          is_published?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

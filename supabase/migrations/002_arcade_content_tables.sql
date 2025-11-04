-- ARCADE HIMAFI Content Tables
-- This replaces pricing_tiers and feature_items with actual ARCADE content types

-- Drop old tables (if they exist from template)
DROP TABLE IF EXISTS pricing_tiers CASCADE;
DROP TABLE IF EXISTS feature_items CASCADE;

-- Create program_items table (INFOPROF, SINERGI, CeritaKita, ALIVE)
CREATE TABLE program_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_code TEXT NOT NULL UNIQUE, -- 'INFOPROF', 'SINERGI', 'CeritaKita', 'ALIVE'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT, -- lucide icon name: BriefcaseBusiness, CalendarDays, Sparkles, Database
  link TEXT NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create spotlight_items table (Karier, Event, Cerita highlights)
CREATE TABLE spotlight_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('Karier', 'Event', 'Cerita')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  link TEXT NOT NULL,
  meta TEXT, -- organization/date/location info
  cta_text TEXT DEFAULT 'Lihat detail', -- custom CTA button text
  is_published BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ecosystem_cards table (integration & pipeline cards)
CREATE TABLE ecosystem_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create roadmap_phases table (timeline/phases)
CREATE TABLE roadmap_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_name TEXT NOT NULL, -- 'Phase 1', 'Phase 2', etc
  period TEXT NOT NULL, -- 'Q1 2024', 'Jan-Mar 2024', etc
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planned' CHECK (status IN ('completed', 'in_progress', 'planned')),
  milestones TEXT[] DEFAULT '{}', -- array of milestone strings
  is_published BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create triggers for updated_at
CREATE TRIGGER update_program_items_updated_at BEFORE UPDATE ON program_items
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_spotlight_items_updated_at BEFORE UPDATE ON spotlight_items
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_ecosystem_cards_updated_at BEFORE UPDATE ON ecosystem_cards
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_roadmap_phases_updated_at BEFORE UPDATE ON roadmap_phases
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Create indexes
CREATE INDEX idx_program_items_published ON program_items(is_published, display_order);
CREATE INDEX idx_spotlight_items_published ON spotlight_items(is_published, category, display_order);
CREATE INDEX idx_ecosystem_cards_published ON ecosystem_cards(is_published, display_order);
CREATE INDEX idx_roadmap_phases_published ON roadmap_phases(is_published, display_order);

-- Enable Row Level Security
ALTER TABLE program_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE spotlight_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_phases ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public can read published content
CREATE POLICY "Public can read published program items"
  ON program_items FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can read published spotlight items"
  ON spotlight_items FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can read published ecosystem cards"
  ON ecosystem_cards FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can read published roadmap phases"
  ON roadmap_phases FOR SELECT
  USING (is_published = true);

-- RLS Policies: Service role has full access
CREATE POLICY "Service role has full access to program items"
  ON program_items FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to spotlight items"
  ON spotlight_items FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to ecosystem cards"
  ON ecosystem_cards FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to roadmap phases"
  ON roadmap_phases FOR ALL
  USING (auth.role() = 'service_role');

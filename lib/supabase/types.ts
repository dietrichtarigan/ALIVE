export interface JobRow {
  id: string;
  title: string;
  organization: string;
  location: string;
  category: string;
  description: string;
  requirements: string[] | null;
  deadline: string | null;
  contact: string;
  link: string;
  tags: string[] | null;
  highlight: string | null;
  poster_url: string | null;
  poster_path: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoryRow {
  id: string;
  slug: string;
  title: string;
  name: string;
  batch: string;
  role: string;
  company: string;
  location: string;
  summary: string;
  tags: string[] | null;
  quote: string;
  body: string[] | null;
  avatar_color: string | null;
  featured: boolean | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
}

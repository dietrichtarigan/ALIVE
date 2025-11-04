export type StoryTag =
  | "Riset"
  | "Industri"
  | "Akademik"
  | "Teknologi"
  | "Kewirausahaan"
  | "Energi";

export interface AlumniStory {
  id: string;
  slug: string;
  title: string;
  name: string;
  batch: string;
  role: string;
  company: string;
  location: string;
  summary: string;
  tags: StoryTag[];
  quote: string;
  body: string[];
  avatarColor: string;
  featured?: boolean | null;
}

export type JobCategory = "Kerja" | "Magang" | "Beasiswa";

export interface JobPosting {
  id: string;
  title: string;
  organization: string;
  location: string;
  category: JobCategory;
  description: string;
  requirements: string[];
  deadline: string;
  contact: string;
  link: string;
  tags: string[];
  highlight?: string | null;
  posterUrl?: string | null;
  posterPath?: string | null;
}

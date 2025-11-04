import type { JobCategory, JobPosting } from "@/lib/domain/jobs";
import type { AlumniStory, StoryTag } from "@/lib/domain/stories";

import { JobRow, StoryRow } from "./types";

const jobCategories: JobCategory[] = ["Kerja", "Magang", "Beasiswa"];
const storyTags: StoryTag[] = ["Riset", "Industri", "Akademik", "Teknologi", "Kewirausahaan", "Energi"];

function normaliseStringArray(value: string[] | null | undefined) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0);
}

export function mapJobRow(row: JobRow): JobPosting {
  const category = jobCategories.includes(row.category as JobCategory)
    ? (row.category as JobCategory)
    : "Kerja";

  return {
    id: row.id,
    title: row.title,
    organization: row.organization,
    location: row.location,
    category,
    description: row.description,
    requirements: normaliseStringArray(row.requirements),
    deadline: row.deadline ?? "",
    contact: row.contact,
    link: row.link,
    tags: normaliseStringArray(row.tags),
    highlight: row.highlight,
  };
}

function normaliseStoryTags(value: string[] | null | undefined): StoryTag[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
    .filter((tag) => storyTags.includes(tag as StoryTag)) as StoryTag[];
}

export function mapStoryRow(row: StoryRow): AlumniStory {
  const avatarColor = typeof row.avatar_color === "string" && row.avatar_color.trim().length > 0
    ? row.avatar_color
    : "bg-gradient-to-br from-[#1b365d] to-[#4b7bec]";

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    name: row.name,
    batch: row.batch,
    role: row.role,
    company: row.company,
    location: row.location,
    summary: row.summary,
    tags: normaliseStoryTags(row.tags),
    quote: row.quote,
    body: normaliseStringArray(row.body),
    avatarColor,
    featured: Boolean(row.featured),
  };
}

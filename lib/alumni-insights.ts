import alumniRaw from "@/data-alumni.json";

export interface AlumniRecord {
  name: string;
  headline?: string | null;
  location?: string | null;
  connections?: string;
  about?: string;
  experiences?: Array<{
    position?: string | null;
    company?: string | null;
    duration?: string | null;
    location?: string | null;
    description?: string | null;
  }>;
  education?: Array<{
    school?: string | null;
    degree?: string | null;
    field_of_study?: string | null;
    duration?: string | null;
    thesis?: string;
    activities?: string;
    grade?: string;
  }>;
  skills?: string[];
  certifications?: Array<{
    name?: string;
    issuer?: string;
    date?: string;
  }>;
  languages?: string[];
  projects?: Array<{ name?: string; description?: string }>;
  volunteer_experience?: Array<{ position?: string; organization?: string; description?: string }>;
  contact_info?: {
    email?: string;
    phone?: string;
    website?: string;
    linkedin_url?: string;
  };
  last_updated?: string;
  graduation_year?: number | null;
  industry?: string | null;
  current_company?: string | null;
  confidence?: string | null;
  source_batches?: string | null;
  source_url?: string | null;
  merge_key?: string | null;
}

export interface RankedItem {
  name: string;
  count: number;
}

const alumniDataset = (alumniRaw as AlumniRecord[]).filter((item) => Boolean(item?.name));

function cleanValue(value?: string | null) {
  if (!value) return undefined;
  const cleaned = value.replace(/\s+/g, " ").trim();
  return cleaned.length ? cleaned : undefined;
}

function countBy<T>(items: T[], selector: (item: T) => string | undefined) {
  const counts = new Map<string, number>();
  items.forEach((item) => {
    const key = selector(item);
    if (!key) return;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return counts;
}

function sortCounts(counts: Map<string, number>, limit: number) {
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function extractCountry(rawLocation?: string | null) {
  if (!rawLocation) return undefined;
  const parts = rawLocation
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (!parts.length) return undefined;
  return parts[parts.length - 1];
}

function extractCity(rawLocation?: string | null) {
  if (!rawLocation) return undefined;
  const parts = rawLocation
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (!parts.length) return undefined;
  return parts[0];
}

function parseGraduationYear(alumni: AlumniRecord) {
  if (typeof alumni.graduation_year === "number") {
    return String(alumni.graduation_year);
  }
  const duration = cleanValue(alumni.education?.[0]?.duration);
  if (!duration) return undefined;
  const yearMatch = duration.match(/\b(19|20)\d{2}\b/);
  return yearMatch?.[0];
}

function parseEducationLevel(alumni: AlumniRecord) {
  const source = cleanValue(alumni.education?.[0]?.school);
  if (!source) return undefined;
  const value = source.toLowerCase();
  if (value.includes("phd") || value.includes("doctor")) return "Doctoral";
  if (value.includes("master") || value.includes("mba") || value.includes("magister")) return "Master";
  if (value.includes("bachelor") || value.includes("sarjana") || value.includes("undergraduate")) return "Bachelor";
  return "Other";
}

const industryCounts = countBy(alumniDataset, (alumni) => cleanValue(alumni.industry));
const companyCounts = countBy(
  alumniDataset,
  (alumni) => cleanValue(alumni.current_company) ?? cleanValue(alumni.experiences?.[0]?.company),
);
const titleCounts = countBy(alumniDataset, (alumni) => cleanValue(alumni.headline));
const educationCounts = countBy(alumniDataset, (alumni) => cleanValue(alumni.education?.[0]?.school));
const yearCounts = countBy(alumniDataset, (alumni) => parseGraduationYear(alumni));
const confidenceCounts = countBy(alumniDataset, (alumni) => cleanValue(alumni.confidence) ?? "Unknown");
const countryCounts = countBy(alumniDataset, (alumni) => extractCountry(alumni.location));
const cityCounts = countBy(alumniDataset, (alumni) => extractCity(alumni.location));
const degreeCounts = countBy(alumniDataset, (alumni) => parseEducationLevel(alumni));

const withIndustry = alumniDataset.filter((alumni) => Boolean(cleanValue(alumni.industry))).length;
const withLocation = alumniDataset.filter((alumni) => Boolean(cleanValue(alumni.location))).length;
const withTitle = alumniDataset.filter((alumni) => Boolean(cleanValue(alumni.headline))).length;
const withCompany = alumniDataset.filter(
  (alumni) => Boolean(cleanValue(alumni.current_company) ?? cleanValue(alumni.experiences?.[0]?.company)),
).length;

const advancedStudyCount = alumniDataset.filter((alumni) => {
  const school = cleanValue(alumni.education?.[0]?.school)?.toLowerCase() ?? "";
  return school.includes("master") || school.includes("mba") || school.includes("doctor") || school.includes("phd");
}).length;

export const alumniInsights = {
  totalAlumni: alumniDataset.length,
  advancedStudyShare: alumniDataset.length ? Math.round((advancedStudyCount / alumniDataset.length) * 100) : 0,
  dataCoverage: {
    withIndustry,
    withLocation,
    withTitle,
    withCompany,
  },
  topGraduationYears: sortCounts(yearCounts, 10),
  topIndustries: sortCounts(industryCounts, 8),
  topJobFunctions: sortCounts(titleCounts, 8),
  topCompanies: sortCounts(companyCounts, 10),
  topDegrees: sortCounts(degreeCounts, 5),
  topUniversities: sortCounts(educationCounts, 8),
  topCountries: sortCounts(countryCounts, 8),
  topCities: sortCounts(cityCounts, 8),
  confidenceBreakdown: sortCounts(confidenceCounts, 4),
};

export type AlumniInsights = typeof alumniInsights;
export const alumniRecords = alumniDataset;
export const alumniHighlights = {
  countriesRepresented: countryCounts.size,
  citiesRepresented: cityCounts.size,
  industriesRepresented: industryCounts.size,
  yearsRepresented: yearCounts.size,
};

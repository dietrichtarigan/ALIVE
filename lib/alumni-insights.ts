import alumniRaw from "@/data-alumni.json";

export interface AlumniRecord {
  name: string;
  headline?: string;
  location?: string;
  connections?: string;
  about?: string;
  experiences?: Array<{
    position?: string;
    company?: string;
    duration?: string;
    location?: string;
    description?: string;
  }>;
  education?: Array<{
    school?: string;
    degree?: string;
    field_of_study?: string;
    duration?: string;
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
}

export interface RankedItem {
  name: string;
  count: number;
}

const alumniDataset = (alumniRaw as AlumniRecord[]).filter((item) => Boolean(item?.name));

const industryKeywords: Array<{ label: string; keywords: string[] }> = [
  {
    label: "Energy & Manufacturing",
    keywords: ["energy", "petro", "chemical", "smelter", "mining", "metall", "manufact", "plant", "calibration", "pulp", "paper", "gas", "oil"],
  },
  {
    label: "Finance & Banking",
    keywords: ["bank", "treasury", "finance", "trading", "capital", "investment", "exchange", "sekuritas", "financial"],
  },
  {
    label: "Research & Academia",
    keywords: ["research", "lecturer", "assistant", "postdoctoral", "professor", "laboratory", "postdoc", "academy", "scientist", "universit"],
  },
  {
    label: "Technology & Software",
    keywords: ["software", "engineer", "developer", "data", "machine learning", "ai", "iot", "digital", "program", "technology", "it"],
  },
  {
    label: "Consulting & Strategy",
    keywords: ["consult", "strategy", "business development", "advisor", "analyst", "management", "planner"],
  },
  {
    label: "Education & Training",
    keywords: ["teacher", "trainer", "mentor", "education", "academy", "school"],
  },
  {
    label: "Healthcare & Bio",
    keywords: ["health", "medical", "clinic", "biomed", "pharma", "wellness"],
  },
];

const jobFunctionKeywords: Array<{ label: string; keywords: string[] }> = [
  {
    label: "Engineer / Specialist",
    keywords: ["engineer", "engineering", "specialist", "technical", "metallurg", "process", "maintenance", "developer", "scientist"],
  },
  {
    label: "Research & Academia",
    keywords: ["research", "lecturer", "assistant", "postdoctoral", "professor", "academic", "scientist"],
  },
  {
    label: "Product & Project",
    keywords: ["product", "project", "program", "delivery", "implementation", "scrum"],
  },
  {
    label: "Management & Leadership",
    keywords: ["manager", "head", "lead", "chief", "director", "founder", "ceo"],
  },
  {
    label: "Finance & Trading",
    keywords: ["treasury", "trader", "finance", "analyst", "bank"],
  },
  {
    label: "Education & Training",
    keywords: ["teacher", "trainer", "mentor", "instructor", "coach"],
  },
  {
    label: "Data & Analytics",
    keywords: ["data", "analytics", "business intelligence", "bi", "insight", "analyst"],
  },
];

function textBucket(alumni: AlumniRecord) {
  const experienceText = alumni.experiences?.map((exp) => `${exp.position ?? ""} ${exp.company ?? ""}`).join(" ") ?? "";
  return `${alumni.headline ?? ""} ${experienceText}`.toLowerCase();
}

function classifyFromKeywords(alumni: AlumniRecord, dictionary: Array<{ label: string; keywords: string[] }>, fallback = "Lainnya") {
  const bucket = textBucket(alumni);
  for (const entry of dictionary) {
    if (entry.keywords.some((keyword) => bucket.includes(keyword))) {
      return entry.label;
    }
  }
  return fallback;
}

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

function extractCountry(rawLocation?: string) {
  if (!rawLocation) return undefined;
  const parts = rawLocation.split(",").map((part) => part.trim()).filter(Boolean);
  if (!parts.length) return undefined;
  const guess = parts[parts.length - 1];
  return guess.length <= 2 ? undefined : guess;
}

function extractCity(rawLocation?: string) {
  if (!rawLocation) return undefined;
  const parts = rawLocation.split(",").map((part) => part.trim()).filter(Boolean);
  if (!parts.length) return undefined;
  return parts[0];
}

function parseConnections(rawConnections?: string) {
  if (!rawConnections) return undefined;
  const digits = rawConnections.replace(/[^\d]/g, "");
  if (!digits) return undefined;
  const parsed = Number.parseInt(digits, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function parseDegreeLabel(degree?: string) {
  const value = cleanValue(degree)?.toLowerCase();
  if (!value) return undefined;
  if (value.includes("phd") || value.includes("doctor")) return "Doctoral";
  if (value.includes("master") || value.includes("magister") || value.includes("msa")) return "Master";
  if (value.includes("mba")) return "MBA";
  if (value.includes("bachelor") || value.includes("sarjana") || value.includes("b.sc")) return "Bachelor";
  return "Other";
}

function normalizeSkills(alumni: AlumniRecord) {
  return (alumni.skills ?? [])
    .map((skill) => cleanValue(skill)?.replace(/[()]/g, ""))
    .filter((skill): skill is string => Boolean(skill))
    .map((skill) => skill!.toLowerCase());
}

const industryCounts = countBy(alumniDataset, (alumni) => classifyFromKeywords(alumni, industryKeywords));
const jobFunctionCounts = countBy(alumniDataset, (alumni) => classifyFromKeywords(alumni, jobFunctionKeywords));
const companyCounts = countBy(alumniDataset, (alumni) => cleanValue(alumni.experiences?.[0]?.company) ?? cleanValue(alumni.experiences?.find((exp) => exp.company)?.company));
const degreeCounts = countBy(alumniDataset, (alumni) => parseDegreeLabel(alumni.education?.[0]?.degree));
const universityCounts = countBy(alumniDataset, (alumni) => cleanValue(alumni.education?.[0]?.school));
const fieldsCounts = countBy(alumniDataset, (alumni) => cleanValue(alumni.education?.[0]?.field_of_study));
const countryCounts = countBy(alumniDataset, (alumni) => extractCountry(alumni.location) ?? extractCountry(alumni.education?.[0]?.duration));
const cityCounts = countBy(alumniDataset, (alumni) => extractCity(alumni.location));
const skillsCounts = countBy(alumniDataset.flatMap((alumni) => normalizeSkills(alumni)), (skill) => skill);

const advancedDegreeCount = alumniDataset.filter((alumni) =>
  alumni.education?.some((edu) => {
    const degree = cleanValue(edu.degree)?.toLowerCase();
    if (!degree) return false;
    return degree.includes("master") || degree.includes("mba") || degree.includes("magister") || degree.includes("phd") || degree.includes("doctor");
  }),
).length;

const uniqueSkills = skillsCounts.size;

const connectionValues = alumniDataset
  .map((alumni) => parseConnections(alumni.connections))
  .filter((value): value is number => typeof value === "number");

const averageConnections = connectionValues.length
  ? Math.round(connectionValues.reduce((acc, value) => acc + value, 0) / connectionValues.length)
  : undefined;

const leadershipKeywords = ["head", "lead", "manager", "chief", "director", "principal", "vp", "ceo", "founder"];
const leadershipCount = alumniDataset.filter((alumni) => {
  const bucket = textBucket(alumni);
  return leadershipKeywords.some((keyword) => bucket.includes(keyword));
}).length;

const leadershipShare = alumniDataset.length ? Math.round((leadershipCount / alumniDataset.length) * 100) : 0;

const internationalCount = alumniDataset.filter((alumni) => {
  const country = extractCountry(alumni.location);
  if (!country) return false;
  return !/indonesia/i.test(country);
}).length;

const internationalShare = alumniDataset.length ? Math.round((internationalCount / alumniDataset.length) * 100) : 0;

const countriesRepresented = countryCounts.size;

export const alumniInsights = {
  totalAlumni: alumniDataset.length,
  advancedStudyShare: alumniDataset.length ? Math.round((advancedDegreeCount / alumniDataset.length) * 100) : 0,
  topIndustries: sortCounts(industryCounts, 6),
  topJobFunctions: sortCounts(jobFunctionCounts, 6),
  topCompanies: sortCounts(companyCounts, 8),
  topDegrees: sortCounts(degreeCounts, 5),
  topUniversities: sortCounts(universityCounts, 6),
  topFields: sortCounts(fieldsCounts, 6),
  topCountries: sortCounts(countryCounts, 6),
  topCities: sortCounts(cityCounts, 6),
  topSkills: sortCounts(skillsCounts, 12),
  uniqueSkills,
};

export type AlumniInsights = typeof alumniInsights;
export const alumniRecords = alumniDataset;
export const alumniHighlights = {
  leadershipShare,
  internationalShare,
  countriesRepresented,
  averageConnections,
};

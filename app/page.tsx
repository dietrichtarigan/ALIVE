import type { LucideIcon } from "lucide-react";
import { BriefcaseBusiness, CalendarDays, Database, Sparkles } from "lucide-react";

import { HomeEcosystem } from "@/components/site/home/ecosystem";
import { HomeHero } from "@/components/site/home/hero";
import { HomePrograms } from "@/components/site/home/programs";
import { HomeRoadmap } from "@/components/site/home/roadmap";
import type { SpotlightCategory } from "@/components/site/home/spotlight";
import { HomeSpotlight } from "@/components/site/home/spotlight";
import { siteConfig } from "@/config/site";
import { arcadeEvents } from "@/data/events";
import { fetchEcosystems, fetchJobList, fetchPrograms, fetchRoadmap, fetchSpotlights, fetchStoryList } from "@/lib/data/supabase-content";

const deadlineFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const programIconMap: Record<string, LucideIcon> = {
  BriefcaseBusiness,
  CalendarDays,
  Sparkles,
  Database,
};

function resolveProgramIcon(name?: string | null) {
  if (!name) return BriefcaseBusiness;
  return programIconMap[name] ?? BriefcaseBusiness;
}

function formatDeadline(input?: string | null) {
  if (!input) return null;
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return null;
  return deadlineFormatter.format(date);
}

function asSpotlightCategory(value: string): SpotlightCategory {
  if (value === "Event" || value === "Cerita" || value === "Karier") {
    return value;
  }
  return "Karier";
}

export default async function Home() {
  const [jobResult, storyResult, programResult, spotlightResult, ecosystemResult, roadmapResult] = await Promise.all([
    fetchJobList(),
    fetchStoryList(),
    fetchPrograms(),
    fetchSpotlights(),
    fetchEcosystems(),
    fetchRoadmap(),
  ]);

  const heroMetrics = [
    {
      id: "jobs",
      label: "Lowongan & Beasiswa",
      value: String(jobResult.total ?? 0),
      helper: "dikurasi oleh tim INFOPROF",
    },
    {
      id: "stories",
      label: "Cerita Alumni",
      value: String(storyResult.total ?? 0),
      helper: "lintas bidang profesi",
    },
    {
      id: "partners",
      label: "Partner & Komunitas",
      value: String(siteConfig.stats.partnerCompanies ?? 0),
      helper: "aktif berkolaborasi",
    },
    {
      id: "network",
      label: "Jaringan Aktif",
      value: siteConfig.stats.communityMembers ?? "0",
      helper: "massa dan alumni",
    },
  ];

  const programItems = programResult.programs.map((item) => ({
    title: item.title,
    program: item.program_code,
    description: item.description,
    link: item.link ?? "#",
    icon: resolveProgramIcon(item.icon),
  }));

  const ecosystemItems = ecosystemResult.ecosystems
    .sort((a, b) => a.display_order - b.display_order)
    .map((item) => ({
      title: item.title,
      description: item.description,
    }));

    const roadmapPhases = [...roadmapResult.phases]
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((phase) => {
        const status: "done" | "in-progress" | "upcoming" =
          phase.status === "completed" ? "done" : phase.status === "in_progress" ? "in-progress" : "upcoming";

        return {
          title: phase.title,
          focus: phase.description ?? "",
          period: phase.period,
          deliverables: Array.isArray(phase.milestones) ? phase.milestones : [],
          status,
        };
      });

  const spotlightItems = (spotlightResult.spotlights.length > 0
    ? spotlightResult.spotlights
    : jobResult.jobs.slice(0, 3).map((job) => ({
        id: job.id,
        category: "Karier" as const,
        title: job.title,
        description: job.highlight ?? job.description,
        link: "/karier",
        meta: [job.organization, formatDeadline(job.deadline) ? `Batas ${formatDeadline(job.deadline)}` : null]
          .filter(Boolean)
          .join(" · "),
        cta_text: "Lihat detail",
      })))
    .map((item) => ({
      id: item.id,
      category: asSpotlightCategory(item.category),
      title: item.title,
      description: item.description,
      link: item.link ?? "#",
      meta: item.meta ?? "",
      cta: item.cta_text ?? undefined,
    }));

  const heroSpotlight = spotlightItems[0]
    ?? (jobResult.jobs[0]
      ? {
          category: "Karier" as SpotlightCategory,
          title: jobResult.jobs[0].title,
          description: jobResult.jobs[0].highlight ?? jobResult.jobs[0].description,
          meta: [jobResult.jobs[0].organization, formatDeadline(jobResult.jobs[0].deadline) ? `Batas ${formatDeadline(jobResult.jobs[0].deadline)}` : null]
            .filter(Boolean)
            .join(" · "),
          link: "/karier",
          cta: "Lihat detail",
        }
      : {
          category: "Event" as SpotlightCategory,
          title: arcadeEvents[0]?.title ?? "Belum ada sorotan",
          description: arcadeEvents[0]?.description ?? "Tim ARCADE sedang menyiapkan sorotan perdana.",
          meta: arcadeEvents[0]
            ? `${deadlineFormatter.format(new Date(arcadeEvents[0].date))} · ${arcadeEvents[0].location}`
            : "",
          link: arcadeEvents[0]?.registrationLink ?? "#",
          cta: arcadeEvents[0] ? "Lihat agenda" : "Tunggu update",
        });

  return (
    <div className="bg-background">
      <HomeHero metrics={heroMetrics} spotlight={heroSpotlight} />
      <HomePrograms items={programItems} />
      <HomeSpotlight items={spotlightItems} />
      <HomeEcosystem items={ecosystemItems} />
      <HomeRoadmap phases={roadmapPhases} />
    </div>
  );
}

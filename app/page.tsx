import { BriefcaseBusiness, CalendarDays, Database, Sparkles } from "lucide-react";

import { HomeEcosystem } from "@/components/site/home/ecosystem";
import { HomeHero } from "@/components/site/home/hero";
import { HomePrograms } from "@/components/site/home/programs";
import { HomeRoadmap } from "@/components/site/home/roadmap";
import { HomeSpotlight } from "@/components/site/home/spotlight";
import { siteConfig } from "@/config/site";
import { arcadeEvents } from "@/data/events";
import { jobPostings } from "@/data/jobs";
import { roadmapPhases } from "@/data/roadmap";
import { alumniStories } from "@/data/stories";

const deadlineFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const highlightItems = [
  {
    id: jobPostings[0].id,
    category: "Karier" as const,
    title: jobPostings[0].title,
    description: jobPostings[0].highlight ?? jobPostings[0].description,
    link: "/karier",
    meta: `${jobPostings[0].organization} · Batas ${deadlineFormatter.format(new Date(jobPostings[0].deadline))}`,
    cta: "Lihat di INFOPROF",
  },
  {
    id: arcadeEvents[0].id,
    category: "Event" as const,
    title: arcadeEvents[0].title,
    description: arcadeEvents[0].description,
    link: "/events",
    meta: `${deadlineFormatter.format(new Date(arcadeEvents[0].date))} · ${arcadeEvents[0].location}`,
    cta: "Lihat agenda",
  },
  {
    id: alumniStories[0].id,
    category: "Cerita" as const,
    title: alumniStories[0].title,
    description: alumniStories[0].summary,
    link: `/cerita/${alumniStories[0].slug}`,
    meta: `${alumniStories[0].name} · ${alumniStories[0].role}`,
    cta: "Baca kisahnya",
  },
];

const pillars = [
  {
    title: "Info Karier & Beasiswa",
    program: "INFOPROF",
    description:
      "Kurasi peluang kerja, magang, dan beasiswa yang relevan bagi massa HIMAFI dengan catatan deadline dan kontak mentor.",
    icon: BriefcaseBusiness,
    link: "/karier",
  },
  {
    title: "Event & Forum Alumni",
    program: "SINERGI",
    description:
      "Talkshow, company visit, dan forum diskusi untuk mempertemukan alumni lintas industri dengan mahasiswa.",
    icon: CalendarDays,
    link: "/events",
  },
  {
    title: "Cerita Alumni",
    program: "CeritaKita",
    description:
      "Artikel narasi dan newsletter yang merekam perjalanan alumni HIMAFI di berbagai bidang profesi.",
    icon: Sparkles,
    link: "/cerita",
  },
  {
    title: "Database Alumni",
    program: "ALIVE",
    description:
      "Portal LivingLink untuk memetakan sebaran alumni, bidang kerja, dan membuka jalur mentoring berkelanjutan.",
    icon: Database,
    link: "/alumni",
  },
];

const ecosystemCards = [
  {
    title: "Integrasi Media Sosial",
    description:
      "Sinkron konten CeritaKita dan highlight event ke Instagram @careerhimafi agar informasi selalu sampai ke massa.",
  },
  {
    title: "Pipeline Data Alumni",
    description:
      "Kolaborasi Google Form, Spreadsheet, dan rencana migrasi ke database MySQL untuk LivingLink.",
  },
  {
    title: "Notifikasi & Newsletter",
    description:
      "Rencana automasi email bulanan yang merangkum peluang karier dan cerita alumni terbaru.",
  },
];

export default function Home() {
  const heroMetrics = [
    {
      id: "jobs",
      label: "Lowongan & Beasiswa",
      value: String(siteConfig.stats.careerPosts),
      helper: "dikurasi oleh tim INFOPROF",
    },
    {
      id: "stories",
      label: "Cerita Alumni",
      value: String(siteConfig.stats.alumniStories),
      helper: "lintas bidang profesi",
    },
    {
      id: "partners",
      label: "Partner & Komunitas",
      value: String(siteConfig.stats.partnerCompanies),
      helper: "aktif berkolaborasi",
    },
    {
      id: "network",
      label: "Jaringan Aktif",
      value: siteConfig.stats.communityMembers,
      helper: "massa dan alumni",
    },
  ];

  return (
    <div className="bg-background">
      <HomeHero metrics={heroMetrics} spotlight={highlightItems[0]} />
      <HomePrograms items={pillars} />
      <HomeSpotlight items={highlightItems} />
      <HomeEcosystem items={ecosystemCards} />
      <HomeRoadmap phases={roadmapPhases} />
    </div>
  );
}

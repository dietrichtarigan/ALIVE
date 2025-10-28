import {
  ArrowRight,
  BarChart3,
  Compass,
  Globe2,
  Layers3,
  LineChart,
  Network,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import {
  alumniHighlights,
  alumniInsights,
  alumniRecords,
  type RankedItem,
} from "@/lib/alumni-insights";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Database Alumni - ARCADE HIMAFI",
  description:
    "Dashboard dan data lake alumni Fisika ITB untuk memetakan karier, studi lanjut, skill, dan lokasi. Fondasi untuk Career Planner AI HIMAFI.",
};

const listAccentClasses = [
  "bg-gradient-to-br from-primary/20 via-primary/10 to-primary/0",
  "bg-gradient-to-br from-emerald-200/30 via-emerald-100/20 to-transparent",
  "bg-gradient-to-br from-blue-200/30 via-blue-100/20 to-transparent",
  "bg-gradient-to-br from-orange-200/30 via-orange-100/20 to-transparent",
  "bg-gradient-to-br from-purple-200/30 via-purple-100/20 to-transparent",
  "bg-gradient-to-br from-rose-200/30 via-rose-100/20 to-transparent",
];

function toTitleCase(value: string) {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function asPercent(count: number) {
  if (!alumniInsights.totalAlumni) return 0;
  return Math.round((count / alumniInsights.totalAlumni) * 100);
}

function RankedList({
  title,
  items,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  items: RankedItem[];
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "rounded-3xl border border-slate-200/70 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.35)]",
        className,
      )}
    >
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl font-semibold text-slate-900">{title}</CardTitle>
        {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={`${item.name}-${index}`}
              className={cn(
                "flex items-center justify-between rounded-2xl border border-border/30 px-4 py-3 text-sm text-slate-700",
                listAccentClasses[index % listAccentClasses.length],
              )}
            >
              <span className="font-medium text-slate-800">{item.name}</span>
              <span className="text-xs uppercase tracking-[0.25em] text-slate-500">
                {item.count} | {asPercent(item.count)}%
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function AlumniDatabasePage() {
  const topIndustries = alumniInsights.topIndustries;
  const topFunctions = alumniInsights.topJobFunctions;
  const topCompanies = alumniInsights.topCompanies;
  const topDegrees = alumniInsights.topDegrees.filter((item) => item.name !== "Other");
  const topUniversities = alumniInsights.topUniversities;
  const topFields = alumniInsights.topFields.filter((item) => item.name && item.name !== "None");
  const topCountries = alumniInsights.topCountries;
  const topCities = alumniInsights.topCities;
  const topSkills = alumniInsights.topSkills.map((item) => ({
    ...item,
    name: toTitleCase(item.name),
  }));
  const formatNumber = (value: number) => new Intl.NumberFormat("id-ID").format(value);

  const highlightMetrics = [
    {
      label: "Leadership Presence",
      value: `${alumniHighlights.leadershipShare}%`,
      description: "Alumni duduk di posisi head, lead, manager, atau C-level.",
      icon: Network,
    },
    {
      label: "Global Mobility",
      value: `${alumniHighlights.internationalShare}%`,
      description: "Berkarier di luar Indonesia, membuka peluang koneksi internasional.",
      icon: Globe2,
    },
    {
      label: "Professional Reach",
      value: alumniHighlights.averageConnections ? `${formatNumber(alumniHighlights.averageConnections)}+` : "-",
      description: "Rata-rata jejaring LinkedIn tiap alumni sebagai kanal rekrutmen.",
      icon: LineChart,
    },
    {
      label: "Countries Represented",
      value: formatNumber(alumniHighlights.countriesRepresented),
      description: "Negara tujuan alumni yang dapat diaktifkan untuk program global.",
      icon: Compass,
    },
    {
      label: "Leading Industry",
      value: topIndustries[0]?.name ?? "-",
      description: `${topIndustries[0]?.count ?? 0} profil dominan dalam pipeline karier.`,
      icon: Layers3,
    },
    {
      label: "Signature Skill",
      value: topSkills[0]?.name ?? "-",
      description: `${topSkills[0]?.count ?? 0} alumni menyebut skill ini di profil mereka.`,
      icon: Target,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50">
      <Section className="relative overflow-hidden bg-gradient-to-br from-white via-primary/5 to-white px-6 pb-28 pt-24 sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/30 blur-[150px]" />
        <div className="relative mx-auto max-w-6xl space-y-12">
          <div className="space-y-8">
            <Badge
              variant="outline"
              className="w-fit rounded-full border-primary/30 bg-primary/10 px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary shadow"
            >
              Database Alumni HIMAFI
            </Badge>
            <div className="space-y-5">
              <h1 className="text-[3rem] font-semibold tracking-tight text-slate-950 sm:text-[3.5rem]">
                Satu data emas untuk memahami karier alumni Fisika ITB
              </h1>
              <p className="max-w-3xl text-[18px] leading-[1.75] text-slate-600">
                Dataset semi-terstruktur hasil scraping LinkedIn alumni Fisika ITB yang siap diolah menjadi dashboard interaktif dan fondasi
                <span className="font-semibold text-slate-800"> HIMAFI Career Planner AI</span>. Semua insight terhubung ke JSON sehingga mudah di-update otomatis.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="rounded-full px-7">
                <Link href="#overview">
                  Jelajahi Insight
                  <ArrowRight className="ml-2 size-4" aria-hidden />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full px-7">
                <Link href="#roadmap">Roadmap Dashboard</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" id="overview">
            <Card className="rounded-3xl border border-slate-200/60 bg-white/90 shadow-[0_16px_45px_-28px_rgba(15,23,42,0.4)]">
              <CardContent className="space-y-3 p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Network className="size-5" aria-hidden />
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Total alumni</p>
                <p className="text-[32px] font-semibold text-slate-900">{alumniInsights.totalAlumni}</p>
                <p className="text-sm text-slate-600">Profil profesional yang siap dipetakan dalam dashboard interaktif.</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border border-slate-200/60 bg-white/90 shadow-[0_16px_45px_-28px_rgba(15,23,42,0.4)]">
              <CardContent className="space-y-3 p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <TrendingUp className="size-5" aria-hidden />
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Studi lanjut</p>
                <p className="text-[32px] font-semibold text-slate-900">{alumniInsights.advancedStudyShare}%</p>
                <p className="text-sm text-slate-600">Alumni yang menempuh Master, MBA, atau PhD menjadi insight penting untuk program coaching.</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border border-slate-200/60 bg-white/90 shadow-[0_16px_45px_-28px_rgba(15,23,42,0.4)]">
              <CardContent className="space-y-3 p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <Globe2 className="size-5" aria-hidden />
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Sebaran global</p>
                <p className="text-[32px] font-semibold text-slate-900">{alumniInsights.topCountries.length} negara</p>
                <p className="text-sm text-slate-600">Top lokasi: {topCountries.slice(0, 3).map((country) => country.name).join(", ")}.</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border border-slate-200/60 bg-white/90 shadow-[0_16px_45px_-28px_rgba(15,23,42,0.4)]">
              <CardContent className="space-y-3 p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                  <BarChart3 className="size-5" aria-hidden />
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Katalog skill</p>
                <p className="text-[32px] font-semibold text-slate-900">{alumniInsights.uniqueSkills}</p>
                <p className="text-sm text-slate-600">Skill unik yang bisa dipetakan ke kurikulum pengembangan mahasiswa.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-8">
          <div className="space-y-3">
            <h2 className="text-[2.2rem] font-semibold tracking-tight text-slate-950">Insight Pulse</h2>
            <p className="max-w-3xl text-[16px] leading-[1.75] text-slate-600">
              Snapshot singkat yang membantu tim HIMAFI memprioritaskan program mentoring, ekspansi global, dan aktivasi alumni.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {highlightMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Card
                  key={metric.label}
                  className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-slate-50 via-white to-white shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)]"
                >
                  <CardContent className="space-y-3 p-6">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-slate-500">{metric.label}</p>
                    <p className="text-[28px] font-semibold text-slate-900">{metric.value}</p>
                    <p className="text-sm text-slate-600">{metric.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </Section>

      <Section className="bg-gradient-to-b from-white to-muted/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 sm:px-8">
          <div className="space-y-4">
            <h2 className="text-[2.4rem] font-semibold tracking-tight text-slate-950">Career Overview</h2>
            <p className="max-w-3xl text-[16px] leading-[1.75] text-slate-600">
              Pemecahan kategori industri, fungsi pekerjaan, dan perusahaan favorit menjadi fondasi dashboard karier interaktif.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <RankedList title="Top Industries" subtitle="Berbasis headline dan riwayat kerja" items={topIndustries} />
            <RankedList title="Job Function" subtitle="Fungsi pekerjaan paling umum" items={topFunctions} />
            <RankedList title="Top Companies" subtitle="Perusahaan terbanyak menyerap alumni" items={topCompanies.slice(0, 10)} />
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 sm:px-8">
          <div className="space-y-4">
            <h2 className="text-[2.4rem] font-semibold tracking-tight text-slate-950">Education and Academic Path</h2>
            <p className="max-w-3xl text-[16px] leading-[1.75] text-slate-600">
              Jalur studi lanjut membantu tim akademik dan alumni merancang mentoring, beasiswa, serta kolaborasi riset.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <RankedList title="Degree Breakdown" items={topDegrees} />
            <RankedList title="Top Universities" subtitle="Kampus tujuan utama" items={topUniversities} />
            <RankedList title="Fields of Study" subtitle="Bidang yang dipilih setelah Fisika" items={topFields} />
          </div>
        </div>
      </Section>

      <Section className="bg-gradient-to-b from-white via-muted/40 to-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 sm:px-8">
          <div className="space-y-4">
            <h2 className="text-[2.4rem] font-semibold tracking-tight text-slate-950">Geographic and Skills Insight</h2>
            <p className="max-w-3xl text-[16px] leading-[1.75] text-slate-600">
              Insight lokasi dan skill membuka peluang kolaborasi global serta menyorot kompetensi unggulan alumni HIMAFI.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-6 sm:grid-cols-2">
              <RankedList title="Top Countries" items={topCountries} />
              <RankedList title="Top Cities" items={topCities} />
            </div>
            <RankedList title="Most Mentioned Skills" subtitle="Tokenisasi dari kolom skills LinkedIn" items={topSkills} />
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-8">
          <div className="space-y-3">
            <h2 className="text-[2.3rem] font-semibold tracking-tight text-slate-950">Opportunity Signals</h2>
            <p className="max-w-3xl text-[16px] leading-[1.75] text-slate-600">
              Kombinasi data industri, skill, dan lokasi membantu menentukan program prioritas untuk Career Planner AI HIMAFI.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-blue-100/30 via-white to-white">
              <CardHeader className="space-y-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <Layers3 className="size-5" aria-hidden />
                </span>
                <CardTitle className="text-lg font-semibold text-slate-900">Industry x Skill Match</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <p>
                  {topIndustries.slice(0, 3).map((industry) => industry.name).join(", ")} menjadi jalur utama. Skill terkuat yang mendukungnya ialah {topSkills
                    .slice(0, 3)
                    .map((skill) => skill.name)
                    .join(", ")}
                  .
                </p>
                <p>
                  Gunakan kombinasi ini untuk kurasi kelas Microcredential dan kurikulum Laboratorium HIMAFI.
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-emerald-100/30 via-white to-white">
              <CardHeader className="space-y-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Globe2 className="size-5" aria-hidden />
                </span>
                <CardTitle className="text-lg font-semibold text-slate-900">Global Chapter Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <p>
                  Dengan {alumniHighlights.internationalShare}% alumni di luar negeri dan jaringan yang tersebar di {alumniHighlights.countriesRepresented} negara,
                  fokuskan chapter komunitas di {topCountries.slice(0, 3).map((country) => country.name).join(", ")} sebagai hub mentoring lintas zona waktu.
                </p>
                <p>Aktifkan sesi virtual bulanan yang mengundang alumni global sharing best practice.</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-amber-100/30 via-white to-white">
              <CardHeader className="space-y-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                  <TrendingUp className="size-5" aria-hidden />
                </span>
                <CardTitle className="text-lg font-semibold text-slate-900">Mentoring Pipeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <p>
                  {alumniHighlights.leadershipShare}% alumni memegang posisi strategis. Padukan dengan {alumniInsights.advancedStudyShare}% yang menempuh studi lanjut
                  untuk merancang mentorship lintasan karier akademik dan industrial.
                </p>
                <p>Prioritaskan pairing mahasiswa tingkat akhir dengan alumni berheadline leadership untuk simulasi wawancara dan project coaching.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      <Section id="roadmap" className="bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-8">
          <div className="space-y-4">
            <h2 className="text-[2.4rem] font-semibold tracking-tight text-slate-950">Roadmap Dashboard dan Career Planner AI</h2>
            <p className="max-w-3xl text-[16px] leading-[1.75] text-slate-600">
              Garis besar pengembangan agar data LinkedIn ini berubah menjadi produk insight lengkap, dari pipeline hingga rekomendasi karier cerdas.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-primary/10 via-white to-white p-6">
              <CardHeader className="space-y-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Sparkles className="size-5" aria-hidden />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-900">Phase 1 - Data Pipeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <ul className="list-disc space-y-2 pl-5 text-left">
                  <li>Normalisasi JSON ke DataFrame (pandas atau DuckDB) dengan deduplikasi dan cleaning teks.</li>
                  <li>Klasifikasi industri, fungsi, dan lokasi berdasarkan kamus keyword.</li>
                  <li>Pseudonimisasi nama menjadi ID agar aman saat dibagikan.</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-emerald-100/30 via-white to-white p-6">
              <CardHeader className="space-y-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Globe2 className="size-5" aria-hidden />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-900">Phase 2 - Interactive Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <ul className="list-disc space-y-2 pl-5 text-left">
                  <li>Bangun dashboard di Streamlit, Power BI, atau Next.js + Chart.js dengan autentikasi.</li>
                  <li>Visualisasi utama: treemap industri, stacked bar fungsi kerja, heatmap lokasi, dan word cloud skill.</li>
                  <li>Filter angkatan, minat, pendidikan, serta ekspor CSV untuk laporan.</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-purple-100/30 via-white to-white p-6">
              <CardHeader className="space-y-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                  <Network className="size-5" aria-hidden />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-900">Phase 3 - AI Career Recommender</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <ul className="list-disc space-y-2 pl-5 text-left">
                  <li>Gunakan sentence-transformers atau TF-IDF untuk menghitung similarity profil karier.</li>
                  <li>Mahasiswa input minat, sistem menampilkan alumni yang relevan beserta perjalanan kariernya.</li>
                  <li>Integrasi ke microsite HIMAFI Career Planner dengan modul mentoring dan kontak alumni.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      <Section className="bg-gradient-to-b from-white via-muted/30 to-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-8">
          <div className="space-y-3">
            <h2 className="text-[2.3rem] font-semibold tracking-tight text-slate-950">Alumni Directory</h2>
            <p className="max-w-3xl text-[16px] leading-[1.75] text-slate-600">
              Semua entri database dapat ditelusuri pada tabel berikut. Data ini menjadi sumber tunggal untuk kebutuhan analitik dan aktivasi komunitas.
            </p>
          </div>
          <Card className="rounded-3xl border border-slate-200/70 bg-white shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)]">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg font-semibold text-slate-900">Snapshot Profil Alumni</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="max-h-[460px] overflow-auto rounded-2xl border border-slate-200/60">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    <tr>
                      <th scope="col" className="px-6 py-4">Name</th>
                      <th scope="col" className="px-6 py-4">Headline</th>
                      <th scope="col" className="px-6 py-4">Location</th>
                      <th scope="col" className="px-6 py-4">Company</th>
                      <th scope="col" className="px-6 py-4">Connections</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white/50">
                    {alumniRecords.map((alumni) => {
                      const primaryExperience = alumni.experiences?.[0];
                      return (
                        <tr key={`${alumni.name}-${primaryExperience?.company ?? "na"}`} className="hover:bg-slate-50">
                          <td className="px-6 py-3 font-medium text-slate-900">{alumni.name}</td>
                          <td className="px-6 py-3 text-slate-600">{alumni.headline ?? "-"}</td>
                          <td className="px-6 py-3 text-slate-600">{alumni.location ?? "-"}</td>
                          <td className="px-6 py-3 text-slate-600">{primaryExperience?.company ?? "-"}</td>
                          <td className="px-6 py-3 text-slate-600">{alumni.connections ?? "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <h2 className="text-[2.3rem] font-semibold tracking-tight">Siap disambungkan ke portal HIMAFI</h2>
            <p className="text-[16px] leading-[1.75] text-slate-200">
              Publikasikan versi ringkas di situs ARCADE, akses penuh di dashboard internal, dan jadikan data ini pondasi Career Planner AI.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link href="mailto:arcade@himafi.itb">Kolaborasi Pengembangan</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full border-white/40 px-8 text-white hover:bg-white/10" asChild>
              <Link href="/">Kembali ke beranda</Link>
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}



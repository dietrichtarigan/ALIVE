import {
  BriefcaseBusiness,
  Handshake,
  Layers,
  LucideIcon,
  Megaphone,
  ShieldCheck,
  Users2,
  UsersRound,
} from "lucide-react";
import { Metadata } from "next";

import CareerBoard from "@/components/site/career-board";
import { JobForm } from "@/components/site/forms/job-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { fetchJobList, fetchStoryList } from "@/lib/data/supabase-content";

export const metadata: Metadata = {
  title: "Info Karier — ARCADE HIMAFI",
  description:
    "Platform terpercaya untuk menemukan peluang karier, magang, dan beasiswa yang dikurasi khusus untuk fisikawan HIMAFI. Dari mahasiswa untuk alumni, dan sebaliknya.",
};

interface KurasiStep {
  title: string;
  description: string;
  icon: LucideIcon;
}

const kurasiSteps: KurasiStep[] = [
  {
    title: "Kurasi & Validasi",
    description:
      "Setiap info diverifikasi oleh tim INFOPROF bersama mentor alumni. Kami memastikan kontak dan deadline valid sebelum dipublikasikan.",
    icon: ShieldCheck,
  },
  {
    title: "Pendampingan",
    description:
      "Mentor alumni siap memberikan review CV atau wawancara simulasi untuk posisi tertentu melalui LivingLink Mentorship.",
    icon: Users2,
  },
  {
    title: "Berbagi Info",
    description:
      "Punya peluang baru? Kirim melalui formulir dan tim kami akan hubungi dalam 1x24 jam untuk konfirmasi.",
    icon: Megaphone,
  },
];

export default async function InfoKarierPage() {
  const [jobResult, storyResult] = await Promise.all([fetchJobList(), fetchStoryList()]);

  const highlightStats: Array<{ label: string; value: string; body: string; icon: LucideIcon }> = [
    {
      label: "Lowongan aktif",
      value: String(jobResult.total ?? 0),
      body: "Dikurasi dan diperbarui setiap pekan oleh tim INFOPROF.",
      icon: BriefcaseBusiness,
    },
    {
      label: "Partner & komunitas",
      value: String(siteConfig.stats.partnerCompanies ?? 0),
      body: "Organisasi yang aktif berkolaborasi dengan HIMAFI.",
      icon: Handshake,
    },
    {
      label: "Cerita alumni",
      value: String(storyResult.total ?? 0),
      body: "Lintas profesi yang aktif berbagi pengalaman karier.",
      icon: Layers,
    },
    {
      label: "Jaringan aktif",
      value: siteConfig.stats.communityMembers ?? "0",
      body: "Massa dan alumni yang terhubung dalam kanal komunitas.",
      icon: UsersRound,
    },
  ];
  const showFallbackNotice = jobResult.fallback || storyResult.fallback;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/40">
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/30 to-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(ellipse_at_top,theme(colors.primary/12),transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-8 pb-40 pt-32 sm:px-12 lg:px-16">
          <div className="mx-auto flex max-w-6xl flex-col gap-16">
            <div className="space-y-12">
              <Badge
                variant="outline"
                className="w-fit rounded-full border-primary/40 bg-primary/8 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary shadow-sm"
              >
                ARCADE HIMAFI
              </Badge>
              <div className="space-y-8">
                <h1 className="max-w-4xl text-[3.25rem] font-bold leading-[1.15] tracking-tight text-slate-950 sm:text-[3.75rem]">
                  Connecting Physicists,<br />Building Careers
                </h1>
                <p className="max-w-2xl text-[19px] leading-[1.8] text-slate-600">
                  Ekosistem karier HIMAFI untuk menjembatani mahasiswa, alumni, dan mitra industri. Kurasi peluang, mentoring, dan data alumni dalam satu
                  portal.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="h-12 rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30">
                  Lihat Info Karier
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-12 rounded-full border-slate-300 bg-white px-8 text-base font-semibold text-slate-700 shadow-sm hover:border-slate-400 hover:bg-slate-50"
                >
                  Baca Cerita Alumni
                </Button>
                <Button 
                  size="lg" 
                  variant="ghost" 
                  className="h-12 rounded-full px-8 text-base font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Kirim Info Terbaru
                </Button>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {highlightStats.map((item) => (
                <Card
                  key={item.label}
                  className="group rounded-[28px] border border-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)]"
                >
                  <CardContent className="p-8">
                    <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary transition-transform duration-300 group-hover:scale-110">
                      <item.icon className="h-6 w-6" strokeWidth={2.25} aria-hidden />
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                      <p className="text-[36px] font-bold leading-none text-slate-950">{item.value}</p>
                      <p className="text-[15px] leading-[1.6] text-slate-600">{item.body}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 text-[15px] leading-[1.7] text-slate-700 shadow-sm">
              <p className="font-medium">
                Kami melakukan kalibrasi data tiap pekan: info yang belum lolos validasi akan ditandai dan tidak ditampilkan. Jika backend ARCADE sedang
                maintenance, formulir tetap menampung data sementara dan tim akan menghubungi Anda secara manual.
              </p>
            </div>
          </div>
          {showFallbackNotice ? (
            <div className="rounded-[28px] border border-dashed border-primary/50 bg-primary/10 p-6 text-sm text-primary">
              Supabase belum terhubung atau tidak ada data tersimpan. Tambahkan info melalui dashboard admin untuk menampilkan peluang terbaru di halaman publik.
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-32 sm:px-8 lg:px-12">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-12">
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <h2 className="text-[2rem] font-bold tracking-tight text-slate-950 sm:text-[2.25rem]">Peluang terbaru</h2>
              <p className="text-[15px] text-slate-600">Filter kategori untuk melihat info yang paling relevan buat kamu.</p>
            </div>
            <div className="flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span>Ditinjau manual sebelum tayang</span>
            </div>
          </div>
          <CareerBoard jobs={jobResult.jobs} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-32 sm:px-8 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-10">
            <div className="space-y-5">
              <h2 className="text-[2rem] font-bold text-slate-950 sm:text-[2.25rem]">Bagaimana kami mengkurasi info?</h2>
              <p className="text-[16px] leading-[1.75] text-slate-600">
                Setiap peluang melewati proses pemeriksaan singkat agar komunitas HIMAFI menerima informasi yang valid dan siap eksekusi. Kami juga
                menandai peluang yang membutuhkan pendampingan tambahan sebelum dikirim ke kanal publik.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {kurasiSteps.map((step) => (
                <Card
                  key={step.title}
                  className="group h-full rounded-[28px] border border-slate-200 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-300 hover:border-slate-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)]"
                >
                  <CardContent className="flex h-full flex-col gap-5 p-8">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary transition-transform duration-300 group-hover:scale-110">
                      <step.icon className="h-5 w-5" strokeWidth={2.25} aria-hidden />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-[18px] font-bold text-slate-950">{step.title}</h3>
                      <p className="text-[15px] leading-[1.65] text-slate-600">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <Card className="rounded-[28px] border border-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <CardHeader className="space-y-4 p-8 pb-6">
                <CardTitle className="text-[22px] font-bold text-slate-950">Checklist sebelum mengirim info</CardTitle>
                <CardDescription className="text-[15px] leading-[1.65] text-slate-600">
                  Siapkan detail utama agar tim bisa memverifikasi dengan cepat dan menayangkan peluang dalam 24 jam kerja.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 px-8 pb-8 text-[15px] text-slate-600">
                <ul className="space-y-3 text-left">
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span>Pastikan tautan pendaftaran dan kontak PIC dapat diakses publik.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span>Sertakan benefit atau catatan tambahan jika peluang berasal dari alumni HIMAFI.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span>Gunakan highlight singkat untuk menonjolkan hal unik dari peluang ini.</span>
                  </li>
                </ul>
                <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Kalibrasi manual oleh tim INFOPROF</p>
                </div>
              </CardContent>
            </Card>
            <div className="rounded-[28px] border border-primary/30 bg-gradient-to-br from-primary/8 to-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <JobForm variant="public" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { jobPostings } from "@/data/jobs";
import { alumniStories } from "@/data/stories";
import { backendClient } from "@/lib/backend";

function extractCount(data: unknown): number | null {
  if (Array.isArray(data)) {
    return data.length;
  }

  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;

  if (Array.isArray(record.data)) {
    return record.data.length;
  }

  if (typeof record.total === "number") {
    return record.total;
  }

  if (typeof record.count === "number") {
    return record.count;
  }

  return null;
}

export function AdminDashboard() {
  const [jobCount, setJobCount] = useState<number | null>(null);
  const [storyCount, setStoryCount] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!backendClient.isConfigured()) {
        if (!isMounted) {
          return;
        }
  setStatusMessage("Supabase belum dikonfigurasi. Menampilkan data dummy untuk pengembangan.");
        setJobCount(jobPostings.length);
        setStoryCount(alumniStories.length);
        return;
      }

      try {
        const [jobs, stories] = await Promise.all([
          backendClient.jobs.list(),
          backendClient.stories.list(),
        ]);

        if (!isMounted) {
          return;
        }

        setJobCount(extractCount(jobs.data));
        setStoryCount(extractCount(stories.data));
        setStatusMessage(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setStatusMessage((error as Error).message || "Gagal memuat ringkasan dari backend.");
        setJobCount(null);
        setStoryCount(null);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const metrics = [
    {
      label: "Info Karier Aktif",
      value: jobCount ?? siteConfig.stats.careerPosts,
      detail: "Peluang kerja, magang, dan beasiswa yang tersedia",
      href: "/admin/jobs",
    },
    {
      label: "Cerita Alumni",
      value: storyCount ?? siteConfig.stats.alumniStories,
      detail: "Naskah CeritaKita yang siap diterbitkan",
      href: "/admin/stories",
    },
    {
      label: "Anggota Komunitas",
      value: siteConfig.stats.communityMembers,
      detail: "Estimasi jaringan aktif ARCADE",
      href: "/tentang",
    },
  ];

  return (
    <div className="space-y-6">
      {statusMessage && (
        <div className="rounded-lg border border-dashed border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">
          {statusMessage}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-border/40 bg-background/95">
            <CardHeader>
              <CardTitle className="text-lg">{metric.label}</CardTitle>
              <CardDescription>{metric.detail}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <p className="text-3xl font-semibold tracking-tight text-foreground">{metric.value}</p>
              <Button asChild size="sm" variant="outline">
                <Link href={metric.href}>Kelola</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-lg">Panduan Backend Supabase</CardTitle>
          <CardDescription>
            Ringkasan tahapan menghubungkan dashboard ARCADE dengan Supabase dan Vercel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <ol className="list-decimal space-y-2 pl-5">
            <li>Buat project Supabase, jalankan SQL <code>jobs</code> dan <code>stories</code>, lalu buat akun admin di tab Auth.</li>
            <li>Salin <code>SUPABASE_URL</code>, <code>SUPABASE_ANON_KEY</code>, dan <code>SUPABASE_SERVICE_ROLE_KEY</code> ke Environment Variables Vercel.</li>
            <li>Deploy Next.js ke Vercel (gratis), set <code>NODE_ENV=production</code> dan aktifkan region dekat Indonesia.</li>
            <li>Set domain kustom <code>www.arcadehimafi.my.id</code> di Vercel, arahkan DNS CNAME/ALIAS sesuai petunjuk.</li>
            <li>Uji login admin dan operasi CRUD INFOPROF/Cerita dari dashboard untuk memastikan izin Supabase benar.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

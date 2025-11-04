"use client";

import { ArrowUpRight, CalendarClock, MapPin } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { JobCategory, JobPosting } from "@/lib/domain/jobs";
import { cn } from "@/lib/utils";

const categories: (JobCategory | "Semua")[] = ["Semua", "Kerja", "Magang", "Beasiswa"];

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

interface CareerBoardProps {
  jobs: JobPosting[];
}

export default function CareerBoard({ jobs }: CareerBoardProps) {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("Semua");
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  const filteredJobs = useMemo(() => {
    if (activeCategory === "Semua") {
      return jobs;
    }
    return jobs.filter((job) => job.category === activeCategory);
  }, [jobs, activeCategory]);

  return (
    <div className="space-y-10">
      <div className="-mx-1 flex snap-x gap-3 overflow-x-auto pb-1 pl-1 sm:mx-0 sm:flex-wrap sm:gap-3 sm:overflow-visible">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className={cn(
              "min-w-[112px] snap-start rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ease-out",
              activeCategory === category
                ? "border-transparent bg-primary text-primary-foreground shadow-[0_12px_30px_-18px_rgba(199,88,3,0.7)]"
                : "border-border/60 bg-[#EDEFF3] text-slate-600 hover:border-primary/40 hover:bg-[#e3e7ef] hover:text-slate-800",
            )}
          >
            {category}
          </Button>
        ))}
      </div>
      {filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 bg-muted/20 p-12 text-center">
          <p className="text-lg font-medium text-foreground">Belum ada info untuk kategori ini.</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Pantau kembali dalam beberapa hari atau kirim info baru melalui formulir di bawah agar komunitas bisa ikut dapat kesempatan.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className="group flex h-full flex-col justify-between rounded-3xl border border-border/40 bg-background/95 shadow-[0_22px_55px_-32px_rgba(15,23,42,0.55)] transition duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_30px_70px_-28px_rgba(15,23,42,0.6)]"
            >
              {job.posterUrl ? (
                <div className="relative h-40 w-full overflow-hidden rounded-t-3xl border-b border-border/40 bg-muted/30">
                  {/* eslint-disable-next-line @next/next/no-img-element -- Storage poster preview uses plain img with dynamic source */}
                  <img
                    src={job.posterUrl}
                    alt={`Poster ${job.title}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : null}
              <CardHeader className="space-y-5 p-6 pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-primary/40 text-xs uppercase tracking-wide text-primary">
                    {job.category}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarClock className="h-3.5 w-3.5" aria-hidden />
                    {dateFormatter.format(new Date(job.deadline))}
                  </span>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-xl font-semibold leading-snug text-slate-900 transition-colors group-hover:text-primary">
                    {job.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="font-medium text-slate-800">{job.organization}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5" aria-hidden />
                      {job.location}
                    </span>
                  </CardDescription>
                  {job.highlight ? (
                    <p className="text-sm font-medium text-slate-700">{job.highlight}</p>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent className="space-y-5 border-t border-border/40 p-6 pt-5">
                <div className="flex flex-wrap gap-2.5">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="rounded-full border border-border/40 bg-muted px-3 py-1 text-xs font-medium text-slate-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-between px-0 text-primary transition-colors duration-300 hover:text-primary"
                  onClick={() => setSelectedJob(job)}
                >
                  <span>Detail & Apply</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Sheet open={Boolean(selectedJob)} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <SheetContent side="right" className="w-full max-w-xl overflow-y-auto border-l border-border/60 bg-background/95 backdrop-blur">
          {selectedJob && (
            <div className="space-y-6">
              <SheetHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="border-primary/40 text-primary">
                    {selectedJob.category}
                  </Badge>
                  <span>{selectedJob.organization}</span>
                </div>
                <SheetTitle className="text-2xl font-semibold leading-tight">
                  {selectedJob.title}
                </SheetTitle>
                <SheetDescription>
                  Lokasi: {selectedJob.location} • Batas akhir {dateFormatter.format(new Date(selectedJob.deadline))}
                </SheetDescription>
              </SheetHeader>
              {selectedJob.posterUrl ? (
                <div className="overflow-hidden rounded-xl border border-border/40">
                  {/* eslint-disable-next-line @next/next/no-img-element -- Storage poster preview uses plain img with dynamic source */}
                  <img
                    src={selectedJob.posterUrl}
                    alt={`Poster ${selectedJob.title}`}
                    className="w-full object-cover"
                  />
                </div>
              ) : null}
              <div className="space-y-5 text-sm leading-relaxed">
                {selectedJob.highlight ? (
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-slate-800">
                    {selectedJob.highlight}
                  </div>
                ) : null}
                <p className="text-slate-600">{selectedJob.description}</p>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
                    Persyaratan utama
                  </h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {selectedJob.requirements.map((req) => (
                      <li key={req}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {selectedJob.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="rounded-full border-border/60 px-3 py-1 text-xs font-medium text-slate-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-4 text-sm text-slate-600">
                  <p>
                    Tertarik? Kirim CV terbaikmu ke{" "}
                    <a
                      href={`mailto:${selectedJob.contact}`}
                      className="font-medium text-primary underline-offset-2 hover:underline"
                    >
                      {selectedJob.contact}
                    </a>
                    {" "}atau langsung daftar melalui tautan berikut.
                  </p>
                </div>
                <Button asChild className="w-full">
                  <a href={selectedJob.link} target="_blank" rel="noreferrer">
                    Buka Detail & Apply
                  </a>
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

import Link from "next/link";

import { SectionHeading } from "@/components/site/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface RoadmapPhase {
  title: string;
  focus: string;
  period: string;
  deliverables: string[];
  status: "done" | "in-progress" | "upcoming";
}

interface HomeRoadmapProps {
  phases: RoadmapPhase[];
}

export function HomeRoadmap({ phases }: HomeRoadmapProps) {
  return (
    <section className="max-w-container mx-auto px-4 pb-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <SectionHeading
          eyebrow="Roadmap"
          title="Tahapan transformasi ARCADE"
          description="Kami menjalankan pengembangan bertahap agar setiap fitur diuji oleh komunitas sebelum diterapkan secara luas."
        />
        <div className="space-y-4">
          {phases.map((phase, index) => (
            <Card key={phase.title} className="relative overflow-hidden border-border/40">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium uppercase tracking-[0.26em] text-muted-foreground/80">{phase.period}</p>
                      <h3 className="text-lg font-semibold text-foreground">
                        {phase.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">Fokus: {phase.focus}</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      phase.status === "done"
                        ? "border-emerald-300/60 text-emerald-600"
                        : phase.status === "in-progress"
                          ? "border-amber-300/60 text-amber-600"
                          : "border-border/50 text-muted-foreground"
                    }`}
                  >
                    {phase.status === "done"
                      ? "Selesai"
                      : phase.status === "in-progress"
                        ? "Berjalan"
                        : "Segera"}
                  </Badge>
                </div>
                <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
                  {phase.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
          <Button asChild variant="outline" className="w-full">
            <Link href="/tentang#roadmap">Lihat detail roadmap organisasi</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

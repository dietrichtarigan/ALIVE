import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

interface HeroMetric {
  id: string;
  label: string;
  value: string;
  helper?: string;
}

interface HeroSpotlight {
  category: string;
  title: string;
  description: string;
  meta: string;
  link: string;
  cta?: string;
}

interface HomeHeroProps {
  metrics: HeroMetric[];
  spotlight: HeroSpotlight;
}

export function HomeHero({ metrics, spotlight }: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/30 bg-gradient-to-br from-primary/5 via-background to-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(27,54,93,0.12),_transparent_55%)]" aria-hidden />
      <div className="max-w-container mx-auto grid gap-12 px-4 py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
        <div className="space-y-8">
          <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
            ARCADE HIMAFI
          </Badge>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Connecting Physicists, Building Careers
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Ekosistem karier HIMAFI untuk menjembatani mahasiswa, alumni, dan mitra industri. Kurasi peluang, mentoring, dan data alumni dalam satu portal.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/karier">Lihat Info Karier</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/cerita">Baca Cerita Alumni</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={siteConfig.resources.infoSubmission}>Kirim Info Terbaru</Link>
            </Button>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className="rounded-2xl border border-border/40 bg-card/80 p-4 shadow-sm backdrop-blur">
                <dt className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground/80">
                  {metric.label}
                </dt>
                <dd className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
                  {metric.value}
                </dd>
                {metric.helper && <p className="mt-2 text-xs text-muted-foreground/80">{metric.helper}</p>}
              </div>
            ))}
          </dl>
        </div>
        <Card className="border-border/40 shadow-lg shadow-primary/5">
          <CardHeader className="space-y-3">
            <Badge variant="outline" className="w-fit border-primary/40 bg-primary/10 text-primary">
              {spotlight.category}
            </Badge>
            <CardTitle className="text-2xl leading-tight text-foreground">
              {spotlight.title}
            </CardTitle>
            <CardDescription>{spotlight.meta}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{spotlight.description}</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link href={spotlight.link}>{spotlight.cta ?? "Pelajari lebih lanjut"}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { SectionHeading } from "@/components/site/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type SpotlightCategory = "Karier" | "Event" | "Cerita";

export interface SpotlightItem {
  id: string;
  category: SpotlightCategory;
  title: string;
  description: string;
  link: string;
  meta: string;
  cta?: string;
}

interface SpotlightProps {
  items: SpotlightItem[];
}

const filters: (SpotlightCategory | "Semua")[] = ["Semua", "Karier", "Event", "Cerita"];

export function HomeSpotlight({ items }: SpotlightProps) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("Semua");

  const filteredItems = useMemo(() => {
    if (activeFilter === "Semua") {
      return items;
    }
    return items.filter((item) => item.category === activeFilter);
  }, [activeFilter, items]);

  return (
    <section className="max-w-container mx-auto px-4 py-20">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <SectionHeading
          eyebrow="Sorotan Minggu Ini"
          title="Kurasi terbaru dari tim ARCADE"
          description="Pilihan peluang, agenda, dan narasi alumni yang perlu segera diikuti. Semua sudah diverifikasi dan siap ditindaklanjuti."
        />
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = filter === activeFilter;
            return (
              <Button
                key={filter}
                size="sm"
                variant={isActive ? "default" : "outline"}
                className={
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "border-border/50 text-muted-foreground hover:text-foreground"
                }
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="flex h-full flex-col border-border/30 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <CardHeader className="space-y-4">
              <Badge variant="outline" className="w-fit border-primary/30 bg-primary/5 text-primary">
                {item.category}
              </Badge>
              <CardTitle className="text-xl font-semibold leading-tight text-foreground">
                {item.title}
              </CardTitle>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground/80">
                {item.meta}
              </p>
            </CardHeader>
            <CardContent className="mt-auto flex flex-1 flex-col justify-between space-y-6 text-sm text-muted-foreground">
              <p className="leading-relaxed">{item.description}</p>
              <Button asChild variant="ghost" className="justify-start px-0 text-primary">
                <Link href={item.link}>{item.cta ?? "Lihat detail"} →</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

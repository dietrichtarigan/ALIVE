"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type HighlightCategory = "Karier" | "Event" | "Cerita";

export interface HighlightItem {
  id: string;
  category: HighlightCategory;
  title: string;
  description: string;
  link: string;
  meta: string;
  cta?: string;
}

interface HighlightsProps {
  items: HighlightItem[];
}

const filters: (HighlightCategory | "Semua")[] = ["Semua", "Karier", "Event", "Cerita"];

export default function Highlights({ items }: HighlightsProps) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("Semua");

  const visibleItems = useMemo(() => {
    if (activeFilter === "Semua") {
      return items;
    }
    return items.filter((item) => item.category === activeFilter);
  }, [activeFilter, items]);

  return (
    <section className="max-w-container mx-auto px-4 py-16">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase text-primary">Highlight Terbaru</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Ekosistem Massa – Alumni – Industri dalam satu portal
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Kurasi cepat dari tim ARCADE: peluang karier, agenda alumni, dan cerita inspiratif yang sedang ramai diperbincangkan minggu ini.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className={
                activeFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "border-border/60 text-foreground/80 hover:text-foreground"
              }
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visibleItems.map((item) => (
          <Card key={item.id} className="relative overflow-hidden border-border/40">
            <CardHeader className="space-y-4">
              <Badge variant="outline" className="w-fit border-primary/40 text-primary">
                {item.category}
              </Badge>
              <CardTitle className="text-xl font-semibold leading-tight">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.meta}</span>
                <Button asChild variant="link" size="sm" className="px-0">
                  <Link href={item.link}>{item.cta ?? "Selengkapnya"}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

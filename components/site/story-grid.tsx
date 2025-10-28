"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlumniStory, StoryTag } from "@/data/stories";

const filters: (StoryTag | "Semua")[] = [
  "Semua",
  "Riset",
  "Industri",
  "Akademik",
  "Teknologi",
  "Kewirausahaan",
  "Energi",
];

interface StoryGridProps {
  stories: AlumniStory[];
}

export default function StoryGrid({ stories }: StoryGridProps) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("Semua");

  const visibleStories = useMemo(() => {
    if (activeFilter === "Semua") {
      return stories;
    }
    return stories.filter((story) => story.tags.includes(activeFilter));
  }, [stories, activeFilter]);

  return (
    <div className="space-y-8">
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
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visibleStories.map((story) => (
          <Card key={story.id} className="border-border/40">
            <CardHeader className="space-y-4">
              <div
                className={`h-12 w-12 rounded-full ${story.avatarColor}`}
                aria-hidden
              ></div>
              <div>
                <CardTitle className="text-lg leading-snug">
                  {story.title}
                </CardTitle>
                <CardDescription className="mt-2 text-sm text-muted-foreground">
                  {story.name} · {story.role}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {story.summary}
              </p>
              <div className="flex flex-wrap gap-2">
                {story.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button asChild variant="ghost" className="justify-start px-0 text-primary">
                <Link href={`/cerita/${story.slug}`}>Baca cerita ⟶</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { alumniStories } from "@/data/stories";

export async function generateStaticParams() {
  return alumniStories.map((story) => ({ slug: story.slug }));
}

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = alumniStories.find((item) => item.slug === slug);

  if (!story) {
    return {
      title: "Cerita Alumni",
    };
  }

  return {
    title: `${story.title} - Cerita Alumni`,
    description: story.summary,
  };
}

export default async function StoryDetailPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = alumniStories.find((item) => item.slug === slug);

  if (!story) {
    notFound();
  }

  return (
    <div className="bg-background">
      <article className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/cerita" className="text-sm text-primary hover:underline">
          ← Kembali ke CeritaKita
        </Link>
        <div className="mt-6 space-y-4">
          <Badge variant="outline" className="border-primary/40 text-primary">
            Cerita Alumni
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight">{story.title}</h1>
          <p className="text-muted-foreground text-lg">
            {story.name} · {story.role} ({story.batch})
          </p>
          <div className={`h-14 w-14 rounded-full ${story.avatarColor}`} aria-hidden></div>
        </div>
        <Card className="mt-8 border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background">
          <CardContent className="space-y-4 p-6">
            <p className="text-xl font-medium text-foreground">“{story.quote}”</p>
            <div className="flex flex-wrap gap-2">
              {story.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="prose prose-invert mt-10 space-y-6 text-base leading-relaxed text-muted-foreground">
          {story.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
}

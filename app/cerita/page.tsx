import { Metadata } from "next";
import Link from "next/link";

import { StoryForm } from "@/components/site/forms/story-form";
import StoryGrid from "@/components/site/story-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { alumniStories } from "@/data/stories";

export const metadata: Metadata = {
  title: "Cerita Alumni (CeritaKita)",
  description:
    "Artikel dan kisah inspiratif alumni HIMAFI dalam membangun karier di berbagai bidang.",
};

const featuredStories = alumniStories.filter((story) => story.featured);

export default function CeritaPage() {
  return (
    <div className="bg-background">
      <section className="max-w-container mx-auto px-4 py-16">
        <div className="space-y-6">
          <Badge variant="outline" className="border-primary/40 text-primary">
            CeritaKita
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Cerita Alumni HIMAFI</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            Jelajahi narasi lintas generasi tentang bagaimana alumni HIMAFI membangun karier di riset, industri, pendidikan, dan wirausaha.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featuredStories.map((story) => (
            <Card key={story.id} className="border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background">
              <CardHeader className="space-y-3">
                <CardTitle className="text-xl leading-tight">{story.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {story.name} · {story.role}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>{story.summary}</p>
                <Button asChild variant="link" className="px-0 text-primary">
                  <Link href={`/cerita/${story.slug}`}>Baca selengkapnya</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-16">
          <StoryGrid stories={alumniStories} />
        </div>
      </section>
      <section className="max-w-container mx-auto px-4 pb-16" id="kirim-cerita">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="text-2xl">Kirim Ceritamu</CardTitle>
            <CardDescription>
              Kami percaya setiap perjalanan karier unik. Ceritamu bisa menjadi inspirasi bagi adik tingkat atau rekan seangkatan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm text-muted-foreground">
            <p>
              Gunakan form berikut untuk mengirimkan cerita. Data akan langsung diteruskan ke backend PHP CeritaKita agar tim editorial bisa
              menindaklanjuti. Jika backend belum aktif, aplikasi akan memberi tahu bahwa data disimpan sementara.
            </p>
            <StoryForm variant="public" />
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="outline">
                <a href={siteConfig.links.instagram} target="_blank" rel="noreferrer">
                  Lihat highlight IG
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

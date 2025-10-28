import { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { roadmapPhases } from "@/data/roadmap";
import { teamStructure } from "@/data/team";

export const metadata: Metadata = {
  title: "Tentang ARCADE",
  description:
    "Visi, struktur tim, dan roadmap Divisi ARCADE HIMAFI dalam membangun ekosistem massa – alumni – industri.",
};

const visionPoints = [
  "Menjembatani massa HIMAFI dengan alumni dan industri secara sistematis",
  "Menyediakan pengalaman belajar karier yang inklusif dan berkelanjutan",
  "Membangun data dan insight untuk pengambilan keputusan organisasi",
];

const timeline = [
  {
    period: "Agus 2025",
    title: "Kick-off ARCADE",
    detail: "Validasi kebutuhan massa dan alumni, penyusunan OKR Divisi ARCADE",
  },
  {
    period: "Sep 2025",
    title: "Riset UX & Brand",
    detail: "FGD dengan mahasiswa aktif, alumni, dan mitra industri",
  },
  {
    period: "Okt 2025",
    title: "Peluncuran Tahap 1",
    detail: "Website statis ARCADE dengan halaman program utama",
  },
];

export default function TentangPage() {
  return (
    <div className="bg-background">
      <section className="max-w-container mx-auto px-4 py-16" id="visi">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <Badge variant="outline" className="border-primary/40 text-primary">
              Tentang ARCADE
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Visi & Misi</h1>
            <p className="text-lg text-muted-foreground">
              ARCADE HIMAFI adalah platform interaktif yang menghubungkan massa, alumni, dan industri untuk membuka akses karier dan pengembangan
              diri yang relevan.
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {visionPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-1 size-2 rounded-full bg-primary"></span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/karier">Mulai jelajahi program</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={siteConfig.links.instagram} target="_blank" rel="noreferrer">
                  Ikuti update
                </a>
              </Button>
            </div>
          </div>
          <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background">
            <CardHeader>
              <CardTitle className="text-2xl">Prinsip Desain Pengalaman</CardTitle>
              <CardDescription>
                Kami mengadaptasi komponen dari Launch UI lalu mengkustomisasi brand HIMAFI untuk menghadirkan pengalaman yang konsisten.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>Fokus pada aksesibilitas, informasi ringkas, dan kemudahan kontribusi alumni.</p>
              <p>Kami menyiapkan mode gelap/terang agar nyaman digunakan kapan pun.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="max-w-container mx-auto px-4 pb-16" id="struktur">
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold">Struktur Divisi</h2>
          <p className="max-w-3xl text-muted-foreground">
            Kolaborasi lintas sub-program memastikan seluruh pilar—INFOPROF, SINERGI, CeritaKita, dan ALIVE—berjalan selaras.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {teamStructure.map((member) => (
              <Card key={member.name} className="border-border/40">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>{member.focus}</p>
                  {member.contact && (
                    <Button asChild variant="outline" size="sm" className="w-fit">
                      <a href={member.contact}>Hubungi</a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-container mx-auto px-4 pb-16" id="roadmap">
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold">Roadmap Pengembangan</h2>
          <p className="max-w-3xl text-muted-foreground">
            Roadmap empat tahap menjadi panduan kami untuk membangun portal ARCADE secara bertahap dan terukur.
          </p>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-border/40">
              <CardContent className="space-y-4 p-6">
                <ol className="space-y-4">
                  {roadmapPhases.map((phase) => (
                    <li key={phase.title} className="rounded-lg border border-border/30 p-4">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-primary/30 text-xs uppercase tracking-wide text-primary">
                          {phase.period}
                        </Badge>
                        <span className="text-sm font-semibold text-foreground/90">
                          {phase.title} · {phase.focus}
                        </span>
                      </div>
                      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {phase.deliverables.map((deliverable) => (
                          <li key={deliverable}>{deliverable}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
            <Card className="border-border/40 bg-muted/10">
              <CardHeader>
                <CardTitle className="text-2xl">Timeline 2025</CardTitle>
                <CardDescription>
                  Perjalanan singkat dari riset pengguna hingga peluncuran tahap pertama website ARCADE.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <ul className="space-y-3">
                  {timeline.map((item) => (
                    <li key={item.title} className="rounded-lg border border-border/40 bg-background/70 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-primary">{item.period}</div>
                      <div className="mt-1 text-sm font-semibold text-foreground/90">{item.title}</div>
                      <p className="mt-2">{item.detail}</p>
                    </li>
                  ))}
                </ul>
                <p>
                  Punya ide kolaborasi atau masukan? Kami senang berdiskusi. Email {""}
                  <a href={siteConfig.links.email} className="font-medium text-primary underline-offset-2 hover:underline">
                    tim ARCADE
                  </a>
                  {" "}atau DM Instagram.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

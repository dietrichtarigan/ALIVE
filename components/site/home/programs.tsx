import Link from "next/link";
import { type ComponentType } from "react";

import { SectionHeading } from "@/components/site/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgramItem {
  title: string;
  program: string;
  description: string;
  link: string;
  icon: ComponentType<{ className?: string }>;
}

interface HomeProgramsProps {
  items: ProgramItem[];
}

export function HomePrograms({ items }: HomeProgramsProps) {
  return (
    <section className="max-w-container mx-auto px-4 py-20">
      <SectionHeading
        eyebrow="Program Inti"
        title="Layanan utama ARCADE untuk massa dan alumni"
        description="Empat kanal strategis yang memastikan peluang, dokumentasi alumni, dan data komunitas terkelola dengan standar profesional."
      />
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <Card key={item.program} className="relative flex h-full flex-col border-border/40 shadow-sm">
            <CardHeader className="space-y-4">
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <item.icon className="size-6" />
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="border-primary/30 text-xs text-primary">
                  {item.program}
                </Badge>
                <CardTitle className="text-xl leading-7 text-foreground">{item.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between space-y-6 text-sm text-muted-foreground">
              <CardDescription className="text-sm text-muted-foreground">
                {item.description}
              </CardDescription>
              <Button asChild variant="ghost" className="justify-start px-0 text-sm text-primary">
                <Link href={item.link}>Pelajari lebih lanjut →</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

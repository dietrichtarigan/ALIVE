import Link from "next/link";
import { type ComponentType } from "react";
import { ArrowUpRight } from "lucide-react";

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
    <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(var(--quantum-void))] via-[hsl(var(--quantum-navy))]/50 to-[hsl(var(--quantum-void))] py-24">
      {/* Background decorations */}
      <div className="quantum-grid absolute inset-0 opacity-20" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[hsl(var(--quantum-azure))] opacity-5 blur-[120px] rounded-full" aria-hidden="true" />
      
      <div className="max-w-container relative z-10 mx-auto px-4">
        <SectionHeading
          eyebrow="Program Inti"
          title="Layanan utama ARCADE untuk massa dan alumni"
          description="Empat kanal strategis yang memastikan peluang, dokumentasi alumni, dan data komunitas terkelola dengan standar profesional."
        />
        
        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4 quantum-stagger">
          {items.map((item, index) => {
            // Color variants for each card
            const gradients = [
              { from: 'var(--quantum-cyan)', to: 'var(--quantum-azure)' },
              { from: 'var(--quantum-azure)', to: 'var(--quantum-magenta)' },
              { from: 'var(--quantum-magenta)', to: 'var(--quantum-amber)' },
              { from: 'var(--quantum-amber)', to: 'var(--quantum-cyan)' },
            ];
            const gradient = gradients[index % 4];
            
            return (
              <Card 
                key={item.program} 
                className="quantum-glass group relative flex h-full flex-col border-[hsl(var(--quantum-cyan))]/20 shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[hsl(var(--quantum-cyan))]/20 overflow-hidden"
              >
                {/* Top gradient accent */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1 transition-all duration-500"
                  style={{
                    background: `linear-gradient(90deg, hsl(${gradient.from}), hsl(${gradient.to}))`
                  }}
                />
                
                <CardHeader className="space-y-5 pb-4">
                  {/* Icon with gradient background */}
                  <div 
                    className="inline-flex size-14 items-center justify-center rounded-2xl text-[hsl(var(--quantum-void))] shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                    style={{
                      background: `linear-gradient(135deg, hsl(${gradient.from}), hsl(${gradient.to}))`
                    }}
                  >
                    <item.icon className="size-7" />
                  </div>
                  
                  <div className="space-y-3">
                    <Badge 
                      variant="outline" 
                      className="border-[hsl(var(--quantum-cyan))]/40 bg-[hsl(var(--quantum-cyan))]/10 text-[hsl(var(--quantum-cyan))] text-xs font-semibold uppercase tracking-wide"
                    >
                      {item.program}
                    </Badge>
                    <CardTitle className="text-xl leading-tight text-[hsl(var(--quantum-ghost))] group-hover:text-[hsl(var(--quantum-cyan))] transition-colors">
                      {item.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent className="flex flex-1 flex-col justify-between space-y-6">
                  <CardDescription className="text-sm leading-relaxed text-[hsl(var(--quantum-fog))]">
                    {item.description}
                  </CardDescription>
                  
                  <Button 
                    asChild 
                    variant="ghost" 
                    className="quantum-link justify-start px-0 text-sm font-medium text-[hsl(var(--quantum-cyan))] hover:text-[hsl(var(--quantum-azure))] group/btn"
                  >
                    <Link href={item.link}>
                      Pelajari lebih lanjut
                      <ArrowUpRight className="ml-1 w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

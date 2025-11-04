"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Calendar, Briefcase, MessageSquare } from "lucide-react";

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

// Category icon & color mapping
const categoryConfig = {
  Karier: {
    icon: Briefcase,
    gradient: { from: 'var(--quantum-cyan)', to: 'var(--quantum-azure)' },
    badge: 'border-[hsl(var(--quantum-cyan))]/50 bg-[hsl(var(--quantum-cyan))]/10 text-[hsl(var(--quantum-cyan))]'
  },
  Event: {
    icon: Calendar,
    gradient: { from: 'var(--quantum-magenta)', to: 'var(--quantum-amber)' },
    badge: 'border-[hsl(var(--quantum-magenta))]/50 bg-[hsl(var(--quantum-magenta))]/10 text-[hsl(var(--quantum-magenta))]'
  },
  Cerita: {
    icon: MessageSquare,
    gradient: { from: 'var(--quantum-azure)', to: 'var(--quantum-cyan)' },
    badge: 'border-[hsl(var(--quantum-azure))]/50 bg-[hsl(var(--quantum-azure))]/10 text-[hsl(var(--quantum-azure))]'
  }
};

export function HomeSpotlight({ items }: SpotlightProps) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("Semua");

  const filteredItems = useMemo(() => {
    if (activeFilter === "Semua") {
      return items;
    }
    return items.filter((item) => item.category === activeFilter);
  }, [activeFilter, items]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(var(--quantum-void))] via-[hsl(var(--quantum-charcoal))]/30 to-[hsl(var(--quantum-void))] py-24">
      {/* Background decorations */}
      <div className="quantum-waves absolute inset-0 opacity-20" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[hsl(var(--quantum-magenta))] opacity-5 blur-[140px] rounded-full" aria-hidden="true" />
      
      <div className="max-w-container relative z-10 mx-auto px-4">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <SectionHeading
            eyebrow="Sorotan Minggu Ini"
            title="Kurasi terbaru dari tim ARCADE"
            description="Pilihan peluang, agenda, dan narasi alumni yang perlu segera diikuti. Semua sudah diverifikasi dan siap ditindaklanjuti."
          />
          
          {/* Filter Buttons - Redesigned */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const isActive = filter === activeFilter;
              return (
                <Button
                  key={filter}
                  size="sm"
                  variant={isActive ? "default" : "outline"}
                  className={`quantum-button transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-[hsl(var(--quantum-cyan))] to-[hsl(var(--quantum-azure))] text-[hsl(var(--quantum-void))] border-0 shadow-lg shadow-[hsl(var(--quantum-cyan))]/30"
                      : "border-[hsl(var(--quantum-cyan))]/30 bg-[hsl(var(--quantum-navy))]/40 text-[hsl(var(--quantum-fog))] hover:bg-[hsl(var(--quantum-navy))]/60 hover:text-[hsl(var(--quantum-ghost))]"
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </Button>
              );
            })}
          </div>
        </div>
        
        {/* Cards Grid */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const config = categoryConfig[item.category];
            const Icon = config.icon;
            
            return (
              <Card 
                key={item.id} 
                className="quantum-glass group relative flex h-full flex-col border-[hsl(var(--quantum-cyan))]/20 shadow-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-[hsl(var(--quantum-cyan))]/20 overflow-hidden"
              >
                {/* Gradient top accent */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{
                    background: `linear-gradient(90deg, hsl(${config.gradient.from}), hsl(${config.gradient.to}))`
                  }}
                />
                
                {/* Background icon watermark */}
                <div className="absolute top-6 right-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <Icon className="w-24 h-24" />
                </div>
                
                <CardHeader className="space-y-4 relative z-10">
                  {/* Category Badge */}
                  <Badge 
                    variant="outline" 
                    className={`w-fit font-semibold ${config.badge}`}
                  >
                    <Icon className="w-3 h-3 mr-1.5" />
                    {item.category}
                  </Badge>
                  
                  {/* Title */}
                  <CardTitle className="text-xl font-bold leading-tight text-[hsl(var(--quantum-ghost))] group-hover:text-[hsl(var(--quantum-cyan))] transition-colors">
                    {item.title}
                  </CardTitle>
                  
                  {/* Meta info */}
                  <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--quantum-slate))]">
                    {item.meta}
                  </p>
                </CardHeader>
                
                <CardContent className="mt-auto flex flex-1 flex-col justify-between space-y-6 relative z-10">
                  {/* Description */}
                  <p className="text-sm leading-relaxed text-[hsl(var(--quantum-fog))]">
                    {item.description}
                  </p>
                  
                  {/* CTA Link */}
                  <Button 
                    asChild 
                    variant="ghost" 
                    className="quantum-link justify-start px-0 text-sm font-medium group/cta"
                    style={{ color: `hsl(${config.gradient.from})` }}
                  >
                    <Link href={item.link}>
                      {item.cta ?? "Lihat detail"}
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="mt-16 text-center py-12">
            <p className="text-[hsl(var(--quantum-slate))] text-lg">
              Tidak ada item untuk kategori <span className="text-[hsl(var(--quantum-cyan))] font-semibold">{activeFilter}</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

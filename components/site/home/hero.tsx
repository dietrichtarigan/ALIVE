import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Users, Zap } from "lucide-react";

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

// Icon mapping untuk metrics
const metricIconMap: Record<string, React.ReactNode> = {
  jobs: <TrendingUp className="w-5 h-5" />,
  stories: <Sparkles className="w-5 h-5" />,
  partners: <Zap className="w-5 h-5" />,
  network: <Users className="w-5 h-5" />,
};

export function HomeHero({ metrics, spotlight }: HomeHeroProps) {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-[hsl(var(--quantum-void))] via-[hsl(var(--quantum-navy))] to-[hsl(var(--quantum-void))]">
      {/* Quantum Particle Background */}
      <div className="quantum-particles" aria-hidden="true" />
      
      {/* Wave Pattern Overlay */}
      <div className="quantum-waves" aria-hidden="true" />
      
      {/* Radial Glow Effect */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[hsl(var(--quantum-cyan))] opacity-10 blur-[150px] rounded-full"
        aria-hidden="true"
      />
      
      {/* Grid Pattern */}
      <div className="quantum-grid absolute inset-0 opacity-30" aria-hidden="true" />
      
      <div className="max-w-container relative z-10 mx-auto px-4 py-16 lg:py-24">
        {/* Asymmetric Layout - Modern & Unique */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* Left Column - Hero Content (Span 7) */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Brand Badge - Animated */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <Badge 
                variant="outline" 
                className="quantum-glow border-[hsl(var(--quantum-cyan))] bg-[hsl(var(--quantum-navy))]/60 text-[hsl(var(--quantum-cyan))] px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
              >
                <Sparkles className="w-3 h-3 mr-2 inline" />
                ARCADE HIMAFI
              </Badge>
            </div>
            
            {/* Main Headline - Bold Typography */}
            <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <h1 className="text-5xl font-bold tracking-tight text-[hsl(var(--quantum-ghost))] sm:text-6xl lg:text-7xl leading-[1.1]">
                <span className="quantum-text-gradient block">
                  Connecting
                </span>
                <span className="block">Physicists,</span>
                <span className="block text-[hsl(var(--quantum-cyan))]">
                  Building Careers
                </span>
              </h1>
              
              <p className="max-w-2xl text-lg text-[hsl(var(--quantum-fog))] leading-relaxed sm:text-xl">
                Ekosistem karier HIMAFI untuk{" "}
                <span className="text-[hsl(var(--quantum-cyan))] font-semibold">menjembatani mahasiswa</span>,{" "}
                <span className="text-[hsl(var(--quantum-magenta))] font-semibold">alumni</span>, dan{" "}
                <span className="text-[hsl(var(--quantum-amber))] font-semibold">mitra industri</span>.
              </p>
            </div>
            
            {/* CTA Buttons - Modern Design */}
            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <Button 
                asChild 
                size="lg"
                className="quantum-button bg-gradient-to-r from-[hsl(var(--quantum-cyan))] to-[hsl(var(--quantum-azure))] text-[hsl(var(--quantum-void))] hover:shadow-lg hover:shadow-[hsl(var(--quantum-cyan))]/50 border-0 font-semibold px-8 h-12"
              >
                <Link href="/karier">
                  Lihat Info Karier
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                size="lg" 
                variant="outline"
                className="quantum-button border-[hsl(var(--quantum-cyan))]/50 bg-[hsl(var(--quantum-navy))]/40 text-[hsl(var(--quantum-ghost))] hover:bg-[hsl(var(--quantum-navy))]/60 backdrop-blur-sm font-semibold px-8 h-12"
              >
                <Link href="/cerita">
                  Baca Cerita Alumni
                </Link>
              </Button>
              
              <Button 
                asChild 
                size="lg" 
                variant="ghost"
                className="quantum-link text-[hsl(var(--quantum-fog))] hover:text-[hsl(var(--quantum-cyan))] font-medium px-6 h-12"
              >
                <Link href={siteConfig.resources.infoSubmission}>
                  Kirim Info Terbaru
                </Link>
              </Button>
            </div>
            
            {/* Metrics Grid - Glassmorphism Cards */}
            <dl className="grid gap-4 sm:grid-cols-2 quantum-stagger pt-6">
              {metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="quantum-glass group rounded-2xl p-5 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[hsl(var(--quantum-cyan))]/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <dt className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--quantum-slate))]">
                      {metric.label}
                    </dt>
                    <div className="text-[hsl(var(--quantum-cyan))] opacity-60 group-hover:opacity-100 transition-opacity">
                      {metricIconMap[metric.id]}
                    </div>
                  </div>
                  
                  <dd className="text-4xl font-bold text-[hsl(var(--quantum-ghost))] sm:text-5xl mb-2">
                    {metric.value}
                  </dd>
                  
                  {metric.helper && (
                    <p className="text-xs text-[hsl(var(--quantum-slate))] leading-relaxed">
                      {metric.helper}
                    </p>
                  )}
                </div>
              ))}
            </dl>
          </div>
          
          {/* Right Column - Spotlight Card (Span 5) */}
          <div className="lg:col-span-5 flex items-center animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <Card className="quantum-glass w-full border-[hsl(var(--quantum-cyan))]/30 shadow-2xl shadow-[hsl(var(--quantum-cyan))]/10 overflow-hidden quantum-float">
              {/* Card Gradient Accent */}
              <div className="h-1 w-full bg-gradient-to-r from-[hsl(var(--quantum-cyan))] via-[hsl(var(--quantum-magenta))] to-[hsl(var(--quantum-amber))]" />
              
              <CardHeader className="space-y-4 p-6">
                <Badge 
                  variant="outline" 
                  className="w-fit border-[hsl(var(--quantum-magenta))]/50 bg-[hsl(var(--quantum-magenta))]/10 text-[hsl(var(--quantum-magenta))] font-medium"
                >
                  {spotlight.category}
                </Badge>
                
                <CardTitle className="text-2xl font-bold leading-tight text-[hsl(var(--quantum-ghost))] lg:text-3xl">
                  {spotlight.title}
                </CardTitle>
                
                <CardDescription className="text-[hsl(var(--quantum-slate))] text-sm">
                  {spotlight.meta}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-6 pb-6">
                <p className="text-sm leading-relaxed text-[hsl(var(--quantum-fog))]">
                  {spotlight.description}
                </p>
              </CardContent>
              
              <CardFooter className="p-6 pt-0">
                <Button 
                  asChild 
                  className="quantum-button w-full bg-gradient-to-r from-[hsl(var(--quantum-magenta))] to-[hsl(var(--quantum-amber))] text-white hover:shadow-lg hover:shadow-[hsl(var(--quantum-magenta))]/50 border-0 font-semibold"
                  size="lg"
                >
                  <Link href={spotlight.link}>
                    {spotlight.cta ?? "Pelajari lebih lanjut"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
        </div>
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[hsl(var(--quantum-void))] to-transparent" aria-hidden="true" />
    </section>
  );
}

"use client";

import { Menu, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import ArcadeLogo from "@/components/logos/arcade";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/karier", label: "Info Karier" },
  { href: "/events", label: "Events" },
  { href: "/cerita", label: "Cerita Alumni" },
  { href: "/alumni", label: "Database Alumni" },
  { href: "/tentang", label: "Tentang" },
];

function MobileLink({ href, label, onSelect }: NavLink & { onSelect?: () => void }) {
  return (
    <SheetClose asChild>
      <Link
        href={href}
        onClick={onSelect}
        className="quantum-link rounded-lg px-4 py-3 text-base font-medium text-[hsl(var(--quantum-ghost))] hover:text-[hsl(var(--quantum-cyan))] transition-colors"
      >
        {label}
      </Link>
    </SheetClose>
  );
}

export default function SiteNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[hsl(var(--quantum-cyan))]/10 bg-[hsl(var(--quantum-void))]/80 backdrop-blur-xl">
      {/* Subtle top gradient line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[hsl(var(--quantum-cyan))]/50 to-transparent" aria-hidden="true" />
      
      <div className="max-w-container mx-auto flex items-center justify-between px-4 py-4 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--quantum-cyan))] to-[hsl(var(--quantum-azure))] p-2 shadow-lg shadow-[hsl(var(--quantum-cyan))]/20 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[hsl(var(--quantum-cyan))]/40 group-hover:scale-105">
            <ArcadeLogo className="size-6 text-[hsl(var(--quantum-void))]" />
          </span>
          <span className="text-lg font-bold tracking-tight text-[hsl(var(--quantum-ghost))] group-hover:text-[hsl(var(--quantum-cyan))] transition-colors">
            {siteConfig.name}
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 lg:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`quantum-link relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "text-[hsl(var(--quantum-cyan))] bg-[hsl(var(--quantum-cyan))]/10"
                    : "text-[hsl(var(--quantum-fog))] hover:text-[hsl(var(--quantum-ghost))] hover:bg-[hsl(var(--quantum-navy))]/40"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-[hsl(var(--quantum-cyan))] to-[hsl(var(--quantum-azure))] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* Desktop CTA Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          <Button 
            asChild 
            variant="ghost" 
            size="sm"
            className="text-[hsl(var(--quantum-fog))] hover:text-[hsl(var(--quantum-ghost))] hover:bg-[hsl(var(--quantum-navy))]/40"
          >
            <Link href={siteConfig.resources.infoSubmission}>
              <Send className="w-4 h-4 mr-2" />
              Kirim Info
            </Link>
          </Button>
          
          <Button 
            asChild 
            size="sm" 
            className="quantum-button quantum-pulse bg-gradient-to-r from-[hsl(var(--quantum-cyan))] to-[hsl(var(--quantum-azure))] text-[hsl(var(--quantum-void))] hover:shadow-lg hover:shadow-[hsl(var(--quantum-cyan))]/50 border-0 font-semibold"
          >
            <Link href={siteConfig.resources.storySubmission}>
              <Sparkles className="w-4 h-4 mr-2" />
              Kirim Cerita
            </Link>
          </Button>
        </div>
        
        {/* Mobile Menu */}
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Buka navigasi"
                className="text-[hsl(var(--quantum-ghost))] hover:bg-[hsl(var(--quantum-navy))]/40"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="flex flex-col bg-[hsl(var(--quantum-navy))]/95 backdrop-blur-xl border-[hsl(var(--quantum-cyan))]/20"
            >
              <SheetHeader className="items-start border-b border-[hsl(var(--quantum-cyan))]/20 pb-4">
                <SheetTitle className="text-[hsl(var(--quantum-ghost))]">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <MobileLink key={link.href} {...link} onSelect={() => setOpen(false)} />
                ))}
              </div>
              <div className="mt-auto flex flex-col gap-3 border-t border-[hsl(var(--quantum-cyan))]/20 pt-6">
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full border-[hsl(var(--quantum-cyan))]/30 bg-[hsl(var(--quantum-navy))]/40 text-[hsl(var(--quantum-ghost))]"
                >
                  <Link href={siteConfig.resources.infoSubmission}>
                    <Send className="w-4 h-4 mr-2" />
                    Kirim Info
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="quantum-button w-full bg-gradient-to-r from-[hsl(var(--quantum-cyan))] to-[hsl(var(--quantum-azure))] text-[hsl(var(--quantum-void))] border-0 font-semibold"
                >
                  <Link href={siteConfig.resources.storySubmission}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Kirim Cerita
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

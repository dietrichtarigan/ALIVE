"use client";

import { Menu } from "lucide-react";
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
        className="rounded-lg px-2 py-1 text-lg font-medium text-foreground/90 hover:text-primary"
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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-lg">
      <div className="max-w-container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold">
          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 p-2 text-primary">
            <ArcadeLogo className="size-6" />
          </span>
          <span className="tracking-tight">{siteConfig.name}</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href={siteConfig.resources.infoSubmission}>Kirim Info</Link>
          </Button>
          <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href={siteConfig.resources.storySubmission}>Kirim Cerita</Link>
          </Button>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Buka navigasi">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
              <SheetHeader className="items-start">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <MobileLink
                    key={link.href}
                    {...link}
                    onSelect={() => setOpen(false)}
                  />
                ))}
              </div>
              <div className="mt-auto flex flex-col gap-3 border-t border-border/40 pt-6">
                <SheetClose asChild>
                  <Button asChild variant="outline" size="lg">
                    <Link href={siteConfig.resources.infoSubmission}>Kirim Info</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild size="lg">
                    <Link href={siteConfig.resources.storySubmission}>Kirim Cerita</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

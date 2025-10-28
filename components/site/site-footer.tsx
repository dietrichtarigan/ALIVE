import ArcadeLogo from "@/components/logos/arcade";
import FooterSection from "@/components/sections/footer/default";
import { siteConfig } from "@/config/site";

const footerColumns = [
  {
    title: "Program",
    links: [
      { text: "INFOPROF", href: "/karier" },
      { text: "SINERGI", href: "/events" },
      { text: "CeritaKita", href: "/cerita" },
      { text: "ALIVE", href: "/alumni" },
    ],
  },
  {
    title: "Tentang",
    links: [
      { text: "Visi & Misi", href: "/tentang#visi" },
      { text: "Struktur Divisi", href: "/tentang#struktur" },
      { text: "Roadmap", href: "/tentang#roadmap" },
    ],
  },
  {
    title: "Kontak",
    links: [
      { text: "Email", href: siteConfig.links.email },
      { text: "Instagram", href: siteConfig.links.instagram },
      { text: "LinkedIn", href: siteConfig.links.linkedin },
    ],
  },
];

export default function SiteFooter() {
  return (
    <FooterSection
      logo={<ArcadeLogo className="size-6" />}
      name={siteConfig.name}
      columns={footerColumns}
      policies={[{ text: "LivingLink", href: "/alumni#livinglink" }]}
      copyright={`© ${new Date().getFullYear()} ARCADE HIMAFI. All rights reserved.`}
    />
  );
}

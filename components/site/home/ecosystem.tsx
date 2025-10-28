import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface EcosystemItem {
  title: string;
  description: string;
}

interface HomeEcosystemProps {
  items: EcosystemItem[];
}

export function HomeEcosystem({ items }: HomeEcosystemProps) {
  return (
    <section className="max-w-container mx-auto grid gap-12 px-4 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Ekosistem Digital"
          title="ARCADE sebagai hub kolaborasi lintas platform"
          description="Kami merancang pengalaman lintas kanal agar peluang dan informasi alumni tersampaikan cepat, sekaligus terkoneksi dengan kebutuhan operasional HIMAFI."
        />
        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.title} className="border-border/40 bg-card/70 shadow-sm">
              <CardContent className="space-y-2 p-6">
                <CardTitle className="text-lg font-semibold text-foreground/90">{item.title}</CardTitle>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-8 text-sm text-muted-foreground shadow-inner">
        <h3 className="text-lg font-semibold text-primary">Fokus Pengembangan Backend</h3>
        <ul className="mt-4 space-y-3">
          <li>
            <span className="font-medium text-foreground">Integrasi PHP–MySQL.</span> Pipeline CRUD untuk INFOPROF dan CeritaKita dengan autentikasi admin.
          </li>
          <li>
            <span className="font-medium text-foreground">LivingLink Alumni.</span> Data cleansing dan segmentasi kompetensi untuk memudahkan mentoring.
          </li>
          <li>
            <span className="font-medium text-foreground">Automasi distribusi.</span> Email digest dan notifikasi ke kanal komunitas setiap minggu.
          </li>
        </ul>
        <p className="mt-6 text-xs uppercase tracking-[0.26em] text-primary/80">Diselaraskan dengan roadmap ARCADE 2025–2026</p>
      </div>
    </section>
  );
}

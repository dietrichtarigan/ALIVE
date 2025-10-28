import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArcadeEvent } from "@/data/events";

const eventFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "short",
  day: "2-digit",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

interface EventsGalleryProps {
  events: ArcadeEvent[];
}

export default function EventsGallery({ events }: EventsGalleryProps) {
  const upcoming = events.filter((event) => event.isUpcoming);
  const archive = events.filter((event) => !event.isUpcoming);

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase text-primary">Agenda Mendatang</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Temui Alumni, Jelajahi Industri</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Semua event ARCADE dikurasi untuk mempertemukan massa HIMAFI dengan alumni, recruiter, dan mentor profesional.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {upcoming.map((event) => (
            <Card key={event.id} className="border-border/40">
              <div className={`h-36 w-full rounded-t-xl bg-linear-to-br ${event.posterColor}`}></div>
              <CardHeader className="space-y-4">
                <Badge variant="outline" className="border-primary/40 text-primary">
                  {event.category}
                </Badge>
                <CardTitle className="text-xl leading-tight">{event.title}</CardTitle>
                <CardDescription className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <span>{eventFormatter.format(new Date(event.date))}</span>
                  <span>{event.location}</span>
                  <span>Host: {event.host}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {event.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {event.registrationLink && (
                  <Button asChild className="w-full">
                    <a href={event.registrationLink} target="_blank" rel="noreferrer">
                      Daftar Sekarang
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Arsip Event</p>
            <h2 className="text-2xl font-semibold">Belajar dari jejak kolaborasi sebelumnya</h2>
          </div>
        </div>
        <div className="grid gap-4">
          {archive.map((event) => (
            <Card key={event.id} className="border-border/30 bg-muted/10">
              <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription>{eventFormatter.format(new Date(event.date))}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-border/60 text-xs uppercase tracking-wide">
                    {event.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{event.location}</span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-muted-foreground md:max-w-2xl">
                  {event.description}
                </p>
                {event.documentationLink && (
                  <Button asChild variant="ghost" size="sm" className="text-primary">
                    <a href={event.documentationLink} target="_blank" rel="noreferrer">
                      Lihat Dokumentasi
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

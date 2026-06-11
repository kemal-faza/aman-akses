import { Ear, Eye, Accessibility } from "lucide-react";

interface HeroBannerProps {
  greeting: string;
}

export function HeroBanner({ greeting }: HeroBannerProps) {
  return (
    <section
      className="flex flex-col gap-6 rounded-xl border border-border bg-background p-12 sm:flex-row sm:items-center sm:gap-10"
      aria-labelledby="hero-heading"
    >
      <div className="flex-1">
        <h1
          id="hero-heading"
          className="text-display-md font-bold leading-display-md tracking-display-md text-foreground"
        >
          {greeting}
        </h1>
        <p className="mt-3 max-w-[500px] text-body-md leading-body-md text-muted-foreground">
          AmanAkses hadir sebagai ruang aman untuk memahami, mendokumentasikan,
          dan melaporkan pengalaman — dengan kendali penuh di tangan Anda.
        </p>
      </div>
      <div className="flex gap-4" aria-hidden="true">
        <Eye className="h-12 w-12 text-primary/60" />
        <Ear className="h-12 w-12 text-primary/80" />
        <Accessibility className="h-12 w-12 text-primary" />
      </div>
    </section>
  );
}

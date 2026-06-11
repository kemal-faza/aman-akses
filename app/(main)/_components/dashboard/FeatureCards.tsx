import Link from "next/link";
import {
  BookOpen,
  PenLine,
  GitBranch,
  FolderLock,
  Users,
  FileText,
  type LucideIcon,
} from "lucide-react";
import type { FeatureCardData } from "@/lib/types";

interface FeatureCardsProps {
  features: FeatureCardData[];
}

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  PenLine,
  GitBranch,
  FolderLock,
  Users,
  FileText,
};

const badgeBackgrounds: Record<string, string> = {
  orange: "bg-badge-orange/15 text-badge-orange",
  blue: "bg-badge-blue/15 text-badge-blue",
  violet: "bg-badge-violet/15 text-badge-violet",
  pink: "bg-badge-pink/15 text-badge-pink",
  teal: "bg-badge-teal/15 text-badge-teal",
  emerald: "bg-badge-emerald/15 text-badge-emerald",
};

export function FeatureCards({ features }: FeatureCardsProps) {
  return (
    <section aria-labelledby="feature-cards-heading">
      <h2
        id="feature-cards-heading"
        className="mb-4 text-title-md font-semibold text-foreground"
      >
        Akses Cepat Fitur
      </h2>
      <nav className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => {
          const Icon = iconMap[f.icon] ?? FileText;
          return (
            <Link
              key={f.href}
              href={f.href}
              className="group rounded-xl border border-border bg-background p-6 transition-colors hover:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${badgeBackgrounds[f.badgeColor]}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-title-md font-semibold leading-title-md text-foreground">
                {f.title}
              </h3>
              <p className="mt-1 text-body-sm leading-body-sm text-muted-foreground">
                {f.description}
              </p>
              <span className="mt-3 inline-block text-sm font-medium text-primary">
                Pelajari lebih lanjut &rarr;
              </span>
            </Link>
          );
        })}
      </nav>
    </section>
  );
}

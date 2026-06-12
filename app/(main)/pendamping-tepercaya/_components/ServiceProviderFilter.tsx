"use client";

import { SERVICE_CATEGORY_LABELS, type ServiceCategory } from "@/lib/companion-types";

const CATEGORIES: (ServiceCategory | "all")[] = [
  "all",
  "hotline",
  "satgas-ppks",
  "legal-aid",
  "psychologist",
  "social-service",
];

interface ServiceProviderFilterProps {
  active: ServiceCategory | "all";
  onSelect: (category: ServiceCategory | "all") => void;
}

export function ServiceProviderFilter({ active, onSelect }: ServiceProviderFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" role="radiogroup" aria-label="Filter kategori penyedia layanan">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat;
        const label = cat === "all" ? "Semua" : SERVICE_CATEGORY_LABELS[cat];
        return (
          <button
            key={cat}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onSelect(cat)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors
              border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
              ${isActive
                ? "bg-sidebar-accent text-primary-text border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary/30"
              }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

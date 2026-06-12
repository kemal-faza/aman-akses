"use client";

import { EVIDENCE_CATEGORIES } from "@/lib/vault-types";
import type { EvidenceCategory } from "@/lib/vault-types";

interface VaultCategoryTabsProps {
  active: EvidenceCategory | "all";
  counts: Partial<Record<EvidenceCategory, number>>;
  onSelect: (category: EvidenceCategory | "all") => void;
}

export function VaultCategoryTabs({ active, counts, onSelect }: VaultCategoryTabsProps) {
  const total = Object.values(counts).reduce((sum, c) => sum + (c ?? 0), 0);

  const tabs: { value: EvidenceCategory | "all"; label: string; count: number }[] = [
    { value: "all", label: "Semua", count: total },
    ...EVIDENCE_CATEGORIES.map((cat) => ({
      value: cat.value,
      label: cat.label,
      count: counts[cat.value] ?? 0,
    })),
  ];

  return (
    <nav className="flex gap-1 border-b-2 border-border mb-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" role="tablist" aria-label="Kategori berkas">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={active === tab.value}
          onClick={() => onSelect(tab.value)}
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 -mb-[2px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            active === tab.value
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.label}
          {tab.count > 0 && (
            <span className="ml-1.5 text-xs text-muted-foreground">
              ({tab.count})
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}

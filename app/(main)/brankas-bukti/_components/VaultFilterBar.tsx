"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

interface FilterBarProps {
  filters: {
    quickChips: ("latest" | "linked-to-journal" | "locked")[];
    searchQuery: string;
    advanced: { dateFrom?: string; dateTo?: string; tags?: string[] };
  };
  onFiltersChange: (filters: FilterBarProps["filters"]) => void;
}

const QUICK_CHIPS: { value: "latest" | "linked-to-journal" | "locked"; label: string }[] = [
  { value: "latest", label: "Terbaru" },
  { value: "linked-to-journal", label: "Terlampir Jurnal" },
  { value: "locked", label: "Terkunci" },
];

export function VaultFilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleChip = (chip: "latest" | "linked-to-journal" | "locked") => {
    const chips = filters.quickChips.includes(chip)
      ? filters.quickChips.filter((c) => c !== chip)
      : [...filters.quickChips, chip];
    onFiltersChange({ ...filters, quickChips: chips });
  };

  return (
    <div className="mb-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        aria-expanded={expanded}
      >
        <Filter className="w-3.5 h-3.5" />
        Filter
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {filters.quickChips.length > 0 && (
          <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full">
            {filters.quickChips.length}
          </span>
        )}
      </button>

      {expanded && (
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip.value}
              onClick={() => toggleChip(chip.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filters.quickChips.includes(chip.value)
                  ? "bg-primary/10 text-primary"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

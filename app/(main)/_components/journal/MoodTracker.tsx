"use client";

import { MOOD_OPTIONS } from "@/lib/types";
import type { Mood } from "@/lib/types";
import { SmilePlus, Smile, Meh, Frown, Annoyed } from "lucide-react";

const ICON_MAP: Record<Mood, typeof Smile> = {
  "sangat-baik": SmilePlus,
  "baik": Smile,
  "biasa": Meh,
  "sedih": Frown,
  "sangat-sedih": Annoyed,
};

interface MoodTrackerProps {
  value: Mood | null;
  onChange: (mood: Mood) => void;
}

export function MoodTracker({ value, onChange }: MoodTrackerProps) {
  return (
    <div className="flex items-center gap-3" role="radiogroup" aria-label="Suasana Hati">
      {MOOD_OPTIONS.map((opt) => {
        const Icon = ICON_MAP[opt.value];
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={opt.label}
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center gap-1 p-2 rounded-md transition-all
              ${isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground hover:scale-105"}
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
          >
            <Icon className="w-7 h-7" />
            <span className="text-[10px] leading-tight">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

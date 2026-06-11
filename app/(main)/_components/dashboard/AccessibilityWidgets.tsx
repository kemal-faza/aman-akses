"use client";

import { Ear, Mic, Hand, Contrast } from "lucide-react";
import { useAccessibility, type AccessibilityState } from "@/lib/accessibility-context";

const toggles: {
  key: keyof AccessibilityState;
  label: string;
  icon: typeof Ear;
}[] = [
  { key: "screenReader", label: "Screen Reader", icon: Ear },
  { key: "voiceNote", label: "Catatan Suara", icon: Mic },
  { key: "signLanguage", label: "Bahasa Isyarat", icon: Hand },
  { key: "highContrast", label: "Kontras Tinggi", icon: Contrast },
];

export function AccessibilityWidgets() {
  const { state, toggle } = useAccessibility();

  return (
    <section aria-labelledby="a11y-heading">
      <h2 id="a11y-heading" className="mb-4 text-title-md font-semibold text-foreground">
        Aksesibilitas
      </h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {toggles.map(({ key, label, icon: Icon }) => {
          const isActive = state[key];
          return (
            <button
              key={key}
              role="switch"
              aria-checked={isActive}
              aria-label={`Toggle ${label}`}
              onClick={() => toggle(key)}
              className={`flex flex-col items-center gap-2 rounded-xl border p-5 text-center transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                isActive
                  ? "border-primary bg-accent"
                  : "border-border bg-accent"
              }`}
            >
              <Icon
                className={`h-6 w-6 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span className="text-sm font-semibold text-foreground">{label}</span>
              <span className="text-xs text-muted-foreground">
                {isActive ? "Aktif" : "Nonaktif"}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

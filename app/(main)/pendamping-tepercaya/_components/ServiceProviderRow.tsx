"use client";

import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import type { ServiceProvider } from "@/lib/companion-types";
import { createElement } from "react";

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    hotline: "bg-badge-pink",
    "satgas-ppks": "bg-badge-blue",
    "legal-aid": "bg-badge-violet",
    psychologist: "bg-badge-teal",
    "social-service": "bg-badge-emerald",
  };
  return colors[category] ?? "bg-muted";
}

function getContactUrl(provider: ServiceProvider): { url: string; isWa: boolean } {
  if (provider.waNumber) {
    const cleaned = provider.waNumber.replace(/^0/, "62").replace(/[^0-9]/g, "");
    return { url: `https://wa.me/${cleaned}`, isWa: true };
  }
  return { url: `tel:${provider.phone.replace(/[^0-9+]/g, "")}`, isWa: false };
}

interface ServiceProviderRowProps {
  provider: ServiceProvider;
}

export function ServiceProviderRow({ provider }: ServiceProviderRowProps) {
  const iconModule = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[provider.icon];
  const IconComponent = iconModule ?? LucideIcons.HelpCircle;

  const { url } = getContactUrl(provider);

  const handleHubungi = () => {
    window.open(url, "_blank");
  };

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 bg-background border border-border rounded-lg
        hover:border-primary/20 transition-colors"
    >
      {/* Icon */}
      <div
        className={`w-9 h-9 rounded-full ${getCategoryColor(provider.category)}
          flex items-center justify-center flex-shrink-0`}
        aria-hidden="true"
      >
        {createElement(IconComponent, { className: "size-4 text-white" })}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-title-sm font-semibold text-foreground truncate">{provider.name}</h4>
        <p className="text-body-sm text-muted-foreground truncate">
          {provider.description} &middot; {provider.address}
        </p>
      </div>

      {/* Status badge */}
      <span
        className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
          provider.isAvailable
            ? "bg-success text-[#064e3b]"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {provider.isAvailable ? "Tersedia" : "Tutup"}
      </span>

      {/* Hubungi button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="shrink-0"
        aria-label={`Hubungi ${provider.name}`}
        onClick={handleHubungi}
      >
        Hubungi
      </Button>
    </div>
  );
}

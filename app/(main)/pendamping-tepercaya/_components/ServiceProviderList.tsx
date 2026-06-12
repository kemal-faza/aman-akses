"use client";

import { ServiceProviderRow } from "./ServiceProviderRow";
import type { ServiceProvider } from "@/lib/companion-types";

interface ServiceProviderListProps {
  providers: ServiceProvider[];
}

export function ServiceProviderList({ providers }: ServiceProviderListProps) {
  if (providers.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        Tidak ada penyedia layanan untuk kategori ini.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {providers.map((provider) => (
        <ServiceProviderRow key={provider.id} provider={provider} />
      ))}
    </div>
  );
}

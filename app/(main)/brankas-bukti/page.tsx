"use client";

import { VaultProvider } from "@/lib/vault-context";
import { BrankasBuktiClient } from "./_components/BrankasBuktiClient";

export default function BrankasBuktiPage() {
  return (
    <VaultProvider>
      <BrankasBuktiClient />
    </VaultProvider>
  );
}

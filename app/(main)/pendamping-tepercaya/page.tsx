"use client";

import { CompanionProvider } from "@/lib/companion-context";
import { PendampingClient } from "./_components/PendampingClient";

export default function PendampingTepercayaPage() {
  return (
    <CompanionProvider>
      <PendampingClient />
    </CompanionProvider>
  );
}

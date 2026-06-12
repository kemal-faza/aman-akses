"use client";

import { Plus } from "lucide-react";
import { CompanionCard } from "./CompanionCard";
import type { TrustedContact } from "@/lib/companion-types";

interface CompanionGridProps {
  contacts: TrustedContact[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function CompanionGrid({ contacts, onSelect, onDelete, onAdd }: CompanionGridProps) {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-12 px-4 border border-dashed border-muted rounded-lg">
        <p className="text-muted-foreground mb-4">
          Belum ada pendamping. Tambahkan orang yang kamu percaya.
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md
            bg-primary text-primary-foreground text-sm font-semibold
            hover:bg-primary/90 transition-colors"
        >
          <Plus className="size-4" />
          Tambah Pendamping
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {contacts.map((contact) => (
        <CompanionCard
          key={contact.id}
          contact={contact}
          onClick={onSelect}
          onDelete={onDelete}
        />
      ))}
      {/* Add card */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Tambah pendamping baru"
        onClick={onAdd}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onAdd();
          }
        }}
        className="bg-background border border-dashed border-primary rounded-lg p-5
          flex flex-col items-center justify-center min-h-[200px] cursor-pointer
          hover:bg-sidebar-accent/30 transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="w-12 h-12 rounded-full bg-sidebar-accent flex items-center justify-center mb-3">
          <Plus className="size-6 text-primary" />
        </div>
        <p className="text-sm font-medium text-primary">Tambah Pendamping</p>
      </div>
    </div>
  );
}

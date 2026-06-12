"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompanion } from "@/lib/companion-context";
import { CompanionGrid } from "./CompanionGrid";
import { CompanionSheet } from "./CompanionSheet";
import { CompanionDeleteDialog } from "./CompanionDeleteDialog";
import { ServiceProviderFilter } from "./ServiceProviderFilter";
import { ServiceProviderList } from "./ServiceProviderList";

export function PendampingClient() {
  const {
    state,
    openAddSheet,
    openEditSheet,
    closeSheet,
    setFilter,
    deleteContact,
  } = useCompanion();

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const selectedContact = state.selectedContactId
    ? state.contacts.find((c) => c.id === state.selectedContactId) ?? null
    : null;

  const filteredProviders =
    state.activeFilter === "all"
      ? state.providers
      : state.providers.filter((p) => p.category === state.activeFilter);

  if (state.loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-md font-bold text-foreground">
            Pendamping Tepercaya
          </h1>
          <p className="text-body-sm text-muted-foreground mt-1">
            Kelola kontak pendamping dan penyedia layanan dukungan.
          </p>
        </div>
        <Button onClick={openAddSheet} className="gap-2">
          <Plus className="size-4" />
          Tambah
        </Button>
      </div>

      {/* Section 1: Pendamping Personal */}
      <section>
        <h2 className="text-title-lg font-semibold text-foreground mb-4">
          Pendamping Personal
        </h2>
        <CompanionGrid
          contacts={state.contacts}
          onSelect={openEditSheet}
          onDelete={(id) => setDeleteTarget(id)}
          onAdd={openAddSheet}
        />
      </section>

      {/* Section 2: Penyedia Layanan Dukungan */}
      <section>
        <h2 className="text-title-lg font-semibold text-foreground mb-4">
          Penyedia Layanan Dukungan
        </h2>
        <div className="space-y-3">
          <ServiceProviderFilter active={state.activeFilter} onSelect={setFilter} />
          <ServiceProviderList providers={filteredProviders} />
        </div>
      </section>

      {/* Sheet */}
      {(state.sheetMode === "add" || (state.sheetMode === "edit" && selectedContact)) && (
        <CompanionSheet
          mode={state.sheetMode}
          contact={selectedContact}
          open={true}
          onClose={closeSheet}
        />
      )}

      {/* Delete Dialog */}
      {deleteTarget && (
        <CompanionDeleteDialog
          contactName={
            state.contacts.find((c) => c.id === deleteTarget)?.name ?? ""
          }
          open={true}
          onConfirm={() => {
            deleteContact(deleteTarget);
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

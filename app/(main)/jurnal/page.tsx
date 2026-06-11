"use client";

import { useState } from "react";
import { useJournal } from "@/lib/journal-context";
import { JournalList } from "../_components/journal/JournalList";
import { JournalSheet } from "../_components/journal/JournalSheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { JournalEntryInput, JournalNote } from "@/lib/types";

export default function JurnalAmanPage() {
  const { entries, loading, error, createEntry, updateEntry, deleteEntry } = useJournal();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"create" | "edit">("create");
  const [editingEntry, setEditingEntry] = useState<JournalNote | undefined>(undefined);

  const handleNewEntry = () => {
    setSheetMode("create");
    setEditingEntry(undefined);
    setSheetOpen(true);
  };

  const handleEditEntry = (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (entry) {
      setEditingEntry(entry);
      setSheetMode("edit");
      setSheetOpen(true);
    }
  };

  const handleSave = async (input: JournalEntryInput) => {
    if (sheetMode === "edit" && editingEntry) {
      await updateEntry(editingEntry.id, input);
    } else {
      await createEntry(input);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus catatan ini? Tindakan ini tidak bisa dibatalkan.")) {
      deleteEntry(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-md font-bold text-foreground">Jurnal Aman</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ruang pribadi untuk mencatat pengalaman Anda.
          </p>
        </div>
        {!loading && entries.length > 0 && (
          <Button onClick={handleNewEntry}>
            <Plus className="w-4 h-4 mr-2" />
            Tulis Catatan Baru
          </Button>
        )}
      </div>

      {/* List */}
      <JournalList
        entries={entries}
        loading={loading}
        error={error}
        onDelete={handleDelete}
        onNewEntry={handleNewEntry}
        onEditEntry={handleEditEntry}
      />

      {/* Sheet */}
      <JournalSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        mode={sheetMode}
        entry={editingEntry}
        onSave={handleSave}
      />
    </div>
  );
}

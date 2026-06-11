"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NoteChecklist } from "./NoteChecklist"
import { useWizard } from "@/lib/wizard-context"
import { mockJournalNotes } from "@/lib/mock-data"

export function StepPilih() {
  const { state, dispatch } = useWizard()
  const selectedCount = state.selectedNoteIds.length

  const handleToggle = (noteId: string) => {
    const newIds = state.selectedNoteIds.includes(noteId)
      ? state.selectedNoteIds.filter((id) => id !== noteId)
      : [...state.selectedNoteIds, noteId]
    dispatch({ type: "SELECT_NOTES", noteIds: newIds })
  }

  const handleLanjutkan = () => {
    dispatch({ type: "START_PROCESSING" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-title-md font-semibold">Pilih Catatan</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Pilih catatan jurnal yang ingin disusun menjadi kronologi
          </p>
        </div>
        <Badge variant="default" size="lg">
          {selectedCount} catatan dipilih
        </Badge>
      </div>

      <NoteChecklist
        notes={mockJournalNotes}
        selectedIds={state.selectedNoteIds}
        onToggle={handleToggle}
      />

      <div className="flex justify-end pt-4">
        <Button
          disabled={selectedCount === 0}
          onClick={handleLanjutkan}
          size="xl"
        >
          Lanjutkan
        </Button>
      </div>
    </div>
  )
}

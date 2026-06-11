"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { JournalNote } from "@/lib/types"

interface NoteChecklistProps {
  notes: JournalNote[]
  selectedIds: string[]
  onToggle: (noteId: string) => void
}

export function NoteChecklist({ notes, selectedIds, onToggle }: NoteChecklistProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Belum ada catatan.</p>
        <p className="text-sm mt-1">Buat catatan di Jurnal Aman terlebih dahulu.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3" role="list" aria-label="Daftar catatan jurnal">
      {notes.map((note) => {
        const isSelected = selectedIds.includes(note.id)
        return (
          <div
            key={note.id}
            role="listitem"
            className={cn(
              "bg-background border rounded-lg p-6 transition-colors cursor-pointer",
              "focus-within:ring-2 focus-within:ring-ring",
              isSelected ? "border-primary/50 bg-primary/5" : "border-border",
              "hover:border-primary/30",
            )}
            onClick={() => onToggle(note.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onToggle(note.id)
              }
            }}
            tabIndex={0}
            aria-selected={isSelected}
          >
            <div className="flex gap-4">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggle(note.id)}
                aria-label={`Pilih catatan: ${note.title}`}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold truncate">{note.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{note.date}</p>
                <p className="text-sm mt-2 line-clamp-2 text-muted-foreground">
                  {note.content}
                </p>
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

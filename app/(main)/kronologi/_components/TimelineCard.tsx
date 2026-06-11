"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { TimelineItem, TimelineItemStatus, EditableTimelineFields } from "@/lib/types"

interface TimelineCardProps {
  item: TimelineItem
  status: TimelineItemStatus
  editedData: Partial<EditableTimelineFields> | null
  onAccept: (id: string) => void
  onReject: (id: string) => void
  onEdit: (id: string) => void
  onUndo: (id: string) => void
  onSaveEdit: (id: string, data: Partial<EditableTimelineFields>) => void
  onCancelEdit: (id: string) => void
}

export function TimelineCard({
  item,
  status,
  editedData,
  onAccept,
  onReject,
  onEdit,
  onUndo,
  onSaveEdit,
  onCancelEdit,
}: TimelineCardProps) {
  const [editForm, setEditForm] = useState<Partial<EditableTimelineFields>>({})

  const isEditing = status === "editing"

  const borderColor = {
    draft: "border-l-warning",
    editing: "border-l-warning",
    accepted: "border-l-success",
    rejected: "border-l-muted",
  }[status]

  const badgeConfig = {
    draft: { label: "Draft AI", variant: "warning" as const },
    editing: { label: "Draft AI", variant: "warning" as const },
    accepted: { label: "Diterima", variant: "success" as const },
    rejected: { label: "Ditolak", variant: "outline" as const },
  }[status]

  // Merge item data with edits
  const displayData = {
    date: editedData?.date ?? item.date,
    time: editedData?.time ?? item.time,
    location: editedData?.location ?? item.location,
    title: editedData?.title ?? item.title,
    description: editedData?.description ?? item.description,
  }

  const handleStartEdit = () => {
    setEditForm({
      date: displayData.date,
      time: displayData.time,
      location: displayData.location,
      title: displayData.title,
      description: displayData.description,
    })
    onEdit(item.id)
  }

  const handleSave = () => {
    // Only send changed fields
    const changes: Partial<EditableTimelineFields> = {}
    if (editForm.title !== item.title) changes.title = editForm.title
    if (editForm.date !== item.date) changes.date = editForm.date
    if (editForm.time !== item.time) changes.time = editForm.time ?? null
    if (editForm.location !== item.location) changes.location = editForm.location ?? null
    if (editForm.description !== item.description) changes.description = editForm.description
    onSaveEdit(item.id, changes)
  }

  const handleCancel = () => {
    onCancelEdit(item.id)
  }

  const timeDisplay = displayData.time ? `, ${displayData.time}` : ""
  const headerText = `${displayData.date}${timeDisplay}`

  const sourceText =
    "Sumber: " +
    item.sourceNoteIds.map((id) => `Catatan ${id.replace("note-", "#")}`).join(", ")

  return (
    <div
      className={cn(
        "bg-background border border-border rounded-md p-4 border-l-[3px]",
        borderColor,
      )}
      role="article"
      aria-label={`Item timeline: ${displayData.title}`}
    >
      {/* Header: Date + Badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3
          className={cn(
            "text-sm font-semibold",
            status === "rejected" && "line-through text-muted-foreground",
          )}
        >
          {headerText}
        </h3>
        <Badge variant={badgeConfig.variant} size="sm">
          {badgeConfig.label}
        </Badge>
      </div>

      {/* Fields */}
      <div
        className={cn(
          "space-y-3",
          status === "rejected" && "opacity-50",
        )}
      >
        {isEditing ? (
          <>
            {/* Edit mode: Input fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor={`date-${item.id}`}>Tanggal</Label>
                <Input
                  id={`date-${item.id}`}
                  value={editForm.date ?? ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, date: e.target.value }))
                  }
                  placeholder="YYYY-MM-DD"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`time-${item.id}`}>Waktu</Label>
                <Input
                  id={`time-${item.id}`}
                  value={editForm.time ?? ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, time: e.target.value || null }))
                  }
                  placeholder="HH:MM"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor={`location-${item.id}`}>Lokasi</Label>
              <Input
                id={`location-${item.id}`}
                value={editForm.location ?? ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, location: e.target.value || null }))
                }
                placeholder="Lokasi (opsional)"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`title-${item.id}`}>Judul</Label>
              <Input
                id={`title-${item.id}`}
                value={editForm.title ?? ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`desc-${item.id}`}>Deskripsi</Label>
              <textarea
                id={`desc-${item.id}`}
                value={editForm.description ?? ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, description: e.target.value }))
                }
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                placeholder="Deskripsi kejadian"
              />
            </div>
          </>
        ) : (
          <>
            {/* View mode */}
            {displayData.location && (
              <FieldRow label="Lokasi" value={displayData.location} />
            )}
            <FieldRow label="Judul" value={displayData.title} />
            <FieldRow label="Deskripsi" value={displayData.description} />
          </>
        )}

        {/* Source notes */}
        <p className="text-xs text-primary-text mt-2">{sourceText}</p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-border">
        {status === "draft" && (
          <>
            <Button
              size="sm"
              className="bg-success hover:bg-success/90 text-white"
              onClick={() => onAccept(item.id)}
            >
              Terima
            </Button>
            <Button variant="outline" size="sm" onClick={handleStartEdit}>
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => onReject(item.id)}
            >
              Tolak
            </Button>
          </>
        )}
        {status === "editing" && (
          <>
            <Button variant="outline" size="sm" onClick={handleSave}>
              Simpan
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Batal
            </Button>
          </>
        )}
        {status === "accepted" && (
          <Button variant="ghost" size="sm" onClick={() => onUndo(item.id)}>
            Batalkan Penerimaan
          </Button>
        )}
        {status === "rejected" && (
          <Button variant="ghost" size="sm" onClick={() => onUndo(item.id)}>
            Batalkan Penolakan
          </Button>
        )}
      </div>
    </div>
  )
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-muted-foreground">{label}</span>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  )
}

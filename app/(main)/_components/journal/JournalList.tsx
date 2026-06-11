"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Mood, JournalNote } from "@/lib/types";
import { SmilePlus, Smile, Meh, Frown, Annoyed, Trash2, Plus, FileText } from "lucide-react";

const MOOD_ICON: Record<Mood, typeof SmilePlus> = {
  "sangat-baik": SmilePlus,
  baik: Smile,
  biasa: Meh,
  sedih: Frown,
  "sangat-sedih": Annoyed,
};

const MOOD_LABEL: Record<Mood, string> = {
  "sangat-baik": "Sangat Baik",
  baik: "Baik",
  biasa: "Biasa Saja",
  sedih: "Sedih",
  "sangat-sedih": "Sangat Sedih",
};

interface JournalListProps {
  entries: JournalNote[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
  onNewEntry: () => void;
  onEditEntry: (id: string) => void;
  onRetry?: () => void;
}

function JournalCard({
  entry,
  onEdit,
  onDelete,
}: {
  entry: JournalNote;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const MoodIcon = entry.mood ? MOOD_ICON[entry.mood] : null;

  return (
    <div className="border border-border rounded-lg p-6 hover:border-primary/30 transition-colors cursor-pointer group bg-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0" onClick={onEdit}>
          <div className="flex items-center gap-3 mb-2">
            <time className="text-sm text-muted-foreground">
              {new Date(entry.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            {MoodIcon && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MoodIcon className="w-4 h-4" />
                {MOOD_LABEL[entry.mood!]}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-foreground mb-1 truncate">{entry.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>
          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {entry.tags.map((tag) => (
                <Badge key={tag} variant="secondary" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Hapus catatan"
          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function JournalList({
  entries,
  loading,
  error,
  onDelete,
  onNewEntry,
  onEditEntry,
  onRetry,
}: JournalListProps) {
  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-border rounded-lg p-6 animate-pulse">
            <Skeleton className="h-4 w-32 mb-3" />
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-destructive">Gagal memuat catatan</p>
        <p className="text-sm text-muted-foreground">{error}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="mt-2">
            Coba Lagi
          </Button>
        )}
      </div>
    );
  }

  // Empty state
  if (entries.length === 0) {
    return (
      <div className="text-center py-16 space-y-5">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Belum ada catatan</h3>
          <p className="text-sm text-muted-foreground">
            Mulai tulis catatan pertama Anda.
          </p>
        </div>
        <Button onClick={onNewEntry}>
          <Plus className="w-4 h-4 mr-2" />
          Tulis Catatan Pertama
        </Button>
      </div>
    );
  }

  // Populated state
  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [entries],
  );

  return (
    <div className="space-y-3">
      {sortedEntries.map((entry) => (
        <JournalCard
          key={entry.id}
          entry={entry}
          onEdit={() => onEditEntry(entry.id)}
          onDelete={() => onDelete(entry.id)}
        />
      ))}
    </div>
  );
}

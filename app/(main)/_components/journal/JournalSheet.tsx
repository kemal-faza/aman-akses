"use client";

import { useState, type FormEvent } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MoodTracker } from "./MoodTracker";
import type { Mood, JournalNote, JournalEntryInput } from "@/lib/types";
import { X } from "lucide-react";

interface JournalSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  entry?: JournalNote;
  onSave: (input: JournalEntryInput) => Promise<void>;
}

export function JournalSheet({ open, onOpenChange, mode, entry, onSave }: JournalSheetProps) {
  const [title, setTitle] = useState(entry?.title ?? "");
  const [date, setDate] = useState(entry?.date ?? "");
  const [content, setContent] = useState(entry?.content ?? "");
  const [mood, setMood] = useState<Mood | null>(entry?.mood ?? null);
  const [involvedParties, setInvolvedParties] = useState(entry?.involvedParties ?? "");
  const [tags, setTags] = useState<string[]>(entry?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDate("");
    setContent("");
    setMood(null);
    setInvolvedParties("");
    setTags([]);
    setTagInput("");
    setErrors({});
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) resetForm();
    onOpenChange(newOpen);
  };

  const addTag = () => {
    const cleaned = tagInput.trim().toLowerCase();
    if (cleaned && !tags.includes(cleaned)) {
      setTags([...tags, cleaned]);
    }
    setTagInput("");
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!date.trim()) newErrors.date = "Tanggal wajib diisi";
    if (!content.trim()) newErrors.title = "Judul wajib diisi";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    setErrors({});

    // Use first line of content as title, or first 100 chars
    const derivedTitle = content.trim().split("\n")[0].slice(0, 100);

    const input: JournalEntryInput = {
      title: derivedTitle,
      date: date.trim(),
      content: content.trim(),
      mood,
      involvedParties: involvedParties.trim(),
      tags,
    };

    try {
      await onSave(input);
      resetForm();
      onOpenChange(false);
    } catch {
      setErrors({ form: "Gagal menyimpan catatan. Silakan coba lagi." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle className="text-lg font-semibold">
            {mode === "create" ? "Catatan Baru" : "Edit Catatan"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} noValidate className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="journal-date">Tanggal Kejadian</Label>
            <Input
              id="journal-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
          </div>

          {/* Mood */}
          <div className="space-y-2">
            <Label>Suasana Hati</Label>
            <MoodTracker value={mood} onChange={setMood} />
          </div>

          {/* Content / Description */}
          <div className="space-y-2">
            <Label htmlFor="journal-content">Apa yang terjadi?</Label>
            <textarea
              id="journal-content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
              placeholder="Ceritakan apa yang terjadi..."
              required
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          {/* Involved Parties */}
          <div className="space-y-2">
            <Label htmlFor="journal-parties">Siapa yang terlibat?</Label>
            <Input
              id="journal-parties"
              value={involvedParties}
              onChange={(e) => setInvolvedParties(e.target.value)}
              placeholder="Nama atau deskripsi pihak yang terlibat"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Tambah tag..."
              />
              <Button type="button" variant="outline" size="sm" onClick={addTag}>
                Tambah
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" size="sm">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                      aria-label={`Hapus tag ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Form error */}
          {errors.form && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-md p-3">{errors.form}</p>
          )}

          {/* Submit */}
          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Menyimpan..." : mode === "create" ? "Simpan Catatan" : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

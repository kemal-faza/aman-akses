"use client";

import { X, Download, Pencil, Trash2, Link } from "lucide-react";
import type { EvidenceFile } from "@/lib/vault-types";
import { formatFileSize } from "@/lib/vault-utils";

interface VaultFileDrawerProps {
  file: EvidenceFile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDownload: (id: string) => void;
  onLinkNote: (id: string) => void;
}

export function VaultFileDrawer({
  file, open, onOpenChange,
  onDelete, onRename, onDownload, onLinkNote,
}: VaultFileDrawerProps) {
  if (!open) return null;

  const displayDate = () => {
    const [y, m, d] = file.uploadedAt.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
  };

  return (
    <>
      <div className="fixed inset-0 bg-background/50 z-40" onClick={() => onOpenChange(false)} aria-hidden="true" />
      <div
        className="fixed right-0 top-0 h-full w-[380px] max-w-[90vw] bg-card border-l border-border z-50 overflow-y-auto shadow-none"
        role="dialog"
        aria-label={`Detail berkas: ${file.name}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground truncate pr-2">{file.name}</h3>
          <button onClick={() => onOpenChange(false)} className="p-1 rounded-md hover:bg-muted transition-colors" aria-label="Tutup drawer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="h-48 bg-muted flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Pratinjau berkas</p>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground mb-0.5">Kategori</div>
              <div className="font-medium capitalize">{file.category === "medical" ? "Catatan Medis" : file.category}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-0.5">Ukuran</div>
              <div className="font-medium">{formatFileSize(file.sizeBytes)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-0.5">Tanggal Upload</div>
              <div className="font-medium">{displayDate()}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-0.5">Tipe</div>
              <div className="font-medium">{file.mimeType.split("/")[1]?.toUpperCase() || file.mimeType}</div>
            </div>
          </div>

          {file.tags.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-1.5">Tags</div>
              <div className="flex flex-wrap gap-1.5">
                {file.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-muted rounded-full text-xs">{tag}</span>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-xs text-muted-foreground">{file.linkedNoteIds.length} catatan terkait</div>
              <button onClick={() => onLinkNote(file.id)} className="flex items-center gap-1 text-xs text-primary-text hover:underline">
                <Link className="w-3 h-3" />
                Tautkan Catatan
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            <button onClick={() => onDownload(file.id)} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
              <Download className="w-4 h-4" />
              Unduh Berkas
            </button>
            <button onClick={() => onRename(file.id, file.name)} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
              <Pencil className="w-4 h-4" />
              Ganti Nama
            </button>
            <button onClick={() => onDelete(file.id)} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-destructive/10 text-destructive transition-colors">
              <Trash2 className="w-4 h-4" />
              Hapus Berkas
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

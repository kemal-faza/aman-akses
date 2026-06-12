"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Camera, Mic, MessageCircle, FileText, X } from "lucide-react";
import {
  EVIDENCE_CATEGORIES,
  type EvidenceCategory,
  type AddFileInput,
} from "@/lib/vault-types";
import { detectCategory } from "@/lib/vault-utils";

type UploadTab = "upload" | "capture" | "journal";

interface VaultUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (input: AddFileInput) => Promise<void>;
}

export function VaultUploadDialog({ open, onOpenChange, onUpload }: VaultUploadDialogProps) {
  const [tab, setTab] = useState<UploadTab>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<EvidenceCategory>("photo");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setSelectedFile(null);
    setCategory("photo");
    setTags("");
    setUploading(false);
  }, []);

  if (!open) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setCategory(detectCategory(file.type));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCategory(detectCategory(file.type));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      await onUpload({
        name: selectedFile.name,
        mimeType: selectedFile.type || "application/octet-stream",
        category,
        sizeBytes: selectedFile.size,
        source: { type: "upload", method: "file-picker" },
        linkedNoteIds: [],
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        file: selectedFile,
      });
      reset();
      onOpenChange(false);
    } catch {
      // Error handling in vault context
    } finally {
      setUploading(false);
    }
  };

  const handleCapture = (method: string) => {
    if (fileInputRef.current) {
      if (method === "camera") {
        fileInputRef.current.accept = "image/*";
        fileInputRef.current.setAttribute("capture", "environment");
      } else if (method === "recorder") {
        fileInputRef.current.accept = "audio/*";
      } else {
        fileInputRef.current.accept = "text/plain,.txt,.json,.csv";
      }
      fileInputRef.current.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-lg w-full shadow-none">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Tambah Berkas</h2>
          <button onClick={() => onOpenChange(false)} className="p-1 rounded-md hover:bg-muted transition-colors" aria-label="Tutup dialog">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-border" role="tablist">
          {[
            { id: "upload" as const, label: "Upload", icon: Upload },
            { id: "capture" as const, label: "Capture", icon: Camera },
            { id: "journal" as const, label: "Jurnal", icon: FileText },
          ].map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium border-b-2 -mb-[1px] transition-colors ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {tab === "upload" && (
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Klik atau seret ke sini</p>
              <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG, MP3, WAV, PDF, TXT (max 50MB)</p>
            </div>
          )}

          {tab === "capture" && (
            <div className="space-y-3">
              <button onClick={() => handleCapture("camera")} className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <Camera className="w-6 h-6 text-primary" />
                <div className="text-left">
                  <div className="text-sm font-medium">Kamera</div>
                  <div className="text-xs text-muted-foreground">Ambil foto langsung</div>
                </div>
              </button>
              <button onClick={() => handleCapture("recorder")} className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <Mic className="w-6 h-6 text-primary" />
                <div className="text-left">
                  <div className="text-sm font-medium">Rekam Audio</div>
                  <div className="text-xs text-muted-foreground">Rekam suara langsung</div>
                </div>
              </button>
              <button onClick={() => handleCapture("screenshot")} className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <MessageCircle className="w-6 h-6 text-primary" />
                <div className="text-left">
                  <div className="text-sm font-medium">Chat / Teks</div>
                  <div className="text-xs text-muted-foreground">Upload tangkapan layar atau file chat</div>
                </div>
              </button>
            </div>
          )}

          {tab === "journal" && (
            <div className="text-center py-8">
              <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Lampirkan berkas dari catatan Jurnal. Fitur ini akan terintegrasi dengan JournalContext.
              </p>
            </div>
          )}

          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} aria-label="Pilih file" />

          {selectedFile && (
            <div className="mt-4 p-3 border border-border rounded-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium truncate">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</span>
              </div>

              <div className="mb-3">
                <label className="text-xs text-muted-foreground mb-1 block">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EvidenceCategory)}
                  className="w-full border border-border rounded-md px-3 py-1.5 text-sm bg-background"
                  aria-label="Pilih kategori berkas"
                >
                  {EVIDENCE_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="text-xs text-muted-foreground mb-1 block">Tags (pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="mis: visum, penting"
                  className="w-full border border-border rounded-md px-3 py-1.5 text-sm bg-background"
                  aria-label="Tags berkas"
                />
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {uploading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

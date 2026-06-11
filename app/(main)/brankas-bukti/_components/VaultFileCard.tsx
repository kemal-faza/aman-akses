"use client";

import { Image, Mic, MessageCircle, FileText, Stethoscope, Lock } from "lucide-react";
import type { EvidenceFile } from "@/lib/vault-types";
import { formatFileSize } from "@/lib/vault-utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  photo: Image,
  audio: Mic,
  chat: MessageCircle,
  document: FileText,
  medical: Stethoscope,
};

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${parseInt(d)} ${months[parseInt(m) - 1]}`;
}

interface VaultFileCardProps {
  file: EvidenceFile;
  isLocked: boolean;
  onClick: (id: string) => void;
}

export function VaultFileCard({ file, isLocked, onClick }: VaultFileCardProps) {
  const IconComponent = iconMap[file.category] || FileText;
  const showLock = isLocked || file.isLocked;

  return (
    <button
      onClick={() => onClick(file.id)}
      className="w-[140px] border border-border rounded-md overflow-hidden text-left hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label={`Berkas: ${file.name}${showLock ? " (terkunci)" : ""}`}
    >
      <div className="relative h-[100px] bg-muted flex items-center justify-center overflow-hidden">
        {showLock ? (
          <>
            <div className="absolute inset-0 bg-surface-strong flex items-center justify-center opacity-80">
              <IconComponent className="w-12 h-12 text-muted-foreground/30" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center" style={{ backdropFilter: "blur(4px)" }}>
              <Lock className="w-8 h-8 text-muted-foreground drop-shadow-lg" />
            </div>
          </>
        ) : (
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${
            file.category === "photo" ? "from-blue-50 to-pink-50" :
            file.category === "audio" ? "from-teal-50 to-blue-50" :
            file.category === "chat" ? "from-emerald-50 to-teal-50" :
            file.category === "document" ? "from-orange-50 to-amber-50" :
            "from-pink-50 to-rose-50"
          }`}>
            <IconComponent className="w-12 h-12 text-muted-foreground/50" />
          </div>
        )}
      </div>
      <div className="p-2">
        <div className="text-xs font-semibold truncate">{file.name}</div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
          {showLock && <Lock className="w-3 h-3 text-warning" />}
          <span>{formatDate(file.uploadedAt)}</span>
          <span>·</span>
          <span>{formatFileSize(file.sizeBytes)}</span>
        </div>
        {file.linkedNoteIds.length > 0 && (
          <div className="mt-1">
            <span className="inline-flex items-center gap-0.5 bg-muted/50 text-[9px] px-1.5 py-0.5 rounded-full text-muted-foreground">
              {file.linkedNoteIds.length} catatan
            </span>
          </div>
        )}
      </div>
    </button>
  );
}

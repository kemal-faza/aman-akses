"use client";

import { FolderLock } from "lucide-react";

export function VaultEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FolderLock className="w-16 h-16 text-muted-foreground/30 mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-1">Belum ada berkas</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Simpan bukti foto, rekaman audio, tangkapan layar chat, dokumen, atau catatan medis dengan aman di sini.
      </p>
    </div>
  );
}

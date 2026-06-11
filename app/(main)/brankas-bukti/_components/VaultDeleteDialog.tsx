"use client";

import { AlertTriangle } from "lucide-react";

interface VaultDeleteDialogProps {
  open: boolean;
  fileName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function VaultDeleteDialog({ open, fileName, onConfirm, onCancel }: VaultDeleteDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg p-6 max-w-sm w-full shadow-none">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Hapus berkas?</h3>
          <p className="text-sm text-muted-foreground mb-2">
            &ldquo;{fileName}&rdquo; akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
          </p>

          <div className="flex gap-2 w-full mt-4">
            <button onClick={onCancel} className="flex-1 py-2 border border-border rounded-md text-sm hover:bg-muted transition-colors">
              Batal
            </button>
            <button onClick={onConfirm} className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-semibold hover:bg-destructive/90 transition-colors">
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

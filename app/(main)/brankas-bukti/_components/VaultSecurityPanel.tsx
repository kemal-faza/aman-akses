"use client";

import { Lock, Shield, Unlock } from "lucide-react";

interface VaultSecurityPanelProps {
  isUnlocked: boolean;
  autoLockMinutes: number;
  onLock: () => void;
  onChangePin: () => void;
}

export function VaultSecurityPanel({ isUnlocked, autoLockMinutes, onLock, onChangePin }: VaultSecurityPanelProps) {
  return (
    <div className="border border-border rounded-lg p-4 bg-muted/20">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-primary" />
        <span className="font-semibold text-sm">Keamanan</span>
      </div>

      <div className="mb-3">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Status</div>
        <div className={`flex items-center gap-1.5 text-sm font-medium ${isUnlocked ? "text-success" : "text-destructive"}`}>
          <span className={`w-2 h-2 rounded-full ${isUnlocked ? "bg-success" : "bg-destructive"}`} />
          {isUnlocked ? "Terbuka" : "Terkunci"}
        </div>
      </div>

      <div className="mb-3">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">PIN</div>
        <div className="text-sm tracking-widest">******</div>
      </div>

      <div className="mb-4">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Auto-lock</div>
        <div className="text-sm">{autoLockMinutes} menit</div>
      </div>

      {isUnlocked ? (
        <button
          onClick={onLock}
          className="w-full py-2 bg-emergency text-primary-foreground rounded-md text-sm font-semibold hover:bg-emergency-hover transition-colors flex items-center justify-center gap-1.5 mb-2"
          aria-label="Kunci brankas sekarang"
        >
          <Lock className="w-3.5 h-3.5" />
          Kunci Sekarang
        </button>
      ) : (
        <div className="w-full py-2 bg-muted text-muted-foreground rounded-md text-sm text-center mb-2">
          <Unlock className="w-3.5 h-3.5 inline mr-1" />
          Masukkan PIN untuk membuka
        </div>
      )}

      <button
        onClick={onChangePin}
        className="w-full py-1.5 border border-border rounded-md text-xs text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Ganti PIN brankas"
      >
        Ganti PIN
      </button>
    </div>
  );
}

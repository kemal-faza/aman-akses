"use client";

import { Plus } from "lucide-react";

interface VaultUploadCardProps {
  onClick: () => void;
}

export function VaultUploadCard({ onClick }: VaultUploadCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-[140px] h-[170px] border border-dashed border-primary rounded-md flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label="Tambah berkas baru"
    >
      <Plus className="w-6 h-6 text-primary" />
      <span className="text-xs text-primary font-medium">Tambah Berkas</span>
    </button>
  );
}

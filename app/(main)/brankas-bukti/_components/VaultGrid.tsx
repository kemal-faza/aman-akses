"use client";

import { VaultFileCard } from "./VaultFileCard";
import { VaultUploadCard } from "./VaultUploadCard";
import { VaultEmptyState } from "./VaultEmptyState";
import type { EvidenceFile } from "@/lib/vault-types";

interface VaultGridProps {
  files: EvidenceFile[];
  isLocked: boolean;
  onFileClick: (id: string) => void;
  onUploadClick: () => void;
}

export function VaultGrid({ files, isLocked, onFileClick, onUploadClick }: VaultGridProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      <VaultUploadCard onClick={onUploadClick} />
      {files.map((file) => (
        <VaultFileCard
          key={file.id}
          file={file}
          isLocked={isLocked}
          onClick={onFileClick}
        />
      ))}
      {files.length === 0 && <div className="w-full"><VaultEmptyState /></div>}
    </div>
  );
}

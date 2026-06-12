// lib/vault-types.ts
export type EvidenceCategory = "photo" | "audio" | "chat" | "document" | "medical";

export const EVIDENCE_CATEGORIES: {
  value: EvidenceCategory;
  label: string;
  icon: string;
  badgeColor: string;
}[] = [
  { value: "photo", label: "Foto", icon: "Image", badgeColor: "badge-blue" },
  { value: "audio", label: "Audio", icon: "Mic", badgeColor: "badge-teal" },
  { value: "chat", label: "Chat", icon: "MessageCircle", badgeColor: "badge-emerald" },
  { value: "document", label: "Dokumen", icon: "FileText", badgeColor: "badge-orange" },
  { value: "medical", label: "Catatan Medis", icon: "Stethoscope", badgeColor: "badge-pink" },
];

export type EvidenceSource =
  | { type: "upload"; method: "drag-drop" | "file-picker" }
  | { type: "capture"; method: "camera" | "recorder" | "screenshot" }
  | { type: "journal"; noteId: string };

export interface EvidenceFile {
  id: string;
  name: string;
  mimeType: string;
  category: EvidenceCategory;
  sizeBytes: number;
  uploadedAt: string;
  source: EvidenceSource;
  linkedNoteIds: string[];
  tags: string[];
  isLocked: boolean;
}

export interface AddFileInput {
  name: string;
  mimeType: string;
  category: EvidenceCategory;
  sizeBytes: number;
  source: EvidenceSource;
  linkedNoteIds: string[];
  tags: string[];
  file: File | Blob;
}

export interface VaultState {
  isUnlocked: boolean;
  encryptionKey: CryptoKey | null;
  autoLockTimeoutMs: number;
  lastActivity: number;
  files: EvidenceFile[];
  activeCategory: EvidenceCategory | "all";
  activeFilters: {
    quickChips: ("latest" | "linked-to-journal" | "locked")[];
    searchQuery: string;
    advanced: {
      dateFrom?: string;
      dateTo?: string;
      tags?: string[];
    };
  };
  selectedFileId: string | null;
  loading: boolean;
  error: string | null;
}

export const DEFAULT_VAULT_STATE: VaultState = {
  isUnlocked: false,
  encryptionKey: null,
  autoLockTimeoutMs: 300000,
  lastActivity: Date.now(),
  files: [],
  activeCategory: "all",
  activeFilters: {
    quickChips: [],
    searchQuery: "",
    advanced: {},
  },
  selectedFileId: null,
  loading: true,
  error: null,
};

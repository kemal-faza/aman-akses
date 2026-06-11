// lib/vault-repository.ts
import type { EvidenceFile } from "./vault-types";

export interface VaultRepository {
  getAllFiles(): Promise<EvidenceFile[]>;
  saveFile(file: EvidenceFile): Promise<void>;
  updateFile(id: string, updates: Partial<EvidenceFile>): Promise<void>;
  deleteFile(id: string): Promise<void>;
  // Blob storage (IndexedDB)
  saveEncryptedBlob(id: string, blob: Blob): Promise<void>;
  getEncryptedBlob(id: string): Promise<Blob | null>;
  deleteEncryptedBlob(id: string): Promise<void>;
  saveThumbnail(id: string, blob: Blob): Promise<void>;
  getThumbnail(id: string): Promise<Blob | null>;
  deleteThumbnail(id: string): Promise<void>;
  // PIN
  savePinHash(hash: string): void;
  getPinHash(): string | null;
  saveSalt(salt: string): void;
  getSalt(): string | null;
  // Config
  saveAutoLock(timeoutMs: number): void;
  getAutoLock(): number;
}

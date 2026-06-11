// lib/vault-repository-localstorage.ts
import type { VaultRepository } from "./vault-repository";
import type { EvidenceFile } from "./vault-types";

const FILES_KEY = "vault:files";
const PIN_HASH_KEY = "vault:pin-hash";
const SALT_KEY = "vault:salt";
const AUTO_LOCK_KEY = "vault:auto-lock";

function openBlobDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("vault-blobs", 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files");
      }
      if (!db.objectStoreNames.contains("thumbnails")) {
        db.createObjectStore("thumbnails");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function blobDBOp(
  storeName: "files" | "thumbnails",
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const db = await openBlobDB();
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const request = fn(store);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

function blobDBGet(
  storeName: "files" | "thumbnails",
  id: string
): Promise<Blob | null> {
  return new Promise(async (resolve, reject) => {
    const db = await openBlobDB();
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

export function createLocalStorageVaultRepository(): VaultRepository {
  return {
    async getAllFiles(): Promise<EvidenceFile[]> {
      const raw = localStorage.getItem(FILES_KEY);
      return raw ? JSON.parse(raw) : [];
    },

    async saveFile(file: EvidenceFile): Promise<void> {
      const files = await this.getAllFiles();
      files.push(file);
      localStorage.setItem(FILES_KEY, JSON.stringify(files));
    },

    async updateFile(
      id: string,
      updates: Partial<EvidenceFile>
    ): Promise<void> {
      const files = await this.getAllFiles();
      const idx = files.findIndex((f) => f.id === id);
      if (idx !== -1) {
        files[idx] = { ...files[idx], ...updates };
        localStorage.setItem(FILES_KEY, JSON.stringify(files));
      }
    },

    async deleteFile(id: string): Promise<void> {
      const files = await this.getAllFiles();
      const filtered = files.filter((f) => f.id !== id);
      localStorage.setItem(FILES_KEY, JSON.stringify(filtered));
    },

    async saveEncryptedBlob(id: string, blob: Blob): Promise<void> {
      await blobDBOp("files", "readwrite", (store) => store.put(blob, id));
    },

    async getEncryptedBlob(id: string): Promise<Blob | null> {
      return blobDBGet("files", id);
    },

    async deleteEncryptedBlob(id: string): Promise<void> {
      await blobDBOp("files", "readwrite", (store) => store.delete(id));
    },

    async saveThumbnail(id: string, blob: Blob): Promise<void> {
      await blobDBOp("thumbnails", "readwrite", (store) => store.put(blob, id));
    },

    async getThumbnail(id: string): Promise<Blob | null> {
      return blobDBGet("thumbnails", id);
    },

    async deleteThumbnail(id: string): Promise<void> {
      await blobDBOp("thumbnails", "readwrite", (store) =>
        store.delete(id)
      );
    },

    savePinHash(hash: string): void {
      localStorage.setItem(PIN_HASH_KEY, hash);
    },

    getPinHash(): string | null {
      return localStorage.getItem(PIN_HASH_KEY);
    },

    saveSalt(salt: string): void {
      localStorage.setItem(SALT_KEY, salt);
    },

    getSalt(): string | null {
      return localStorage.getItem(SALT_KEY);
    },

    saveAutoLock(timeoutMs: number): void {
      localStorage.setItem(AUTO_LOCK_KEY, String(timeoutMs));
    },

    getAutoLock(): number {
      const raw = localStorage.getItem(AUTO_LOCK_KEY);
      return raw ? parseInt(raw, 10) : 300000;
    },
  };
}

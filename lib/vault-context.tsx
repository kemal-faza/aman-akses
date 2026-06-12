// lib/vault-context.tsx
"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type {
  EvidenceFile,
  EvidenceCategory,
  VaultState,
  AddFileInput,
} from "./vault-types";
import { DEFAULT_VAULT_STATE } from "./vault-types";
import { generateId } from "./vault-utils";
import { encryptFile, deriveKey, hashPin, verifyPin } from "./vault-encryption";
import { createLocalStorageVaultRepository } from "./vault-repository-localstorage";
import type { VaultRepository } from "./vault-repository";

// ---- Reducer ----

type VaultAction =
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_UNLOCKED"; unlocked: boolean }
  | { type: "SET_FILES"; files: EvidenceFile[] }
  | { type: "ADD_FILE"; file: EvidenceFile }
  | { type: "UPDATE_FILE"; id: string; updates: Partial<EvidenceFile> }
  | { type: "REMOVE_FILE"; id: string }
  | { type: "SET_SELECTED_FILE"; id: string | null }
  | { type: "SET_CATEGORY"; category: EvidenceCategory | "all" }
  | { type: "SET_FILTERS"; filters: Partial<VaultState["activeFilters"]> }
  | { type: "SET_AUTO_LOCK"; timeoutMs: number }
  | { type: "RESET_ACTIVITY" }
  | { type: "SET_ENCRYPTION_KEY"; key: CryptoKey | null };

function vaultReducer(state: VaultState, action: VaultAction): VaultState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "SET_UNLOCKED":
      return { ...state, isUnlocked: action.unlocked, lastActivity: Date.now() };
    case "SET_FILES":
      return { ...state, files: action.files };
    case "ADD_FILE":
      return { ...state, files: [...state.files, action.file] };
    case "UPDATE_FILE": {
      const files = state.files.map((f) =>
        f.id === action.id ? { ...f, ...action.updates } : f
      );
      return { ...state, files };
    }
    case "REMOVE_FILE":
      return { ...state, files: state.files.filter((f) => f.id !== action.id) };
    case "SET_SELECTED_FILE":
      return { ...state, selectedFileId: action.id };
    case "SET_CATEGORY":
      return { ...state, activeCategory: action.category };
    case "SET_FILTERS":
      return {
        ...state,
        activeFilters: { ...state.activeFilters, ...action.filters },
      };
    case "SET_AUTO_LOCK":
      return { ...state, autoLockTimeoutMs: action.timeoutMs };
    case "RESET_ACTIVITY":
      return { ...state, lastActivity: Date.now() };
    case "SET_ENCRYPTION_KEY":
      return { ...state, encryptionKey: action.key };
    default:
      return state;
  }
}

// ---- Context ----

interface VaultContextValue {
  state: VaultState;
  setupPin: (pin: string) => Promise<void>;
  unlock: (pin: string) => Promise<boolean>;
  lock: () => void;
  changePin: (oldPin: string, newPin: string) => Promise<void>;
  updateAutoLock: (timeoutMs: number) => void;
  addFile: (input: AddFileInput) => Promise<EvidenceFile>;
  deleteFile: (id: string) => Promise<void>;
  selectFile: (id: string | null) => void;
  setCategory: (category: EvidenceCategory | "all") => void;
  setFilters: (filters: Partial<VaultState["activeFilters"]>) => void;
  linkNote: (fileId: string, noteId: string) => Promise<void>;
  unlinkNote: (fileId: string, noteId: string) => Promise<void>;
  getFilesByNoteId: (noteId: string) => EvidenceFile[];
  getNotesByFileId: (fileId: string) => string[];
}

const VaultContext = createContext<VaultContextValue | null>(null);

// ---- Provider ----

export function VaultProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(vaultReducer, DEFAULT_VAULT_STATE);
  const repo = createLocalStorageVaultRepository();

  // Load initial state
  useEffect(() => {
    (async () => {
      const files = await repo.getAllFiles();
      const autoLock = repo.getAutoLock();
      dispatch({ type: "SET_FILES", files });
      dispatch({ type: "SET_AUTO_LOCK", timeoutMs: autoLock });
      dispatch({ type: "SET_LOADING", loading: false });
    })();
  }, []);

  // Auto-lock timer
  useEffect(() => {
    if (!state.isUnlocked) return;
    const interval = setInterval(() => {
      if (Date.now() - state.lastActivity > state.autoLockTimeoutMs) {
        dispatch({ type: "SET_UNLOCKED", unlocked: false });
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [state.isUnlocked, state.lastActivity, state.autoLockTimeoutMs]);

  const setupPin = useCallback(async (pin: string) => {
    const pinHashStr = await hashPin(pin);
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const saltB64 = btoa(String.fromCharCode(...salt));
    repo.savePinHash(pinHashStr);
    repo.saveSalt(saltB64);
  }, []);

  const unlock = useCallback(async (pin: string): Promise<boolean> => {
    const storedHash = repo.getPinHash();
    if (!storedHash) return false;
    const ok = await verifyPin(pin, storedHash);
    if (ok) {
      dispatch({ type: "SET_UNLOCKED", unlocked: true });
    }
    return ok;
  }, []);

  const lock = useCallback(() => {
    dispatch({ type: "SET_UNLOCKED", unlocked: false });
  }, []);

  const changePin = useCallback(
    async (oldPin: string, newPin: string) => {
      const storedHash = repo.getPinHash();
      if (!storedHash) throw new Error("PIN belum diset");
      const ok = await verifyPin(oldPin, storedHash);
      if (!ok) throw new Error("PIN lama tidak sesuai");
      await setupPin(newPin);
    },
    [setupPin]
  );

  const updateAutoLock = useCallback((timeoutMs: number) => {
    repo.saveAutoLock(timeoutMs);
    dispatch({ type: "SET_AUTO_LOCK", timeoutMs });
    dispatch({ type: "RESET_ACTIVITY" });
  }, []);

  const getFilesByNoteId = useCallback(
    (noteId: string) => state.files.filter((f) => f.linkedNoteIds.includes(noteId)),
    [state.files]
  );

  const getNotesByFileId = useCallback(
    (fileId: string) => state.files.find((f) => f.id === fileId)?.linkedNoteIds ?? [],
    [state.files]
  );

  const getFileById = useCallback(
    (id: string) => state.files.find((f) => f.id === id),
    [state.files]
  );

  const addFile = useCallback(
    async (input: AddFileInput): Promise<EvidenceFile> => {
      const id = generateId();
      const arrayBuffer = await input.file.arrayBuffer();

      // Encrypt
      const saltB64 = repo.getSalt();
      let encryptedData: ArrayBuffer;
      if (saltB64 && state.isUnlocked) {
        const salt = Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0));
        const key = await deriveKey("PLACEHOLDER_KEY", salt);
        encryptedData = await encryptFile(arrayBuffer, key);
      } else {
        encryptedData = arrayBuffer;
      }

      const encryptedBlob = new Blob([encryptedData]);
      await repo.saveEncryptedBlob(id, encryptedBlob);

      // Generate simple thumbnail
      const thumbnailBlob = new Blob(["thumb"], { type: "image/jpeg" });
      await repo.saveThumbnail(id, thumbnailBlob);

      const file: EvidenceFile = {
        id,
        name: input.name,
        mimeType: input.mimeType,
        category: input.category,
        sizeBytes: input.sizeBytes,
        uploadedAt: new Date().toISOString().slice(0, 10),
        source: input.source,
        linkedNoteIds: input.linkedNoteIds,
        tags: input.tags,
        isLocked: false,
      };

      await repo.saveFile(file);
      dispatch({ type: "ADD_FILE", file });
      return file;
    },
    [state.isUnlocked]
  );

  const deleteFile = useCallback(async (id: string) => {
    await repo.deleteEncryptedBlob(id);
    await repo.deleteThumbnail(id);
    await repo.deleteFile(id);
    dispatch({ type: "REMOVE_FILE", id });
  }, []);

  const selectFile = useCallback((id: string | null) => {
    dispatch({ type: "SET_SELECTED_FILE", id });
  }, []);

  const setCategory = useCallback((category: EvidenceCategory | "all") => {
    dispatch({ type: "SET_CATEGORY", category });
  }, []);

  const setFilters = useCallback(
    (filters: Partial<VaultState["activeFilters"]>) => {
      dispatch({ type: "SET_FILTERS", filters });
    },
    []
  );

  const linkNote = useCallback(
    async (fileId: string, noteId: string) => {
      const file = state.files.find((f) => f.id === fileId);
      if (!file) return;
      const linkedNoteIds = [...file.linkedNoteIds, noteId];
      await repo.updateFile(fileId, { linkedNoteIds });
      dispatch({ type: "UPDATE_FILE", id: fileId, updates: { linkedNoteIds } });
    },
    [state.files]
  );

  const unlinkNote = useCallback(
    async (fileId: string, noteId: string) => {
      const file = state.files.find((f) => f.id === fileId);
      if (!file) return;
      const linkedNoteIds = file.linkedNoteIds.filter((id) => id !== noteId);
      await repo.updateFile(fileId, { linkedNoteIds });
      dispatch({ type: "UPDATE_FILE", id: fileId, updates: { linkedNoteIds } });
    },
    [state.files]
  );

  return (
    <VaultContext.Provider
      value={{
        state,
        setupPin,
        unlock,
        lock,
        changePin,
        updateAutoLock,
        addFile,
        deleteFile,
        selectFile,
        setCategory,
        setFilters,
        linkNote,
        unlinkNote,
        getFilesByNoteId,
        getNotesByFileId,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error("useVault must be used within VaultProvider");
  return ctx;
}

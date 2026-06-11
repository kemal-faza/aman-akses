"use client";

import type { JournalNote, JournalEntryInput } from "./types";
import type { JournalRepository } from "./repository";

const STORAGE_KEY = "amanakses-journal-entries";

function generateId(): string {
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function readAll(): JournalNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as JournalNote[];
  } catch {
    return [];
  }
}

function writeAll(entries: JournalNote[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function createLocalStorageRepo(): JournalRepository {
  return {
    async getAll() {
      return readAll();
    },

    async getById(id: string) {
      const entries = readAll();
      return entries.find((e) => e.id === id) ?? null;
    },

    async create(input: JournalEntryInput) {
      const entries = readAll();
      const now = new Date().toISOString();
      const entry: JournalNote = {
        ...input,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      entries.push(entry);
      writeAll(entries);
      return entry;
    },

    async update(id: string, input: Partial<JournalEntryInput>) {
      const entries = readAll();
      const idx = entries.findIndex((e) => e.id === id);
      if (idx === -1) throw new Error(`Entry ${id} not found`);
      const updated: JournalNote = {
        ...entries[idx],
        ...input,
        id: entries[idx].id, // preserve id
        updatedAt: new Date().toISOString(),
      };
      entries[idx] = updated;
      writeAll(entries);
      return updated;
    },

    async delete(id: string) {
      const entries = readAll();
      const filtered = entries.filter((e) => e.id !== id);
      writeAll(filtered);
    },
  };
}

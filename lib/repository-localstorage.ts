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

// === Seed Data ===

const SEED_DATA: JournalNote[] = [
  {
    id: "note-1",
    date: "2024-01-15",
    title: "Kejadian di ruang kelas A",
    content:
      "Hari ini saya berada di ruang kelas A untuk pelajaran matematika. Seorang teman sekelas mendekati saya dan membuat komentar yang membuat saya tidak nyaman. Dia terus menerus berkomentar tentang penampilan saya meskipun saya sudah memintanya untuk berhenti.",
    mood: "sedih" as const,
    involvedParties: "Teman sekelas",
    tags: ["pelecehan verbal", "sekolah"],
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
  },
  {
    id: "note-2",
    date: "2024-01-20",
    title: "Pesan tidak pantas di WhatsApp",
    content:
      "Seseorang dari kelas mengirimkan pesan WhatsApp yang berisi konten tidak pantas. Saya merasa takut dan tidak tahu harus melapor ke siapa. Saya screenshot pesannya sebagai bukti.",
    mood: "sangat-sedih" as const,
    involvedParties: "Orang dari kelas",
    tags: ["pelecehan online", "whatsapp"],
    createdAt: "2024-01-20T21:30:00.000Z",
    updatedAt: "2024-01-20T21:30:00.000Z",
  },
  {
    id: "note-3",
    date: "2024-02-01",
    title: "Bertemu guru BK",
    content:
      "Saya akhirnya memberanikan diri untuk bertemu dengan guru BK. Saya menceritakan apa yang terjadi di kelas dan pesan WhatsApp. Beliau mendengarkan dengan baik dan memberikan dukungan.",
    mood: "baik" as const,
    involvedParties: "Guru BK",
    tags: ["dukungan", "guru BK"],
    createdAt: "2024-02-01T13:00:00.000Z",
    updatedAt: "2024-02-01T13:00:00.000Z",
  },
  {
    id: "note-4",
    date: "2024-02-05",
    title: "Kejadian di kantin",
    content:
      "Pelaku mendekati saya lagi di kantin saat istirahat. Kali ini dia mencoba menyentuh lengan saya. Saya langsung menjauh dan ditemani oleh teman saya.",
    mood: "sedih" as const,
    involvedParties: "Pelaku, teman",
    tags: ["pelecehan fisik", "kantin"],
    createdAt: "2024-02-05T12:15:00.000Z",
    updatedAt: "2024-02-05T12:15:00.000Z",
  },
  {
    id: "note-5",
    date: "2024-02-10",
    title: "Diskusi dengan orang tua",
    content:
      "Saya menceritakan semuanya ke orang tua saya. Mereka sangat mendukung dan akan membantu saya menghadapi situasi ini. Kami memutuskan untuk melapor ke pihak sekolah.",
    mood: "baik" as const,
    involvedParties: "Orang tua",
    tags: ["dukungan", "keluarga"],
    createdAt: "2024-02-10T19:00:00.000Z",
    updatedAt: "2024-02-10T19:00:00.000Z",
  },
];

export function seedJournalData(): void {
  if (typeof window === "undefined") return;
  const existing = readAll();
  if (existing.length === 0) {
    writeAll(SEED_DATA);
  }
}

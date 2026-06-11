import type { JournalNote, JournalEntryInput } from "./types";

export interface JournalRepository {
  getAll(): Promise<JournalNote[]>;
  getById(id: string): Promise<JournalNote | null>;
  create(input: JournalEntryInput): Promise<JournalNote>;
  update(id: string, input: Partial<JournalEntryInput>): Promise<JournalNote>;
  delete(id: string): Promise<void>;
}

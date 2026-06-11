import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { JournalProvider, useJournal } from "@/lib/journal-context";
import type { JournalEntryInput, JournalNote } from "@/lib/types";
import type { JournalRepository } from "@/lib/repository";

const mockEntry: JournalNote = {
  id: "test-1",
  date: "2026-06-12",
  title: "Judul Test",
  content: "Isi konten test",
  mood: null,
  involvedParties: "",
  tags: [],
  createdAt: "2026-06-12T10:00:00.000Z",
  updatedAt: "2026-06-12T10:00:00.000Z",
};

function mockRepo(entries: JournalNote[] = []): JournalRepository {
  return {
    getAll: vi.fn().mockResolvedValue(entries),
    getById: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockImplementation(async (input: JournalEntryInput) => ({
      ...input,
      id: "new-id",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    update: vi.fn().mockResolvedValue(mockEntry),
    delete: vi.fn().mockResolvedValue(undefined),
  };
}

function wrapper(repo: JournalRepository) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(JournalProvider, { repository: repo, children } as any);
  };
}

describe("JournalContext", () => {
  it("loads entries from repository on mount", async () => {
    const repo = mockRepo([mockEntry]);
    const { result } = renderHook(() => useJournal(), { wrapper: wrapper(repo) });
    // Wait for useEffect to complete
    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
    expect(result.current.entries).toEqual([mockEntry]);
    expect(result.current.loading).toBe(false);
  });

  it("provides empty array when repository returns empty", async () => {
    const repo = mockRepo([]);
    const { result } = renderHook(() => useJournal(), { wrapper: wrapper(repo) });
    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
    expect(result.current.entries).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it("throws if used outside JournalProvider", () => {
    expect(() => renderHook(() => useJournal())).toThrow(
      "useJournal must be used within a JournalProvider"
    );
  });
});

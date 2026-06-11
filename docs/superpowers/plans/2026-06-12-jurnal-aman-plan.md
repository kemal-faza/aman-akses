# Jurnal Aman Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development, superpowers:dispatching-parallel-agents, or superpowers:executing-plans. See the Task Grouping section for parallel vs sequential execution strategy.

**Goal:** Ganti placeholder `/jurnal` dengan halaman CRUD Jurnal Aman (Context + Repository + localStorage) lengkap dengan MoodTracker, JournalList, dan JournalSheet.

**Architecture:** Context + useReducer + Repository pattern (localStorage Fase 1, API-ready untuk Fase 2). JournalList sebagai daftar kartu, JournalSheet sebagai slide-out form (shadcn Sheet). Kronologi wizard akan dihubungkan ke data jurnal nyata.

**Execution Strategy:** Sequential — 5 task membentuk satu rantai dependensi linear.

**Tech Stack:** Next.js 15 (App Router), React 19, Tailwind v4, shadcn/ui (@base-ui/react/dialog Sheet), lucide-react, Vitest + Testing Library + jsdom

---

## Task Grouping

```
Sequential Chain: Jurnal Aman CRUD + Kronologi Integration
  Task 1: MoodTracker (AFK, blocked by: None)
    ↓ depends on
  Task 2: Data layer + JournalList display (AFK, blocked by: Task 1)
    ↓ depends on
  Task 3: JournalSheet create mode (AFK, blocked by: Task 2)
    ↓ depends on
  Task 4: Edit + Delete (AFK, blocked by: Task 3)
    ↓ depends on
  Task 5: Kronologi integration (AFK, blocked by: Task 4)
```

---

### Task 1: Mood type + MoodTracker component

**Type:** `AFK`
**Blocked by:** None

**Files:**
- Create: `app/(main)/_components/journal/MoodTracker.tsx`
- Create: `app/__tests__/journal/MoodTracker.test.tsx`
- Modify: `lib/types.ts` (add Mood type, MOOD_CONFIG)

- [ ] **Step 1: Add Mood type and MOOD_CONFIG to lib/types.ts**

Append to end of `lib/types.ts`:

```typescript
// === Mood ===

export type Mood = "sangat-baik" | "baik" | "biasa" | "sedih" | "sangat-sedih";

export const MOOD_OPTIONS: { value: Mood; label: string }[] = [
  { value: "sangat-baik", label: "Sangat Baik" },
  { value: "baik", label: "Baik" },
  { value: "biasa", label: "Biasa Saja" },
  { value: "sedih", label: "Sedih" },
  { value: "sangat-sedih", label: "Sangat Sedih" },
];
```

Run: `npx tsc --noEmit` — should pass.

- [ ] **Step 2: Write the failing test for MoodTracker**

Create `app/__tests__/journal/MoodTracker.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MoodTracker } from "@/app/(main)/_components/journal/MoodTracker";
import { MOOD_OPTIONS } from "@/lib/types";
import type { Mood } from "@/lib/types";

describe("MoodTracker", () => {
  it("renders all 5 mood options", () => {
    render(<MoodTracker value={null} onChange={() => {}} />);
    for (const opt of MOOD_OPTIONS) {
      expect(screen.getByLabelText(opt.label)).toBeInTheDocument();
    }
  });

  it("calls onChange with the clicked mood value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MoodTracker value={null} onChange={onChange} />);
    await user.click(screen.getByLabelText("Baik"));
    expect(onChange).toHaveBeenCalledWith("baik");
  });

  it("marks the active mood with aria-pressed", () => {
    render(<MoodTracker value="sedih" onChange={() => {}} />);
    const sedih = screen.getByLabelText("Sedih");
    const baik = screen.getByLabelText("Baik");
    expect(sedih).toHaveAttribute("aria-pressed", "true");
    expect(baik).toHaveAttribute("aria-pressed", "false");
  });

  it("applies primary color to the active mood", () => {
    render(<MoodTracker value="sangat-baik" onChange={() => {}} />);
    const active = screen.getByLabelText("Sangat Baik");
    expect(active.className).toContain("text-primary");
  });
});
```

Run: `npx vitest run app/__tests__/journal/MoodTracker.test.tsx`
Expected: FAIL — "Cannot find module"

- [ ] **Step 3: Write minimal MoodTracker component**

Create `app/(main)/_components/journal/MoodTracker.tsx`:

```tsx
"use client";

import { MOOD_OPTIONS } from "@/lib/types";
import type { Mood } from "@/lib/types";
import { SmilePlus, Smile, Meh, Frown, Annoyed } from "lucide-react";

const ICON_MAP: Record<Mood, typeof Smile> = {
  "sangat-baik": SmilePlus,
  "baik": Smile,
  "biasa": Meh,
  "sedih": Frown,
  "sangat-sedih": Annoyed,
};

interface MoodTrackerProps {
  value: Mood | null;
  onChange: (mood: Mood) => void;
}

export function MoodTracker({ value, onChange }: MoodTrackerProps) {
  return (
    <div className="flex items-center gap-3" role="radiogroup" aria-label="Suasana Hati">
      {MOOD_OPTIONS.map((opt) => {
        const Icon = ICON_MAP[opt.value];
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={opt.label}
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center gap-1 p-2 rounded-md transition-all
              ${isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground hover:scale-105"}
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
          >
            <Icon className="w-7 h-7" />
            <span className="text-[10px] leading-tight">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run app/__tests__/journal/MoodTracker.test.tsx`
Expected: 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add lib/types.ts app/\(main\)/_components/journal/MoodTracker.tsx app/__tests__/journal/MoodTracker.test.tsx
git commit -m "feat: add Mood type and MoodTracker component"
```

---

### Task 2: Data layer + JournalContext + JournalList display

**Type:** `AFK`
**Blocked by:** Task 1

**Files:**
- Create: `lib/repository.ts`
- Create: `lib/repository-localstorage.ts`
- Create: `lib/journal-context.tsx`
- Create: `lib/__tests__/journal-context.test.ts`
- Create: `app/(main)/_components/journal/JournalList.tsx`
- Create: `app/__tests__/journal/JournalList.test.tsx`
- Modify: `lib/types.ts` (update JournalNote, add JournalEntryInput)
- Modify: `app/(main)/layout.tsx` (wrap with JournalProvider)

- [ ] **Step 1: Update JournalNote and add JournalEntryInput to lib/types.ts**

Replace the existing `JournalNote` interface:

```typescript
export interface JournalNote {
  id: string;
  date: string;            // ISO-8601 "2026-06-12"
  title: string;           // maks 100 karakter
  content: string;         // deskripsi kejadian
  mood: Mood | null;       // null = tidak dipilih
  involvedParties: string; // "Siapa yang terlibat?"
  tags: string[];          // array tag unik, lowercase
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}

export type JournalEntryInput = Omit<JournalNote, "id" | "createdAt" | "updatedAt">;
```

Run: `npx tsc --noEmit` — should pass.

- [ ] **Step 2: Write the failing test for JournalContext**

Create `lib/__tests__/journal-context.test.ts`:

```ts
import { describe, it, expect, beforeEach, vi } from "vitest";
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
    return React.createElement(JournalProvider, { repository: repo }, children);
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
```

Run: `npx vitest run lib/__tests__/journal-context.test.ts`
Expected: FAIL — "Cannot find module"

- [ ] **Step 3: Create repository interface**

Create `lib/repository.ts`:

```typescript
import type { JournalNote, JournalEntryInput } from "./types";

export interface JournalRepository {
  getAll(): Promise<JournalNote[]>;
  getById(id: string): Promise<JournalNote | null>;
  create(input: JournalEntryInput): Promise<JournalNote>;
  update(id: string, input: Partial<JournalEntryInput>): Promise<JournalNote>;
  delete(id: string): Promise<void>;
}
```

Run: `npx tsc --noEmit` — should pass.

- [ ] **Step 4: Create localStorage repository**

Create `lib/repository-localstorage.ts`:

```typescript
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
```

Run: `npx tsc --noEmit` — should pass.

- [ ] **Step 5: Create JournalContext with Provider and useJournal hook**

Create `lib/journal-context.tsx`:

```tsx
"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { JournalNote, JournalEntryInput } from "./types";
import type { JournalRepository } from "./repository";
import { createLocalStorageRepo } from "./repository-localstorage";

interface JournalState {
  entries: JournalNote[];
  loading: boolean;
  error: string | null;
}

type JournalAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; entries: JournalNote[] }
  | { type: "LOAD_ERROR"; error: string }
  | { type: "ADD"; entry: JournalNote }
  | { type: "UPDATE"; entry: JournalNote }
  | { type: "DELETE"; id: string };

const initialState: JournalState = {
  entries: [],
  loading: true,
  error: null,
};

function journalReducer(state: JournalState, action: JournalAction): JournalState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, loading: true, error: null };
    case "LOAD_SUCCESS":
      return { entries: action.entries, loading: false, error: null };
    case "LOAD_ERROR":
      return { ...state, loading: false, error: action.error };
    case "ADD":
      return { entries: [...state.entries, action.entry], loading: false, error: null };
    case "UPDATE":
      return {
        entries: state.entries.map((e) => (e.id === action.entry.id ? action.entry : e)),
        loading: false,
        error: null,
      };
    case "DELETE":
      return {
        entries: state.entries.filter((e) => e.id !== action.id),
        loading: false,
        error: null,
      };
    default:
      return state;
  }
}

interface JournalContextValue {
  entries: JournalNote[];
  loading: boolean;
  error: string | null;
  createEntry: (input: JournalEntryInput) => Promise<JournalNote>;
  updateEntry: (id: string, input: Partial<JournalEntryInput>) => Promise<JournalNote>;
  deleteEntry: (id: string) => Promise<void>;
  refreshEntries: () => Promise<void>;
}

const JournalContext = createContext<JournalContextValue | null>(null);

export function JournalProvider({
  children,
  repository,
}: {
  children: ReactNode;
  repository?: JournalRepository;
}) {
  const repo = repository ?? createLocalStorageRepo();
  const [state, dispatch] = useReducer(journalReducer, initialState);

  const refreshEntries = useCallback(async () => {
    dispatch({ type: "LOAD_START" });
    try {
      const entries = await repo.getAll();
      dispatch({ type: "LOAD_SUCCESS", entries });
    } catch (err) {
      dispatch({ type: "LOAD_ERROR", error: err instanceof Error ? err.message : "Gagal memuat" });
    }
  }, [repo]);

  useEffect(() => {
    refreshEntries();
  }, [refreshEntries]);

  const createEntry = useCallback(
    async (input: JournalEntryInput) => {
      const entry = await repo.create(input);
      dispatch({ type: "ADD", entry });
      return entry;
    },
    [repo],
  );

  const updateEntry = useCallback(
    async (id: string, input: Partial<JournalEntryInput>) => {
      const entry = await repo.update(id, input);
      dispatch({ type: "UPDATE", entry });
      return entry;
    },
    [repo],
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      await repo.delete(id);
      dispatch({ type: "DELETE", id });
    },
    [repo],
  );

  return (
    <JournalContext.Provider
      value={{
        ...state,
        createEntry,
        updateEntry,
        deleteEntry,
        refreshEntries,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal(): JournalContextValue {
  const ctx = useContext(JournalContext);
  if (!ctx) {
    throw new Error("useJournal must be used within a JournalProvider");
  }
  return ctx;
}
```

- [ ] **Step 6: Confirm JournalContext test passes**

Run: `npx vitest run lib/__tests__/journal-context.test.ts`
Expected: 3 tests PASS

- [ ] **Step 7: Write failing JournalList test**

Create `app/__tests__/journal/JournalList.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JournalList } from "@/app/(main)/_components/journal/JournalList";
import type { JournalNote } from "@/lib/types";

const mockEntries: JournalNote[] = [
  {
    id: "1",
    date: "2026-06-12",
    title: "Hari yang berat",
    content: "Hari ini terjadi sesuatu yang membuat saya tidak nyaman di kantor.",
    mood: "sedih",
    involvedParties: "Rekan kerja",
    tags: ["kerja", "pelecehan"],
    createdAt: "2026-06-12T10:00:00.000Z",
    updatedAt: "2026-06-12T10:00:00.000Z",
  },
  {
    id: "2",
    date: "2026-06-10",
    title: "Obrolan dengan teman",
    content: "Saya cerita ke teman dekat dan dia sangat mendukung.",
    mood: "baik",
    involvedParties: "Teman",
    tags: ["dukungan"],
    createdAt: "2026-06-10T14:00:00.000Z",
    updatedAt: "2026-06-10T14:00:00.000Z",
  },
];

describe("JournalList", () => {
  it("renders entry cards with title and truncated content", () => {
    render(
      <JournalList
        entries={mockEntries}
        loading={false}
        error={null}
        onDelete={() => {}}
        onNewEntry={() => {}}
        onEditEntry={() => {}}
      />
    );
    expect(screen.getByText("Hari yang berat")).toBeInTheDocument();
    expect(screen.getByText(/Hari ini terjadi sesuatu/)).toBeInTheDocument();
  });

  it("renders mood icon when mood is set", () => {
    render(
      <JournalList
        entries={mockEntries}
        loading={false}
        error={null}
        onDelete={() => {}}
        onNewEntry={() => {}}
        onEditEntry={() => {}}
      />
    );
    // "Sedih" label should be on the active mood button
    expect(screen.getByText("Sedih")).toBeInTheDocument();
  });

  it("renders tags as badges", () => {
    render(
      <JournalList
        entries={mockEntries}
        loading={false}
        error={null}
        onDelete={() => {}}
        onNewEntry={() => {}}
        onEditEntry={() => {}}
      />
    );
    expect(screen.getByText("kerja")).toBeInTheDocument();
    expect(screen.getByText("pelecehan")).toBeInTheDocument();
  });

  it("shows empty state when no entries", () => {
    render(
      <JournalList
        entries={[]}
        loading={false}
        error={null}
        onDelete={() => {}}
        onNewEntry={() => {}}
        onEditEntry={() => {}}
      />
    );
    expect(screen.getByText(/Belum ada catatan/)).toBeInTheDocument();
  });

  it("renders skeleton cards when loading", () => {
    render(
      <JournalList
        entries={[]}
        loading={true}
        error={null}
        onDelete={() => {}}
        onNewEntry={() => {}}
        onEditEntry={() => {}}
      />
    );
    // Skeleton cards should have animate-pulse class
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("calls onNewEntry when CTA button clicked in empty state", async () => {
    const user = userEvent.setup();
    const onNew = vi.fn();
    render(
      <JournalList
        entries={[]}
        loading={false}
        error={null}
        onDelete={() => {}}
        onNewEntry={onNew}
        onEditEntry={() => {}}
      />
    );
    await user.click(screen.getByRole("button", { name: /Tulis Catatan Pertama/ }));
    expect(onNew).toHaveBeenCalled();
  });

  it("calls onDelete when delete button clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <JournalList
        entries={mockEntries}
        loading={false}
        error={null}
        onDelete={onDelete}
        onNewEntry={() => {}}
        onEditEntry={() => {}}
      />
    );
    const deleteButtons = screen.getAllByLabelText("Hapus catatan");
    await user.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("calls onEditEntry when entry card clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(
      <JournalList
        entries={mockEntries}
        loading={false}
        error={null}
        onDelete={() => {}}
        onNewEntry={() => {}}
        onEditEntry={onEdit}
      />
    );
    await user.click(screen.getByText("Hari yang berat"));
    expect(onEdit).toHaveBeenCalledWith("1");
  });
});
```

Run: `npx vitest run app/__tests__/journal/JournalList.test.tsx`
Expected: FAIL — "Cannot find module"

- [ ] **Step 8: Write JournalList component**

Create `app/(main)/_components/journal/JournalList.tsx`:

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Mood, JournalNote } from "@/lib/types";
import { SmilePlus, Smile, Meh, Frown, Annoyed, Trash2, Plus, FileText } from "lucide-react";

const MOOD_ICON: Record<Mood, typeof Smile> = {
  "sangat-baik": SmilePlus,
  baik: Smile,
  biasa: Meh,
  sedih: Frown,
  "sangat-sedih": Annoyed,
};

const MOOD_LABEL: Record<Mood, string> = {
  "sangat-baik": "Sangat Baik",
  baik: "Baik",
  biasa: "Biasa Saja",
  sedih: "Sedih",
  "sangat-sedih": "Sangat Sedih",
};

interface JournalListProps {
  entries: JournalNote[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
  onNewEntry: () => void;
  onEditEntry: (id: string) => void;
}

function JournalCard({
  entry,
  onEdit,
  onDelete,
}: {
  entry: JournalNote;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const MoodIcon = entry.mood ? MOOD_ICON[entry.mood] : null;

  return (
    <div className="border border-border rounded-lg p-6 hover:border-primary/30 transition-colors cursor-pointer group bg-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0" onClick={onEdit}>
          <div className="flex items-center gap-3 mb-2">
            <time className="text-sm text-muted-foreground">
              {new Date(entry.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            {MoodIcon && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MoodIcon className="w-4 h-4" />
                {MOOD_LABEL[entry.mood!]}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-foreground mb-1 truncate">{entry.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>
          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {entry.tags.map((tag) => (
                <Badge key={tag} variant="neutral" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Hapus catatan"
          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function JournalList({
  entries,
  loading,
  error,
  onDelete,
  onNewEntry,
  onEditEntry,
}: JournalListProps) {
  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-border rounded-lg p-6 animate-pulse">
            <Skeleton className="h-4 w-32 mb-3" />
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-destructive">Gagal memuat catatan</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  // Empty state
  if (entries.length === 0) {
    return (
      <div className="text-center py-16 space-y-5">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Belum ada catatan</h3>
          <p className="text-sm text-muted-foreground">
            Mulai tulis catatan pertama Anda.
          </p>
        </div>
        <Button onClick={onNewEntry}>
          <Plus className="w-4 h-4 mr-2" />
          Tulis Catatan Pertama
        </Button>
      </div>
    );
  }

  // Populated state
  return (
    <div className="space-y-3">
      {entries
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((entry) => (
          <JournalCard
            key={entry.id}
            entry={entry}
            onEdit={() => onEditEntry(entry.id)}
            onDelete={() => onDelete(entry.id)}
          />
        ))}
    </div>
  );
}
```

- [ ] **Step 9: Run JournalList test**

Run: `npx vitest run app/__tests__/journal/JournalList.test.tsx`
Expected: 8 tests PASS

- [ ] **Step 10: Wrap JournalProvider in app/(main)/layout.tsx**

Add import and wrap children:

```
import { JournalProvider } from "@/lib/journal-context";
```

Change the return statement to wrap children with JournalProvider (inside AccessibilityProvider):

```tsx
<AccessibilityProvider>
  <JournalProvider>
    <SidebarProvider ...>
      ...
    </SidebarProvider>
  </JournalProvider>
</AccessibilityProvider>
```

Run: `npx tsc --noEmit` — should pass.

- [ ] **Step 11: Commit**

```bash
git add lib/types.ts lib/repository.ts lib/repository-localstorage.ts lib/journal-context.tsx lib/__tests__/journal-context.test.ts app/\(main\)/_components/journal/JournalList.tsx app/__tests__/journal/JournalList.test.tsx app/\(main\)/layout.tsx
git commit -m "feat: add JournalContext, localStorage repo, and JournalList component"
```

---

### Task 3: JournalSheet create mode + Page integration

**Type:** `AFK`
**Blocked by:** Task 2

**Files:**
- Create: `app/(main)/_components/journal/JournalSheet.tsx`
- Create: `app/__tests__/journal/JournalSheet.test.tsx`
- Modify: `app/(main)/jurnal/page.tsx` (placeholder → full page)

- [ ] **Step 1: Write failing test for JournalSheet**

Create `app/__tests__/journal/JournalSheet.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JournalSheet } from "@/app/(main)/_components/journal/JournalSheet";
import type { JournalEntryInput } from "@/lib/types";

describe("JournalSheet", () => {
  it("renders create mode with empty form", () => {
    render(
      <JournalSheet
        open={true}
        onOpenChange={() => {}}
        mode="create"
        onSave={() => Promise.resolve()}
      />
    );
    expect(screen.getByText("Catatan Baru")).toBeInTheDocument();
    // Date input should be present
    expect(screen.getByLabelText("Tanggal Kejadian")).toBeInTheDocument();
    // Textarea should be present
    expect(screen.getByLabelText("Apa yang terjadi?")).toBeInTheDocument();
  });

  it("renders edit mode with pre-filled data", () => {
    render(
      <JournalSheet
        open={true}
        onOpenChange={() => {}}
        mode="edit"
        entry={{
          id: "test-1",
          date: "2026-06-12",
          title: "Judul lama",
          content: "Konten lama",
          mood: "sedih",
          involvedParties: "Orang A",
          tags: ["kerja"],
          createdAt: "",
          updatedAt: "",
        }}
        onSave={() => Promise.resolve()}
      />
    );
    expect(screen.getByText("Edit Catatan")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Judul lama")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Konten lama")).toBeInTheDocument();
  });

  it("shows validation error when title is empty on save", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(
      <JournalSheet
        open={true}
        onOpenChange={() => {}}
        mode="create"
        onSave={onSave}
      />
    );
    await user.click(screen.getByRole("button", { name: /Simpan/ }));
    expect(screen.getByText(/Judul wajib diisi/)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("shows validation error when date is empty on save", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(
      <JournalSheet
        open={true}
        onOpenChange={() => {}}
        mode="create"
        onSave={onSave}
      />
    );
    // Fill title but leave date empty
    await user.type(screen.getByLabelText("Apa yang terjadi?"), "Isi konten");
    await user.click(screen.getByRole("button", { name: /Simpan/ }));
    expect(screen.getByText(/Tanggal wajib diisi/)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("calls onSave with form data when valid", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(
      <JournalSheet
        open={true}
        onOpenChange={() => {}}
        mode="create"
        onSave={onSave}
      />
    );
    await user.type(screen.getByLabelText("Apa yang terjadi?"), "Deskripsi kejadian");
    await user.type(screen.getByLabelText("Siapa yang terlibat?"), "Orang X");
    
    // Set date
    const dateInput = screen.getByLabelText("Tanggal Kejadian");
    await user.clear(dateInput);
    await user.type(dateInput, "2026-06-12");
    
    // Set mood
    await user.click(screen.getByLabelText("Sedih"));
    
    // Add tag
    const tagInput = screen.getByPlaceholderText("Tambah tag...");
    await user.type(tagInput, "kerja");
    await user.keyboard("{Enter}");
    
    await user.click(screen.getByRole("button", { name: /Simpan/ }));
    
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Deskripsi kejadian",  // First line of textarea becomes title
        content: "Deskripsi kejadian",
        mood: "sedih",
        involvedParties: "Orang X",
        tags: ["kerja"],
      })
    );
  });
});
```

Run: `npx vitest run app/__tests__/journal/JournalSheet.test.tsx`
Expected: FAIL — "Cannot find module"

- [ ] **Step 2: Write JournalSheet component**

Create `app/(main)/_components/journal/JournalSheet.tsx`:

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MoodTracker } from "./MoodTracker";
import type { Mood, JournalNote, JournalEntryInput } from "@/lib/types";
import { X } from "lucide-react";

interface JournalSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  entry?: JournalNote;
  onSave: (input: JournalEntryInput) => Promise<void>;
}

export function JournalSheet({ open, onOpenChange, mode, entry, onSave }: JournalSheetProps) {
  const [title, setTitle] = useState(entry?.title ?? "");
  const [date, setDate] = useState(entry?.date ?? "");
  const [content, setContent] = useState(entry?.content ?? "");
  const [mood, setMood] = useState<Mood | null>(entry?.mood ?? null);
  const [involvedParties, setInvolvedParties] = useState(entry?.involvedParties ?? "");
  const [tags, setTags] = useState<string[]>(entry?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDate("");
    setContent("");
    setMood(null);
    setInvolvedParties("");
    setTags([]);
    setTagInput("");
    setErrors({});
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) resetForm();
    onOpenChange(open);
  };

  const addTag = () => {
    const cleaned = tagInput.trim().toLowerCase();
    if (cleaned && !tags.includes(cleaned)) {
      setTags([...tags, cleaned]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!date.trim()) newErrors.date = "Tanggal wajib diisi";
    if (!content.trim()) newErrors.title = "Judul wajib diisi";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    setErrors({});

    // Use first line of content as title, or first 100 chars
    const derivedTitle = content.trim().split("\n")[0].slice(0, 100);

    const input: JournalEntryInput = {
      title: derivedTitle,
      date: date.trim(),
      content: content.trim(),
      mood,
      involvedParties: involvedParties.trim(),
      tags,
    };

    try {
      await onSave(input);
      resetForm();
      onOpenChange(false);
    } catch {
      setErrors({ form: "Gagal menyimpan catatan. Silakan coba lagi." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle className="text-lg font-semibold">
            {mode === "create" ? "Catatan Baru" : "Edit Catatan"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="journal-date">Tanggal Kejadian</Label>
            <Input
              id="journal-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
          </div>

          {/* Mood */}
          <div className="space-y-2">
            <Label>Suasana Hati</Label>
            <MoodTracker value={mood} onChange={setMood} />
          </div>

          {/* Content / Description */}
          <div className="space-y-2">
            <Label htmlFor="journal-content">Apa yang terjadi?</Label>
            <textarea
              id="journal-content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
              placeholder="Ceritakan apa yang terjadi..."
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          {/* Involved Parties */}
          <div className="space-y-2">
            <Label htmlFor="journal-parties">Siapa yang terlibat?</Label>
            <Input
              id="journal-parties"
              value={involvedParties}
              onChange={(e) => setInvolvedParties(e.target.value)}
              placeholder="Nama atau deskripsi pihak yang terlibat"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Tambah tag..."
              />
              <Button type="button" variant="outline" size="sm" onClick={addTag}>
                Tambah
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="neutral" size="sm">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                      aria-label={`Hapus tag ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Form error */}
          {errors.form && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-md p-3">{errors.form}</p>
          )}

          {/* Submit */}
          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Menyimpan..." : mode === "create" ? "Simpan Catatan" : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 3: Run JournalSheet test**

Run: `npx vitest run app/__tests__/journal/JournalSheet.test.tsx`
Expected: 5 tests PASS

- [ ] **Step 4: Update journal page to integrate list + sheet**

Replace `app/(main)/jurnal/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useJournal } from "@/lib/journal-context";
import { JournalList } from "./_components/journal/JournalList";
import { JournalSheet } from "./_components/journal/JournalSheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { JournalEntryInput, JournalNote } from "@/lib/types";

export default function JurnalAmanPage() {
  const { entries, loading, error, createEntry, updateEntry, deleteEntry } = useJournal();

  // Sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"create" | "edit">("create");
  const [editingEntry, setEditingEntry] = useState<JournalNote | undefined>(undefined);

  const handleNewEntry = () => {
    setSheetMode("create");
    setEditingEntry(undefined);
    setSheetOpen(true);
  };

  const handleEditEntry = (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (entry) {
      setEditingEntry(entry);
      setSheetMode("edit");
      setSheetOpen(true);
    }
  };

  const handleSave = async (input: JournalEntryInput) => {
    if (sheetMode === "edit" && editingEntry) {
      await updateEntry(editingEntry.id, input);
    } else {
      await createEntry(input);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus catatan ini? Tindakan ini tidak bisa dibatalkan.")) {
      deleteEntry(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-md font-bold text-foreground">Jurnal Aman</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ruang pribadi untuk mencatat pengalaman Anda.
          </p>
        </div>
        {!loading && entries.length > 0 && (
          <Button onClick={handleNewEntry}>
            <Plus className="w-4 h-4 mr-2" />
            Tulis Catatan Baru
          </Button>
        )}
      </div>

      {/* List */}
      <JournalList
        entries={entries}
        loading={loading}
        error={error}
        onDelete={handleDelete}
        onNewEntry={handleNewEntry}
        onEditEntry={handleEditEntry}
      />

      {/* Sheet */}
      <JournalSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        mode={sheetMode}
        entry={editingEntry}
        onSave={handleSave}
      />
    </div>
  );
}
```

Run: `npx tsc --noEmit` — should pass.

- [ ] **Step 5: Commit**

```bash
git add app/\(main\)/_components/journal/JournalSheet.tsx app/__tests__/journal/JournalSheet.test.tsx app/\(main\)/jurnal/page.tsx
git commit -m "feat: add JournalSheet create/edit form and integrate journal page"
```

---

### Task 4: Seed data + verify full CRUD + edge cases

**Type:** `AFK`
**Blocked by:** Task 3

**Files:**
- Modify: `lib/repository-localstorage.ts` (add seed function)
- Modify: `app/(main)/jurnal/page.tsx` (seed on first load)

- [ ] **Step 1: Add seed data to localStorage repo**

Add seed function at the bottom of `lib/repository-localstorage.ts`:

```typescript
// NOTE: JournalNote already imported at top of this file. Add below existing code:

const SEED_DATA: JournalNote[] = [
  {
    id: "note-1",
    date: "2024-01-15",
    title: "Kejadian di ruang kelas A",
    content:
      "Hari ini saya berada di ruang kelas A untuk pelajaran matematika. Seorang teman sekelas mendekati saya dan membuat komentar yang membuat saya tidak nyaman. Dia terus menerus berkomentar tentang penampilan saya meskipun saya sudah memintanya untuk berhenti.",
    mood: "sedih",
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
    mood: "sangat-sedih",
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
    mood: "baik",
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
    mood: "sedih",
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
    mood: "baik",
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
```

- [ ] **Step 2: Call seed on journal page mount**

Replace the import and add useEffect in `app/(main)/jurnal/page.tsx`:

Add at top (after other imports):
```typescript
import { useEffect } from "react";
import { seedJournalData } from "@/lib/repository-localstorage";
```

Add inside the component, before the return:
```typescript
useEffect(() => {
  seedJournalData();
}, []);
```

- [ ] **Step 3: Verify everything compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Run all journal tests**

Run: `npx vitest run app/__tests__/journal/ lib/__tests__/journal-context.test.ts`
Expected: 20 tests PASS (4 mood + 3 context + 8 list + 5 sheet = 20)

- [ ] **Step 5: Commit**

```bash
git add lib/repository-localstorage.ts app/\(main\)/jurnal/page.tsx
git commit -m "feat: add seed data for journal entries on first load"
```

---

### Task 5: Kronologi wizard integration

**Type:** `AFK`
**Blocked by:** Task 4

**Files:**
- Modify: `app/(main)/kronologi/_components/StepPilih.tsx` (use journal context instead of mock data)
- Modify: `app/(main)/kronologi/page.tsx` (if it needs JournalProvider)

- [ ] **Step 1: Update StepPilih to use journal context**

Replace `app/(main)/kronologi/_components/StepPilih.tsx`:

```tsx
"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NoteChecklist } from "./NoteChecklist"
import { useWizard } from "@/lib/wizard-context"
import { useJournal } from "@/lib/journal-context"

export function StepPilih() {
  const { state, dispatch } = useWizard()
  const { entries, loading } = useJournal()
  const selectedCount = state.selectedNoteIds.length

  const handleToggle = (noteId: string) => {
    const newIds = state.selectedNoteIds.includes(noteId)
      ? state.selectedNoteIds.filter((id) => id !== noteId)
      : [...state.selectedNoteIds, noteId]
    dispatch({ type: "SELECT_NOTES", noteIds: newIds })
  }

  const handleLanjutkan = () => {
    dispatch({ type: "START_PROCESSING" })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Memuat catatan jurnal...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-title-md font-semibold">Pilih Catatan</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Pilih catatan jurnal yang ingin disusun menjadi kronologi
          </p>
        </div>
        <Badge variant="default" size="lg">
          {selectedCount} catatan dipilih
        </Badge>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>Belum ada catatan di Jurnal Aman.</p>
          <p className="text-sm mt-1">Silakan buat catatan terlebih dahulu sebelum menyusun kronologi.</p>
        </div>
      ) : (
        <NoteChecklist
          notes={entries.map((e) => ({
            id: e.id,
            date: e.date,
            title: e.title,
            content: e.content,
            tags: e.tags,
          }))}
          selectedIds={state.selectedNoteIds}
          onToggle={handleToggle}
        />
      )}

      <div className="flex justify-end pt-4">
        <Button
          disabled={selectedCount === 0}
          onClick={handleLanjutkan}
          size="xl"
        >
          Lanjutkan
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify kronologi page works**

Check that kronologi page wraps StepPilih in needed providers. Read the kronologi page:

Read `app/(main)/kronologi/page.tsx` — if it doesn't already have JournalProvider, wrap it.

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Run existing kronologi tests to ensure no regression**

Run: `npx vitest run --reporter=verbose 2>&1 | head -30`
Check for passing tests.

- [ ] **Step 4: Commit**

```bash
git add app/\(main\)/kronologi/_components/StepPilih.tsx
git commit -m "feat: connect Kronologi wizard to JournalContext instead of mock data"
```

---

## Verification Checklist

After all 5 tasks complete, verify:

1. `npx tsc --noEmit` — no type errors
2. `npx vitest run` — all tests pass (journal + kronologi + existing)
3. `npm run dev` — open `/jurnal`:
   - See 5 seed entries listed
   - Click "Tulis Catatan Baru" → sheet slides open
   - Fill form (set mood, add tags) → save → entry appears in list
   - Click existing entry → sheet opens in edit mode → change → save
   - Click delete icon → confirm → entry disappears
   - Empty list shows empty state with CTA
4. Open `/kronologi`:
   - Step 1 shows journal entries from context (not mock data)
   - Can select entries and proceed through wizard

# Pendamping Tepercaya Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development, superpowers:dispatching-parallel-agents, or superpowers:executing-plans. See the Task Grouping section for parallel vs sequential execution strategy.

**Goal:** Implementasi penuh modul Pendamping Tepercaya dengan Pendamping Personal (CRUD + Izin Akses), Penyedia Layanan Dukungan (katalog statis + filter), deep link WhatsApp/Telepon, dan Sheet form yang konsisten dengan pola JournalSheet/VaultFileDrawer.

**Architecture:** Next.js App Router + React 19 + Tailwind v4 + shadcn/ui. CompanionContext untuk state management. localStorage repository. Katalog penyedia layanan sebagai file statis (`lib/companion-catalog.ts`). Pola identik dengan VaultContext/JournalContext yang sudah ada — useReducer + Provider + Repository.

**Execution Strategy:** Hybrid — Sequential Chain untuk foundation (AFK), Parallel Batch untuk feature components (HITL).

**Tech Stack:** Next.js 15, React 19.2, Tailwind CSS v4, shadcn/ui, Vitest, @testing-library/react

---

## File Structure

```
lib/
  companion-types.ts                       # All type definitions
  companion-catalog.ts                     # Static ServiceProvider catalog
  companion-repository-localstorage.ts     # localStorage CRUD
  companion-context.tsx                    # CompanionProvider + useCompanion hook

app/(main)/pendamping-tepercaya/
  page.tsx                                 # Server component wrapper (replace placeholder)
  _components/
    PendampingClient.tsx                   # Client orchestrator
    CompanionGrid.tsx                      # Grid pendamping personal
    CompanionCard.tsx                      # Kartu pendamping personal
    CompanionSheet.tsx                     # Sheet: add/edit form + permission checkboxes
    ServiceProviderList.tsx                # List penyedia layanan
    ServiceProviderRow.tsx                 # Baris penyedia layanan
    ServiceProviderFilter.tsx              # Filter chip per kategori
    CompanionDeleteDialog.tsx              # AlertDialog konfirmasi hapus
```

---

## Task Grouping

### Sequential Chain 1: Foundation (AFK)
Tasks 1-4 execute sequentially (each depends on previous). Task 2 and Task 3 can run in parallel since both only depend on Task 1.

```
Task 1: companion-types.ts         (AFK, blocked by: None)
  ├──> Task 2: companion-catalog.ts       (AFK, blocked by: Task 1)   ──┐
  │                                                                      ├── PARALLEL
  └──> Task 3: companion-repository.ts   (AFK, blocked by: Task 1)   ──┘
                                          ↓
Task 4: companion-context.tsx      (AFK, blocked by: Tasks 1, 2, 3)
```

### Task 5: Core UI Shell (HITL)
Depends on Sequential Chain 1. All subsequent tasks depend on this.

### Parallel Batch 1: Feature Components (HITL)
Tasks 6-7 can run in parallel once Task 5 is done.

```
Task 6: CompanionSheet            (HITL, blocked by: Task 5)
Task 7: CompanionDeleteDialog     (HITL, blocked by: Task 5)
```

---

### Task 1: companion-types.ts — Type Definitions

**Type:** `AFK`
**Blocked by:** None

**Files:**
- Create: `lib/companion-types.ts`
- Test: `lib/__tests__/companion-types.test.ts`

- [ ] **Step 1: Write the type definitions file**

```ts
// lib/companion-types.ts
export type CompanionRole =
  | "friend"       // Sahabat
  | "sibling"      // Kakak / Adik
  | "parent"       // Orang Tua
  | "partner"      // Pasangan
  | "relative"     // Keluarga Lain
  | "other";       // Lainnya (custom)

export type ModuleAccess =
  | "journal"      // Jurnal Aman
  | "timeline"     // Kronologi Kejadian
  | "evidence";    // Brankas Bukti

export interface TrustedContact {
  id: string;
  name: string;
  role: CompanionRole;
  roleCustom?: string;
  phone: string;
  permissions: ModuleAccess[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategory =
  | "hotline"
  | "satgas-ppks"
  | "legal-aid"
  | "psychologist"
  | "social-service";

export interface ServiceProvider {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  phone: string;
  waNumber: string | null;
  email: string | null;
  website: string | null;
  address: string;
  operatingHours: string;
  isAvailable: boolean;
  icon: string;
}

export interface CompanionState {
  contacts: TrustedContact[];
  providers: ServiceProvider[];
  activeFilter: ServiceCategory | "all";
  selectedContactId: string | null;
  sheetMode: "add" | "edit" | null;
  loading: boolean;
  error: string | null;
}

export const DEFAULT_COMPANION_STATE: CompanionState = {
  contacts: [],
  providers: [],
  activeFilter: "all",
  selectedContactId: null,
  sheetMode: null,
  loading: true,
  error: null,
};

export const COMPANION_ROLE_LABELS: Record<CompanionRole, string> = {
  friend: "Sahabat",
  sibling: "Kakak / Adik",
  parent: "Orang Tua",
  partner: "Pasangan",
  relative: "Keluarga Lain",
  other: "Lainnya",
};

export const MODULE_ACCESS_LABELS: Record<ModuleAccess, string> = {
  journal: "Jurnal Aman",
  timeline: "Kronologi Kejadian",
  evidence: "Brankas Bukti",
};

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  hotline: "Hotline",
  "satgas-ppks": "Satgas PPKS",
  "legal-aid": "Bantuan Hukum",
  psychologist: "Psikolog",
  "social-service": "Layanan Sosial",
};
```

- [ ] **Step 2: Write tests**

```ts
// lib/__tests__/companion-types.test.ts
import { describe, it, expect } from "vitest";
import {
  DEFAULT_COMPANION_STATE,
  COMPANION_ROLE_LABELS,
  MODULE_ACCESS_LABELS,
  SERVICE_CATEGORY_LABELS,
  type CompanionRole,
  type ModuleAccess,
  type ServiceCategory,
} from "../companion-types";

describe("companion-types", () => {
  it("COMPANION_ROLE_LABELS has 6 entries", () => {
    expect(Object.keys(COMPANION_ROLE_LABELS)).toHaveLength(6);
  });

  it("each role has a non-empty label", () => {
    for (const label of Object.values(COMPANION_ROLE_LABELS)) {
      expect(label.length).toBeGreaterThan(0);
    }
  });

  it("MODULE_ACCESS_LABELS has 3 entries", () => {
    expect(Object.keys(MODULE_ACCESS_LABELS)).toHaveLength(3);
  });

  it("SERVICE_CATEGORY_LABELS has 5 entries", () => {
    expect(Object.keys(SERVICE_CATEGORY_LABELS)).toHaveLength(5);
  });

  it("DEFAULT_COMPANION_STATE has correct initial values", () => {
    expect(DEFAULT_COMPANION_STATE.contacts).toEqual([]);
    expect(DEFAULT_COMPANION_STATE.providers).toEqual([]);
    expect(DEFAULT_COMPANION_STATE.activeFilter).toBe("all");
    expect(DEFAULT_COMPANION_STATE.selectedContactId).toBeNull();
    expect(DEFAULT_COMPANION_STATE.sheetMode).toBeNull();
    expect(DEFAULT_COMPANION_STATE.loading).toBe(true);
    expect(DEFAULT_COMPANION_STATE.error).toBeNull();
  });
});
```

- [ ] **Step 3: Run test to verify it passes**

Run: `npx vitest run lib/__tests__/companion-types.test.ts`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add lib/companion-types.ts lib/__tests__/companion-types.test.ts
git commit -m "feat: add companion type definitions (TrustedContact, ServiceProvider, CompanionState)"
```

---

### Task 2: companion-catalog.ts — Katalog Statis

**Type:** `AFK`
**Blocked by:** Task 1

**Files:**
- Create: `lib/companion-catalog.ts`
- Test: `lib/__tests__/companion-catalog.test.ts`

- [ ] **Step 1: Write the catalog file**

```ts
// lib/companion-catalog.ts
import type { ServiceProvider } from "./companion-types";

export const SERVICE_PROVIDER_CATALOG: ServiceProvider[] = [
  {
    id: "layanan-darurat-112",
    name: "Layanan Darurat 112",
    category: "hotline",
    description: "Nomor darurat nasional untuk situasi yang mengancam keselamatan. Bebas pulsa, 24 jam.",
    phone: "112",
    waNumber: null,
    email: null,
    website: null,
    address: "Nasional",
    operatingHours: "24 jam, 7 hari",
    isAvailable: true,
    icon: "Phone",
  },
  {
    id: "sapa-129",
    name: "SAPA 129 — KemenPPPA",
    category: "hotline",
    description: "Sahabat Perempuan dan Anak (SAPA) 129. Layanan pengaduan kekerasan terhadap perempuan dan anak oleh Kementerian PPPA.",
    phone: "129",
    waNumber: "08111129129",
    email: null,
    website: "https://sapa129.kemenpppa.go.id",
    address: "Nasional",
    operatingHours: "24 jam, 7 hari",
    isAvailable: true,
    icon: "Heart",
  },
  {
    id: "komnas-perempuan",
    name: "Komnas Perempuan",
    category: "social-service",
    description: "Komisi Nasional Anti Kekerasan terhadap Perempuan. Layanan pengaduan dan pendampingan kasus kekerasan.",
    phone: "021-3903963",
    waNumber: null,
    email: "mail@komnasperempuan.go.id",
    website: "https://komnasperempuan.go.id",
    address: "Jl. Latuharhary No. 4B, Jakarta Pusat",
    operatingHours: "Senin-Jumat, 09:00-17:00 WIB",
    isAvailable: true,
    icon: "Building2",
  },
  {
    id: "satgas-ppks-unhas",
    name: "Satgas PPKS Universitas Hasanuddin",
    category: "satgas-ppks",
    description: "Satuan Tugas Pencegahan dan Penanganan Kekerasan Seksual di lingkungan Universitas Hasanuddin.",
    phone: "0811-2233-4455",
    waNumber: "0811-2233-4455",
    email: "satgasppks@unhas.ac.id",
    website: null,
    address: "Kampus Tamalanrea, Makassar",
    operatingHours: "Senin-Jumat, 08:00-16:00 WITA",
    isAvailable: true,
    icon: "Shield",
  },
  {
    id: "lbh-makassar",
    name: "LBH Makassar",
    category: "legal-aid",
    description: "Lembaga Bantuan Hukum Makassar — pendampingan hukum gratis untuk korban kekerasan.",
    phone: "0813-5544-3322",
    waNumber: "0813-5544-3322",
    email: "lbh.makassar@gmail.com",
    website: "https://lbhmakassar.org",
    address: "Jl. Perintis Kemerdekaan No. 45, Makassar",
    operatingHours: "Senin-Jumat, 09:00-17:00 WITA",
    isAvailable: true,
    icon: "Scale",
  },
  {
    id: "pusat-psikologi-makassar",
    name: "Pusat Psikologi Terapan Makassar",
    category: "psychologist",
    description: "Layanan konseling dan terapi psikologi untuk korban kekerasan dan trauma.",
    phone: "0411-8899-7766",
    waNumber: "0852-9988-1122",
    email: "psikologi.terapan@gmail.com",
    website: null,
    address: "Jl. A.P. Pettarani No. 88, Makassar",
    operatingHours: "Senin-Sabtu, 09:00-18:00 WITA",
    isAvailable: true,
    icon: "HeartPulse",
  },
];
```

- [ ] **Step 2: Write tests**

```ts
// lib/__tests__/companion-catalog.test.ts
import { describe, it, expect } from "vitest";
import { SERVICE_PROVIDER_CATALOG } from "../companion-catalog";
import type { ServiceCategory } from "../companion-types";

describe("companion-catalog", () => {
  it("has at least 4 entries", () => {
    expect(SERVICE_PROVIDER_CATALOG.length).toBeGreaterThanOrEqual(4);
  });

  it("every entry has a unique id", () => {
    const ids = SERVICE_PROVIDER_CATALOG.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every entry has required fields", () => {
    for (const provider of SERVICE_PROVIDER_CATALOG) {
      expect(provider.id.length).toBeGreaterThan(0);
      expect(provider.name.length).toBeGreaterThan(0);
      expect(provider.category.length).toBeGreaterThan(0);
      expect(provider.phone.length).toBeGreaterThan(0);
      expect(provider.icon.length).toBeGreaterThan(0);
      expect(provider.address.length).toBeGreaterThan(0);
    }
  });

  it("every entry has a valid category", () => {
    const validCategories: ServiceCategory[] = [
      "hotline", "satgas-ppks", "legal-aid", "psychologist", "social-service",
    ];
    for (const provider of SERVICE_PROVIDER_CATALOG) {
      expect(validCategories).toContain(provider.category);
    }
  });

  it("entries with waNumber have valid format", () => {
    for (const provider of SERVICE_PROVIDER_CATALOG) {
      if (provider.waNumber) {
        expect(provider.waNumber).toMatch(/^\d+$/);
      }
    }
  });
});
```

- [ ] **Step 3: Run test to verify it passes**

Run: `npx vitest run lib/__tests__/companion-catalog.test.ts`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add lib/companion-catalog.ts lib/__tests__/companion-catalog.test.ts
git commit -m "feat: add companion service provider catalog (6 curated entries)"
```

---

### Task 3: companion-repository-localstorage.ts — Storage Layer

**Type:** `AFK`
**Blocked by:** Task 1

**Files:**
- Create: `lib/companion-repository-localstorage.ts`
- Test: `lib/__tests__/companion-repository-localstorage.test.ts`

- [ ] **Step 1: Write the repository implementation**

```ts
// lib/companion-repository-localstorage.ts
import type { TrustedContact } from "./companion-types";

const CONTACTS_KEY = "companion:contacts";

export function createCompanionRepository() {
  return {
    getAllContacts(): TrustedContact[] {
      try {
        const raw = localStorage.getItem(CONTACTS_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    },

    saveContact(contact: TrustedContact): void {
      const contacts = this.getAllContacts();
      const idx = contacts.findIndex((c) => c.id === contact.id);
      if (idx !== -1) {
        contacts[idx] = contact;
      } else {
        contacts.push(contact);
      }
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
    },

    updateContact(id: string, updates: Partial<TrustedContact>): TrustedContact | null {
      const contacts = this.getAllContacts();
      const idx = contacts.findIndex((c) => c.id === id);
      if (idx === -1) return null;
      contacts[idx] = { ...contacts[idx], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
      return contacts[idx];
    },

    deleteContact(id: string): boolean {
      const contacts = this.getAllContacts();
      const filtered = contacts.filter((c) => c.id !== id);
      if (filtered.length === contacts.length) return false;
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(filtered));
      return true;
    },
  };
}

export type CompanionRepository = ReturnType<typeof createCompanionRepository>;
```

- [ ] **Step 2: Write the failing tests**

```ts
// lib/__tests__/companion-repository-localstorage.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { createCompanionRepository } from "../companion-repository-localstorage";
import type { TrustedContact } from "../companion-types";

function makeContact(overrides: Partial<TrustedContact> = {}): TrustedContact {
  return {
    id: "c1",
    name: "Ayu Rahma",
    role: "friend",
    phone: "081234567890",
    permissions: ["journal"],
    notes: "",
    createdAt: "2026-06-12T00:00:00.000Z",
    updatedAt: "2026-06-12T00:00:00.000Z",
    ...overrides,
  };
}

describe("CompanionRepository (localStorage)", () => {
  let repo: ReturnType<typeof createCompanionRepository>;

  beforeEach(() => {
    localStorage.clear();
    repo = createCompanionRepository();
  });

  it("returns empty array when no contacts", () => {
    expect(repo.getAllContacts()).toEqual([]);
  });

  it("saves and retrieves a contact", () => {
    const contact = makeContact();
    repo.saveContact(contact);
    const contacts = repo.getAllContacts();
    expect(contacts).toHaveLength(1);
    expect(contacts[0].id).toBe("c1");
    expect(contacts[0].name).toBe("Ayu Rahma");
  });

  it("updates an existing contact by id", () => {
    repo.saveContact(makeContact());
    const updated = repo.updateContact("c1", { name: "Ayu Rahma Putri", permissions: ["journal", "timeline"] });
    expect(updated).not.toBeNull();
    expect(updated!.name).toBe("Ayu Rahma Putri");
    expect(updated!.permissions).toEqual(["journal", "timeline"]);
    expect(updated!.updatedAt).not.toBe("2026-06-12T00:00:00.000Z");
    // Verify persistence
    const contacts = repo.getAllContacts();
    expect(contacts[0].name).toBe("Ayu Rahma Putri");
  });

  it("returns null when updating non-existent contact", () => {
    const result = repo.updateContact("nonexistent", { name: "X" });
    expect(result).toBeNull();
  });

  it("saves a new contact (not update existing)", () => {
    repo.saveContact(makeContact({ id: "c1" }));
    repo.saveContact(makeContact({ id: "c2", name: "Budi Darma" }));
    expect(repo.getAllContacts()).toHaveLength(2);
  });

  it("deletes a contact by id", () => {
    repo.saveContact(makeContact());
    const deleted = repo.deleteContact("c1");
    expect(deleted).toBe(true);
    expect(repo.getAllContacts()).toHaveLength(0);
  });

  it("returns false when deleting non-existent contact", () => {
    const deleted = repo.deleteContact("nonexistent");
    expect(deleted).toBe(false);
  });

  it("handles corrupt localStorage data gracefully", () => {
    localStorage.setItem("companion:contacts", "not-valid-json{{{");
    const contacts = repo.getAllContacts();
    expect(contacts).toEqual([]);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run lib/__tests__/companion-repository-localstorage.test.ts`
Expected: FAIL — module not found (file not created yet)

- [ ] **Step 4: Create the implementation file (already written in Step 1)**

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run lib/__tests__/companion-repository-localstorage.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add lib/companion-repository-localstorage.ts lib/__tests__/companion-repository-localstorage.test.ts
git commit -m "feat: add companion localStorage repository (CRUD for TrustedContact)"
```

---

### Task 4: companion-context.tsx — State Management

**Type:** `AFK`
**Blocked by:** Tasks 1, 2, 3

**Files:**
- Create: `lib/companion-context.tsx`
- Test: `lib/__tests__/companion-context.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
// lib/__tests__/companion-context.test.tsx
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import React from "react";
import { CompanionProvider, useCompanion } from "../companion-context";
import type { TrustedContact } from "../companion-types";

beforeEach(() => {
  localStorage.clear();
});

function wrapper({ children }: { children: React.ReactNode }) {
  return <CompanionProvider>{children}</CompanionProvider>;
}

const input = {
  name: "Ayu Rahma",
  role: "friend" as const,
  phone: "081234567890",
  permissions: [] as [],
  notes: "",
};

describe("CompanionContext", () => {
  it("starts with loading state and empty contacts", async () => {
    const { result } = renderHook(() => useCompanion(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));
    expect(result.current.state.contacts).toEqual([]);
  });

  it("loads providers from catalog", async () => {
    const { result } = renderHook(() => useCompanion(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));
    expect(result.current.state.providers.length).toBeGreaterThanOrEqual(4);
  });

  it("adds a contact", async () => {
    const { result } = renderHook(() => useCompanion(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    act(() => {
      result.current.addContact(input);
    });

    expect(result.current.state.contacts).toHaveLength(1);
    expect(result.current.state.contacts[0].name).toBe("Ayu Rahma");
    expect(result.current.state.contacts[0].role).toBe("friend");
    expect(result.current.state.contacts[0].id).toBeDefined();
    expect(result.current.state.contacts[0].createdAt).toBeDefined();
  });

  it("updates a contact", async () => {
    const { result } = renderHook(() => useCompanion(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    act(() => {
      result.current.addContact(input);
    });

    const id = result.current.state.contacts[0].id;

    act(() => {
      result.current.updateContact(id, { name: "Ayu Rahma Putri" });
    });

    expect(result.current.state.contacts[0].name).toBe("Ayu Rahma Putri");
  });

  it("deletes a contact", async () => {
    const { result } = renderHook(() => useCompanion(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    act(() => {
      result.current.addContact(input);
    });

    const id = result.current.state.contacts[0].id;

    act(() => {
      result.current.deleteContact(id);
    });

    expect(result.current.state.contacts).toHaveLength(0);
  });

  it("opens and closes add sheet", async () => {
    const { result } = renderHook(() => useCompanion(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    act(() => {
      result.current.openAddSheet();
    });
    expect(result.current.state.sheetMode).toBe("add");

    act(() => {
      result.current.closeSheet();
    });
    expect(result.current.state.sheetMode).toBeNull();
  });

  it("opens and closes edit sheet with selected contact", async () => {
    const { result } = renderHook(() => useCompanion(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    act(() => {
      result.current.addContact(input);
    });

    const id = result.current.state.contacts[0].id;

    act(() => {
      result.current.openEditSheet(id);
    });
    expect(result.current.state.sheetMode).toBe("edit");
    expect(result.current.state.selectedContactId).toBe(id);

    act(() => {
      result.current.closeSheet();
    });
    expect(result.current.state.sheetMode).toBeNull();
  });

  it("grants and revokes access", async () => {
    const { result } = renderHook(() => useCompanion(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    act(() => {
      result.current.addContact(input);
    });

    const id = result.current.state.contacts[0].id;

    act(() => {
      result.current.grantAccess(id, "journal");
    });
    expect(result.current.state.contacts[0].permissions).toContain("journal");

    act(() => {
      result.current.revokeAccess(id, "journal");
    });
    expect(result.current.state.contacts[0].permissions).not.toContain("journal");
  });

  it("sets filter", async () => {
    const { result } = renderHook(() => useCompanion(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    act(() => {
      result.current.setFilter("hotline");
    });
    expect(result.current.state.activeFilter).toBe("hotline");

    act(() => {
      result.current.setFilter("all");
    });
    expect(result.current.state.activeFilter).toBe("all");
  });

  it("persists contacts across provider remounts", async () => {
    const { result, unmount } = renderHook(() => useCompanion(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    act(() => {
      result.current.addContact(input);
    });

    unmount();

    const { result: result2 } = renderHook(() => useCompanion(), { wrapper });
    await waitFor(() => expect(result2.current.state.loading).toBe(false));
    expect(result2.current.state.contacts).toHaveLength(1);
    expect(result2.current.state.contacts[0].name).toBe("Ayu Rahma");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/__tests__/companion-context.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Write the context implementation**

```tsx
// lib/companion-context.tsx
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
  TrustedContact,
  ServiceCategory,
  ModuleAccess,
  CompanionState,
} from "./companion-types";
import { DEFAULT_COMPANION_STATE } from "./companion-types";
import { SERVICE_PROVIDER_CATALOG } from "./companion-catalog";
import { createCompanionRepository } from "./companion-repository-localstorage";

// ---- ID Generator ----

function generateId(): string {
  return crypto.randomUUID();
}

// ---- Reducer ----

type CompanionAction =
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_CONTACTS"; contacts: TrustedContact[] }
  | { type: "ADD_CONTACT"; contact: TrustedContact }
  | { type: "UPDATE_CONTACT"; id: string; updates: Partial<TrustedContact> }
  | { type: "REMOVE_CONTACT"; id: string }
  | { type: "SET_PROVIDERS"; providers: typeof SERVICE_PROVIDER_CATALOG }
  | { type: "SET_FILTER"; category: ServiceCategory | "all" }
  | { type: "OPEN_SHEET"; mode: "add" | "edit"; contactId: string | null }
  | { type: "CLOSE_SHEET" };

function companionReducer(state: CompanionState, action: CompanionAction): CompanionState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "SET_CONTACTS":
      return { ...state, contacts: action.contacts };
    case "ADD_CONTACT":
      return { ...state, contacts: [...state.contacts, action.contact] };
    case "UPDATE_CONTACT": {
      const contacts = state.contacts.map((c) =>
        c.id === action.id ? { ...c, ...action.updates } : c
      );
      return { ...state, contacts };
    }
    case "REMOVE_CONTACT":
      return {
        ...state,
        contacts: state.contacts.filter((c) => c.id !== action.id),
        selectedContactId:
          state.selectedContactId === action.id ? null : state.selectedContactId,
      };
    case "SET_PROVIDERS":
      return { ...state, providers: action.providers };
    case "SET_FILTER":
      return { ...state, activeFilter: action.category };
    case "OPEN_SHEET":
      return { ...state, sheetMode: action.mode, selectedContactId: action.contactId };
    case "CLOSE_SHEET":
      return { ...state, sheetMode: null, selectedContactId: null };
    default:
      return state;
  }
}

// ---- Context ----

interface CompanionContextValue {
  state: CompanionState;
  addContact: (input: Omit<TrustedContact, "id" | "createdAt" | "updatedAt">) => void;
  updateContact: (id: string, updates: Partial<TrustedContact>) => void;
  deleteContact: (id: string) => void;
  openAddSheet: () => void;
  openEditSheet: (id: string) => void;
  closeSheet: () => void;
  setFilter: (category: ServiceCategory | "all") => void;
  grantAccess: (contactId: string, module: ModuleAccess) => void;
  revokeAccess: (contactId: string, module: ModuleAccess) => void;
}

const CompanionContext = createContext<CompanionContextValue | null>(null);

// ---- Provider ----

export function CompanionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(companionReducer, DEFAULT_COMPANION_STATE);
  const repo = createCompanionRepository();

  // Load initial state
  useEffect(() => {
    const contacts = repo.getAllContacts();
    dispatch({ type: "SET_CONTACTS", contacts });
    dispatch({ type: "SET_PROVIDERS", providers: SERVICE_PROVIDER_CATALOG });
    dispatch({ type: "SET_LOADING", loading: false });
  }, []);

  const addContact = useCallback(
    (input: Omit<TrustedContact, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const contact: TrustedContact = {
        ...input,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
        notes: input.notes ?? "",
        roleCustom: input.roleCustom,
      };
      repo.saveContact(contact);
      dispatch({ type: "ADD_CONTACT", contact });
    },
    []
  );

  const updateContact = useCallback((id: string, updates: Partial<TrustedContact>) => {
    const updated = repo.updateContact(id, updates);
    if (updated) {
      dispatch({ type: "UPDATE_CONTACT", id, updates: { ...updates, updatedAt: updated.updatedAt } });
    }
  }, []);

  const deleteContact = useCallback((id: string) => {
    repo.deleteContact(id);
    dispatch({ type: "REMOVE_CONTACT", id });
  }, []);

  const openAddSheet = useCallback(() => {
    dispatch({ type: "OPEN_SHEET", mode: "add", contactId: null });
  }, []);

  const openEditSheet = useCallback((id: string) => {
    dispatch({ type: "OPEN_SHEET", mode: "edit", contactId: id });
  }, []);

  const closeSheet = useCallback(() => {
    dispatch({ type: "CLOSE_SHEET" });
  }, []);

  const setFilter = useCallback((category: ServiceCategory | "all") => {
    dispatch({ type: "SET_FILTER", category });
  }, []);

  const grantAccess = useCallback((contactId: string, module: ModuleAccess) => {
    const contact = state.contacts.find((c) => c.id === contactId);
    if (!contact || contact.permissions.includes(module)) return;
    const permissions = [...contact.permissions, module];
    updateContact(contactId, { permissions });
  }, [state.contacts, updateContact]);

  const revokeAccess = useCallback((contactId: string, module: ModuleAccess) => {
    const contact = state.contacts.find((c) => c.id === contactId);
    if (!contact || !contact.permissions.includes(module)) return;
    const permissions = contact.permissions.filter((m) => m !== module);
    updateContact(contactId, { permissions });
  }, [state.contacts, updateContact]);

  return (
    <CompanionContext.Provider
      value={{
        state,
        addContact,
        updateContact,
        deleteContact,
        openAddSheet,
        openEditSheet,
        closeSheet,
        setFilter,
        grantAccess,
        revokeAccess,
      }}
    >
      {children}
    </CompanionContext.Provider>
  );
}

export function useCompanion() {
  const ctx = useContext(CompanionContext);
  if (!ctx) throw new Error("useCompanion must be used within CompanionProvider");
  return ctx;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/__tests__/companion-context.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/companion-context.tsx lib/__tests__/companion-context.test.tsx
git commit -m "feat: add CompanionContext with contact CRUD, permission management, and sheet state"
```

---

### Task 5: Core UI Shell — Page + Grid + Cards + List + Filter

**Type:** `HITL`
**Blocked by:** Task 4

**Files:**
- Create: `app/(main)/pendamping-tepercaya/_components/PendampingClient.tsx`
- Create: `app/(main)/pendamping-tepercaya/_components/CompanionGrid.tsx`
- Create: `app/(main)/pendamping-tepercaya/_components/CompanionCard.tsx`
- Create: `app/(main)/pendamping-tepercaya/_components/ServiceProviderList.tsx`
- Create: `app/(main)/pendamping-tepercaya/_components/ServiceProviderRow.tsx`
- Create: `app/(main)/pendamping-tepercaya/_components/ServiceProviderFilter.tsx`
- Modify: `app/(main)/pendamping-tepercaya/page.tsx`
- Test: `app/(main)/pendamping-tepercaya/__tests__/CompanionCard.test.tsx`
- Test: `app/(main)/pendamping-tepercaya/__tests__/CompanionGrid.test.tsx`
- Test: `app/(main)/pendamping-tepercaya/__tests__/ServiceProviderFilter.test.tsx`
- Test: `app/(main)/pendamping-tepercaya/__tests__/ServiceProviderRow.test.tsx`

- [ ] **Step 1: Write component tests (all must fail before implementation)**

```tsx
// app/(main)/pendamping-tepercaya/__tests__/CompanionCard.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompanionCard } from "../_components/CompanionCard";
import type { TrustedContact } from "@/lib/companion-types";

const mockContact: TrustedContact = {
  id: "c1",
  name: "Ayu Rahma",
  role: "friend",
  phone: "081234567890",
  permissions: ["journal", "timeline"],
  notes: "Teman dekat sejak SMA",
  createdAt: "2026-06-01T00:00:00.000Z",
  updatedAt: "2026-06-01T00:00:00.000Z",
};

describe("CompanionCard", () => {
  it("renders contact name", () => {
    render(<CompanionCard contact={mockContact} onClick={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Ayu Rahma")).toBeInTheDocument();
  });

  it("renders role label", () => {
    render(<CompanionCard contact={mockContact} onClick={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Sahabat")).toBeInTheDocument();
  });

  it("renders permission chips", () => {
    render(<CompanionCard contact={mockContact} onClick={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Jurnal")).toBeInTheDocument();
    expect(screen.getByText("Kronologi")).toBeInTheDocument();
  });

  it("shows no permission chips when permissions is empty", () => {
    const contact = { ...mockContact, permissions: [] };
    render(<CompanionCard contact={contact} onClick={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.queryByText("Jurnal")).not.toBeInTheDocument();
  });

  it("renders avatar initials from name", () => {
    render(<CompanionCard contact={mockContact} onClick={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("AR")).toBeInTheDocument();
  });

  it("calls onClick when card is clicked", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<CompanionCard contact={mockContact} onClick={onClick} onDelete={vi.fn()} />);
    await user.click(screen.getByText("Ayu Rahma"));
    expect(onClick).toHaveBeenCalledWith("c1");
  });

  it("calls onDelete when delete button is clicked", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<CompanionCard contact={mockContact} onClick={vi.fn()} onDelete={onDelete} />);
    const deleteBtn = screen.getByLabelText("Hapus Ayu Rahma");
    await user.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith("c1");
  });

  it("has accessible button label for Hubungi", () => {
    render(<CompanionCard contact={mockContact} onClick={vi.fn()} onDelete={vi.fn()} />);
    const hubungiBtn = screen.getByRole("button", { name: /Hubungi Ayu Rahma/i });
    expect(hubungiBtn).toBeInTheDocument();
  });
});
```

```tsx
// app/(main)/pendamping-tepercaya/__tests__/CompanionGrid.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompanionGrid } from "../_components/CompanionGrid";
import type { TrustedContact } from "@/lib/companion-types";

const contacts: TrustedContact[] = [
  {
    id: "c1", name: "Ayu Rahma", role: "friend", phone: "08123",
    permissions: ["journal"], notes: "", createdAt: "2026-06-01T00:00:00.000Z",
    updatedAt: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "c2", name: "Budi Darma", role: "sibling", phone: "08567",
    permissions: [], notes: "", createdAt: "2026-06-02T00:00:00.000Z",
    updatedAt: "2026-06-02T00:00:00.000Z",
  },
];

describe("CompanionGrid", () => {
  it("renders all contacts as cards", () => {
    render(
      <CompanionGrid contacts={contacts} onSelect={vi.fn()} onDelete={vi.fn()} onAdd={vi.fn()} />
    );
    expect(screen.getByText("Ayu Rahma")).toBeInTheDocument();
    expect(screen.getByText("Budi Darma")).toBeInTheDocument();
  });

  it("renders add card as last item", () => {
    render(
      <CompanionGrid contacts={contacts} onSelect={vi.fn()} onDelete={vi.fn()} onAdd={vi.fn()} />
    );
    expect(screen.getByText("Tambah Pendamping")).toBeInTheDocument();
  });

  it("calls onAdd when add card is clicked", async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(
      <CompanionGrid contacts={contacts} onSelect={vi.fn()} onDelete={vi.fn()} onAdd={onAdd} />
    );
    await user.click(screen.getByText("Tambah Pendamping"));
    expect(onAdd).toHaveBeenCalled();
  });

  it("shows empty state when no contacts", () => {
    render(
      <CompanionGrid contacts={[]} onSelect={vi.fn()} onDelete={vi.fn()} onAdd={vi.fn()} />
    );
    expect(screen.getByText(/Belum ada pendamping/)).toBeInTheDocument();
    expect(screen.queryByText("Tambah Pendamping")).not.toBeInTheDocument();
  });
});
```

```tsx
// app/(main)/pendamping-tepercaya/__tests__/ServiceProviderFilter.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ServiceProviderFilter } from "../_components/ServiceProviderFilter";

describe("ServiceProviderFilter", () => {
  it("renders all category chips plus 'Semua'", () => {
    render(<ServiceProviderFilter active="all" onSelect={vi.fn()} />);
    expect(screen.getByText("Semua")).toBeInTheDocument();
    expect(screen.getByText("Hotline")).toBeInTheDocument();
    expect(screen.getByText("Satgas PPKS")).toBeInTheDocument();
    expect(screen.getByText("Bantuan Hukum")).toBeInTheDocument();
    expect(screen.getByText("Psikolog")).toBeInTheDocument();
    expect(screen.getByText("Layanan Sosial")).toBeInTheDocument();
  });

  it("highlights active chip", () => {
    render(<ServiceProviderFilter active="hotline" onSelect={vi.fn()} />);
    const hotlineChip = screen.getByText("Hotline");
    expect(hotlineChip.className).toContain("sidebar-accent");
  });

  it("calls onSelect when chip is clicked", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<ServiceProviderFilter active="all" onSelect={onSelect} />);
    await user.click(screen.getByText("Psikolog"));
    expect(onSelect).toHaveBeenCalledWith("psychologist");
  });

  it("resets to 'all' when Semua is clicked", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<ServiceProviderFilter active="hotline" onSelect={onSelect} />);
    await user.click(screen.getByText("Semua"));
    expect(onSelect).toHaveBeenCalledWith("all");
  });
});
```

```tsx
// app/(main)/pendamping-tepercaya/__tests__/ServiceProviderRow.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ServiceProviderRow } from "../_components/ServiceProviderRow";
import type { ServiceProvider } from "@/lib/companion-types";

const mockProvider: ServiceProvider = {
  id: "satgas-ppks-unhas",
  name: "Satgas PPKS Unhas",
  category: "satgas-ppks",
  description: "Satuan Tugas PPKS",
  phone: "0811223344",
  waNumber: "0811223344",
  email: null,
  website: null,
  address: "Kampus Tamalanrea",
  operatingHours: "Senin-Jumat, 08:00-16:00",
  isAvailable: true,
  icon: "Shield",
};

describe("ServiceProviderRow", () => {
  it("renders provider name", () => {
    render(<ServiceProviderRow provider={mockProvider} />);
    expect(screen.getByText("Satgas PPKS Unhas")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<ServiceProviderRow provider={mockProvider} />);
    expect(screen.getByText("Satuan Tugas PPKS")).toBeInTheDocument();
  });

  it("renders 'Tersedia' badge when available", () => {
    render(<ServiceProviderRow provider={mockProvider} />);
    expect(screen.getByText("Tersedia")).toBeInTheDocument();
  });

  it("renders 'Tutup' badge when not available", () => {
    const unavailable = { ...mockProvider, isAvailable: false };
    render(<ServiceProviderRow provider={unavailable} />);
    expect(screen.getByText("Tutup")).toBeInTheDocument();
  });

  it("has accessible Hubungi button", () => {
    render(<ServiceProviderRow provider={mockProvider} />);
    const btn = screen.getByRole("button", { name: /Hubungi Satgas PPKS Unhas/i });
    expect(btn).toBeInTheDocument();
  });

  it("opens WhatsApp link when waNumber exists", async () => {
    const user = userEvent.setup();
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<ServiceProviderRow provider={mockProvider} />);
    await user.click(screen.getByRole("button", { name: /Hubungi/ }));
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining("wa.me/62"),
      "_blank"
    );
    openSpy.mockRestore();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:
```bash
npx vitest run app/\(main\)/pendamping-tepercaya/__tests__/CompanionCard.test.tsx \
  app/\(main\)/pendamping-tepercaya/__tests__/CompanionGrid.test.tsx \
  app/\(main\)/pendamping-tepercaya/__tests__/ServiceProviderFilter.test.tsx \
  app/\(main\)/pendamping-tepercaya/__tests__/ServiceProviderRow.test.tsx
```
Expected: FAIL — module not found

- [ ] **Step 3: Write component implementations**

```tsx
// app/(main)/pendamping-tepercaya/_components/CompanionCard.tsx
"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANION_ROLE_LABELS, MODULE_ACCESS_LABELS, type TrustedContact } from "@/lib/companion-types";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    friend: "bg-badge-teal",
    sibling: "bg-badge-violet",
    parent: "bg-badge-orange",
    partner: "bg-badge-pink",
    relative: "bg-badge-blue",
    other: "bg-badge-emerald",
  };
  return colors[role] ?? "bg-muted";
}

function getWhatsAppUrl(phone: string): string {
  const cleaned = phone.replace(/^0/, "62").replace(/[^0-9]/g, "");
  return `https://wa.me/${cleaned}`;
}

interface CompanionCardProps {
  contact: TrustedContact;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CompanionCard({ contact, onClick, onDelete }: CompanionCardProps) {
  const initials = getInitials(contact.name);
  const roleLabel =
    contact.role === "other" && contact.roleCustom
      ? contact.roleCustom
      : COMPANION_ROLE_LABELS[contact.role];

  const handleHubungi = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(getWhatsAppUrl(contact.phone), "_blank");
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(contact.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Edit ${contact.name}`}
      onClick={() => onClick(contact.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(contact.id);
        }
      }}
      className="bg-background border border-border rounded-lg p-5 cursor-pointer
        hover:border-primary/30 transition-colors focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-ring relative group"
    >
      {/* Delete button */}
      <button
        type="button"
        aria-label={`Hapus ${contact.name}`}
        onClick={handleDelete}
        className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground
          opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive
          transition-opacity focus-visible:opacity-100"
      >
        <Trash2 className="size-4" />
      </button>

      {/* Avatar + Name + Role */}
      <div className="flex flex-col items-center text-center mb-4">
        <div
          className={`w-12 h-12 rounded-full ${getRoleColor(contact.role)}
            flex items-center justify-center text-white font-bold text-lg mb-2`}
          aria-hidden="true"
        >
          {initials}
        </div>
        <h3 className="text-title-sm font-semibold text-foreground">{contact.name}</h3>
        <p className="text-caption text-muted-foreground">{roleLabel}</p>
      </div>

      {/* Permission chips */}
      {contact.permissions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1 mb-3">
          {contact.permissions.map((perm) => (
            <span
              key={perm}
              className="inline-flex items-center rounded-full bg-card text-foreground
                px-2 py-0.5 text-[11px] font-medium"
            >
              {MODULE_ACCESS_LABELS[perm]}
            </span>
          ))}
        </div>
      )}

      {/* Hubungi button */}
      <Button
        type="button"
        variant="default"
        size="sm"
        className="w-full"
        aria-label={`Hubungi ${contact.name} via WhatsApp`}
        onClick={handleHubungi}
      >
        Hubungi Sekarang
      </Button>
    </div>
  );
}
```

```tsx
// app/(main)/pendamping-tepercaya/_components/CompanionGrid.tsx
"use client";

import { Plus } from "lucide-react";
import { CompanionCard } from "./CompanionCard";
import type { TrustedContact } from "@/lib/companion-types";

interface CompanionGridProps {
  contacts: TrustedContact[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function CompanionGrid({ contacts, onSelect, onDelete, onAdd }: CompanionGridProps) {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-12 px-4 border border-dashed border-muted rounded-lg">
        <p className="text-muted-foreground mb-4">
          Belum ada pendamping. Tambahkan orang yang kamu percaya.
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md
            bg-primary text-primary-foreground text-sm font-semibold
            hover:bg-primary/90 transition-colors"
        >
          <Plus className="size-4" />
          Tambah Pendamping
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {contacts.map((contact) => (
        <CompanionCard
          key={contact.id}
          contact={contact}
          onClick={onSelect}
          onDelete={onDelete}
        />
      ))}
      {/* Add card */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Tambah pendamping baru"
        onClick={onAdd}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onAdd();
          }
        }}
        className="bg-background border border-dashed border-primary rounded-lg p-5
          flex flex-col items-center justify-center min-h-[200px] cursor-pointer
          hover:bg-sidebar-accent/30 transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="w-12 h-12 rounded-full bg-sidebar-accent flex items-center justify-center mb-3">
          <Plus className="size-6 text-primary" />
        </div>
        <p className="text-sm font-medium text-primary">Tambah Pendamping</p>
      </div>
    </div>
  );
}
```

```tsx
// app/(main)/pendamping-tepercaya/_components/ServiceProviderFilter.tsx
"use client";

import { SERVICE_CATEGORY_LABELS, type ServiceCategory } from "@/lib/companion-types";

const CATEGORIES: (ServiceCategory | "all")[] = [
  "all",
  "hotline",
  "satgas-ppks",
  "legal-aid",
  "psychologist",
  "social-service",
];

interface ServiceProviderFilterProps {
  active: ServiceCategory | "all";
  onSelect: (category: ServiceCategory | "all") => void;
}

export function ServiceProviderFilter({ active, onSelect }: ServiceProviderFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" role="radiogroup" aria-label="Filter kategori penyedia layanan">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat;
        const label = cat === "all" ? "Semua" : SERVICE_CATEGORY_LABELS[cat];
        return (
          <button
            key={cat}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onSelect(cat)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors
              border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
              ${isActive
                ? "bg-sidebar-accent text-primary-text border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary/30"
              }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
```

```tsx
// app/(main)/pendamping-tepercaya/_components/ServiceProviderRow.tsx
"use client";

import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import type { ServiceProvider } from "@/lib/companion-types";
import { createElement } from "react";

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    hotline: "bg-badge-pink",
    "satgas-ppks": "bg-badge-blue",
    "legal-aid": "bg-badge-violet",
    psychologist: "bg-badge-teal",
    "social-service": "bg-badge-emerald",
  };
  return colors[category] ?? "bg-muted";
}

function getContactUrl(provider: ServiceProvider): { url: string; isWa: boolean } {
  if (provider.waNumber) {
    const cleaned = provider.waNumber.replace(/^0/, "62").replace(/[^0-9]/g, "");
    return { url: `https://wa.me/${cleaned}`, isWa: true };
  }
  return { url: `tel:${provider.phone.replace(/[^0-9+]/g, "")}`, isWa: false };
}

interface ServiceProviderRowProps {
  provider: ServiceProvider;
}

export function ServiceProviderRow({ provider }: ServiceProviderRowProps) {
  // Dynamically resolve Lucide icon
  const iconModule = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[provider.icon];
  const IconComponent = iconModule ?? LucideIcons.HelpCircle;

  const { url } = getContactUrl(provider);

  const handleHubungi = () => {
    window.open(url, "_blank");
  };

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 bg-background border border-border rounded-lg
        hover:border-primary/20 transition-colors"
    >
      {/* Icon */}
      <div
        className={`w-9 h-9 rounded-full ${getCategoryColor(provider.category)}
          flex items-center justify-center flex-shrink-0`}
        aria-hidden="true"
      >
        {createElement(IconComponent, { className: "size-4 text-white" })}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-title-sm font-semibold text-foreground truncate">{provider.name}</h4>
        <p className="text-body-sm text-muted-foreground truncate">
          {provider.description} &middot; {provider.address}
        </p>
      </div>

      {/* Status badge */}
      <span
        className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
          provider.isAvailable
            ? "bg-success text-[#064e3b]"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {provider.isAvailable ? "Tersedia" : "Tutup"}
      </span>

      {/* Hubungi button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="shrink-0"
        aria-label={`Hubungi ${provider.name}`}
        onClick={handleHubungi}
      >
        Hubungi
      </Button>
    </div>
  );
}
```

```tsx
// app/(main)/pendamping-tepercaya/_components/ServiceProviderList.tsx
"use client";

import { ServiceProviderRow } from "./ServiceProviderRow";
import type { ServiceProvider } from "@/lib/companion-types";

interface ServiceProviderListProps {
  providers: ServiceProvider[];
}

export function ServiceProviderList({ providers }: ServiceProviderListProps) {
  if (providers.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        Tidak ada penyedia layanan untuk kategori ini.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {providers.map((provider) => (
        <ServiceProviderRow key={provider.id} provider={provider} />
      ))}
    </div>
  );
}
```

```tsx
// app/(main)/pendamping-tepercaya/_components/PendampingClient.tsx
"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompanion } from "@/lib/companion-context";
import { CompanionGrid } from "./CompanionGrid";
import { CompanionSheet } from "./CompanionSheet";
import { CompanionDeleteDialog } from "./CompanionDeleteDialog";
import { ServiceProviderFilter } from "./ServiceProviderFilter";
import { ServiceProviderList } from "./ServiceProviderList";

export function PendampingClient() {
  const {
    state,
    openAddSheet,
    openEditSheet,
    closeSheet,
    setFilter,
    deleteContact,
  } = useCompanion();

  const selectedContact = state.selectedContactId
    ? state.contacts.find((c) => c.id === state.selectedContactId) ?? null
    : null;

  const filteredProviders =
    state.activeFilter === "all"
      ? state.providers
      : state.providers.filter((p) => p.category === state.activeFilter);

  if (state.loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-md font-bold text-foreground">
            Pendamping Tepercaya
          </h1>
          <p className="text-body-sm text-muted-foreground mt-1">
            Kelola kontak pendamping dan penyedia layanan dukungan.
          </p>
        </div>
        <Button onClick={openAddSheet} className="gap-2">
          <Plus className="size-4" />
          Tambah
        </Button>
      </div>

      {/* Section 1: Pendamping Personal */}
      <section>
        <h2 className="text-title-lg font-semibold text-foreground mb-4">
          Pendamping Personal
        </h2>
        <CompanionGrid
          contacts={state.contacts}
          onSelect={openEditSheet}
          onDelete={(id) => {
            openEditSheet(id);
            // Delete dialog will be triggered from sheet or card
          }}
          onAdd={openAddSheet}
        />
      </section>

      {/* Section 2: Penyedia Layanan Dukungan */}
      <section>
        <h2 className="text-title-lg font-semibold text-foreground mb-4">
          Penyedia Layanan Dukungan
        </h2>
        <div className="space-y-3">
          <ServiceProviderFilter active={state.activeFilter} onSelect={setFilter} />
          <ServiceProviderList providers={filteredProviders} />
        </div>
      </section>

      {/* Sheet */}
      {(state.sheetMode === "add" || (state.sheetMode === "edit" && selectedContact)) && (
        <CompanionSheet
          mode={state.sheetMode}
          contact={selectedContact}
          open={true}
          onClose={closeSheet}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 4: Modify page.tsx to replace placeholder**

```tsx
// app/(main)/pendamping-tepercaya/page.tsx
"use client";

import { CompanionProvider } from "@/lib/companion-context";
import { PendampingClient } from "./_components/PendampingClient";

export default function PendampingTepercayaPage() {
  return (
    <CompanionProvider>
      <PendampingClient />
    </CompanionProvider>
  );
}
```

Note: The `CompanionSheet` and `CompanionDeleteDialog` imports in `PendampingClient.tsx` reference components that don't exist yet (Tasks 6 and 7). Comment them out temporarily:

```tsx
// Temporarily comment these until Task 6 and 7 are done:
// import { CompanionSheet } from "./CompanionSheet";
// import { CompanionDeleteDialog } from "./CompanionDeleteDialog";
```

- [ ] **Step 5: Run tests to verify they pass**

Run:
```bash
npx vitest run app/\(main\)/pendamping-tepercaya/__tests__/CompanionCard.test.tsx \
  app/\(main\)/pendamping-tepercaya/__tests__/CompanionGrid.test.tsx \
  app/\(main\)/pendamping-tepercaya/__tests__/ServiceProviderFilter.test.tsx \
  app/\(main\)/pendamping-tepercaya/__tests__/ServiceProviderRow.test.tsx
```
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add app/\(main\)/pendamping-tepercaya/page.tsx \
  app/\(main\)/pendamping-tepercaya/_components/PendampingClient.tsx \
  app/\(main\)/pendamping-tepercaya/_components/CompanionGrid.tsx \
  app/\(main\)/pendamping-tepercaya/_components/CompanionCard.tsx \
  app/\(main\)/pendamping-tepercaya/_components/ServiceProviderList.tsx \
  app/\(main\)/pendamping-tepercaya/_components/ServiceProviderRow.tsx \
  app/\(main\)/pendamping-tepercaya/_components/ServiceProviderFilter.tsx \
  app/\(main\)/pendamping-tepercaya/__tests__/
git commit -m "feat: add Pendamping Tepercaya core UI (grid, cards, provider list, filter)"
```

---

### Task 6: CompanionSheet — Add/Edit Form with Permissions

**Type:** `HITL`
**Blocked by:** Task 5

**Files:**
- Create: `app/(main)/pendamping-tepercaya/_components/CompanionSheet.tsx`
- Test: `app/(main)/pendamping-tepercaya/__tests__/CompanionSheet.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// app/(main)/pendamping-tepercaya/__tests__/CompanionSheet.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompanionSheet } from "../_components/CompanionSheet";
import { CompanionProvider } from "@/lib/companion-context";
import type { TrustedContact } from "@/lib/companion-types";
import React from "react";

const mockContact: TrustedContact = {
  id: "c1",
  name: "Ayu Rahma",
  role: "friend",
  phone: "081234567890",
  permissions: ["journal"],
  notes: "Teman dekat",
  createdAt: "2026-06-01T00:00:00.000Z",
  updatedAt: "2026-06-01T00:00:00.000Z",
};

function wrapper({ children }: { children: React.ReactNode }) {
  return <CompanionProvider>{children}</CompanionProvider>;
}

describe("CompanionSheet", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders add mode with empty fields", () => {
    render(
      <CompanionSheet mode="add" contact={null} open={true} onClose={vi.fn()} />,
      { wrapper }
    );
    expect(screen.getByText("Tambah Pendamping")).toBeInTheDocument();
    expect(screen.getByLabelText("Nama")).toHaveValue("");
    expect(screen.getByLabelText("Nomor WA / Telepon")).toHaveValue("");
  });

  it("renders edit mode with pre-filled fields", () => {
    render(
      <CompanionSheet mode="edit" contact={mockContact} open={true} onClose={vi.fn()} />,
      { wrapper }
    );
    expect(screen.getByText("Edit Pendamping")).toBeInTheDocument();
    expect(screen.getByLabelText("Nama")).toHaveValue("Ayu Rahma");
    expect(screen.getByLabelText("Nomor WA / Telepon")).toHaveValue("081234567890");
    expect(screen.getByLabelText("Jurnal Aman")).toBeChecked();
    expect(screen.getByLabelText("Kronologi Kejadian")).not.toBeChecked();
  });

  it("shows validation error when name is empty", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <CompanionSheet mode="add" contact={null} open={true} onClose={onClose} />,
      { wrapper }
    );

    // Fill phone but leave name empty
    await user.type(screen.getByLabelText("Nomor WA / Telepon"), "081234567890");
    await user.click(screen.getByText("Simpan"));

    expect(screen.getByText("Nama pendamping wajib diisi.")).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("shows validation error when phone is too short", async () => {
    const user = userEvent.setup();
    render(
      <CompanionSheet mode="add" contact={null} open={true} onClose={vi.fn()} />,
      { wrapper }
    );

    await user.type(screen.getByLabelText("Nama"), "Ayu Rahma");
    await user.type(screen.getByLabelText("Nomor WA / Telepon"), "123");
    await user.click(screen.getByText("Simpan"));

    expect(screen.getByText(/minimal 8 digit/)).toBeInTheDocument();
  });

  it("shows custom role input when role is 'other'", async () => {
    const user = userEvent.setup();
    render(
      <CompanionSheet mode="add" contact={null} open={true} onClose={vi.fn()} />,
      { wrapper }
    );

    // Select "Lainnya" from the role dropdown
    const roleSelect = screen.getByLabelText("Hubungan / Peran");
    await user.selectOptions(roleSelect, "other");

    expect(screen.getByLabelText("Hubungan Lainnya")).toBeInTheDocument();
  });

  it("calls onClose when Batal is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <CompanionSheet mode="add" contact={null} open={true} onClose={onClose} />,
      { wrapper }
    );
    await user.click(screen.getByText("Batal"));
    expect(onClose).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/\(main\)/pendamping-tepercaya/__tests__/CompanionSheet.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Write the CompanionSheet component**

```tsx
// app/(main)/pendamping-tepercaya/_components/CompanionSheet.tsx
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  COMPANION_ROLE_LABELS,
  MODULE_ACCESS_LABELS,
  type TrustedContact,
  type CompanionRole,
  type ModuleAccess,
} from "@/lib/companion-types";
import { useCompanion } from "@/lib/companion-context";

const ROLES: CompanionRole[] = ["friend", "sibling", "parent", "partner", "relative", "other"];
const MODULES: ModuleAccess[] = ["journal", "timeline", "evidence"];

interface CompanionSheetProps {
  mode: "add" | "edit";
  contact: TrustedContact | null;
  open: boolean;
  onClose: () => void;
}

export function CompanionSheet({ mode, contact, open, onClose }: CompanionSheetProps) {
  const { addContact, updateContact, deleteContact } = useCompanion();

  const [name, setName] = useState("");
  const [role, setRole] = useState<CompanionRole>("friend");
  const [roleCustom, setRoleCustom] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [permissions, setPermissions] = useState<ModuleAccess[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate fields in edit mode
  useEffect(() => {
    if (mode === "edit" && contact) {
      setName(contact.name);
      setRole(contact.role);
      setRoleCustom(contact.roleCustom ?? "");
      setPhone(contact.phone);
      setNotes(contact.notes);
      setPermissions(contact.permissions);
    } else {
      // Reset for add mode
      setName("");
      setRole("friend");
      setRoleCustom("");
      setPhone("");
      setNotes("");
      setPermissions([]);
    }
    setErrors({});
  }, [mode, contact, open]);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = "Nama pendamping wajib diisi.";
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 8) {
      newErrors.phone = "Nomor tidak valid. Masukkan minimal 8 digit.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const input = {
      name: name.trim(),
      role,
      roleCustom: role === "other" ? roleCustom.trim() : undefined,
      phone: phone.trim(),
      notes: notes.trim(),
      permissions,
    };

    if (mode === "add") {
      addContact(input);
    } else if (contact) {
      updateContact(contact.id, input);
    }

    onClose();
  }

  function handleDelete() {
    if (contact) {
      deleteContact(contact.id);
      onClose();
    }
  }

  function togglePermission(module: ModuleAccess) {
    setPermissions((prev) =>
      prev.includes(module) ? prev.filter((m) => m !== module) : [...prev, module]
    );
  }

  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{mode === "add" ? "Tambah Pendamping" : "Edit Pendamping"}</SheetTitle>
          <SheetDescription>
            {mode === "add"
              ? "Tambahkan orang yang kamu percaya sebagai pendamping."
              : "Perbarui data pendamping dan izin akses."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          {/* Nama */}
          <div className="space-y-2">
            <Label htmlFor="comp-name">Nama</Label>
            <Input
              id="comp-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="Nama pendamping"
              aria-invalid={!!errors.name}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="comp-role">Hubungan / Peran</Label>
            <select
              id="comp-role"
              value={role}
              onChange={(e) => setRole(e.target.value as CompanionRole)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1
                text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1
                focus-visible:ring-ring"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {COMPANION_ROLE_LABELS[r]}
                </option>
              ))}
            </select>
            {role === "other" && (
              <div className="mt-2">
                <Label htmlFor="comp-role-custom">Hubungan Lainnya</Label>
                <Input
                  id="comp-role-custom"
                  value={roleCustom}
                  onChange={(e) => setRoleCustom(e.target.value)}
                  placeholder="Misal: Tetangga, Rekan kerja"
                />
              </div>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="comp-phone">Nomor WA / Telepon</Label>
            <Input
              id="comp-phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
              }}
              placeholder="081234567890"
              inputMode="tel"
              aria-invalid={!!errors.phone}
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="comp-notes">Catatan (opsional)</Label>
            <Input
              id="comp-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan tambahan"
            />
          </div>

          {/* Izin Akses */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Izin Akses Data</Label>
            <p className="text-xs text-muted-foreground -mt-1">
              Modul mana yang boleh diakses oleh pendamping ini.
            </p>
            {MODULES.map((mod) => (
              <div key={mod} className="flex items-center gap-3">
                <Checkbox
                  id={`perm-${mod}`}
                  checked={permissions.includes(mod)}
                  onCheckedChange={() => togglePermission(mod)}
                />
                <Label htmlFor={`perm-${mod}`} className="cursor-pointer font-normal">
                  {MODULE_ACCESS_LABELS[mod]}
                </Label>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </div>
            {mode === "edit" && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="w-full"
              >
                Hapus Pendamping
              </Button>
            )}
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run app/\(main\)/pendamping-tepercaya/__tests__/CompanionSheet.test.tsx`
Expected: PASS

- [ ] **Step 5: Uncomment the CompanionSheet import in PendampingClient.tsx**

Remove the temporary comments around `import { CompanionSheet } from "./CompanionSheet";` and the JSX block in `PendampingClient.tsx`.

- [ ] **Step 6: Commit**

```bash
git add app/\(main\)/pendamping-tepercaya/_components/CompanionSheet.tsx \
  app/\(main\)/pendamping-tepercaya/__tests__/CompanionSheet.test.tsx \
  app/\(main\)/pendamping-tepercaya/_components/PendampingClient.tsx
git commit -m "feat: add CompanionSheet (add/edit form with permission checkboxes)"
```

---

### Task 7: CompanionDeleteDialog — Delete Confirmation

**Type:** `HITL`
**Blocked by:** Task 5

**Files:**
- Create: `app/(main)/pendamping-tepercaya/_components/CompanionDeleteDialog.tsx`
- Test: `app/(main)/pendamping-tepercaya/__tests__/CompanionDeleteDialog.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// app/(main)/pendamping-tepercaya/__tests__/CompanionDeleteDialog.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompanionDeleteDialog } from "../_components/CompanionDeleteDialog";

describe("CompanionDeleteDialog", () => {
  it("renders contact name in the confirmation text", () => {
    render(
      <CompanionDeleteDialog
        contactName="Ayu Rahma"
        open={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByText(/Ayu Rahma/)).toBeInTheDocument();
    expect(screen.getByText(/dari daftar pendamping/)).toBeInTheDocument();
  });

  it("calls onConfirm when Hapus is clicked", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(
      <CompanionDeleteDialog
        contactName="Ayu Rahma"
        open={true}
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />
    );
    await user.click(screen.getByRole("button", { name: /Hapus, Lanjutkan/ }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("calls onCancel when Batal is clicked", async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(
      <CompanionDeleteDialog
        contactName="Ayu Rahma"
        open={true}
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />
    );
    await user.click(screen.getByRole("button", { name: /Batal/ }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("does not render when open is false", () => {
    render(
      <CompanionDeleteDialog
        contactName="Ayu Rahma"
        open={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.queryByText(/Ayu Rahma/)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/\(main\)/pendamping-tepercaya/__tests__/CompanionDeleteDialog.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Write CompanionDeleteDialog component**

```tsx
// app/(main)/pendamping-tepercaya/_components/CompanionDeleteDialog.tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CompanionDeleteDialogProps {
  contactName: string;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CompanionDeleteDialog({
  contactName,
  open,
  onConfirm,
  onCancel,
}: CompanionDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Pendamping</AlertDialogTitle>
          <AlertDialogDescription>
            Hapus <strong>{contactName}</strong> dari daftar pendamping? Kontak ini
            tidak akan lagi memiliki akses ke data Anda.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Hapus, Lanjutkan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run app/\(main\)/pendamping-tepercaya/__tests__/CompanionDeleteDialog.test.tsx`
Expected: PASS

- [ ] **Step 5: Integrate CompanionDeleteDialog into PendampingClient.tsx**

Update `PendampingClient.tsx` to manage delete dialog state:

```tsx
// Add state near the top of PendampingClient:
const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

// Update the onDelete handler in CompanionGrid:
onDelete={(id) => setDeleteTarget(id)}

// Add the dialog at the bottom of the component (before closing </div>):
{deleteTarget && (
  <CompanionDeleteDialog
    contactName={
      state.contacts.find((c) => c.id === deleteTarget)?.name ?? ""
    }
    open={true}
    onConfirm={() => {
      deleteContact(deleteTarget);
      setDeleteTarget(null);
    }}
    onCancel={() => setDeleteTarget(null)}
  />
)}
```

Also add the `useState` import to `PendampingClient.tsx`.

- [ ] **Step 6: Commit**

```bash
git add app/\(main\)/pendamping-tepercaya/_components/CompanionDeleteDialog.tsx \
  app/\(main\)/pendamping-tepercaya/__tests__/CompanionDeleteDialog.test.tsx \
  app/\(main\)/pendamping-tepercaya/_components/PendampingClient.tsx
git commit -m "feat: add CompanionDeleteDialog and integrate delete flow"
```

---

## Final Integration

After all tasks complete, verify the full flow:

1. Start dev server: `npm run dev`
2. Navigate to `/pendamping-tepercaya`
3. Verify Pendamping Personal section shows empty state with "Tambah Pendamping" button
4. Click "Tambah Pendamping" — sheet opens from right
5. Fill form, check permissions, save — card appears in grid
6. Click card — sheet opens in edit mode with pre-filled data
7. Change permissions, save — card updates
8. Click delete on card or "Hapus Pendamping" in sheet — dialog appears
9. Confirm delete — card removed from grid
10. Verify Penyedia Layanan section shows all 6 entries
11. Click filter chips — list filters correctly
12. Click "Hubungi" on a provider — WhatsApp/Phone opens
13. Run all tests: `npx vitest run`

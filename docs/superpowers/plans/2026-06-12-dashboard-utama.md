# Dashboard Utama Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development, superpowers:dispatching-parallel-agents, or superpowers:executing-plans. See the Task Grouping section for parallel vs sequential execution strategy.

**Goal:** Build the Dashboard Utama page with 5 sections (Hero Banner, Data Summary, Feature Cards, Accessibility Widgets, Emergency Card) plus AccessibilityContext for global toggle state.

**Architecture:** Composed components pattern — `DashboardPage` is a thin composer that passes props down to 5 independent components. `AccessibilityContext` (useReducer + Context) manages 4 boolean toggle states globally, following the same pattern as `WizardContext` in Kronologi.

**Execution Strategy:** Hybrid — Foundation tasks run as a sequential chain, then 5 component tasks run in parallel, then integration as a final sequential chain.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4, shadcn/ui, lucide-react, Vitest + @testing-library/react

---

## Task Grouping

### Sequential Chain 1: Foundation
- Task 1: Add `DashboardStats` and `FeatureCardData` types → blocks Task 3,4,5
- Task 2: `AccessibilityContext` + reducer test → blocks Task 6,8

### Parallel Batch 1: Components (blocked by: Sequential Chain 1)
- Task 3: `HeroBanner` component + test
- Task 4: `DataSummary` component + test
- Task 5: `FeatureCards` component + test
- Task 6: `AccessibilityWidgets` component + test (depends on Task 2 context)
- Task 7: `EmergencyCard` component + test

### Sequential Chain 2: Integration (blocked by: Parallel Batch 1)
- Task 8: `DashboardPage` composition + layout update + integration test

---

### Task 1: Add Dashboard Types to `lib/types.ts`

**Type:** `AFK`
**Blocked by:** None

**Files:**
- Modify: `lib/types.ts` (append after existing types)

**What we're adding:**
- `DashboardStats` — 4 number fields for DataSummary
- `FeatureCardData` — 6 fields for each feature card

**Test files:** None — types are compile-time, tested implicitly by components using them.

- [ ] **Step 1: Append type definitions to `lib/types.ts`**

Append this after the last export in `lib/types.ts` (after `JournalNote`):

```typescript
// === Dashboard ===

export interface DashboardStats {
  journalCount: number;
  kronologiCount: number;
  activeFeatures: number;
  totalFeatures: number;
}

export interface FeatureCardData {
  icon: string;              // Lucide icon name
  title: string;
  description: string;
  href: string;
  badgeColor: "orange" | "blue" | "violet" | "pink" | "teal" | "emerald";
  isPlaceholder: boolean;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors related to new types.

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add DashboardStats and FeatureCardData types"
```

---

### Task 2: Create `AccessibilityContext` with Reducer Test

**Type:** `AFK`
**Blocked by:** None (does not use Task 1 types)

**Files:**
- Create: `lib/accessibility-context.tsx`
- Create: `lib/__tests__/accessibility-context.test.ts`

**What we're building:** A React Context wrapping `useReducer` that manages 4 boolean flags: `screenReader`, `voiceNote`, `signLanguage`, `highContrast`. Each has a `TOGGLE_*` action. Exposes `useAccessibility()` hook.

- [ ] **Step 1: Write the failing test**

Create `lib/__tests__/accessibility-context.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AccessibilityProvider, useAccessibility } from "@/lib/accessibility-context";

function wrapper({ children }: { children: React.ReactNode }) {
  return <AccessibilityProvider>{children}</AccessibilityProvider>;
}

describe("accessibilityReducer", () => {
  it("defaults all states to false", () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    expect(result.current.state).toEqual({
      screenReader: false,
      voiceNote: false,
      signLanguage: false,
      highContrast: false,
    });
  });

  it("toggles screenReader on then off", () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    act(() => result.current.toggle("screenReader"));
    expect(result.current.state.screenReader).toBe(true);
    act(() => result.current.toggle("screenReader"));
    expect(result.current.state.screenReader).toBe(false);
  });

  it("toggles voiceNote", () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    act(() => result.current.toggle("voiceNote"));
    expect(result.current.state.voiceNote).toBe(true);
  });

  it("toggles signLanguage", () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    act(() => result.current.toggle("signLanguage"));
    expect(result.current.state.signLanguage).toBe(true);
  });

  it("toggles highContrast", () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    act(() => result.current.toggle("highContrast"));
    expect(result.current.state.highContrast).toBe(true);
  });

  it("combines multiple toggles independently", () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    act(() => result.current.toggle("screenReader"));
    act(() => result.current.toggle("highContrast"));
    expect(result.current.state).toEqual({
      screenReader: true,
      voiceNote: false,
      signLanguage: false,
      highContrast: true,
    });
  });

  it("throws if useAccessibility used outside provider", () => {
    expect(() => renderHook(() => useAccessibility())).toThrow(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/__tests__/accessibility-context.test.ts`
Expected: FAIL — module not found or hook not defined.

- [ ] **Step 3: Implement `AccessibilityContext`**

Create `lib/accessibility-context.tsx`:

```typescript
"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";

export interface AccessibilityState {
  screenReader: boolean;
  voiceNote: boolean;
  signLanguage: boolean;
  highContrast: boolean;
}

type AccessibilityAction =
  | { type: "TOGGLE_SCREEN_READER" }
  | { type: "TOGGLE_VOICE_NOTE" }
  | { type: "TOGGLE_SIGN_LANGUAGE" }
  | { type: "TOGGLE_HIGH_CONTRAST" };

const initialState: AccessibilityState = {
  screenReader: false,
  voiceNote: false,
  signLanguage: false,
  highContrast: false,
};

function accessibilityReducer(
  state: AccessibilityState,
  action: AccessibilityAction,
): AccessibilityState {
  switch (action.type) {
    case "TOGGLE_SCREEN_READER":
      return { ...state, screenReader: !state.screenReader };
    case "TOGGLE_VOICE_NOTE":
      return { ...state, voiceNote: !state.voiceNote };
    case "TOGGLE_SIGN_LANGUAGE":
      return { ...state, signLanguage: !state.signLanguage };
    case "TOGGLE_HIGH_CONTRAST":
      return { ...state, highContrast: !state.highContrast };
    default:
      return state;
  }
}

interface AccessibilityContextValue {
  state: AccessibilityState;
  toggle: (feature: keyof AccessibilityState) => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

function featureToAction(feature: keyof AccessibilityState): AccessibilityAction["type"] {
  switch (feature) {
    case "screenReader":
      return "TOGGLE_SCREEN_READER";
    case "voiceNote":
      return "TOGGLE_VOICE_NOTE";
    case "signLanguage":
      return "TOGGLE_SIGN_LANGUAGE";
    case "highContrast":
      return "TOGGLE_HIGH_CONTRAST";
  }
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(accessibilityReducer, initialState);

  function toggle(feature: keyof AccessibilityState) {
    dispatch({ type: featureToAction(feature) });
  }

  return (
    <AccessibilityContext.Provider value={{ state, toggle }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return ctx;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/__tests__/accessibility-context.test.ts`
Expected: All 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/accessibility-context.tsx lib/__tests__/accessibility-context.test.ts
git commit -m "feat: add AccessibilityContext with reducer and tests"
```

---

### Task 3: `HeroBanner` Component + Test

**Type:** `AFK`
**Blocked by:** Sequential Chain 1 (Task 1 types available)

**Files:**
- Create: `app/(main)/_components/dashboard/HeroBanner.tsx`
- Create: `app/__tests__/dashboard/HeroBanner.test.tsx`

**What we're building:** A welcome banner with "Kamu tidak sendirian" heading, supporting text, and 3 Lucide icons (Ear, Eye, Accessibility) on the right. Icons are decorative (aria-hidden). Responsive: row on desktop, column on mobile.

- [ ] **Step 1: Write the failing test**

Create `app/__tests__/dashboard/HeroBanner.test.tsx`:

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroBanner } from "@/app/(main)/_components/dashboard/HeroBanner";

describe("HeroBanner", () => {
  beforeEach(() => {
    render(<HeroBanner greeting="Kamu tidak sendirian" />);
  });

  it("renders the greeting as h1", () => {
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Kamu tidak sendirian",
    );
  });

  it("renders supporting description", () => {
    expect(
      screen.getByText(/AmanAkses hadir sebagai ruang aman/),
    ).toBeInTheDocument();
  });

  it("renders 3 decorative icons with aria-hidden", () => {
    const icons = document.querySelectorAll('[aria-hidden="true"]');
    expect(icons.length).toBeGreaterThanOrEqual(1);
  });

  it("has accessible structure with section element", () => {
    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/__tests__/dashboard/HeroBanner.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `HeroBanner`**

Create `app/(main)/_components/dashboard/HeroBanner.tsx`:

```typescript
import { Ear, Eye, Accessibility } from "lucide-react";

interface HeroBannerProps {
  greeting: string;
}

export function HeroBanner({ greeting }: HeroBannerProps) {
  return (
    <section
      className="flex flex-col gap-6 rounded-xl border border-border bg-background p-12 sm:flex-row sm:items-center sm:gap-10"
      aria-labelledby="hero-heading"
    >
      <div className="flex-1">
        <h1
          id="hero-heading"
          className="text-display-md font-bold leading-display-md tracking-display-md text-foreground"
        >
          {greeting}
        </h1>
        <p className="mt-3 max-w-[500px] text-body-md leading-body-md text-muted-foreground">
          AmanAkses hadir sebagai ruang aman untuk memahami, mendokumentasikan,
          dan melaporkan pengalaman — dengan kendali penuh di tangan Anda.
        </p>
      </div>
      <div className="flex gap-4" aria-hidden="true">
        <Eye className="h-12 w-12 text-primary/60" />
        <Ear className="h-12 w-12 text-primary/80" />
        <Accessibility className="h-12 w-12 text-primary" />
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run app/__tests__/dashboard/HeroBanner.test.tsx`
Expected: All 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add app/(main)/_components/dashboard/HeroBanner.tsx app/__tests__/dashboard/HeroBanner.test.tsx
git commit -m "feat: add HeroBanner component with tests"
```

---

### Task 4: `DataSummary` Component + Test

**Type:** `AFK`
**Blocked by:** Sequential Chain 1 (Task 1 types)

**Files:**
- Create: `app/(main)/_components/dashboard/DataSummary.tsx`
- Create: `app/__tests__/dashboard/DataSummary.test.tsx`

**What we're building:** 3 stat cards (Jurnal count, Kronologi count, Active Features) in a responsive 3→2→1 grid. Each card shows a large number with distinct color and a label below.

- [ ] **Step 1: Write the failing test**

Create `app/__tests__/dashboard/DataSummary.test.tsx`:

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DataSummary } from "@/app/(main)/_components/dashboard/DataSummary";

describe("DataSummary", () => {
  const stats = {
    journalCount: 5,
    kronologiCount: 1,
    activeFeatures: 2,
    totalFeatures: 6,
  };

  it("renders journal count with aria-label", () => {
    render(<DataSummary stats={stats} />);
    const el = screen.getByLabelText("5 catatan jurnal");
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent("5");
  });

  it("renders kronologi count with aria-label", () => {
    render(<DataSummary stats={stats} />);
    const el = screen.getByLabelText("1 kronologi tersimpan");
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent("1");
  });

  it("renders active features count with aria-label", () => {
    render(<DataSummary stats={stats} />);
    const el = screen.getByLabelText("2 dari 6 fitur aktif");
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent("2/6");
  });

  it("renders 3 stat labels", () => {
    render(<DataSummary stats={stats} />);
    expect(screen.getByText("Catatan Jurnal")).toBeInTheDocument();
    expect(screen.getByText("Kronologi Tersimpan")).toBeInTheDocument();
    expect(screen.getByText("Fitur Aktif")).toBeInTheDocument();
  });

  it("handles zero counts", () => {
    render(
      <DataSummary
        stats={{ journalCount: 0, kronologiCount: 0, activeFeatures: 0, totalFeatures: 6 }}
      />,
    );
    expect(screen.getByLabelText("0 catatan jurnal")).toBeInTheDocument();
    expect(screen.getByLabelText("0 kronologi tersimpan")).toBeInTheDocument();
    expect(screen.getByLabelText("0 dari 6 fitur aktif")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/__tests__/dashboard/DataSummary.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `DataSummary`**

Create `app/(main)/_components/dashboard/DataSummary.tsx`:

```typescript
import type { DashboardStats } from "@/lib/types";

interface DataSummaryProps {
  stats: DashboardStats;
}

const items = [
  {
    key: "journal",
    color: "text-primary",
    label: "Catatan Jurnal",
    value: (s: DashboardStats) => s.journalCount,
    ariaLabel: (s: DashboardStats) => `${s.journalCount} catatan jurnal`,
  },
  {
    key: "kronologi",
    color: "text-badge-violet",
    label: "Kronologi Tersimpan",
    value: (s: DashboardStats) => s.kronologiCount,
    ariaLabel: (s: DashboardStats) => `${s.kronologiCount} kronologi tersimpan`,
  },
  {
    key: "features",
    color: "text-success",
    label: "Fitur Aktif",
    value: (s: DashboardStats) => `${s.activeFeatures}/${s.totalFeatures}`,
    ariaLabel: (s: DashboardStats) =>
      `${s.activeFeatures} dari ${s.totalFeatures} fitur aktif`,
  },
] as const;

export function DataSummary({ stats }: DataSummaryProps) {
  return (
    <section
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Ringkasan Data"
    >
      {items.map((item) => (
        <div
          key={item.key}
          className="rounded-xl border border-border bg-accent p-6 text-center"
        >
          <span
            className={`text-4xl font-bold ${item.color}`}
            aria-label={item.ariaLabel(stats)}
          >
            {item.value(stats)}
          </span>
          <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run app/__tests__/dashboard/DataSummary.test.tsx`
Expected: All 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add app/(main)/_components/dashboard/DataSummary.tsx app/__tests__/dashboard/DataSummary.test.tsx
git commit -m "feat: add DataSummary component with tests"
```

---

### Task 5: `FeatureCards` Component + Test

**Type:** `AFK`
**Blocked by:** Sequential Chain 1 (Task 1 types)

**Files:**
- Create: `app/(main)/_components/dashboard/FeatureCards.tsx`
- Create: `app/__tests__/dashboard/FeatureCards.test.tsx`

**What we're building:** A responsive 3→2→1 grid of 6 navigation cards. Each card has a colored icon box (48x48, 15% opacity badge background), title, description, and "Pelajari lebih lanjut" link. All cards use Next.js `Link`.

- [ ] **Step 1: Write the failing test**

Create `app/__tests__/dashboard/FeatureCards.test.tsx`:

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeatureCards } from "@/app/(main)/_components/dashboard/FeatureCards";
import type { FeatureCardData } from "@/lib/types";

const mockFeatures: FeatureCardData[] = [
  {
    icon: "BookOpen",
    title: "Pahami Kekerasan",
    description: "Informasi dasar tentang kekerasan.",
    href: "/pahami-kekerasan",
    badgeColor: "orange",
    isPlaceholder: true,
  },
  {
    icon: "PenLine",
    title: "Jurnal Aman",
    description: "Ruang pribadi mencatat pengalaman.",
    href: "/jurnal",
    badgeColor: "blue",
    isPlaceholder: false,
  },
];

describe("FeatureCards", () => {
  it("renders section heading", () => {
    render(<FeatureCards features={mockFeatures} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Akses Cepat Fitur",
    );
  });

  it("renders all feature cards", () => {
    render(<FeatureCards features={mockFeatures} />);
    expect(screen.getByText("Pahami Kekerasan")).toBeInTheDocument();
    expect(screen.getByText("Jurnal Aman")).toBeInTheDocument();
  });

  it("renders Pelajari lebih lanjut links", () => {
    render(<FeatureCards features={mockFeatures} />);
    const links = screen.getAllByText(/Pelajari lebih lanjut/);
    expect(links.length).toBe(2);
  });

  it("links have correct hrefs", () => {
    render(<FeatureCards features={mockFeatures} />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/pahami-kekerasan");
    expect(links[1]).toHaveAttribute("href", "/jurnal");
  });

  it("renders icon containers with badge color backgrounds", () => {
    render(<FeatureCards features={mockFeatures} />);
    const iconBoxes = document.querySelectorAll(".h-12.w-12");
    expect(iconBoxes.length).toBe(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/__tests__/dashboard/FeatureCards.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `FeatureCards`**

Create `app/(main)/_components/dashboard/FeatureCards.tsx`:

```typescript
import Link from "next/link";
import {
  BookOpen,
  PenLine,
  GitBranch,
  FolderLock,
  Users,
  FileText,
  type LucideIcon,
} from "lucide-react";
import type { FeatureCardData } from "@/lib/types";

interface FeatureCardsProps {
  features: FeatureCardData[];
}

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  PenLine,
  GitBranch,
  FolderLock,
  Users,
  FileText,
};

const badgeBackgrounds: Record<string, string> = {
  orange: "bg-badge-orange/15 text-badge-orange",
  blue: "bg-badge-blue/15 text-badge-blue",
  violet: "bg-badge-violet/15 text-badge-violet",
  pink: "bg-badge-pink/15 text-badge-pink",
  teal: "bg-badge-teal/15 text-badge-teal",
  emerald: "bg-badge-emerald/15 text-badge-emerald",
};

export function FeatureCards({ features }: FeatureCardsProps) {
  return (
    <section aria-labelledby="feature-cards-heading">
      <h2 id="feature-cards-heading" className="mb-4 text-title-md font-semibold text-foreground">
        Akses Cepat Fitur
      </h2>
      <nav className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => {
          const Icon = iconMap[f.icon] ?? FileText;
          return (
            <Link
              key={f.href}
              href={f.href}
              className="group rounded-xl border border-border bg-background p-6 transition-colors hover:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${badgeBackgrounds[f.badgeColor]}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-title-md font-semibold leading-title-md text-foreground">
                {f.title}
              </h3>
              <p className="mt-1 text-body-sm leading-body-sm text-muted-foreground">
                {f.description}
              </p>
              <span className="mt-3 inline-block text-sm font-medium text-primary">
                Pelajari lebih lanjut &rarr;
              </span>
            </Link>
          );
        })}
      </nav>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run app/__tests__/dashboard/FeatureCards.test.tsx`
Expected: All 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add app/(main)/_components/dashboard/FeatureCards.tsx app/__tests__/dashboard/FeatureCards.test.tsx
git commit -m "feat: add FeatureCards component with tests"
```

---

### Task 6: `AccessibilityWidgets` Component + Test

**Type:** `AFK`
**Blocked by:** Sequential Chain 1 (Task 2 — AccessibilityContext)

**Files:**
- Create: `app/(main)/_components/dashboard/AccessibilityWidgets.tsx`
- Create: `app/__tests__/dashboard/AccessibilityWidgets.test.tsx`

**What we're building:** 4 toggle buttons (Screen Reader, Catatan Suara, Bahasa Isyarat, Kontras Tinggi) in a responsive 4→2 grid. Each toggle shows on/off state, uses `role="switch"` and `aria-checked`, and dispatches to AccessibilityContext.

- [ ] **Step 1: Write the failing test**

Create `app/__tests__/dashboard/AccessibilityWidgets.test.tsx`:

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccessibilityProvider } from "@/lib/accessibility-context";
import { AccessibilityWidgets } from "@/app/(main)/_components/dashboard/AccessibilityWidgets";

function renderWithProvider() {
  return render(
    <AccessibilityProvider>
      <AccessibilityWidgets />
    </AccessibilityProvider>,
  );
}

describe("AccessibilityWidgets", () => {
  it("renders section heading", () => {
    renderWithProvider();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Aksesibilitas");
  });

  it("renders 4 toggle switches", () => {
    renderWithProvider();
    const switches = screen.getAllByRole("switch");
    expect(switches.length).toBe(4);
  });

  it("all toggles start with aria-checked false", () => {
    renderWithProvider();
    const switches = screen.getAllByRole("switch");
    switches.forEach((s) => expect(s).toHaveAttribute("aria-checked", "false"));
  });

  it("shows 'Nonaktif' label when off", () => {
    renderWithProvider();
    const labels = screen.getAllByText("Nonaktif");
    expect(labels.length).toBe(4);
  });

  it("clicking Kontras Tinggi toggles state and label to 'Aktif'", async () => {
    const user = userEvent.setup();
    renderWithProvider();
    const toggle = screen.getByRole("switch", { name: "Toggle Kontras Tinggi" });
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText("Aktif")).toBeInTheDocument();
  });

  it("renders Screen Reader, Catatan Suara, Bahasa Isyarat, Kontras Tinggi labels", () => {
    renderWithProvider();
    expect(screen.getByText("Screen Reader")).toBeInTheDocument();
    expect(screen.getByText("Catatan Suara")).toBeInTheDocument();
    expect(screen.getByText("Bahasa Isyarat")).toBeInTheDocument();
    expect(screen.getByText("Kontras Tinggi")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/__tests__/dashboard/AccessibilityWidgets.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `AccessibilityWidgets`**

Create `app/(main)/_components/dashboard/AccessibilityWidgets.tsx`:

```typescript
import { Ear, Mic, Hand, Contrast } from "lucide-react";
import { useAccessibility, type AccessibilityState } from "@/lib/accessibility-context";

const toggles: {
  key: keyof AccessibilityState;
  label: string;
  icon: typeof Ear;
}[] = [
  { key: "screenReader", label: "Screen Reader", icon: Ear },
  { key: "voiceNote", label: "Catatan Suara", icon: Mic },
  { key: "signLanguage", label: "Bahasa Isyarat", icon: Hand },
  { key: "highContrast", label: "Kontras Tinggi", icon: Contrast },
];

export function AccessibilityWidgets() {
  const { state, toggle } = useAccessibility();

  return (
    <section aria-labelledby="a11y-heading">
      <h2 id="a11y-heading" className="mb-4 text-title-md font-semibold text-foreground">
        Aksesibilitas
      </h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {toggles.map(({ key, label, icon: Icon }) => {
          const isActive = state[key];
          return (
            <button
              key={key}
              role="switch"
              aria-checked={isActive}
              aria-label={`Toggle ${label}`}
              onClick={() => toggle(key)}
              className={`flex flex-col items-center gap-2 rounded-xl border p-5 text-center transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                isActive
                  ? "border-primary bg-accent"
                  : "border-border bg-accent"
              }`}
            >
              <Icon
                className={`h-6 w-6 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span className="text-sm font-semibold text-foreground">{label}</span>
              <span className="text-xs text-muted-foreground">
                {isActive ? "Aktif" : "Nonaktif"}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run app/__tests__/dashboard/AccessibilityWidgets.test.tsx`
Expected: All 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add app/(main)/_components/dashboard/AccessibilityWidgets.tsx app/__tests__/dashboard/AccessibilityWidgets.test.tsx
git commit -m "feat: add AccessibilityWidgets component with tests"
```

---

### Task 7: `EmergencyCard` Component + Test

**Type:** `AFK`
**Blocked by:** Sequential Chain 1 (no type dependencies — pure static component)

**Files:**
- Create: `app/(main)/_components/dashboard/EmergencyCard.tsx`
- Create: `app/__tests__/dashboard/EmergencyCard.test.tsx`

**What we're building:** A red-bordered card with emergency call button (`tel:112`), "Butuh bantuan segera?" heading, supporting text, and a link to other emergency services.

- [ ] **Step 1: Write the failing test**

Create `app/__tests__/dashboard/EmergencyCard.test.tsx`:

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmergencyCard } from "@/app/(main)/_components/dashboard/EmergencyCard";

describe("EmergencyCard", () => {
  beforeEach(() => {
    render(<EmergencyCard />);
  });

  it("renders emergency heading", () => {
    expect(
      screen.getByRole("heading", { name: "Butuh bantuan segera?" }),
    ).toBeInTheDocument();
  });

  it("renders supporting message", () => {
    expect(
      screen.getByText(/Anda tidak sendirian/),
    ).toBeInTheDocument();
  });

  it("renders tel:112 button", () => {
    const btn = screen.getByRole("link", { name: "Telepon Darurat 112" });
    expect(btn).toHaveAttribute("href", "tel:112");
  });

  it("renders link to other emergency services", () => {
    const link = screen.getByRole("link", {
      name: "Lihat layanan darurat lainnya",
    });
    expect(link).toBeInTheDocument();
  });

  it("has emergency red border", () => {
    const card = document.querySelector("section");
    expect(card?.className).toContain("border-emergency");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/__tests__/dashboard/EmergencyCard.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `EmergencyCard`**

Create `app/(main)/_components/dashboard/EmergencyCard.tsx`:

```typescript
export function EmergencyCard() {
  return (
    <section
      className="flex flex-col items-start gap-4 rounded-xl border-2 border-emergency bg-red-50 p-8 sm:flex-row sm:items-center sm:justify-between"
      aria-labelledby="emergency-heading"
    >
      <div>
        <h2 id="emergency-heading" className="text-title-md font-semibold text-foreground">
          Butuh bantuan segera?
        </h2>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Anda tidak sendirian. Bantuan selalu tersedia.
        </p>
      </div>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <a
          href="#"
          className="text-sm font-medium text-emergency hover:underline"
        >
          Lihat layanan darurat lainnya &rarr;
        </a>
        <a
          href="tel:112"
          className="inline-flex items-center rounded-lg bg-emergency px-7 py-3 text-sm font-semibold text-white hover:bg-emergency-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          Telepon Darurat 112
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run app/__tests__/dashboard/EmergencyCard.test.tsx`
Expected: All 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add app/(main)/_components/dashboard/EmergencyCard.tsx app/__tests__/dashboard/EmergencyCard.test.tsx
git commit -m "feat: add EmergencyCard component with tests"
```

---

### Task 8: `DashboardPage` Composition + Layout + Integration Test

**Type:** `AFK`
**Blocked by:** Parallel Batch 1 (Tasks 3-7 complete)

**Files:**
- Modify: `app/(main)/page.tsx` (replace placeholder)
- Modify: `app/(main)/layout.tsx` (add AccessibilityProvider)
- Create: `app/__tests__/dashboard/DashboardPage.test.tsx`

**What we're building:** Wire all 5 components together in DashboardPage, inject AccessibilityProvider in layout, and write an integration test that verifies all sections render.

- [ ] **Step 1: Write the integration test**

Create `app/__tests__/dashboard/DashboardPage.test.tsx`:

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AccessibilityProvider } from "@/lib/accessibility-context";
import DashboardPage from "@/app/(main)/page";

function renderDashboard() {
  return render(
    <AccessibilityProvider>
      <DashboardPage />
    </AccessibilityProvider>,
  );
}

describe("DashboardPage", () => {
  it("renders all 5 sections in order", () => {
    renderDashboard();

    // Hero Banner
    expect(
      screen.getByRole("heading", { level: 1, name: "Kamu tidak sendirian" }),
    ).toBeInTheDocument();

    // Data Summary
    expect(screen.getByText("Catatan Jurnal")).toBeInTheDocument();
    expect(screen.getByText("Kronologi Tersimpan")).toBeInTheDocument();
    expect(screen.getByText("Fitur Aktif")).toBeInTheDocument();

    // Feature Cards heading
    expect(
      screen.getByRole("heading", { level: 2, name: "Akses Cepat Fitur" }),
    ).toBeInTheDocument();

    // Accessibility Widgets heading
    expect(
      screen.getByRole("heading", { level: 2, name: "Aksesibilitas" }),
    ).toBeInTheDocument();

    // Emergency Card
    expect(
      screen.getByRole("heading", { level: 2, name: "Butuh bantuan segera?" }),
    ).toBeInTheDocument();
  });

  it("renders 6 feature cards", () => {
    renderDashboard();
    const links = screen.getAllByText(/Pelajari lebih lanjut/);
    expect(links.length).toBe(6);
  });

  it("renders 4 accessibility toggles", () => {
    renderDashboard();
    const switches = screen.getAllByRole("switch");
    expect(switches.length).toBe(4);
  });

  it("renders emergency call button with tel:112", () => {
    renderDashboard();
    const btn = screen.getByRole("link", { name: "Telepon Darurat 112" });
    expect(btn).toHaveAttribute("href", "tel:112");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/__tests__/dashboard/DashboardPage.test.tsx`
Expected: FAIL — DashboardPage still renders placeholder content, not the new sections.

- [ ] **Step 3: Replace `DashboardPage`**

Replace `app/(main)/page.tsx`:

```typescript
import type { DashboardStats, FeatureCardData } from "@/lib/types";
import { mockJournalNotes } from "@/lib/mock-data";
import { HeroBanner } from "./_components/dashboard/HeroBanner";
import { DataSummary } from "./_components/dashboard/DataSummary";
import { FeatureCards } from "./_components/dashboard/FeatureCards";
import { AccessibilityWidgets } from "./_components/dashboard/AccessibilityWidgets";
import { EmergencyCard } from "./_components/dashboard/EmergencyCard";

const features: FeatureCardData[] = [
  {
    icon: "BookOpen",
    title: "Pahami Kekerasan",
    description: "Informasi dasar tentang berbagai bentuk kekerasan dan hak Anda sebagai penyandang disabilitas.",
    href: "/pahami-kekerasan",
    badgeColor: "orange",
    isPlaceholder: true,
  },
  {
    icon: "PenLine",
    title: "Jurnal Aman",
    description: "Ruang pribadi untuk mencatat pengalaman Anda dengan aman, rahasia, dan tanpa tekanan.",
    href: "/jurnal",
    badgeColor: "blue",
    isPlaceholder: false,
  },
  {
    icon: "GitBranch",
    title: "Kronologi Kejadian",
    description: "Susun kronologi kejadian dengan bantuan AI — Anda tetap yang mengendalikan hasil akhir.",
    href: "/kronologi",
    badgeColor: "violet",
    isPlaceholder: false,
  },
  {
    icon: "FolderLock",
    title: "Brankas Bukti",
    description: "Simpan foto, tangkapan layar, dokumen, dan bukti pendukung lainnya dengan aman.",
    href: "/brankas-bukti",
    badgeColor: "pink",
    isPlaceholder: true,
  },
  {
    icon: "Users",
    title: "Pendamping Tepercaya",
    description: "Kelola kontak pendamping dan layanan dukungan yang siap membantu Anda.",
    href: "/pendamping-tepercaya",
    badgeColor: "teal",
    isPlaceholder: true,
  },
  {
    icon: "FileText",
    title: "Laporan Awal",
    description: "Gabungkan data dari jurnal dan kronologi untuk menyusun draf laporan awal.",
    href: "/laporan-awal",
    badgeColor: "emerald",
    isPlaceholder: true,
  },
];

export default function DashboardPage() {
  const stats: DashboardStats = {
    journalCount: mockJournalNotes.length,
    kronologiCount: 1,
    activeFeatures: 2,
    totalFeatures: 6,
  };

  return (
    <div className="space-y-8">
      <HeroBanner greeting="Kamu tidak sendirian" />
      <DataSummary stats={stats} />
      <FeatureCards features={features} />
      <AccessibilityWidgets />
      <EmergencyCard />
    </div>
  );
}
```

- [ ] **Step 4: Modify layout to add `AccessibilityProvider`**

Edit `app/(main)/layout.tsx` — wrap children with `AccessibilityProvider`:

Change the file from:

```typescript
"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "260px",
          "--sidebar-width-icon": "3rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <main className="flex flex-1 flex-col">
        <AppTopbar />
        <div className="flex-1 p-8 max-w-[1200px] w-full mx-auto">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
```

To:

```typescript
"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";
import { AccessibilityProvider } from "@/lib/accessibility-context";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AccessibilityProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "260px",
            "--sidebar-width-icon": "3rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <main className="flex flex-1 flex-col">
          <AppTopbar />
          <div className="flex-1 p-8 max-w-[1200px] w-full mx-auto">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </AccessibilityProvider>
  );
}
```

- [ ] **Step 5: Run integration test to verify it passes**

Run: `npx vitest run app/__tests__/dashboard/DashboardPage.test.tsx`
Expected: All 4 tests PASS.

- [ ] **Step 6: Run ALL dashboard tests to confirm no regressions**

Run: `npx vitest run app/__tests__/dashboard/`
Expected: All tests from Tasks 3-8 pass.

- [ ] **Step 7: Run full test suite to confirm no regressions**

Run: `npx vitest run`
Expected: All previous Kronologi tests still pass, plus all new dashboard tests.

- [ ] **Step 8: Commit**

```bash
git add app/(main)/page.tsx app/(main)/layout.tsx app/__tests__/dashboard/DashboardPage.test.tsx
git commit -m "feat: integrate DashboardPage with all 5 sections and AccessibilityProvider"
```

---

## Self-Review

### 1. Spec Coverage
- [x] Hero Banner (Section 5.2) → Task 3
- [x] Data Summary (Section 5.3) → Task 4
- [x] Feature Cards (Section 5.4) → Task 5
- [x] Accessibility Widgets (Section 5.5) → Task 6
- [x] Emergency Card (Section 5.6) → Task 7
- [x] AccessibilityContext (Section 6) → Task 2
- [x] Types (Section 7) → Task 1
- [x] DashboardPage composition (Section 5.1) → Task 8
- [x] Layout integration → Task 8
- [x] Tests for all components → Tasks 3-8
- [x] WCAG 2.2 (Section 11) → Each component task includes ARIA and semantic HTML

### 2. Placeholder Scan
No TBD, TODO, or placeholder patterns found. All code is complete.

### 3. Type Consistency
- `DashboardStats` defined in Task 1, consumed in Task 4 and Task 8 — consistent.
- `FeatureCardData` defined in Task 1, consumed in Task 5 and Task 8 — consistent.
- `AccessibilityState` defined in Task 2, consumed in Task 6 — consistent.
- `useAccessibility()` hook returns `{ state, toggle }` in Task 2, used in Task 6 — consistent.
- Imports match across tasks (e.g., `@/lib/types`, `@/lib/accessibility-context`).

### 4. Vertical Slice Check
Each component task (3-7) creates a component AND its test — both layers. Task 8 modifies page, layout, AND writes integration test — all layers. All tasks are vertical slices.

### 5. HITL/AFK Check
All tasks are AFK — they follow TDD pattern with clear code, can be executed autonomously. No design decisions or human judgment needed during execution.

### 6. Task Grouping Check
- Sequential Chain 1 (Tasks 1-2): Types and Context have no mutual dependency — they could actually run in parallel, but they're simple enough to run sequentially. Blocked-by relationships: Task 3-7 all blocked by Chain 1 — correct.
- Parallel Batch 1 (Tasks 3-7): No dependencies between these tasks. All blocked by Chain 1 — correct.
- Sequential Chain 2 (Task 8): Blocked by all of Parallel Batch 1 — correct.

### 7. Demoability Check
After Sequential Chain 1 + any one component task, that component can be tested and verified. After all of Parallel Batch 1, the full DashboardPage (Task 8) integrates all sections and the integration test passes. The Dashboard is fully demonstrable at that point.

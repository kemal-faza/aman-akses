# Desain Frontend: Dashboard Utama AmanAkses

**Tanggal:** 12 Juni 2026
**Role:** Frontend Engineer (Anggota 2)
**Status:** Approved — diselaraskan dengan DESIGN.md dan mockup/detail-pages.md

---

## 1. Ringkasan

Membangun halaman Dashboard Utama — pusat kendali platform AmanAkses yang dirancang inklusif dan mudah dinavigasi. Dashboard adalah landing page titik awal demo dan terdiri dari 5 seksi vertikal:

1. **Hero Banner** — sambutan "Kamu tidak sendirian" dengan 3 ikon Lucide representasi inklusivitas
2. **Data Summary** — 3 kartu statistik (jumlah catatan jurnal, kronologi tersimpan, fitur aktif)
3. **Feature Cards** — 6 kartu navigasi ke fitur utama dalam grid responsif
4. **Accessibility Widgets** — 4 tombol toggle aksesibilitas (sekali klik)
5. **Emergency Card** — kartu darurat dengan tombol tel:112

Dashboard dikembangkan secara statis (mock data) dengan semua komponen menerima props, siap di-switch ke data fetching saat backend siap.

---

## 2. Tech Stack

| Lapisan | Teknologi |
|---------|-----------|
| Framework | Next.js 15 (App Router) |
| Bahasa | TypeScript |
| Styling | Tailwind CSS v4 |
| Komponen | shadcn/ui |
| Typography | Inter (sesuai DESIGN.md typography tokens) |
| State | React Context + useReducer (AccessibilityContext) |
| Ikon | lucide-react |
| Testing | Vitest + @testing-library/react |
| Aksesibilitas | WCAG 2.2, semantic HTML, ARIA |

---

## 3. Design Tokens Mapping

Setiap elemen UI mengacu pada token di `DESIGN.md`:

| Elemen UI | DESIGN.md Token | Tailwind Class |
|-----------|----------------|----------------|
| Background halaman | `{colors.canvas}` | `bg-background` |
| Hero banner background | `{colors.canvas}` | `bg-background` |
| Hero banner border | `{colors.hairline}` #e5e7eb | `border border-border` |
| Judul hero | `{typography.display-md}` 28px/700 | `text-display-md font-bold` |
| Teks hero body | `{typography.body-md}` 16px | `text-body-md text-muted-foreground` |
| Ikon hero | `{colors.primary}` #2a9d8f | `text-primary` |
| Data summary card | `{colors.surface-soft}` #f9fafb | `bg-surface-soft` |
| Data summary border | `{colors.hairline}` #e5e7eb | `border border-border` |
| Angka statistik | `{colors.primary}` / `{colors.badge-violet}` / `{colors.success}` | `text-primary` / `text-badge-violet` / `text-success` |
| Feature card | `{component.feature-card}` | `bg-background border border-border rounded-xl p-6` |
| Ikon feature card (48x48) | `{colors.badge-*}` | `bg-badge-orange/15` (varian per-ikon) |
| Judul feature card | `{typography.title-md}` 18px/600 | `text-title-md font-semibold` |
| Deskripsi feature card | `{typography.body-sm}` 14px | `text-body-sm text-muted-foreground` |
| Link "Pelajari lebih lanjut" | `{colors.primary}` | `text-primary font-medium` |
| Accessibility widget | `{colors.surface-soft}` #f9fafb | `bg-surface-soft border border-border rounded-xl` |
| Accessibility toggle label | `{typography.body-sm}` | `text-sm` |
| Emergency card border | `{colors.emergency}` #dc2626 | `border-2 border-emergency` |
| Emergency card background | — | `bg-red-50` (#fef2f2) |
| Tombol emergency | `{colors.emergency}` #dc2626 | `bg-emergency text-white` |
| Link emergency | `{colors.emergency}` | `text-emergency font-medium` |

**Prinsip dari DESIGN.md yang wajib diikuti:**
- **Flat design**: tidak ada drop shadow
- **Border only** untuk elevation
- **Inter** untuk semua teks
- Generous whitespace, kalem, trauma-informed
- Semantic color badges untuk ikon feature cards

---

## 4. Arsitektur File

```
/app/(main)/
  page.tsx                             → DashboardPage — komposer, sumber data
  layout.tsx                           → App shell (sudah ada, tambah AccessibilityProvider)
  _components/
    dashboard/
      HeroBanner.tsx                   → Sambutan + 3 ikon Lucide
      DataSummary.tsx                  → 3 kartu statistik
      FeatureCards.tsx                 → Grid 6 kartu navigasi
      AccessibilityWidgets.tsx         → 4 toggle aksesibilitas (consume context)
      EmergencyCard.tsx                → Kartu darurat + tombol tel:112

/lib/
  accessibility-context.tsx            → Context + useReducer (pola sama WizardContext)
  types.ts                             → Tambahan: DashboardStats, FeatureCardData
  mock-data.ts                         → Sudah ada (mockJournalNotes digunakan)

/app/__tests__/
  dashboard/
    HeroBanner.test.tsx
    DataSummary.test.tsx
    FeatureCards.test.tsx
    AccessibilityWidgets.test.tsx
    EmergencyCard.test.tsx
    DashboardPage.test.tsx             → Integration test

/lib/__tests__/
  accessibility-context.test.ts        → Reducer + context test
```

---

## 5. Komponen Detail

### 5.1 DashboardPage (`page.tsx`)

Komposer — tidak punya UI sendiri, hanya menyusun 5 komponen dengan props.

```ts
// Pseudocode
export default function DashboardPage() {
  const stats: DashboardStats = {
    journalCount: mockJournalNotes.length,
    kronologiCount: 1,       // hardcoded, belum ada API
    activeFeatures: 2,       // Jurnal + Kronologi
    totalFeatures: 6,
  };

  const features: FeatureCardData[] = [
    { icon: "BookOpen", title: "Pahami Kekerasan", description: "...", href: "/pahami-kekerasan", badgeColor: "orange", isPlaceholder: true },
    { icon: "PenLine", title: "Jurnal Aman", description: "...", href: "/jurnal", badgeColor: "blue", isPlaceholder: false },
    { icon: "GitBranch", title: "Kronologi Kejadian", description: "...", href: "/kronologi", badgeColor: "violet", isPlaceholder: false },
    { icon: "FolderLock", title: "Brankas Bukti", description: "...", href: "/brankas-bukti", badgeColor: "pink", isPlaceholder: true },
    { icon: "Users", title: "Pendamping Tepercaya", description: "...", href: "/pendamping-tepercaya", badgeColor: "teal", isPlaceholder: true },
    { icon: "FileText", title: "Laporan Awal", description: "...", href: "/laporan-awal", badgeColor: "emerald", isPlaceholder: true },
  ];

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

### 5.2 HeroBanner

**Props:** `greeting: string`

**Render:**
- Layout horizontal: teks di kiri (flex-1), 3 ikon di kanan
- Judul `<h1>`: `{greeting}` dengan `text-display-md font-bold`
- Deskripsi: "AmanAkses hadir sebagai ruang aman..."
- 3 ikon Lucide: `Ear`, `Eye`, `Accessibility` — ukuran 48px, `text-primary/60`, `text-primary/80`, `text-primary`
- Background: `bg-background`, border: `border border-border`, rounded-xl, padding 48px

**Aksesibilitas:** Ikon dekoratif diberi `aria-hidden="true"` karena tidak membawa informasi.

### 5.3 DataSummary

**Props:** `stats: DashboardStats`

**Render:**
- Grid 3 kolom (responsive: 3→2→1)
- Kartu: `bg-surface-soft`, `border border-border`, rounded-xl, padding 24px, teks center
- Angka besar: `text-4xl font-bold` dengan warna berbeda per kartu
  - Jurnal: `text-primary`
  - Kronologi: `text-badge-violet` (#8b5cf6)
  - Fitur: `text-success` (#10b981)
- Label: `text-sm text-muted-foreground`

**Empty state:** Jika `journalCount === 0`, tetap render "0" — bukan error state.

**Aksesibilitas:** Setiap angka dibungkus `<span aria-label="5 catatan jurnal">`.

### 5.4 FeatureCards

**Props:** `features: FeatureCardData[]`

**Render:**
- Heading "Akses Cepat Fitur" di atas grid
- Grid 3 kolom (responsive: 3→2→1)
- Setiap kartu:
  - Ikon 48x48px dalam rounded box (background pakai badge color 15% opacity)
  - Judul: `text-title-md font-semibold`
  - Deskripsi: `text-body-sm text-muted-foreground` (2-3 baris)
  - Link "Pelajari lebih lanjut →": `text-primary font-medium`
- Semua kartu dibungkus `<Link>` Next.js — termasuk yang placeholder
- Tidak ada indikator "Segera Hadir" di kartu (itu ada di halaman tujuan)

**Aksesibilitas:** Kartu fokus dengan keyboard, `focus-visible:ring-2 ring-primary`.

### 5.5 AccessibilityWidgets

**Props:** Tidak ada — consume `useAccessibility()` hook

**Render:**
- Heading "Aksesibilitas" di atas grid
- Grid 4 kolom (responsive: 4→2)
- 4 tombol toggle:
  - Screen Reader (`Ear` icon)
  - Catatan Suara (`Mic` icon)
  - Bahasa Isyarat (`Hand` icon)
  - Kontras Tinggi (`Contrast` icon)
- Setiap toggle:
  - Background: `bg-surface-soft` (off) / `bg-primary-soft` (on)
  - Border: `border-border` (off) / `border-primary` (on)
  - Label status: "Nonaktif" / "Aktif"
  - Ikon: 24px, `text-muted-foreground` (off) / `text-primary` (on)

**State:** `role="switch"`, `aria-checked={isActive}`, `aria-label="Toggle screen reader"`.

### 5.6 EmergencyCard

**Props:** Tidak ada

**Render:**
- Layout horizontal: teks kiri, tombol + link kanan
- Border: `border-2 border-emergency` (#dc2626, 2px)
- Background: `bg-red-50` (#fef2f2)
- Rounded-xl, padding 24px 32px
- Teks:
  - Judul: "Butuh bantuan segera?" — `text-title-md font-semibold`
  - Subtitle: "Anda tidak sendirian. Bantuan selalu tersedia." — `text-body-sm text-muted-foreground`
- Link "Lihat layanan darurat lainnya →": `text-emergency font-medium`
- Tombol: `<a href="tel:112">` — `bg-emergency text-white`, rounded-lg, padding 12px 28px

**Aksesibilitas:** Kontras tinggi (merah #dc2626 di putih #fef2f2 = ratio >7:1, AAA). Tombol jelas terlihat.

---

## 6. AccessibilityContext

### State

```ts
interface AccessibilityState {
  screenReader: boolean;    // default: false
  voiceNote: boolean;       // default: false
  signLanguage: boolean;    // default: false
  highContrast: boolean;    // default: false
}
```

### Actions

```ts
type AccessibilityAction =
  | { type: "TOGGLE_SCREEN_READER" }
  | { type: "TOGGLE_VOICE_NOTE" }
  | { type: "TOGGLE_SIGN_LANGUAGE" }
  | { type: "TOGGLE_HIGH_CONTRAST" };
```

### Provider

`AccessibilityProvider` dipasang di `(main)/layout.tsx` (bukan di Dashboard page), karena efek aksesibilitas harus global.

### Hook

```ts
function useAccessibility(): {
  state: AccessibilityState;
  toggle: (feature: keyof AccessibilityState) => void;
}
```

### CSS Effect (Fase 1)

Di Fase 1, toggle hanya mengubah state React — efek visual (kontras tinggi, teks besar) ditunda ke Fase 2. Yang berubah di Fase 1:
- Status di widget: "Nonaktif" ↔ "Aktif"
- Border/background widget berubah sesuai state

---

## 7. Tipe Data

Tambahan di `lib/types.ts`:

```ts
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

---

## 8. Data Flow

```
DashboardPage (page.tsx)
  |
  ├─ import { mockJournalNotes } from "@/lib/mock-data"
  ├─ compute stats ← mockJournalNotes.length
  ├─ define features array (static)
  │
  ├─> <HeroBanner greeting="Kamu tidak sendirian" />
  ├─> <DataSummary stats={stats} />
  ├─> <FeatureCards features={features} />
  ├─> <AccessibilityWidgets />        → consume AccessibilityContext
  └─> <EmergencyCard />

AccessibilityContext.Provider (di layout.tsx)
  └─> AccessibilityWidgets (toggle dispatch)
  └─> (future) CSS variables di root
```

**Fetch-ready:** Saat backend siap, DashboardPage tinggal ganti `import { mockJournalNotes }` dengan `fetch('/api/dashboard')`. Komponen anak tidak disentuh.

---

## 9. Error Handling & Edge Cases

| Komponen | Edge Case | Handling |
|----------|-----------|----------|
| DataSummary | `journalCount === 0` | Render "0", bukan error. Tidak ada loading state (sync). |
| FeatureCards | Array kosong | Tidak mungkin — array statis 6 item. |
| AccessibilityWidgets | Rapid click | useReducer antrikan dispatch, state selalu konsisten. |
| EmergencyCard | `tel:112` di desktop | Browser desktop tidak merespon (expected). Tetap render. |
| Semua komponen | Props missing | TypeScript compile-time check. |
| DashboardPage | Error render | Next.js error boundary di root layout tangani. |

Tidak ada async operation → tidak ada loading spinner, tidak ada error toast.

---

## 10. Testing Strategy

### Unit Tests (5 file, ~15 test cases)

| File | Test Cases |
|------|-----------|
| `HeroBanner.test.tsx` | Render greeting text, render 3 icons, h1 heading |
| `DataSummary.test.tsx` | Render 3 stats, zero values, responsive grid |
| `FeatureCards.test.tsx` | Render 6 cards, correct hrefs, correct titles |
| `AccessibilityWidgets.test.tsx` | Render 4 toggles, click dispatches action, state label changes |
| `EmergencyCard.test.tsx` | Render emergency text, tel:112 href, button styling |

### Integration Test (1 file)

| File | Test Cases |
|------|-----------|
| `DashboardPage.test.tsx` | All 5 sections rendered in correct vertical order |

### Context Test (1 file)

| File | Test Cases |
|------|-----------|
| `accessibility-context.test.tsx` | Default state all false, each toggle action, multiple toggles combine, custom hook returns correct values |

**Total: 7 file, ~20-25 test cases.** Pola setup: Vitest + jsdom + @testing-library/react. Setiap test yang butuh context wrapper pakai `render(<AccessibilityProvider><Component /></AccessibilityProvider>)`.

---

## 11. Aksesibilitas (WCAG 2.2)

| Requirement | Implementasi |
|-------------|-------------|
| Heading hierarchy | `<h1>` di HeroBanner, heading seksi pakai `<h2>` |
| Semantic HTML | `<nav>` untuk FeatureCards, `<section>` untuk tiap seksi, `<a>` untuk link |
| Keyboard navigation | Semua interaktif elemen focusable, `focus-visible:ring-2` |
| Screen reader | `aria-label` di statistik, `aria-hidden="true"` di ikon dekoratif |
| Toggle state | `role="switch"`, `aria-checked` di AccessibilityWidgets |
| Kontras teks | `#1a1a1a` di `#ffffff` = ratio 21:1 (AAA). Emergency: `#dc2626` di `#fef2f2` = ratio ~7:1 (AAA) |
| No flashing | Tidak ada animasi — flat design |
| Skip link | Sudah ada di AppShell |

---

## 12. Responsive Breakpoints

| Breakpoint | Feature Cards | Accessibility | Data Summary | Hero |
|-----------|---------------|---------------|--------------|------|
| Desktop (>=1024px) | 3 kolom | 4 kolom | 3 kolom | Row (teks kiri, ikon kanan) |
| Tablet (640-1023px) | 2 kolom | 2 kolom | 2 kolom | Row |
| Mobile (<640px) | 1 kolom | 2 kolom | 1 kolom | Column (teks atas, ikon bawah) |

---

## 13. Referensi

- **Design System:** `DESIGN.md` — AmanAkses design tokens
- **Mockup Halaman:** `mockup/detail-pages.md` — spesifikasi Dashboard Utama
- **Glossary:** `CONTEXT.md` — domain terminology
- **Existing Pattern:** `app/(main)/kronologi/` — pola dekomposisi komponen + Context
- **Existing Context:** `lib/wizard-context.tsx` — referensi untuk AccessibilityContext

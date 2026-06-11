# Jurnal Aman — Desain Frontend

**Tanggal:** 2026-06-12
**Status:** Approved
**Fase:** 1 (Implementasi)
**Terkait:** `mockup/detail-pages.md` #2, Kronologi Wizard, App Shell

---

## 1. Ringkasan

Jurnal Aman adalah ruang pribadi untuk mencatat pengalaman. Merupakan **sumber data untuk Kronologi Builder (AI)** — tanpa catatan di Jurnal Aman, wizard Kronologi tidak memiliki data untuk diproses.

Fase 1 mencakup: CRUD catatan jurnal dengan mood tracker, tags, dan penyimpanan localStorage. Perekam suara dan sidebar informasi ditunda ke Fase 2.

---

## 2. Arsitektur

```
┌─────────────────────────────────────────────────────┐
│                   /jurnal (page)                     │
│  ┌──────────────────┐    ┌──────────────────────┐   │
│  │   JournalList     │    │   JournalSheet        │   │
│  │   (daftar +       │───>│   (create/edit form)  │   │
│  │    empty state)   │    │   via shadcn Sheet    │   │
│  └──────┬───────────┘    └──────────┬───────────┘   │
│         │ read/delete               │ create/update  │
│         └──────────┬───────────────┘                 │
│                    ▼                                 │
│          ┌─────────────────┐                        │
│          │  JournalContext  │  (useReducer)          │
│          └────────┬────────┘                        │
│                   ▼                                 │
│          ┌─────────────────┐                        │
│          │ JournalRepository│  (interface)           │
│          └────────┬────────┘                        │
│     ┌─────────────┴─────────────┐                   │
│     ▼                           ▼                   │
│  LocalStorageRepo           ApiRepo                  │
│  (Fase 1)                   (Fase 2, nanti)         │
└─────────────────────────────────────────────────────┘
```

Kronologi Wizard membaca `JournalContext.entries` melalui custom hook `useJournal()`.

### Keputusan Arsitektur

| Keputusan | Alasan |
|-----------|--------|
| Context + useReducer | Pola established: AccessibilityContext, WizardContext |
| Repository pattern | Swap localStorage ke API fetch tanpa ubah UI |
| localStorage | Web API native, tidak tambah dependensi, survive refresh |
| Promise-based repo | Siap untuk async API di Fase 2 tanpa ubah interface |
| shadcn Sheet | Sudah terpasang, ARIA dialog pattern, mobile-friendly |

---

## 3. Layout Halaman

Opsi D: **List + Slide-out Sheet**.

- Halaman utama: daftar catatan + tombol "Tulis Catatan Baru"
- Form muncul sebagai slide-out sheet dari kanan (shadcn Sheet)
- Konteks daftar tetap terlihat di belakang sheet (trauma-informed)
- Mobile: sheet full-width dengan swipe-to-dismiss
- Alasan: aksesibilitas terbaik, transisi tidak agresif, shadcn Sheet sudah tersedia

---

## 4. Komponen

### 4.1 JournalList

Daftar kartu berisi semua JournalEntry milik pengguna.

| State | Tampilan |
|-------|----------|
| **Loading** | 3 skeleton cards (shadcn `Skeleton`) |
| **Empty** | Ilustrasi + teks "Belum ada catatan. Mulai tulis catatan pertama Anda." + tombol CTA |
| **Populated** | Kartu terurut tanggal turun (terbaru di atas) |
| **Error** | Teks "Gagal memuat catatan" + tombol "Coba Lagi" |
| **Edge (1 item)** | Normal, tidak ada layout aneh |

**Setiap kartu berisi:**
- Tanggal (format lokal Indonesia)
- Judul (bold, 1 baris)
- Preview konten (2 baris, truncated)
- Tags (badge/chip)
- Mood (ikon Lucide + label, hanya jika diisi)
- Tombol hapus (ikon sampah, kanan bawah)

**Props:**
```typescript
interface JournalListProps {
  entries: JournalNote[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
  onNewEntry: () => void;   // buka sheet
  onEditEntry: (id: string) => void;  // buka sheet dengan data
}
```

### 4.2 JournalSheet

Form dalam shadcn Sheet untuk create/edit catatan.

**Mode Create:**
- Header: "Catatan Baru" + tombol ✕
- Form kosong, mood tidak dipilih

**Mode Edit:**
- Header: "Edit Catatan" + tombol ✕
- Semua field terisi dari data yang ada
- Tombol "Simpan Perubahan"

**Field:**
1. Tanggal Kejadian — `<input type="date">` (wajib)
2. Suasana Hati — `MoodTracker` (opsional)
3. Apa yang terjadi? — `<textarea>` min 4 baris (wajib)
4. Siapa yang terlibat? — `<input type="text">` (opsional)
5. Tags — input teks + chips, Enter untuk tambah, ✕ untuk hapus (opsional)
6. Tombol Simpan — `button-primary`

**Validasi:**
- Judul: wajib, maks 100 karakter
- Tanggal: wajib
- Mood: opsional, default null (tidak dipilih)
- Error ditampilkan inline di bawah field

**Props:**
```typescript
interface JournalSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  entry?: JournalNote;           // untuk edit
  onSave: (data: JournalEntryInput) => Promise<void>;
}
```

### 4.3 MoodTracker

5 ikon Lucide dalam baris horizontal dengan label teks di bawah.

| Mood | Ikon | Label |
|------|------|-------|
| Sangat Baik | `SmilePlus` | "Sangat Baik" |
| Baik | `Smile` | "Baik" |
| Biasa Saja | `Meh` | "Biasa Saja" |
| Sedih | `Frown` | "Sedih" |
| Sangat Sedih | `Annoyed` | "Sangat Sedih" |

**State:**
- Tidak ada yang dipilih (default, null)
- Satu ikon aktif: `text-primary` (teal #2a9d8f), scale 110%
- Ikon non-aktif: `text-muted-foreground`, normal scale
- Hover: ikon membesar sedikit
- Fokus keyboard: bisa navigasi kiri-kanan, Enter/Space pilih

**Props:**
```typescript
interface MoodTrackerProps {
  value: Mood | null;
  onChange: (mood: Mood) => void;
}
```

### 4.4 Hapus Catatan

Dialog konfirmasi sebelum hapus:
- Teks: "Hapus catatan ini? Tindakan ini tidak bisa dibatalkan."
- Tombol: [Batal] (outline) [Hapus] (destructive)

---

## 5. Data Model

### Tipe Baru di `lib/types.ts`

```typescript
type Mood = "sangat-baik" | "baik" | "biasa" | "sedih" | "sangat-sedih";

const MOOD_CONFIG: Record<Mood, { icon: LucideIcon; label: string }> = {
  "sangat-baik":  { icon: SmilePlus, label: "Sangat Baik" },
  "baik":         { icon: Smile,     label: "Baik" },
  "biasa":        { icon: Meh,       label: "Biasa Saja" },
  "sedih":        { icon: Frown,     label: "Sedih" },
  "sangat-sedih": { icon: Annoyed,   label: "Sangat Sedih" },
};

interface JournalNote {
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

// Input untuk create/edit (tanpa id dan timestamp)
type JournalEntryInput = Omit<JournalNote, "id" | "createdAt" | "updatedAt">;
```

### Repository Interface (`lib/repository.ts`)

```typescript
interface JournalRepository {
  getAll(): Promise<JournalNote[]>;
  getById(id: string): Promise<JournalNote | null>;
  create(input: JournalEntryInput): Promise<JournalNote>;
  update(id: string, input: Partial<JournalEntryInput>): Promise<JournalNote>;
  delete(id: string): Promise<void>;
}
```

### Context State & Actions

```typescript
interface JournalState {
  entries: JournalNote[];
  loading: boolean;
  error: string | null;
}

type JournalAction =
  | { type: "LOAD"; entries: JournalNote[] }
  | { type: "ADD"; entry: JournalNote }
  | { type: "UPDATE"; entry: JournalNote }
  | { type: "DELETE"; id: string }
  | { type: "SET_ERROR"; error: string }
  | { type: "CLEAR_ERROR" };

type JournalDispatch = (action: JournalAction) => void;
```

### Custom Hook

```typescript
function useJournal(): {
  entries: JournalNote[];
  loading: boolean;
  error: string | null;
  createEntry: (input: JournalEntryInput) => Promise<JournalNote>;
  updateEntry: (id: string, input: Partial<JournalEntryInput>) => Promise<JournalNote>;
  deleteEntry: (id: string) => Promise<void>;
  refreshEntries: () => Promise<void>;
}
```

---

## 6. File yang Perlu Dibuat/Diubah

### Dibuat (10 file)

| File | Peran |
|------|-------|
| `lib/repository.ts` | Interface `JournalRepository` |
| `lib/repository-localstorage.ts` | Implementasi localStorage + seed data |
| `app/contexts/journal-context.tsx` | Context + Provider + useReducer + useJournal hook |
| `app/contexts/__tests__/journal-context.test.tsx` | Test context |
| `app/(main)/_components/journal/JournalList.tsx` | Daftar catatan (semua state) |
| `app/(main)/_components/journal/JournalSheet.tsx` | Form create/edit dalam Sheet |
| `app/(main)/_components/journal/MoodTracker.tsx` | Komponen mood 5 ikon |
| `app/__tests__/journal/JournalList.test.tsx` | Test list |
| `app/__tests__/journal/JournalSheet.test.tsx` | Test sheet |
| `app/__tests__/journal/MoodTracker.test.tsx` | Test mood tracker |

### Diubah (3 file)

| File | Perubahan |
|------|-----------|
| `app/(main)/jurnal/page.tsx` | Placeholder → halaman utuh dengan JournalProvider + JournalList + JournalSheet |
| `app/layout.tsx` | Tambah `JournalProvider` (setelah AccessibilityProvider) |
| `lib/types.ts` | Tambah `Mood`, `MOOD_CONFIG`, `JournalEntryInput`, update `JournalNote` |

### Opsional (1 file)

| File | Perubahan |
|------|-----------|
| `lib/mock-data.ts` | Update mock data dengan field baru (mood, involvedParties, tags[]) atau hapus seed |

---

## 7. Alur Pengguna

### Create
1. User klik "Tulis Catatan Baru" → sheet slide dari kanan
2. Isi form: tanggal (wajib), mood (opsional), deskripsi (wajib), pihak terlibat (opsional), tags (opsional)
3. Klik "Simpan Catatan" → validasi → `repository.create()` → `dispatch(ADD)` → sheet tutup → kartu muncul di daftar

### Edit
1. User klik kartu → sheet slide dengan header "Edit Catatan", semua field terisi
2. User ubah field → klik "Simpan Perubahan" → `repository.update()` → `dispatch(UPDATE)` → sheet tutup

### Delete
1. User klik ikon hapus di kartu → dialog konfirmasi muncul
2. Konfirmasi → `repository.delete()` → `dispatch(DELETE)` → kartu hilang dari daftar

### Empty → Populated
1. Pertama kali buka: `repository.getAll()` → 0 entry → tampil empty state
2. Setelah create pertama → `dispatch(ADD)` → empty state hilang, daftar muncul

---

## 8. Testing

Mengikuti TDD (RED-GREEN-REFACTOR). Setiap komponen punya test co-located.

| Komponen | Tes |
|----------|-----|
| **JournalContext** | LOAD/ADD/UPDATE/DELETE actions, error handling, refresh |
| **JournalList** | Loading (skeleton), Empty (CTA), Populated (kartu terurut), Delete callback |
| **JournalSheet** | Create mode (form kosong), Edit mode (terisi), Validasi wajib, Simpan callback |
| **MoodTracker** | Tidak dipilih (null), Pilih satu, Ganti pilihan, Keyboard navigation |

Test menggunakan: Vitest + Testing Library + jsdom. Repository di-mock — tidak testing localStorage secara langsung.

---

## 9. Aksesibilitas

- shadcn Sheet: built-in ARIA dialog, focus trap, Escape to close
- MoodTracker: semua ikon punya `aria-label`, keyboard navigasi kiri/kanan
- Form: label terasosiasi dengan input (`htmlFor`/`id`)
- Hapus: dialog konfirmasi dengan focus trap
- Empty state: teks suportif, tidak menyalahkan
- Semua teks: Bahasa Indonesia
- Warna: kontras cukup (teal #2a9d8f pada background putih = 3.78:1, di atas 3:1 untuk large text)

---

## 10. Yang Tidak Termasuk (Fase 2)

- Perekam suara (voice recorder, max 3 menit)
- Sidebar informasi (tips menulis jurnal, jaminan kerahasiaan, indikator autosave)
- Enkripsi data (backed akan handle)
- Sinkronisasi multi-device
- Pencarian / filter catatan

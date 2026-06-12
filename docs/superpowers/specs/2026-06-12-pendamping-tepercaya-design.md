# Pendamping Tepercaya — Desain Frontend

**Status:** Spec (belum diimplementasikan)
**Tanggal:** 2026-06-12
**Fase:** 2
**Konvensi istilah:** `CONTEXT.md`

---

## 1. Overview

Pendamping Tepercaya adalah modul pengelolaan kontak pendukung — mencakup orang terdekat pengguna (Pendamping Personal) dan penyedia layanan formal (Penyedia Layanan Dukungan) yang sudah dikurasi oleh tim AmanAkses. Pengguna bisa menyimpan kontak, mengontrol izin akses per modul, dan menghubungi pendamping langsung via WhatsApp atau Telepon.

### Prinsip Desain

- **Trauma-Informed Design**: entri manual (tidak akses kontak HP), bahasa suportif, kontrol penuh di tangan pengguna. Tidak ada auto-share atau auto-invite.
- **Human-in-the-Loop**: semua izin diberikan dan dicabut secara eksplisit oleh pengguna.
- **Aksesibilitas**: WCAG 2.2, keyboard navigation, screen reader support, kontras minimum AA.
- **Konsistensi**: mengikuti pola Context + Provider + Repository yang sudah established (`JournalContext`, `VaultContext`).

### Batasan Fase 2

- Tidak ada komunikasi in-app — hanya deep link ke WhatsApp / Telepon.
- Izin akses hanya metadata lokal — belum ada mekanisme enforcement di backend.
- Integrasi ke modul lain hanya placeholder ("Segera Hadir").
- Katalog penyedia layanan bersifat statis (JSON dalam codebase).
- Multi-device sync tidak didukung (seperti modul lain di Fase 2).

---

## 2. Keputusan Desain

| Aspek | Keputusan |
|-------|-----------|
| Model Data | Hybrid: `TrustedContact` (personal, user-managed) + `ServiceProvider` (katalog, curated) |
| Izin Akses | Per-modul binary — centang: Jurnal Aman, Kronologi, Brankas Bukti |
| Layout | Hybrid: grid kartu 3-up untuk Pendamping Personal (atas), list baris + filter chip untuk Penyedia Layanan (bawah) |
| Tambah Pendamping | Entri manual (nama, role, nomor WA/Telepon, izin akses) — tanpa akses kontak HP |
| Hubungi | Deep link WhatsApp (`wa.me/62...`) atau Telepon (`tel:...`), zero backend |
| Sumber Penyedia Layanan | Katalog statis (`lib/companion-catalog.ts`), dikurasi tim AmanAkses |
| Role Kustom | Dropdown role + opsi "Lainnya" yang membuka text input bebas |
| Status Pendamping | Personal: tanpa badge. Penyedia Layanan: badge "Tersedia"/"Tutup" berdasarkan `isAvailable` |
| Jumlah Maksimum | Tidak dibatasi |
| Dialog | Sheet slide-out dari kanan (konsisten dengan JournalSheet dan VaultFileDrawer) |
| State Management | React Context + useReducer + localStorage repository |
| Integrasi Modul Lain | Placeholder di Laporan Awal dan Kronologi (tampilkan daftar pendamping, checkbox non-fungsional) |

---

## 3. Data Model

### 3.1 TrustedContact (Pendamping Personal)

```ts
export type CompanionRole =
  | "friend"       // Sahabat
  | "sibling"      // Kakak / Adik
  | "parent"       // Orang Tua
  | "partner"      // Pasangan
  | "relative"     // Keluarga Lain
  | "other";       // Lainnya (custom, user mengetik sendiri)

export type ModuleAccess =
  | "journal"      // Jurnal Aman
  | "timeline"     // Kronologi Kejadian
  | "evidence";    // Brankas Bukti

export interface TrustedContact {
  id: string;                    // UUID
  name: string;                  // Nama pendamping
  role: CompanionRole;           // Peran/relasi
  roleCustom?: string;           // Custom role (jika role = "other")
  phone: string;                 // Nomor WA/Telepon (format: 08xxxxxxxxxx)
  permissions: ModuleAccess[];   // Modul yang diizinkan diakses
  notes: string;                 // Catatan pengguna (opsional, default "")
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

### 3.2 ServiceProvider (Penyedia Layanan Dukungan)

```ts
export type ServiceCategory =
  | "hotline"         // Hotline / Layanan Darurat
  | "satgas-ppks"     // Satgas PPKS
  | "legal-aid"       // Bantuan Hukum (LBH, dll)
  | "psychologist"    // Layanan Psikologi
  | "social-service"; // Layanan Sosial

export interface ServiceProvider {
  id: string;                    // Slug unik (e.g. "satgas-ppks-unhas")
  name: string;                  // Nama lembaga
  category: ServiceCategory;     // Kategori layanan
  description: string;           // Deskripsi singkat (1-2 kalimat)
  phone: string;                 // Nomor telepon utama
  waNumber: string | null;       // Nomor WhatsApp (null jika hanya telepon)
  email: string | null;          // Email (opsional)
  website: string | null;        // Website (opsional)
  address: string;               // Alamat
  operatingHours: string;        // Jam operasional (teks bebas)
  isAvailable: boolean;          // Status saat ini
  icon: string;                  // Nama ikon Lucide (e.g. "Shield", "Scale", "Phone")
}
```

### 3.3 CompanionState (Context)

```ts
export interface CompanionState {
  contacts: TrustedContact[];              // Pendamping personal
  providers: ServiceProvider[];            // Dari katalog statis
  activeFilter: ServiceCategory | "all";   // Filter penyedia layanan
  selectedContactId: string | null;        // Untuk sheet edit
  sheetMode: "add" | "edit" | null;        // Mode sheet yang terbuka
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
```

### 3.4 CompanionContext API

```ts
interface CompanionContextValue {
  state: CompanionState;
  // Contact CRUD
  addContact: (input: Omit<TrustedContact, "id" | "createdAt" | "updatedAt">) => void;
  updateContact: (id: string, updates: Partial<TrustedContact>) => void;
  deleteContact: (id: string) => void;
  // UI
  openAddSheet: () => void;
  openEditSheet: (id: string) => void;
  closeSheet: () => void;
  setFilter: (category: ServiceCategory | "all") => void;
  // Permissions (convenience wrappers)
  grantAccess: (contactId: string, module: ModuleAccess) => void;
  revokeAccess: (contactId: string, module: ModuleAccess) => void;
}
```

### 3.5 Katalog Statis

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
    description: "Lembaga Bantuan Hukum Makassar — pendampingan hukum gratis untuk korban kekerasan dan masyarakat tidak mampu.",
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
    description: "Layanan konseling dan terapi psikologi untuk korban kekerasan dan trauma. Konseling individu dan kelompok.",
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

### 3.6 Kategori & Ikon

| Kategori | ServiceCategory | Ikon Lucide | Warna Badge |
|----------|----------------|-------------|-------------|
| Hotline | `hotline` | `Phone` | `badge-pink` |
| Satgas PPKS | `satgas-ppks` | `Shield` | `badge-blue` |
| Bantuan Hukum | `legal-aid` | `Scale` | `badge-violet` |
| Psikolog | `psychologist` | `HeartPulse` | `badge-teal` |
| Layanan Sosial | `social-service` | `Building2` | `badge-emerald` |

### 3.7 Storage

| Data | Lokasi | Key |
|------|--------|-----|
| TrustedContact[] | localStorage | `companion:contacts` |
| Katalog ServiceProvider | `lib/companion-catalog.ts` | Statis, di-import langsung |
| Filter state | React state (tidak dipersist) | — |

---

## 4. Arsitektur Komponen

```
lib/
  companion-types.ts                       # Semua type definition
  companion-catalog.ts                     # Katalog statis ServiceProvider[]
  companion-context.tsx                    # CompanionProvider + useCompanion hook
  companion-repository-localstorage.ts     # CRUD localStorage

app/(main)/pendamping-tepercaya/
  page.tsx                                 # Server component wrapper
  _components/
    PendampingClient.tsx                   # Client orchestrator
    CompanionGrid.tsx                      # Grid pendamping personal (3-up)
    CompanionCard.tsx                      # Kartu pendamping personal
    CompanionSheet.tsx                     # Sheet: tambah / edit pendamping + izin akses
    ServiceProviderList.tsx                # List penyedia layanan
    ServiceProviderRow.tsx                 # Baris penyedia layanan
    ServiceProviderFilter.tsx              # Filter chip per kategori
    CompanionDeleteDialog.tsx              # Konfirmasi hapus
```

### 4.1 Component Tree

```
PendampingClient
├── PageHeader ("Pendamping Tepercaya" + tombol "+ Tambah")
├── Section: Pendamping Personal
│   ├── SectionHeader ("Pendamping Personal" + tombol "+ Tambah")
│   └── CompanionGrid
│       ├── CompanionCard[]                (satu per TrustedContact)
│       └── AddCard                        (dashed border, posisi terakhir; hidden jika kosong tampil empty state)
├── Section: Penyedia Layanan Dukungan
│   ├── SectionHeader ("Penyedia Layanan Dukungan")
│   ├── ServiceProviderFilter              (chip: Semua | Hotline | Satgas PPKS | Hukum | Psikolog | Sosial)
│   └── ServiceProviderList
│       └── ServiceProviderRow[]           (satu per ServiceProvider, difilter)
├── CompanionSheet                         (slide-out kanan: add/edit form + permission checkboxes)
└── CompanionDeleteDialog                  (AlertDialog konfirmasi hapus)
```

### 4.2 Layout Detail

```
┌─ Konten Utama (padding 32px, max-width 1200px) ───────────────────┐
│                                                                     │
│  Pendamping Tepercaya                                  [+ Tambah]   │
│  Kelola kontak pendamping dan penyedia layanan dukungan.            │
│                                                                     │
│  ── Pendamping Personal ──────────────────────────────────────────  │
│                                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                            │
│  │   [AR]   │ │   [BD]   │ │  [+..]   │                            │
│  │ Ayu Rahma│ │Budi Darma│ │  Tambah  │                            │
│  │ Sahabat  │ │  Kakak   │ │Pendamping│                            │
│  │Jurnal,   │ │ Jurnal   │ │          │                            │
│  │Kronologi │ │          │ │          │                            │
│  │[Hubungi] │ │[Hubungi] │ │          │                            │
│  └──────────┘ └──────────┘ └──────────┘                            │
│                                                                     │
│  ── Penyedia Layanan Dukungan ────────────────────────────────────  │
│  [Semua] [Hotline] [Satgas PPKS] [Hukum] [Psikolog] [Sosial]       │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ [Phone] Layanan Darurat 112           24 jam    [Hubungi]  │    │
│  │         Nasional — bebas pulsa                              │    │
│  ├────────────────────────────────────────────────────────────┤    │
│  │ [Heart] SAPA 129 — KemenPPPA         24 jam    [Hubungi]  │    │
│  │         Nasional                                            │    │
│  ├────────────────────────────────────────────────────────────┤    │
│  │ [Shield] Satgas PPKS Unhas     Sen-Jum 08-16    [Hubungi]  │    │
│  │         Kampus Tamalanrea, Makassar                         │    │
│  ├────────────────────────────────────────────────────────────┤    │
│  │ [Scale]  LBH Makassar          Sen-Jum 09-17    [Hubungi]  │    │
│  │         Jl. Perintis Kemerdekaan No. 45                     │    │
│  ├────────────────────────────────────────────────────────────┤    │
│  │ [HeartPulse] Pusat Psikologi   Sen-Sab 09-18    [Hubungi]  │    │
│  │         Jl. A.P. Pettarani No. 88, Makassar                 │    │
│  ├────────────────────────────────────────────────────────────┤    │
│  │ [Building2] Komnas Perempuan   Sen-Jum 09-17    [Hubungi]  │    │
│  │         Jl. Latuharhary No. 4B, Jakarta Pusat               │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.3 Komponen Spesifik

**CompanionCard** (extend `companion-card` dari DESIGN.md):
- Background canvas, border 1px hairline, rounded-lg, padding 20px.
- Avatar inisial 48x48px. Background dari palette yang ditentukan oleh role. Inisial dari 2 karakter pertama nama.
- Nama: `title-sm` (16px, semibold). Role: `caption` (13px, muted).
- Izin akses: ditampilkan sebagai chip kecil (`badge-pill`) — "Jurnal", "Kronologi", "Brankas". Hidden jika tidak ada izin.
- Tombol "Hubungi Sekarang" full-width di bawah (button-primary, height 40px).
- Ikon hapus di kanan atas kartu (icon-button, hanya tampil saat hover/focus).

**ServiceProviderRow**:
- Avatar ikon 36x36px (`rounded-full`, background palette). Ikon Lucide sesuai `icon` field, warna putih.
- Nama lembaga: `title-sm`. Deskripsi singkat + alamat: `body-sm` muted (1 baris, truncated).
- Status badge: `Tersedia` (success) atau `Tutup` (muted), berdasarkan `isAvailable`.
- Tombol "Hubungi" (button-secondary outline) di kanan.
- Prioritas kontak: WhatsApp > Telepon.

**CompanionSheet** (Sheet slide-out kanan):
- Title: "Tambah Pendamping" atau "Edit Pendamping" tergantung mode.
- Field: Nama (text-input, wajib), Role (dropdown + text input untuk "Lainnya"), Nomor WA/Telepon (text-input, wajib, min 8 digit), Catatan (textarea, opsional).
- Section "Izin Akses Data": 3 checkbox — "Akses Jurnal Aman", "Akses Kronologi", "Akses Brankas Bukti". Default: tidak dicentang.
- Tombol "Hapus Pendamping" (destructive, di bagian bawah — hanya di mode edit).
- Footer: "Batal" (secondary) + "Simpan" (primary).
- Focus trap, Escape untuk tutup.

**ServiceProviderFilter** (chip horizontal):
- Scrollable horizontal di mobile (overflow-x-auto).
- Chip aktif: `bg-sidebar-accent`, `text-primary-text`, `border-primary`.
- Chip inaktif: `bg-background`, `border-border`, `text-muted-foreground`.
- Single-select (radio behavior) — klik satu chip menonaktifkan yang lain.

### 4.4 Responsive Behavior

| Breakpoint | Pendamping Personal | Penyedia Layanan | Filter |
|------------|--------------------|------------------|--------|
| Desktop (>1024px) | Grid 3-up | List baris | Chip horizontal |
| Tablet (768-1024px) | Grid 2-up | List baris | Chip wrap |
| Mobile (<768px) | Grid 1-up | List baris | Scroll horizontal |

### 4.5 Design System Mapping

| DESAIN | Token Tailwind | Komponen |
|--------|---------------|----------|
| `companion-card` | `bg-background border rounded-lg p-5` | Kartu pendamping personal |
| `status-badge` | `bg-success text-[#064e3b] rounded-full px-2 py-0.5 text-xs` | Tersedia/Tutup |
| `badge-pill` | `bg-card text-foreground rounded-full px-3 py-0.5 text-xs` | Chip izin akses |
| `button-primary` | `bg-primary text-primary-foreground` | Hubungi, Simpan |
| `button-secondary` | `border bg-background` | Hubungi (penyedia), Batal |
| `text-input` | `border bg-background rounded-md` | Field di sheet |
| `companion-card` (add) | `border-dashed border-primary` | Kartu "+ Tambah" |

---

## 5. Alur Pengguna

### 5.1 Melihat Daftar Pendamping

1. User klik "Pendamping Tepercaya" di sidebar.
2. Halaman load -> CompanionContext membaca kontak dari localStorage + meng-import katalog statis.
3. **Section Pendamping Personal**: Grid kartu.
   - Empty state: "Belum ada pendamping. Tambahkan orang yang kamu percaya." + tombol "Tambah Pendamping" di tengah.
   - Ada kontak: Grid dengan kartu "+ Tambah" di posisi terakhir.
4. **Section Penyedia Layanan**: List baris dengan filter chip.
   - Selalu tampil (katalog selalu ada, kecuali corrupt).
5. Filter chip di section penyedia — klik untuk filter berdasarkan kategori.

### 5.2 Menambah Pendamping Personal

1. Klik tombol "+ Tambah" di header atau kartu dashed.
2. `CompanionSheet` slide dari kanan, mode "add".
3. Isi: Nama (wajib), Role (dropdown), Nomor WA/Telepon (wajib, min 8 digit), Catatan (opsional).
4. Centang izin akses: Jurnal Aman, Kronologi, Brankas Bukti. Default: tidak ada yang dicentang.
5. Klik "Simpan" -> validasi -> tambah ke state -> localStorage -> sheet tutup -> grid refresh.
6. Klik "Batal" atau Escape -> sheet tutup, tidak ada perubahan.

### 5.3 Mengedit Pendamping & Izin Akses

1. Klik kartu pendamping personal.
2. `CompanionSheet` slide dari kanan, mode "edit", semua field pre-filled.
3. User bisa: ubah nama, role, nomor, catatan, dan centang/copot izin akses.
4. Klik "Simpan" -> update state -> localStorage -> kartu ter-update.
5. Klik "Hapus Pendamping" di bagian bawah sheet -> `CompanionDeleteDialog` muncul.

### 5.4 Menghapus Pendamping

1. Klik ikon hapus di kartu, atau "Hapus Pendamping" di sheet edit.
2. `CompanionDeleteDialog` (AlertDialog) muncul: "Hapus [Nama] dari daftar pendamping? Kontak ini tidak akan lagi memiliki akses ke data Anda."
3. Klik "Hapus, Lanjutkan" -> hapus dari state -> localStorage -> grid refresh.
4. Klik "Batal" -> dialog tutup.

### 5.5 Menghubungi Pendamping

**Pendamping Personal:**
1. Klik "Hubungi Sekarang" di kartu.
2. Deteksi nomor: jika diawali `08`, konversi ke format WA (`62` + sisa).
3. Buka URL: `window.open('https://wa.me/62xxxxxxxx', '_blank')`.
4. Tidak ada konfirmasi dialog — aksi langsung. (Jika gagal karena popup blocker, browser yang handle.)

**Penyedia Layanan:**
1. Klik "Hubungi" di baris.
2. Prioritas: jika `waNumber` ada -> WA. Jika hanya `phone` -> `tel:`.
3. Aksi langsung, tanpa konfirmasi.

### 5.6 Filter Penyedia Layanan

1. Klik chip kategori -> `setFilter(category)`.
2. List di-render ulang: `providers.filter(p => activeFilter === "all" || p.category === activeFilter)`.
3. Klik "Semua" -> reset ke `"all"`.
4. Single-select: hanya satu chip yang aktif.

---

## 6. Integrasi dengan Modul Lain (Placeholder Fase 2)

### 6.1 Dari Laporan Awal (Placeholder)

Di halaman Laporan Awal, tambahkan section "Penerima Laporan" yang membaca `contacts[]` dari CompanionContext. Tampilkan daftar kontak dengan izin akses yang sesuai, tapi checkbox dalam keadaan disabled + label "Segera Hadir".

```
┌─ Penerima Laporan ──────────────────────────────────────────┐
│                                                              │
│  Pilih pendamping yang akan menerima laporan:                │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ [ ] Ayu Rahma — Sahabat                               │  │
│  │     Akses: Jurnal, Kronologi                          │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ [ ] Budi Darma — Kakak                                │  │
│  │     Akses: Jurnal                                     │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ⚠️ Pengiriman laporan akan tersedia di fase berikutnya.      │
└──────────────────────────────────────────────────────────────┘
```

### 6.2 Dari Kronologi (Placeholder)

Di langkah "Simpan" wizard Kronologi, tambahkan opsi "Bagikan ke Pendamping" — dropdown menampilkan daftar kontak dari CompanionContext, tapi dalam keadaan disabled.

### 6.3 Data Flow

```
CompanionContext (source of truth)
  │
  ├──> useCompanion() di halaman Pendamping Tepercaya
  ├──> useCompanion() di Laporan Awal (baca contacts[], filter yang punya izin)
  └──> useCompanion() di Kronologi (baca contacts[], tampilkan di dropdown)
```

Integrasi one-way read. Modul lain membaca data dari CompanionContext. Tidak ada write-back.

---

## 7. Error Handling

| Skenario | Handling |
|----------|----------|
| Nama kosong | Border input merah + pesan validasi: "Nama pendamping wajib diisi." |
| Nomor < 8 digit | Border input merah + pesan validasi: "Nomor tidak valid. Masukkan minimal 8 digit." |
| Format nomor non-angka | Border input merah: "Nomor hanya boleh berisi angka." |
| localStorage penuh | Tidak mungkin — data kontak sangat kecil (<1KB). Tidak ada handling khusus. |
| Katalog corrupt / gagal import | Fallback: `providers = []`, tampilkan pesan: "Data penyedia layanan tidak tersedia." |
| Duplikat kontak | Tidak dicegah. User bisa punya 2 entri dengan nama sama. |
| Deep link gagal | `window.open` bisa diblokir popup blocker. Browser menampilkan notifikasi "Pop-up blocked". |

---

## 8. Testing Strategy

### 8.1 Unit Tests (Vitest)

```
lib/__tests__/
  companion-types.test.ts                # Type integrity, DEFAULT_STATE valid
  companion-context.test.tsx             # Provider: add/edit/delete contacts, grant/revoke
  companion-repository-localstorage.test.ts  # CRUD round-trip

app/(main)/pendamping-tepercaya/__tests__/
  CompanionCard.test.tsx                 # Render, role display, permission chips, klik panggil
  CompanionGrid.test.tsx                 # Empty state, grid dengan kontak, kartu tambah
  CompanionSheet.test.tsx                # Validasi form, submit, edit mode pre-filled, batal
  ServiceProviderRow.test.tsx            # Render, status badge, klik hubungi
  ServiceProviderFilter.test.tsx         # Klik chip, active state, reset ke "Semua"
  CompanionDeleteDialog.test.tsx         # Konfirmasi, hapus, batal
```

### 8.2 Coverage Target

- Context: semua state transitions (add, update, delete, grantAccess, revokeAccess, sheet open/close).
- Repository: save, load, update, delete dari localStorage.
- Komponen: render semua state (default, empty, active filter, sheet add, sheet edit).
- Validasi form: field kosong, nomor pendek, submit sukses.

### 8.3 Accessibility Tests

- Keyboard navigation: Tab/Enter/Escape di grid, sheet, filter chip, dialog.
- Screen reader: ARIA labels di avatar inisial, tombol Hubungi, status badge.
- Focus trap di CompanionSheet (seperti JournalSheet).
- Alt text untuk ikon penyedia layanan.

---

## 9. Trade-off & Catatan Arsitektur

| Keputusan | Pro | Contra |
|-----------|-----|--------|
| localStorage untuk kontak | Sederhana, offline, konsisten dengan JournalContext | Beda device = beda data |
| Katalog statis dalam codebase | Tidak perlu backend, kurasi terjamin | Butuh deploy untuk update katalog |
| Deep link WA/Telepon, tanpa konfirmasi | Zero backend, aksi instan | Tidak bisa track engagement; popup blocker bisa intervensi |
| Izin akses hanya metadata | Simpel, cepat diimplementasikan | Belum ada enforcement — di Fase 2, izin tidak membatasi siapa pun |
| Sheet untuk form (bukan modal) | Konsisten dengan JournalSheet/VaultFileDrawer | Butuh focus trap + keyboard handling yang baik di mobile |
| Tanpa status badge untuk personal | Jujur — tidak ada real-time connection. Tidak menyesatkan. | Informasi "aktif/tidak" tidak tersedia |
| Tidak ada batasan jumlah kontak | Fleksibel | Storage lokal tidak terkontrol (tapi data kontak sangat kecil) |

---

## 10. Rencana Fase 3 (Out of Scope, untuk Referensi)

- **Undangan Pendamping**: mekanisme share link/token ke pendamping agar bisa mengakses data yang diizinkan.
- **Enforcement izin**: backend memvalidasi izin akses — pendamping hanya melihat data yang diizinkan.
- **In-app notifikasi**: pendamping mendapat notifikasi saat data dibagikan.
- **Komunikasi in-app**: chat sederhana antara pengguna dan pendamping.
- **Katalog dinamis**: penyedia layanan di-fetch dari backend, bisa di-update tanpa deploy.
- **Multi-device sync**: kontak pendamping bisa disinkronkan antar device.
- **Sharing file dari Brankas Bukti**: pendamping dengan izin "Brankas Bukti" bisa mengakses file yang dibagikan.

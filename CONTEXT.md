# CONTEXT.md — AmanAkses Domain Glossary

Glossary istilah yang digunakan dalam proyek AmanAkses. Tidak mengandung detail implementasi.

---

## Kronologi / Timeline
Urutan kejadian yang disusun dari catatan jurnal pengguna, diurutkan berdasarkan waktu. Dibantu AI (Kronologi Builder) untuk menyusun, tapi pengguna tetap bisa mengedit dan meninjau sebelum disimpan.

_Avoid_: "history", "log", "feed"

---

## Catatan / JournalEntry
Entri jurnal pengguna di modul Jurnal Aman. Berisi tanggal, judul, isi, suasana hati (opsional), pihak terlibat, dan tags. Menjadi sumber data untuk Kronologi Builder.

_Avoid_: "note" (generik), "post", "entry" (ambigu)

---

## Pelacak Suasana Hati / Mood Tracker
Komponen pemilih suasana hati dengan 5 pilihan (Sangat Baik, Baik, Biasa Saja, Sedih, Sangat Sedih) menggunakan ikon Lucide. Ditempatkan di Lembar Catatan sebagai field opsional. Hanya satu yang bisa dipilih dalam satu waktu.

_Avoid_: "mood selector", "emotion picker", "sentiment tracker"

---

## Lembar Catatan / JournalSheet
Panel geser (slide-out sheet) dari sisi kanan yang berisi formulir untuk membuat atau mengedit Catatan. Terdiri dari field: Tanggal Kejadian, Pelacak Suasana Hati, deskripsi kejadian, pihak terlibat, dan tags. Menggunakan shadcn Sheet.

_Avoid_: "journal form", "entry editor", "note dialog", "modal"

---

## Wizard / Stepper
Alur bertahap 4 langkah pada halaman Kronologi: Pilih Catatan → Proses AI → Review Hasil → Simpan. Setiap langkah memiliki satu tugas jelas untuk mengurangi beban kognitif.

_Avoid_: "form wizard", "multi-step form", "checkout flow"

---

## Timeline Card / Kartu Timeline
Kartu individual dalam hasil Kronologi yang merepresentasikan satu item kejadian. Berisi tanggal, waktu, lokasi, judul, deskripsi, sumber catatan, dan tombol aksi (Terima/Edit/Tolak).

_Avoid_: "event card", "entry card", "item"

---

## Draft AI
Label pada hasil output AI yang menunjukkan bahwa konten belum diverifikasi oleh pengguna. Semua hasil AI wajib berlabel "Draft AI" sampai pengguna menekan "Terima" atau "Edit". Mengacu pada prinsip human-in-the-loop.

_Avoid_: "AI generated", "suggestion", "proposal"

---

## Mock Response
Respons API palsu yang digunakan frontend selama pengembangan paralel dengan backend. Mengikuti kontrak API yang sama (`POST /api/ai/timeline`) tetapi mengembalikan data sintetis.

_Avoid_: "fake data", "stub", "test data"

---

## AmanAkses
Platform digital aksesibel untuk membantu penyandang disabilitas memahami kekerasan seksual, mendokumentasikan kejadian, menyusun kronologi, dan menyiapkan laporan awal — dengan kendali penuh di tangan pengguna.

_Avoid_: "app", "platform", "tools" (gunakan "AmanAkses" sebagai produk)

---

## Trauma-Informed Design
Prinsip desain yang menghindari pemicu trauma: bahasa suportif (tidak menyalahkan), pertanyaan bertahap (bisa skip), penyimpanan bertahap (tidak memaksa semua sekaligus), mode keluar cepat, dan afirmasi dukungan.

_Avoid_: "sensitive UX", "safe design"

---

## Human-in-the-Loop
Prinsip bahwa AI hanya membantu (menyusun, merapikan, menyederhanakan) tapi keputusan akhir selalu di tangan manusia. Output AI tidak boleh auto-submit, harus ditinjau pengguna dulu.

_Avoid_: "AI oversight", "manual review"

---

## Dashboard Utama
Landing page dan pusat kendali platform. Titik awal demo yang menyediakan akses cepat ke seluruh fitur melalui Feature Cards, ringkasan data pengguna, widget aksesibilitas, dan akses darurat.

_Avoid_: "home", "main page", "landing page"

---

## Feature Card / Kartu Fitur
Kartu navigasi dengan ikon berwarna, judul, deskripsi singkat, dan link "Pelajari lebih lanjut". Digunakan di Dashboard untuk mengarahkan pengguna ke 6 fitur utama AmanAkses. Grid responsif: 3-up desktop, 2-up tablet, 1-up mobile.

_Avoid_: "menu card", "nav card", "feature tile"

---

## Widget Aksesibilitas
Tombol toggle sekali klik untuk mengaktifkan/menonaktifkan fitur aksesibilitas: Screen Reader, Catatan Suara, Bahasa Isyarat, dan Kontras Tinggi. State dikelola secara global agar efeknya terasa di seluruh halaman.

_Avoid_: "accessibility toggle", "a11y button", "settings widget"

---

## Kartu Darurat
Kartu dengan border merah 2px yang berisi tombol "Telepon Darurat 112" (`tel:112`) dan link ke layanan darurat lainnya. Ditempatkan di bagian bawah Dashboard sebagai akses cepat dalam situasi krisis. Mengikuti prinsip Trauma-Informed Design: selalu terlihat, selalu bisa dijangkau.

_Avoid_: "emergency button", "panic card", "SOS card"

---

## Segera Hadir
Label yang ditampilkan di halaman-halaman Fase 2 (placeholder) untuk menginformasikan bahwa fitur belum tersedia. Semua Feature Card tetap bisa diklik — status placeholder hanya ditunjukkan di halaman tujuan, bukan di Dashboard.

_Avoid_: "coming soon", "under construction", "WIP"

---

## Ringkasan Data
Tiga kartu statistik di Dashboard yang menampilkan jumlah Catatan Jurnal, Kronologi Tersimpan, dan Fitur Aktif.

_Avoid_: "stats", "dashboard metrics", "counters"

---

## Brankas Bukti / Evidence Vault
Modul penyimpanan aman untuk berkas bukti hukum dan medis. Semua file dienkripsi di sisi klien (E2E). Diakses dengan PIN 6-digit di awal sesi. Berisi Berkas yang terorganisir dalam Kategori.

_Avoid_: "vault", "storage", "file manager"

---

## Berkas / EvidenceFile
Satu file yang disimpan di Brankas Bukti. Memiliki Kategori (Foto/Audio/Chat/Dokumen/Catatan Medis), nama, ukuran, thumbnail, dan status kunci. Dapat ditautkan ke banyak Catatan (many-to-many).

_Avoid_: "file", "evidence", "attachment"

---

## Kategori Berkas / EvidenceCategory
Lima kategori untuk mengorganisir Berkas: Foto, Audio, Chat, Dokumen, dan Catatan Medis. Masing-masing memiliki ikon Lucide dan warna badge yang berbeda.

_Avoid_: "folder", "group", "type"

---

## Panel Keamanan / Security Panel
Panel di sisi kanan halaman Brankas Bukti yang menampilkan: status kunci/terbuka (indikator hijau), PIN (tersembunyi), pengaturan auto-lock, dan tombol "Kunci Sekarang". Selalu terlihat agar pengguna selalu tahu siapa yang bisa mengakses data.

_Avoid_: "security sidebar", "lock panel", "privacy panel"

---

## PIN Brankas / Vault PIN
Kode 6-digit yang digunakan untuk membuka dan mengunci Brankas Bukti. Di-set saat pertama kali mengakses Brankas. Tidak ada recovery — sejalan dengan privasi maksimum. Di-derive menjadi encryption key via PBKDF2.

_Avoid_: "password", "passcode", "unlock code"

---

## Enkripsi Ujung-ke-Ujung (E2E)
Metode enkripsi di mana file dienkripsi di perangkat pengguna sebelum disimpan. Backend tidak dapat membaca isi file. Hanya pengguna dengan PIN yang bisa mendekripsi. Diimplementasikan dengan Web Crypto API (AES-GCM 256-bit).

_Avoid_: "client-side encryption", "local encryption"

---

## Kartu Berkas / VaultFileCard
Kartu individual dalam grid Brankas Bukti. Desain thumbnail dominan: pratinjau di atas, metadata (nama, tanggal, ukuran) di bawah. Saat terkunci: pratinjau blur + ikon kunci overlay. Menampilkan badge "N catatan" jika ditautkan ke Jurnal.

_Avoid_: "file card", "evidence card", "grid item"

---

## Laci Berkas / VaultFileDrawer
Panel geser (slide-out sheet) dari sisi kanan yang menampilkan detail satu Berkas: pratinjau penuh, metadata, catatan terkait, dan tombol aksi (Unduh, Ganti Nama, Hapus, Tautkan Catatan). Konsisten dengan pola Lembar Catatan.

_Avoid_: "file detail", "preview panel", "file sheet"

---

## Pendamping Tepercaya / Trusted Companion
Modul pengelolaan kontak pendukung — mencakup Pendamping Personal (orang terdekat pengguna) dan Penyedia Layanan Dukungan (lembaga formal yang dikurasi). Pengguna menyimpan kontak, mengontrol Izin Akses per modul, dan menghubungi pendamping via deep link WhatsApp/Telepon.

_Avoid_: "trusted contacts", "support network", "companion module"

---

## Pendamping Personal / Personal Companion
Kontak individu yang ditambahkan pengguna secara manual — misalnya Sahabat, Kakak, Orang Tua, atau Pasangan. Dikelola penuh oleh pengguna: tambah, edit, hapus, dan atur Izin Akses. Disimpan di localStorage.

_Avoid_: "personal contact", "friend", "family contact"

---

## Penyedia Layanan Dukungan / Service Provider
Lembaga atau layanan formal yang sudah dikurasi oleh tim AmanAkses dan ditampilkan sebagai katalog statis. Contoh: Satgas PPKS, LBH, Komnas Perempuan, SAPA 129. Pengguna tidak bisa menambah atau mengubah — hanya melihat dan menghubungi. Memiliki kategori: Hotline, Satgas PPKS, Bantuan Hukum, Psikolog, Layanan Sosial.

_Avoid_: "service", "institution", "organization", "provider"

---

## Izin Akses / Module Access
Kontrol yang diberikan pengguna kepada Pendamping Personal untuk mengakses modul AmanAkses tertentu. Berbentuk checkbox per modul: Jurnal Aman, Kronologi Kejadian, Brankas Bukti. Di Fase 2, izin bersifat metadata (belum ada enforcement). Dikelola melalui Lembar Pendamping.

_Avoid_: "permission", "access right", "sharing setting"

---

## Katalog Penyedia Layanan / Service Provider Catalog
Daftar statis Penyedia Layanan Dukungan dalam file `lib/companion-catalog.ts`. Dikurasi oleh tim AmanAkses, berisi nama, kategori, kontak, alamat, jam operasional, dan status ketersediaan. Ditampilkan sebagai list baris dengan filter chip per kategori.

_Avoid_: "provider list", "directory", "service directory"

---

## Kartu Pendamping / CompanionCard
Kartu individual dalam grid Pendamping Personal. Berisi avatar inisial 48x48px, nama, role, chip Izin Akses, dan tombol "Hubungi Sekarang". Menggunakan komponen `companion-card` dari DESIGN.md. Grid responsif: 3-up desktop, 2-up tablet, 1-up mobile.

_Avoid_: "contact card", "person card", "friend card"

---

## Lembar Pendamping / CompanionSheet
Panel geser (slide-out sheet) dari sisi kanan yang berisi formulir untuk menambah atau mengedit Pendamping Personal. Field: Nama, Role (dropdown + custom), Nomor WA/Telepon, Catatan, dan checkbox Izin Akses. Konsisten dengan pola Lembar Catatan dan Laci Berkas.

_Avoid_: "companion form", "contact editor", "add dialog"

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

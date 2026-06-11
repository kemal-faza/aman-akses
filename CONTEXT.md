# CONTEXT.md — AmanAkses Domain Glossary

Glossary istilah yang digunakan dalam proyek AmanAkses. Tidak mengandung detail implementasi.

---

## Kronologi / Timeline
Urutan kejadian yang disusun dari catatan jurnal pengguna, diurutkan berdasarkan waktu. Dibantu AI (Kronologi Builder) untuk menyusun, tapi pengguna tetap bisa mengedit dan meninjau sebelum disimpan.

_Avoid_: "history", "log", "feed"

---

## Catatan / JournalEntry
Entri jurnal pengguna di modul Jurnal Aman. Berisi tanggal, judul, isi (terenkripsi), mood opsional, dan tags. Menjadi sumber data untuk Kronologi Builder.

_Avoid_: "note" (generik), "post", "entry" (ambigu)

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

import type { JournalNote, TimelineRequest, TimelineResponse } from "./types"

export const mockJournalNotes: JournalNote[] = [
  {
    id: "note-1",
    date: "2024-01-15",
    title: "Kejadian di ruang kelas A",
    content:
      "Hari ini saya berada di ruang kelas A untuk pelajaran matematika. Seorang teman sekelas mendekati saya dan membuat komentar yang membuat saya tidak nyaman. Dia terus menerus berkomentar tentang penampilan saya meskipun saya sudah memintanya untuk berhenti.",
    tags: ["pelecehan verbal", "sekolah"],
  },
  {
    id: "note-2",
    date: "2024-01-20",
    title: "Pesan tidak pantas di WhatsApp",
    content:
      "Seseorang dari kelas mengirimkan pesan WhatsApp yang berisi konten tidak pantas. Saya merasa takut dan tidak tahu harus melapor ke siapa. Saya screenshot pesannya sebagai bukti.",
    tags: ["pelecehan online", "whatsapp"],
  },
  {
    id: "note-3",
    date: "2024-02-01",
    title: "Bertemu guru BK",
    content:
      "Saya akhirnya memberanikan diri untuk bertemu dengan guru BK. Saya menceritakan apa yang terjadi di kelas dan pesan WhatsApp. Beliau mendengarkan dengan baik dan memberikan dukungan.",
    tags: ["dukungan", "guru BK"],
  },
  {
    id: "note-4",
    date: "2024-02-05",
    title: "Kejadian di kantin",
    content:
      "Pelaku mendekati saya lagi di kantin saat istirahat. Kali ini dia mencoba menyentuh lengan saya. Saya langsung menjauh dan ditemani oleh teman saya.",
    tags: ["pelecehan fisik", "kantin"],
  },
  {
    id: "note-5",
    date: "2024-02-10",
    title: "Diskusi dengan orang tua",
    content:
      "Saya menceritakan semuanya ke orang tua saya. Mereka sangat mendukung dan akan membantu saya menghadapi situasi ini. Kami memutuskan untuk melapor ke pihak sekolah.",
    tags: ["dukungan", "keluarga"],
  },
]

export function generateMockTimelineResponse(
  request: TimelineRequest,
): TimelineResponse {
  const selectedIds = new Set(request.notes.map((n) => n.id))

  const timeline = [
    {
      id: "timeline-1",
      date: "2024-01-15",
      time: "10:00",
      location: "Ruang Kelas A",
      title: "Komentar tidak pantas di ruang kelas",
      description:
        "Seorang teman sekelas berulang kali memberikan komentar tentang penampilan yang membuat tidak nyaman. Pengguna sudah meminta untuk berhenti namun tidak diindahkan.",
      sourceNoteIds: ["note-1"],
      aiConfidence: "high" as const,
    },
    {
      id: "timeline-2",
      date: "2024-01-20",
      time: "21:30",
      location: null,
      title: "Pesan WhatsApp tidak pantas",
      description:
        "Pengguna menerima pesan WhatsApp berisi konten tidak pantas dari orang yang sama. Pengguna menyimpan screenshot sebagai bukti.",
      sourceNoteIds: ["note-2"],
      aiConfidence: "high" as const,
    },
    {
      id: "timeline-3",
      date: "2024-02-01",
      time: "13:00",
      location: "Ruang BK",
      title: "Bertemu guru BK untuk melaporkan kejadian",
      description:
        "Pengguna melaporkan kejadian pelecehan verbal dan online kepada guru BK. Guru BK mendengarkan dan memberikan dukungan awal.",
      sourceNoteIds: ["note-3"],
      aiConfidence: "high" as const,
    },
    {
      id: "timeline-4",
      date: "2024-02-05",
      time: "12:15",
      location: "Kantin Sekolah",
      title: "Upaya kontak fisik di kantin",
      description:
        "Pelaku mencoba menyentuh lengan pengguna di kantin. Pengguna segera menjauh dan mendapat pendampingan dari teman.",
      sourceNoteIds: ["note-4"],
      aiConfidence: "medium" as const,
    },
    {
      id: "timeline-5",
      date: "2024-02-10",
      time: "19:00",
      location: "Rumah",
      title: "Diskusi dengan orang tua dan keputusan melapor",
      description:
        "Pengguna menceritakan seluruh kejadian kepada orang tua. Keluarga memutuskan untuk mendampingi pelaporan resmi ke pihak sekolah.",
      sourceNoteIds: ["note-5"],
      aiConfidence: "high" as const,
    },
  ]

  // Filter timeline items to only those sourced from selected notes
  const filteredTimeline = timeline.filter((item) =>
    item.sourceNoteIds.some((sid) => selectedIds.has(sid)),
  )

  return {
    timeline: filteredTimeline,
    summary:
      "Berdasarkan catatan jurnal Anda, teridentifikasi rangkaian kejadian yang dimulai pada 15 Januari 2024 dengan komentar tidak pantas di ruang kelas, berlanjut ke pesan WhatsApp tidak pantas pada 20 Januari, upaya kontak fisik di kantin pada 5 Februari, serta langkah-langkah pelaporan ke guru BK dan orang tua. Pola menunjukkan eskalasi dari pelecehan verbal ke upaya kontak fisik.",
    aiWarnings: [
      "AI hanya membantu menyusun kronologi — semua informasi perlu ditinjau ulang oleh Anda.",
      "Beberapa detail waktu bersifat perkiraan berdasarkan konteks catatan.",
    ],
  }
}

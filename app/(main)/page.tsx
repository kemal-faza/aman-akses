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

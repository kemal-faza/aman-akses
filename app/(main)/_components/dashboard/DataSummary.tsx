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

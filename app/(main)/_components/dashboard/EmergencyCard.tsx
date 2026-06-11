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
          Lihat layanan darurat lainnya
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

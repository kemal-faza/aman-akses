import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DataSummary } from "@/app/(main)/_components/dashboard/DataSummary";

describe("DataSummary", () => {
  const stats = {
    journalCount: 5,
    kronologiCount: 1,
    activeFeatures: 2,
    totalFeatures: 6,
  };

  it("renders journal count with aria-label", () => {
    render(<DataSummary stats={stats} />);
    const el = screen.getByLabelText("5 catatan jurnal");
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent("5");
  });

  it("renders kronologi count with aria-label", () => {
    render(<DataSummary stats={stats} />);
    const el = screen.getByLabelText("1 kronologi tersimpan");
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent("1");
  });

  it("renders active features count with aria-label", () => {
    render(<DataSummary stats={stats} />);
    const el = screen.getByLabelText("2 dari 6 fitur aktif");
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent("2/6");
  });

  it("renders 3 stat labels", () => {
    render(<DataSummary stats={stats} />);
    expect(screen.getByText("Catatan Jurnal")).toBeInTheDocument();
    expect(screen.getByText("Kronologi Tersimpan")).toBeInTheDocument();
    expect(screen.getByText("Fitur Aktif")).toBeInTheDocument();
  });

  it("handles zero counts", () => {
    render(
      <DataSummary
        stats={{ journalCount: 0, kronologiCount: 0, activeFeatures: 0, totalFeatures: 6 }}
      />,
    );
    expect(screen.getByLabelText("0 catatan jurnal")).toBeInTheDocument();
    expect(screen.getByLabelText("0 kronologi tersimpan")).toBeInTheDocument();
    expect(screen.getByLabelText("0 dari 6 fitur aktif")).toBeInTheDocument();
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AccessibilityProvider } from "@/lib/accessibility-context";
import DashboardPage from "@/app/(main)/page";

function renderDashboard() {
  return render(
    <AccessibilityProvider>
      <DashboardPage />
    </AccessibilityProvider>,
  );
}

describe("DashboardPage", () => {
  it("renders all 5 sections in order", () => {
    renderDashboard();

    // Hero Banner
    expect(
      screen.getByRole("heading", { level: 1, name: "Kamu tidak sendirian" }),
    ).toBeInTheDocument();

    // Data Summary
    expect(screen.getByText("Catatan Jurnal")).toBeInTheDocument();
    expect(screen.getByText("Kronologi Tersimpan")).toBeInTheDocument();
    expect(screen.getByText("Fitur Aktif")).toBeInTheDocument();

    // Feature Cards heading
    expect(
      screen.getByRole("heading", { level: 2, name: "Akses Cepat Fitur" }),
    ).toBeInTheDocument();

    // Accessibility Widgets heading
    expect(
      screen.getByRole("heading", { level: 2, name: "Aksesibilitas" }),
    ).toBeInTheDocument();

    // Emergency Card
    expect(
      screen.getByRole("heading", { level: 2, name: "Butuh bantuan segera?" }),
    ).toBeInTheDocument();
  });

  it("renders 6 feature cards", () => {
    renderDashboard();
    const links = screen.getAllByText(/Pelajari lebih lanjut/);
    expect(links.length).toBe(6);
  });

  it("renders 4 accessibility toggles", () => {
    renderDashboard();
    const switches = screen.getAllByRole("switch");
    expect(switches.length).toBe(4);
  });

  it("renders emergency call button", () => {
    renderDashboard();
    const btn = screen.getByRole("button", { name: "Telepon Darurat 112" });
    expect(btn).toBeInTheDocument();
  });
});

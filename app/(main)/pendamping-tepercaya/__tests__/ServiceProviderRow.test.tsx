import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ServiceProviderRow } from "../_components/ServiceProviderRow";
import type { ServiceProvider } from "@/lib/companion-types";

const mockProvider: ServiceProvider = {
  id: "satgas-ppks-unhas",
  name: "Satgas PPKS Unhas",
  category: "satgas-ppks",
  description: "Satuan Tugas PPKS",
  phone: "0811223344",
  waNumber: "0811223344",
  email: null,
  website: null,
  address: "Kampus Tamalanrea",
  operatingHours: "Senin-Jumat, 08:00-16:00",
  isAvailable: true,
  icon: "Shield",
};

describe("ServiceProviderRow", () => {
  it("renders provider name", () => {
    render(<ServiceProviderRow provider={mockProvider} />);
    expect(screen.getByText("Satgas PPKS Unhas")).toBeInTheDocument();
  });

  it("renders description and address", () => {
    render(<ServiceProviderRow provider={mockProvider} />);
    expect(screen.getByText(/Satuan Tugas PPKS/)).toBeInTheDocument();
    expect(screen.getByText(/Kampus Tamalanrea/)).toBeInTheDocument();
  });

  it("renders 'Tersedia' badge when available", () => {
    render(<ServiceProviderRow provider={mockProvider} />);
    expect(screen.getByText("Tersedia")).toBeInTheDocument();
  });

  it("renders 'Tutup' badge when not available", () => {
    const unavailable = { ...mockProvider, isAvailable: false };
    render(<ServiceProviderRow provider={unavailable} />);
    expect(screen.getByText("Tutup")).toBeInTheDocument();
  });

  it("has accessible Hubungi button", () => {
    render(<ServiceProviderRow provider={mockProvider} />);
    const btn = screen.getByRole("button", { name: /Hubungi Satgas PPKS Unhas/i });
    expect(btn).toBeInTheDocument();
  });

  it("opens WhatsApp link when waNumber exists", async () => {
    const user = userEvent.setup();
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<ServiceProviderRow provider={mockProvider} />);
    await user.click(screen.getByRole("button", { name: /Hubungi/ }));
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining("wa.me/62"),
      "_blank"
    );
    openSpy.mockRestore();
  });
});

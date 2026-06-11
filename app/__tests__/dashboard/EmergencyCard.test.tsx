import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmergencyCard } from "@/app/(main)/_components/dashboard/EmergencyCard";

describe("EmergencyCard", () => {
  beforeEach(() => {
    render(<EmergencyCard />);
  });

  it("renders emergency heading", () => {
    expect(
      screen.getByRole("heading", { name: "Butuh bantuan segera?" }),
    ).toBeInTheDocument();
  });

  it("renders supporting message", () => {
    expect(
      screen.getByText(/Anda tidak sendirian/),
    ).toBeInTheDocument();
  });

  it("renders tel:112 button", () => {
    const btn = screen.getByRole("link", { name: "Telepon Darurat 112" });
    expect(btn).toHaveAttribute("href", "tel:112");
  });

  it("renders link to other emergency services", () => {
    const link = screen.getByRole("link", {
      name: "Lihat layanan darurat lainnya",
    });
    expect(link).toBeInTheDocument();
  });

  it("has emergency red border", () => {
    const card = document.querySelector("section");
    expect(card?.className).toContain("border-emergency");
  });
});

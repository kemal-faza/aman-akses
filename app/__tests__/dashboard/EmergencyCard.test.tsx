import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("renders call button", () => {
    const btn = screen.getByRole("button", { name: "Telepon Darurat 112" });
    expect(btn).toBeInTheDocument();
  });

  it("shows confirmation dialog when call button is clicked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Telepon Darurat 112" }));
    expect(screen.getByText("Hubungi darurat?")).toBeInTheDocument();
    expect(
      screen.getByText(/Anda akan menghubungi layanan darurat/),
    ).toBeInTheDocument();
  });

  it("confirmation dialog has Batal and confirm buttons", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Telepon Darurat 112" }));
    expect(screen.getByRole("button", { name: "Batal" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ya, Hubungi 112" })).toBeInTheDocument();
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

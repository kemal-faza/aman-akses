import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompanionCard } from "../_components/CompanionCard";
import type { TrustedContact } from "@/lib/companion-types";

const mockContact: TrustedContact = {
  id: "c1",
  name: "Ayu Rahma",
  role: "friend",
  phone: "081234567890",
  permissions: ["journal", "timeline"],
  notes: "Teman dekat sejak SMA",
  createdAt: "2026-06-01T00:00:00.000Z",
  updatedAt: "2026-06-01T00:00:00.000Z",
};

describe("CompanionCard", () => {
  it("renders contact name", () => {
    render(<CompanionCard contact={mockContact} onClick={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Ayu Rahma")).toBeInTheDocument();
  });

  it("renders role label", () => {
    render(<CompanionCard contact={mockContact} onClick={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Sahabat")).toBeInTheDocument();
  });

  it("renders permission chips", () => {
    render(<CompanionCard contact={mockContact} onClick={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Jurnal Aman")).toBeInTheDocument();
    expect(screen.getByText("Kronologi Kejadian")).toBeInTheDocument();
  });

  it("shows no permission chips when permissions is empty", () => {
    const contact = { ...mockContact, permissions: [] };
    render(<CompanionCard contact={contact} onClick={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.queryByText("Jurnal Aman")).not.toBeInTheDocument();
  });

  it("renders avatar initials from name", () => {
    render(<CompanionCard contact={mockContact} onClick={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("AR")).toBeInTheDocument();
  });

  it("calls onClick when card is clicked", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<CompanionCard contact={mockContact} onClick={onClick} onDelete={vi.fn()} />);
    await user.click(screen.getByText("Ayu Rahma"));
    expect(onClick).toHaveBeenCalledWith("c1");
  });

  it("calls onDelete when delete button is clicked", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<CompanionCard contact={mockContact} onClick={vi.fn()} onDelete={onDelete} />);
    const deleteBtn = screen.getByLabelText("Hapus Ayu Rahma");
    await user.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith("c1");
  });

  it("has accessible button label for Hubungi", () => {
    render(<CompanionCard contact={mockContact} onClick={vi.fn()} onDelete={vi.fn()} />);
    const hubungiBtn = screen.getByRole("button", { name: /Hubungi Ayu Rahma/i });
    expect(hubungiBtn).toBeInTheDocument();
  });
});

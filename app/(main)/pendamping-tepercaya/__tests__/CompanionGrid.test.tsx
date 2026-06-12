import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompanionGrid } from "../_components/CompanionGrid";
import type { TrustedContact } from "@/lib/companion-types";

const contacts: TrustedContact[] = [
  {
    id: "c1", name: "Ayu Rahma", role: "friend", phone: "08123",
    permissions: ["journal"], notes: "", createdAt: "2026-06-01T00:00:00.000Z",
    updatedAt: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "c2", name: "Budi Darma", role: "sibling", phone: "08567",
    permissions: [], notes: "", createdAt: "2026-06-02T00:00:00.000Z",
    updatedAt: "2026-06-02T00:00:00.000Z",
  },
];

describe("CompanionGrid", () => {
  it("renders all contacts as cards", () => {
    render(
      <CompanionGrid contacts={contacts} onSelect={vi.fn()} onDelete={vi.fn()} onAdd={vi.fn()} />
    );
    expect(screen.getByText("Ayu Rahma")).toBeInTheDocument();
    expect(screen.getByText("Budi Darma")).toBeInTheDocument();
  });

  it("renders add card as last item", () => {
    render(
      <CompanionGrid contacts={contacts} onSelect={vi.fn()} onDelete={vi.fn()} onAdd={vi.fn()} />
    );
    expect(screen.getByText("Tambah Pendamping")).toBeInTheDocument();
  });

  it("calls onAdd when add card is clicked", async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(
      <CompanionGrid contacts={contacts} onSelect={vi.fn()} onDelete={vi.fn()} onAdd={onAdd} />
    );
    await user.click(screen.getByText("Tambah Pendamping"));
    expect(onAdd).toHaveBeenCalled();
  });

  it("shows empty state when no contacts", () => {
    render(
      <CompanionGrid contacts={[]} onSelect={vi.fn()} onDelete={vi.fn()} onAdd={vi.fn()} />
    );
    expect(screen.getByText(/Belum ada pendamping/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Tambah Pendamping/i })).toBeInTheDocument();
  });
});

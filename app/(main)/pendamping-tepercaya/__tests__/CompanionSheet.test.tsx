import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompanionSheet } from "../_components/CompanionSheet";
import { CompanionProvider } from "@/lib/companion-context";
import type { TrustedContact } from "@/lib/companion-types";
import React from "react";

const mockContact: TrustedContact = {
  id: "c1",
  name: "Ayu Rahma",
  role: "friend",
  phone: "081234567890",
  permissions: ["journal"],
  notes: "Teman dekat",
  createdAt: "2026-06-01T00:00:00.000Z",
  updatedAt: "2026-06-01T00:00:00.000Z",
};

function wrapper({ children }: { children: React.ReactNode }) {
  return <CompanionProvider>{children}</CompanionProvider>;
}

describe("CompanionSheet", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders add mode with empty fields", () => {
    render(
      <CompanionSheet mode="add" contact={null} open={true} onClose={vi.fn()} />,
      { wrapper }
    );
    expect(screen.getByText("Tambah Pendamping")).toBeInTheDocument();
    expect(screen.getByLabelText("Nama")).toHaveValue("");
    expect(screen.getByLabelText("Nomor WA / Telepon")).toHaveValue("");
  });

  it("renders edit mode with pre-filled fields", () => {
    render(
      <CompanionSheet mode="edit" contact={mockContact} open={true} onClose={vi.fn()} />,
      { wrapper }
    );
    expect(screen.getByText("Edit Pendamping")).toBeInTheDocument();
    expect(screen.getByLabelText("Nama")).toHaveValue("Ayu Rahma");
    expect(screen.getByLabelText("Nomor WA / Telepon")).toHaveValue("081234567890");
    const journalCheckbox = screen.getByRole("checkbox", { name: /Jurnal Aman/i }) as HTMLInputElement;
    const kronologiCheckbox = screen.getByRole("checkbox", { name: /Kronologi Kejadian/i }) as HTMLInputElement;
    expect(journalCheckbox).toBeChecked();
    expect(kronologiCheckbox).not.toBeChecked();
  });

  it("shows validation error when name is empty", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <CompanionSheet mode="add" contact={null} open={true} onClose={onClose} />,
      { wrapper }
    );

    await user.type(screen.getByLabelText("Nomor WA / Telepon"), "081234567890");
    await user.click(screen.getByText("Simpan"));

    expect(screen.getByText("Nama pendamping wajib diisi.")).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("shows validation error when phone is too short", async () => {
    const user = userEvent.setup();
    render(
      <CompanionSheet mode="add" contact={null} open={true} onClose={vi.fn()} />,
      { wrapper }
    );

    await user.type(screen.getByLabelText("Nama"), "Ayu Rahma");
    await user.type(screen.getByLabelText("Nomor WA / Telepon"), "123");
    await user.click(screen.getByText("Simpan"));

    expect(screen.getByText(/minimal 8 digit/)).toBeInTheDocument();
  });

  it("shows custom role input when role is 'other'", async () => {
    const user = userEvent.setup();
    render(
      <CompanionSheet mode="add" contact={null} open={true} onClose={vi.fn()} />,
      { wrapper }
    );

    const roleSelect = screen.getByLabelText("Hubungan / Peran");
    await user.selectOptions(roleSelect, "other");

    expect(screen.getByLabelText("Hubungan Lainnya")).toBeInTheDocument();
  });

  it("calls onClose when Batal is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <CompanionSheet mode="add" contact={null} open={true} onClose={onClose} />,
      { wrapper }
    );
    await user.click(screen.getByText("Batal"));
    expect(onClose).toHaveBeenCalled();
  });
});

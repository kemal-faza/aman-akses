import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JournalSheet } from "@/app/(main)/_components/journal/JournalSheet";
import type { JournalEntryInput } from "@/lib/types";

describe("JournalSheet", () => {
  it("renders create mode with empty form", () => {
    render(
      <JournalSheet
        open={true}
        onOpenChange={() => {}}
        mode="create"
        onSave={() => Promise.resolve()}
      />
    );
    expect(screen.getByText("Catatan Baru")).toBeInTheDocument();
    expect(screen.getByLabelText("Tanggal Kejadian")).toBeInTheDocument();
    expect(screen.getByLabelText("Apa yang terjadi?")).toBeInTheDocument();
  });

  it("renders edit mode with pre-filled data", () => {
    render(
      <JournalSheet
        open={true}
        onOpenChange={() => {}}
        mode="edit"
        entry={{
          id: "test-1",
          date: "2026-06-12",
          title: "Judul lama",
          content: "Konten lama",
          mood: "sedih",
          involvedParties: "Orang A",
          tags: ["kerja"],
          createdAt: "",
          updatedAt: "",
        }}
        onSave={() => Promise.resolve()}
      />
    );
    expect(screen.getByText("Edit Catatan")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Konten lama")).toBeInTheDocument();
  });

  it("shows validation error when content is empty on save", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(
      <JournalSheet
        open={true}
        onOpenChange={() => {}}
        mode="create"
        onSave={onSave}
      />
    );
    await user.click(screen.getByRole("button", { name: /Simpan/ }));
    expect(screen.getByText(/Deskripsi kejadian wajib diisi/)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("shows validation error when date is empty on save", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(
      <JournalSheet
        open={true}
        onOpenChange={() => {}}
        mode="create"
        onSave={onSave}
      />
    );
    await user.type(screen.getByLabelText("Apa yang terjadi?"), "Deskripsi kejadian");
    await user.click(screen.getByRole("button", { name: /Simpan/ }));
    expect(screen.getByText(/Tanggal wajib diisi/)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("calls onSave with form data when valid", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(
      <JournalSheet
        open={true}
        onOpenChange={() => {}}
        mode="create"
        onSave={onSave}
      />
    );
    await user.type(screen.getByLabelText("Apa yang terjadi?"), "Deskripsi kejadian");
    await user.type(screen.getByLabelText("Siapa yang terlibat?"), "Orang X");
    
    // Set date
    const dateInput = screen.getByLabelText("Tanggal Kejadian");
    await user.clear(dateInput);
    await user.type(dateInput, "2026-06-12");
    
    // Set mood
    await user.click(screen.getByLabelText("Sedih"));
    
    // Add tag
    const tagInput = screen.getByPlaceholderText("Tambah tag...");
    await user.type(tagInput, "kerja");
    await user.keyboard("{Enter}");
    
    await user.click(screen.getByRole("button", { name: /Simpan/ }));
    
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Deskripsi kejadian", // derived from first line of content
        content: "Deskripsi kejadian",
        mood: "sedih",
        involvedParties: "Orang X",
        tags: ["kerja"],
      })
    );
  });
});

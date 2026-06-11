import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JournalList } from "@/app/(main)/_components/journal/JournalList";
import type { JournalNote } from "@/lib/types";

const mockEntries: JournalNote[] = [
  {
    id: "1",
    date: "2026-06-12",
    title: "Hari yang berat",
    content: "Hari ini terjadi sesuatu yang membuat saya tidak nyaman di kantor.",
    mood: "sedih",
    involvedParties: "Rekan kerja",
    tags: ["kerja", "pelecehan"],
    createdAt: "2026-06-12T10:00:00.000Z",
    updatedAt: "2026-06-12T10:00:00.000Z",
  },
  {
    id: "2",
    date: "2026-06-10",
    title: "Obrolan dengan teman",
    content: "Saya cerita ke teman dekat dan dia sangat mendukung.",
    mood: "baik",
    involvedParties: "Teman",
    tags: ["dukungan"],
    createdAt: "2026-06-10T14:00:00.000Z",
    updatedAt: "2026-06-10T14:00:00.000Z",
  },
];

describe("JournalList", () => {
  it("renders entry cards with title and truncated content", () => {
    render(
      <JournalList
        entries={mockEntries}
        loading={false}
        error={null}
        onDelete={() => {}}
        onNewEntry={() => {}}
        onEditEntry={() => {}}
      />
    );
    expect(screen.getByText("Hari yang berat")).toBeInTheDocument();
    expect(screen.getByText(/Hari ini terjadi sesuatu/)).toBeInTheDocument();
  });

  it("renders mood icon when mood is set", () => {
    render(
      <JournalList
        entries={mockEntries}
        loading={false}
        error={null}
        onDelete={() => {}}
        onNewEntry={() => {}}
        onEditEntry={() => {}}
      />
    );
    expect(screen.getByText("Sedih")).toBeInTheDocument();
  });

  it("renders tags as badges", () => {
    render(
      <JournalList
        entries={mockEntries}
        loading={false}
        error={null}
        onDelete={() => {}}
        onNewEntry={() => {}}
        onEditEntry={() => {}}
      />
    );
    expect(screen.getByText("kerja")).toBeInTheDocument();
    expect(screen.getByText("pelecehan")).toBeInTheDocument();
  });

  it("shows empty state when no entries", () => {
    render(
      <JournalList
        entries={[]}
        loading={false}
        error={null}
        onDelete={() => {}}
        onNewEntry={() => {}}
        onEditEntry={() => {}}
      />
    );
    expect(screen.getByText(/Belum ada catatan/)).toBeInTheDocument();
  });

  it("renders skeleton cards when loading", () => {
    render(
      <JournalList
        entries={[]}
        loading={true}
        error={null}
        onDelete={() => {}}
        onNewEntry={() => {}}
        onEditEntry={() => {}}
      />
    );
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("calls onNewEntry when CTA button clicked in empty state", async () => {
    const user = userEvent.setup();
    const onNew = vi.fn();
    render(
      <JournalList
        entries={[]}
        loading={false}
        error={null}
        onDelete={() => {}}
        onNewEntry={onNew}
        onEditEntry={() => {}}
      />
    );
    await user.click(screen.getByRole("button", { name: /Tulis Catatan Pertama/ }));
    expect(onNew).toHaveBeenCalled();
  });

  it("calls onDelete when delete button clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <JournalList
        entries={mockEntries}
        loading={false}
        error={null}
        onDelete={onDelete}
        onNewEntry={() => {}}
        onEditEntry={() => {}}
      />
    );
    const deleteButtons = screen.getAllByLabelText("Hapus catatan");
    await user.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("calls onEditEntry when entry card clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(
      <JournalList
        entries={mockEntries}
        loading={false}
        error={null}
        onDelete={() => {}}
        onNewEntry={() => {}}
        onEditEntry={onEdit}
      />
    );
    await user.click(screen.getByText("Hari yang berat"));
    expect(onEdit).toHaveBeenCalledWith("1");
  });
});

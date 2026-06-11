import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TimelineCard } from "@/app/(main)/kronologi/_components/TimelineCard"
import type { TimelineItem } from "@/lib/types"

const mockItem: TimelineItem = {
  id: "t1",
  date: "2024-01-15",
  time: "10:00",
  location: "Ruang Kelas A",
  title: "Test Kejadian",
  description: "Deskripsi test kejadian",
  sourceNoteIds: ["note-1", "note-2"],
  aiConfidence: "high",
}

describe("TimelineCard", () => {
  it("renders draft state with Draft AI badge", () => {
    render(
      <TimelineCard
        item={mockItem}
        status="draft"
        editedData={null}
        onAccept={vi.fn()}
        onReject={vi.fn()}
        onEdit={vi.fn()}
        onUndo={vi.fn()}
        onSaveEdit={vi.fn()}
        onCancelEdit={vi.fn()}
      />,
    )
    expect(screen.getByText("Draft AI")).toBeDefined()
    expect(screen.getByText("Terima")).toBeDefined()
    expect(screen.getByText("Edit")).toBeDefined()
    expect(screen.getByText("Tolak")).toBeDefined()
  })

  it("renders accepted state with Diterima badge", () => {
    render(
      <TimelineCard
        item={mockItem}
        status="accepted"
        editedData={null}
        onAccept={vi.fn()}
        onReject={vi.fn()}
        onEdit={vi.fn()}
        onUndo={vi.fn()}
        onSaveEdit={vi.fn()}
        onCancelEdit={vi.fn()}
      />,
    )
    expect(screen.getByText("Diterima")).toBeDefined()
  })

  it("renders rejected state with Ditolak badge", () => {
    render(
      <TimelineCard
        item={mockItem}
        status="rejected"
        editedData={null}
        onAccept={vi.fn()}
        onReject={vi.fn()}
        onEdit={vi.fn()}
        onUndo={vi.fn()}
        onSaveEdit={vi.fn()}
        onCancelEdit={vi.fn()}
      />,
    )
    expect(screen.getByText("Ditolak")).toBeDefined()
  })

  it("shows left border stripe in warning color for draft", () => {
    const { container } = render(
      <TimelineCard
        item={mockItem}
        status="draft"
        editedData={null}
        onAccept={vi.fn()}
        onReject={vi.fn()}
        onEdit={vi.fn()}
        onUndo={vi.fn()}
        onSaveEdit={vi.fn()}
        onCancelEdit={vi.fn()}
      />,
    )
    const card = container.firstElementChild!
    // Use border-l-warning class
    expect(card.className).toContain("border-l-warning")
  })

  it("shows source note references", () => {
    render(
      <TimelineCard
        item={mockItem}
        status="draft"
        editedData={null}
        onAccept={vi.fn()}
        onReject={vi.fn()}
        onEdit={vi.fn()}
        onUndo={vi.fn()}
        onSaveEdit={vi.fn()}
        onCancelEdit={vi.fn()}
      />,
    )
    expect(
      screen.getByText(/Sumber: Catatan #1, Catatan #2/),
    ).toBeDefined()
  })
})

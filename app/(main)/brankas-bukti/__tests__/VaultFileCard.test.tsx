import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VaultFileCard } from "../_components/VaultFileCard";
import type { EvidenceFile } from "@/lib/vault-types";

const mockFile: EvidenceFile = {
  id: "f1",
  name: "IMG_20260601.jpg",
  mimeType: "image/jpeg",
  category: "photo",
  sizeBytes: 2_400_000,
  uploadedAt: "2026-06-01",
  source: { type: "upload", method: "drag-drop" },
  linkedNoteIds: ["note-1", "note-2"],
  tags: ["foto"],
  isLocked: false,
};

describe("VaultFileCard", () => {
  it("renders file name", () => {
    render(<VaultFileCard file={mockFile} isLocked={false} onClick={vi.fn()} />);
    expect(screen.getByText("IMG_20260601.jpg")).toBeInTheDocument();
  });

  it("renders formatted size", () => {
    render(<VaultFileCard file={mockFile} isLocked={false} onClick={vi.fn()} />);
    expect(screen.getByText(/2\./)).toBeInTheDocument();
    expect(screen.getByText(/MB/)).toBeInTheDocument();
  });

  it("renders date", () => {
    render(<VaultFileCard file={mockFile} isLocked={false} onClick={vi.fn()} />);
    expect(screen.getByText(/1 Jun/)).toBeInTheDocument();
  });

  it("shows note count badge when linked to journal", () => {
    render(<VaultFileCard file={mockFile} isLocked={false} onClick={vi.fn()} />);
    expect(screen.getByText(/2 catatan/)).toBeInTheDocument();
  });

  it("shows lock indicator when file is locked", () => {
    render(<VaultFileCard file={{ ...mockFile, isLocked: true }} isLocked={true} onClick={vi.fn()} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", expect.stringContaining("terkunci"));
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<VaultFileCard file={mockFile} isLocked={false} onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledWith("f1");
  });

  it("has accessible role and label", () => {
    render(<VaultFileCard file={mockFile} isLocked={false} onClick={vi.fn()} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", expect.stringContaining("IMG_20260601.jpg"));
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VaultFileDrawer } from "../_components/VaultFileDrawer";
import type { EvidenceFile } from "@/lib/vault-types";

const mockFile: EvidenceFile = {
  id: "f1",
  name: "IMG_20260601.jpg",
  mimeType: "image/jpeg",
  category: "photo",
  sizeBytes: 2_400_000,
  uploadedAt: "2026-06-01",
  source: { type: "upload", method: "drag-drop" },
  linkedNoteIds: ["note-1"],
  tags: ["foto", "visum"],
  isLocked: false,
};

describe("VaultFileDrawer", () => {
  it("renders file name in drawer", () => {
    render(
      <VaultFileDrawer
        file={mockFile}
        open={true}
        onOpenChange={vi.fn()}
        onDelete={vi.fn()}
        onRename={vi.fn()}
        onDownload={vi.fn()}
        onLinkNote={vi.fn()}
      />
    );
    expect(screen.getByText("IMG_20260601.jpg")).toBeInTheDocument();
  });

  it("renders metadata", () => {
    render(
      <VaultFileDrawer
        file={mockFile}
        open={true}
        onOpenChange={vi.fn()}
        onDelete={vi.fn()}
        onRename={vi.fn()}
        onDownload={vi.fn()}
        onLinkNote={vi.fn()}
      />
    );
    expect(screen.getByText(/2\.3 MB/)).toBeInTheDocument();
    expect(screen.getByText("1 Jun 2026")).toBeInTheDocument();
  });

  it("renders tags", () => {
    render(
      <VaultFileDrawer
        file={mockFile}
        open={true}
        onOpenChange={vi.fn()}
        onDelete={vi.fn()}
        onRename={vi.fn()}
        onDownload={vi.fn()}
        onLinkNote={vi.fn()}
      />
    );
    expect(screen.getByText("foto")).toBeInTheDocument();
    expect(screen.getByText("visum")).toBeInTheDocument();
  });

  it("renders linked notes section", () => {
    render(
      <VaultFileDrawer
        file={mockFile}
        open={true}
        onOpenChange={vi.fn()}
        onDelete={vi.fn()}
        onRename={vi.fn()}
        onDownload={vi.fn()}
        onLinkNote={vi.fn()}
      />
    );
    expect(screen.getByText(/1 catatan terkait/)).toBeInTheDocument();
  });
});

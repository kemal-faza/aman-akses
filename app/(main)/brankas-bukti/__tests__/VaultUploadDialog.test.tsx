import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VaultUploadDialog } from "../_components/VaultUploadDialog";

describe("VaultUploadDialog", () => {
  it("renders three tabs: Upload, Capture, Jurnal", () => {
    render(
      <VaultUploadDialog
        open={true}
        onOpenChange={vi.fn()}
        onUpload={vi.fn()}
      />
    );
    expect(screen.getByRole("tab", { name: "Upload" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Capture" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Jurnal" })).toBeInTheDocument();
  });

  it("shows drag-drop zone on Upload tab", () => {
    render(
      <VaultUploadDialog
        open={true}
        onOpenChange={vi.fn()}
        onUpload={vi.fn()}
      />
    );
    expect(screen.getByText(/Klik atau seret ke sini/i)).toBeInTheDocument();
  });

  it("shows capture buttons on Capture tab", async () => {
    const user = userEvent.setup();
    render(
      <VaultUploadDialog
        open={true}
        onOpenChange={vi.fn()}
        onUpload={vi.fn()}
      />
    );
    await user.click(screen.getByRole("tab", { name: "Capture" }));
    expect(screen.getByText("Kamera")).toBeInTheDocument();
    expect(screen.getByText("Rekam Audio")).toBeInTheDocument();
    expect(screen.getByText("Chat / Teks")).toBeInTheDocument();
  });
});

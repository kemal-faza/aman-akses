import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompanionDeleteDialog } from "../_components/CompanionDeleteDialog";

describe("CompanionDeleteDialog", () => {
  it("renders contact name in the confirmation text", () => {
    render(
      <CompanionDeleteDialog
        contactName="Ayu Rahma"
        open={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByText(/Ayu Rahma/)).toBeInTheDocument();
    expect(screen.getByText(/dari daftar pendamping/)).toBeInTheDocument();
  });

  it("calls onConfirm when Hapus is clicked", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(
      <CompanionDeleteDialog
        contactName="Ayu Rahma"
        open={true}
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />
    );
    await user.click(screen.getByRole("button", { name: /Hapus, Lanjutkan/ }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("calls onCancel when Batal is clicked", async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(
      <CompanionDeleteDialog
        contactName="Ayu Rahma"
        open={true}
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />
    );
    await user.click(screen.getByRole("button", { name: /Batal/ }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("does not render when open is false", () => {
    render(
      <CompanionDeleteDialog
        contactName="Ayu Rahma"
        open={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.queryByText(/Ayu Rahma/)).not.toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VaultPinDialog } from "../_components/VaultPinDialog";

describe("VaultPinDialog", () => {
  it("renders setup mode when no PIN exists", () => {
    render(
      <VaultPinDialog
        mode="setup"
        error={null}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByRole("heading", { name: /Buat PIN Brankas/i })).toBeInTheDocument();
  });

  it("renders unlock mode", () => {
    render(
      <VaultPinDialog
        mode="unlock"
        error={null}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByText(/Masukkan PIN/i)).toBeInTheDocument();
  });

  it("calls onSubmit with PIN when 6 digits entered", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <VaultPinDialog
        mode="unlock"
        error={null}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />
    );

    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(6);

    await user.type(inputs[0], "1");
    await user.type(inputs[1], "2");
    await user.type(inputs[2], "3");
    await user.type(inputs[3], "4");
    await user.type(inputs[4], "5");
    await user.type(inputs[5], "6");

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith("123456");
    });
  });

  it("shows error message when provided", () => {
    render(
      <VaultPinDialog
        mode="unlock"
        error="PIN tidak sesuai"
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByText("PIN tidak sesuai")).toBeInTheDocument();
  });
});

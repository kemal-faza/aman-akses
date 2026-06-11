import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VaultSecurityPanel } from "../_components/VaultSecurityPanel";

describe("VaultSecurityPanel", () => {
  it("shows unlocked status", () => {
    render(<VaultSecurityPanel isUnlocked={true} autoLockMinutes={5} onLock={vi.fn()} onChangePin={vi.fn()} />);
    expect(screen.getByText("Terbuka")).toBeInTheDocument();
  });

  it("shows locked status", () => {
    render(<VaultSecurityPanel isUnlocked={false} autoLockMinutes={5} onLock={vi.fn()} onChangePin={vi.fn()} />);
    expect(screen.getByText("Terkunci")).toBeInTheDocument();
  });

  it("shows auto-lock setting", () => {
    render(<VaultSecurityPanel isUnlocked={true} autoLockMinutes={5} onLock={vi.fn()} onChangePin={vi.fn()} />);
    expect(screen.getByText("5 menit")).toBeInTheDocument();
  });

  it("calls onLock when Kunci Sekarang clicked", async () => {
    const onLock = vi.fn();
    const user = userEvent.setup();
    render(<VaultSecurityPanel isUnlocked={true} autoLockMinutes={5} onLock={onLock} onChangePin={vi.fn()} />);
    await user.click(screen.getByText("Kunci Sekarang"));
    expect(onLock).toHaveBeenCalled();
  });

  it("calls onChangePin when Ganti PIN clicked", async () => {
    const onChangePin = vi.fn();
    const user = userEvent.setup();
    render(<VaultSecurityPanel isUnlocked={true} autoLockMinutes={5} onLock={vi.fn()} onChangePin={onChangePin} />);
    await user.click(screen.getByText("Ganti PIN"));
    expect(onChangePin).toHaveBeenCalled();
  });
});

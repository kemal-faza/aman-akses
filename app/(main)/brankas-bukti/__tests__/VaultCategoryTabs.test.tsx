import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VaultCategoryTabs } from "../_components/VaultCategoryTabs";

describe("VaultCategoryTabs", () => {
  it("renders all categories", () => {
    render(<VaultCategoryTabs active="all" counts={{}} onSelect={vi.fn()} />);
    expect(screen.getByText("Semua")).toBeInTheDocument();
    expect(screen.getByText("Foto")).toBeInTheDocument();
    expect(screen.getByText("Audio")).toBeInTheDocument();
    expect(screen.getByText("Chat")).toBeInTheDocument();
    expect(screen.getByText("Dokumen")).toBeInTheDocument();
    expect(screen.getByText("Catatan Medis")).toBeInTheDocument();
  });

  it("shows category counts", () => {
    render(<VaultCategoryTabs active="all" counts={{ photo: 12, audio: 3, chat: 7, document: 5, medical: 2 }} onSelect={vi.fn()} />);
    expect(screen.getByText("Foto")).toBeInTheDocument();
    // Counts shown in parentheses
    expect(screen.getByText(/12/)).toBeInTheDocument();
    expect(screen.getByText(/3/)).toBeInTheDocument();
  });

  it("highlights active tab", () => {
    render(<VaultCategoryTabs active="audio" counts={{}} onSelect={vi.fn()} />);
    const audioTab = screen.getByText("Audio").closest("button");
    expect(audioTab).toHaveClass("border-primary");
  });

  it("calls onSelect when clicked", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<VaultCategoryTabs active="all" counts={{}} onSelect={onSelect} />);
    await user.click(screen.getByText("Audio"));
    expect(onSelect).toHaveBeenCalledWith("audio");
  });
});

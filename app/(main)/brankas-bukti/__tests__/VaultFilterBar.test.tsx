import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VaultFilterBar } from "../_components/VaultFilterBar";

describe("VaultFilterBar", () => {
  const defaultFilters = { quickChips: [] as string[], searchQuery: "", advanced: {} };

  it("renders filter toggle button", () => {
    render(<VaultFilterBar filters={defaultFilters} onFiltersChange={vi.fn()} />);
    expect(screen.getByText("Filter")).toBeInTheDocument();
  });

  it("shows quick chips when expanded", async () => {
    const user = userEvent.setup();
    render(<VaultFilterBar filters={defaultFilters} onFiltersChange={vi.fn()} />);
    await user.click(screen.getByText("Filter"));
    expect(screen.getByText("Terbaru")).toBeInTheDocument();
    expect(screen.getByText("Terlampir Jurnal")).toBeInTheDocument();
    expect(screen.getByText("Terkunci")).toBeInTheDocument();
  });

  it("calls onFiltersChange when chip toggled", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<VaultFilterBar filters={defaultFilters} onFiltersChange={onChange} />);
    await user.click(screen.getByText("Filter"));
    await user.click(screen.getByText("Terbaru"));
    expect(onChange).toHaveBeenCalledWith({ quickChips: ["latest"], searchQuery: "", advanced: {} });
  });
});

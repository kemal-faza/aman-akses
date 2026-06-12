import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ServiceProviderFilter } from "../_components/ServiceProviderFilter";

describe("ServiceProviderFilter", () => {
  it("renders all category chips plus 'Semua'", () => {
    render(<ServiceProviderFilter active="all" onSelect={vi.fn()} />);
    expect(screen.getByText("Semua")).toBeInTheDocument();
    expect(screen.getByText("Hotline")).toBeInTheDocument();
    expect(screen.getByText("Satgas PPKS")).toBeInTheDocument();
    expect(screen.getByText("Bantuan Hukum")).toBeInTheDocument();
    expect(screen.getByText("Psikolog")).toBeInTheDocument();
    expect(screen.getByText("Layanan Sosial")).toBeInTheDocument();
  });

  it("highlights active chip", () => {
    render(<ServiceProviderFilter active="hotline" onSelect={vi.fn()} />);
    const hotlineChip = screen.getByText("Hotline");
    expect(hotlineChip.className).toContain("sidebar-accent");
  });

  it("calls onSelect when chip is clicked", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<ServiceProviderFilter active="all" onSelect={onSelect} />);
    await user.click(screen.getByText("Psikolog"));
    expect(onSelect).toHaveBeenCalledWith("psychologist");
  });

  it("resets to 'all' when Semua is clicked", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<ServiceProviderFilter active="hotline" onSelect={onSelect} />);
    await user.click(screen.getByText("Semua"));
    expect(onSelect).toHaveBeenCalledWith("all");
  });
});

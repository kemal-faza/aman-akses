import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MoodTracker } from "@/app/(main)/_components/journal/MoodTracker";
import { MOOD_OPTIONS } from "@/lib/types";
import type { Mood } from "@/lib/types";

describe("MoodTracker", () => {
  it("renders all 5 mood options", () => {
    render(<MoodTracker value={null} onChange={() => {}} />);
    for (const opt of MOOD_OPTIONS) {
      expect(screen.getByLabelText(opt.label)).toBeInTheDocument();
    }
  });

  it("calls onChange with the clicked mood value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MoodTracker value={null} onChange={onChange} />);
    await user.click(screen.getByLabelText("Baik"));
    expect(onChange).toHaveBeenCalledWith("baik");
  });

  it("marks the active mood with aria-checked", () => {
    render(<MoodTracker value="sedih" onChange={() => {}} />);
    const sedih = screen.getByLabelText("Sedih");
    const baik = screen.getByLabelText("Baik");
    expect(sedih).toHaveAttribute("aria-checked", "true");
    expect(baik).toHaveAttribute("aria-checked", "false");
  });

  it("applies primary color to the active mood", () => {
    render(<MoodTracker value="sangat-baik" onChange={() => {}} />);
    const active = screen.getByLabelText("Sangat Baik");
    expect(active.className).toContain("text-primary");
  });
});

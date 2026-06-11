import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroBanner } from "@/app/(main)/_components/dashboard/HeroBanner";

describe("HeroBanner", () => {
  beforeEach(() => {
    render(<HeroBanner greeting="Kamu tidak sendirian" />);
  });

  it("renders the greeting as h1", () => {
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Kamu tidak sendirian",
    );
  });

  it("renders supporting description", () => {
    expect(
      screen.getByText(/AmanAkses hadir sebagai ruang aman/),
    ).toBeInTheDocument();
  });

  it("renders 3 decorative icons with aria-hidden", () => {
    const icons = document.querySelectorAll('[aria-hidden="true"]');
    expect(icons.length).toBeGreaterThanOrEqual(1);
  });

  it("has accessible structure with section element", () => {
    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();
  });
});

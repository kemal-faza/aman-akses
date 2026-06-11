import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeatureCards } from "@/app/(main)/_components/dashboard/FeatureCards";
import type { FeatureCardData } from "@/lib/types";

const mockFeatures: FeatureCardData[] = [
  {
    icon: "BookOpen",
    title: "Pahami Kekerasan",
    description: "Informasi dasar tentang kekerasan.",
    href: "/pahami-kekerasan",
    badgeColor: "orange",
    isPlaceholder: true,
  },
  {
    icon: "PenLine",
    title: "Jurnal Aman",
    description: "Ruang pribadi mencatat pengalaman.",
    href: "/jurnal",
    badgeColor: "blue",
    isPlaceholder: false,
  },
];

describe("FeatureCards", () => {
  it("renders section heading", () => {
    render(<FeatureCards features={mockFeatures} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Akses Cepat Fitur",
    );
  });

  it("renders all feature cards", () => {
    render(<FeatureCards features={mockFeatures} />);
    expect(screen.getByText("Pahami Kekerasan")).toBeInTheDocument();
    expect(screen.getByText("Jurnal Aman")).toBeInTheDocument();
  });

  it("renders Pelajari lebih lanjut links", () => {
    render(<FeatureCards features={mockFeatures} />);
    const links = screen.getAllByText(/Pelajari lebih lanjut/);
    expect(links.length).toBe(2);
  });

  it("links have correct hrefs", () => {
    render(<FeatureCards features={mockFeatures} />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/pahami-kekerasan");
    expect(links[1]).toHaveAttribute("href", "/jurnal");
  });

  it("renders icon containers with badge color backgrounds", () => {
    render(<FeatureCards features={mockFeatures} />);
    const iconBoxes = document.querySelectorAll(".h-12.w-12");
    expect(iconBoxes.length).toBe(2);
  });
});

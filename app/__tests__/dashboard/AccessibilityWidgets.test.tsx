import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccessibilityProvider } from "@/lib/accessibility-context";
import { AccessibilityWidgets } from "@/app/(main)/_components/dashboard/AccessibilityWidgets";

function renderWithProvider() {
  return render(
    <AccessibilityProvider>
      <AccessibilityWidgets />
    </AccessibilityProvider>,
  );
}

describe("AccessibilityWidgets", () => {
  it("renders section heading", () => {
    renderWithProvider();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Aksesibilitas");
  });

  it("renders 4 toggle switches", () => {
    renderWithProvider();
    const switches = screen.getAllByRole("switch");
    expect(switches.length).toBe(4);
  });

  it("all toggles start with aria-checked false", () => {
    renderWithProvider();
    const switches = screen.getAllByRole("switch");
    switches.forEach((s) => expect(s).toHaveAttribute("aria-checked", "false"));
  });

  it("shows 'Nonaktif' label when off", () => {
    renderWithProvider();
    const labels = screen.getAllByText("Nonaktif");
    expect(labels.length).toBe(4);
  });

  it("clicking Kontras Tinggi toggles state and label to 'Aktif'", async () => {
    const user = userEvent.setup();
    renderWithProvider();
    const toggle = screen.getByRole("switch", { name: "Toggle Kontras Tinggi" });
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText("Aktif")).toBeInTheDocument();
  });

  it("renders Screen Reader, Catatan Suara, Bahasa Isyarat, Kontras Tinggi labels", () => {
    renderWithProvider();
    expect(screen.getByText("Screen Reader")).toBeInTheDocument();
    expect(screen.getByText("Catatan Suara")).toBeInTheDocument();
    expect(screen.getByText("Bahasa Isyarat")).toBeInTheDocument();
    expect(screen.getByText("Kontras Tinggi")).toBeInTheDocument();
  });
});

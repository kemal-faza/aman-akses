import { describe, it, expect } from "vitest";
import { SERVICE_PROVIDER_CATALOG } from "../companion-catalog";
import type { ServiceCategory } from "../companion-types";

describe("companion-catalog", () => {
  it("has at least 4 entries", () => {
    expect(SERVICE_PROVIDER_CATALOG.length).toBeGreaterThanOrEqual(4);
  });

  it("every entry has a unique id", () => {
    const ids = SERVICE_PROVIDER_CATALOG.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every entry has required fields", () => {
    for (const provider of SERVICE_PROVIDER_CATALOG) {
      expect(provider.id.length).toBeGreaterThan(0);
      expect(provider.name.length).toBeGreaterThan(0);
      expect(provider.category.length).toBeGreaterThan(0);
      expect(provider.phone.length).toBeGreaterThan(0);
      expect(provider.icon.length).toBeGreaterThan(0);
      expect(provider.address.length).toBeGreaterThan(0);
    }
  });

  it("every entry has a valid category", () => {
    const validCategories: ServiceCategory[] = [
      "hotline", "satgas-ppks", "legal-aid", "psychologist", "social-service",
    ];
    for (const provider of SERVICE_PROVIDER_CATALOG) {
      expect(validCategories).toContain(provider.category);
    }
  });

  it("entries with waNumber have valid format", () => {
    for (const provider of SERVICE_PROVIDER_CATALOG) {
      if (provider.waNumber) {
        expect(provider.waNumber).toMatch(/^\d+$/);
      }
    }
  });
});

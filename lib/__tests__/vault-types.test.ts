import { describe, it, expect } from "vitest";
import {
  EVIDENCE_CATEGORIES,
  DEFAULT_VAULT_STATE,
} from "../vault-types";

describe("vault-types", () => {
  it("EVIDENCE_CATEGORIES has 5 entries", () => {
    expect(EVIDENCE_CATEGORIES).toHaveLength(5);
  });

  it("each category has value, label, icon, badgeColor", () => {
    for (const cat of EVIDENCE_CATEGORIES) {
      expect(cat.value).toBeTruthy();
      expect(cat.label).toBeTruthy();
      expect(cat.icon).toBeTruthy();
      expect(cat.badgeColor).toMatch(/^badge-/);
    }
  });

  it("DEFAULT_VAULT_STATE has correct initial values", () => {
    const state = { ...DEFAULT_VAULT_STATE, lastActivity: 0 };
    expect(state.isUnlocked).toBe(false);
    expect(state.autoLockTimeoutMs).toBe(300000);
    expect(state.files).toEqual([]);
    expect(state.activeCategory).toBe("all");
    expect(state.activeFilters.quickChips).toEqual([]);
    expect(state.activeFilters.searchQuery).toBe("");
    expect(state.selectedFileId).toBeNull();
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });
});

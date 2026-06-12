import { describe, it, expect } from "vitest";
import {
  DEFAULT_COMPANION_STATE,
  COMPANION_ROLE_LABELS,
  MODULE_ACCESS_LABELS,
  SERVICE_CATEGORY_LABELS,
} from "../companion-types";

describe("companion-types", () => {
  it("COMPANION_ROLE_LABELS has 6 entries", () => {
    expect(Object.keys(COMPANION_ROLE_LABELS)).toHaveLength(6);
  });

  it("each role has a non-empty label", () => {
    for (const label of Object.values(COMPANION_ROLE_LABELS)) {
      expect(label.length).toBeGreaterThan(0);
    }
  });

  it("MODULE_ACCESS_LABELS has 3 entries", () => {
    expect(Object.keys(MODULE_ACCESS_LABELS)).toHaveLength(3);
  });

  it("SERVICE_CATEGORY_LABELS has 5 entries", () => {
    expect(Object.keys(SERVICE_CATEGORY_LABELS)).toHaveLength(5);
  });

  it("DEFAULT_COMPANION_STATE has correct initial values", () => {
    expect(DEFAULT_COMPANION_STATE.contacts).toEqual([]);
    expect(DEFAULT_COMPANION_STATE.providers).toEqual([]);
    expect(DEFAULT_COMPANION_STATE.activeFilter).toBe("all");
    expect(DEFAULT_COMPANION_STATE.selectedContactId).toBeNull();
    expect(DEFAULT_COMPANION_STATE.sheetMode).toBeNull();
    expect(DEFAULT_COMPANION_STATE.loading).toBe(true);
    expect(DEFAULT_COMPANION_STATE.error).toBeNull();
  });
});

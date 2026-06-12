import { describe, it, expect, beforeEach } from "vitest";
import { createCompanionRepository } from "../companion-repository-localstorage";
import type { TrustedContact } from "../companion-types";

function makeContact(overrides: Partial<TrustedContact> = {}): TrustedContact {
  return {
    id: "c1",
    name: "Ayu Rahma",
    role: "friend",
    phone: "081234567890",
    permissions: ["journal"],
    notes: "",
    createdAt: "2026-06-12T00:00:00.000Z",
    updatedAt: "2026-06-12T00:00:00.000Z",
    ...overrides,
  };
}

describe("CompanionRepository (localStorage)", () => {
  let repo: ReturnType<typeof createCompanionRepository>;

  beforeEach(() => {
    localStorage.clear();
    repo = createCompanionRepository();
  });

  it("returns empty array when no contacts", () => {
    expect(repo.getAllContacts()).toEqual([]);
  });

  it("saves and retrieves a contact", () => {
    const contact = makeContact();
    repo.saveContact(contact);
    const contacts = repo.getAllContacts();
    expect(contacts).toHaveLength(1);
    expect(contacts[0].id).toBe("c1");
    expect(contacts[0].name).toBe("Ayu Rahma");
  });

  it("updates an existing contact by id", () => {
    repo.saveContact(makeContact());
    const updated = repo.updateContact("c1", { name: "Ayu Rahma Putri", permissions: ["journal", "timeline"] });
    expect(updated).not.toBeNull();
    expect(updated!.name).toBe("Ayu Rahma Putri");
    expect(updated!.permissions).toEqual(["journal", "timeline"]);
    expect(updated!.updatedAt).not.toBe("2026-06-12T00:00:00.000Z");
    const contacts = repo.getAllContacts();
    expect(contacts[0].name).toBe("Ayu Rahma Putri");
  });

  it("returns null when updating non-existent contact", () => {
    const result = repo.updateContact("nonexistent", { name: "X" });
    expect(result).toBeNull();
  });

  it("saves a new contact (not update existing)", () => {
    repo.saveContact(makeContact({ id: "c1" }));
    repo.saveContact(makeContact({ id: "c2", name: "Budi Darma" }));
    expect(repo.getAllContacts()).toHaveLength(2);
  });

  it("deletes a contact by id", () => {
    repo.saveContact(makeContact());
    const deleted = repo.deleteContact("c1");
    expect(deleted).toBe(true);
    expect(repo.getAllContacts()).toHaveLength(0);
  });

  it("returns false when deleting non-existent contact", () => {
    const deleted = repo.deleteContact("nonexistent");
    expect(deleted).toBe(false);
  });

  it("handles corrupt localStorage data gracefully", () => {
    localStorage.setItem("companion:contacts", "not-valid-json{{{");
    const contacts = repo.getAllContacts();
    expect(contacts).toEqual([]);
  });
});

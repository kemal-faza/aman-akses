import { describe, it, expect, beforeEach } from "vitest";
import { createLocalStorageVaultRepository } from "../vault-repository-localstorage";
import type { EvidenceFile } from "../vault-types";

describe("VaultRepository (localStorage)", () => {
  let repo: ReturnType<typeof createLocalStorageVaultRepository>;

  const sampleFile: EvidenceFile = {
    id: "file-1",
    name: "test.jpg",
    mimeType: "image/jpeg",
    category: "photo",
    sizeBytes: 1024,
    uploadedAt: "2026-06-12",
    source: { type: "upload", method: "drag-drop" },
    linkedNoteIds: [],
    tags: ["test"],
    isLocked: false,
  };

  beforeEach(() => {
    localStorage.clear();
    repo = createLocalStorageVaultRepository();
  });

  it("returns empty array when no files", async () => {
    const files = await repo.getAllFiles();
    expect(files).toEqual([]);
  });

  it("saves and retrieves files", async () => {
    await repo.saveFile(sampleFile);
    const files = await repo.getAllFiles();
    expect(files).toHaveLength(1);
    expect(files[0].id).toBe("file-1");
  });

  it("updates a file", async () => {
    await repo.saveFile(sampleFile);
    await repo.updateFile("file-1", { name: "renamed.jpg", tags: ["updated"] });
    const files = await repo.getAllFiles();
    expect(files[0].name).toBe("renamed.jpg");
    expect(files[0].tags).toEqual(["updated"]);
    expect(files[0].category).toBe("photo");
  });

  it("deletes a file", async () => {
    await repo.saveFile(sampleFile);
    await repo.deleteFile("file-1");
    const files = await repo.getAllFiles();
    expect(files).toHaveLength(0);
  });

  it("saves and retrieves PIN hash", () => {
    repo.savePinHash("hashed-pin-123");
    expect(repo.getPinHash()).toBe("hashed-pin-123");
  });

  it("returns null when no PIN hash", () => {
    expect(repo.getPinHash()).toBeNull();
  });

  it("saves and retrieves salt", () => {
    repo.saveSalt("my-salt-bytes");
    expect(repo.getSalt()).toBe("my-salt-bytes");
  });

  it("saves and retrieves auto-lock setting", () => {
    repo.saveAutoLock(600000);
    expect(repo.getAutoLock()).toBe(600000);
  });

  it("defaults auto-lock to 300000", () => {
    expect(repo.getAutoLock()).toBe(300000);
  });
});

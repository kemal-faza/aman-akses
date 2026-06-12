import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import React from "react";
import { VaultProvider, useVault } from "../vault-context";

beforeEach(() => {
  localStorage.clear();
});

function wrapper({ children }: { children: React.ReactNode }) {
  return <VaultProvider>{children}</VaultProvider>;
}

describe("VaultContext", () => {
  it("starts in locked state", async () => {
    const { result } = renderHook(() => useVault(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));
    expect(result.current.state.isUnlocked).toBe(false);
  });

  it("sets up PIN and unlocks", async () => {
    const { result } = renderHook(() => useVault(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    await act(async () => {
      await result.current.setupPin("123456");
    });

    const unlocked = await act(async () => {
      return await result.current.unlock("123456");
    });
    expect(unlocked).toBe(true);
    expect(result.current.state.isUnlocked).toBe(true);
  });

  it("rejects wrong PIN", async () => {
    const { result } = renderHook(() => useVault(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    await act(async () => {
      await result.current.setupPin("123456");
    });

    const unlocked = await act(async () => {
      return await result.current.unlock("000000");
    });
    expect(unlocked).toBe(false);
  });

  it("locks vault immediately", async () => {
    const { result } = renderHook(() => useVault(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    await act(async () => {
      await result.current.setupPin("123456");
    });
    await act(async () => {
      await result.current.unlock("123456");
    });
    expect(result.current.state.isUnlocked).toBe(true);

    act(() => {
      result.current.lock();
    });
    expect(result.current.state.isUnlocked).toBe(false);
  });

  it("adds a file", async () => {
    const { result } = renderHook(() => useVault(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    await act(async () => {
      await result.current.setupPin("123456");
      await result.current.unlock("123456");
    });

    const file = await act(async () => {
      return await result.current.addFile({
        name: "test.jpg",
        mimeType: "image/jpeg",
        category: "photo",
        sizeBytes: 1024,
        source: { type: "upload", method: "drag-drop" },
        linkedNoteIds: [],
        tags: [],
        file: new File(["test"], "test.jpg", { type: "image/jpeg" }),
      });
    });

    expect(file.id).toBeDefined();
    expect(file.name).toBe("test.jpg");
    expect(result.current.state.files).toHaveLength(1);
  });

  it("deletes a file", async () => {
    const { result } = renderHook(() => useVault(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    await act(async () => {
      await result.current.setupPin("123456");
      await result.current.unlock("123456");
    });

    const file = await act(async () => {
      return await result.current.addFile({
        name: "test.jpg",
        mimeType: "image/jpeg",
        category: "photo",
        sizeBytes: 1024,
        source: { type: "upload", method: "drag-drop" },
        linkedNoteIds: [],
        tags: [],
        file: new File(["test"], "test.jpg", { type: "image/jpeg" }),
      });
    });

    await act(async () => {
      await result.current.deleteFile(file.id);
    });

    expect(result.current.state.files).toHaveLength(0);
  });

  it("sets category filter", async () => {
    const { result } = renderHook(() => useVault(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    act(() => {
      result.current.setCategory("audio");
    });
    expect(result.current.state.activeCategory).toBe("audio");
  });

  it("getFilesByNoteId returns files linked to a note", async () => {
    const { result } = renderHook(() => useVault(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    await act(async () => {
      await result.current.setupPin("123456");
      await result.current.unlock("123456");
    });

    await act(async () => {
      await result.current.addFile({
        name: "photo.jpg", mimeType: "image/jpeg", category: "photo", sizeBytes: 100,
        source: { type: "upload", method: "drag-drop" }, linkedNoteIds: ["note-1"], tags: [],
        file: new File(["a"], "photo.jpg", { type: "image/jpeg" }),
      });
      await result.current.addFile({
        name: "audio.mp3", mimeType: "audio/mpeg", category: "audio", sizeBytes: 200,
        source: { type: "upload", method: "file-picker" }, linkedNoteIds: ["note-1", "note-2"], tags: [],
        file: new File(["b"], "audio.mp3", { type: "audio/mpeg" }),
      });
      await result.current.addFile({
        name: "doc.pdf", mimeType: "application/pdf", category: "document", sizeBytes: 300,
        source: { type: "upload", method: "drag-drop" }, linkedNoteIds: [], tags: [],
        file: new File(["c"], "doc.pdf", { type: "application/pdf" }),
      });
    });

    const forNote1 = result.current.getFilesByNoteId("note-1");
    expect(forNote1).toHaveLength(2);

    const forNote2 = result.current.getFilesByNoteId("note-2");
    expect(forNote2).toHaveLength(1);

    const forNone = result.current.getFilesByNoteId("nonexistent");
    expect(forNone).toHaveLength(0);
  });

  it("getNotesByFileId returns linked note IDs for a file", async () => {
    const { result } = renderHook(() => useVault(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    await act(async () => {
      await result.current.setupPin("123456");
      await result.current.unlock("123456");
    });

    const file = await act(async () => {
      return await result.current.addFile({
        name: "test.jpg", mimeType: "image/jpeg", category: "photo", sizeBytes: 100,
        source: { type: "upload", method: "drag-drop" }, linkedNoteIds: ["note-a", "note-b"], tags: [],
        file: new File(["d"], "test.jpg", { type: "image/jpeg" }),
      });
    });

    const noteIds = result.current.getNotesByFileId(file.id);
    expect(noteIds).toEqual(["note-a", "note-b"]);

    const noNotes = result.current.getNotesByFileId("nonexistent-file");
    expect(noNotes).toEqual([]);
  });

  it("links and unlinks journal notes", async () => {
    const { result } = renderHook(() => useVault(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    await act(async () => {
      await result.current.setupPin("123456");
      await result.current.unlock("123456");
    });

    const file = await act(async () => {
      return await result.current.addFile({
        name: "test.jpg",
        mimeType: "image/jpeg",
        category: "photo",
        sizeBytes: 1024,
        source: { type: "upload", method: "drag-drop" },
        linkedNoteIds: [],
        tags: [],
        file: new File(["test"], "test.jpg", { type: "image/jpeg" }),
      });
    });

    await act(async () => {
      await result.current.linkNote(file.id, "note-1");
    });

    expect(
      result.current.state.files.find((f) => f.id === file.id)?.linkedNoteIds
    ).toContain("note-1");

    await act(async () => {
      await result.current.unlinkNote(file.id, "note-1");
    });

    expect(
      result.current.state.files.find((f) => f.id === file.id)?.linkedNoteIds
    ).not.toContain("note-1");
  });
});

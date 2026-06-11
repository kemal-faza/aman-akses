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

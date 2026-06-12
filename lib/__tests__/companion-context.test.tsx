import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import React from "react";
import { CompanionProvider, useCompanion } from "../companion-context";

beforeEach(() => {
  localStorage.clear();
});

function wrapper({ children }: { children: React.ReactNode }) {
  return <CompanionProvider>{children}</CompanionProvider>;
}

const input = {
  name: "Ayu Rahma",
  role: "friend" as const,
  phone: "081234567890",
  permissions: [] as [],
  notes: "",
};

describe("CompanionContext", () => {
  it("starts with loading state and empty contacts", async () => {
    const { result } = renderHook(() => useCompanion(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));
    expect(result.current.state.contacts).toEqual([]);
  });

  it("loads providers from catalog", async () => {
    const { result } = renderHook(() => useCompanion(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));
    expect(result.current.state.providers.length).toBeGreaterThanOrEqual(4);
  });

  it("adds a contact", async () => {
    const { result } = renderHook(() => useCompanion(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    act(() => {
      result.current.addContact(input);
    });

    expect(result.current.state.contacts).toHaveLength(1);
    expect(result.current.state.contacts[0].name).toBe("Ayu Rahma");
    expect(result.current.state.contacts[0].role).toBe("friend");
    expect(result.current.state.contacts[0].id).toBeDefined();
    expect(result.current.state.contacts[0].createdAt).toBeDefined();
  });

  it("updates a contact", async () => {
    const { result } = renderHook(() => useCompanion(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    act(() => {
      result.current.addContact(input);
    });

    const id = result.current.state.contacts[0].id;

    act(() => {
      result.current.updateContact(id, { name: "Ayu Rahma Putri" });
    });

    expect(result.current.state.contacts[0].name).toBe("Ayu Rahma Putri");
  });

  it("deletes a contact", async () => {
    const { result } = renderHook(() => useCompanion(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    act(() => {
      result.current.addContact(input);
    });

    const id = result.current.state.contacts[0].id;

    act(() => {
      result.current.deleteContact(id);
    });

    expect(result.current.state.contacts).toHaveLength(0);
  });

  it("opens and closes add sheet", async () => {
    const { result } = renderHook(() => useCompanion(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    act(() => {
      result.current.openAddSheet();
    });
    expect(result.current.state.sheetMode).toBe("add");

    act(() => {
      result.current.closeSheet();
    });
    expect(result.current.state.sheetMode).toBeNull();
  });

  it("opens and closes edit sheet with selected contact", async () => {
    const { result } = renderHook(() => useCompanion(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    act(() => {
      result.current.addContact(input);
    });

    const id = result.current.state.contacts[0].id;

    act(() => {
      result.current.openEditSheet(id);
    });
    expect(result.current.state.sheetMode).toBe("edit");
    expect(result.current.state.selectedContactId).toBe(id);

    act(() => {
      result.current.closeSheet();
    });
    expect(result.current.state.sheetMode).toBeNull();
  });

  it("grants and revokes access", async () => {
    const { result } = renderHook(() => useCompanion(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    act(() => {
      result.current.addContact(input);
    });

    const id = result.current.state.contacts[0].id;

    act(() => {
      result.current.grantAccess(id, "journal");
    });
    expect(result.current.state.contacts[0].permissions).toContain("journal");

    act(() => {
      result.current.revokeAccess(id, "journal");
    });
    expect(result.current.state.contacts[0].permissions).not.toContain("journal");
  });

  it("sets filter", async () => {
    const { result } = renderHook(() => useCompanion(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    act(() => {
      result.current.setFilter("hotline");
    });
    expect(result.current.state.activeFilter).toBe("hotline");

    act(() => {
      result.current.setFilter("all");
    });
    expect(result.current.state.activeFilter).toBe("all");
  });

  it("persists contacts across provider remounts", async () => {
    const { result, unmount } = renderHook(() => useCompanion(), { wrapper });
    await waitFor(() => expect(result.current.state.loading).toBe(false));

    act(() => {
      result.current.addContact(input);
    });

    unmount();

    const { result: result2 } = renderHook(() => useCompanion(), { wrapper });
    await waitFor(() => expect(result2.current.state.loading).toBe(false));
    expect(result2.current.state.contacts).toHaveLength(1);
    expect(result2.current.state.contacts[0].name).toBe("Ayu Rahma");
  });
});

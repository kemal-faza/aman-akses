import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { WizardProvider, useWizard } from "@/lib/wizard-context"
import React from "react"

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(WizardProvider, null, children)

describe("WizardContext", () => {
  it("should start at select step with empty selection", () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    expect(result.current.state.step).toBe("select")
    expect(result.current.state.selectedNoteIds).toEqual([])
    expect(result.current.state.timeline).toEqual([])
  })

  it("should SELECT_NOTES update selectedNoteIds", () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    act(() => {
      result.current.dispatch({ type: "SELECT_NOTES", noteIds: ["note-1", "note-2"] })
    })
    expect(result.current.state.selectedNoteIds).toEqual(["note-1", "note-2"])
  })

  it("should not allow START_PROCESSING with empty selection", () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    act(() => {
      result.current.dispatch({ type: "START_PROCESSING" })
    })
    expect(result.current.state.step).toBe("select")
    expect(result.current.state.error).toBe("Pilih minimal 1 catatan")
  })

  it("should START_PROCESSING transition to processing step", () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    act(() => {
      result.current.dispatch({ type: "SELECT_NOTES", noteIds: ["note-1"] })
    })
    act(() => {
      result.current.dispatch({ type: "START_PROCESSING" })
    })
    expect(result.current.state.step).toBe("processing")
    expect(result.current.state.error).toBeNull()
  })

  it("should PROCESSING_SUCCESS transition to review step", () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    const mockResponse = {
      timeline: [
        {
          id: "t1",
          date: "2024-01-15",
          time: "10:00",
          location: "Kelas A",
          title: "Test",
          description: "Test desc",
          sourceNoteIds: ["note-1"],
          aiConfidence: "high" as const,
        },
      ],
      summary: "Test summary",
      aiWarnings: [],
    }
    act(() => {
      result.current.dispatch({ type: "SELECT_NOTES", noteIds: ["note-1"] })
    })
    act(() => {
      result.current.dispatch({ type: "START_PROCESSING" })
    })
    act(() => {
      result.current.dispatch({ type: "PROCESSING_SUCCESS", response: mockResponse })
    })
    expect(result.current.state.step).toBe("review")
    expect(result.current.state.timeline).toEqual(mockResponse.timeline)
    expect(result.current.state.summary).toBe("Test summary")
  })

  it("should PROCESSING_ERROR stay in processing with error", () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    act(() => {
      result.current.dispatch({ type: "SELECT_NOTES", noteIds: ["note-1"] })
    })
    act(() => {
      result.current.dispatch({ type: "START_PROCESSING" })
    })
    act(() => {
      result.current.dispatch({ type: "PROCESSING_ERROR", error: "Network error" })
    })
    expect(result.current.state.step).toBe("processing")
    expect(result.current.state.error).toBe("Network error")
  })

  it("should handle item lifecycle: draft -> editing -> accepted", () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    const mockResponse = {
      timeline: [
        {
          id: "t1",
          date: "2024-01-15",
          time: "10:00",
          location: "Kelas A",
          title: "Original Title",
          description: "Original desc",
          sourceNoteIds: ["note-1"],
          aiConfidence: "high" as const,
        },
      ],
      summary: "Test",
      aiWarnings: [],
    }
    act(() => {
      result.current.dispatch({ type: "SELECT_NOTES", noteIds: ["note-1"] })
    })
    act(() => {
      result.current.dispatch({ type: "START_PROCESSING" })
    })
    act(() => {
      result.current.dispatch({ type: "PROCESSING_SUCCESS", response: mockResponse })
    })

    // Initially draft
    expect(result.current.state.cardStates["t1"]?.status).toBe("draft")

    // Start editing
    act(() => {
      result.current.dispatch({ type: "START_EDIT", itemId: "t1" })
    })
    expect(result.current.state.cardStates["t1"]?.status).toBe("editing")

    // Save edit
    act(() => {
      result.current.dispatch({
        type: "SAVE_EDIT",
        itemId: "t1",
        data: { title: "Edited Title", location: "Kelas B" },
      })
    })
    expect(result.current.state.cardStates["t1"]?.status).toBe("draft")
    expect(result.current.state.cardStates["t1"]?.editedData?.title).toBe("Edited Title")

    // Accept
    act(() => {
      result.current.dispatch({ type: "ACCEPT_ITEM", itemId: "t1" })
    })
    expect(result.current.state.cardStates["t1"]?.status).toBe("accepted")
  })

  it("should handle item rejection and undo", () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    const mockResponse = {
      timeline: [
        {
          id: "t1",
          date: "2024-01-15",
          time: null,
          location: null,
          title: "Test",
          description: "Test",
          sourceNoteIds: ["note-1"],
          aiConfidence: "low" as const,
        },
      ],
      summary: "Test",
      aiWarnings: [],
    }
    act(() => {
      result.current.dispatch({ type: "SELECT_NOTES", noteIds: ["note-1"] })
    })
    act(() => {
      result.current.dispatch({ type: "START_PROCESSING" })
    })
    act(() => {
      result.current.dispatch({ type: "PROCESSING_SUCCESS", response: mockResponse })
    })

    // Reject
    act(() => {
      result.current.dispatch({ type: "REJECT_ITEM", itemId: "t1" })
    })
    expect(result.current.state.cardStates["t1"]?.status).toBe("rejected")

    // Undo back to draft
    act(() => {
      result.current.dispatch({ type: "UNDO_ITEM", itemId: "t1" })
    })
    expect(result.current.state.cardStates["t1"]?.status).toBe("draft")
  })

  it("should SAVE_DONE transition to done when all items resolved", () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    const mockResponse = {
      timeline: [
        {
          id: "t1",
          date: "2024-01-15",
          time: null,
          location: null,
          title: "Test",
          description: "Test",
          sourceNoteIds: ["note-1"],
          aiConfidence: "high" as const,
        },
        {
          id: "t2",
          date: "2024-01-16",
          time: null,
          location: null,
          title: "Test 2",
          description: "Test 2",
          sourceNoteIds: ["note-1"],
          aiConfidence: "medium" as const,
        },
      ],
      summary: "Test",
      aiWarnings: [],
    }
    act(() => {
      result.current.dispatch({ type: "SELECT_NOTES", noteIds: ["note-1"] })
    })
    act(() => {
      result.current.dispatch({ type: "START_PROCESSING" })
    })
    act(() => {
      result.current.dispatch({ type: "PROCESSING_SUCCESS", response: mockResponse })
    })

    act(() => {
      result.current.dispatch({ type: "ACCEPT_ITEM", itemId: "t1" })
    })
    act(() => {
      result.current.dispatch({ type: "REJECT_ITEM", itemId: "t2" })
    })
    act(() => {
      result.current.dispatch({ type: "SAVE_DONE" })
    })
    expect(result.current.state.step).toBe("done")
  })

  it("should GO_BACK to previous valid step", () => {
    const { result } = renderHook(() => useWizard(), { wrapper })
    act(() => {
      result.current.dispatch({ type: "SELECT_NOTES", noteIds: ["note-1"] })
    })
    act(() => {
      result.current.dispatch({ type: "START_PROCESSING" })
    })
    act(() => {
      result.current.dispatch({ type: "GO_BACK", targetStep: "select" })
    })
    expect(result.current.state.step).toBe("select")
  })
})

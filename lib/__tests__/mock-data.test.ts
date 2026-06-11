import { describe, it, expect } from "vitest"
import { mockJournalNotes, generateMockTimelineResponse } from "@/lib/mock-data"
import type { TimelineItem } from "@/lib/types"

describe("mockJournalNotes", () => {
  it("should contain at least 3 notes", () => {
    expect(mockJournalNotes.length).toBeGreaterThanOrEqual(3)
  })

  it("each note should have required fields", () => {
    for (const note of mockJournalNotes) {
      expect(note.id).toBeTruthy()
      expect(note.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(note.title).toBeTruthy()
      expect(note.content).toBeTruthy()
      expect(Array.isArray(note.tags)).toBe(true)
    }
  })
})

describe("generateMockTimelineResponse", () => {
  it("should return a valid TimelineResponse with timeline items", () => {
    const input = {
      notes: mockJournalNotes.slice(0, 2).map((n) => ({
        id: n.id,
        date: n.date,
        title: n.title,
        content: n.content,
        tags: n.tags,
      })),
    }
    const response = generateMockTimelineResponse(input)

    expect(response.timeline).toBeDefined()
    expect(response.timeline.length).toBeGreaterThan(0)
    expect(response.summary).toBeTruthy()
    expect(Array.isArray(response.aiWarnings)).toBe(true)
  })

  it("each timeline item should have correct shape", () => {
    const input = {
      notes: mockJournalNotes.slice(0, 1).map((n) => ({
        id: n.id,
        date: n.date,
        title: n.title,
        content: n.content,
        tags: n.tags,
      })),
    }
    const response = generateMockTimelineResponse(input)

    for (const item of response.timeline) {
      expect(item.id).toBeTruthy()
      expect(item.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(item.title).toBeTruthy()
      expect(item.description).toBeTruthy()
      expect(Array.isArray(item.sourceNoteIds)).toBe(true)
      expect(["high", "medium", "low"]).toContain(item.aiConfidence)
    }
  })

  it("all sourceNoteIds should reference input note IDs", () => {
    const input = {
      notes: mockJournalNotes.slice(0, 2).map((n) => ({
        id: n.id,
        date: n.date,
        title: n.title,
        content: n.content,
        tags: n.tags,
      })),
    }
    const inputIds = new Set(input.notes.map((n) => n.id))
    const response = generateMockTimelineResponse(input)

    for (const item of response.timeline) {
      for (const sourceId of item.sourceNoteIds) {
        expect(inputIds.has(sourceId)).toBe(true)
      }
    }
  })
})

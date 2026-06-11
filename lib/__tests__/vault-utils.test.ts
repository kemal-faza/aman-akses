import { describe, it, expect } from "vitest";
import { formatFileSize, detectCategory, filterFiles, generateId } from "../vault-utils";
import type { EvidenceFile } from "../vault-types";

describe("formatFileSize", () => {
  it("formats bytes", () => {
    expect(formatFileSize(500)).toBe("500 B");
  });
  it("formats KB", () => {
    expect(formatFileSize(2048)).toBe("2.0 KB");
  });
  it("formats MB", () => {
    expect(formatFileSize(2_500_000)).toBe("2.4 MB");
  });
  it("formats 0 B", () => {
    expect(formatFileSize(0)).toBe("0 B");
  });
});

describe("detectCategory", () => {
  it("detects photo from image mime types", () => {
    expect(detectCategory("image/jpeg")).toBe("photo");
    expect(detectCategory("image/png")).toBe("photo");
    expect(detectCategory("image/webp")).toBe("photo");
  });
  it("detects audio from audio mime types", () => {
    expect(detectCategory("audio/mpeg")).toBe("audio");
    expect(detectCategory("audio/wav")).toBe("audio");
    expect(detectCategory("audio/mp4")).toBe("audio");
  });
  it("detects document from pdf", () => {
    expect(detectCategory("application/pdf")).toBe("document");
  });
  it("detects chat from text/plain", () => {
    expect(detectCategory("text/plain")).toBe("chat");
  });
  it("returns document for unknown types", () => {
    expect(detectCategory("application/octet-stream")).toBe("document");
  });
});

describe("filterFiles", () => {
  const files: EvidenceFile[] = [
    { id: "1", name: "foto1.jpg", mimeType: "image/jpeg", category: "photo", sizeBytes: 1000, uploadedAt: "2026-06-01", source: { type: "upload", method: "drag-drop" }, linkedNoteIds: [], tags: [], isLocked: false },
    { id: "2", name: "audio1.mp3", mimeType: "audio/mpeg", category: "audio", sizeBytes: 5000, uploadedAt: "2026-06-10", source: { type: "upload", method: "file-picker" }, linkedNoteIds: ["note1"], tags: ["penting"], isLocked: true },
    { id: "3", name: "chat1.txt", mimeType: "text/plain", category: "chat", sizeBytes: 200, uploadedAt: "2026-06-05", source: { type: "capture", method: "screenshot" }, linkedNoteIds: [], tags: [], isLocked: false },
  ];

  it("filters by category", () => {
    const result = filterFiles(files, { category: "photo", quickChips: [], searchQuery: "", advanced: {} });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("filters by 'all' category returns all files", () => {
    const result = filterFiles(files, { category: "all", quickChips: [], searchQuery: "", advanced: {} });
    expect(result).toHaveLength(3);
  });

  it("filters by search query", () => {
    const result = filterFiles(files, { category: "all", quickChips: [], searchQuery: "audio", advanced: {} });
    expect(result).toHaveLength(1);
  });

  it("filters by 'locked' quick chip", () => {
    const result = filterFiles(files, { category: "all", quickChips: ["locked"], searchQuery: "", advanced: {} });
    expect(result).toHaveLength(1);
  });

  it("filters by 'linked-to-journal' quick chip", () => {
    const result = filterFiles(files, { category: "all", quickChips: ["linked-to-journal"], searchQuery: "", advanced: {} });
    expect(result).toHaveLength(1);
  });

  it("combines multiple filters", () => {
    const result = filterFiles(files, { category: "audio", quickChips: ["locked"], searchQuery: "audio", advanced: {} });
    expect(result).toHaveLength(1);
  });

  it("filters by earliest date", () => {
    const result = filterFiles(files, { category: "all", quickChips: [], searchQuery: "", advanced: { dateFrom: "2026-06-01", dateTo: "2026-06-05" } });
    expect(result).toHaveLength(2);
  });
});

describe("generateId", () => {
  it("returns a string", () => {
    expect(typeof generateId()).toBe("string");
  });
  it("returns unique values", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

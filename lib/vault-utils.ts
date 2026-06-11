import type { EvidenceFile, EvidenceCategory } from "./vault-types";

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function detectCategory(mimeType: string): EvidenceCategory {
  if (mimeType.startsWith("image/")) return "photo";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType === "text/plain") return "chat";
  if (mimeType === "application/pdf") return "document";
  if (mimeType.startsWith("application/") && mimeType.includes("doc")) return "document";
  return "document";
}

export function filterFiles(
  files: EvidenceFile[],
  filters: {
    category: EvidenceCategory | "all";
    quickChips: ("latest" | "linked-to-journal" | "locked")[];
    searchQuery: string;
    advanced: { dateFrom?: string; dateTo?: string; tags?: string[] };
  }
): EvidenceFile[] {
  let result = files;

  if (filters.category !== "all") {
    result = result.filter((f) => f.category === filters.category);
  }

  if (filters.quickChips.includes("locked")) {
    result = result.filter((f) => f.isLocked);
  }

  if (filters.quickChips.includes("linked-to-journal")) {
    result = result.filter((f) => f.linkedNoteIds.length > 0);
  }

  if (filters.quickChips.includes("latest")) {
    result = [...result].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  }

  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    result = result.filter((f) => f.name.toLowerCase().includes(q));
  }

  if (filters.advanced.dateFrom) {
    result = result.filter((f) => f.uploadedAt >= filters.advanced.dateFrom!);
  }

  if (filters.advanced.dateTo) {
    result = result.filter((f) => f.uploadedAt <= filters.advanced.dateTo!);
  }

  if (filters.advanced.tags && filters.advanced.tags.length > 0) {
    result = result.filter((f) =>
      filters.advanced.tags!.some((t) => f.tags.includes(t))
    );
  }

  return result;
}

export function generateId(): string {
  return crypto.randomUUID();
}

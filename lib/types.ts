// === API Contract: POST /api/ai/timeline ===

export interface TimelineNoteInput {
  id: string;
  date: string;       // YYYY-MM-DD
  title: string;
  content: string;
  tags: string[];
}

export interface TimelineRequest {
  notes: TimelineNoteInput[];
}

export interface TimelineItem {
  id: string;
  date: string;           // YYYY-MM-DD
  time: string | null;    // HH:MM atau null
  location: string | null;
  title: string;
  description: string;
  sourceNoteIds: string[];
  aiConfidence: "high" | "medium" | "low";
}

export interface TimelineResponse {
  timeline: TimelineItem[];
  summary: string;
  aiWarnings: string[];
}

// === Wizard State Machine ===

export type WizardStep = "select" | "processing" | "review" | "done";

/** draft -> editing -> draft|accepted|rejected -> draft (via UNDO) */
export type TimelineItemStatus = "draft" | "editing" | "accepted" | "rejected";

// Fields that users can edit on a timeline item
export type EditableTimelineFields = Pick<
  TimelineItem,
  "title" | "description" | "date" | "time" | "location"
>;

export interface CardState {
  status: TimelineItemStatus;
  editedData: Partial<EditableTimelineFields> | null;  // null = no edits
}

export interface WizardState {
  step: WizardStep;
  selectedNoteIds: string[];
  timeline: TimelineItem[];
  summary: string;
  aiWarnings: string[];
  cardStates: Record<string, CardState>;  // key = item.id
  error: string | null;
}

export type WizardAction =
  | { type: "SELECT_NOTES"; noteIds: string[] }
  | { type: "START_PROCESSING" }
  | { type: "PROCESSING_SUCCESS"; response: TimelineResponse }
  | { type: "PROCESSING_ERROR"; error: string }
  | { type: "START_EDIT"; itemId: string }
  | { type: "CANCEL_EDIT"; itemId: string }
  | { type: "SAVE_EDIT"; itemId: string; data: Partial<EditableTimelineFields> }
  | { type: "ACCEPT_ITEM"; itemId: string }
  | { type: "REJECT_ITEM"; itemId: string }
  | { type: "UNDO_ITEM"; itemId: string }
  | { type: "SAVE_DONE" }
  | { type: "GO_BACK"; targetStep: WizardStep };

// === Journal Note ===

export interface JournalNote {
  id: string;
  date: string;            // ISO-8601 "2026-06-12"
  title: string;           // maks 100 karakter
  content: string;         // deskripsi kejadian
  mood: Mood | null;       // null = tidak dipilih
  involvedParties: string; // "Siapa yang terlibat?"
  tags: string[];          // array tag unik, lowercase
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}

export type JournalEntryInput = Omit<JournalNote, "id" | "createdAt" | "updatedAt">;

// === Dashboard ===

export interface DashboardStats {
  journalCount: number;
  kronologiCount: number;
  activeFeatures: number;
  totalFeatures: number;
}

export interface FeatureCardData {
  icon: string;              // Lucide icon name
  title: string;
  description: string;
  href: string;
  badgeColor: "orange" | "blue" | "violet" | "pink" | "teal" | "emerald";
  isPlaceholder: boolean;
}

// === Mood ===

export type Mood = "sangat-baik" | "baik" | "biasa" | "sedih" | "sangat-sedih";

export const MOOD_OPTIONS: { value: Mood; label: string }[] = [
  { value: "sangat-baik", label: "Sangat Baik" },
  { value: "baik", label: "Baik" },
  { value: "biasa", label: "Biasa Saja" },
  { value: "sedih", label: "Sedih" },
  { value: "sangat-sedih", label: "Sangat Sedih" },
];

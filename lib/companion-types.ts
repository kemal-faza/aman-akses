// lib/companion-types.ts
export type CompanionRole =
  | "friend"       // Sahabat
  | "sibling"      // Kakak / Adik
  | "parent"       // Orang Tua
  | "partner"      // Pasangan
  | "relative"     // Keluarga Lain
  | "other";       // Lainnya (custom)

export type ModuleAccess =
  | "journal"      // Jurnal Aman
  | "timeline"     // Kronologi Kejadian
  | "evidence";    // Brankas Bukti

export interface TrustedContact {
  id: string;
  name: string;
  role: CompanionRole;
  roleCustom?: string;
  phone: string;
  permissions: ModuleAccess[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategory =
  | "hotline"
  | "satgas-ppks"
  | "legal-aid"
  | "psychologist"
  | "social-service";

export interface ServiceProvider {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  phone: string;
  waNumber: string | null;
  email: string | null;
  website: string | null;
  address: string;
  operatingHours: string;
  isAvailable: boolean;
  icon: string;
}

export interface CompanionState {
  contacts: TrustedContact[];
  providers: ServiceProvider[];
  activeFilter: ServiceCategory | "all";
  selectedContactId: string | null;
  sheetMode: "add" | "edit" | null;
  loading: boolean;
  error: string | null;
}

export const DEFAULT_COMPANION_STATE: CompanionState = {
  contacts: [],
  providers: [],
  activeFilter: "all",
  selectedContactId: null,
  sheetMode: null,
  loading: true,
  error: null,
};

export const COMPANION_ROLE_LABELS: Record<CompanionRole, string> = {
  friend: "Sahabat",
  sibling: "Kakak / Adik",
  parent: "Orang Tua",
  partner: "Pasangan",
  relative: "Keluarga Lain",
  other: "Lainnya",
};

export const MODULE_ACCESS_LABELS: Record<ModuleAccess, string> = {
  journal: "Jurnal Aman",
  timeline: "Kronologi Kejadian",
  evidence: "Brankas Bukti",
};

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  hotline: "Hotline",
  "satgas-ppks": "Satgas PPKS",
  "legal-aid": "Bantuan Hukum",
  psychologist: "Psikolog",
  "social-service": "Layanan Sosial",
};

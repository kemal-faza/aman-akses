// lib/companion-context.tsx
"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type {
  TrustedContact,
  ServiceCategory,
  ModuleAccess,
  CompanionState,
} from "./companion-types";
import { DEFAULT_COMPANION_STATE } from "./companion-types";
import { SERVICE_PROVIDER_CATALOG } from "./companion-catalog";
import { createCompanionRepository } from "./companion-repository-localstorage";

// ---- ID Generator ----

function generateId(): string {
  return crypto.randomUUID();
}

// ---- Reducer ----

type CompanionAction =
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_CONTACTS"; contacts: TrustedContact[] }
  | { type: "ADD_CONTACT"; contact: TrustedContact }
  | { type: "UPDATE_CONTACT"; id: string; updates: Partial<TrustedContact> }
  | { type: "REMOVE_CONTACT"; id: string }
  | { type: "SET_PROVIDERS"; providers: typeof SERVICE_PROVIDER_CATALOG }
  | { type: "SET_FILTER"; category: ServiceCategory | "all" }
  | { type: "OPEN_SHEET"; mode: "add" | "edit"; contactId: string | null }
  | { type: "CLOSE_SHEET" };

function companionReducer(state: CompanionState, action: CompanionAction): CompanionState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "SET_CONTACTS":
      return { ...state, contacts: action.contacts };
    case "ADD_CONTACT":
      return { ...state, contacts: [...state.contacts, action.contact] };
    case "UPDATE_CONTACT": {
      const contacts = state.contacts.map((c) =>
        c.id === action.id ? { ...c, ...action.updates } : c
      );
      return { ...state, contacts };
    }
    case "REMOVE_CONTACT":
      return {
        ...state,
        contacts: state.contacts.filter((c) => c.id !== action.id),
        selectedContactId:
          state.selectedContactId === action.id ? null : state.selectedContactId,
      };
    case "SET_PROVIDERS":
      return { ...state, providers: action.providers };
    case "SET_FILTER":
      return { ...state, activeFilter: action.category };
    case "OPEN_SHEET":
      return { ...state, sheetMode: action.mode, selectedContactId: action.contactId };
    case "CLOSE_SHEET":
      return { ...state, sheetMode: null, selectedContactId: null };
    default:
      return state;
  }
}

// ---- Context ----

interface CompanionContextValue {
  state: CompanionState;
  addContact: (input: Omit<TrustedContact, "id" | "createdAt" | "updatedAt">) => void;
  updateContact: (id: string, updates: Partial<TrustedContact>) => void;
  deleteContact: (id: string) => void;
  openAddSheet: () => void;
  openEditSheet: (id: string) => void;
  closeSheet: () => void;
  setFilter: (category: ServiceCategory | "all") => void;
  grantAccess: (contactId: string, module: ModuleAccess) => void;
  revokeAccess: (contactId: string, module: ModuleAccess) => void;
}

const CompanionContext = createContext<CompanionContextValue | null>(null);

// ---- Provider ----

export function CompanionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(companionReducer, DEFAULT_COMPANION_STATE);
  const repo = createCompanionRepository();

  // Load initial state
  useEffect(() => {
    const contacts = repo.getAllContacts();
    dispatch({ type: "SET_CONTACTS", contacts });
    dispatch({ type: "SET_PROVIDERS", providers: SERVICE_PROVIDER_CATALOG });
    dispatch({ type: "SET_LOADING", loading: false });
  }, []);

  const addContact = useCallback(
    (input: Omit<TrustedContact, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const contact: TrustedContact = {
        ...input,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
        notes: input.notes ?? "",
        roleCustom: input.roleCustom,
      };
      repo.saveContact(contact);
      dispatch({ type: "ADD_CONTACT", contact });
    },
    []
  );

  const updateContact = useCallback((id: string, updates: Partial<TrustedContact>) => {
    const updated = repo.updateContact(id, updates);
    if (updated) {
      dispatch({ type: "UPDATE_CONTACT", id, updates: { ...updates, updatedAt: updated.updatedAt } });
    }
  }, []);

  const deleteContact = useCallback((id: string) => {
    repo.deleteContact(id);
    dispatch({ type: "REMOVE_CONTACT", id });
  }, []);

  const openAddSheet = useCallback(() => {
    dispatch({ type: "OPEN_SHEET", mode: "add", contactId: null });
  }, []);

  const openEditSheet = useCallback((id: string) => {
    dispatch({ type: "OPEN_SHEET", mode: "edit", contactId: id });
  }, []);

  const closeSheet = useCallback(() => {
    dispatch({ type: "CLOSE_SHEET" });
  }, []);

  const setFilter = useCallback((category: ServiceCategory | "all") => {
    dispatch({ type: "SET_FILTER", category });
  }, []);

  const grantAccess = useCallback((contactId: string, module: ModuleAccess) => {
    const contact = state.contacts.find((c) => c.id === contactId);
    if (!contact || contact.permissions.includes(module)) return;
    const permissions = [...contact.permissions, module];
    updateContact(contactId, { permissions });
  }, [state.contacts, updateContact]);

  const revokeAccess = useCallback((contactId: string, module: ModuleAccess) => {
    const contact = state.contacts.find((c) => c.id === contactId);
    if (!contact || !contact.permissions.includes(module)) return;
    const permissions = contact.permissions.filter((m) => m !== module);
    updateContact(contactId, { permissions });
  }, [state.contacts, updateContact]);

  return (
    <CompanionContext.Provider
      value={{
        state,
        addContact,
        updateContact,
        deleteContact,
        openAddSheet,
        openEditSheet,
        closeSheet,
        setFilter,
        grantAccess,
        revokeAccess,
      }}
    >
      {children}
    </CompanionContext.Provider>
  );
}

export function useCompanion() {
  const ctx = useContext(CompanionContext);
  if (!ctx) throw new Error("useCompanion must be used within CompanionProvider");
  return ctx;
}

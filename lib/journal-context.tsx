"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { JournalNote, JournalEntryInput } from "./types";
import type { JournalRepository } from "./repository";
import { createLocalStorageRepo } from "./repository-localstorage";

interface JournalState {
  entries: JournalNote[];
  loading: boolean;
  error: string | null;
}

type JournalAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; entries: JournalNote[] }
  | { type: "LOAD_ERROR"; error: string }
  | { type: "ADD"; entry: JournalNote }
  | { type: "UPDATE"; entry: JournalNote }
  | { type: "DELETE"; id: string };

const initialState: JournalState = {
  entries: [],
  loading: true,
  error: null,
};

function journalReducer(state: JournalState, action: JournalAction): JournalState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, loading: true, error: null };
    case "LOAD_SUCCESS":
      return { entries: action.entries, loading: false, error: null };
    case "LOAD_ERROR":
      return { ...state, loading: false, error: action.error };
    case "ADD":
      return { ...state, entries: [...state.entries, action.entry], loading: false, error: null };
    case "UPDATE":
      return {
        ...state,
        entries: state.entries.map((e) => (e.id === action.entry.id ? action.entry : e)),
        loading: false,
        error: null,
      };
    case "DELETE":
      return {
        ...state,
        entries: state.entries.filter((e) => e.id !== action.id),
        loading: false,
        error: null,
      };
    default:
      return state;
  }
}

interface JournalContextValue {
  entries: JournalNote[];
  loading: boolean;
  error: string | null;
  createEntry: (input: JournalEntryInput) => Promise<JournalNote>;
  updateEntry: (id: string, input: Partial<JournalEntryInput>) => Promise<JournalNote>;
  deleteEntry: (id: string) => Promise<void>;
  refreshEntries: () => Promise<void>;
}

const JournalContext = createContext<JournalContextValue | null>(null);

export function JournalProvider({
  children,
  repository,
}: {
  children: ReactNode;
  repository?: JournalRepository;
}) {
  const repo = repository ?? createLocalStorageRepo();
  const [state, dispatch] = useReducer(journalReducer, initialState);

  const refreshEntries = useCallback(async () => {
    dispatch({ type: "LOAD_START" });
    try {
      const entries = await repo.getAll();
      dispatch({ type: "LOAD_SUCCESS", entries });
    } catch (err) {
      dispatch({ type: "LOAD_ERROR", error: err instanceof Error ? err.message : "Gagal memuat" });
    }
  }, [repo]);

  useEffect(() => {
    refreshEntries();
  }, [refreshEntries]);

  const createEntry = useCallback(
    async (input: JournalEntryInput) => {
      const entry = await repo.create(input);
      dispatch({ type: "ADD", entry });
      return entry;
    },
    [repo],
  );

  const updateEntry = useCallback(
    async (id: string, input: Partial<JournalEntryInput>) => {
      const entry = await repo.update(id, input);
      dispatch({ type: "UPDATE", entry });
      return entry;
    },
    [repo],
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      await repo.delete(id);
      dispatch({ type: "DELETE", id });
    },
    [repo],
  );

  return (
    <JournalContext.Provider
      value={{
        ...state,
        createEntry,
        updateEntry,
        deleteEntry,
        refreshEntries,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal(): JournalContextValue {
  const ctx = useContext(JournalContext);
  if (!ctx) {
    throw new Error("useJournal must be used within a JournalProvider");
  }
  return ctx;
}

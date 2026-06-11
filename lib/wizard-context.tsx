"use client"

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react"
import type { WizardState, WizardAction, CardState, EditableTimelineFields } from "./types"

function createInitialState(): WizardState {
  return {
    step: "select",
    selectedNoteIds: [],
    timeline: [],
    summary: "",
    aiWarnings: [],
    cardStates: {},
    error: null,
  }
}

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SELECT_NOTES":
      return { ...state, selectedNoteIds: action.noteIds }

    case "START_PROCESSING": {
      if (state.selectedNoteIds.length === 0) {
        return { ...state, error: "Pilih minimal 1 catatan" }
      }
      return { ...state, step: "processing", error: null }
    }

    case "PROCESSING_SUCCESS": {
      const timeline = action.response.timeline
      const cardStates: Record<string, CardState> = {}
      for (const item of timeline) {
        cardStates[item.id] = { status: "draft", editedData: null }
      }
      return {
        ...state,
        step: "review",
        timeline,
        summary: action.response.summary,
        aiWarnings: action.response.aiWarnings,
        cardStates,
        error: null,
      }
    }

    case "PROCESSING_ERROR":
      return { ...state, error: action.error }

    case "START_EDIT": {
      const card = state.cardStates[action.itemId]
      if (!card) return state
      return {
        ...state,
        cardStates: {
          ...state.cardStates,
          [action.itemId]: { ...card, status: "editing" },
        },
      }
    }

    case "CANCEL_EDIT": {
      const card = state.cardStates[action.itemId]
      if (!card) return state
      return {
        ...state,
        cardStates: {
          ...state.cardStates,
          [action.itemId]: { ...card, status: "draft" },
        },
      }
    }

    case "SAVE_EDIT": {
      const card = state.cardStates[action.itemId]
      if (!card) return state
      const originalItem = state.timeline.find((t) => t.id === action.itemId)
      const merged = { ...card.editedData, ...action.data } as Partial<EditableTimelineFields>
      // Remove fields that match the original item (user reverted to original)
      const cleaned = { ...merged }
      if (originalItem) {
        for (const key of Object.keys(cleaned) as Array<keyof EditableTimelineFields>) {
          if (cleaned[key] === originalItem[key]) delete cleaned[key]
        }
      }
      const finalData =
        Object.keys(cleaned).length > 0 ? cleaned : null
      return {
        ...state,
        cardStates: {
          ...state.cardStates,
          [action.itemId]: {
            ...card,
            status: "draft",
            editedData: finalData,
          },
        },
      }
    }

    case "ACCEPT_ITEM": {
      const card = state.cardStates[action.itemId]
      if (!card) return state
      return {
        ...state,
        cardStates: {
          ...state.cardStates,
          [action.itemId]: { ...card, status: "accepted" },
        },
      }
    }

    case "REJECT_ITEM": {
      const card = state.cardStates[action.itemId]
      if (!card) return state
      return {
        ...state,
        cardStates: {
          ...state.cardStates,
          [action.itemId]: { ...card, status: "rejected" },
        },
      }
    }

    case "UNDO_ITEM": {
      const card = state.cardStates[action.itemId]
      if (!card) return state
      return {
        ...state,
        cardStates: {
          ...state.cardStates,
          [action.itemId]: { ...card, status: "draft", editedData: null },
        },
      }
    }

    case "SAVE_DONE": {
      const allResolved = Object.values(state.cardStates).every(
        (c) => c.status === "accepted" || c.status === "rejected",
      )
      if (!allResolved) return state
      return { ...state, step: "done", error: null }
    }

    case "GO_BACK":
      return { ...state, step: action.targetStep, error: null }

    default:
      return state
  }
}

interface WizardContextValue {
  state: WizardState
  dispatch: Dispatch<WizardAction>
}

const WizardContext = createContext<WizardContextValue | null>(null)

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, undefined, createInitialState)
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])
  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard(): WizardContextValue {
  const context = useContext(WizardContext)
  if (!context) {
    throw new Error("useWizard must be used within a WizardProvider")
  }
  return context
}

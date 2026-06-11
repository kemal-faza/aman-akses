"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";

export interface AccessibilityState {
  screenReader: boolean;
  voiceNote: boolean;
  signLanguage: boolean;
  highContrast: boolean;
}

type AccessibilityAction =
  | { type: "TOGGLE_SCREEN_READER" }
  | { type: "TOGGLE_VOICE_NOTE" }
  | { type: "TOGGLE_SIGN_LANGUAGE" }
  | { type: "TOGGLE_HIGH_CONTRAST" };

const initialState: AccessibilityState = {
  screenReader: false,
  voiceNote: false,
  signLanguage: false,
  highContrast: false,
};

function accessibilityReducer(
  state: AccessibilityState,
  action: AccessibilityAction,
): AccessibilityState {
  switch (action.type) {
    case "TOGGLE_SCREEN_READER":
      return { ...state, screenReader: !state.screenReader };
    case "TOGGLE_VOICE_NOTE":
      return { ...state, voiceNote: !state.voiceNote };
    case "TOGGLE_SIGN_LANGUAGE":
      return { ...state, signLanguage: !state.signLanguage };
    case "TOGGLE_HIGH_CONTRAST":
      return { ...state, highContrast: !state.highContrast };
    default:
      return state;
  }
}

interface AccessibilityContextValue {
  state: AccessibilityState;
  toggle: (feature: keyof AccessibilityState) => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

function featureToAction(feature: keyof AccessibilityState): AccessibilityAction["type"] {
  switch (feature) {
    case "screenReader":
      return "TOGGLE_SCREEN_READER";
    case "voiceNote":
      return "TOGGLE_VOICE_NOTE";
    case "signLanguage":
      return "TOGGLE_SIGN_LANGUAGE";
    case "highContrast":
      return "TOGGLE_HIGH_CONTRAST";
  }
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(accessibilityReducer, initialState);

  function toggle(feature: keyof AccessibilityState) {
    dispatch({ type: featureToAction(feature) });
  }

  return (
    <AccessibilityContext.Provider value={{ state, toggle }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return ctx;
}

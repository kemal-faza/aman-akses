import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { AccessibilityProvider, useAccessibility } from "@/lib/accessibility-context";

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(AccessibilityProvider, null, children);
}

describe("accessibilityReducer", () => {
  it("defaults all states to false", () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    expect(result.current.state).toEqual({
      screenReader: false,
      voiceNote: false,
      signLanguage: false,
      highContrast: false,
    });
  });

  it("toggles screenReader on then off", () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    act(() => result.current.toggle("screenReader"));
    expect(result.current.state.screenReader).toBe(true);
    act(() => result.current.toggle("screenReader"));
    expect(result.current.state.screenReader).toBe(false);
  });

  it("toggles voiceNote", () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    act(() => result.current.toggle("voiceNote"));
    expect(result.current.state.voiceNote).toBe(true);
  });

  it("toggles signLanguage", () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    act(() => result.current.toggle("signLanguage"));
    expect(result.current.state.signLanguage).toBe(true);
  });

  it("toggles highContrast", () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    act(() => result.current.toggle("highContrast"));
    expect(result.current.state.highContrast).toBe(true);
  });

  it("combines multiple toggles independently", () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    act(() => result.current.toggle("screenReader"));
    act(() => result.current.toggle("highContrast"));
    expect(result.current.state).toEqual({
      screenReader: true,
      voiceNote: false,
      signLanguage: false,
      highContrast: true,
    });
  });

  it("throws if useAccessibility used outside provider", () => {
    expect(() => renderHook(() => useAccessibility())).toThrow(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  });
});

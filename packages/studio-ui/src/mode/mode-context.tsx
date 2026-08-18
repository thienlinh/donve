import * as React from "react";

import type { StudioMode } from "./types";

type ModeContextValue = {
  mode: StudioMode;
  setMode: (mode: StudioMode) => void;
};

const ModeContext = React.createContext<ModeContextValue | null>(null);

export type StudioModeProviderProps = {
  /** Uncontrolled initial mode. Ignored once `mode` is passed (controlled). */
  defaultMode?: StudioMode;
  /** Controlled mode — pass together with `onModeChange`. */
  mode?: StudioMode;
  onModeChange?: (mode: StudioMode) => void;
  children: React.ReactNode;
};

/** Exactly one `StudioMode` is active at a time; switching replaces it, never stacks. */
export function StudioModeProvider({
  defaultMode = "view",
  mode: controlledMode,
  onModeChange,
  children
}: StudioModeProviderProps) {
  const [uncontrolledMode, setUncontrolledMode] =
    React.useState<StudioMode>(defaultMode);
  const mode = controlledMode ?? uncontrolledMode;

  const setMode = React.useCallback(
    (next: StudioMode) => {
      setUncontrolledMode(next);
      onModeChange?.(next);
    },
    [onModeChange]
  );

  const value = React.useMemo(() => ({ mode, setMode }), [mode, setMode]);

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useStudioMode(): ModeContextValue {
  const ctx = React.useContext(ModeContext);
  if (!ctx)
    throw new Error("useStudioMode must be used within a StudioModeProvider");
  return ctx;
}

// "select" has no dedicated hotkey (studio-builder-spec.md §10 only maps these 4) —
// it's entered programmatically when an element is picked in view mode.
const MODE_HOTKEYS: Record<string, StudioMode> = {
  v: "view",
  e: "edit",
  c: "comment",
  d: "draw"
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable
  );
}

/** Binds V/S/E/C/D to mode switches (studio-builder-spec.md §10), disabled while typing. */
export function useStudioModeHotkeys(): void {
  const { setMode } = useStudioMode();

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      const next = MODE_HOTKEYS[e.key.toLowerCase()];
      if (!next) return;
      setMode(next);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setMode]);
}

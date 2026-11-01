"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type AppMode = "live" | "demo";

type ModeContextValue = {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  forceDemo: boolean;
};

const ModeContext = createContext<ModeContextValue | null>(null);

const STORAGE_KEY = "clearhold-app-mode";

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode>("live");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "demo" || saved === "live") {
      setModeState(saved);
    }
    setReady(true);
  }, []);

  function setMode(next: AppMode) {
    setModeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <ModeContext.Provider
      value={{ mode: ready ? mode : "live", setMode, forceDemo: mode === "demo" }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export function useAppMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) {
    throw new Error("useAppMode must be used inside ModeProvider");
  }
  return ctx;
}

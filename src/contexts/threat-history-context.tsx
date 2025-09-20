"use client";

import type { ThreatHistoryItem } from "@/lib/types";
import { createContext, useContext, useState, type ReactNode } from "react";

interface ThreatHistoryContextType {
  threatHistory: ThreatHistoryItem[];
  addThreatToHistory: (item: ThreatHistoryItem) => void;
}

const ThreatHistoryContext = createContext<ThreatHistoryContextType | undefined>(undefined);

export function ThreatHistoryProvider({ children }: { children: ReactNode }) {
  const [threatHistory, setThreatHistory] = useState<ThreatHistoryItem[]>([]);

  const addThreatToHistory = (item: ThreatHistoryItem) => {
    setThreatHistory((prev) => [item, ...prev]);
  };

  return (
    <ThreatHistoryContext.Provider value={{ threatHistory, addThreatToHistory }}>
      {children}
    </ThreatHistoryContext.Provider>
  );
}

export function useThreatHistory() {
  const context = useContext(ThreatHistoryContext);
  if (context === undefined) {
    throw new Error("useThreatHistory must be used within a ThreatHistoryProvider");
  }
  return context;
}

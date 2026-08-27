import { createContext, useContext } from "react";
import type { ConversationApi } from "../lib/conversation/useConversation";

export interface AppContextValue {
  conversation: ConversationApi;
  logout: () => Promise<void>;
}

// Kept in its own module so fast-refresh never creates a second context
// instance while AppShell.tsx is being edited (which would make consumers
// read a provider-less default and throw).
export const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppShell");
  return ctx;
}

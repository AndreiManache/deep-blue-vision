import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { X } from "lucide-react";
import {
  getStoredToken,
  logout as logoutRequest,
  SESSION_INVALIDATED_EVENT,
} from "../lib/api/client";
import { useConversation, type Phase } from "../lib/conversation/useConversation";
import { AuthGate } from "./AuthGate";
import { AppContext, useApp } from "./app-context";

export { useApp };
export type { AppContextValue } from "./app-context";


const PILL_LABELS: Partial<Record<Phase, string>> = {
  "awaiting-mic": "Allow mic…",
  listening: "Listening…",
  thinking: "Thinking…",
  speaking: "Speaking…",
};

export function AppShell({ children }: { children: ReactNode }) {
  const conversation = useConversation();
  const { endSession } = conversation;
  // Authed purely by whether a session token is stored. A stale/expired token
  // is caught the first time an API call 401s (see the invalidated event
  // below), which clears it and flips this back to the login screen.
  const [authed, setAuthed] = useState<boolean>(() => Boolean(getStoredToken()));

  useEffect(() => {
    function handleInvalidated() {
      // The login screen replaces the whole UI — a conversation left running
      // would keep speaking and listening invisibly behind it.
      endSession();
      setAuthed(false);
    }
    window.addEventListener(SESSION_INVALIDATED_EVENT, handleInvalidated);
    return () => window.removeEventListener(SESSION_INVALIDATED_EVENT, handleInvalidated);
  }, [endSession]);

  async function handleLogout() {
    endSession();
    setAuthed(false);
    await logoutRequest();
  }

  return (
    <AppContext.Provider value={{ conversation, logout: handleLogout }}>
      {authed ? (
        <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col">
          {children}
          <ConversationPill />
        </div>
      ) : (
        <AuthGate onAuthed={() => setAuthed(true)} />
      )}
    </AppContext.Provider>
  );
}

// Floating status pill on non-home routes while a conversation runs, so the
// session is never lost invisibly behind another screen.
function ConversationPill() {
  const { conversation } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const label = PILL_LABELS[conversation.phase];
  if (pathname === "/" || !label) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink py-2 pl-5 pr-2 shadow-xl">
      <button
        className="flex items-center gap-2 text-sm font-bold text-cream"
        onClick={() => void navigate({ to: "/" })}
      >
        <span className="size-2 animate-pulse rounded-full bg-coral" />
        {label}
      </button>
      <button
        className="grid size-8 place-items-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20"
        onClick={conversation.endSession}
        aria-label="End conversation"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

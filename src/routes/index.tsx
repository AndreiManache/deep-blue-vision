import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "../components/AppShell";
import { HamburgerMenu } from "../components/HamburgerMenu";
import { Logo } from "../components/Logo";

import { TalkButton } from "../components/TalkButton";
import { MicPermissionHelp } from "../components/MicPermissionHelp";
import { ErrorBanner } from "../components/ErrorBanner";
import type { Phase } from "../lib/conversation/useConversation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deep Blue — Talk to log your food" },
      {
        name: "description",
        content:
          "Tap the orb and talk about what you ate. Deep Blue logs meals, tracks calories and macros, and coaches you by voice.",
      },
      { property: "og:title", content: "Deep Blue — Talk to log your food" },
      {
        property: "og:description",
        content:
          "Tap the orb and talk about what you ate. Deep Blue logs meals, tracks calories and macros, and coaches you by voice.",
      },
    ],
  }),
  component: HomePage,
});

const HINTS: Partial<Record<Phase, string>> = {
  "awaiting-mic": "Tap “Allow” when your browser asks for the microphone.",
  listening: "I'm listening — tell me what you ate.",
  thinking: "One moment…",
  speaking: "Talking — tap anytime to cut in.",
};

function HomePage() {
  const { conversation, logout } = useApp();
  const { phase, errorMessage, micPermissionDenied } = conversation;

  function handleTap() {
    if (phase === "idle") {
      conversation.startSession();
    } else if (phase === "listening") {
      conversation.endTurn();
    } else if (phase === "speaking") {
      conversation.interrupt();
    } else if (phase === "awaiting-mic" || phase === "thinking") {
      conversation.endSession();
    }
  }

  return (
    <div className="flex min-h-dvh flex-col px-6 pb-10 pt-5">
      <header className="flex items-center justify-between">
        <HamburgerMenu onLogout={() => void logout()} />
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <div className="font-display text-lg font-bold tracking-tight text-ink">
              Deep Blue
            </div>
            <div className="text-xs font-semibold text-ink/40">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
          <Logo className="size-8" title="Deep Blue" />
        </div>
      </header>


      <main className="flex flex-1 flex-col items-center justify-center gap-8 py-8">
        {phase === "unsupported" ? (
          <div className="w-full max-w-sm rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-ink/5">
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
              Voice isn't supported here
            </h1>
            <p className="mt-2 text-sm font-medium text-ink/60">
              Deep Blue needs a browser with microphone recording and audio playback. Try the
              latest Safari (iOS) or Chrome (Android/desktop).
            </p>
          </div>
        ) : micPermissionDenied ? (
          <div className="w-full max-w-sm">
            <MicPermissionHelp onRetry={conversation.startSession} />
          </div>
        ) : (
          <>
            <TalkButton phase={phase} onTap={handleTap} />
            <p className="min-h-6 text-center text-sm font-semibold text-ink/50">
              {HINTS[phase] ??
                "Tap the orb and just talk — “I had two eggs and a coffee for breakfast.”"}
            </p>
          </>
        )}
      </main>

      {errorMessage && <ErrorBanner message={errorMessage} />}
    </div>
  );
}

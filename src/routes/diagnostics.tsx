import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "../components/AppShell";
import { BackHeader } from "../components/BackHeader";

export const Route = createFileRoute("/diagnostics")({
  head: () => ({
    meta: [
      { title: "Diagnostics — Deep Blue" },
      { name: "description", content: "Live voice-pipeline event log for troubleshooting." },
      { property: "og:title", content: "Diagnostics — Deep Blue" },
      { property: "og:description", content: "Live voice-pipeline event log for troubleshooting." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DiagnosticsPage,
});

function DiagnosticsPage() {
  const { conversation } = useApp();
  const { phase, diagnostics, clearDiagnostics } = conversation;

  return (
    <div className="flex min-h-dvh flex-col gap-6 px-6 pb-16 pt-5">
      <BackHeader title="Diagnostics" subtitle="Voice pipeline, live" />

      <div className="flex items-center justify-between rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-ink/5">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-ink/40">Phase</div>
          <div className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink">
            {phase}
          </div>
        </div>
        <button
          className="rounded-2xl bg-ink3 px-4 py-2.5 text-xs font-bold text-ink transition-colors hover:bg-ink/10"
          onClick={clearDiagnostics}
        >
          Clear log
        </button>
      </div>

      <section className="flex-1 rounded-[2rem] bg-ink p-5 shadow-sm">
        {diagnostics.length === 0 ? (
          <p className="py-6 text-center text-sm font-medium text-white/30">
            Nothing yet — start a conversation and events will stream in here.
          </p>
        ) : (
          <ol className="space-y-2 font-mono text-xs text-white/70">
            {diagnostics.map((d, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 text-white/30">
                  {new Date(d.t).toLocaleTimeString(undefined, { hour12: false })}
                </span>
                <span>
                  <span className="font-bold text-cream">{d.label}</span>
                  {d.detail && <span className="text-white/50"> · {d.detail}</span>}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

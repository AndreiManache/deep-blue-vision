import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  fetchEntries,
  fetchStats,
  todayKey,
  type FoodEntry,
  type StatsResponse,
} from "../lib/api/client";
import { useApp } from "../components/AppShell";
import { BackHeader } from "../components/BackHeader";
import { WeekStrip } from "../components/WeekStrip";
import { DaySummary } from "../components/DaySummary";
import { EntryRow } from "../components/EntryRow";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Deep Blue" },
      {
        name: "description",
        content: "Your day at a glance: calories and macro rings, week strip, and everything you logged.",
      },
      { property: "og:title", content: "Dashboard — Deep Blue" },
      {
        property: "og:description",
        content: "Your day at a glance: calories and macro rings, week strip, and everything you logged.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { conversation } = useApp();
  const [selectedDay, setSelectedDay] = useState(todayKey());
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (day: string) => {
    setError(null);
    try {
      const [e, s] = await Promise.all([fetchEntries(day), fetchStats(7)]);
      setEntries(e);
      setStats(s);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load your data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(selectedDay);
  }, [selectedDay, load]);

  // Refetch whenever the voice conversation mutated the log.
  useEffect(() => {
    if (conversation.mutationSignal > 0) void load(selectedDay);
  }, [conversation.mutationSignal, selectedDay, load]);

  return (
    <div className="flex min-h-dvh flex-col gap-6 px-6 pb-28 pt-5">
      <BackHeader title="Dashboard" subtitle="Your day at a glance" />

      <WeekStrip selected={selectedDay} stats={stats?.days ?? []} onSelect={setSelectedDay} />

      <DaySummary entries={entries} targets={stats?.targets ?? null} selectedDay={selectedDay} />

      <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-ink/5">
        <h2 className="font-display text-lg font-extrabold tracking-tight text-ink">
          Logged food
        </h2>
        {loading ? (
          <p className="py-6 text-center text-sm font-medium text-ink/40">Loading…</p>
        ) : error ? (
          <p className="py-6 text-center text-sm font-semibold text-coral">{error}</p>
        ) : entries.length === 0 ? (
          <p className="py-6 text-center text-sm font-medium text-ink/40">
            Nothing logged yet. Talk to Deep Blue to add your first meal.
          </p>
        ) : (
          <div className="divide-y divide-ink/5">
            {entries.map((entry) => (
              <EntryRow key={entry.id} entry={entry} onChanged={() => void load(selectedDay)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

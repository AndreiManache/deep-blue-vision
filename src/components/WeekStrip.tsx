import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { todayKey, type DayEntry } from "../lib/api/client";
import { cn } from "../lib/utils";

interface WeekStripProps {
  selected: string;
  entries: DayEntry[];
  onSelect: (day: string) => void;
}

// A single day cell in the strip.
function dayCell(
  day: string,
  i: number,
  selected: string,
  today: string,
  hasData: boolean,
  onSelect: (day: string) => void,
) {
  const isSelected = day === selected;
  const isToday = day === today;
  return (
    <button
      key={day}
      className={cn(
        "flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-1 py-2 transition-colors",
        isSelected ? "bg-ink" : "bg-white ring-1 ring-ink/5 hover:bg-ink3",
      )}
      onClick={() => onSelect(day)}
      aria-pressed={isSelected}
      aria-label={`${new Date(day + "T00:00:00").toDateString()}${isToday ? " (today)" : ""}${hasData ? ", has entries" : ""}`}
    >
      <span
        className={cn(
          "text-[11px] font-bold uppercase",
          isSelected ? "text-white/60" : "text-ink/40",
        )}
      >
        {new Date(day + "T00:00:00").toLocaleDateString(undefined, { weekday: "short" })}
      </span>
      <span
        className={cn(
          "font-display text-lg font-extrabold leading-none",
          isSelected ? "text-white" : "text-ink",
        )}
      >
        {new Date(day + "T00:00:00").getDate()}
      </span>
      <span
        className={cn(
          "mt-1 size-1.5 rounded-full",
          hasData ? (isSelected ? "bg-coral" : "bg-coral") : isSelected ? "bg-white/25" : "bg-ink/10",
          isToday && !hasData && "bg-sky",
        )}
      />
    </button>
  );
}

export function WeekStrip({ selected, entries, onSelect }: WeekStripProps) {
  const today = todayKey();
  const daysWithData = useMemo(() => new Set(entries.map((e) => e.day)), [entries]);

  // Build the 7-day window that contains the selected day (Mon..Sun).
  const weekDays = useMemo(() => {
    const sel = new Date(selected + "T00:00:00");
    const dow = (sel.getDay() + 6) % 7; // Monday = 0
    const monday = new Date(sel);
    monday.setDate(sel.getDate() - dow);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${dd}`;
    });
  }, [selected]);

  function shift(days: number) {
    const sel = new Date(selected + "T00:00:00");
    sel.setDate(sel.getDate() + days);
    const y = sel.getFullYear();
    const m = String(sel.getMonth() + 1).padStart(2, "0");
    const dd = String(sel.getDate()).padStart(2, "0");
    onSelect(`${y}-${m}-${dd}`);
  }

  const isCurrentWeek = weekDays.includes(today);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-ink/40">
          {new Date(weekDays[0] + "T00:00:00").toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}{" "}
          –{" "}
          {new Date(weekDays[6] + "T00:00:00").toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </span>
        <div className="flex gap-2">
          <button
            className="grid size-9 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-ink/5 transition-colors hover:bg-ink3"
            onClick={() => shift(-7)}
            aria-label="Previous week"
          >
            <ChevronLeft className="size-4 text-ink/70" />
          </button>
          <button
            className={cn(
              "grid size-9 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-ink/5 transition-colors",
              isCurrentWeek ? "cursor-default opacity-40" : "hover:bg-ink3",
            )}
            onClick={() => shift(7)}
            disabled={isCurrentWeek}
            aria-label="Next week"
          >
            <ChevronRight className="size-4 text-ink/70" />
          </button>
        </div>
      </div>
      <div className="flex gap-1.5">
        {weekDays.map((day, i) => dayCell(day, i, selected, today, daysWithData.has(day), onSelect))}
      </div>
    </div>
  );
}

import { useMemo } from "react";
import { todayKey, type DayEntry, type Profile } from "../lib/api/client";
import { Ring } from "./Ring";

interface DaySummaryProps {
  entries: DayEntry[];
  profile: Profile | null;
  selectedDay: string;
}

function sum(entries: DayEntry[]) {
  return {
    kcal: entries.reduce((a, e) => a + (e.kcal || 0), 0),
    protein_g: entries.reduce((a, e) => a + (e.protein_g || 0), 0),
    carbs_g: entries.reduce((a, e) => a + (e.carbs_g || 0), 0),
    fat_g: entries.reduce((a, e) => a + (e.fat_g || 0), 0),
  };
}

const round1 = (n: number) => Math.round(n * 10) / 10;

function progress(pct: number | null, over: boolean, value: number | null, unit: string, target: number | null) {
  return { pct, over, value, unit, target };
}

// The white headline card: big calorie ring + small protein/carbs/fat rings.
// Dates are compared as local day keys so everything lines up in the user's
// timezone.
export function DaySummary({ entries, profile, selectedDay }: DaySummaryProps) {
  const totals = useMemo(() => sum(entries), [entries]);
  const kcalTarget = profile?.targets.kcal ?? null;
  const proteinTarget = profile?.targets.protein_g ?? null;
  const carbsTarget = profile?.targets.carbs_g ?? null;
  const fatTarget = profile?.targets.fat_g ?? null;

  const macro = (target: number | null, value: number) => {
    if (!target) return progress(null, false, null, "g", null);
    const pct = target > 0 ? value / target : 0;
    return progress(pct, value > target, value, "g", target);
  };

  const kcalPct = kcalTarget && kcalTarget > 0 ? totals.kcal / kcalTarget : null;
  const kcalOver = kcalTarget != null && totals.kcal > kcalTarget;

  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-ink/5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Ring
            size={112}
            stroke={12}
            pct={kcalPct ?? 0}
            over={kcalOver}
            color="var(--color-sky)"
          >
            <div className="text-center">
              <div className="font-display text-2xl font-extrabold leading-none text-ink">
                {Math.round(totals.kcal)}
              </div>
              <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-ink/40">
                kcal
              </div>
            </div>
          </Ring>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-ink/40">
              {selectedDay === todayKey() ? "Today" : "Selected day"}
            </div>
            <div className="mt-1 text-sm font-semibold text-ink/60">
              {kcalTarget != null
                ? `${Math.max(0, Math.round(kcalTarget - totals.kcal))} left of ${kcalTarget}`
                : "No target set"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <MacroTile label="Protein" {...macro(proteinTarget, totals.protein_g)} color="var(--color-sky)" />
        <MacroTile label="Carbs" {...macro(carbsTarget, totals.carbs_g)} color="var(--color-sun)" />
        <MacroTile label="Fat" {...macro(fatTarget, totals.fat_g)} color="var(--color-coral)" />
      </div>
    </div>
  );
}

interface MacroTileProps {
  label: string;
  pct: number | null;
  over: boolean;
  value: number | null;
  unit: string;
  target: number | null;
  color: string;
}

function MacroTile({ label, pct, over, value, target, color }: MacroTileProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-cream px-2 py-4">
      <Ring size={72} stroke={9} pct={pct ?? 0} over={over} color={color}>
        <div className="text-center">
          <div className="font-display text-base font-extrabold leading-none text-ink">
            {value == null ? "—" : round1(value)}
          </div>
          <div className="text-[9px] font-bold uppercase text-ink/40">g</div>
        </div>
      </Ring>
      <div className="text-center">
        <div className="text-xs font-bold uppercase tracking-wide text-ink/50">{label}</div>
        <div className="text-[11px] font-semibold text-ink/40">
          {target == null ? "no target" : `/ ${round1(target)}g`}
        </div>
      </div>
    </div>
  );
}

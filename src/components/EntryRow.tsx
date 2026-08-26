import { useEffect, useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import {
  ApiError,
  deleteEntry,
  timeLabel,
  updateEntry,
  type DayEntry,
} from "../lib/api/client";
import { cn } from "../lib/utils";

interface EntryRowProps {
  entry: DayEntry;
  onChanged: () => void;
  onMutated?: () => void;
}

const MEAL_COLORS: Record<string, string> = {
  Breakfast: "bg-sky",
  Lunch: "bg-leaf",
  Dinner: "bg-coral",
  Snack: "bg-sun",
  Meal: "bg-ink/20",
};

const MACRO_ORDER = [
  { key: "protein_g", label: "Protein (g)" },
  { key: "carbs_g", label: "Carbs (g)" },
  { key: "fat_g", label: "Fat (g)" },
] as const;

const inputClass =
  "w-full rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-ink shadow-sm ring-1 ring-ink/10 outline-none placeholder:font-medium placeholder:text-ink/30 focus:ring-2 focus:ring-coral/50";

// One logged item with inline edit + delete. Mutations call the API directly
// and then trigger a refresh via onChanged.
export function EntryRow({ entry, onChanged, onMutated }: EntryRowProps) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    label: entry.label,
    kcal: entry.kcal != null ? String(entry.kcal) : "",
    protein_g: entry.protein_g != null ? String(entry.protein_g) : "",
    carbs_g: entry.carbs_g != null ? String(entry.carbs_g) : "",
    fat_g: entry.fat_g != null ? String(entry.fat_g) : "",
  });

  useEffect(() => {
    setForm({
      label: entry.label,
      kcal: entry.kcal != null ? String(entry.kcal) : "",
      protein_g: entry.protein_g != null ? String(entry.protein_g) : "",
      carbs_g: entry.carbs_g != null ? String(entry.carbs_g) : "",
      fat_g: entry.fat_g != null ? String(entry.fat_g) : "",
    });
    setError(null);
    setConfirmingDelete(false);
  }, [entry]);

  function setField(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const toNumber = (v: string) => {
        const n = Number(v);
        return v.trim() === "" || Number.isNaN(n) ? null : n;
      };
      await updateEntry(entry.id, {
        label: form.label.trim() || entry.label,
        kcal: toNumber(form.kcal),
        protein_g: toNumber(form.protein_g),
        carbs_g: toNumber(form.carbs_g),
        fat_g: toNumber(form.fat_g),
      });
      setEditing(false);
      onChanged();
      onMutated?.();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't save changes.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (busy) return;
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await deleteEntry(entry.id);
      setEditing(false);
      onChanged();
      onMutated?.();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't delete this entry.");
      setConfirmingDelete(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 py-3",
        editing && "rounded-2xl bg-ink3 px-3",
      )}
    >
      <div
        className={cn(
          "size-2.5 shrink-0 rounded-full",
          MEAL_COLORS[entry.meal_slot ?? "Meal"] ?? "bg-ink/20",
        )}
        title={entry.meal_slot ?? "Meal"}
      />
      <div className="min-w-0 flex-1">
        {editing ? (
          <div className="space-y-2">
            <input
              value={form.label}
              onChange={(e) => setField("label", e.target.value)}
              placeholder="Label"
              className={inputClass}
              aria-label="Entry label"
            />
            <input
              value={form.kcal}
              onChange={(e) => setField("kcal", e.target.value)}
              placeholder="kcal"
              inputMode="decimal"
              className={inputClass}
              aria-label="Calories"
            />
            <div className="grid grid-cols-3 gap-2">
              {MACRO_ORDER.map(({ key, label }) => (
                <input
                  key={key}
                  value={form[key]}
                  onChange={(e) => setField(key, e.target.value)}
                  placeholder={label}
                  inputMode="decimal"
                  className={inputClass}
                  aria-label={label}
                />
              ))}
            </div>
            {error && (
              <div className="rounded-xl bg-coral/10 px-3 py-2 text-xs font-semibold text-coral">
                {error}
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <button
                className="inline-flex items-center gap-1.5 rounded-xl bg-coral px-4 py-2 text-xs font-bold text-white disabled:opacity-60"
                onClick={handleSave}
                disabled={busy}
              >
                <Check className="size-3.5" /> Save
              </button>
              <button
                className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-ink ring-1 ring-ink/10 disabled:opacity-60"
                onClick={() => setEditing(false)}
                disabled={busy}
              >
                <X className="size-3.5" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="truncate text-sm font-bold text-ink">
              {entry.label || "(untitled)"}
            </div>
            <div className="text-xs font-medium text-ink/45">
              {entry.kcal != null ? `${Math.round(entry.kcal)} kcal` : "—"}
              {entry.protein_g != null && ` · P ${Math.round(entry.protein_g)}`}
              {entry.carbs_g != null && ` · C ${Math.round(entry.carbs_g)}`}
              {entry.fat_g != null && ` · F ${Math.round(entry.fat_g)}`}
            </div>
          </>
        )}
      </div>
      {!editing && (
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-[11px] font-semibold text-ink/35">
            {timeLabel(entry.created_at)}
          </span>
          <div className="flex gap-1">
            <button
              className="grid size-8 place-items-center rounded-lg text-ink/40 transition-colors hover:bg-ink3 hover:text-ink"
              onClick={() => {
                setEditing(true);
                setConfirmingDelete(false);
                setError(null);
              }}
              aria-label="Edit entry"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              className={cn(
                "grid h-8 place-items-center rounded-lg transition-colors",
                confirmingDelete
                  ? "w-auto bg-coral px-2.5 text-white"
                  : "w-8 text-coral/60 hover:bg-coral/10 hover:text-coral",
              )}
              onClick={handleDelete}
              disabled={busy}
              aria-label={confirmingDelete ? "Confirm delete" : "Delete entry"}
            >
              {confirmingDelete ? (
                <span className="text-[11px] font-bold">Sure?</span>
              ) : (
                <Trash2 className="size-3.5" />
              )}
            </button>
          </div>
          {error && <div className="text-[11px] font-semibold text-coral">{error}</div>}
        </div>
      )}
    </div>
  );
}

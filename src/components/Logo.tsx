import { useId } from "react";

/**
 * Deep Blue brand mark — "The Ember Dot".
 *
 * Semantic contrast: the name reads cold, submerged, machine-like; the mark
 * answers with a single warm point of light. One perfect circle on a 64
 * grid, filled with the ember→amber gradient. Nothing else. The restraint
 * is the idea: deep blue is the ocean you don't see; the dot is the spark
 * you do.
 */

/** The mark is a perfect circle, r=24, centred on a 64×64 grid. */
export const MARK_RADIUS = 24;
export const MARK_CX = 32;
export const MARK_CY = 32;

type Tone = "brand" | "ink" | "light";

export function Logo({
  className = "size-9",
  tone = "brand",
  title,
}: {
  className?: string;
  tone?: Tone;
  title?: string;
}) {
  const id = useId();
  const gradientId = `ember-${id}`;
  const fill =
    tone === "brand"
      ? `url(#${gradientId})`
      : tone === "ink"
        ? "var(--ink)"
        : "var(--cream)";

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {tone === "brand" && (
        <defs>
          <radialGradient id={gradientId} cx="0.38" cy="0.34" r="0.85">
            <stop offset="0%" stopColor="var(--sun)" />
            <stop offset="100%" stopColor="var(--coral)" />
          </radialGradient>
        </defs>
      )}
      <circle cx={MARK_CX} cy={MARK_CY} r={MARK_RADIUS} fill={fill} />
    </svg>
  );
}

/** Horizontal lockup: mark + wordmark. The dot doubles as the full stop. */
export function Wordmark({
  className = "",
  tone = "brand",
}: {
  className?: string;
  tone?: Tone;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Logo className="size-7" tone={tone} title="Deep Blue" />
      <span
        className={`font-display text-lg font-bold lowercase tracking-tight ${
          tone === "light" ? "text-cream" : "text-ink"
        }`}
      >
        deep&nbsp;blue
      </span>
    </div>
  );
}

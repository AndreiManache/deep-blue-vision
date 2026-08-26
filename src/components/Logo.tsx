import { useId } from "react";

/**
 * Deep Blue brand mark — "The Spark Seed".
 *
 * Semantic contrast: the name reads cold, submerged, machine-like; the mark
 * answers with a warm, sharp, upward spark. Built strictly from two circular
 * arcs (r = 36 on a 64 grid) meeting at two points, with a smaller offset
 * spark cut out of it as negative space.
 */

/** Outer seed: two arcs (r=38) meeting at two sharp points. */
export const MARK_OUTER = "M32 2 A38 38 0 0 1 32 62 A38 38 0 0 1 32 2 Z";
/** Inner spark cut out with evenodd, leaving an aperture of negative space. */
export const MARK_INNER = "M32 17 A24 24 0 0 1 32 47 A24 24 0 0 1 32 17 Z";
/** The whole mark leans forward — motion, not stillness. */
export const MARK_TILT = -34;


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
  const gradientId = `spark-${id}`;
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
          <linearGradient id={gradientId} x1="0.1" y1="1" x2="0.9" y2="0.05">
            <stop offset="0%" stopColor="var(--coral)" />
            <stop offset="100%" stopColor="var(--sun)" />
          </linearGradient>
        </defs>
      )}
      <g transform={`rotate(${MARK_TILT} 32 32)`}>
        <path d={`${MARK_OUTER} ${MARK_INNER}`} fillRule="evenodd" fill={fill} />
      </g>

    </svg>
  );
}

/** Horizontal lockup: mark + wordmark. */
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
        className={`font-display text-lg font-bold tracking-tight ${
          tone === "light" ? "text-cream" : "text-ink"
        }`}
      >
        Deep&nbsp;Blue
      </span>
    </div>
  );
}

# Deep Blue — Brand Identity, Logo & Brand Book

Build a real brand identity for Deep Blue: a minimalist geometric spark/seed logo that deliberately contradicts the name, a refined palette, a favicon, and a downloadable brand book PDF.

## The design principle

The effect you're describing is **semantic contrast** (also called counter-literal or oppositional branding): the name sets an expectation and the mark refuses it, creating tension the viewer resolves as intent. Apple isn't a computer, Shell isn't fuel, Monzo isn't a bank vault. "Deep Blue" projects cold, heavy, submerged, machine-like. The mark answers with warm, light, sharp, alive — a spark. The blue stays in the mind; the eye gets fire.

## 1. Logo — "The Spark Seed"

A single geometric mark, no blue anywhere:
- A sharp teardrop/seed form built from two circular arcs meeting at a point — half seed, half flame, fully geometric (constructed on a circle grid, not hand-drawn).
- A negative-space notch or offset inner form gives it depth without detail.
- Warm gradient: coral into amber. Reads as one solid shape at 16px.
- Deliverables: full-color mark, monochrome ink version, reversed (light-on-dark) version, and a horizontal lockup with the "Deep Blue" wordmark.

## 2. Palette — sleeker refinement

Keep coral as the primary, tighten the rest for a premium feel:
- Ember (primary) — refined coral, slightly deeper and less candy.
- Amber (secondary/logo gradient partner).
- Ink — near-black with a faint warm cast, replacing the cool indigo-black.
- Cream / Bone — the two surface tones.
- Macro accents: leaf and sky get desaturated one notch so they support rather than compete.
Each with a name, hex, oklch, and a defined role.

## 3. Typography

Lock a display + body pairing with a defined type scale (display, H1–H3, body, caption, numeric), weights, tracking, and usage rules. If Baloo 2 reads too playful against "sleek," the brand book specifies a tightened alternative and the app follows it.

## 4. Favicon

Generated from the same spark mark, padded square, exported to `public/favicon.png` and wired into the root route; the default Lovable `favicon.ico` is removed.

## 5. Brand book PDF

A designed multi-page PDF delivered as a download:
1. Cover — the mark, large, on ink.
2. Brand idea — the name/mark contrast, stated in a few lines.
3. Logo — construction grid, variants, clear space, minimum size.
4. Logo misuse — don't stretch, recolor, rotate, outline, add effects.
5. Color — swatches with hex/oklch, roles, contrast pairings.
6. Typography — scale specimen and rules.
7. UI in use — buttons, cards, the voice orb, rings, in-brand.
8. Voice & tone — how Deep Blue talks (it's a voice product, so this matters).

## Technical details

- Logo generated as image assets in `src/assets/`, plus a hand-authored SVG version for crisp in-app rendering.
- Refined tokens replace the current values in `src/styles.css`; because every component already uses semantic tokens (`bg-coral`, `text-ink`), the app picks up the new palette without component rewrites. Spot-fix any component that looks off after the shift.
- Logo added to the home header and the auth screen, replacing the plain text wordmark.
- Brand book built with a Python/reportlab script using the actual token values, so it can't drift from the code. Every page rendered to an image and visually inspected before delivery.
- No backend, data, or voice-pipeline changes.

## Output

- Updated app styling and logo in the preview.
- `Deep-Blue-Brand-Book.pdf` as a downloadable artifact.

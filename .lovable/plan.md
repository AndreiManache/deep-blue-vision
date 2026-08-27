# Surface food-knowledge provenance (PR #10) in the frontend

The server now returns `source` ('estimate' | 'yours' | 'verified') and `agreement_count` on every food entry. Verification is passive (5+ users agreeing), so the frontend's job is to *show* provenance — there is no user action to build.

## Changes

1. **API client** (`src/lib/api/client.ts`)
   - Add `source: string | null` and `agreement_count: number | null` to the `FoodEntry` interface (matches the PR's `web/src/api/client.ts` change).

2. **Entry badges** (`src/components/EntryRow.tsx`)
   - In the meta line, next to time / "edited":
     - `verified` → "✓ verified" badge (+ count in parentheses when `agreement_count` is set), styled in the leaf/sky accent per the Chunky Candy system (a small pill, not raw text like the old UI).
     - `yours` → muted "your value" pill.
     - `estimate` / null → nothing (keeps the list quiet; the Ink Dot minimalism principle).
   - Chunky styling: tiny rounded-full pill, 10–11px bold uppercase-ish, consistent with existing badges.

3. **No other changes**
   - Corrections already flow through the existing inline edit (PATCH) — the server now feeds those into the knowledge base automatically. No new endpoints to call.

## Verification
- Typecheck, then a Playwright pass on `/dashboard` with a mocked/real entry to confirm badges render and nothing overflows at 390px.

## Note (separate from this plan)
Repo strategy discussed in chat: recommendation is to keep the Lovable frontend as its own deployed app pointing at the Railway server, or download/sync it and let Claude Code swap it in as `web/` — either works; no code change needed here for that.

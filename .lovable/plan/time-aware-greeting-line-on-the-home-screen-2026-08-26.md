# Time-aware greeting line on the home screen

## What changes

1. **Header slims down** — the date under "Deep Blue" is removed. The header keeps the menu button on the left and the wordmark + Ink Dot on the right.

2. **A greeting headline appears above the voice orb**, in the Claude style: the Ink Dot mark sitting inline before a short sentence set in the display face, centred, with the orb below it.

   Examples (name included when known):
   - 05–11: "Morning, Andrei. What's for breakfast?"
   - 11–15: "Midday check-in, Andrei."
   - 15–18: "Afternoon, Andrei. How's the day going?"
   - 18–22: "Evening, Andrei. What did dinner look like?"
   - 22–05: "Late one, Andrei."

   Each slot has 2–3 variants, picked deterministically per day so the line is stable while the screen is open but feels fresh across days.

3. **The name** comes from the saved profile (`name` on the profile endpoint). If it's empty, the line simply drops the name ("Evening. What did dinner look like?"). No new backend work — the home screen reads the profile the same way the profile screen does, and it degrades silently if the request fails.

4. The hint text under the orb stays as-is; the greeting replaces nothing else.

## Technical notes

- New `src/components/Greeting.tsx` holding the time-slot copy table and the picker.
- `src/routes/index.tsx`: drop the date block from the header, render `<Greeting />` above `<TalkButton />`.
- Profile fetched with `useQuery` (`fetchProfile`) — cached, no loading flash: the line renders name-less first, then fills in.
- Greeting is client-only (already true for the whole app), so no SSR time mismatch.

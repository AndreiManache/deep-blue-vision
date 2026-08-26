# Deep Blue — Frontend Redesign ("Chunky Candy")

Rebuild the Deep Blue voice-first nutrition tracker frontend in this project with the selected **Chunky Candy v2** design (light cream background, ink text, coral/sun/leaf/sky accents, Baloo 2 + Nunito). Visual redesign only — all existing screens, flows, and the voice pipeline are preserved, and the app keeps talking to your existing hosted server.

## What gets built

1. **Design system** — Chunky Candy tokens in `src/styles.css`: cream `#fdfdff` background, ink `#1a1a2e` text, coral `#ff6b6b` primary, sun `#ffb800` / leaf `#45b352` / sky `#3d8bff` macro accents; Baloo 2 (display) + Nunito (body) loaded via font links. Chunky rounded cards, soft shadows, pulsing voice orb with expanding rings.

2. **Home / voice screen** — top bar with hamburger menu, status pill ("Listening…", "Thinking…", "Speaking…"), the big coral talk orb with animated pulse rings and sound-bar icon, interim transcript caption, end-conversation button, mic-permission help and unsupported-browser states, error banner.

3. **Dashboard** — "Today" header with date, selectable 7-day ring strip (rings fill toward calorie target, over-target goes coral), calorie ring card (remaining + goal/consumed), three macro cards (protein/carbs/fat bars), food entry list with inline edit (description + calories) and delete, empty/error states.

4. **Profile page** — chunky white field cards for name, height, weight, age, sex, activity level, goal type/rate, language (EN/RO), notes; coral save button; shows computed targets.

5. **Diagnostics page** — timestamped speech-pipeline event log with copy/clear (kept, restyled).

6. **Auth gate** — login/register screen in the new style, token stored in localStorage exactly as today.

## How it connects to your backend

- The full API client is ported as-is (auth, chat, entries, stats, profile, greeting, transcribe) with one change: a configurable base URL (`VITE_API_BASE_URL`) pointing at your hosted server instead of relative paths. Your server already sends open CORS headers, so cross-origin calls work.
- The voice pipeline is ported unchanged: Web Speech API recognition with server transcription fallback, 8s silence window, 350ms mic re-arm after speech, barge-in interrupt, and server-returned audio playback.

## Technical details

- Stack: TanStack Start + Tailwind v4 (this project's fixed stack). Routes: `/` (home), `/dashboard`, `/profile`, `/diagnostics` with a shared shell; the conversation state lives in a context so the status pill works across routes.
- Source files are read from the public repo at build time and adapted; behavior constants (silence timeout, re-arm delay) are kept identical.
- Mobile-first: 390px-centered shell, `100dvh` tracking, no horizontal overflow (verified at 320/390/430px with a headless browser check).
- Per-route SEO head metadata (title/description/og) replaces the template defaults.
- No backend, database, or Lovable Cloud changes. No new features.

## Afterwards (optional)

- Connect this project to GitHub (two-way sync) so the new frontend lives in a repo you own — note Lovable creates a **new** repo; it can't push into `AndreiManache/deep-blue` directly. To deploy, you'd point your server's static hosting at this build or host it separately and set `VITE_API_BASE_URL`.

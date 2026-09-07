# Race course setter

A tool for club race officers: turns a signal-boat GPS position, a wind reading, and a
course-type selection (windward/leeward, triangle, or trapezoid) into actual lat/lon mark
positions, a plan-view diagram, a laying order, and radio-callable positions.

Recovered from an earlier Claude (Mac app) session and set up here as a normal Vite +
React project for continued development.

## Structure

- `src/CourseSetter.jsx` — the app (geodesy, course geometry, wind stats, target-time
  solver, plan view, and UI)
- `docs/courses/` — reference documentation for every standard course family, one file
  per family, all conforming to `docs/courses/SCHEMA.md` (a spec for how the course
  files themselves are written — frontmatter fields, required sections in fixed order,
  ASCII diagram conventions, mark-designation and course-signal grammar shared across
  files). Files: `windward-leeward.md`, `triangle.md`, `trapezoid.md`,
  `class-specific.md` (Optimist `IOD` and the legacy Olympic triangle), `random-leg.md`
  (unsignalled fixed-mark/passage courses, `X`).
- `docs/app-functionality-spec.md` — the full product spec: venue/fleet setup, wind
  capture, course design, mark computation & validation, dispatch/navigation to mark
  boats, as-laid verification & wind-shift adjustment, and race logging/documentation.
  `CourseSetter.jsx` currently implements a slice of this — see below.

## Spec vs. current prototype

The functionality spec describes a multi-device, server-synced system (signal boat +
mark boats, live dispatch, drop capture). `CourseSetter.jsx` is a single-device tool
covering the P0 *design* half of that:

| Spec area | Status in `CourseSetter.jsx` |
|---|---|
| Wind axis capture (median/min/max, spread warning) | Implemented, minus oscillation period and the strip chart |
| True vs. magnetic, single internal representation | Implemented |
| Course design (family/signal/beat, trig geometry from interior angles + leg ratios) | Implemented, per the spec's own recommendation not to hardcode tables |
| Beat length: manual and solve-from-target-time | Implemented, with editable per-class speeds (spec's "editable" tier, step 2 of 3) |
| Start line length/bias from fleet size + LOA | Implemented |
| Mark dependency DAG with AS_LAID vs DESIGNED resolution | Not implemented — offset `1a` etc. are computed directly, not held pending an actual drop report |
| Validation (depth, race-area bounds, hazards, per-role tolerance) | Not implemented — no venue/hazard model yet |
| Venue & fleet setup, multi-session persistence | Not implemented |
| Dispatch, mark-boat navigation, DROP capture | Not implemented |
| As-laid geometry & wind-shift adjustment | Not implemented |
| Sailing-instruction / course-board output, race log | Not implemented (radio-text export exists, which covers part of the "fallback output" feature) |
| Self-calibrating speed model from logged races | Not implemented — needs the race log first |

So the current app is a solid P0 "course design" component; the P0 phase per the spec's
own build order (§12) still needs venue setup, dispatch/navigation, and drop capture
before it's usable end-to-end on the water.

## Signal coverage vs. `docs/courses/`

`docs/courses/` documents far more course-signal variants than `CourseSetter.jsx`
currently computes. The app implements the base case of each family; the finish-type
and modifier variants (`docs/courses/SCHEMA.md` §3, "course signal grammar") are mostly
not yet wired up:

| Family | Documented signals | Implemented in `CourseSetter.jsx` |
|---|---|---|
| windward-leeward | `L` `W` `M` `LA` `WA` `LR` `LG` `WR` `WG` `LS` `LAS` | `L`, `W` only |
| triangle | `T` `TW` `TL` `TR` `TWA` `TLA` `TRA` | `T`, `TW`, `TL` only |
| trapezoid | `I` `O` `IA` `IW` `OW` `IWA` `IS` `OS` | `I`, `O` only (no offset, no windward finish, no slalom) |
| class-specific | `IOD`, Olympic triangle, `C`, `SL`, `TP1` | none |
| random-leg | `X` | none — has no fixed wind-relative geometry, so it needs a different UI (free mark list) rather than the trig pipeline |

Closest, highest-value gaps to close first: the `A` offset-mark modifier (shared
mechanism across all three geometric families — `M1A` support already exists in the
computation chain for trapezoid/windward-leeward, just not exposed for triangle) and
`IOD`, since it's a simple equal-leg 60/120 single-lap triangle and Optimist fleets are
a stated primary user.

## Development

```
npm install
npm run dev
```

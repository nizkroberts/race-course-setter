# Race course setter

A tool for club race officers: turns a signal-boat GPS position, a wind reading, and a
course-type selection (windward/leeward, triangle, or trapezoid) into actual lat/lon mark
positions, a plan-view diagram, a laying order, and radio-callable positions.

Recovered from an earlier Claude (Mac app) session and set up here as a normal Vite +
React project for continued development.

## Structure

- `src/CourseSetter.jsx` — the app (geodesy, course geometry, wind stats, target-time
  solver, plan view, and UI)
- `docs/trapezoid.md` — reference notes on the trapezoid course family (mark geometry,
  rounding orders, race-committee notes). Referenced a sibling `class-specific.md`
  (Optimist trapezoid) that wasn't recovered — may need to be recreated.
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

## Development

```
npm install
npm run dev
```

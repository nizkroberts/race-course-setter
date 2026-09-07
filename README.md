# Race course setter

A tool for club race officers: turns a signal-boat GPS position, a wind reading, and a
course-type selection (windward/leeward, triangle, or trapezoid) into actual lat/lon mark
positions, a course overlaid on a live map, a laying order, and radio-callable positions.

Recovered from an earlier Claude (Mac app) session and set up here as a normal Vite +
React project for continued development.

## Structure

- `src/CourseSetter.jsx` — the app (geodesy, course geometry, wind stats, target-time
  solver, live map view, and UI)
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

`CourseSetter.jsx` now computes every course signal in `docs/courses/` that has a
generic, wind-relative geometry — 28 signals across 20 selectable base courses (the
offset-mark `A` variants are an orthogonal checkbox, not separate dropdown entries;
see the comment above `SEQUENCES` in the source for why):

| Family | Documented signals | Coverage |
|---|---|---|
| windward-leeward | `L` `W` `M` `LA` `WA` `LR` `LG` `WR` `WG` `LS` `LAS` | All 11 |
| triangle | `T` `TW` `TL` `TR` `TWA` `TLA` `TRA` | All 7 |
| trapezoid | `I` `O` `IA` `IW` `OW` `IWA` `IS` `OS` | All 8 |
| class-specific | `IOD`, Olympic triangle (legacy) | Both — `C`, `SL`, `TP1`, Formula Kite etc. deliberately excluded, see below |
| random-leg | `X` | Not implemented — see below |

**Deliberately out of scope**, and why:

- **`C` / `SL` / `TP1` / Moth / Formula Kite / iQFOiL courses** — `class-specific.md`
  says outright these are "class-defined... take geometry from the class association,
  not the general tables." There's no generic formula to implement; supporting one
  would mean encoding each class association's own numbers as a separate data source,
  not a code change to the geometry engine.
- **`X` / random-leg** — has no wind-relative geometry by design (permanent club marks,
  navigation buoys, headlands). It needs an entirely different feature — a free-form
  named-mark list and a course board, not the wind-axis/interior-angle pipeline this
  app is built around.

**Engineering approximations**, where the source docs give qualitative rather than
exact numeric guidance (flagged in code comments at each site): slalom mark spacing
(`LS`/`LAS`/`IS`/`OS` — leg length and angle are adjustable inputs, not fixed
constants, since the docs only say "roughly two minutes total" / "15–20 degrees");
reach-finish placement for `LR`/`LG`/`WR`/`WG`/`TR`; the trapezoid beat-to-finish mark
5 (`IW`/`OW`/`IWA`); and the IOD course, which is built as a true equilateral triangle
(the simplest construction consistent with the doc's own "equal reference distance"
and "equal leg length" constraints) rather than reproducing its literal but internally
inconsistent "60/120" wording.

## Map view

The course overlays on a live [Leaflet](https://leafletjs.com/) map using OpenStreetMap
tiles — no API key or account needed. Google Maps and Apple MapKit JS were the other
options considered; both need a key/token from an account you'd hold (a billed Google
Cloud project, or a paid Apple Developer account with a signed JWT), so OSM was chosen
to keep the app runnable with zero setup. Swapping the tile provider later just means
changing the `L.tileLayer(...)` URL and attribution in `MapView` — the marker/leg
drawing code doesn't care which tiles sit underneath it.

The map is created once and never torn down on re-render, so panning/zooming survives
every input tweak elsewhere in the app; marks and legs redraw in place, and the view
only auto-fits to the course the first time (a "Center on course" button re-fits on
demand after that).

## Development

```
npm install
npm run dev
```

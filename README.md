# Race course setter

A tool for club race officers: turns a signal-boat GPS position, a wind reading, and a
course-type selection (windward/leeward, triangle, or trapezoid) into actual lat/lon mark
positions, a course overlaid on a live map, a laying order, and radio-callable positions —
plus a second tab that navigates a mark boat to any one of those computed positions.

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

**Icons** follow real buoy conventions rather than the app's own port/starboard
red-green scheme (that stays on the "marks in laying order" table, where rounding side
is the point): the RC boat is a draggable boat icon — drag it to reposition the signal
boat, which recomputes the whole course from wherever you drop it; start and finish
line ends and the offset mark (1a) are orange circles; every other physical mark is an
orange tetrahedron. Classification is by each mark's `role` string (`isCircleMark()` in
`MapView`), not a hardcoded id list, so it holds for every course family without
per-signal special-casing.

## Per-course configurability

Most inputs in the app are global — one "line to first mark" distance, one "offset
distance", used by every course that reads them. `COURSE_OPTIONS` is the opposite: a
declarative, per-course list of parameters, each with its own independently-remembered
value, shown in a "Course options" panel that only appears for courses that define one.
Switching from a configured course to another and back doesn't lose its settings.

Every **windward/leeward course** (`L`, `W`, `M`, `LR`, `LG`, `WR`, `WG`, `LS`) is wired
up this way now — each with its own **distance to gate from start line**
(`gateDist`, overriding the shared start-offset for that course only), and, where it
applies:

- **Include windward offset** (`includeOffset` / `offsetDist` / `offsetAngle`) — `L`,
  `W`, `M`, `LR`, `LG`, `LS`. Not offered for `WR`/`WG`: the windward mark there is
  already a twin gate, and the source docs give no anchor for where a 1a would sit
  relative to a *pair* of marks instead of one.
- **Angle of reach off the wind** and **length of reach to finish** (`reachAngle` /
  `reachLength`) — `LR`, `LG`, `WR`, `WG`. The finish becomes a real reach leg off the
  actual gate mark at the requested angle and length, replacing the generic "toward the
  start line" heuristic every other reach finish (`TR`, and the two not yet configured)
  still uses.
- **Distance from windward mark to finish** (`finishOffset`) — `W` only. Previously the
  same shared value did both this job and the gate-distance job above; now they're
  independent.
- **Finish distance after slalom**, **slalom leg length**, **slalom angle between
  marks** — `LS` only, each its own copy of the fields `IS`/`OS` still share globally.

None of this changed any course's *default* geometry — every default reproduces the
prior shared-global output exactly (verified: see below).

Extending another course to this pattern is two steps:

1. Add an entry to `COURSE_OPTIONS[SIGNAL]` — reusing an existing field name
   (`offsetDist`, `slalomLegDist`, ...) opts that course into a mechanism that already
   exists elsewhere in `computeCourse`, with its own stored value (free — `GATE_DIST_OPT`
   / `OFFSET_OPTS` / `REACH_OPTS` are ready-made spreadable groups for the three
   mechanisms every windward/leeward course above uses). A genuinely new concept (like
   `reachAngle` originally was) needs `computeCourse` taught what to do with it once.
2. Nothing else — the options panel, per-course storage, and hide-the-superseded-global-
   row logic (`showGateDist`, `showFinishDist`, `showSlalom`) all key off
   `COURSE_OPTIONS` and `getCourseParam()` generically.

**A bug this caught:** `gateDist` was only wired into the `wl`/`trap` branch of
`computeCourse`'s reference-point calculation, not the separate `wlTwin` branch `WR`/`WG`
use — so their own "distance to gate" option silently did nothing until a dedicated
regression check (comparing gate position with and without a custom `gateDist`, not just
"does it produce finite output") caught it. Worth remembering when adding the next course:
non-crashing isn't the same as correct, and each new mechanism needs a check that would
actually fail if the wiring were missing.

## Mark Setter tab

A second tab (`MarkSetterTab`), alongside Course Design, for actually laying a mark:
pick one of the current course's designed positions from a dropdown, and it turns "get
there" into a distance in metres and a bearing to steer, on a zoomed-in map showing the
target and a "good enough" tolerance circle around it (radius from `markTolerance()` —
the functionality spec's per-role tolerance model: ±25 m for a windward/gate mark,
±20 m for a wing/reach mark, ±10 m for a start/finish line end, ±8 m for the offset,
±5 m for a slalom mark).

"Current position" is independent of the Course Design tab's signal boat — it's a
different boat. **Track my position** starts a live `watchPosition()` GPS feed;
dragging the boat icon on the map (or just not tracking) sets it manually instead, the
same drag-to-set pattern the signal boat already uses. The map auto-fits to keep both
the boat and the target in view as either moves — deliberately different from Course
Design's map, which never auto-recenters once a course is drawn: here the point *is* to
follow you while you're actually in transit (an **auto-center** checkbox turns it off
if that's not wanted). The bearing readout drives a fixed, north-up compass rose with a
rotating arrow — there's no heading sensor available in a browser, only a GPS fix, so
this shows *bearing to steer toward the mark*, the way a simple handheld GPS's
"bearing to waypoint" works, not a boat-relative pointer.

**Known limitation:** this reads the course's *designed* positions only. It doesn't yet
know that an out-of-tolerance drop on one mark should shift a dependent one (the offset
1a is defined relative to mark 1 *as actually laid*, not as designed) — that's the
AS_LAID vs. DESIGNED mark dependency DAG from the functionality spec (§3, "the mark
dependency DAG"), still unbuilt. Every mark this tab points to is exactly where Course
Design says it should be, not where an already-laid neighbor actually ended up.

## Development

```
npm install
npm run dev
```

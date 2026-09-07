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

`I`/`O` (plain trapezoid, no offset/beat-to-finish/slalom variant) picked up **angle of
reach** / **length of reach to finish** the same way — and needed a real fix alongside
it, not just new options. Their `SEQUENCES` entries ended in the full gate `G3` (a
pass-through), and `finish: "trapFinish"` placed the line square to the wind downwind of
it — but the original `trapezoid.md` this app was built from documents `I2` as
`Start – 1 – 4s/4p – 1 – 2 – 3p – Finish`: a *single* mark (`3p`, always left to port),
because the leg to the finish is a reach, the same convention `IW`/`OW`/`IS`/`OS` already
followed correctly. Fixed by changing the trailing token to `G3p` and switching
`finish` to `reachGate` (the exact mechanism `LR` already uses, generalized in
`computeCourse`'s `reachGate` case to pick gate `G3` for the trapezoid family instead of
`G4`) — so `I`/`O` now share the same reach-finish machinery as `LR`, per the docs, not
a bespoke one that had quietly drifted from them.

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
target and a "good enough" tolerance circle around it.

**Tolerance is computed dynamically, not a flat number per role** (`markTolerance()`).
The functionality spec's own tolerance table (§7) offers flat distances — ±25 m
windward/gate, ±20 m wing/reach — but its actual recommendation is to compute
tolerance as "the position error that produces a defined angular error at the relevant
vertex... the numbers stay correct when someone sets an unusually short beat," which
the flat table doesn't do. `markTolerance()` follows that instead: for a windward mark,
a leeward gate, or a wing/reach mark, it finds the real leg in the current course that
depends on that mark's position (`course.legs.find(l => l.to.id === ...)`, falling back
to a gate's virtual centre for a physical sub-mark like `G4p`, which isn't usually a leg
endpoint itself) and asks how far off that mark can be before it skews that leg by more
than `TOL_ANGLE_DEG` (0.5°, a full order of magnitude under `windward-leeward.md`'s own
"5 degrees turns a beat into a one-tack fetch"), floored at `TOL_MIN_M` (5 m — tighter
than a handheld GPS can reliably hit anyway). Result: a windward mark on a typical
0.5–1nm club beat now reads roughly 9–17 m, not a flat 25 — the flat number was loosest
exactly where it mattered most, on the shorter beats most club racing actually sails.
The offset (8 m), slalom marks (5 m), and start/finish line ends (10 m) keep the spec's
flat figures — their legs are short and largely fixed-length regardless of beat, so the
angular formula would only ever collapse to the same 5 m floor anyway (verified before
keeping the simpler flat number, rather than assuming).

"Current position" is independent of the Course Design tab's signal boat — it's a
different boat. **Track my position** starts a live `watchPosition()` GPS feed;
dragging the boat icon on the map (or just not tracking) sets it manually instead, the
same drag-to-set pattern the signal boat already uses. The map auto-fits to keep both
the boat and the target in view as either moves — deliberately different from Course
Design's map, which never auto-recenters once a course is drawn: here the point *is* to
follow you while you're actually in transit (an **auto-center** checkbox turns it off
if that's not wanted).

The **RC boat** itself also shows on this map — at whatever position it's set to on the
Course Design tab, kept in sync live if you switch tabs and move it — as a grey,
non-interactive reference point (`refBoatIcon`; the same hull shape as the blue,
draggable "your position" one, just muted, so it never reads as something you can drag
here). It doesn't factor into the auto-fit bounds — the map stays zoomed to the target
and your own position, which is the point of this screen, rather than pulling out wide
whenever the RC boat happens to be far from the mark being set.

The bearing readout drives a fixed, north-up compass rose with a
rotating arrow — there's no heading sensor available in a browser, only a GPS fix, so
this shows *bearing to steer toward the mark*, the way a simple handheld GPS's
"bearing to waypoint" works, not a boat-relative pointer.

**Known limitation:** this reads the course's *designed* positions only. It doesn't yet
know that an out-of-tolerance drop on one mark should shift a dependent one (the offset
1a is defined relative to mark 1 *as actually laid*, not as designed) — that's the
AS_LAID vs. DESIGNED mark dependency DAG from the functionality spec (§3, "the mark
dependency DAG"), still unbuilt. Every mark this tab points to is exactly where Course
Design says it should be, not where an already-laid neighbor actually ended up.

## Saved courses

The "Saved courses" panel (top of Course Design) persists to `localStorage` — durable
across reloads and restarts, private to this browser, no backend. `SAVE_FIELDS` lists
every design INPUT that determines the computed course (signal boat position, wind,
course signal/beats/offset, length settings, all per-course options) and is what
actually gets saved — not the computed marks themselves, so a saved course still
reflects any later improvements to how positions are computed, the same way today's
courses do. Excluded deliberately: live/session-only state (GPS fix details, logged
wind readings, the "copied" flash) that isn't "the course as designed." Save-by-name
overwrites (confirmed) if the name already exists; load and delete are direct. Reading
and writing both fail soft (try/catch around `localStorage`, `[]` on any parse error)
rather than crash the app if storage is disabled, full, or unavailable (private
browsing, some embedded contexts).

## Wind shift overlay

The Wind Shift tab computes a second course — same signal, beats, offset, beat length,
everything except the wind axis — and shows how far off every mark would be without
touching the actual design. The table there is always live (cheap to compute, so it
updates as you type); a separate **"Show overlay on Course Design map"** checkbox
controls whether it's also drawn there, since that's the view that gets busier. The new
axis input tracks the real one until you actually type a different value — so opening
the tab without touching anything shows "no difference," not a comparison against a
stale default from whenever the app first loaded.

On the map, the overlay is its own Leaflet layer group (`overlayLayerRef`), separate from
the main course's — it's cleared and redrawn independently, and deliberately excluded
from both "Center on course" and the first-load auto-fit, since a ghost mark can land
well outside the real course and shouldn't be able to zoom the view out to include it.
Each ghost mark reuses the same tetrahedron/circle icons at reduced opacity (Leaflet's
per-marker `opacity` option — no separate faded icon asset needed) with a thin amber
dashed line back to that mark's real position, so "how wrong" reads as a displacement,
not just a second set of positions to mentally diff against the first.

## Laylines to the first windward mark

Drawn on the Course Design map at all times (not gated to the Wind Shift tab) —
`computeLaylines()` returns the two laylines through mark 1: each extends from the mark
out to the "one tack" point, the point where a boat on the *other* tack, sailing from
the start, would just reach it — using an assumed, adjustable tacking angle
(`tackAngle`, degrees off the wind per tack, on the Wind Shift tab, since that's where
"wind stuff" already lives even though the laylines themselves aren't confined there).
The wind axis they're computed against is the real one normally; turning the Wind Shift
overlay on switches both to the hypothetical axis instead, so the same laylines respond
to it. Each is coloured by which tack sails it (green/red, the same port/starboard
convention the marks-table chips already use) and labelled with its length. Returns
`null` for a course with no single windward mark to aim at (the twin-gate
windward-family courses, `WR`/`WG`).

`computeLaylines()` itself still returns the full construction — each route's opening
leg (start to the layline) and closing leg (layline to the mark) — since that's what the
"one tack point" is defined against and what the Wind Shift tab's tack-distance summary
still reads from; only the *map drawing* was simplified to just the two mark-to-turning-
point segments, on request, once it became clear the start-to-turning-point opening legs
weren't the useful part to actually look at on the map.

**Laylines are computed against the CURRENT course's actual mark 1 and start line, not
`shiftedCourse`** — only the tack headings use the new wind axis. This was a real bug in
the first version: it used `shiftedCourse`, which re-lays mark 1 square to the new wind
by construction, so the two tacks came out symmetric regardless of how far the wind had
supposedly shifted — the laylines were answering "how would I lay out a fresh course for
this wind," which the ghost-mark overlay already shows, not "how would sailing to the
mark that's actually there change if the wind shifted," which is the point of a layline.
Fixed by passing `course` (the real one) instead — confirmed with a sweep of assumed
wind angles against a fixed mark: symmetric at zero shift, diverging sharply as the
shift grows (e.g. roughly even down to a 400 m / 1730 m split at a 20-degree shift).

Geometry: two 2D line intersections (`localXY`/`fromXY`, a local flat-earth projection —
accurate to well under a metre at course scale, the same order of approximation
`destination()`/`inverse()` already accept) between a ray from the start at one tack
heading and the *other* tack's layline (the full line through the mark at that bearing).

**A property worth knowing, not a bug:** the two routes' *total* distances always come
out equal, regardless of the wind axis — route 2 is the mirror image of route 1 across
the start-to-mark line, so a wind shift doesn't change the total, only how it splits
between the two tacks (confirmed with a fake-axis sweep from 0° to 165° off the mark's
true bearing — total stayed within numerical noise of equal throughout, while the
individual leg lengths swung from roughly even to a 400 m / 1860 m split). The tab's
summary reports that split — starboard-tack distance vs. port-tack distance — not the
(always-equal, and therefore uninformative) route totals; an earlier version of this
compared totals and would have always reported "0 m difference," caught before shipping
by testing the actual numbers rather than assuming the first framing that seemed
intuitive was the informative one.

## Maps copy/paste

Degrees-decimal-minutes ("W 078° 42.507'", `toDDM()`) is right for reading aloud over
VHF, but Google and Apple Maps' search boxes both want plain decimal degrees
(`toDecimal()`, "-78.708450") — pasting a DDM string into either doesn't work. The
"Marks, in laying order" table (Course Design) and the Mark Setter tab's target readout
both got a **Copy** button (puts decimal degrees on the clipboard) and an **Open**
link (`googleMapsUrl()`, a `maps.google.com?q=lat,lon` deep link — opens the position
directly, sidestepping the paste/parse step entirely for anyone with the app or a
browser tab handy). The DDM display and the radio-text block are unchanged — that
format is still correct for its actual purpose, reading a position aloud.

## Course code

A "Course code" panel (Course Design, next to Saved Courses) turns the design inputs
into a short, portable text string — for reading over the radio, texting, or pasting
between independent instances of the app, as opposed to Saved Courses' `localStorage`
persistence (which never leaves this browser). `encodeCourseCode()` / `decodeCourseCode()`
cover the same ground as `SAVE_FIELDS`, minus pure display prefs (`showMag`/`variation`
change how numbers are shown, not where marks are) and the manual speed override (kept
out purely for length — dropping it was the one real fidelity trade made here), scoped
to only the *currently selected* course's own `courseParams`, not every signal ever
touched this session.

**Short by construction, not compression**: every field is written only when it differs
from a documented default (`CODE_FIELDS`), so a plain, mostly-default course encodes to
`RC1;la=44.4;lo=-78.7#t6` — ~25 characters — while a heavily customized one (a
non-default signal, five course-specific options, several global overrides) still comes
in under 160, a single SMS segment, in testing. Latitude/longitude are the one exception,
always written — a course without a position isn't a course — at 5 decimal places
(~1 m), tighter than any tolerance this app itself computes.

A trailing 2-character checksum (`checksum()`, a cheap non-cryptographic rolling hash —
plenty for catching a truncated paste or a mistyped digit, the realistic failure modes
for a string handed over by text message) is verified before anything is applied; a
mismatch or malformed string is rejected with a specific reason rather than silently
producing a wrong course. Verified: round-tripping a heavily customized course through
encode → decode → apply reproduces mark 1's position to within 0.3 m of the original
(consistent with the deliberate 5-decimal-place trim, not a bug); truncated, corrupted,
garbage, and empty input are all correctly rejected with a specific error each.

## Collapsible panels

Course Design's left column accumulated eight panels (Saved Courses, Course Code,
Signal Boat, Wind, Course, Course Options, Length, Line and Marks) — enough that seeing
every field at once stopped being the point. `CollapsiblePanel` wraps each one: click the
header (or its +/− indicator) to tuck the body away to just the title. Each instance owns
its own open/closed state — nothing coordinates them, and nothing needs to. Saved
Courses and Course Code (the newest, most occasional panels — most sessions touch them
never or once) default collapsed; the five original design panels default open, so nothing
about the DEFAULT view changes, only what's now possible to tuck away.

## Development

```
npm install
npm run dev
```

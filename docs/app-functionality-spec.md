# Race Course Setting App — Functionality Spec

**Status:** Draft v0.1
**Primary user:** Club race officers and volunteer race teams
**Platform assumption:** Connected phones on the signal boat and every mark boat, app-to-app sync via server
**Scope:** Course design, mark position computation, dispatch to mark boats, as-laid verification, and in-race adjustment

---

## 1. Design principles

These follow from the user being a volunteer, not a professional race officer, and they should be used to settle arguments later in the build.

**Prescriptive over configurable.** The app should have an opinion. A volunteer RO on a windy Tuesday evening does not want a settings screen; they want four taps and a set of positions they can trust. Every parameter needs a defensible default derived from the class, the fleet size, and the wind. Advanced overrides exist but live behind a disclosure.

**Show the working.** Trust is the adoption barrier. An RO who does not understand where a number came from will fall back to their laminated card. Every computed value should be inspectable — tap the beat length, see the target time and class assumption that produced it.

**Surface uncertainty, don't hide it.** A single averaged wind direction presented as a clean number is a lie when the breeze is oscillating 25 degrees. The UI must make instability visible *before* the RO commits to an axis.

**The water comes first.** A mark boat driver looking at a phone in chop is a hazard the app created. Navigation displays must be glanceable — large targets, high contrast, audio cues — and the app should never require sustained attention while a boat is moving.

---

## 2. Core computation chain

```
Signal boat GPS fix
  │
  ├─ anchor swing correction ──────────► captured reference fix
  │
  ├─ wind axis (committed) ─────────────┐
  │                                     │
  ├─ fleet size + LOA ──► line length ──┤
  │                                     ▼
  └──────────────────────► start line (pin + signal ends, with bias)
                                        │
                                        ▼
                              COURSE REFERENCE POINT
                            (varies by course family)
                                        │
                                        ▼
                          mark dependency DAG resolution
                                        │
                                        ▼
                        designed positions for every mark
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
              validation          assignment          dispatch
            (depth, bounds)     (boat, order)      (live nav)
                                                            │
                                                            ▼
                                                    as-laid capture
                                                            │
                                                            ▼
                                              actual geometry + tolerance
```

The critical modelling point: **the signal boat is not the reference point.** It is one end of the start line. The reference point is derived from it, and where it sits depends on the course family — the leeward gate for windward/leeward and trapezoid courses, the middle of the starting line for course `T` and the Optimist `IOD`. World Sailing publishes a table for deriving the reference from the signal boat position given the start line length; that derivation is a first-class step in the pipeline, not an implementation detail.

---

## 3. Domain model

### CourseTemplate

Parametric, not a table of pre-computed positions.

```
CourseTemplate
  id, family, signal_codes[]
  reference_point_rule      # which mark or construction defines the origin
  interior_angles{}         # by fleet type: spinnaker / non-spinnaker
  leg_ratios{}              # each leg as a fraction of beat length
  mark_defs[]               # see MarkDef
  rounding_orders{}         # signal → sequence, per beat count
  constraints[]             # e.g. "reach must remain 45-75 deg"
```

```
MarkDef
  designation               # 1, 1a, 2, 3s, 3p, 4s, 4p, 5, S1-S3, SS, SP, FS, FP
  role                      # windward | offset | wing | gate | start | finish | slalom
  parent                    # null = resolves off reference point
  parent_resolution         # DESIGNED | AS_LAID
  bearing_rule              # expression in wind axis + interior angles
  distance_rule             # expression in beat length + leg ratios
  tolerance_m               # per-role, see §7
```

**Recommendation: compute geometry trigonometrically from interior angles and leg ratios. Do not hardcode the published course tables.** Use those tables as regression fixtures instead. The payoff is that arbitrary reach angles and leg-length conventions come for free, and you get a test suite that proves conformance to the standard.

### Other entities

```
CourseInstance     template + beat_length + wind_axis + reference_fix + beats
Mark               designation, designed_pos, laid_pos, laid_at, laid_by,
                   gps_accuracy_m, status
WindObservation    direction, speed, source, timestamp, reference (true|magnetic)
Boat               id, role (signal|mark), live_pos, assigned_marks[], battery
Venue              default_variation, race_area_polygon, depth_grid,
                   permanent_marks[], hazards[]
FleetProfile       classes[], entry_count, mean_LOA, spinnaker (bool)
```

### The mark dependency DAG

Marks do not all hang off the reference point. The offset `1a` is defined relative to mark `1`. The finish on a trapezoid is laid using mark `3` as a guide. This is a directed acyclic graph, and each edge carries a resolution mode:

| Relationship | Resolution | Why |
|---|---|---|
| `1a` → `1` | AS_LAID | The offset must follow the actual windward mark or the rounding geometry is wrong |
| Finish → `3` | AS_LAID | The finish is positioned relative to a real object on the water |
| `1` → reference | DESIGNED | Independent derivation prevents error compounding down the course |
| Gate `4` → reference | DESIGNED | Same |
| Slalom `S1`–`S3` → gate | AS_LAID | Short legs, tight angles, error accumulates fast |

Rule of thumb: long legs resolve independently off the reference, short legs resolve off their as-laid parent.

---

## 4. Feature: Venue and fleet setup

**Priority: P0**

One-time configuration per club, edited rarely.

- Race area boundary polygon
- Depth grid or minimum-depth contour (mark boats need to know they can anchor)
- Permanent marks and hazards, for collision checking
- Magnetic variation, with an update reminder
- Default course families for this venue
- Class list with speed profiles (see §6)

Per-session:

- Which classes are racing, entry count per class, whether spinnakers are flown
- Number of mark boats available and who is driving

Fleet size and mean LOA drive start line length. Spinnaker status drives trapezoid interior angles — a 10-degree difference that decides whether the first reach is a reach or a fetch.

---

## 5. Feature: Wind axis capture

**Priority: P0. This is the largest error source in the entire system.**

### Inputs

| Source | Notes |
|---|---|
| Signal boat masthead instrument | Continuous, but affected by boat swing and mast wake |
| Handbearing compass sighting | Manual entry; the RO points at the wind and enters a number |
| Mark boat readings | Valuable — gives spatial spread across the race area |
| Forecast / weather service | Context only, never used for computation |

### Behaviour

- Rolling window, default 10 minutes, configurable
- Display **median, min, max, and oscillation period** — not just a mean
- Plot the last 30 minutes as a strip chart. An RO should be able to see at a glance whether the breeze is oscillating, trending, or steady
- Flag when spread exceeds a threshold (suggest 15 degrees) with a plain-language warning: *"Wind has swung 22° in the last 10 minutes. A trapezoid will not stay square — consider a windward/leeward."*
- Spatial disagreement alert: if mark boats at opposite ends of the area report directions differing by more than a threshold, say so. That is a wind bend, and it changes where the course should go, not just how it should be oriented
- **Commit axis** is an explicit, timestamped action. Everything downstream references the committed axis, not the live reading

### True vs magnetic

Store a single internal representation — recommend **true** — with venue variation applied at the boundary. Every input field and every display must be explicitly labelled. This is a small feature that will otherwise generate support tickets forever, because handbearing compasses read magnetic, phone compasses can be either, and published course tables are unlabelled.

---

## 6. Feature: Course design

**Priority: P0**

### Selection

Pick family, then signal, then beat count. Present families in club-relevant order — windward/leeward and triangle first, trapezoid behind a "more" disclosure, since a club with two mark boats will rarely lay a trapezoid.

Filter the list by feasibility: if the race area cannot hold the course at any sensible beat length, do not offer it.

### Beat length

Two modes:

**Manual** — RO enters a distance.

**Solve from target time** — RO enters a target elapsed time for the leading boat; the app returns the beat length. This is the mode most people will use.

The solver needs a speed model per class. Recommended approach, in order of increasing sophistication:

1. **Seed** from the published World Sailing course-length-versus-time tables
2. **Editable** per venue, because a tidal estuary and an inland lake behave differently
3. **Self-calibrating** — log actual elapsed times against designed course lengths and wind speeds, and refine the model per class per venue over a season

Point 3 is the feature that would make this app genuinely better than a laminated card, and it is nearly free once the logging in §10 exists.

### Start line

- Length = entry count × mean LOA × factor (default 1.25–1.5, configurable)
- Square to the committed wind axis, with configurable port-end bias in degrees (default a small bias to encourage a spread start)
- Output: pin position, as a mark to be laid like any other

### Live preview

Chart view with the course overlaid, depth shading, race area boundary, and hazards. Marks that fail validation render in a warning state with the reason attached.

---

## 7. Feature: Mark computation and validation

**Priority: P0**

### Geodesy

Direct geodetic problem on WGS84. Vincenty direct is appropriate and cheap; distances here are under 3 nm so the difference from a spherical model is small, but bearings matter and there is no reason to accept avoidable error.

Resolve the mark DAG in topological order. Marks with `parent_resolution = AS_LAID` remain unresolved until their parent reports a drop — the UI should show them as pending rather than as computed positions.

### Validation checks

Run on every computed mark:

| Check | Failure action |
|---|---|
| Depth within anchorable range | Warn, suggest shifted position |
| Inside race area boundary | Block |
| Clear of charted hazards | Block |
| Not conflicting with a permanent mark | Warn |
| Clear of traffic separation / channel | Warn, prominent |
| Leg lengths within course constraints | Warn |

### Tolerance model

**Express tolerance per mark role, not as a single global distance.** The reason is that positional error matters in proportion to leg length. A 20 m lateral error on a 1 nm beat is roughly 0.6 degrees of skew and is irrelevant. The same 20 m error on a 60 m offset mark destroys the geometry the offset exists to create.

| Role | Suggested tolerance | Rationale |
|---|---|---|
| Windward, leeward gate | ±25 m | Long legs absorb it |
| Wing / reach mark | ±20 m | Sets the reach angle |
| Offset `1a` | ±8 m | Very short leg |
| Slalom marks | ±5 m | Very short legs, tight angles |
| Start / finish line ends | ±10 m | Affects line bias directly |

Better still: compute tolerance dynamically as the position error that produces a defined angular error at the relevant vertex, and present it as a distance. Then the numbers stay correct when someone sets an unusually short beat.

---

## 8. Feature: Dispatch and mark boat navigation

**Priority: P0**

### Assignment

Auto-assign by proximity and dependency order, with manual override by drag. Most clubs have one or two mark boats, so the common case is a single boat laying an ordered route.

Laying order respects two constraints:

1. **Dependency** — a mark resolving AS_LAID against a parent cannot be laid before its parent
2. **Efficiency** — minimise travel, given (1)

For a standard windward/leeward with one boat this produces the natural order: gate first (it is near the signal boat and is the reference), then the windward mark, then the offset, then the pin.

### Mark boat view

The default screen while under way is a single navigation display:

- Large directional arrow, bearing and distance to the assigned mark
- Distance in metres under 500 m, otherwise nautical miles
- ETA at current speed
- Audio cue on approach, so the driver does not need to watch the screen

**Approach mode** engages inside roughly 50 m: switch to a fine-guidance display showing cross-track offset, current drift vector, and GPS accuracy.

### Drop

A single large `DROP` button, usable with wet hands and gloves.

- Records position, timestamp, boat, and GPS accuracy
- **Blocks if GPS accuracy is worse than a threshold** (suggest 10 m) with a clear message rather than silently recording a bad fix
- Immediately computes error against the designed position and shows it: *"Mark 1 laid. 12 m east of target. Within tolerance."*
- Triggers resolution of any dependent marks and pushes their positions

### Fallback output

Even with reliable connectivity, provide lat/long in degrees-decimal-minutes formatted for reading aloud over VHF, and GPX export. Radios work when phones are wet, flat, or overboard.

---

## 9. Feature: As-laid verification and adjustment

**Priority: P1**

### Actual geometry

Once marks are laid, compute and display the course as it actually exists, not as designed:

- Actual beat bearing versus current wind axis — the "square" check
- Actual interior angles at each vertex
- Actual leg lengths and total course length
- Revised elapsed-time estimate

This is the highest-value screen in the app for an experienced RO. *"Your beat is 6° skewed and your first reach is 52°, not 60°"* is what informs the decision to re-lay, and no laminated card can produce it.

### Wind shift adjustment

Given a new committed axis, compute the delta for every mark and present:

- Which marks must move, and by how far and in what direction
- The consequence of a partial fix, stated plainly: *"Moving mark 1 alone squares the beat but leaves reach 1 at 51°. To restore the trapezoid you must also move mark 2 and gate 3."*
- Estimated time to complete, given mark boat positions

This directly encodes the family-specific behaviour documented in the course files: a windward/leeward is corrected by moving one mark, a trapezoid is not.

### Shorten course

Show which marks can legally serve as a finish for the current course and signal, and what the resulting course length and elapsed time would be.

---

## 10. Feature: Documentation and records

**Priority: P1**

### Sailing instruction output

Generate the course description text: designation, mark rounding sequence for the selected beat count, and mark descriptions by size, colour, and shape as the convention requires. Copy to clipboard or export.

### Course board

Display what should be shown on the signal boat board — course signal and beat count — in a large, readable format, so a phone propped in the cockpit can serve as the board itself if needed.

### Race log

Per race, retain:

- Wind history and the committed axis, with timestamps
- Designed and as-laid position for every mark, with who laid it and when
- Any adjustments made during the race, with reasons
- Actual elapsed times

This log serves three purposes: post-race review, evidence in the event of a protest about course laying, and — most valuably — training data for the self-calibrating speed model in §6.

---

## 11. Known hard problems

Flagged early because each one will otherwise surface late and expensively.

**Anchor swing.** The signal boat swings on its rode. An instantaneous GPS fix can be tens of metres from where the boat sat a minute ago, and the whole course is projected from it. Capture a reference fix explicitly, monitor drift against it, and warn when the boat has moved beyond a threshold since capture. Do not compute from a live fix.

**Magnetic versus true.** Covered in §5. Cheap to solve now, expensive to retrofit.

**Phone GPS accuracy.** Typically 3–5 m in the open, worse near structures or in heavy rain. Always capture and store the reported accuracy alongside the position, always display it in approach mode, and block drops below threshold.

**Battery and environment.** Long race days, wet hands, bright sun, cold. Minimise screen-on time by design — the audio approach cue exists partly for this reason. Assume the driver has gloves on.

**Safety.** The app must never be the reason someone is looking down instead of ahead. Consider a transit lock that reduces the display to the arrow and distance above a speed threshold, and lean on audio for anything that would otherwise require reading.

**Tide and current.** Out of scope for v1, but it affects start line placement and the effective squareness of the beat. Design the wind axis model so a current vector can be layered in later without rework.

---

## 12. Suggested build order

| Phase | Contents |
|---|---|
| **P0 — core loop** | Venue setup, wind capture, windward/leeward and triangle families, mark computation, dispatch, navigation, drop capture |
| **P1 — the reason to keep using it** | As-laid geometry, shift adjustment, race log, SI output |
| **P2 — depth** | Trapezoid and class-specific families, self-calibrating speed model, shorten course, GPX export |
| **P3 — later** | Current modelling, multi-class rolling start sequencing, results integration |

Ship P0 to one friendly club and watch them use it on the water before building P1. The wind capture UI in particular will not survive contact with a real race officer in its first form.

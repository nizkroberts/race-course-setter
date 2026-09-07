---
id: triangle
name: Triangle
family: triangle
signal_codes: [T, TW, TL, TR, TWA, TLA, TRA]
status: current
spinnaker: either
beats: 1-4
laps: 1-4
typical_classes: [club handicap fleets, OK Dinghy, Enterprise, Wayfarer, GP14, cruiser-racers, most inland club racing]
target_time: 45-75
governing_reference: World Sailing Race Management Manual, Appendix 1
---

# Triangle

## Summary

A beat to a windward mark, a reach to a wing mark, a second reach back to a leeward
mark, with subsequent laps usually sailed as windward/leeward. Standard geometry is
45 / 90 / 45 degrees. The triangle's advantage over a windward/leeward is that it keeps
boats moving in light air — nobody sits becalmed on a dead run — and it sends the
leaders away from the tail of the fleet still beating, which thins out mark roundings.
Its disadvantage is that the reaching legs are a procession. It has largely been
displaced at championship level but remains the workhorse of club racing, where those
tradeoffs land differently.

## Diagram

Course `TL` / `TW`, the standard form, with the wing mark to port.

```
                 WIND
                  |||
                  vvv

                  O 1
                 /|
               /  |
             /    |
           /      |     beat
    2 O          45 deg
           \      |
             \    |
               \  |
                 \|
        3s O------O------O 3p
                  |
              0.05 nm
                  |
        SP O =====+===== O SS
              START
```

Legs: beat `3` to `1`, reach `1` to `2`, reach `2` to `3`. The interior angle at `1` is
45 degrees, at `2` is 90 degrees, at `3` is 45 degrees.

Course `T`, with the start and finish in the middle of the beat — the club-racing
layout, committee boat stationed mid-course:

```
                 WIND
                  |||
                  vvv

                  O 1
                 /|
               /  |
             /    |
           /      |
    2 O    SP O===+===O SS
           \   START / FINISH
             \    |
               \  |
                 \|
                  O 3
```

Course `TR`, reaching finish — the finish line is placed off the wing mark, so the last
leg is the reach from `1` to `2`:

```
                  O 1
                 /|
               /  |
             /    |
    2 O    /      |
      |    \      |
   FP O=O FS \    |
      FINISH  \   |
                 \|
        3s O------O------O 3p
                  |
        SP O =====+===== O SS
```

## Marks

| Mark | Role | Rounding | Position | Notes |
|---|---|---|---|---|
| `1` | Windward | Port | Directly upwind of mark `3` / gate | 45-degree interior angle |
| `1a` | Offset | Port | 80–90 degrees off the wind from `1` | `A` variants only |
| `2` | Wing / gybe mark | Port | Off to one side, 90-degree interior angle | The gybe happens here; the name "gybe mark" is common informally |
| `3` or `3s` / `3p` | Leeward, single mark or gate | Port, or gate | Directly downwind of `1` | On `TW`/`TL` the first rounding is `3s` left to port; later laps use the full gate |
| `SS` / `SP` | Start line ends | n/a | 0.05 nm downwind of `3s`/`3p`, or mid-beat on course `T` | |
| `FS` / `FP` | Finish line ends | n/a | Varies by variant | |

## Geometry

**Reference point** — the middle of the `3s`/`3p` gate for `TW`/`TL`/`TR`. For course
`T`, the reference is the **middle of the starting line**, which sits mid-beat; project
its location using wind axis minus 90 degrees and half the start line length.

### Interior angles

Standard is **45 / 90 / 45**. This makes both reaches equal, at 0.707 × the beat length.

| Vertex | Angle |
|---|---|
| Mark `1` (windward) | 45 degrees |
| Mark `2` (wing) | 90 degrees |
| Mark `3` (leeward) | 45 degrees |

An equilateral 60/60/60 triangle is also seen in club practice, giving broader, less
tactical reaches and a shorter total lap. The Olympic triangle used 45/90/45.

### Leg lengths

| Leg | Length |
|---|---|
| `3` – `1` (beat) | 1.0 × beat |
| `1` – `2` (first reach) | 0.707 × beat |
| `2` – `3` (second reach) | 0.707 × beat |

### Distances

| Quantity | Value |
|---|---|
| Start line offset (`TW`/`TL`) | 0.05 nm downwind of gate `3s`/`3p` |
| Finish offset (`TW`) | 0.05 nm upwind of mark `1` |
| Offset mark `1a` | 80–90 degrees off the wind, ~40–60 m |

### Course length tables

45/90/45, from the source tables:

| Beat (nm) | Reach | TL2 | TL3 | TL4 | TW2 | TW3 | TW4 |
|---|---|---|---|---|---|---|---|
| 0.50 | 0.35 | 2.30 | 3.30 | 4.50 | 1.80 | 2.80 | 4.00 |
| 0.80 | 0.57 | 3.64 | 5.24 | 7.18 | 2.84 | 4.44 | 6.38 |
| 1.00 | 0.71 | 4.52 | 6.52 | 8.94 | 3.52 | 5.52 | 7.94 |
| 1.50 | 1.06 | 6.72 | 9.72 | 13.34 | 5.22 | 8.22 | 11.84 |

Course `T` (start/finish mid-beat):

| Beat leg (nm) | Reach | T1 | T2 | T3 |
|---|---|---|---|---|
| 0.50 | 0.71 | 2.90 | 5.30 | 8.20 |
| 0.80 | 1.13 | 3.86 | 7.06 | 10.92 |
| 1.00 | 1.41 | 4.82 | 8.82 | 13.64 |
| 1.50 | 2.12 | 7.24 | 13.24 | 20.48 |

## Rounding orders

**Course `TW` — windward finish**

| Signal | Beats | Sequence |
|---|---|---|
| `TW2` | 2 | Start – 1 – 2 – 3s (to port) – Finish |
| `TW3` | 3 | Start – 1 – 2 – 3s (to port) – 1 – 3s/3p – Finish |
| `TW4` | 4 | Start – 1 – 2 – 3s (to port) – 1 – 3s/3p – 1 – 2 – 3s (to port) – Finish |

**Course `TL` — leeward finish**

| Signal | Beats | Sequence |
|---|---|---|
| `TL2` | 2 | Start – 1 – 2 – 3s (to port) – 1 – Finish |
| `TL3` | 3 | Start – 1 – 2 – 3s (to port) – 1 – 3s/3p – 1 – Finish |
| `TL4` | 4 | Start – 1 – 2 – 3s (to port) – 1 – 3s/3p – 1 – 2 – 3s (to port) – 1 – Finish |

Note the pattern: the triangle lap is sailed first, then subsequent laps are
windward/leeward, then a triangle lap again. Only legs 2 and 3 of the course are ever
reaches, however many total legs are sailed.

**Course `TR` — reaching finish**

| Signal | Beats | Sequence |
|---|---|---|
| `TR1` | 1 | Start – 1 – 2 – Finish |
| `TR2` | 2 | Start – 1 – 3s/3p – 1 – 2 – Finish |
| `TR3` | 3 | Start – 1 – 3s/3p – 1 – 3s/3p – 1 – 2 – Finish |

**Course `T` — start and finish mid-beat**

| Signal | Beats | Sequence |
|---|---|---|
| `T1` | 1 | Start – 1 – 2 – 3 – Finish |
| `T2` | 2 | Start – 1 – 2 – 3 – 1 – 3 – Finish |
| `T3` | 3 | Start – 1 – 2 – 3 – 1 – 3 – 1 – 2 – 3 – Finish |

**Offset variants `TWA` / `TLA` / `TRA`**

| Signal | Beats | Sequence |
|---|---|---|
| `TWA2` | 2 | Start – 1 – 1a – 2 – 3s (to port) – Finish |
| `TWA3` | 3 | Start – 1 – 1a – 2 – 3s (to port) – 1 – 1a – 3s/3p – Finish |
| `TLA2` | 2 | Start – 1 – 1a – 2 – 3s (to port) – 1 – 1a – Finish |
| `TLA3` | 3 | Start – 1 – 1a – 2 – 3s (to port) – 1 – 1a – 3s/3p – 1 – 1a – Finish |
| `TRA1` | 1 | Start – 1 – 1a – 2 – Finish |
| `TRA2` | 2 | Start – 1 – 1a – 3s/3p – 1 – 1a – 2 – Finish |
| `TRA3` | 3 | Start – 1 – 1a – 3s/3p – 1 – 1a – 3s/3p – 1 – 1a – 2 – Finish |

## Leg profile

For `TL3`:

```
Beats:   3
Runs:    2
Reaches: 2
```

For `T2`:

```
Beats:   2
Runs:    2
Reaches: 2
```

The two reaches sit back to back at the start of the course, immediately after the
first beat, which is exactly when the fleet is most compressed. The result is that
positions established at mark `1` tend to hold through marks `2` and `3` — good for
spreading the fleet out and reducing rule incidents, bad for anyone hoping to pass. The
compensation is that a mediocre start remains recoverable on the later windward legs.

## Start and finish

**`TW` / `TL`** — line 0.05 nm downwind of the leeward gate; `TW` finishes 0.05 nm above
mark `1`, `TL` finishes at the leeward end.

**`T`** — the committee boat sits mid-course, on the beat, with the start and finish on
the same line. The line is not restricted and may be crossed while racing. This is
enormously convenient for a small club: one boat, one anchor, and it does not need to be
moved between the start and the finish. The cost is boats crossing the line mid-race,
which makes finish recording harder with large fleets or multiple starts.

**`TR`** — finish off the wing mark on a reach. Quick and clean but requires a separate
line away from the start.

## Race committee notes

**Laying order** — Wind reading, then the leeward mark or gate, then mark `1` directly
upwind at the beat length, then mark `2` at 90 degrees from the `1`–`3` axis at 0.707 ×
beat from each. Start line last.

**Which side for the wing mark** — Marks are normally left to port, which puts mark `2`
to port of the beat as seen from the leeward mark. Keep it consistent across a series;
sailors set up their reaches from memory.

**Wind shifts** — Intermediate between windward/leeward and trapezoid. A shift skews the
beat and unbalances the two reaches, turning one into a fetch and the other into a broad
run. Moving mark `1` alone corrects the beat but not the reaches; correcting properly
means moving `1` and `2` together.

**Course `T` and the mid-course line** — Confirm in the sailing instructions that the
line is unrestricted, or you will have protests from boats who thought they had to avoid
it.

**Failure modes** — The classic is a first reach that has become a fetch after a shift,
so the whole fleet two-sail-reaches in single file with no passing. If that happens on
lap one, expect it to define the race.

## When to use

- Club racing, especially with a small volunteer race team — course `T` needs one boat
- Hot, light days when a dead run would leave boats becalmed
- Mixed handicap fleets where keeping boats moving matters more than tactical purity
- Confined or inland water where a triangle fits the shape of the lake better than a long beat
- Non-spinnaker fleets, for whom reaching legs are less of a procession

## When to avoid

- Championship or selection racing where tactical quality is the priority
- Fast planing or foiling classes, where reaches become a drag race decided on boatspeed
- Very shifty conditions, where both reaches will end up wrong
- Large fleets on course `T`, where the mid-course line becomes unmanageable

## Variants

### `TL` — leeward finish
Finish after a run. The most common championship-style triangle.

### `TW` — windward finish
Finish 0.05 nm above mark `1`. Requires a separate finish line.

### `TR` — reaching finish
Finish off the wing mark. Shortest sequences; `TR1` is a single lap.

### `T` — start and finish mid-beat
Committee boat mid-course, one line for both. The classic club configuration. Some clubs
label the variants by leg count instead of beat count — a `T-4` finishing upwind, a `T-5`
finishing downwind — so check local sailing instructions rather than assuming.

### `TWA` / `TLA` / `TRA` — offset mark
Adds `1a` after the windward mark.

### Sausage-triangle and triangle-sausage
Local UK convention combines a windward/leeward lap and a triangle lap in one course,
signalled `STL` / `STW` (sausage first) or `TSL` / `TSW` (triangle first). Not World
Sailing standard but widely used; a spreader mark suffixes `A`, and where two windward
marks serve different fleets the course to the further mark suffixes `E`.

### Olympic triangle
The historic championship form — triangle, windward/leeward, triangle, beat to finish.
Nine legs. Superseded; see `class-specific.md`.

## Sources

- World Sailing, *Race Management Manual*, Appendix 1: Course Diagrams and Tables — https://sailing.org/tools/documents/RMManual08August2018-[24186].pdf
- Sail Canada, *Course Diagrams* — https://www.sailing.ca/course-diagrams/
- SolentXtra, *Course Diagrams* — http://www.solentxtra.com/documents_and_reference/course-diagrams/
- Lake George Racing, *Course Diagrams* — https://sail.lake-george.com/wed-night-racing/course-diagrams/

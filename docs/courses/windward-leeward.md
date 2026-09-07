---
id: windward-leeward
name: Windward/Leeward
family: windward-leeward
signal_codes: [L, W, M, LA, WA, LR, LG, WR, WG, LS, LAS]
status: current
spinnaker: either
beats: 1-4
laps: 1-4
typical_classes: [ILCA, 470, Finn, Fireball, Merlin Rocket, RS Aero, Solo, 29er, 49er, Moth, most club handicap fleets]
target_time: 40-60
governing_reference: World Sailing Race Management Manual, Appendix 1
---

# Windward/Leeward

## Summary

The default modern racing course: a beat to a windward mark, a run back to a leeward
mark or gate, repeated. Every leg is sailed either directly upwind or directly
downwind, which is what distinguishes it from the trapezoid and triangle families —
there are no reaching legs, and therefore no legs on which the fleet is strung out in
a procession. It is the easiest course for a race committee to lay and the easiest to
adjust when the wind shifts, and it produces the most tactically dense racing, which
is why it has displaced the triangle almost everywhere.

## Diagram

Course `L` with a leeward gate, the standard configuration.

```
                 WIND
                  |||
                  vvv

                  O 1
                 /|\
                / | \
        beat   /  |  \   run
              /   |   \
             /    |    \
            /     |     \
      4s O -------+------ O 4p
                  |
                0.05 nm
                  |
      SP O ================ O SS
              START / FINISH
```

Course `LA`, adding the offset mark. The offset sits 80–90 degrees off the wind from
mark 1, so that boats bearing away round a short leg before setting up for the run
rather than converging head-on with boats still beating.

```
                 WIND
                  |||
                  vvv

           1a O---O 1
                 80-90 deg
                  |
                  |
      4s O -------+------ O 4p
                  |
      SP O ================ O SS
              START / FINISH
```

Course `M`, the match-racing variant. Identical geometry, mirrored roundings, and the
leeward mark is designated `2` rather than a `4` gate.

```
                 WIND
                  |||
                  vvv

                  O 1        <- rounded to STARBOARD
                 /|\
                / | \
               /  |  \
      4s O -------+------ O 4p
                  |
      FP O ================ O FS
              START / FINISH
```

## Marks

| Mark | Role | Rounding | Position | Notes |
|---|---|---|---|---|
| `1` | Windward | Port (starboard on `M`) | Directly upwind of the reference point | The beat length is set here and every other distance follows from it |
| `1a` | Offset | Port | 80–90 degrees off the wind from mark 1 | Present only on `A` variants. Manual text gives approximately 60 m; the accompanying table uses 0.02 nm (about 40 m) at 80 degrees. Set nearer 60 m for large or fast fleets |
| `1s` / `1p` | Twin windward | Gate | Abeam of each other at the windward end | `WR` / `WG` only, allowing a reaching finish from a windward rounding |
| `4s` | Leeward gate, starboard mark | Left to starboard | Downwind of mark 1 | |
| `4p` | Leeward gate, port mark | Left to port | Downwind of mark 1 | |
| `SS` / `SP` | Start line ends | n/a | 0.05 nm downwind of the gate | |
| `FS` / `FP` | Finish line ends | n/a | Varies by variant | |
| `S1`–`S3` | Slalom marks | Port | Below the gate | `LS` / `LAS` only |

On course `M` the windward mark is `1` and the leeward mark is `2`, not a `4` gate.

## Geometry

**Reference point** — the leeward gate. Everything else is projected from it.

| Quantity | Value |
|---|---|
| Beat length | 0.5–3.0 nm typical, set for target time |
| Run length | Equal to the beat |
| Start/finish line offset | 0.05 nm downwind of gate `4s`/`4p` |
| Offset mark bearing | 80–90 degrees off the wind from mark 1 |
| Offset mark distance | ~40–60 m (0.02 nm in the source table, ~60 m in the source text) |
| Gate width | Scaled to boat length and fleet size; widen in stronger winds |
| Slalom leg angles | 15–20 degrees between slalom marks; 100 degrees off the wind from the gate to `S1` |
| Slalom duration | Approximately 2 minutes |

Course length for a given beat length, from the source tables:

| Beat (nm) | L1 | L2 | L3 | L4 |
|---|---|---|---|---|
| 0.50 | 1.10 | 2.10 | 3.10 | 4.10 |
| 0.80 | 1.70 | 3.30 | 4.90 | 6.50 |
| 1.00 | 2.10 | 4.10 | 6.10 | 8.10 |
| 1.50 | 3.10 | 6.10 | 9.10 | 12.10 |
| 2.00 | 4.10 | 8.10 | 12.10 | 16.10 |

Adding an offset mark increases each total by roughly 0.02–0.08 nm depending on lap
count, which is negligible for timing purposes.

## Rounding orders

**Course `L` — leeward finish**

| Signal | Beats | Sequence |
|---|---|---|
| `L1` | 1 | Start – 1 – Finish |
| `L2` | 2 | Start – 1 – 4s/4p – 1 – Finish |
| `L3` | 3 | Start – 1 – 4s/4p – 1 – 4s/4p – 1 – Finish |
| `L4` | 4 | Start – 1 – 4s/4p – 1 – 4s/4p – 1 – 4s/4p – 1 – Finish |

**Course `W` — windward finish**

| Signal | Beats | Sequence |
|---|---|---|
| `W2` | 2 | Start – 1 – 4s/4p – Finish |
| `W3` | 3 | Start – 1 – 4s/4p – 1 – 4s/4p – Finish |
| `W4` | 4 | Start – 1 – 4s/4p – 1 – 4s/4p – 1 – 4s/4p – Finish |

**Course `LA` — offset mark, leeward finish**

| Signal | Beats | Sequence |
|---|---|---|
| `LA2` | 2 | Start – 1 – 1a – 4s/4p – 1 – 1a – Finish |
| `LA3` | 3 | Start – 1 – 1a – 4s/4p – 1 – 1a – 4s/4p – 1 – 1a – Finish |
| `LA4` | 4 | Start – 1 – 1a – 4s/4p – 1 – 1a – 4s/4p – 1 – 1a – 4s/4p – 1 – 1a – Finish |

**Course `WA` — offset mark, windward finish**

| Signal | Beats | Sequence |
|---|---|---|
| `WA2` | 2 | Start – 1 – 1a – 4s/4p – Finish |
| `WA3` | 3 | Start – 1 – 1a – 4s/4p – 1 – 1a – 4s/4p – Finish |
| `WA4` | 4 | Start – 1 – 1a – 4s/4p – 1 – 1a – 4s/4p – 1 – 1a – 4s/4p – Finish |

**Course `LR` / `LG` — reaching finish after a run**

| Signal | Beats | Sequence |
|---|---|---|
| `LR2` | 2 | Start – 1 – 4s/4p – 1 – 4p – Finish |
| `LR3` | 3 | Start – 1 – 4s/4p – 1 – 4s/4p – 1 – 4p – Finish |
| `LR4` | 4 | Start – 1 – 4s/4p – 1 – 4s/4p – 1 – 4s/4p – 1 – 4p – Finish |
| `LG2` | 2 | Start – 1 – 4s/4p – 1 – 4s – Finish |
| `LG3` | 3 | Start – 1 – 4s/4p – 1 – 4s/4p – 1 – 4s – Finish |
| `LG4` | 4 | Start – 1 – 4s/4p – 1 – 4s/4p – 1 – 4s/4p – 1 – 4s – Finish |

Note the final gate mark is written singly, not as `4s/4p` — because the next leg is a
reach, only the mark actually rounded is a mark of the course.

**Course `WR` / `WG` — twin windward marks, reaching finish**

| Signal | Beats | Sequence |
|---|---|---|
| `WR2` | 2 | Start – 1s/1p – 4s/4p – 1p – Finish |
| `WR3` | 3 | Start – 1s/1p – 4s/4p – 1s/1p – 4s/4p – 1p – Finish |
| `WR4` | 4 | Start – 1s/1p – 4s/4p – 1s/1p – 4s/4p – 1s/1p – 4s/4p – 1p – Finish |
| `WG2` | 2 | Start – 1s/1p – 4s/4p – 1s – Finish |
| `WG3` | 3 | Start – 1s/1p – 4s/4p – 1s/1p – 4s/4p – 1s – Finish |

**Course `M` — match racing, starboard roundings**

| Signal | Beats | Sequence |
|---|---|---|
| `M2` | 2 | Start – 1 – 4s/4p – 1 – Finish |
| `M3` | 3 | Start – 1 – 4s/4p – 1 – 4s/4p – 1 – Finish |
| `M4` | 4 | Start – 1 – 4s/4p – 1 – 4s/4p – 1 – 4s/4p – 1 – Finish |

**Course `LS` / `LAS` — slalom finish**

| Signal | Beats | Sequence |
|---|---|---|
| `LS2` | 2 | Start – 1 – 4s/4p – 1 – 4p – S1 – S2 – S3 – Finish |
| `LS3` | 3 | Start – 1 – 4s/4p – 1 – 4s/4p – 1 – 4p – S1 – S2 – S3 – Finish |
| `LAS2` | 2 | Start – 1 – 1a – 4s/4p – 1 – 4p – 1a – S1 – S2 – S3 – Finish |
| `LAS3` | 3 | Start – 1 – 1a – 4s/4p – 1 – 1a – 4s/4p – 1 – 4p – 1a – S1 – S2 – S3 – Finish |

## Leg profile

For `L3`:

```
Beats:   3
Runs:    2
Reaches: 0
```

All-upwind-and-downwind means the fleet compresses and splits repeatedly. Passing
lanes exist on every leg, gains and losses come from tactics and shift-reading rather
than boatspeed alone, and a poor start is recoverable. This is the profile that makes
windward/leeward the fairest test of the two skills — upwind and downwind — that most
distinguish sailors.

## Start and finish

The line sits 0.05 nm downwind of the leeward gate, square to the wind, usually with a
slight port-end bias to encourage a spread start.

Because the line sits below the gate on the direct path between gate and windward
mark, boats are sailing through the start area on every lap. Sailing instructions must
state whether the line is restricted. Most club instructions leave it unrestricted,
which is simpler; the cost is that the committee boat has racing boats passing close
aboard throughout.

`W` and `WA` finish at the windward end, which removes traffic from the finish but
means the committee must run a second line or relocate. `LR` / `LG` finish on a short
reach from the last gate rounding — quick to record, popular for fast classes, and it
gives the fleet a clean final leg.

## Race committee notes

**Laying order** — Take the wind reading, lay the leeward gate first, project the
windward mark from it, then set the line 0.05 nm below the gate. Lay the offset last
if used.

**Checking** — Sail the beat before the first start if time permits. A beat that is
even 5 degrees skewed turns the first leg into a one-tack fetch and the race is
effectively decided at the start.

**Wind shifts** — This is the family's great advantage. A shift is corrected by moving
one mark: swing the windward mark, and the whole course is square again. Compare this
to a trapezoid, where the reach angles must be preserved and three marks move.

**Shortening** — Straightforward. Signal course shortened at the gate or at the
windward mark and finish there. Because every leg is a beat or a run, a shortened
course remains a valid test.

**Failure modes** — A gate that is too narrow removes the tactical choice it exists to
create and creates a pile-up instead; widen it for larger fleets and stronger winds. An
offset set too close to mark 1 does not achieve the separation it exists for.

## When to use

- Almost all modern fleet racing, at any level
- Shifty or unstable conditions, where the ability to re-square the course quickly matters
- Mixed-class racing where different classes need different lap counts from the same marks
- Any event where tactical racing quality is the priority

## When to avoid

- Light airs with a strong tide, where a dead run may become unsailable
- Very hot, light days where a fleet may sit becalmed on a run; a triangle keeps boats moving
- Small, confined water where the beat cannot be made long enough to separate the fleet
- Fleets of slow displacement boats where the run is tediously long relative to the beat

## Variants

### `L` — leeward finish
The baseline. Finish after the last run. Simplest to record with modest fleets.

### `W` — windward finish
Finish at the windward end after the last beat. Removes finish congestion from the
start area but needs a second line or a relocated committee boat.

### `LA` / `WA` — offset mark
Adds mark `1a`. Strongly recommended for large fleets, fast classes, and anything with
a spinnaker, because it separates boats bearing away from boats still beating.

### `LR` / `LG` — reaching finish
Finish on a reach from the final gate rounding. `LR` follows a port rounding, `LG` a
starboard one. Fast to record and popular in class racing. Sometimes signalled `H` for
"Hollywood finish" in local practice.

### `WR` / `WG` — twin windward marks
Uses a windward gate `1s`/`1p` and finishes on a reach from the windward end. Suited to
very large fleets where a single windward mark would be a bottleneck.

### `LS` / `LAS` — slalom finish
Adds three slalom marks below the gate, taking roughly two minutes to sail, with
15–20 degrees between marks. Used for boards and foiling classes.

### `M` — match racing
Starboard roundings, leeward mark designated `2`. Two-boat racing only.

## Sources

- World Sailing, *Race Management Manual*, Appendix 1: Course Diagrams and Tables — https://sailing.org/tools/documents/RMManual08August2018-[24186].pdf
- RYA, *Course diagrams* — https://www.rya.org.uk/racing/course-diagrams
- Sail Canada, *Course Diagrams* — https://www.sailing.ca/course-diagrams/

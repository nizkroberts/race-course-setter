---
id: trapezoid
name: Trapezoid
family: trapezoid
signal_codes: [I, O, IA, IW, OW, IWA, OWA, IS, OS]
status: current
spinnaker: either
beats: 1-4
laps: 1-4
typical_classes: [ILCA, Optimist, 420, 470, 29er, 49er, RS Feva, Nacra 17, RS:X and iQFOiL]
target_time: 45-60
governing_reference: World Sailing Race Management Manual, Appendix 1
---

# Trapezoid

## Summary

Two parallel upwind/downwind corridors connected by a reaching leg, with fleets sailing
either the inner loop (`I`) or the outer loop (`O`). Its defining feature is not the
reach but the **separation**: because inner and outer fleets use different parts of the
same mark layout, several classes can race simultaneously on one set of marks with one
race committee, without meeting each other. This is why it replaced the Olympic triangle
at major regattas in the mid-1990s, and why it remains the standard course for
multi-class championships.

## Diagram

Marks `1` and gate `4s`/`4p` form the right-hand corridor; mark `2` and gate `3s`/`3p`
form the left-hand corridor. The reach from `1` to `2` connects them.

Because all roundings are to port, boats leaving mark `1` turn to port — so mark `2`
always lies to the **left** of the beat as drawn with the wind at the top of the page.
A diagram with mark `2` to the right would require starboard roundings.

```
                 WIND
                  |||
                  vvv

                       O 1
              60-70 deg/|
                      / |
      first reach    /  |
                    /   |
                   /    |
                  /     |
             2 O        |
               |        |
               |        |
               |  4s O--+--O 4p
               |        |
               |   SP O=+=O SS
               |      START
               |
         3s O--+--O 3p
               |
         FP O==+==O FS
            FINISH
```

**Inner loop `I2`** — beat to `1`, run to gate `4`, beat to `1` again, reach `1` to `2`,
run `2` to `3p`, finish. The inner fleet stays in the right corridor and only crosses to
the left once, at the end.

**Outer loop `O2`** — beat to `1`, reach `1` to `2`, run `2` to gate `3`, beat back to
`2`, run `2` to `3p`, finish. The outer fleet crosses immediately and does its repeat
laps in the left corridor.

The two fleets therefore occupy different water for most of the race.

With an offset mark (`IA`, `IWA`):

```
                 WIND
                  |||
                  vvv

              1a O---O 1
                      |\
                      | \  first reach
                      |  \
                      |   \
                 2 O   ----
```

Windward-finish variants (`IW`, `OW`) add mark `5` and finish upwind:

```
                    O 1
                   /|
                  / |
                 /  |
            2 O     |
              |  4s O--O 4p
              |     |
              |  SP O==O SS
              |    START
              |
        3s O--+--O 3p
              |
            O 5
              |
        FP O==+==O FS
           FINISH
```

## Marks

| Mark | Role | Rounding | Position | Notes |
|---|---|---|---|---|
| `1` | Windward | Port | Top of the left corridor, directly upwind of gate `4` | Beat length set here |
| `1a` | Offset | Port | 80–90 degrees off the wind from `1` | `A` variants only; ~40–60 m |
| `2` | Reach mark | Port | Top of the right corridor, downwind and to leeward of `1` | The interior angle at `1` between the `1`–`4` axis and the `1`–`2` reach is the defining geometry |
| `3s` / `3p` | Gate, right corridor | Gate | Directly downwind of `2` | `3p` alone is rounded before a reaching finish |
| `4s` / `4p` | Gate, left corridor | Gate | Directly downwind of `1` | |
| `5` | Finish approach mark | Port | Below gate `3` | `IW` / `OW` only |
| `S1`–`S3` | Slalom marks | Port | Below gate `3` | `IS` / `OS` only |
| `SS` / `SP` | Start line ends | n/a | 0.05 nm downwind of gate `4` | |
| `FS` / `FP` | Finish line ends | n/a | Laid using mark `3` as the guide | |

## Geometry

**Reference point** — gate `4s`/`4p`, or in some layouts the mark immediately to
windward of the start line. Project everything from there.

### Interior angles

This is the one number that must be right, and it depends on the fleet:

| Fleet | Angles |
|---|---|
| Boats carrying spinnakers | Approximately 60 / 120 / 120 / 60 degrees |
| Non-spinnaker boats (ILCA, Finn, boards) | Approximately 70 / 110 / 110 / 70 degrees |

A non-spinnaker boat sails a tighter downwind angle, so the reach must be set wider to
remain a genuine reach rather than degenerating into a fetch.

### Leg lengths

Two conventions are in use. Both are standard; pick one and state it in the sailing
instructions.

| Convention | Reach `1`–`2` |
|---|---|
| Half-beat reach | 0.5 × beat length |
| Two-thirds reach | 0.67 × beat length |

Beats may be equal (`4`–`1` = `3`–`2`) or the outer beat may be shortened. Equal beats
is the common championship setting.

### Distances

| Quantity | Value |
|---|---|
| Start line offset | 0.05 nm downwind of gate `4s`/`4p` |
| Finish offset (`I`/`O`) | Approximately 0.15 nm from gate `3`; laid using mark `3` position as guide |
| Finish offset (`IW`/`OW`) | 0.1 nm below the start line, beyond mark `5` |
| Offset mark `1a` | 80–90 degrees off the wind, ~40–60 m |
| Slalom | 15–20 degrees between marks, 100 degrees off the wind from gate to `S1`, ~2 minutes total |

### Course length tables

60/120 degrees, equal beats, reach = half beat:

| Beat (nm) | Reach 1–2 | I2 | I3 | I4 | O2 | O3 | O4 |
|---|---|---|---|---|---|---|---|
| 0.5 | 0.25 | 2.40 | 3.40 | 4.40 | 2.40 | 3.40 | 4.40 |
| 0.8 | 0.40 | 3.75 | 5.35 | 6.95 | 3.75 | 5.35 | 6.95 |
| 1.0 | 0.50 | 4.65 | 6.65 | 8.65 | 4.65 | 6.65 | 8.65 |
| 1.5 | 0.75 | 6.90 | 9.90 | 12.90 | 6.90 | 9.90 | 12.90 |

60/120 degrees, equal beats, reach = two-thirds beat:

| Beat (nm) | Reach 1–2 | I2 / O2 | I3 / O3 | I4 / O4 |
|---|---|---|---|---|
| 0.50 | 0.33 | 2.30 | 3.20 | 4.10 |
| 0.80 | 0.53 | 3.00 | 4.20 | 5.40 |
| 1.00 | 0.67 | 3.47 | 4.87 | 6.27 |
| 1.50 | 1.00 | 4.87 | 6.87 | 8.87 |

Note that with equal beats the inner and outer loops come out the same total length —
which is the point. Both fleets sail comparable distances in comparable time.

## Rounding orders

**Inner trapezoid `I`**

| Signal | Beats | Sequence |
|---|---|---|
| `I2` | 2 | Start – 1 – 4s/4p – 1 – 2 – 3p – Finish |
| `I3` | 3 | Start – 1 – 4s/4p – 1 – 4s/4p – 1 – 2 – 3p – Finish |
| `I4` | 4 | Start – 1 – 4s/4p – 1 – 4s/4p – 1 – 4s/4p – 1 – 2 – 3p – Finish |

**Outer trapezoid `O`**

| Signal | Beats | Sequence |
|---|---|---|
| `O2` | 2 | Start – 1 – 2 – 3s/3p – 2 – 3p – Finish |
| `O3` | 3 | Start – 1 – 2 – 3s/3p – 2 – 3s/3p – 2 – 3p – Finish |
| `O4` | 4 | Start – 1 – 2 – 3s/3p – 2 – 3s/3p – 2 – 3s/3p – 2 – 3p – Finish |

The final `3p` is written singly because the leg to the finish is a reach; only the
mark actually rounded is a mark of the course, even though `3s` may still be laid.

**Inner trapezoid with offset `IA`**

| Signal | Beats | Sequence |
|---|---|---|
| `IA2` | 2 | Start – 1 – 1a – 4s/4p – 1 – 1a – 2 – 3p – Finish |
| `IA3` | 3 | Start – 1 – 1a – 4s/4p – 1 – 1a – 4s/4p – 1 – 1a – 2 – 3p – Finish |
| `IA4` | 4 | Start – 1 – 1a – 4s/4p – 1 – 1a – 4s/4p – 1 – 1a – 4s/4p – 1 – 1a – 2 – 3p – Finish |

**Trapezoid with beat to finish `IW` / `OW`**

| Signal | Beats | Sequence |
|---|---|---|
| `IW1` | 1 | Start – 1 – 2 – 3p – 5 – Finish |
| `IW2` | 2 | Start – 1 – 4s/4p – 1 – 2 – 3p – 5 – Finish |
| `IW3` | 3 | Start – 1 – 4s/4p – 1 – 4s/4p – 1 – 2 – 3p – 5 – Finish |
| `IW4` | 4 | Start – 1 – 4s/4p – 1 – 4s/4p – 1 – 4s/4p – 1 – 2 – 3p – 5 – Finish |
| `OW2` | 2 | Start – 1 – 2 – 3s/3p – 2 – 3p – 5 – Finish |
| `OW3` | 3 | Start – 1 – 2 – 3s/3p – 2 – 3s/3p – 2 – 3p – 5 – Finish |
| `OW4` | 4 | Start – 1 – 2 – 3s/3p – 2 – 3s/3p – 2 – 3s/3p – 2 – 3p – 5 – Finish |

**Trapezoid with offset and beat to finish `IWA`**

| Signal | Beats | Sequence |
|---|---|---|
| `IWA1` | 1 | Start – 1 – 1a – 2 – 3p – 5 – Finish |
| `IWA2` | 2 | Start – 1 – 1a – 4s/4p – 1 – 1a – 2 – 3p – 5 – Finish |
| `IWA3` | 3 | Start – 1 – 1a – 4s/4p – 1 – 1a – 4s/4p – 1 – 1a – 2 – 3p – 5 – Finish |

**Trapezoid with slalom finish `IS` / `OS`**

| Signal | Beats | Sequence |
|---|---|---|
| `IS2` | 2 | Start – 1 – 4s/4p – 1 – 2 – 3p – S1 – S2 – S3 – Finish |
| `IS3` | 3 | Start – 1 – 4s/4p – 1 – 4s/4p – 1 – 2 – 3p – S1 – S2 – S3 – Finish |
| `OS2` | 2 | Start – 1 – 2 – 3s/3p – 2 – 3p – S1 – S2 – S3 – Finish |
| `OS3` | 3 | Start – 1 – 2 – 3s/3p – 2 – 3s/3p – 2 – 3p – S1 – S2 – S3 – Finish |

## Leg profile

For `I2`:

```
Beats:   2
Reaches: 1
Runs:    2   (3 counting the short leg from 3p to the finish)
```

For `O3`:

```
Beats:   3
Reaches: 1
Runs:    3   (4 counting the short leg from 3p to the finish)
```

**The trapezoid has one reaching leg, not two.** This is easy to get wrong from the
diagram, because `1`–`2` and `2`–`3` both look like cross-course legs. They are not.
Gate `3` sits directly downwind of mark `2` by construction, parallel to the `4`–`1`
beat, so `2`–`3` is a dead run at 180 degrees off the wind. Only `1`–`2`, set at the
60 or 70 degree interior angle, is sailed as a reach.

That single reach is the tactical weak point — largely a procession, with overtaking
difficult — but it serves a purpose beyond sailing quality: it is the leg that
physically moves the fleet from one corridor to the other, which is what buys the class
separation. Everything else is beating and running, so downwind sailing carries more
weight here than on the Olympic triangle it replaced.

A practical consequence for race committees: if the `1`–`2` leg is set too broad, the
course degenerates into a windward/leeward with an awkward dogleg, because the one leg
that was meant to be a reach stops being one.

## Start and finish

Start line 0.05 nm below gate `4`, at the foot of the left corridor. Finish at the foot
of the right corridor, near gate `3`, so the two are separated by the width of the
trapezoid.

That separation is the operational advantage over a windward/leeward course: boats
finishing are nowhere near boats starting, so a race committee can start the next class
while the previous one is still finishing. On a multi-class day with rolling starts this
is the difference between running six races and running four.

`IW` / `OW` move the finish to a beat past mark `5`, used where an upwind finish is
preferred for the class.

## Race committee notes

**Laying order** — Wind reading first. Lay gate `4`, project mark `1` from it, then set
mark `2` at the correct interior angle and reach length from `1`. Gate `3` goes directly
downwind of `2` at the beat length. Start line 0.05 nm below gate `4`; finish laid using
mark `3` as the guide. Offset and slalom marks last.

**Get the angle right before anything else** — Confirm which angle set applies before
you leave the dock. Setting a 60-degree trapezoid for an ILCA fleet gives them a first
"reach" they will sail as a fetch with the fleet in a single line, and the race is
effectively over at mark 1.

**Wind shifts** — The trapezoid's weakness. A shift does not just skew the beat; it
changes both reach angles, and correcting it properly means moving marks `1`, `2` and
gate `3` while preserving the parallelogram. In practice, small shifts are absorbed by
moving mark `1` and accepting slightly imperfect reaches; large shifts mean a general
recall and a re-lay. Do not use this course in genuinely shifty conditions.

**Shortening and lengthening** — Possible but fiddlier than a windward/leeward. The
usual approach is to change the loop count in the course signal between races rather
than to adjust mid-race.

**Board classes** — For boards, standard practice sets mark `3` about 0.05 nm to windward
of the start line. Planing boards can otherwise carry speed from mark `3` straight
across the line; move mark `4` further to windward to prevent it.

**Failure modes** — Inner and outer fleets meeting at mark `1` because lap counts were
mismatched. Work through the timings for both loops before the first start.

## When to use

- Multi-class championships and regattas where several fleets share a race area
- Steady, reliable breeze — sea breezes, trade winds, offshore venues
- Events where separating start and finish operations meaningfully increases the number of races per day
- Board and foiling classes, where the slalom-finish variants apply

## When to avoid

- Shifty, gusty, or unstable conditions
- Single-class club racing, where the complexity buys nothing over a windward/leeward
- Race areas too small to hold two corridors plus a reach
- Volunteer race teams without the boats or experience to lay six or more marks accurately

## Variants

### `I` — inner loop
Repeat laps in the left corridor, then a single reach and run to finish. The shorter,
simpler loop; usually given to the slower or junior fleet.

### `O` — outer loop
Cross to the right corridor immediately and do repeat laps there. Same total distance
as `I` with equal beats.

### `IO` — combined
A single diagram specifying both loops, signalled per fleet. The normal championship
presentation.

### `IA` / `IWA` — offset mark
Adds `1a`. Recommended for spinnaker fleets and large entries.

### `IW` / `OW` — beat to finish
Adds mark `5` and finishes upwind, 0.1 nm below the start line.

### `IS` / `OS` — slalom finish
Adds `S1`–`S3` below gate `3`. Board and foiling classes.

### `IOD` — Optimist trapezoid
A distinct single-lap course with its own geometry. See `class-specific.md`.

## Sources

- World Sailing, *Race Management Manual*, Appendix 1: Course Diagrams and Tables — https://sailing.org/tools/documents/RMManual08August2018-[24186].pdf
- RYA, *Course diagrams* — https://www.rya.org.uk/racing/course-diagrams
- Sail Canada, *Course Diagrams* — https://www.sailing.ca/course-diagrams/
- SolentXtra, *Course Setting* reference data — http://www.solentxtra.com/documents_and_reference/reference-data/course-setting/

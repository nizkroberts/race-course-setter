---
id: class-specific
name: Class-Specific Courses
family: class-specific
signal_codes: [IOD, C, SL, TP1]
status: mixed
spinnaker: varies
beats: 1-4
laps: 1
typical_classes: [Optimist, WASZP, Moth, Formula Kite, iQFOiL, and historically all Olympic classes]
target_time: 40-60
governing_reference: World Sailing Race Management Manual, Appendix 1; class association rules
---

# Class-Specific Courses

## Summary

Courses defined by a class association rather than by the general World Sailing
conventions, plus the legacy Olympic triangle that the trapezoid replaced. These exist
because a class has requirements the standard families do not meet — very young sailors
in slow boats, foilers whose downwind angles break the usual geometry, or a historical
format that persists in club practice. The two that matter most in dinghy racing are the
**Optimist IOD course** and the **Olympic triangle**; the rest are noted for completeness.

## Diagram

### `IOD` — the Optimist course

A single-lap 60/120 triangle with equal leg lengths, one beat, one reach, one run.

```
                 WIND
                  |||
                  vvv

                  O 1
                 /|
          60 deg/ |
               /  |
             /    |    beat
           /      |
    2 O          |
      |    \      |
   FINISH   \     |
   (50 m     \    |
   inside)     \  |
                 \|
        3s O------O------O 3p
                  |
        SP O =====+===== O SS
             START
```

Course: `Start – 1 – 2 – 3s/3p – Finish`. One lap. That is the whole course.

### Olympic triangle (legacy)

Nine legs: triangle lap, windward/leeward lap, triangle lap, then a beat to finish.

```
                 WIND
                  |||
                  vvv

                  O 1  <- windward / weather mark
                 /|
               /  |
             /    |
           /      |
    2 O          |    2 = wing / gybe mark
    (gybe) \      |
             \    |
               \  |
                 \|
                  O 3  <- leeward / bottom mark
                  |
        SP O ======+====== O SS
             START

  Legs:  1. beat      3 -> 1
         2. reach     1 -> 2
         3. reach     2 -> 3
         4. beat      3 -> 1
         5. run       1 -> 3
         6. beat      3 -> 1
         7. reach     1 -> 2
         8. reach     2 -> 3
         9. beat      3 -> finish
```

---

## Marks

### `IOD`

| Mark | Role | Rounding | Position | Notes |
|---|---|---|---|---|
| `1` | Windward | Port | Upwind of the reference point | 60-degree interior angle |
| `2` | Wing / reach mark | Port | 120-degree interior angle | Finish is laid near here |
| `3s` / `3p` | Leeward gate | Gate | Downwind of `1` | |
| `SS` / `SP` | Start line ends | n/a | Reference point is the middle of this line | |
| `FS` / `FP` | Finish line ends | n/a | Approximately 50 m from mark `2`, on the inside of the course | |

### Olympic triangle

| Mark | Role | Rounding | Notes |
|---|---|---|---|
| `1` | Weather / windward mark | Port | The most upwind mark |
| `2` | Gybe / wing mark | Port | The gybe is here, hence the name |
| `3` | Lee / bottom mark | Port | The most downwind mark |

Roundings are generally to port. The finish line may have one end at mark `1` or may be
set beyond it; where it is set beyond, the sailing instructions must state whether mark
`1` remains a mark of the course on the final leg.

## Geometry

### `IOD`

**Reference point** — the middle of the starting line.

| Quantity | Value |
|---|---|
| Interior angles | 60 / 120 degrees |
| Reference to `1` | Equal to reference to `2` and to `3` |
| Leg lengths | All equal |
| Finish | Approximately 50 m from mark `2`, laid on the inside of the course |

Course lengths, equal legs:

| Reference to each mark (nm) | Leg `1`–`2` and `2`–`3` | Total course |
|---|---|---|
| 0.3 | 0.27 | 1.17 |
| 0.5 | 0.47 | 1.97 |
| 0.7 | 0.67 | 2.77 |
| 1.0 | 0.97 | 3.97 |

The equal-leg construction is what makes this course easy to lay: three marks all the
same distance from the middle of the start line, at fixed bearings off the wind axis.

### Olympic triangle

| Quantity | Value |
|---|---|
| Interior angles | 45 / 90 / 45 degrees |
| Legs equal to the beat | 5 (four beats and one run) |
| Reaching legs | 4 (two of each reach) |
| Total legs | 9 |

Because the leg proportions are fixed, the whole course length follows from the windward
leg length alone. Many sailing instructions specify only the windward leg and the total
course length; the intermediate distances are recovered by trigonometry.

## Rounding orders

### `IOD`

| Signal | Beats | Sequence |
|---|---|---|
| `IOD` | 1 | Start – 1 – 2 – 3s/3p – Finish |

### Olympic triangle

| Description | Sequence |
|---|---|
| Full Olympic course | Start – 1 – 2 – 3 – 1 – 3 – 1 – 2 – 3 – Finish |

## Leg profile

### `IOD`

```
Beats:   1
Runs:    1
Reaches: 1
```

One of each. That is the design intent: an Optimist sailor gets a complete sample of
every point of sail in a race short enough to hold their attention and short enough that
a race committee can run many of them in a day. The class has also used a two-beat,
one-reach, one-run variant, and separately races the standard trapezoid, so check the
notice of race rather than assuming.

### Olympic triangle

```
Beats:   4
Runs:    1
Reaches: 4
```

Nine legs is long — historically 60 to 90 minutes, and if you were at the back it was a
long time to be there. Modern racing has moved to roughly 50-minute races, which is one
reason the format was abandoned. The other is that four reaching legs out of nine is a
lot of processional sailing, and the inner/outer loop structure of the trapezoid
separated multiple classes far better than a triangle ever could.

## Start and finish

### `IOD`
Start line below the course with the reference point at its middle. Finish laid about
50 m from mark `2`, inside the course, so boats finish immediately after the reach
rather than sailing on to a distant line. Keeping the finish close matters with young
sailors, who lose time and concentration on long transits.

### Olympic triangle
Start at the leeward end. Finish on a beat, with the line either at mark `1` or set
beyond it. Where the line is set beyond mark `1`, the sailing instructions must resolve
whether mark `1` is still a mark of the course — this is a recurring source of protests
in older instructions that omit it.

## Race committee notes

**`IOD`** — The equal-leg construction means one distance and three bearings off the wind
axis lays the whole course, which is well within the capability of a small volunteer
team. Keep beat lengths short: Optimists are slow, and a beat sized for a 420 fleet
produces a 90-minute race for eight-year-olds.

**Optimist team racing** — Separate short courses exist for team racing, usually a
compressed windward/leeward or digital-S layout. They are not signalled under the
standard convention.

**Olympic triangle** — If running one from an old set of sailing instructions, check the
final-leg mark `1` question and the rounding side, and be aware that leg lengths are
often specified only implicitly.

**Foiling and board classes** — WASZP, Moth, Formula Kite and iQFOiL courses are
signalled `X` or with class-specific codes because their geometry does not fit the
standard grammar. Foiling boats sail downwind at angles that make a conventional run
meaningless, so their courses use wider gates, windward gates, and slalom sections. Take
geometry from the class association, not from the general tables.

## When to use

- `IOD`: Optimist fleet racing, especially at club and regional level
- `IOD`: any young or entry-level fleet where short races and a complete point-of-sail sample are the goal
- Olympic triangle: essentially never for new events; only when a class or club tradition specifically calls for it

## When to avoid

- `IOD` for classes other than Optimists — the equal-leg 60/120 geometry is tuned to their speed and angles
- Olympic triangle for any modern championship; the trapezoid does the same job better and shorter
- Standard families for foiling and board classes without checking class rules first

## Variants

### `IOD` — Optimist course
Single lap, 60/120, equal legs. The class also races standard trapezoids at
international level, sometimes with its own variant designations.

### Optimist team racing courses
Several short-course layouts exist under the informal designation `OT`. Compressed,
tactical, and not part of the standard signal grammar.

### `C` — WASZP championship course
Class-defined. Wider gates and modified downwind geometry for foiling.

### Moth course
Signalled `L`, but with a windward gate and notably wide gates to accommodate foiling
angles.

### `SL` / slalom courses
Sailboard and foiling-board slalom. Angles of 15–20 degrees between marks, approximately
two minutes total.

### `MR1`–`MR4` — iQFOiL medal series
Class-specific formats for the Olympic windfoil medal races, including slalom courses
designated `TP1`.

### Formula Kite courses
Signalled `X`. Kite courses are commonly windward/leeward with or without an offset;
target time approximately 15 minutes, which is far shorter than any dinghy course.

## Sources

- World Sailing, *Race Management Manual*, Appendix 1: Course Diagrams and Tables — https://sailing.org/tools/documents/RMManual08August2018-[24186].pdf
- World Sailing, *Course Racing Format* — https://www.sailing.org/tools/documents/CourseRacingFormat-[12023].pdf
- Sail Canada, *Course Diagrams* — https://www.sailing.ca/course-diagrams/
- RYA, *Course diagrams* — https://www.rya.org.uk/racing/course-diagrams
- Wikipedia, *Olympic triangle* — https://en.wikipedia.org/wiki/Olympic_triangle
- IODA course background — https://optimistwebshop.com/en/Blog/The-IODA-course/

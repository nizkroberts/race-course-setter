# Race Course Description Schema

A specification for describing standard sailboat race courses used in small dinghy
racing. Every course file in this set conforms to it.

The schema follows the World Sailing course-signal convention, in which a course is
not a name from a flat list but a **composition**: a course-type letter, an optional
finish-type letter, an optional modifier letter, and a digit giving the number of
beats. `LRA2` is therefore a windward/leeward, reaching finish, offset mark, two beats.
The schema is built to hold that structure rather than flatten it.

---

## 1. File-level frontmatter

YAML block at the top of every file.

```yaml
id:                  # slug, kebab-case, unique. e.g. windward-leeward
name:                # human-readable family name
family:              # one of: windward-leeward | trapezoid | triangle
                     #         class-specific | random-leg
signal_codes:        # list of World Sailing course signals in this family
status:              # current | legacy | informal
spinnaker:           # required | optional | non-spinnaker | either
beats:               # range of beats supported, e.g. "1-4" or "1"
laps:                # typical lap count if the family is lap-defined
typical_classes:     # list of dinghy classes commonly racing this family
target_time:         # typical elapsed time for the leading boat, minutes
governing_reference: # source document defining the geometry
```

### Field notes

**`signal_codes`** — Capital letters only, digit omitted. The digit is a per-race
choice by the race committee, not a property of the course type, so it belongs in
the rounding-order table rather than the frontmatter.

**`status`** — `current` means the course appears in the World Sailing Race Management
Manual as a recommended course. `legacy` means it has been superseded but is still
encountered (the Olympic triangle). `informal` means it is real and widely sailed but
has no standardised geometry (random leg).

**`spinnaker`** — This drives geometry, not just boat handling. Trapezoid interior
angles differ by 10 degrees depending on whether the fleet flies a kite, because the
reaching legs must remain reaches rather than becoming fetches or runs.

---

## 2. Required sections

Sections appear in this order. A section may state "not applicable" but may not be
silently omitted, so that files remain diffable against each other.

### 2.1 Summary

Two to four sentences. What the course is, what it is for, and the single thing that
distinguishes it from its nearest neighbour.

### 2.2 Diagram

ASCII layout in a fenced code block. Conventions, applied consistently across all files:

| Element | Rendering |
|---|---|
| Wind direction | Arrow at top of diagram, always blowing down the page |
| Rounding mark | `O` |
| Line (start/finish) | `====` between two end marks |
| Sailed leg | `/` `\` `|` `-` |
| Mark label | Adjacent, using the official designation |
| Angle callout | Degrees marked at the vertex |

Wind always comes from the top. Every diagram is oriented the same way so that
families can be compared visually.

### 2.3 Marks

Table. One row per mark, in course order.

| Column | Contents |
|---|---|
| `Mark` | Official designation (`1`, `1a`, `2`, `3s`, `3p`, `4s`, `4p`, `5`, `S1`–`S3`, `SS`, `SP`, `FS`, `FP`) |
| `Role` | windward / offset / wing / leeward gate / start / finish / slalom |
| `Rounding` | port / starboard / gate / n/a |
| `Position` | Where it sits relative to the reference point |
| `Notes` | Anything a race officer must know to lay it |

### 2.4 Geometry

Quantitative. Whatever of the following applies:

- Interior angles, with the spinnaker / non-spinnaker split where relevant
- Leg-length ratios expressed against the beat length
- Offset mark distance and bearing off the wind
- Start line offset from the reference point
- Finish line offset and how it is laid
- Gate width guidance
- Reference point for laying the course

State the reference point explicitly. It differs by family — a leeward gate for some
courses, the middle of the starting line for others — and getting it wrong misplaces
every mark downstream.

### 2.5 Rounding orders

Table. One row per signal, covering the realistic range of beat counts.

| Column | Contents |
|---|---|
| `Signal` | Full course signal including digit, e.g. `O3` |
| `Beats` | Integer |
| `Sequence` | `Start – 1 – 2 – 3s/3p – 2 – 3p – Finish` |

Where a gate is passed through, write `3s/3p`. Where a single mark of a gate is
rounded — which happens when the next leg is a reach — write only the mark actually
rounded, e.g. `3p`. The other gate mark may still be laid but is not a mark of the
course on that leg.

### 2.6 Leg profile

Count of each leg type per lap and for the whole course, so that courses can be
compared on what they actually test.

```
Beats:   n
Runs:    n
Reaches: n
```

Plus one sentence on the tactical character that profile produces.

### 2.7 Start and finish

Where the line sits, how it relates to the course, whether it can be crossed while
racing, and any consequence for the race committee (recording finishes with large
fleets, boats on the line during a lap, and so on).

### 2.8 Race committee notes

Practical setup and management. Laying order, what to check, how the course responds
to a wind shift, how to shorten or lengthen, and known failure modes.

### 2.9 When to use / when to avoid

Two short lists. Honest about tradeoffs.

### 2.10 Variants

Sub-headed entries for each signal variant within the family, each giving the signal,
what changes, and why you would choose it.

### 2.11 Sources

Linked references.

---

## 3. Shared conventions

These hold across every file and are not restated in each one.

### Mark designation

| Designation | Meaning |
|---|---|
| `1` | Windward mark |
| `1a` | Offset mark following mark 1 |
| `1s` / `1p` | Twin windward marks, used on `WR` / `WG` |
| `2` | Second mark — wing mark on a triangle, reach mark on a trapezoid, leeward mark on course `M` |
| `3s` / `3p` | Gate marks |
| `4s` / `4p` | Gate marks |
| `5` | Additional mark on a beat-to-finish trapezoid |
| `S1`–`S3` | Slalom marks |
| `SS` / `SP` | Starting mark, starboard end / port end |
| `FS` / `FP` | Finishing mark, starboard end / port end |

For gates, the `s` mark is the one a boat leaves to starboard; the `p` mark is the one
a boat leaves to port.

### Course signal grammar

Letters occur in three groups, at most one letter per group, in fixed order:

```
[course type][finish type][modifier][digit]
```

**Course type** — `L` windward/leeward with leeward finish, `W` windward/leeward with
windward finish, `M` windward/leeward with starboard roundings, `I` inner trapezoid,
`O` outer trapezoid, `T` triangular with start and finish mid-beat, `X` any other course.

**Finish type** — `R` reaching finish after a port rounding, `G` reaching finish after
a starboard rounding, `S` slalom finish, `L` leeward finish (triangular courses only),
`W` windward finish (triangular courses only).

**Modifier** — `A` course carries an offset mark at the windward end.

**Digit** — Number of beats to be sailed. Always last.

Note that different courses can share a designation. An `L` course may have a gate or
a single leeward mark; the signal does not distinguish them. This is deliberate — it
keeps the set of signals a race committee uses small and the set a competitor must
remember smaller. Fine distinctions live in the sailing instructions, not the signal.

### Direction of rounding

Marks are left to port by default in fleet racing. Course `M` is the standing
exception, using starboard roundings for match racing.

### Describing marks in sailing instructions

Marks should be described by size (large, small), colour, and shape (tetrahedral,
spherical, cylindrical, conical).

### Units

Distances in nautical miles, matching the source tables. Metric equivalents given in
parentheses where the distance is small enough that a race officer would think in
metres — offset marks and gate widths.

---

## 4. Files in this set

| File | Family | Signals covered |
|---|---|---|
| `windward-leeward.md` | windward-leeward | `L` `W` `M` `LA` `WA` `LR` `LG` `WR` `WG` `LS` `LAS` |
| `trapezoid.md` | trapezoid | `I` `O` `IA` `IW` `OW` `IWA` `IS` `OS` |
| `triangle.md` | triangle | `T` `TW` `TL` `TR` `TWA` `TLA` `TRA` |
| `class-specific.md` | class-specific | `IOD` and the legacy Olympic triangle |
| `random-leg.md` | random-leg | `X` and unsignalled club courses |

---
id: random-leg
name: Random Leg / Fixed Mark
family: random-leg
signal_codes: [X]
status: informal
spinnaker: either
beats: variable
laps: variable
typical_classes: [club handicap fleets, cruiser-racers, inland and estuary club racing, distance and passage races]
target_time: 60-180
governing_reference: No standard geometry; defined per club in sailing instructions
---

# Random Leg / Fixed Mark

## Summary

A course made from marks whose positions were chosen without reference to the wind —
permanent club marks, navigation buoys, headlands, or islands. Also called a fixed
course, point-to-point, or passage race. The race committee picks a sequence from
whatever is out there and posts it on a board. Legs may be beats, reaches, runs, or
fetches in any combination, and the same course sails completely differently on a
different day. This is the opposite design philosophy to the windward/leeward: instead
of controlling conditions to isolate sailing skill, it accepts the conditions and tests a
wider range of seamanship.

Under the World Sailing convention this is signalled `X`, "any other course", though in
practice most clubs use their own numbering.

## Diagram

There is no canonical geometry — that is the definition of the family. A representative
club layout with permanent marks:

```
                 WIND
                  |||
                  vvv

                        O  D
                       /
                      /  fetch
                     /
        O  A        /
          \        /
   reach   \      /
            \    /
             \  /
              O  C
             /
            /  run
           /
    O  B  /
      \  /
       \/
   SP O==O SS
      START / FINISH


   Course 4:  Start - A - C - D - C - B - Finish
   (posted on the course board; marks may be
    rounded to either hand as stated in the SIs)
```

The layout is fixed. The wind is not. Leg A–C might be a fetch one week and a dead run
the next.

## Marks

Marks are whatever the club has. Typical categories:

| Mark type | Rounding | Notes |
|---|---|---|
| Permanent club marks | Stated per course | Usually lettered or numbered and colour-coded; positions published in club documents |
| Navigation buoys | Stated per course | Must not be marks that vessels are required to pass on a particular side under IRPCAS unless the SIs address it |
| Fixed features | Stated per course | Islands, headlands, jetties. Rounding definitions need care in the SIs |
| Laid marks | Stated per course | Some clubs lay one or two marks to add a beat to an otherwise reachy course |
| `SS` / `SP` | n/a | Start line, often a shore transit or a fixed committee position |

Because marks are not laid to windward and leeward, the sailing instructions must state
the required side for every mark on every course, or adopt a blanket convention (for
example, all marks to port unless the course board shows otherwise).

## Geometry

**Reference point** — none. There is no wind-relative construction.

What the race committee controls instead:

| Quantity | How it is set |
|---|---|
| Course selection | Chosen from a published list to suit the day's wind direction and strength |
| Course length | Chosen by lap count or by picking a longer or shorter listed course |
| Leg character | A consequence of the wind, not a design choice |
| Target time | Managed by lap count and by shortening course |

The design work happens once, when the club draws up its list of numbered courses and
notes which are good in which wind direction. After that, the race officer's job is
selection rather than construction.

## Rounding orders

Defined per club. The general form:

| Signal | Sequence |
|---|---|
| `X` / club course number | Start – [mark] – [mark] – ... – Finish |

Common presentation is a course board on the committee boat or clubhouse showing mark
letters in order, with a symbol or colour indicating rounding side, and a separate
lap-count board.

## Leg profile

Variable by definition. A typical club course might yield:

```
Beats:   1-2
Runs:    1
Reaches: 2-4
Fetches: 1-2
```

The distinguishing feature is the **fetch** — a leg that is neither a beat nor a reach
nor a run, sailed close-hauled or nearly so on one tack without needing to tack. Fetches
essentially do not occur on wind-relative courses, and they demand a different skill:
judging whether you can lay the mark, and what it costs if you cannot.

More broadly, this profile requires calculating the true wind angle for each leg, picking
the right sail combination for each point of sail, working out the fastest route to the
next mark, and judging where you will be faster or slower than the competition and how to
exploit that. That is a wider range of decisions than a windward/leeward asks for, though
it is a less precise measurement of any single skill.

## Start and finish

Often a shore-based line — a transit between a mast and a post — which lets a club run
racing with no committee boat at all. Otherwise a conventional line from an anchored
boat.

Because the course is not wind-relative, the first leg may not be a beat. A reaching or
running start changes the tactics entirely: line bias matters less, being in clear air
matters more, and the fleet spreads immediately rather than converging on a windward
mark. Some clubs deliberately choose a course with a beat first to avoid this; others
accept it.

## Race committee notes

**The work is front-loaded** — Build a table of numbered courses against wind direction
once, publish it, and the weekly decision becomes a single choice. This is the single
highest-value thing a club race officer can do for a fixed-mark programme.

**Handicap interaction** — Fixed courses interact badly with some handicap systems.
Handicaps derived from windward/leeward performance systematically favour boats that reach
well when applied to a reach-heavy course. If the club races on handicap, be aware the
results are measuring something slightly different from what the numbers assume.

**Shortening course** — Easier than on wind-relative courses because there are usually
several marks that can serve as a finish. Publish in advance which marks can be used.

**Safety and navigation** — Courses using navigation buoys or passing near commercial
traffic need explicit instructions, and the race committee retains responsibility for
whether the course is appropriate for the fleet and the forecast.

**Tide** — On a fixed course the tide is often the dominant factor, more so than on a
windward/leeward where its effect is at least symmetrical. Local knowledge of where the
stream runs becomes a large part of the racing, which some sailors consider the point and
others consider a defect.

## When to use

- Club racing with permanent marks and no mark-laying boat
- Inland, estuary, or coastal water where the geography dictates where boats can go
- Distance, passage, and pursuit racing
- Mixed fleets of very different boats, where a long varied course sorts them out
- Any programme where race committee resources are the binding constraint

## When to avoid

- Class championships, selection events, or anything where results must be a clean measure of sailing ability
- Any event where fairness across the fleet is paramount — first-leg character alone can decide the race
- Fleets unfamiliar with the water, where local mark knowledge becomes an unfair advantage
- Situations where the wind direction makes a listed course unsailable and no alternative exists

## Variants

### Fixed mark club course
The standard form. Numbered courses from permanent marks, selected on the day.

### Passage / distance race
A single long point-to-point, often port to port. Same principles, longer.

### Pursuit race
Fixed course with staggered starts by handicap, so the first boat across the line at a
set time wins. Very well suited to fixed-mark courses because it removes the handicap
calculation from the result.

### Hybrid
A fixed course with one or two laid marks added to guarantee a beat. Common compromise
where a club wants some windward work but cannot lay a full course.

### `X` under World Sailing convention
Where a club uses the standard signal grammar, non-standard courses are signalled `X`.
Championship-level `X` courses also exist — foiling, kite, and slalom layouts — but those
are class-defined geometry rather than fixed marks. See `class-specific.md`.

## Sources

- Wikipedia, *Random leg course* — https://en.wikipedia.org/wiki/Random_leg_course
- Sail Canada, *Course Diagrams* (on `X` as "any other course") — https://www.sailing.ca/course-diagrams/
- RYA, *Course diagrams* — https://www.rya.org.uk/racing/course-diagrams
- LJSC, *Sailboat Race Courses* — http://osyc.net/racing/RRS/RRS-3.pdf

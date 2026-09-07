# Race course setter

A tool for club race officers: turns a signal-boat GPS position, a wind reading, and a
course-type selection (windward/leeward, triangle, or trapezoid) into actual lat/lon mark
positions, a plan-view diagram, a laying order, and radio-callable positions.

Recovered from an earlier Claude (Mac app) session and set up here as a normal Vite +
React project for continued development.

## Structure

- `src/CourseSetter.jsx` — the app (geodesy, course geometry, wind stats, target-time
  solver, plan view, and UI)
- `docs/trapezoid.md` — reference notes on the trapezoid course family (mark geometry,
  rounding orders, race-committee notes). Referenced a sibling `class-specific.md`
  (Optimist trapezoid) that wasn't recovered — may need to be recreated.

## Development

```
npm install
npm run dev
```

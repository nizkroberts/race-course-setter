import React, { useState, useMemo, useCallback } from "react";

/* ============================================================
   GEODESY
   ============================================================ */

const M_PER_NM = 1852;
const rad = (d) => (d * Math.PI) / 180;
const deg = (r) => (r * 180) / Math.PI;
const norm = (d) => ((d % 360) + 360) % 360;

// WGS84. A mean-sphere model carries a scale error of roughly 0.2% because the
// local radius of curvature varies with latitude — about 4 m on a 2 km beat,
// which is inside the offset mark's tolerance budget. Using the meridional and
// prime-vertical radii at the working latitude removes it. Over course-sized
// distances this is accurate to well under a metre.
const WGS84_A = 6378137.0;
const WGS84_F = 1 / 298.257223563;
const WGS84_E2 = WGS84_F * (2 - WGS84_F);

function localRadii(latDeg) {
  const s = Math.sin(rad(latDeg));
  const t = 1 - WGS84_E2 * s * s;
  return {
    M: (WGS84_A * (1 - WGS84_E2)) / Math.pow(t, 1.5), // meridional
    N: WGS84_A / Math.sqrt(t), // prime vertical
  };
}

/** Direct problem: destination given bearing (deg true) and distance (nm).
 *  Radii are evaluated at the mid-latitude of the step, matching inverse(), so
 *  the two round-trip to sub-millimetre. One refinement pass is enough at these
 *  distances — the correction is already below GPS noise on the first pass. */
function destination(lat, lon, bearing, distNm) {
  const d = distNm * M_PER_NM;
  const th = rad(bearing);
  const dN = d * Math.cos(th);
  const dE = d * Math.sin(th);

  let midLat = lat;
  let outLat = lat;
  for (let i = 0; i < 2; i++) {
    const { M } = localRadii(midLat);
    outLat = lat + deg(dN / M);
    midLat = (lat + outLat) / 2;
  }
  const { N } = localRadii(midLat);
  return {
    lat: outLat,
    lon: lon + deg(dE / (N * Math.cos(rad(midLat)))),
  };
}

/** Inverse problem: initial bearing (deg true) and distance (nm). */
function inverse(a, b) {
  const midLat = (a.lat + b.lat) / 2;
  const { M, N } = localRadii(midLat);
  const dy = rad(b.lat - a.lat) * M;
  const dx = rad(b.lon - a.lon) * N * Math.cos(rad(midLat));
  return {
    bearing: norm(deg(Math.atan2(dx, dy))),
    dist: Math.hypot(dx, dy) / M_PER_NM,
  };
}

function toDDM(lat, lon) {
  const f = (v, pos, negc, pad) => {
    const h = v >= 0 ? pos : negc;
    const a = Math.abs(v);
    const d = Math.floor(a);
    const m = (a - d) * 60;
    return `${h} ${String(d).padStart(pad, "0")}\u00b0 ${m.toFixed(3).padStart(6, "0")}'`;
  };
  return { lat: f(lat, "N", "S", 2), lon: f(lon, "E", "W", 3) };
}

/* ============================================================
   CIRCULAR STATISTICS  (wind direction is an angle, not a number)
   ============================================================ */

function windStats(obs) {
  if (!obs.length) return null;
  let sx = 0,
    sy = 0;
  obs.forEach((o) => {
    sx += Math.cos(rad(o.dir));
    sy += Math.sin(rad(o.dir));
  });
  const mean = norm(deg(Math.atan2(sy / obs.length, sx / obs.length)));
  let lo = 0,
    hi = 0;
  obs.forEach((o) => {
    let d = norm(o.dir - mean);
    if (d > 180) d -= 360;
    lo = Math.min(lo, d);
    hi = Math.max(hi, d);
  });
  return { mean, spread: hi - lo, min: norm(mean + lo), max: norm(mean + hi) };
}

/* ============================================================
   COURSE TEMPLATES
   Geometry is computed from interior angles and leg ratios,
   never from hard-coded position tables.
   ============================================================ */

const SEQUENCES = {
  L: {
    1: ["START", "M1", "FINISH"],
    2: ["START", "M1", "G4", "M1", "FINISH"],
    3: ["START", "M1", "G4", "M1", "G4", "M1", "FINISH"],
    4: ["START", "M1", "G4", "M1", "G4", "M1", "G4", "M1", "FINISH"],
  },
  W: {
    2: ["START", "M1", "G4", "FINISH"],
    3: ["START", "M1", "G4", "M1", "G4", "FINISH"],
    4: ["START", "M1", "G4", "M1", "G4", "M1", "G4", "FINISH"],
  },
  TL: {
    2: ["START", "M1", "M2", "G3", "M1", "FINISH"],
    3: ["START", "M1", "M2", "G3", "M1", "G3", "M1", "FINISH"],
    4: ["START", "M1", "M2", "G3", "M1", "G3", "M1", "M2", "G3", "M1", "FINISH"],
  },
  TW: {
    2: ["START", "M1", "M2", "G3", "FINISH"],
    3: ["START", "M1", "M2", "G3", "M1", "G3", "FINISH"],
    4: ["START", "M1", "M2", "G3", "M1", "G3", "M1", "M2", "G3", "FINISH"],
  },
  T: {
    1: ["START", "M1", "M2", "G3", "FINISH"],
    2: ["START", "M1", "M2", "G3", "M1", "G3", "FINISH"],
    3: ["START", "M1", "M2", "G3", "M1", "G3", "M1", "M2", "G3", "FINISH"],
  },
  I: {
    2: ["START", "M1", "G4", "M1", "M2", "G3", "FINISH"],
    3: ["START", "M1", "G4", "M1", "G4", "M1", "M2", "G3", "FINISH"],
    4: ["START", "M1", "G4", "M1", "G4", "M1", "G4", "M1", "M2", "G3", "FINISH"],
  },
  O: {
    2: ["START", "M1", "M2", "G3", "M2", "G3", "FINISH"],
    3: ["START", "M1", "M2", "G3", "M2", "G3", "M2", "G3", "FINISH"],
    4: ["START", "M1", "M2", "G3", "M2", "G3", "M2", "G3", "M2", "G3", "FINISH"],
  },
};

const SIGNALS = {
  L: { family: "wl", name: "Windward/leeward, leeward finish", beats: [1, 2, 3, 4] },
  W: { family: "wl", name: "Windward/leeward, windward finish", beats: [2, 3, 4] },
  TL: { family: "tri", name: "Triangle, leeward finish", beats: [2, 3, 4] },
  TW: { family: "tri", name: "Triangle, windward finish", beats: [2, 3, 4] },
  T: { family: "triT", name: "Triangle, line mid-beat", beats: [1, 2, 3] },
  I: { family: "trap", name: "Trapezoid, inner loop", beats: [2, 3, 4] },
  O: { family: "trap", name: "Trapezoid, outer loop", beats: [2, 3, 4] },
};

/* A single average speed cannot time a course, because families differ in how
   much of their length is beating. A trapezoid and a windward/leeward of equal
   total length are not equal races: the trapezoid spends two legs reaching at
   close to hull speed, the windward/leeward spends that distance making good to
   windward at roughly half of it. Timing each leg against a made-good speed for
   its point of sail is what makes the target-time solver transferable between
   course families.

   up   — velocity made good to windward, not boatspeed through the water
   reach— boatspeed on a beam or broad reach
   down — velocity made good downwind

   Seed values for moderate breeze. They are meant to be replaced by a club's
   own logged elapsed times. */
const CLASS_SPEEDS = {
  Optimist: { up: 1.9, reach: 3.3, down: 2.2 },
  "ILCA 4": { up: 2.7, reach: 5.2, down: 3.2 },
  "ILCA 6": { up: 2.9, reach: 5.8, down: 3.5 },
  "ILCA 7": { up: 3.1, reach: 6.2, down: 3.8 },
  "RS Feva": { up: 2.7, reach: 5.6, down: 3.6 },
  420: { up: 2.9, reach: 6.4, down: 4.0 },
  470: { up: 3.2, reach: 7.2, down: 4.6 },
  "29er": { up: 3.5, reach: 10.5, down: 7.0 },
  "49er": { up: 4.1, reach: 14.0, down: 9.5 },
  Solo: { up: 2.8, reach: 5.4, down: 3.3 },
  "GP14 / Wayfarer": { up: 2.7, reach: 5.6, down: 3.7 },
  "Club handicap": { up: 2.9, reach: 6.0, down: 3.9 },
};

/** Elapsed minutes for the leading boat, timed leg by leg. */
function estimateMinutes(legs, sp) {
  let hours = 0;
  for (const l of legs) {
    const v = l.type === "beat" ? sp.up : l.type === "run" ? sp.down : sp.reach;
    hours += l.dist / Math.max(v, 0.1);
  }
  return hours * 60;
}

/* ============================================================
   THE COMPUTATION CHAIN
   ============================================================ */

function computeCourse(p) {
  const wa = p.windAxis;
  const marks = {};
  const put = (id, label, role, pos, side) =>
    (marks[id] = { id, label, role, side: side || null, ...pos });

  // --- Start line, derived from the signal boat -------------------
  const lineNm = (p.entries * p.meanLoa * p.lineFactor) / M_PER_NM;
  const lineBrg = norm(wa - 90 + p.bias);
  const SS = { lat: p.sigLat, lon: p.sigLon };
  const SP = destination(SS.lat, SS.lon, lineBrg, lineNm);
  const lineCtr = destination(SS.lat, SS.lon, lineBrg, lineNm / 2);
  put("SS", "SS", "Start, signal boat end", SS, "stbd");
  put("SP", "SP", "Start, pin end", SP, "port");

  const gateHalf = p.gateWidth / 2 / M_PER_NM;
  const gate = (id, ctr, num) => {
    put(
      `${id}s`,
      `${num}s`,
      "Gate mark, leave to starboard",
      destination(ctr.lat, ctr.lon, norm(wa - 90), gateHalf),
      "stbd"
    );
    put(
      `${id}p`,
      `${num}p`,
      "Gate mark, leave to port",
      destination(ctr.lat, ctr.lon, norm(wa + 90), gateHalf),
      "port"
    );
    marks[id] = { id, virtual: true, ...ctr };
  };

  const fam = SIGNALS[p.signal].family;
  const B = p.beat;
  let ref;

  if (fam === "wl" || fam === "trap") {
    ref = destination(lineCtr.lat, lineCtr.lon, wa, p.startOffset);
    gate("G4", ref, 4);
    put("M1", "1", "Windward mark", destination(ref.lat, ref.lon, wa, B), "port");
  } else if (fam === "tri") {
    ref = destination(lineCtr.lat, lineCtr.lon, wa, p.startOffset);
    gate("G3", ref, 3);
    put("M1", "1", "Windward mark", destination(ref.lat, ref.lon, wa, B), "port");
  } else {
    // Course T: reference is the middle of the start line, mid-beat.
    ref = lineCtr;
    put("M1", "1", "Windward mark", destination(ref.lat, ref.lon, wa, B / 2), "port");
    const m3 = destination(ref.lat, ref.lon, norm(wa + 180), B / 2);
    put("G3", "3", "Leeward mark", m3, "port");
  }

  // --- Second mark -------------------------------------------------
  if (fam === "tri" || fam === "triT") {
    // Sine rule from the interior angles. Mark 2 lies to port of the beat.
    // Sine rule off the leeward mark. On course T the reference is mid-beat, so
    // the leeward mark itself is the triangle vertex; elsewhere it is the
    // reference point. Either way the base leg is a full beat length.
    const { a, b, g } = p.triAngles;
    const base = fam === "triT" ? marks.G3 : ref;
    const d32 = (B * Math.sin(rad(a))) / Math.sin(rad(b));
    put(
      "M2",
      "2",
      "Wing mark",
      destination(base.lat, base.lon, norm(wa - g), d32),
      "port"
    );
  }

  if (fam === "trap") {
    const alpha = p.spinnaker ? 60 : 70;
    const reach = p.reachRatio * B;
    const m2 = destination(
      marks.M1.lat,
      marks.M1.lon,
      norm(wa + 180 + alpha),
      reach
    );
    put("M2", "2", "Reach mark", m2, "port");
    const g3c = destination(m2.lat, m2.lon, norm(wa + 180), B);
    gate("G3", g3c, 3);
  }

  // --- Offset ------------------------------------------------------
  if (p.offset && fam !== "triT") {
    put(
      "M1A",
      "1a",
      "Offset mark",
      destination(
        marks.M1.lat,
        marks.M1.lon,
        norm(wa - p.offsetAngle),
        p.offsetDist / M_PER_NM
      ),
      "port"
    );
  }

  // --- Finish ------------------------------------------------------
  const sig = p.signal;
  let finCtr;
  if (sig === "W" || sig === "TW") {
    finCtr = destination(marks.M1.lat, marks.M1.lon, wa, p.startOffset);
    put(
      "FS",
      "FS",
      "Finish, signal end",
      destination(finCtr.lat, finCtr.lon, norm(wa + 90), lineNm / 4),
      "stbd"
    );
    put(
      "FP",
      "FP",
      "Finish, pin end",
      destination(finCtr.lat, finCtr.lon, norm(wa - 90), lineNm / 4),
      "port"
    );
    marks.FINISH = { id: "FINISH", virtual: true, ...finCtr };
  } else if (fam === "trap") {
    finCtr = destination(marks.G3.lat, marks.G3.lon, norm(wa + 180), p.startOffset);
    put(
      "FS",
      "FS",
      "Finish, signal end",
      destination(finCtr.lat, finCtr.lon, norm(wa + 90), lineNm / 4),
      "stbd"
    );
    put(
      "FP",
      "FP",
      "Finish, pin end",
      destination(finCtr.lat, finCtr.lon, norm(wa - 90), lineNm / 4),
      "port"
    );
    marks.FINISH = { id: "FINISH", virtual: true, ...finCtr };
  } else {
    marks.FINISH = { id: "FINISH", virtual: true, ...lineCtr };
  }
  marks.START = { id: "START", virtual: true, ...lineCtr };

  // --- Legs, from the published rounding order ----------------------
  const seq = (SEQUENCES[sig] && SEQUENCES[sig][p.beats]) || [];
  const expanded = [];
  seq.forEach((tok) => {
    expanded.push(tok);
    if (tok === "M1" && marks.M1A) expanded.push("M1A");
  });

  const legs = [];
  let total = 0;
  for (let i = 0; i < expanded.length - 1; i++) {
    const A = marks[expanded[i]],
      Bm = marks[expanded[i + 1]];
    if (!A || !Bm) continue;
    const inv = inverse(A, Bm);
    // wa is the direction the wind blows FROM, so a leg pointing along wa is
    // sailed to windward. off is the leg's deviation from dead upwind:
    // near 0 is a beat, near 180 is a run.
    //
    // The run boundary is 150, not 135. On a 45-90-45 triangle both reaching
    // legs sit at exactly 135 off the wind, so a boundary there makes their
    // classification depend on floating-point noise — they flip between reach
    // and run, and the target-time solver becomes discontinuous for triangles.
    // 150 also matches the water: a 135 leg is a broad reach carrying a kite,
    // not a dead run sailed on gybing angles.
    const off = Math.abs(((inv.bearing - wa + 540) % 360) - 180);
    const type = off < 45 ? "beat" : off > 150 ? "run" : "reach";
    legs.push({ from: A, to: Bm, ...inv, type });
    total += inv.dist;
  }

  return { marks, legs, total, ref, lineNm, seq: expanded };
}

/* ============================================================
   LAYING ORDER — greedy nearest-neighbour, dependencies respected
   ============================================================ */

function layingOrder(marks, from) {
  const list = Object.values(marks).filter((m) => !m.virtual && m.id !== "SS");
  const out = [];
  let cur = from;
  const left = [...list];
  while (left.length) {
    let bi = 0,
      bd = Infinity;
    left.forEach((m, i) => {
      // The offset resolves against the as-laid windward mark, so it waits.
      if (m.id === "M1A" && left.some((x) => x.id === "M1")) return;
      const d = inverse(cur, m).dist;
      if (d < bd) {
        bd = d;
        bi = i;
      }
    });
    const pick = left.splice(bi, 1)[0];
    out.push(pick);
    cur = pick;
  }
  return out;
}

/* ============================================================
   PLAN VIEW
   ============================================================ */

function PlanView({ course, windAxis }) {
  const { marks, legs, ref } = course;
  const pts = Object.values(marks).filter((m) => !m.virtual);
  if (!pts.length) return null;

  const proj = (m) => {
    const { bearing, dist } = inverse(ref, m);
    const th = rad(bearing - windAxis);
    return { x: dist * Math.sin(th), y: -dist * Math.cos(th) };
  };

  const P = pts.map((m) => ({ ...m, ...proj(m) }));
  const xs = P.map((p) => p.x),
    ys = P.map((p) => p.y);
  const pad = 0.12;
  const minX = Math.min(...xs) - pad,
    maxX = Math.max(...xs) + pad;
  const minY = Math.min(...ys) - pad,
    maxY = Math.max(...ys) + pad;
  const W = 620,
    H = 640;
  const span = Math.max(maxX - minX, ((maxY - minY) * W) / H);
  const spanY = (span * H) / W;
  const cx = (minX + maxX) / 2,
    cy = (minY + maxY) / 2;
  const sx = (x) => ((x - (cx - span / 2)) / span) * W;
  const sy = (y) => ((y - (cy - spanY / 2)) / spanY) * H;

  const at = (m) => {
    const q = proj(m);
    return { x: sx(q.x), y: sy(q.y) };
  };

  const legStyle = {
    beat: { stroke: "var(--ink)", width: 2.2, dash: "none" },
    run: { stroke: "var(--ink)", width: 1.6, dash: "7 5" },
    reach: { stroke: "var(--ink)", width: 1.6, dash: "2 4" },
  };

  // Scale bar
  const barNm = span > 2 ? 0.5 : span > 0.8 ? 0.2 : 0.1;
  const barPx = (barNm / span) * W;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="plan" role="img"
         aria-label="Plan view of the computed course">
      <defs>
        <marker id="arw" markerWidth="9" markerHeight="9" refX="7" refY="3"
                orient="auto">
          <path d="M0,0 L7,3 L0,6 z" fill="var(--ink)" />
        </marker>
      </defs>

      {/* wind */}
      <g className="wind">
        <line x1="46" y1="24" x2="46" y2="74" markerEnd="url(#arw)" />
        <text x="60" y="42">wind</text>
        <text x="60" y="60" className="mono">{String(Math.round(windAxis)).padStart(3, "0")}&deg;</text>
      </g>

      {legs.map((l, i) => {
        const a = at(l.from),
          b = at(l.to);
        const s = legStyle[l.type];
        return (
          <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={s.stroke} strokeWidth={s.width}
                strokeDasharray={s.dash === "none" ? undefined : s.dash}
                opacity="0.5" strokeLinecap="round" />
        );
      })}

      {/* start / finish lines drawn heavier */}
      {[["SS", "SP"], ["FS", "FP"]].map(([a, b], i) =>
        marks[a] && marks[b] ? (
          <line key={i} x1={at(marks[a]).x} y1={at(marks[a]).y}
                x2={at(marks[b]).x} y2={at(marks[b]).y}
                stroke="var(--ink)" strokeWidth="3" opacity="0.85" />
        ) : null
      )}

      {P.map((m) => {
        const q = at(m);
        const fill =
          m.side === "port" ? "var(--port)" : m.side === "stbd" ? "var(--stbd)" : "var(--ink)";
        const r = m.id === "M1A" ? 5 : 7;
        return (
          <g key={m.id}>
            <circle cx={q.x} cy={q.y} r={r} fill={fill} stroke="var(--panel)" strokeWidth="1.5" />
            <text x={q.x + 12} y={q.y + 5} className="mlabel">{m.label}</text>
          </g>
        );
      })}

      <g className="scale">
        <line x1="46" y1={H - 34} x2={46 + barPx} y2={H - 34} />
        <line x1="46" y1={H - 39} x2="46" y2={H - 29} />
        <line x1={46 + barPx} y1={H - 39} x2={46 + barPx} y2={H - 29} />
        <text x="46" y={H - 44} className="mono">{barNm} nm</text>
      </g>
    </svg>
  );
}

/* ============================================================
   APP
   ============================================================ */

export default function CourseSetter() {
  const [sigLat, setSigLat] = useState(50.75);
  const [sigLon, setSigLon] = useState(-1.25);
  const [fix, setFix] = useState(null);
  const [gpsMsg, setGpsMsg] = useState("");

  const [windAxis, setWindAxis] = useState(225);
  const [obs, setObs] = useState([]);
  const [obsIn, setObsIn] = useState("");
  const [variation, setVariation] = useState(0);
  const [showMag, setShowMag] = useState(false);

  const [signal, setSignal] = useState("L");
  const [beats, setBeats] = useState(3);
  const [offset, setOffset] = useState(true);
  const [spinnaker, setSpinnaker] = useState(false);

  const [useTarget, setUseTarget] = useState(true);
  const [targetMin, setTargetMin] = useState(50);
  const [cls, setCls] = useState("ILCA 6");
  const [speed, setSpeed] = useState({ ...CLASS_SPEEDS["ILCA 6"] });
  const [manualBeat, setManualBeat] = useState(1.0);

  const [entries, setEntries] = useState(30);
  const [meanLoa, setMeanLoa] = useState(4.2);
  const [lineFactor, setLineFactor] = useState(1.35);
  const [bias, setBias] = useState(5);
  const [gateWidth, setGateWidth] = useState(60);
  const [offsetDist, setOffsetDist] = useState(60);
  const [offsetAngle, setOffsetAngle] = useState(90);
  const [reachRatio, setReachRatio] = useState(0.5);
  const [startOffset, setStartOffset] = useState(0.05);
  const [copied, setCopied] = useState(false);

  const beatsAllowed = SIGNALS[signal].beats;
  const effBeats = beatsAllowed.includes(beats) ? beats : beatsAllowed[0];

  const base = {
    sigLat, sigLon, windAxis, signal, beats: effBeats, offset, spinnaker,
    entries, meanLoa, lineFactor, bias, gateWidth, offsetDist, offsetAngle,
    reachRatio, startOffset,
    triAngles: { a: 45, b: 90, g: 45 },
  };

  // Solve beat length from target time by iterating the real course geometry.
  const beat = useMemo(() => {
    if (!useTarget) return manualBeat;
    let lo = 0.1, hi = 4.0;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      const c = computeCourse({ ...base, beat: mid });
      const mins = estimateMinutes(c.legs, speed);
      if (mins < targetMin) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  }, [useTarget, manualBeat, targetMin, speed, signal, effBeats, windAxis,
      entries, meanLoa, lineFactor, bias, gateWidth, offset, offsetDist,
      offsetAngle, spinnaker, reachRatio, startOffset, sigLat, sigLon]);

  const course = useMemo(() => computeCourse({ ...base, beat }), [base, beat]);
  const stats = windStats(obs);
  const est = estimateMinutes(course.legs, speed);

  // Distance by point of sail — the thing a single average speed hides.
  const mix = course.legs.reduce(
    (a, l) => ({ ...a, [l.type]: (a[l.type] || 0) + l.dist }),
    { beat: 0, reach: 0, run: 0 }
  );
  const order = useMemo(
    () => layingOrder(course.marks, { lat: sigLat, lon: sigLon }),
    [course, sigLat, sigLon]
  );

  const dispBrg = (b) => norm(showMag ? b - variation : b);

  const getGps = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsMsg("This browser has no location service. Enter the position by hand.");
      return;
    }
    setGpsMsg("Reading position\u2026");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSigLat(+pos.coords.latitude.toFixed(6));
        setSigLon(+pos.coords.longitude.toFixed(6));
        setFix({ acc: pos.coords.accuracy, t: new Date() });
        setGpsMsg("");
      },
      () => setGpsMsg("Location unavailable. Enter the position by hand."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const radioText = order
    .map((m, i) => {
      const d = toDDM(m.lat, m.lon);
      const inv = inverse({ lat: sigLat, lon: sigLon }, m);
      return `${i + 1}. Mark ${m.label} — ${d.lat}  ${d.lon}  (brg ${String(
        Math.round(dispBrg(inv.bearing))
      ).padStart(3, "0")}${showMag ? "M" : "T"} ${inv.dist.toFixed(2)} nm from signal boat)`;
    })
    .join("\n");

  const header = `${signal}${effBeats}  ${SIGNALS[signal].name}\nWind axis ${String(
    Math.round(dispBrg(windAxis))
  ).padStart(3, "0")}${showMag ? "M" : "T"}   Beat ${beat.toFixed(2)} nm   Course ${course.total.toFixed(
    2
  )} nm   Est. ${Math.round(est)} min\n\n`;

  const copy = () => {
    const t = header + radioText;
    if (navigator.clipboard) navigator.clipboard.writeText(t).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const warnings = [];
  if (stats && stats.spread > 15)
    warnings.push(
      `Wind has swung ${Math.round(stats.spread)}\u00b0 across your readings. ${
        SIGNALS[signal].family === "trap"
          ? "A trapezoid will not stay square \u2014 consider a windward/leeward."
          : "Expect to move the windward mark."
      }`
    );
  if (SIGNALS[signal].family === "trap" && !spinnaker && reachRatio === 0.5)
    warnings.push(
      "Non-spinnaker fleet on a half-beat reach. Check the first reach does not become a fetch."
    );
  if (beat < 0.25)
    warnings.push("Beat is very short. Raise the target time or check the class speed.");
  if (fix && fix.acc > 10)
    warnings.push(`Position fix is only accurate to ${Math.round(fix.acc)} m.`);

  return (
    <div className="app">
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

.app{
  --sea:#DCE3E1; --panel:#F5F7F6; --ink:#0E2129; --deep:#1F3A55;
  --muted:#5C6E72; --rule:#B3C1BE; --port:#B4342A; --stbd:#14704A; --warn:#8A5A08;
  font-family:'Barlow Semi Condensed',-apple-system,'Segoe UI',sans-serif;
  background:var(--sea); color:var(--ink); min-height:100%;
  padding:20px; font-size:16px; line-height:1.45;
}
.app *{box-sizing:border-box}
.mono,.app input,.app select{font-family:'IBM Plex Mono',ui-monospace,monospace}
.masthead{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;
  border-bottom:2px solid var(--ink);padding-bottom:10px;margin-bottom:18px}
.masthead h1{font-size:26px;font-weight:600;margin:0;letter-spacing:.01em}
.masthead p{margin:0;color:var(--muted);font-size:15px}
.grid{display:grid;grid-template-columns:minmax(300px,380px) 1fr;gap:18px;align-items:start}
@media(max-width:860px){.grid{grid-template-columns:1fr}}
.panel{background:var(--panel);border:1px solid var(--rule);padding:14px 15px 16px}
.panel + .panel{margin-top:12px}
.panel h2{font-size:14px;font-weight:600;margin:0 0 10px;color:var(--deep);
  letter-spacing:.02em;display:flex;justify-content:space-between;align-items:baseline}
.row{display:flex;gap:9px;align-items:center;margin-bottom:8px}
.row label{flex:1;font-size:15px;color:var(--muted)}
.app input[type=number],.app input[type=text],.app select{
  width:104px;padding:5px 7px;border:1px solid var(--rule);background:#fff;
  color:var(--ink);font-size:14px;text-align:right;border-radius:0}
.app select{width:100%;text-align:left;font-size:14px}
.app input:focus,.app select:focus,.app button:focus-visible{
  outline:2px solid var(--deep);outline-offset:1px}
.wide{width:100%!important;text-align:left}
button{font-family:inherit;font-size:15px;padding:6px 12px;border:1px solid var(--ink);
  background:var(--ink);color:var(--panel);cursor:pointer;border-radius:0}
button.ghost{background:transparent;color:var(--ink)}
button:hover{opacity:.85}
.seg{display:flex;gap:0;border:1px solid var(--rule)}
.seg button{flex:1;border:0;background:transparent;color:var(--muted);padding:6px 4px;
  font-size:14px;border-right:1px solid var(--rule)}
.seg button:last-child{border-right:0}
.seg button[data-on=true]{background:var(--deep);color:var(--panel)}
.readout{display:flex;gap:20px;flex-wrap:wrap;padding:11px 14px;background:var(--ink);
  color:var(--panel);margin-bottom:12px}
.readout div span{display:block;font-size:12px;color:#9BB0B6;letter-spacing:.04em}
.readout div strong{font-size:21px;font-weight:500;font-family:'IBM Plex Mono',monospace}
.plan{width:100%;height:auto;background:var(--panel);border:1px solid var(--rule);display:block}
.plan .wind line{stroke:var(--ink);stroke-width:2}
.plan .wind text{font-family:'Barlow Semi Condensed',sans-serif;font-size:14px;fill:var(--muted)}
.plan .mlabel{font-family:'IBM Plex Mono',monospace;font-size:13px;fill:var(--ink);font-weight:500}
.plan .scale line{stroke:var(--muted);stroke-width:1.5}
.plan .scale text{font-size:12px;fill:var(--muted)}
table{width:100%;border-collapse:collapse;font-size:14px;margin-top:4px}
th{text-align:left;font-weight:600;color:var(--muted);font-size:13px;
  border-bottom:1px solid var(--rule);padding:5px 6px}
td{padding:5px 6px;border-bottom:1px solid #E3E9E7;font-family:'IBM Plex Mono',monospace;font-size:13px}
td.nm{font-family:'Barlow Semi Condensed',sans-serif;font-size:14.5px}
.chip{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:7px;
  vertical-align:baseline}
.warn{background:#F6EEDC;border-left:3px solid var(--warn);padding:8px 11px;
  margin-bottom:9px;font-size:14.5px;color:#4A3A12}
.note{color:var(--muted);font-size:13.5px;margin:7px 0 0}
textarea{width:100%;height:150px;font-family:'IBM Plex Mono',monospace;font-size:12px;
  border:1px solid var(--rule);padding:9px;background:#fff;color:var(--ink);
  resize:vertical;border-radius:0;line-height:1.55}
.tiny{font-size:12.5px;color:var(--muted)}
.obs{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px}
.obs span{font-family:'IBM Plex Mono',monospace;font-size:12px;background:#E7EDEB;
  padding:2px 6px;border:1px solid var(--rule)}
      `}</style>

      <div className="masthead">
        <h1>Course setter</h1>
        <p>Signal boat position to mark positions, for club race officers</p>
      </div>

      <div className="readout">
        <div><span>course</span><strong>{signal}{effBeats}</strong></div>
        <div><span>beat</span><strong>{beat.toFixed(2)} nm</strong></div>
        <div><span>total</span><strong>{course.total.toFixed(2)} nm</strong></div>
        <div><span>estimated</span><strong>{Math.round(est)} min</strong></div>
        <div><span>line</span><strong>{Math.round(course.lineNm * M_PER_NM)} m</strong></div>
      </div>

      {warnings.map((w, i) => <div className="warn" key={i}>{w}</div>)}

      <div className="grid">
        <div>
          <div className="panel">
            <h2>Signal boat</h2>
            <div className="row">
              <label htmlFor="lat">Latitude</label>
              <input id="lat" type="number" step="0.000001" value={sigLat}
                     onChange={(e) => setSigLat(+e.target.value)} />
            </div>
            <div className="row">
              <label htmlFor="lon">Longitude</label>
              <input id="lon" type="number" step="0.000001" value={sigLon}
                     onChange={(e) => setSigLon(+e.target.value)} />
            </div>
            <button className="ghost" onClick={getGps}>Use my position</button>
            {gpsMsg && <p className="note">{gpsMsg}</p>}
            {fix && (
              <p className="note">
                Fixed {fix.t.toLocaleTimeString()}, accurate to {Math.round(fix.acc)} m.
                Re-read after the boat settles on its anchor.
              </p>
            )}
            {!fix && <p className="note">Placeholder position. Read a fix or type one in.</p>}
          </div>

          <div className="panel">
            <h2>
              Wind
              <span className="tiny">{showMag ? "magnetic" : "true"}</span>
            </h2>
            <div className="row">
              <label htmlFor="wa">Axis, degrees the wind blows from</label>
              <input id="wa" type="number" value={Math.round(dispBrg(windAxis))}
                     onChange={(e) => setWindAxis(norm(+e.target.value + (showMag ? variation : 0)))} />
            </div>
            <div className="row">
              <label htmlFor="var">Magnetic variation, east positive</label>
              <input id="var" type="number" step="0.1" value={variation}
                     onChange={(e) => setVariation(+e.target.value)} />
            </div>
            <div className="seg" style={{ marginBottom: 10 }}>
              <button data-on={!showMag} onClick={() => setShowMag(false)}>Show true</button>
              <button data-on={showMag} onClick={() => setShowMag(true)}>Show magnetic</button>
            </div>
            <div className="row">
              <label htmlFor="ob">Log a reading</label>
              <input id="ob" type="number" value={obsIn} placeholder="deg"
                     onChange={(e) => setObsIn(e.target.value)} />
              <button className="ghost" onClick={() => {
                if (obsIn === "") return;
                setObs([...obs, { dir: norm(+obsIn + (showMag ? variation : 0)), t: Date.now() }]);
                setObsIn("");
              }}>Add</button>
            </div>
            {stats && (
              <>
                <p className="note">
                  Median {String(Math.round(dispBrg(stats.mean))).padStart(3, "0")}&deg;,
                  spread {Math.round(stats.spread)}&deg; across {obs.length} reading{obs.length > 1 ? "s" : ""}.
                </p>
                <div className="obs">
                  {obs.map((o, i) => (
                    <span key={i}>{String(Math.round(dispBrg(o.dir))).padStart(3, "0")}</span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 9 }}>
                  <button className="ghost" onClick={() => setWindAxis(stats.mean)}>
                    Commit median as axis
                  </button>
                  <button className="ghost" onClick={() => setObs([])}>Clear</button>
                </div>
              </>
            )}
          </div>

          <div className="panel">
            <h2>Course</h2>
            <select className="wide" value={signal} aria-label="Course type"
                    onChange={(e) => {
                      setSignal(e.target.value);
                      const b = SIGNALS[e.target.value].beats;
                      if (!b.includes(beats)) setBeats(b[0]);
                    }}>
              {Object.entries(SIGNALS).map(([k, v]) => (
                <option key={k} value={k}>{k} — {v.name}</option>
              ))}
            </select>
            <div className="row" style={{ marginTop: 10 }}>
              <label>Beats</label>
              <div className="seg" style={{ flex: 1, maxWidth: 160 }}>
                {beatsAllowed.map((b) => (
                  <button key={b} data-on={b === effBeats} onClick={() => setBeats(b)}>{b}</button>
                ))}
              </div>
            </div>
            <div className="row">
              <label htmlFor="off">Offset mark 1a</label>
              <input id="off" type="checkbox" checked={offset} style={{ width: "auto" }}
                     onChange={(e) => setOffset(e.target.checked)} />
            </div>
            {SIGNALS[signal].family === "trap" && (
              <>
                <div className="row">
                  <label htmlFor="spin">Fleet flies spinnakers</label>
                  <input id="spin" type="checkbox" checked={spinnaker} style={{ width: "auto" }}
                         onChange={(e) => setSpinnaker(e.target.checked)} />
                </div>
                <p className="note">
                  Interior angle {spinnaker ? "60/120" : "70/110"}&deg;. Getting this wrong turns
                  the first reach into a fetch.
                </p>
                <div className="row">
                  <label>Reach as fraction of beat</label>
                  <div className="seg" style={{ flex: 1, maxWidth: 150 }}>
                    <button data-on={reachRatio === 0.5} onClick={() => setReachRatio(0.5)}>1/2</button>
                    <button data-on={reachRatio !== 0.5} onClick={() => setReachRatio(0.667)}>2/3</button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="panel">
            <h2>Length</h2>
            <div className="seg" style={{ marginBottom: 10 }}>
              <button data-on={useTarget} onClick={() => setUseTarget(true)}>From target time</button>
              <button data-on={!useTarget} onClick={() => setUseTarget(false)}>Set beat directly</button>
            </div>
            {useTarget ? (
              <>
                <div className="row">
                  <label htmlFor="tm">Target time, minutes</label>
                  <input id="tm" type="number" value={targetMin}
                         onChange={(e) => setTargetMin(+e.target.value)} />
                </div>
                <select className="wide" value={cls} aria-label="Class"
                        onChange={(e) => { setCls(e.target.value); setSpeed({ ...CLASS_SPEEDS[e.target.value] }); }}>
                  {Object.keys(CLASS_SPEEDS).map((c) => <option key={c}>{c}</option>)}
                </select>
                <div className="row" style={{ marginTop: 9 }}>
                  <label htmlFor="spu">Upwind, made good to windward</label>
                  <input id="spu" type="number" step="0.1" value={speed.up}
                         onChange={(e) => setSpeed((s) => ({ ...s, up: +e.target.value }))} />
                </div>
                <div className="row">
                  <label htmlFor="spr">Reaching, through the water</label>
                  <input id="spr" type="number" step="0.1" value={speed.reach}
                         onChange={(e) => setSpeed((s) => ({ ...s, reach: +e.target.value }))} />
                </div>
                <div className="row">
                  <label htmlFor="spd">Downwind, made good to leeward</label>
                  <input id="spd" type="number" step="0.1" value={speed.down}
                         onChange={(e) => setSpeed((s) => ({ ...s, down: +e.target.value }))} />
                </div>
                <p className="note">
                  This course is {mix.beat.toFixed(2)} nm beating, {mix.reach.toFixed(2)} nm
                  reaching and {mix.run.toFixed(2)} nm running. Because the three are timed
                  separately, a target time set here holds when you switch course family.
                </p>
                <p className="note">
                  Seed estimates in knots. Log your actual elapsed times and adjust them for
                  your venue — after a season this will beat any published table.
                </p>
              </>
            ) : (
              <div className="row">
                <label htmlFor="bl">Beat length, nm</label>
                <input id="bl" type="number" step="0.05" value={manualBeat}
                       onChange={(e) => setManualBeat(+e.target.value)} />
              </div>
            )}
          </div>

          <div className="panel">
            <h2>Line and marks</h2>
            <div className="row">
              <label htmlFor="en">Boats entered</label>
              <input id="en" type="number" value={entries} onChange={(e) => setEntries(+e.target.value)} />
            </div>
            <div className="row">
              <label htmlFor="lo">Mean hull length, m</label>
              <input id="lo" type="number" step="0.1" value={meanLoa}
                     onChange={(e) => setMeanLoa(+e.target.value)} />
            </div>
            <div className="row">
              <label htmlFor="lf">Line length factor</label>
              <input id="lf" type="number" step="0.05" value={lineFactor}
                     onChange={(e) => setLineFactor(+e.target.value)} />
            </div>
            <div className="row">
              <label htmlFor="bi">Pin-end bias, degrees</label>
              <input id="bi" type="number" value={bias} onChange={(e) => setBias(+e.target.value)} />
            </div>
            <div className="row">
              <label htmlFor="gw">Gate width, m</label>
              <input id="gw" type="number" value={gateWidth}
                     onChange={(e) => setGateWidth(+e.target.value)} />
            </div>
            <div className="row">
              <label htmlFor="so">Line to first mark, nm</label>
              <input id="so" type="number" step="0.01" value={startOffset}
                     onChange={(e) => setStartOffset(+e.target.value)} />
            </div>
            {offset && (
              <>
                <div className="row">
                  <label htmlFor="od">Offset distance, m</label>
                  <input id="od" type="number" value={offsetDist}
                         onChange={(e) => setOffsetDist(+e.target.value)} />
                </div>
                <div className="row">
                  <label htmlFor="oa">Offset angle off the wind</label>
                  <input id="oa" type="number" value={offsetAngle}
                         onChange={(e) => setOffsetAngle(+e.target.value)} />
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <PlanView course={course} windAxis={windAxis} />

          <div className="panel" style={{ marginTop: 12 }}>
            <h2>
              Marks, in laying order
              <span className="tiny">bearings {showMag ? "magnetic" : "true"} from signal boat</span>
            </h2>
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Mark</th><th>Latitude</th><th>Longitude</th>
                  <th>Brg</th><th>Dist</th>
                </tr>
              </thead>
              <tbody>
                {order.map((m, i) => {
                  const d = toDDM(m.lat, m.lon);
                  const inv = inverse({ lat: sigLat, lon: sigLon }, m);
                  const c = m.side === "port" ? "var(--port)"
                    : m.side === "stbd" ? "var(--stbd)" : "var(--ink)";
                  return (
                    <tr key={m.id}>
                      <td>{i + 1}</td>
                      <td className="nm">
                        <span className="chip" style={{ background: c }} />{m.label}
                      </td>
                      <td>{d.lat}</td><td>{d.lon}</td>
                      <td>{String(Math.round(dispBrg(inv.bearing))).padStart(3, "0")}&deg;</td>
                      <td>{inv.dist.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="note">
              Mark 1a is laid last because it is positioned against the windward mark as
              actually laid, not as designed.
            </p>
          </div>

          <div className="panel">
            <h2>
              Rounding order
              <span className="tiny">for the sailing instructions</span>
            </h2>
            <p className="mono" style={{ fontSize: 14, margin: "2px 0 0" }}>
              {course.seq
                .map((t) => ({
                  START: "Start", FINISH: "Finish", M1: "1", M1A: "1a", M2: "2",
                  G3: SIGNALS[signal].family === "triT" ? "3" : "3s/3p", G4: "4s/4p",
                }[t] || t))
                .join(" \u2013 ")}
            </p>
          </div>

          <div className="panel">
            <h2>
              Positions for the radio
              <button className="ghost" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
            </h2>
            <textarea readOnly value={header + radioText} />
            <p className="note">
              Degrees and decimal minutes, formatted to be read aloud. Keep this even when
              the mark boats have the app — radios work when phones are wet or flat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

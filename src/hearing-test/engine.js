'use strict';

/* =====================================================================
 * HEARING SCREENER ENGINE
 * Method: Vercammen & Strelcyk (2025), Trends in Hearing 29,
 * doi:10.1177/23312165251317923 (CC BY 4.0).
 *
 *   1. dB re full scale -> dB HL      (calibration offset per frequency)
 *   2. medial threshold t'            (Eq. 1 regression; stand-in until fitted)
 *   3. Bayesian prototype match       (Eq. 2; stand-in prototype library)
 *   4. 0.5 kHz = 1 kHz, 8 kHz = 6 kHz (next-neighbour extrapolation)
 *   5. S = mean(4 k, 6 k, both ears)  -> GOOD / FAIR / POOR
 *
 * Values marked PAPER are taken from the paper. Values marked STAND-IN are
 * not published and must be replaced with Vision Medical's own data.
 * ===================================================================== */
const ENGINE_CONFIG = {
  // STAND-IN: C(f) in dB, so that dB HL = C(f) - dbFullScale.
  // Replace with a biological calibration (median of 10-20 young normal-hearing
  // listeners on our wired headphones at 100 % volume set to 0 dB HL).
  calibration: { 1000: 90, 2000: 90, 4000: 90, 6000: 90 },
  calibrated: false,

  // STAND-IN: σ per ear and frequency, in dB (paper: tuned, not published; error SD ≈ 15 dB).
  sigma: {
    R: { 1000: 12, 2000: 12, 4000: 12, 6000: 12 },
    L: { 1000: 12, 2000: 12, 4000: 12, 6000: 12 },
  },

  // Eq. 1 coefficients per measured point, in the paper's transformed scale
  // t = (dB HL + 20) / 100, with integer powers (power 0 = natural log).
  // null = STAND-IN: t' = measured dB HL plus the questionnaire nudges below.
  regression: null,
  // Example shape once fitted:
  // regression: { 'R2000': { c0, c1, p1, c2, p2, c3, p3 }, 'R4000': {...}, 'L1000': {...}, 'L6000': {...} },

  // STAND-IN nudges (dB) used only while regression is null.
  nudge: { poorSelfRating: 5, frequentDifficulty: 5 },

  cutoff: 47.63,          // PAPER: refer if S > 47.63 dB HL (Youden-optimal)
  fairLow: 25,            // STAND-IN: GOOD if S <= 25
  asymmetry: 15,          // STAND-IN rule: refer if |R4k - L4k| >= 15 dB (needs the extra left 4 kHz tone)
  notHeardPenalty: 5,     // a "not heard" tone counts as the loudest level + 5 dB
};

// PAPER: the four measured points, in test order.
const POINTS = [
  { ear: 'R', f: 2000 },
  { ear: 'R', f: 4000 },
  { ear: 'L', f: 1000 },
  { ear: 'L', f: 6000 },
];
const OUT_FREQS = [500, 1000, 2000, 4000, 6000, 8000];

// PAPER (Table 1): age decades, adults only.
const AGE_BANDS = ['RANGE_18_29', 'RANGE_30_39', 'RANGE_40_49', 'RANGE_50_59', 'RANGE_60_69', 'RANGE_70_79', 'RANGE_80_89', 'RANGE_90_PLUS'];
const AGE_MID = { RANGE_18_29: 24, RANGE_30_39: 35, RANGE_40_49: 45, RANGE_50_59: 55, RANGE_60_69: 65, RANGE_70_79: 75, RANGE_80_89: 85, RANGE_90_PLUS: 92 };

// PAPER (Table 1): numeric coding. Q2 good/not sure/poor = 1/2/3; Q3-Q6 always..never = 1..5.
const Q2_CODE = { GOOD: 1, NOT_SURE: 2, POOR: 3 };
const FREQ_CODE = { ALWAYS: 1, OFTEN: 2, SOMETIMES: 3, RARELY: 4, NEVER: 5 };

/* ---------- Stand-in prototype library ----------
 * Bisgaard et al. (2010) standard audiograms (N2 gives PTA4 31.25 and PTA5 35.0,
 * the paper's own reference values), an age-normal curve per decade
 * (ISO 7029 median, male/female averaged), and midpoints between neighbours.
 * Each prototype is used for both ears. Equal priors.
 * Replace with k-means prototypes from NHANES / clinic audiograms per age decade. */
const BISGAARD = {
  N1: { 500: 10, 1000: 10, 2000: 15, 4000: 30, 6000: 40 },
  N2: { 500: 20, 1000: 25, 2000: 35, 4000: 45, 6000: 50 },
  N3: { 500: 35, 1000: 40, 2000: 50, 4000: 60, 6000: 65 },
  N4: { 500: 55, 1000: 55, 2000: 65, 4000: 75, 6000: 80 },
  N5: { 500: 70, 1000: 75, 2000: 80, 4000: 80, 6000: 80 },
  N6: { 500: 80, 1000: 85, 2000: 90, 4000: 100, 6000: 100 },
  N7: { 500: 95, 1000: 105, 2000: 105, 4000: 105, 6000: 105 },
  S1: { 500: 10, 1000: 10, 2000: 15, 4000: 55, 6000: 70 },
  S2: { 500: 20, 1000: 25, 2000: 55, 4000: 95, 6000: 95 },
  S3: { 500: 35, 1000: 60, 2000: 75, 4000: 80, 6000: 85 },
};
// ISO 7029:2000 median coefficient α (dB/yr²), male/female averaged: ΔH = α (age − 18)².
const ISO7029_ALPHA = { 500: 0.0035, 1000: 0.004, 2000: 0.0065, 4000: 0.0125, 6000: 0.015 };
const MIDPOINTS = [['AGE', 'N1'], ['N1', 'N2'], ['N2', 'N3'], ['N3', 'N4'], ['N4', 'N5'], ['N5', 'N6'], ['N6', 'N7'],
  ['AGE', 'S1'], ['S1', 'S2'], ['S2', 'S3'], ['N1', 'S1'], ['N2', 'S2'], ['N3', 'S3']];

function ageNormal(ageBand) {
  const y = Math.max(0, (AGE_MID[ageBand] || 45) - 18);
  const c = {};
  for (const f in ISO7029_ALPHA) c[f] = ISO7029_ALPHA[f] * y * y;
  return c;
}

function buildPrototypes(ageBand) {
  const curves = { FLAT0: { 500: 0, 1000: 0, 2000: 0, 4000: 0, 6000: 0 }, AGE: ageNormal(ageBand), ...BISGAARD };
  for (const [a, b] of MIDPOINTS) {
    const m = {};
    for (const f of [500, 1000, 2000, 4000, 6000]) m[f] = (curves[a][f] + curves[b][f]) / 2;
    curves[a + '-' + b] = m;
  }
  const names = Object.keys(curves);
  return names.map((name) => ({ name, prior: 1 / names.length, R: curves[name], L: curves[name] }));
}

/* ---------- Maths ---------- */
function erf(x) { // Abramowitz & Stegun 7.1.26
  const s = Math.sign(x); x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return s * y;
}
const Phi = (z) => 0.5 * (1 + erf(z / Math.SQRT2));
const fpow = (x, p) => (p === 0 ? Math.log(x) : Math.pow(x, p));

/* ---------- Steps ---------- */
function toHL(m, f, cfg) {
  const notHeard = m.measurementStatus === 'NOT_HEARD';
  return cfg.calibration[f] - m.dbFullScale + (notHeard ? cfg.notHeardPenalty : 0);
}

function medial(hl, pt, ans, cfg) {
  const q2 = Q2_CODE[ans.q2] || 2;
  const qk = FREQ_CODE[pt.f <= 1000 ? ans.q4 : ans.q5] || 3;   // PAPER: Q4 for 0.5-1 kHz, Q5 for 2-6 kHz
  const coef = cfg.regression && cfg.regression[pt.ear + pt.f];
  if (coef) {
    const t = (hl + 20) / 100;
    const tp = coef.c0 + coef.c1 * fpow(t, coef.p1) + coef.c2 * fpow(q2, coef.p2) + coef.c3 * fpow(qk, coef.p3);
    return tp * 100 - 20;
  }
  let t = hl;
  if (q2 === 3) t += cfg.nudge.poorSelfRating;
  if (qk <= 2) t += cfg.nudge.frequentDifficulty;
  return t;
}

function bestPrototype(tPrime, ageBand, cfg) {
  let best = null;
  let bestLog = -Infinity;
  for (const p of buildPrototypes(ageBand)) {
    let logPost = Math.log(p.prior);
    for (const pt of POINTS) {
      const z = (tPrime[pt.ear][pt.f] - p[pt.ear][pt.f]) / cfg.sigma[pt.ear][pt.f];
      const c = Phi(z);
      logPost += Math.log(c * (1 - c) + 1e-300);
    }
    if (logPost > bestLog) { bestLog = logPost; best = p; }
  }
  return best;
}

const round5 = (v) => Math.round(v / 5) * 5;

function audiogram(p) {
  const ear = (e) => ({
    500: round5(p[e][1000]), 1000: round5(p[e][1000]), 2000: round5(p[e][2000]),
    4000: round5(p[e][4000]), 6000: round5(p[e][6000]), 8000: round5(p[e][6000]),
  });
  return { R: ear('R'), L: ear('L') };
}

/**
 * input = {
 *   ageBand: 'RANGE_60_69',
 *   answers: { q2: 'GOOD'|'NOT_SURE'|'POOR', q4: 'ALWAYS'..'NEVER', q5: ... },
 *   measurements: { RIGHT: { hz2000: {dbFullScale, measurementStatus}, hz4000 }, LEFT: { hz1000, hz6000, hz4000? } },
 *   noiseMasked: false, qualityFlags: []
 * }
 */
function run(input, overrides) {
  const cfg = Object.assign({}, ENGINE_CONFIG, overrides || {});
  const side = { R: 'RIGHT', L: 'LEFT' };
  const measuredHL = { R: {}, L: {} };
  const tPrime = { R: {}, L: {} };
  for (const pt of POINTS) {
    const m = input.measurements[side[pt.ear]]['hz' + pt.f];
    measuredHL[pt.ear][pt.f] = toHL(m, pt.f, cfg);
    tPrime[pt.ear][pt.f] = medial(measuredHL[pt.ear][pt.f], pt, input.answers, cfg);
  }

  const proto = bestPrototype(tPrime, input.ageBand, cfg);
  const A = audiogram(proto);
  const S = (A.R[4000] + A.R[6000] + A.L[4000] + A.L[6000]) / 4;

  let asymmetry = null;
  const l4 = input.measurements.LEFT.hz4000;
  if (l4) {
    const r4HL = measuredHL.R[4000];
    const l4HL = toHL(l4, 4000, cfg);
    measuredHL.L[4000] = l4HL;
    const diff = Math.abs(r4HL - l4HL);
    asymmetry = { diff, flagged: diff >= cfg.asymmetry, worseEar: r4HL > l4HL ? 'R' : 'L' };
  }

  let verdict;
  let reason;
  if (input.noiseMasked) { verdict = 'INCONCLUSIVE'; reason = 'NOISE'; }
  else if ((input.qualityFlags || []).length) { verdict = 'INCONCLUSIVE'; reason = input.qualityFlags[0]; }
  else if (S > cfg.cutoff) { verdict = 'POOR'; reason = 'SCREENING_STATISTIC'; }
  else if (asymmetry && asymmetry.flagged) { verdict = 'POOR'; reason = 'ASYMMETRY'; }
  else if (S > cfg.fairLow) { verdict = 'FAIR'; reason = 'SCREENING_STATISTIC'; }
  else { verdict = 'GOOD'; reason = 'SCREENING_STATISTIC'; }

  return {
    measuredHL, medial: tPrime, prototype: proto.name, audiogram: A,
    screeningStatistic: S, cutoff: cfg.cutoff, asymmetry, verdict, reason,
    calibrated: cfg.calibrated, model: cfg.regression ? 'FITTED' : 'STAND_IN',
  };
}

// Severity band of one threshold, used for the detailed chart.
function severity(db) {
  if (db <= 15) return 'GOOD';
  if (db <= 35) return 'MILD';
  if (db <= 65) return 'MODERATE';
  return 'SEVERE';
}

/* ---------- Self-test (HearingEngine.selfTest()) ----------
 * Calibration-independent: feeds dB FS values that map to known dB HL with C = 90. */
function selfTest() {
  const C = ENGINE_CONFIG.calibration[1000];
  const fs = (hl) => ({ dbFullScale: C - hl, measurementStatus: 'COMPLETED' });
  const cases = [
    { name: '10 Nov worked example, as dB HL', expect: 'POOR', age: 'RANGE_60_69', q2: 'POOR', q4: 'SOMETIMES', q5: 'RARELY', hl: { R2000: 45, R4000: 50, L1000: 40, L6000: 55 } },
    { name: 'Young normal hearing', expect: 'GOOD', age: 'RANGE_18_29', q2: 'GOOD', q4: 'NEVER', q5: 'NEVER', hl: { R2000: 0, R4000: 5, L1000: 0, L6000: 5 } },
    { name: 'Mild sloping loss', expect: 'FAIR', age: 'RANGE_50_59', q2: 'NOT_SURE', q4: 'RARELY', q5: 'SOMETIMES', hl: { R2000: 20, R4000: 35, L1000: 15, L6000: 40 } },
    { name: 'Steep high-frequency loss', expect: 'POOR', age: 'RANGE_70_79', q2: 'POOR', q4: 'SOMETIMES', q5: 'ALWAYS', hl: { R2000: 25, R4000: 60, L1000: 15, L6000: 70 } },
    { name: 'Noisy room', expect: 'INCONCLUSIVE', noise: true, age: 'RANGE_40_49', q2: 'GOOD', q4: 'NEVER', q5: 'NEVER', hl: { R2000: 0, R4000: 0, L1000: 0, L6000: 0 } },
    { name: 'One-sided loss at 4 kHz', expect: 'POOR', age: 'RANGE_40_49', q2: 'NOT_SURE', q4: 'NEVER', q5: 'RARELY', hl: { R2000: 10, R4000: 10, L1000: 10, L6000: 15, L4000: 45 } },
  ];
  return cases.map((c) => {
    const meas = {
      RIGHT: { hz2000: fs(c.hl.R2000), hz4000: fs(c.hl.R4000) },
      LEFT: { hz1000: fs(c.hl.L1000), hz6000: fs(c.hl.L6000) },
    };
    if (c.hl.L4000 != null) meas.LEFT.hz4000 = fs(c.hl.L4000);
    const r = run({ ageBand: c.age, answers: { q2: c.q2, q4: c.q4, q5: c.q5 }, measurements: meas, noiseMasked: !!c.noise });
    return { name: c.name, expect: c.expect, got: r.verdict, S: r.screeningStatistic, prototype: r.prototype, pass: r.verdict === c.expect };
  });
}

const HearingEngine = { CONFIG: ENGINE_CONFIG, POINTS, OUT_FREQS, AGE_BANDS, Q2_CODE, FREQ_CODE, buildPrototypes, run, severity, selfTest };
export default HearingEngine;

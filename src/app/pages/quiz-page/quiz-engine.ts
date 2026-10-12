/**
 * Score engine for the Ski Trip Scan (`/welk-skigebied-past-bij-jullie-team`).
 *
 * Deterministic and framework-free: answers → points → total per destination →
 * winner (with tie-breaks) → alternative → trip style → budget note. Both text
 * versions (fun/serious) share this one engine; only their copy differs.
 *
 * Interpretations of points the briefing leaves open are marked "Choice:" and
 * kept here in one place.
 */

/** Destination codes, in the column order of the briefing's score tables. */
export const DESTINATIONS = ['MAY', 'ZELL', 'SOLD', 'KITZ', 'STAN', 'GST'] as const;

/** One of the six scouted destinations. */
export type Destination = (typeof DESTINATIONS)[number];

/** An answer option: A–D (Q6 only has A–C). */
export type Option = 'A' | 'B' | 'C' | 'D';

/** Which copy the visitor chose; the scores are identical for both. */
export type QuizVersion = 'fun' | 'serious';

/** Trip style derived from Q6. */
export type TripStyle = 'REWARD' | 'BETTER_TOGETHER' | 'RESET';

/** Budget category derived from Q7. */
export type Budget = 'BUDGET_1' | 'BUDGET_2' | 'BUDGET_3' | 'BUDGET_4';

/** Group size category from the final practical question. */
export type GroupSize = 'GROUP_1' | 'GROUP_2' | 'GROUP_3' | 'GROUP_4';

/** All answers of a completed scan. */
export interface QuizAnswers {
  /** Ideal ski day. */
  q1: Option;
  /** Ski experience in the group. */
  q2: Option;
  /** How much shared programme. */
  q3: Option;
  /** Comfort and luxury. */
  q4: Option;
  /** Atmosphere / energy. */
  q5: Option;
  /** Purpose of the trip (A–C). Does not affect the destination. */
  q6: Option;
  /** Budget direction. Does not affect the destination. */
  q7: Option;
  /** Group size. Stored only. */
  group: Option;
}

/** Outcome of a completed scan. */
export interface QuizResult {
  /** Character score per destination (Q1–Q5). */
  scores: Record<Destination, number>;
  /** Primary character match. */
  winner: Destination;
  /** Allowed alternative from the winner's fixed candidate list. */
  alternative: Destination;
  /** Trip style from Q6. */
  tripStyle: TripStyle;
  /** Budget category from Q7. */
  budget: Budget;
  /** Group size category. */
  groupSize: GroupSize;
  /** Whether a budget note should be shown for this winner/budget pair. */
  budgetNote: boolean;
}

/** Points per answer for one question, in {@link DESTINATIONS} order. */
type PointsTable = Record<Option, readonly number[]>;

/** Points for Q1–Q5, copied from the briefing (columns MAY, ZELL, SOLD, KITZ, STAN, GST). */
const POINTS: Record<'q1' | 'q2' | 'q3' | 'q4' | 'q5', PointsTable> = {
  q1: {A: [2, 1, 3, 2, 3, 1], B: [3, 2, 3, 2, 3, 0], C: [1, 2, 0, 3, 1, 3], D: [3, 3, 0, 3, 0, 2]},
  q2: {A: [2, 1, 3, 2, 3, 1], B: [3, 3, 1, 3, 1, 2], C: [2, 3, -2, 3, -2, 3], D: [3, 3, -2, 2, -2, 3]},
  q3: {A: [2, 2, 1, 2, 1, 2], B: [2, 2, 2, 2, 2, 2], C: [2, 3, 0, 2, 0, 3], D: [2, 2, 2, 2, 2, 2]},
  q4: {A: [3, 3, 2, 1, 0, -2], B: [3, 3, 2, 3, 1, 1], C: [1, 1, 2, 3, 3, 3], D: [0, 0, 1, 2, 3, 3]},
  q5: {A: [2, 1, 3, 2, 3, 0], B: [3, 2, 3, 3, 2, 1], C: [3, 3, 0, 3, 0, 2], D: [1, 2, -2, 3, 0, 3]},
};

/** Technical last-resort order: general suitability for mixed company groups. */
const FALLBACK_ORDER: readonly Destination[] = ['MAY', 'KITZ', 'ZELL', 'SOLD', 'STAN', 'GST'];

/** Allowed alternatives per winner, in the briefing's order. */
const ALTERNATIVES: Record<Destination, readonly Destination[]> = {
  MAY: ['ZELL', 'KITZ'],
  ZELL: ['MAY', 'KITZ'],
  SOLD: ['STAN', 'MAY'],
  KITZ: ['MAY', 'GST', 'STAN'],
  STAN: ['SOLD', 'KITZ'],
  GST: ['KITZ', 'STAN'],
};

/** Relative price level per destination (1 = €, 5 = €€€€€), for presentation. */
export const PRICE_LEVEL: Record<Destination, number> = {MAY: 1, ZELL: 1, SOLD: 2, KITZ: 2, STAN: 3, GST: 5};

/** URL slug of each destination's detail page. */
export const DESTINATION_SLUG: Record<Destination, string> = {
  MAY: 'mayrhofen',
  ZELL: 'zell-am-see',
  SOLD: 'solden',
  KITZ: 'kitzbuhel',
  STAN: 'st-anton',
  GST: 'gstaad',
};

/** Display name of each destination. */
export const DESTINATION_NAME: Record<Destination, string> = {
  MAY: 'Mayrhofen',
  ZELL: 'Zell am See-Kaprun',
  SOLD: 'Sölden',
  KITZ: 'Kitzbühel-Kirchberg',
  STAN: 'St. Anton',
  GST: 'Gstaad',
};

/** True when the answer is one of the given options. */
const isOneOf = (answer: Option, ...options: Option[]) => options.includes(answer);

/**
 * Character score per destination: the sum of Q1–Q5 points. Q6, Q7 and group
 * size never change this score.
 *
 * @param answers The scan's answers.
 */
export function scoreDestinations(answers: QuizAnswers): Record<Destination, number> {
  const scores = {} as Record<Destination, number>;
  DESTINATIONS.forEach((destination, column) => {
    scores[destination] = (['q1', 'q2', 'q3', 'q4', 'q5'] as const)
      .reduce((sum, question) => sum + POINTS[question][answers[question]][column], 0);
  });
  return scores;
}

/**
 * The briefing's named rules for an exact two-way tie, or `null` when the pair
 * has no rule (or its rule gives no answer).
 *
 * Choice: for Mayrhofen/Zell, the Mayrhofen condition is checked first, so it
 * wins when both conditions hold; when neither holds, the general tie-break runs.
 */
function pairRule(pair: Destination[], a: QuizAnswers): Destination | null {
  const has = (x: Destination, y: Destination) => pair.includes(x) && pair.includes(y);
  if (has('STAN', 'SOLD')) {
    return isOneOf(a.q4, 'C', 'D') ? 'STAN' : 'SOLD';
  }
  if (has('MAY', 'ZELL')) {
    if (a.q1 === 'B' || a.q5 === 'B') return 'MAY';
    if (a.q1 === 'D' || a.q2 === 'D' || a.q5 === 'C') return 'ZELL';
    return null;
  }
  if (has('MAY', 'KITZ')) {
    return isOneOf(a.q4, 'A', 'B') ? 'MAY' : 'KITZ';
  }
  if (has('KITZ', 'GST')) {
    return a.q5 === 'D' && isOneOf(a.q4, 'C', 'D') ? 'GST' : 'KITZ';
  }
  if (has('KITZ', 'STAN')) {
    return a.q2 === 'A' ? 'STAN' : 'KITZ';
  }
  return null;
}

/**
 * General tie-break. Choice: "use Q2, then Q4, then Q5" is read as comparing
 * the tied destinations' points on that single question; then the fixed
 * fallback order decides.
 */
function generalTieBreak(tied: Destination[], a: QuizAnswers): Destination {
  let remaining = tied;
  for (const question of ['q2', 'q4', 'q5'] as const) {
    const points = (d: Destination) => POINTS[question][a[question]][DESTINATIONS.indexOf(d)];
    const best = Math.max(...remaining.map(points));
    remaining = remaining.filter(d => points(d) === best);
    if (remaining.length === 1) return remaining[0];
  }
  return FALLBACK_ORDER.find(d => remaining.includes(d))!;
}

/**
 * The destination with the highest character score, resolving exact ties.
 * Choice: the named pair rules only apply to two-way ties; a tie between three
 * or more destinations goes straight to the general tie-break.
 *
 * @param scores Character score per destination.
 * @param answers The scan's answers.
 */
export function pickWinner(scores: Record<Destination, number>, answers: QuizAnswers): Destination {
  const top = Math.max(...DESTINATIONS.map(d => scores[d]));
  const tied = DESTINATIONS.filter(d => scores[d] === top);
  if (tied.length === 1) return tied[0];
  return (tied.length === 2 ? pairRule(tied, answers) : null) ?? generalTieBreak(tied, answers);
}

/**
 * Whether the group's ski profile is clearly strong. Choice: mostly experienced
 * skiers (Q2 = A), or both "as much skiing as possible" (Q1 = A) and an active,
 * sporty atmosphere (Q5 = A).
 */
function strongSkiProfile(a: QuizAnswers): boolean {
  return a.q2 === 'A' || (a.q1 === 'A' && a.q5 === 'A');
}

/**
 * The alternative: the highest-scoring destination within the winner's fixed
 * candidate list (never simply number two). For Gstaad, St. Anton is only
 * allowed with a strong ski profile. Ties go to the candidate listed first.
 *
 * @param winner The primary match.
 * @param scores Character score per destination.
 * @param answers The scan's answers.
 */
export function pickAlternative(winner: Destination, scores: Record<Destination, number>, answers: QuizAnswers): Destination {
  const candidates = ALTERNATIVES[winner]
    .filter(d => !(winner === 'GST' && d === 'STAN' && !strongSkiProfile(answers)));
  return candidates.reduce((best, d) => (scores[d] > scores[best] ? d : best));
}

/**
 * Whether the budget choice clearly clashes with the winner's price level.
 * Gstaad with budget A/B, St. Anton with budget A/B (Choice: the briefing
 * gives no trigger for St. Anton; A/B is the clear tension with €€€), and
 * Kitzbühel with budget A. No note for other combinations.
 *
 * @param winner The primary match.
 * @param q7 The budget answer.
 */
export function needsBudgetNote(winner: Destination, q7: Option): boolean {
  if (winner === 'GST' || winner === 'STAN') return isOneOf(q7, 'A', 'B');
  if (winner === 'KITZ') return q7 === 'A';
  return false;
}

/** Maps an A–D answer to its position (0–3). */
const indexOf = (option: Option) => ['A', 'B', 'C', 'D'].indexOf(option);

/**
 * Runs the full scan: scores, winner, alternative, trip style, budget and group.
 *
 * @param answers The scan's answers.
 */
export function evaluateQuiz(answers: QuizAnswers): QuizResult {
  const scores = scoreDestinations(answers);
  const winner = pickWinner(scores, answers);
  return {
    scores,
    winner,
    alternative: pickAlternative(winner, scores, answers),
    tripStyle: (['REWARD', 'BETTER_TOGETHER', 'RESET'] as const)[indexOf(answers.q6)] ?? 'RESET',
    budget: `BUDGET_${indexOf(answers.q7) + 1}` as Budget,
    groupSize: `GROUP_${indexOf(answers.group) + 1}` as GroupSize,
    budgetNote: needsBudgetNote(winner, answers.q7),
  };
}

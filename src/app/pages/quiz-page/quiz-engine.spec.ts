import {describe, expect, it} from 'vitest';
import {
  Destination,
  DESTINATIONS,
  evaluateQuiz,
  needsBudgetNote,
  Option,
  pickWinner,
  QuizAnswers,
  scoreDestinations,
} from './quiz-engine';

/** Builds a full answer set from Q1–Q5 plus defaults for the non-scoring questions. */
const answers = (q1: Option, q2: Option, q3: Option, q4: Option, q5: Option, extra: Partial<QuizAnswers> = {}): QuizAnswers =>
  ({q1, q2, q3, q4, q5, q6: 'A', q7: 'B', group: 'B', ...extra});

/** Every combination of Q1–Q5 answers (4^5 = 1024). */
const allCombinations = (): QuizAnswers[] => {
  const opts: Option[] = ['A', 'B', 'C', 'D'];
  const out: QuizAnswers[] = [];
  for (const q1 of opts) for (const q2 of opts) for (const q3 of opts) for (const q4 of opts) for (const q5 of opts) {
    out.push(answers(q1, q2, q3, q4, q5));
  }
  return out;
};

describe('quiz engine', () => {
  it('sums Q1–Q5 points per destination', () => {
    // Q1 A [2,1,3,2,3,1] + Q2 A [2,1,3,2,3,1] + Q3 B [2×6] + Q4 B [3,3,2,3,1,1] + Q5 A [2,1,3,2,3,0]
    expect(scoreDestinations(answers('A', 'A', 'B', 'B', 'A'))).toEqual({MAY: 11, ZELL: 8, SOLD: 13, KITZ: 11, STAN: 12, GST: 5});
  });

  it('ignores Q6, Q7 and group size for the score', () => {
    const base = answers('B', 'C', 'A', 'D', 'C');
    expect(scoreDestinations({...base, q6: 'C', q7: 'D', group: 'D'})).toEqual(scoreDestinations(base));
  });

  it('applies the St. Anton / Sölden tie rule', () => {
    const tie = {MAY: 0, ZELL: 0, SOLD: 10, KITZ: 0, STAN: 10, GST: 0};
    expect(pickWinner(tie, answers('A', 'A', 'A', 'C', 'A'))).toBe('STAN');
    expect(pickWinner(tie, answers('A', 'A', 'A', 'B', 'A'))).toBe('SOLD');
  });

  it('applies the Mayrhofen / Zell tie rule, Mayrhofen condition first', () => {
    const tie = {MAY: 10, ZELL: 10, SOLD: 0, KITZ: 0, STAN: 0, GST: 0};
    expect(pickWinner(tie, answers('B', 'D', 'A', 'A', 'A'))).toBe('MAY');
    expect(pickWinner(tie, answers('D', 'A', 'A', 'A', 'A'))).toBe('ZELL');
  });

  it('applies the Kitzbühel / Gstaad and Kitzbühel / St. Anton tie rules', () => {
    const kg = {MAY: 0, ZELL: 0, SOLD: 0, KITZ: 10, STAN: 0, GST: 10};
    expect(pickWinner(kg, answers('A', 'A', 'A', 'D', 'D'))).toBe('GST');
    expect(pickWinner(kg, answers('A', 'A', 'A', 'B', 'D'))).toBe('KITZ');
    const ks = {MAY: 0, ZELL: 0, SOLD: 0, KITZ: 10, STAN: 10, GST: 0};
    expect(pickWinner(ks, answers('A', 'A', 'A', 'A', 'A'))).toBe('STAN');
    expect(pickWinner(ks, answers('A', 'B', 'A', 'A', 'A'))).toBe('KITZ');
  });

  it('shows budget notes only for the clashing combinations', () => {
    expect(needsBudgetNote('GST', 'B')).toBe(true);
    expect(needsBudgetNote('GST', 'C')).toBe(false);
    expect(needsBudgetNote('STAN', 'A')).toBe(true);
    expect(needsBudgetNote('KITZ', 'A')).toBe(true);
    expect(needsBudgetNote('KITZ', 'B')).toBe(false);
    expect(needsBudgetNote('MAY', 'A')).toBe(false);
  });

  it('maps Q6, Q7 and group size to their codes', () => {
    const r = evaluateQuiz(answers('A', 'A', 'A', 'A', 'A', {q6: 'B', q7: 'D', group: 'C'}));
    expect([r.tripStyle, r.budget, r.groupSize]).toEqual(['BETTER_TOGETHER', 'BUDGET_4', 'GROUP_3']);
  });

  it('gives a valid result for every possible answer combination', () => {
    const winners = new Set<Destination>();
    for (const a of allCombinations()) {
      const r = evaluateQuiz(a);
      winners.add(r.winner);
      expect(r.alternative).not.toBe(r.winner);
      // The winner always has the top character score.
      expect(r.scores[r.winner]).toBe(Math.max(...DESTINATIONS.map(d => r.scores[d])));
      // St. Anton is only Gstaad's alternative with a strong ski profile.
      if (r.winner === 'GST' && r.alternative === 'STAN') {
        expect(a.q2 === 'A' || (a.q1 === 'A' && a.q5 === 'A')).toBe(true);
      }
    }
    expect([...winners].sort()).toEqual([...DESTINATIONS].sort());
  });
});

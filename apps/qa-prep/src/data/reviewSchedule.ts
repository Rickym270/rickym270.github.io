import type { ConfidenceLevel } from '../types/trainingProgress';

/** Days until a topic is due for review by confidence level. */
const INTERVALS: Record<ConfidenceLevel, number> = {
  cold: 1,
  'needs-review': 2,
  'with-hints': 4,
  'reasoned-through': 7,
};

export function daysUntilDue(confidence: ConfidenceLevel): number {
  return INTERVALS[confidence];
}

export function isTopicDue(lastPracticedMs: number, confidence: ConfidenceLevel): boolean {
  const dueAt = lastPracticedMs + daysUntilDue(confidence) * 24 * 60 * 60 * 1000;
  return Date.now() >= dueAt;
}

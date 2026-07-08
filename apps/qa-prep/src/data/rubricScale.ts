import type { RubricLevel } from '../types/scoringRubric';

export const RUBRIC_SCALE: { score: RubricLevel; label: string }[] = [
  { score: 1, label: 'Vague, buzzword-heavy, no example' },
  { score: 3, label: 'Decent explanation, some structure, limited impact' },
  { score: 5, label: 'Specific example, clear reasoning, tools used, business impact' },
];

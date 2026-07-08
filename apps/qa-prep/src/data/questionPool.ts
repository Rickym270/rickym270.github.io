import { assertPoolAnswerBullets } from './answerBullets';
import { topics } from './topics';
import { panelRounds } from './panelRounds';
import { strongAnswers } from './strongAnswers';

export type PoolQuestion = {
  id: string;
  topicId: string;
  question: string;
  modelAnswer: string;
  answerBullets: string[];
  compareBullets: string[];
  pitfalls: string[];
  category: string;
  weight: number;
};

function buildPool(): PoolQuestion[] {
  const pool: PoolQuestion[] = [];

  for (const topic of topics) {
    topic.mockQuestions.forEach((q, i) => {
      pool.push({
        id: `topic:${topic.id}:q${i}`,
        topicId: topic.id,
        question: q,
        modelAnswer: topic.sampleAnswers[i] ?? '',
        answerBullets: topic.sampleAnswerBullets[i] ?? [],
        compareBullets: topic.strongAnswerBullets,
        pitfalls: topic.commonPitfalls,
        category: topic.title,
        weight: 2,
      });
    });
  }

  for (const round of panelRounds) {
    for (const q of round.questions) {
      const topic = topics.find((t) => t.id === q.topicId);
      pool.push({
        id: `panel:${q.id}`,
        topicId: q.topicId,
        question: q.question,
        modelAnswer: q.sampleAnswer,
        answerBullets: q.strongAnswerIncludes,
        compareBullets: q.strongAnswerIncludes,
        pitfalls: topic?.commonPitfalls ?? [],
        category: round.title,
        weight: 1.5,
      });
    }
  }

  for (const sa of strongAnswers) {
    const topicId =
      sa.id === 'test-api'
        ? 'backend-api-testing'
        : sa.id === 'test-eligibility-rules'
          ? 'eligibility-rules-engine'
          : sa.id === 'maintainable-test-data'
            ? 'test-data-strategy'
            : sa.id === 'debug-flaky-tests'
              ? 'flaky-test-debugging'
              : sa.id === 'cloudwatch-logs'
                ? 'logging-monitoring'
                : sa.id === 'robot-playwright-to-pytest'
                  ? 'pytest-prep'
                  : sa.id === 'review-dev-unit-tests'
                    ? 'behavioral-leadership'
                    : sa.id === 'sql-validate-results'
                      ? 'sql-data-triage'
                      : sa.id === 'pm-scrum-priorities'
                        ? 'scrum-product-collaboration'
                        : 'cicd-automation-architecture';
    const topic = topics.find((t) => t.id === topicId);
    pool.push({
      id: `strong:${sa.id}`,
      topicId,
      question: sa.question,
      modelAnswer: sa.answer,
      answerBullets: sa.answerBullets,
      compareBullets: topic?.strongAnswerBullets ?? [],
      pitfalls: topic?.commonPitfalls ?? [],
      category: 'Strong Answers',
      weight: 1,
    });
  }

  return pool;
}

export const questionPool = buildPool();
assertPoolAnswerBullets(questionPool);

export function shufflePool(pool: PoolQuestion[] = questionPool): PoolQuestion[] {
  const weighted: PoolQuestion[] = [];
  for (const q of pool) {
    const copies = Math.max(1, Math.round(q.weight));
    for (let i = 0; i < copies; i++) weighted.push(q);
  }
  for (let i = weighted.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [weighted[i], weighted[j]] = [weighted[j]!, weighted[i]!];
  }
  const seen = new Set<string>();
  const result: PoolQuestion[] = [];
  for (const q of weighted) {
    if (!seen.has(q.id)) {
      seen.add(q.id);
      result.push(q);
    }
  }
  return result;
}

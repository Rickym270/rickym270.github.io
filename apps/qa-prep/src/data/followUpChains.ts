import { panelRounds } from './panelRounds';
import { topics } from './topics';

export type FollowUpProbe = {
  question: string;
  evaluates: string;
};

export type FollowUpChain = {
  id: string;
  topicId: string;
  triggers: string[];
  probes: FollowUpProbe[];
};

const GENERIC_PROBES: FollowUpProbe[] = [
  {
    question: 'What specifically did YOU build or own?',
    evaluates: 'Personal ownership and specificity—not team-level hand-waving.',
  },
  {
    question: 'What metrics or outcomes improved?',
    evaluates: 'Business impact and measurable results.',
  },
  {
    question: 'What was difficult, and how did you handle it?',
    evaluates: 'Honest tradeoffs and problem-solving under constraints.',
  },
];

const TOPIC_CHAINS: FollowUpChain[] = [
  {
    id: 'pytest-prep-chain',
    topicId: 'pytest-prep',
    triggers: ['pytest-prep', 'r1-pytest'],
    probes: [
      {
        question: 'Why fixtures instead of copy-pasting setup in every test?',
        evaluates: 'Understanding DRY and maintainability when auth or URLs change.',
      },
      {
        question: 'How would you mark tests that need a full staging environment?',
        evaluates: 'Practical CI tiering with markers—not running everything on every commit.',
      },
      ...GENERIC_PROBES.slice(0, 2),
    ],
  },
  {
    id: 'logging-monitoring-chain',
    topicId: 'logging-monitoring',
    triggers: ['logging-monitoring', 'r2-logs', 'r2-observability'],
    probes: [
      {
        question: 'How do you correlate a test failure to the right log line?',
        evaluates: 'Correlation IDs, timestamps, and structured fields—not grep roulette.',
      },
      {
        question: 'What would you log vs. never log in a healthcare API?',
        evaluates: 'PHI awareness and safe observability.',
      },
      ...GENERIC_PROBES.slice(0, 2),
    ],
  },
  {
    id: 'test-data-strategy-chain',
    topicId: 'test-data-strategy',
    triggers: ['test-data-strategy', 'r1-test-data'],
    probes: [
      {
        question: 'Why not copy production data into staging?',
        evaluates: 'HIPAA risk and refresh pain—synthetic personas instead.',
      },
      {
        question: 'How do parallel CI jobs avoid colliding on the same records?',
        evaluates: 'Isolation strategy and deterministic IDs.',
      },
      ...GENERIC_PROBES.slice(0, 2),
    ],
  },
  {
    id: 'behavioral-leadership-chain',
    topicId: 'behavioral-leadership',
    triggers: ['behavioral-leadership', 'r3-release-pushback', 'r3-mentoring'],
    probes: [
      {
        question: 'What alternatives did you present—not just “delay”?',
        evaluates: 'Collaborative advocacy with options for PM and eng.',
      },
      {
        question: 'Why was your approach better than saying no?',
        evaluates: 'Partnership mindset vs. gatekeeper.',
      },
      ...GENERIC_PROBES.slice(0, 2),
    ],
  },
  {
    id: 'flaky-test-debugging-chain',
    topicId: 'flaky-test-debugging',
    triggers: ['flaky-test-debugging', 'r1-flaky'],
    probes: [
      {
        question: 'Why not just add a retry or a longer sleep?',
        evaluates: 'Root cause vs. masking—shows senior judgment at mid level.',
      },
      {
        question: 'What evidence proved it was environment timing, not bad assertions?',
        evaluates: 'Log/timestamp reasoning.',
      },
      ...GENERIC_PROBES.slice(0, 2),
    ],
  },
  {
    id: 'cicd-automation-chain',
    topicId: 'cicd-automation-architecture',
    triggers: ['cicd-automation-architecture', 'r1-cicd'],
    probes: [
      {
        question: 'Why split tests into tiers instead of running everything on every PR?',
        evaluates: 'Developer feedback speed vs. coverage tradeoff.',
      },
      {
        question: 'How do you parallelize without losing reliability?',
        evaluates: 'Sharding, isolation, and flake detection.',
      },
      ...GENERIC_PROBES.slice(0, 2),
    ],
  },
  {
    id: 'sql-data-triage-chain',
    topicId: 'sql-data-triage',
    triggers: ['sql-data-triage', 'r2-sql-triage', 'r2-sql-claims'],
    probes: [
      {
        question: 'How did you prove the bug was data vs. application logic?',
        evaluates: 'Ground-truth validation in the database.',
      },
      {
        question: 'What effective-date or plan-year edge case mattered?',
        evaluates: 'Healthcare domain awareness.',
      },
      ...GENERIC_PROBES.slice(0, 2),
    ],
  },
  {
    id: 'scrum-product-collaboration-chain',
    topicId: 'scrum-product-collaboration',
    triggers: ['scrum-product-collaboration', 'r3-pm-scope', 'r3-sprint-priority'],
    probes: [
      {
        question: 'How did you document residual risk when scope was cut?',
        evaluates: 'Written agreement and monitoring—not silent acceptance.',
      },
      {
        question: 'What would you change if you faced this again?',
        evaluates: 'Reflection and growth.',
      },
      ...GENERIC_PROBES.slice(0, 2),
    ],
  },
];

function chainFromPanelQuestion(questionId: string, topicId: string): FollowUpChain | null {
  const round = panelRounds.flatMap((r) => r.questions).find((q) => q.id === questionId);
  if (!round) return null;

  const probes: FollowUpProbe[] = [];
  for (const fu of round.followUps) {
    probes.push({ question: fu, evaluates: 'Depth and specificity on your prior answer.' });
  }
  if (round.stretchFollowUp) {
    probes.push({
      question: round.stretchFollowUp.question,
      evaluates: 'Why-depth—not just what you did.',
    });
  }
  if (probes.length < 3) {
    probes.push(...GENERIC_PROBES.slice(0, 3 - probes.length));
  }

  return {
    id: `panel-${questionId}`,
    topicId,
    triggers: [questionId, topicId],
    probes: probes.slice(0, 4),
  };
}

function chainFromTopic(topicId: string, questionIndex?: number): FollowUpChain | null {
  const topic = topics.find((t) => t.id === topicId);
  if (!topic || topic.followUpQuestions.length === 0) return null;

  const idx = questionIndex ?? 0;
  const probes: FollowUpProbe[] = topic.followUpQuestions.map((q, i) => ({
    question: q,
    evaluates:
      i === 0
        ? 'Follow-up depth on your first answer.'
        : 'Specificity and real examples.',
  }));
  if (probes.length < 3) {
    probes.push(...GENERIC_PROBES.slice(0, 3 - probes.length));
  }

  return {
    id: `topic-${topicId}-q${idx}`,
    topicId,
    triggers: [topicId],
    probes: probes.slice(0, 4),
  };
}

export function getFollowUpChain(
  questionKey: string,
  topicId: string
): FollowUpChain {
  const panelId = questionKey.startsWith('panel:')
    ? questionKey.replace('panel:', '')
    : null;

  if (panelId) {
    const panelChain = chainFromPanelQuestion(panelId, topicId);
    if (panelChain) return panelChain;
  }

  const topicMatch = TOPIC_CHAINS.find(
    (c) =>
      c.topicId === topicId ||
      c.triggers.some((t) => questionKey.includes(t) || t === panelId)
  );
  if (topicMatch) return topicMatch;

  const topicIdxMatch = questionKey.match(/q(\d+)$/);
  const qIndex = topicIdxMatch ? Number(topicIdxMatch[1]) : undefined;
  const fromTopic = chainFromTopic(topicId, qIndex);
  if (fromTopic) return fromTopic;

  return {
    id: `generic-${topicId}`,
    topicId,
    triggers: [topicId],
    probes: GENERIC_PROBES,
  };
}

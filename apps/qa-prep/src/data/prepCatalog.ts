export const PREP_LEVELS = {
  core: {
    label: 'Core Prep',
    shortDescription:
      'APIs, test data, debugging, SQL/logs, and collaboration.',
    description:
      'Practical, hands-on prep for Technical QA Analyst II — APIs, test data, debugging, SQL/logs, and cross-functional collaboration.',
  },
  stretch: {
    label: 'Stretch',
    shortDescription: 'Explain the why behind your approach.',
    description:
      'Experienced IC thinking — sound thoughtful without over-leveling into Staff QA strategy.',
  },
  advanced: {
    label: 'Advanced',
    shortDescription: 'Senior-level strategy — optional depth.',
    description:
      'Optional depth if an interviewer goes further, or for future Senior SDET / QA Lead roles.',
  },
} as const;

export const CORE_TOPIC_IDS = [
  'backend-api-testing',
  'test-data-strategy',
  'eligibility-rules-engine',
  'pytest-prep',
  'flaky-test-debugging',
  'sql-data-triage',
  'logging-monitoring',
  'behavioral-leadership',
  'scrum-product-collaboration',
  'cicd-automation-architecture',
] as const;

export const CORE_STRONG_ANSWER_IDS = [
  'test-api',
  'test-eligibility-rules',
  'maintainable-test-data',
  'debug-flaky-tests',
  'cloudwatch-logs',
  'robot-playwright-to-pytest',
  'review-dev-unit-tests',
  'sql-validate-results',
  'pm-scrum-priorities',
] as const;

export const ADVANCED_STRONG_ANSWER_IDS = ['what-not-to-automate'] as const;

export const CORE_STORY_IDS = [
  'lambda-cold-start',
  'test-data-management',
  'hipaa-api-validation',
  'playwright-ci-optimization',
  'xpress-transit-requirements',
  'mentoring-developers',
  'sql-claims-reconciliation',
  'formulary-sprint-coordination',
] as const;

export const ADVANCED_STORY_IDS = [
  'splunk-dashboard',
  'tradeweb-networking-automation',
  'production-api-investigation',
  'accessibility-testing-initiative',
  'sole-qa-medidata',
] as const;

export const DEFAULT_CORE_TOPIC_ID = CORE_TOPIC_IDS[0];

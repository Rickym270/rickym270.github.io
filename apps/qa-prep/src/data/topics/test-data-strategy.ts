import type { Topic } from '../../types/topic';

export const testDataStrategy: Topic = {
  id: 'test-data-strategy',
  title: 'Test Data Strategy',
  flashcards: [
    {
      front: 'What is the golden rule for test data in healthcare QA?',
      back: 'Never use real PHI—use synthetic data that mirrors production patterns (plan types, copay tiers, NDC codes) without identifiable members.',
    },
    {
      front: 'What is a test data persona?',
      back: 'A reusable synthetic member/plan profile with deterministic IDs and documented scenario coverage (e.g., COB, high-deductible).',
    },
    {
      front: 'Why version-control test data fixtures?',
      back: 'So any engineer can reproduce the exact scenario—no one-off records or tribal knowledge.',
    },
    {
      front: 'How do you isolate destructive tests?',
      back: 'Dedicated records per test run, teardown fixtures, or ephemeral staging refresh—never share mutable data across parallel jobs.',
    },
  ],
  mockQuestions: [
    'Describe your approach to building and maintaining test data for a PBM platform.',
    'How do you create test data that covers eligibility edge cases without using production dumps?',
    'How would you onboard a new QA engineer to your test data setup?',
    'What is your strategy when staging data becomes stale or corrupted?',
  ],
  strongAnswerBullets: [
    'Define reusable personas with deterministic IDs (active, COB, high-deductible, terminated)',
    'Seed via fixtures or factory functions, version-controlled alongside tests',
    'Document which persona covers which scenario—avoid duplicate setup',
    'Never copy production dumps; synthetic data only for HIPAA compliance',
    'Schedule staging refresh; isolate destructive tests with dedicated records',
    'Balance data volume for performance tests vs. fast repeatable CI runs',
  ],
  commonPitfalls: [
    'Copying production dumps into lower environments',
    'Creating one-off test records nobody else can reproduce',
    'Sharing mutable member IDs across parallel CI jobs',
    'No documentation of which data covers which business scenario',
  ],
  followUpQuestions: [
    'How do you balance realistic data volume for performance testing with fast CI runs?',
    'What do you do when a developer needs a scenario your personas do not cover?',
    'How do you handle PHI boundaries when developers ask for "realistic" data?',
  ],
  sampleAnswers: [
    'I define a small set of reusable personas—active member, COB, high-deductible, terminated—with deterministic IDs and documented scenario coverage. Data is seeded via fixtures or factories, version-controlled alongside tests, and staging refreshes on a schedule. Destructive tests get isolated records so parallel CI jobs never collide.',
    'I build synthetic personas that mirror production patterns—plan tiers, copay levels, NDC codes—without copying production dumps. Each persona is documented for which eligibility edge cases it covers. New scenarios extend the persona library rather than creating one-off records.',
    'I walk them through the persona catalog, show how to run seed scripts locally, and pair on their first test. Documentation maps each persona to business scenarios. Within a week they should create tests using existing fixtures without asking for custom data every time.',
    'When staging data is stale I run a controlled refresh from seed scripts, quarantine tests that depend on corrupted records, and communicate the refresh window to the team. I never patch data manually without updating the version-controlled seed so others can reproduce.',
  ],
  sampleAnswerBullets: [
    [
      'I define a small set of reusable personas—active member, COB, high-deductible, terminated—with deterministic IDs and documented scenario coverage.',
      'Data is seeded via fixtures or factories and version-controlled alongside tests.',
      'Staging refreshes on a schedule, and destructive tests get isolated records so parallel CI jobs never collide.',
    ],
    [
      'I build synthetic personas that mirror production patterns—plan tiers, copay levels, NDC codes—without copying production dumps.',
      'Each persona is documented for which eligibility edge cases it covers.',
      'New scenarios extend the persona library rather than creating one-off records.',
    ],
    [
      'I walk them through the persona catalog and show how to run seed scripts locally.',
      'I pair on their first test and map each persona to business scenarios in documentation.',
      'Within a week they should create tests using existing fixtures without asking for custom data every time.',
    ],
    [
      'When staging data is stale I run a controlled refresh from seed scripts.',
      'I quarantine tests that depend on corrupted records and communicate the refresh window to the team.',
      'I never patch data manually without updating the version-controlled seed so others can reproduce.',
    ],
  ],
  followUpSampleAnswers: [
    'I keep CI personas minimal—five to ten core profiles—for fast repeatable runs. Performance tests use a separate larger dataset generated on demand or nightly, not on every PR. That gives realistic volume when needed without slowing daily feedback.',
    'I evaluate whether the scenario belongs in the persona library long term. If yes, I add a factory function and document it. If it is a one-off, I still create an isolated fixture with a clear name so the next person does not reinvent it.',
    'I explain that realistic does not mean real PHI—we use synthetic data that mirrors patterns. I show examples of compliant fixtures and redact anything sensitive from shared logs. If they need richer data, we extend personas together rather than importing production.',
  ],
};

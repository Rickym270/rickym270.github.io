import type { Topic } from '../../types/topic';

export const cicdAutomationArchitecture: Topic = {
  id: 'cicd-automation-architecture',
  title: 'CI/CD and Automation Architecture',
  flashcards: [
    {
      front: 'What is a sensible test tier split for a healthcare API platform?',
      back: 'Unit (every commit) → contract/integration (PR gate) → E2E smoke (staging deploy) → full regression (nightly/release).',
    },
    {
      front: 'What is test sharding?',
      back: 'Splitting a suite across parallel CI jobs (e.g., GitHub Actions matrix) to reduce wall-clock time.',
    },
    {
      front: 'What should block a production deploy?',
      back: 'Critical-path failures only—smoke E2E, integration on staging, security scans—not every non-critical warning.',
    },
    {
      front: 'What are CI artifacts and why do they matter?',
      back: 'Logs, screenshots, API traces, and reports saved from failed runs so engineers can debug without re-running locally.',
    },
  ],
  mockQuestions: [
    'How would you improve CI pipeline feedback for automated testing on a PBM platform?',
    'Our E2E suite takes 45 minutes. How would you get PR feedback under 15 minutes?',
    'What tests run on every commit vs. only after deploy vs. nightly?',
    'How do you handle secrets and HIPAA-sensitive config in CI?',
  ],
  strongAnswerBullets: [
    'Tier pipeline: lint/unit on push → integration at PR gate → smoke E2E after deploy → nightly full regression',
    'Parallelize by domain or file using matrix sharding—target under 15 min PR feedback',
    'Use markers/tags to split fast checks from staging-dependent integration tests',
    'Fail fast; publish artifacts (redacted logs, traces, correlation IDs)',
    'Store secrets in CI vault (GitHub Secrets, AWS SSM)—never in repo',
    'Block deploy on critical-path failures; document what each tier protects',
  ],
  commonPitfalls: [
    'Running full E2E on every commit—45-minute builds, developers skip CI',
    'No artifacts on failure—engineers must re-run locally to debug',
    'Hard-coding credentials in test config or repo files',
    'No distinction between PR checks and release gates',
  ],
  followUpQuestions: [
    'How would you handle tests that require credentials or HIPAA-sensitive config in CI?',
    'When would you run performance tests in the pipeline vs. on demand?',
    'How do you decide what to automate first on a new PBM platform?',
  ],
  sampleAnswers: [
    'I\'d profile what\'s slow in the current pipeline and propose incremental tier splits. Lint and unit tests on every push; integration tests gate PR merges against staging with synthetic data. Smoke E2E after deploy; full regression nightly. I parallelize by domain where needed to keep PR feedback under 15 minutes and publish clear artifacts on failure.',
    'I split the E2E suite into shards using a CI matrix—parallel jobs by test file group. Smoke tests run on PR; full sharded regression on merge. I tag slow tests and move setup to session-scoped fixtures to cut redundant browser or API warm-up.',
    'Every commit: lint, unit, contract tests. PR gate: integration against staging. Post-deploy: smoke E2E on production-like env. Nightly: full regression including edge cases. Release: performance and security scans as needed.',
    'Secrets live in GitHub Secrets or AWS SSM—never in the repo. CI injects credentials at runtime; test configs reference env vars only. I audit logs to ensure PHI never appears in CI output and rotate test credentials regularly.',
  ],
  sampleAnswerBullets: [
    [
      "I'd profile what's slow in the current pipeline and propose incremental tier splits.",
      'Lint and unit tests on every push; integration tests gate PR merges against staging with synthetic data.',
      'Smoke E2E after deploy; full regression nightly.',
      'I parallelize by domain where needed to keep PR feedback under 15 minutes and publish clear artifacts on failure.',
    ],
    [
      'I split the E2E suite into shards using a CI matrix—parallel jobs by test file group.',
      'Smoke tests run on PR; full sharded regression on merge.',
      'I tag slow tests and move setup to session-scoped fixtures to cut redundant browser or API warm-up.',
    ],
    [
      'Every commit: lint, unit, and contract tests.',
      'PR gate: integration against staging. Post-deploy: smoke E2E on production-like env.',
      'Nightly: full regression including edge cases. Release: performance and security scans as needed.',
    ],
    [
      'Secrets live in GitHub Secrets or AWS SSM—never in the repo.',
      'CI injects credentials at runtime; test configs reference env vars only.',
      'I audit logs to ensure PHI never appears in CI output and rotate test credentials regularly.',
    ],
  ],
  followUpSampleAnswers: [
    'Same approach—vault-stored secrets, synthetic data only, redacted artifacts. HIPAA-sensitive tests run only in approved staging environments with access controls. PR pipelines use mocks; full compliance tests run on scheduled staging jobs.',
    'Performance tests run nightly or on demand before major releases—not on every PR. PR pipeline stays under 15 minutes with unit and integration only. I trend duration over time to catch suite slowdown early.',
    'I automate critical eligibility and claims paths first—highest business risk. Then API contract tests for new endpoints. UI and edge cases follow once core regression is stable. ROI drives order, not easiest tests first.',
  ],
};

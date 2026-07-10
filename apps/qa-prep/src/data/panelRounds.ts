import type { InterviewRound, PanelQuestion } from '../types/panelPersona';

const r1Pytest: PanelQuestion = {
  id: 'r1-pytest',
  topicId: 'pytest-prep',
  question:
    'We use PyTest for API tests. How would you structure a new test module for eligibility endpoints?',
  followUps: [
    'How would you mark tests that need a full staging environment?',
  ],
  stretchFollowUp: {
    question: 'Why use fixtures and parametrize instead of copy-pasting setup in each test?',
    sampleAnswer:
      'Fixtures keep setup in one place so when auth or base URL changes, I update conftest—not twenty tests. Parametrize lets me cover decision-table rows without duplicating test logic. As an IC I learn the team\'s existing patterns first, then extend them.',
  },
  advancedProbe: {
    question:
      'How would you standardize PyTest patterns across multiple squads?',
    sampleAnswer:
      'Optional senior depth: shared conftest conventions, RFC for markers and fixture scopes, lightweight guild—not a day-one Analyst II answer. I\'d start by aligning with my squad and documenting what works before pushing org-wide standards.',
  },
  strongAnswerIncludes: [
    'Learn existing conftest and team conventions first',
    'Domain-based organization with conftest.py for shared config',
    'Session-scoped fixtures for expensive setup, function-scoped for isolation',
    '@pytest.mark.parametrize for data-driven edge cases',
    'Markers for slow/integration tests (e.g., @pytest.mark.staging)',
  ],
  sampleAnswer:
    'I\'d first learn the team\'s existing PyTest layout and conventions. For a new eligibility module I\'d create tests/eligibility/ with conftest.py for auth and base URL fixtures—session-scoped token fetch, function-scoped test data. I\'d parametrize edge cases like inactive member or missing NDC and mark staging-only tests with @pytest.mark.integration.',
};

const r1Cicd: PanelQuestion = {
  id: 'r1-cicd',
  topicId: 'cicd-automation-architecture',
  question:
    'Our PR pipeline is slow. How would you help get developer feedback under 15 minutes?',
  followUps: ['How do you parallelize without losing reliability?'],
  stretchFollowUp: {
    question: 'Why split tests into tiers instead of running everything on every commit?',
    sampleAnswer:
      'A 45-minute suite on every push means developers stop waiting for CI. Tiers protect different things: fast checks on PR, full regression before release. I\'d propose incremental splits where the pain is worst—not redesign the whole pipeline on day one.',
  },
  advancedProbe: {
    question:
      'How would you build an organization-wide automation roadmap for CI?',
    sampleAnswer:
      'Senior optional: phased rollout across squads, runner capacity planning, shared libraries—relevant for Lead roles. For this role I\'d focus on my squad\'s pipeline, measure PR duration, and partner with platform eng on sharding when we hit limits.',
  },
  strongAnswerIncludes: [
    'Work within existing pipeline; propose incremental tier splits',
    'Unit/contract on push; integration at PR gate; smoke after deploy',
    'Parallel shards by domain or file where the suite is slow',
    'Markers to keep staging-heavy tests off PR runs',
    'Clear artifacts on failure (redacted logs, correlation IDs)',
  ],
  sampleAnswer:
    'I\'d start by profiling what\'s slow today. I\'d keep lint and unit tests on every push, gate PRs with integration tests in parallel shards, and run smoke E2E after staging deploy. I\'d use markers to keep slow staging tests off PR runs and publish redacted logs as artifacts so failures are debuggable without re-running locally.',
};

const r1Flaky: PanelQuestion = {
  id: 'r1-flaky',
  topicId: 'flaky-test-debugging',
  question:
    'We have a flaky eligibility test that passes locally but fails in CI. How do you approach it?',
  followUps: [
    'How do you prove the fix worked and did not hide a real bug?',
  ],
  stretchFollowUp: {
    question:
      'Why can eventual consistency or shared test data cause intermittent failures?',
    sampleAnswer:
      'Eligibility updates may not be visible immediately, and parallel jobs can collide on the same member ID. I wait on observable conditions—status in API or logs—not arbitrary sleeps. Unique data per test prevents collisions without masking real bugs.',
  },
  strongAnswerIncludes: [
    'Collect CI failure patterns (timestamps, shards, parallel vs. isolated)',
    'Reproduce isolated vs. full suite before changing code',
    'Check shared state, race conditions, data collisions',
    'Fix root cause—unique IDs, explicit waits, fixture scoping',
    'Quarantine with a ticket if fix cannot ship same day',
  ],
  sampleAnswer:
    'I collect failure timestamps and shards from CI to spot patterns, then run the test isolated vs. the full suite. I look for shared member IDs, race conditions, or hard-coded sleeps. I fix with unique data per test and explicit waits—not retry decorators. I quarantine with a ticket if the fix takes more than a day.',
};

const r1TestData: PanelQuestion = {
  id: 'r1-test-data',
  topicId: 'test-data-strategy',
  question:
    'Describe your approach to building and maintaining test data for a PBM platform like ours.',
  followUps: [
    'How do you keep test data from becoming stale or conflicting across parallel runs?',
  ],
  stretchFollowUp: {
    question: 'Why is synthetic data important in healthcare testing?',
    sampleAnswer:
      'Production dumps create PHI risk and are hard to refresh. Synthetic personas with realistic plan patterns let anyone reproduce scenarios safely. I\'d partner with devs on version-controlled fixtures rather than one-off records per test.',
  },
  advancedProbe: {
    question:
      'How would you design a long-term test data platform for multiple teams?',
    sampleAnswer:
      'Optional senior depth: persona catalogs, provisioning APIs, refresh pipelines—see Advanced modules. For this role I\'d maintain a squad-level persona library with clear docs and scheduled staging refresh.',
  },
  strongAnswerIncludes: [
    'Reusable personas with deterministic IDs (active member, COB, high-deductible)',
    'Synthetic data only—never production dumps',
    'Fixtures/factories version-controlled alongside tests',
    'Documentation of which persona covers which scenario',
    'Isolated records for destructive tests in parallel CI',
  ],
  sampleAnswer:
    'I\'d start with the highest-risk workflows—core eligibility personas with deterministic IDs, documented in the repo. Data is synthetic only, seeded via fixtures, and destructive tests get isolated records so parallel CI jobs don\'t collide. I\'d partner with devs to extend personas when new scenarios appear.',
};

const r2SqlTriage: PanelQuestion = {
  id: 'r2-sql-triage',
  topicId: 'sql-data-triage',
  question:
    'How do you use SQL to validate test results or investigate data discrepancies?',
  followUps: [
    'How do you validate that test seed scripts created the data your API tests expect?',
  ],
  stretchFollowUp: {
    question: 'Why compare database state to API responses instead of trusting the test alone?',
    sampleAnswer:
      'The API might pass while seed data is stale, or vice versa. SQL closes the loop on ground truth. I use targeted queries on synthetic member IDs—never unbounded SELECT—and redact before sharing results.',
  },
  strongAnswerIncludes: [
    'Start from test failure context: member ID, timestamp, API fields',
    'Targeted WHERE on synthetic IDs—never unbounded SELECT',
    'JOIN eligibility, plan tables; check effective dates',
    'Compare DB state to API response; note rule version IDs',
    'Redact query results before sharing in tickets',
  ],
  sampleAnswer:
    'I start from the failing test—member ID, timestamp, expected vs. actual API fields. I run a targeted query with WHERE on the synthetic member ID and effective date, compare DB state to the API response, and redact results before attaching to the ticket.',
};

const r2SqlClaims: PanelQuestion = {
  id: 'r2-sql-claims',
  topicId: 'sql-data-triage',
  question:
    'An API test says a member is eligible but staging data looks wrong. Walk me through your SQL triage.',
  followUps: [
    'How do you reconcile automated test output with what is stored in the database?',
  ],
  stretchFollowUp: {
    question: 'Why do effective dates matter in eligibility queries?',
    sampleAnswer:
      'Coverage depends on start/end dates and plan year boundaries. A query without effective_date filters can show wrong rows and send you chasing the wrong bug. I always filter by the as-of date from the test.',
  },
  strongAnswerIncludes: [
    'Grab member ID and as-of date from the test',
    'Query with effective/term date filters',
    'Compare active_plan_id and coverage_status to API payload',
    'Check seed refresh and rule version changes',
    'Attach redacted query snapshot to the ticket',
  ],
  sampleAnswer:
    'I grab the member ID and as-of date from the test, query eligibility with effective/term filters, and compare to the API payload. If they differ I check seed refresh or rule version changes, then attach a redacted query snapshot for eng.',
};

const r2Logs: PanelQuestion = {
  id: 'r2-logs',
  topicId: 'logging-monitoring',
  question:
    'A test fails in CI for our claims API. Walk me through how you would investigate using logs.',
  followUps: ['How do you handle PHI in logged payloads?'],
  stretchFollowUp: {
    question: 'Why capture correlation IDs in test output?',
    sampleAnswer:
      'They link a test failure to the exact server-side request in CloudWatch or Splunk. Without them I\'m guessing from timestamps. I learn which log groups and fields the team already uses before adding new instrumentation.',
  },
  strongAnswerIncludes: [
    'Correlation/trace ID from API response',
    'Search CloudWatch or Splunk for request window and service',
    'Redact PHI from logged payloads',
    'Compare expected vs. actual server behavior',
    'Enough context in CI artifacts for async debugging',
  ],
  sampleAnswer:
    'I grab the correlation ID from the test output and search CloudWatch for that ID in the CI job window. I compare expected vs. actual server response, redact member fields, and attach enough context that eng can debug without re-running locally.',
};

const r2Observability: PanelQuestion = {
  id: 'r2-observability',
  topicId: 'logging-monitoring',
  question:
    'How do you use logging and monitoring to speed up debugging when tests fail?',
  followUps: [
    'How do you connect test failures to production observability tools?',
  ],
  stretchFollowUp: {
    question: 'Why track flaky-test counts and CI duration trends?',
    sampleAnswer:
      'Rising flakiness erodes trust in CI; slowing suites push developers to skip checks. Simple dashboards on failure rate and p95 duration catch problems early. I\'d start with what the team already has in Datadog or CloudWatch.',
  },
  advancedProbe: {
    question: 'What quality KPIs would you track at org scale?',
    sampleAnswer:
      'Optional senior depth: defect escape rate, MTTD, flaky ratio—useful for Lead conversations. As an IC I focus on making failures diagnosable quickly and flagging trends to my lead when CI health degrades.',
  },
  strongAnswerIncludes: [
    'Correlation IDs in test assertions and CI output',
    'Search logs by ID, service, environment, time window',
    'Redact PHI; synthetic member IDs only',
    'Dashboard or alert on CI failure spikes when available',
    'Partner with devs on log fields that help QA triage',
  ],
  sampleAnswer:
    'I capture correlation IDs in test output and search CloudWatch or Splunk for that window. I redact PHI, and where the team has dashboards I watch failure rate and test duration trends. I\'d look for incremental improvements to artifacts before proposing new org-wide metrics.',
};

const r3ReleasePushback: PanelQuestion = {
  id: 'r3-release-pushback',
  topicId: 'behavioral-leadership',
  question:
    'Tell me about a time you pushed back on a release because of quality concerns.',
  followUps: [
    'What would you have done if the team insisted on shipping anyway?',
  ],
  stretchFollowUp: {
    question: 'How did you communicate risk without sounding like a gatekeeper?',
    sampleAnswer:
      'I framed it as member impact with specific failure examples and options—not "QA says no." I partnered with PM and eng lead on the trade-off. That keeps trust while advocating for the right call.',
  },
  strongAnswerIncludes: [
    'STAR with specific release and measurable outcome',
    'Quantified risk (plans, members, scenarios affected)',
    'Collaborative tone with PM and eng lead',
    'Clear personal role and team contribution',
    'Result: incidents prevented or justified delay',
  ],
  sampleAnswer:
    'Before a formulary release, regression showed eligibility failures for three plan types. I documented affected scenarios, quantified member impact, and presented options to the PM and eng lead. We delayed 48 hours, fixed rule config, and shipped with zero production incidents.',
};

const r3PmScope: PanelQuestion = {
  id: 'r3-pm-scope',
  topicId: 'scrum-product-collaboration',
  question:
    'How do you work with a Product Manager when scope is tight and testing time is limited?',
  followUps: [
    'How do you communicate quality risk to non-technical stakeholders?',
  ],
  stretchFollowUp: {
    question: 'Why get written agreement on deferred test scope?',
    sampleAnswer:
      'So product consciously accepts residual risk—not a silent skip that becomes blame later. I propose core-path coverage plus documented follow-ups, in plain language about member impact.',
  },
  strongAnswerIncludes: [
    'Join refinement to make ACs testable early',
    'Risk-based plan: core paths full coverage, deferrals documented',
    'Written agreement on residual risk',
    'Member impact framing for trade-offs',
    'Options, not ultimatums',
  ],
  sampleAnswer:
    'I join refinement to flag testability gaps early. When scope is tight I propose covering highest-risk eligibility paths first and document what we\'re deferring. I get written agreement on residual risk and partner with PM on smoke plus monitoring if we ship with gaps.',
};

const r3SprintPriority: PanelQuestion = {
  id: 'r3-sprint-priority',
  topicId: 'scrum-product-collaboration',
  question:
    'Describe how you prioritize bugs during a sprint when engineering capacity is full.',
  followUps: ['What do you do when defects keep reopening?'],
  stretchFollowUp: {
    question: 'Why use impact and severity together instead of just "high priority"?',
    sampleAnswer:
      'Wrong eligibility for an active plan is high impact and severity; a cosmetic UI glitch is neither. Clear repro steps and persona context help eng and PM slot work without debate every time.',
  },
  strongAnswerIncludes: [
    'Impact × severity with PBM examples',
    'Clear repro steps, persona, logs in every bug',
    'Collaborative triage with eng lead and PM',
    'P1/P2 in sprint; P3+ to backlog with owner',
    'Regression test required before closing repeat offenders',
  ],
  sampleAnswer:
    'I triage with eng lead and PM: wrong eligibility for a plan type is P1; cosmetic issues defer. I include repro steps, member persona, and logs. P1/P2 slot into the sprint; P3 goes to backlog with an owner.',
};

const r3Mentoring: PanelQuestion = {
  id: 'r3-mentoring',
  topicId: 'behavioral-leadership',
  question:
    'Tell me about a time you helped a developer improve their testing practices.',
  followUps: [
    'How do you handle disagreement when an engineer wants to skip testing to meet a deadline?',
  ],
  stretchFollowUp: {
    question: 'Why give feedback as questions instead of rewriting their tests?',
    sampleAnswer:
      'It builds trust and ownership—they learn the reasoning. I pair on high-risk modules and share examples, but I don\'t become a bottleneck rewriting every PR.',
  },
  advancedProbe: {
    question: 'How would you scale test review beyond one-on-one pairing?',
    sampleAnswer:
      'Optional senior depth: team guidelines, PR checklist, office hours—mentoring programs. For this role I\'d start with lightweight checklist items and pairing on the riskiest modules.',
  },
  strongAnswerIncludes: [
    'STAR with specific developer and module',
    'Pairing and questions, not prescriptive rewrites',
    'PR checklist or examples for negative paths',
    'Measurable improvement in test quality',
    'On deadlines: negotiate scope, not "skip all testing"',
  ],
  sampleAnswer:
    'I paired with a developer on a high-risk module, shared before/after examples, and added PR checklist items for negative paths. Within a month they started asking for review before opening PRs—their defect escape on new code dropped.',
};

export const panelRounds: InterviewRound[] = [
  {
    id: 'round-1',
    roundTheme: 'Backend QA',
    roundIntro:
      'APIs, automation, test data, and healthcare-aware validation — show how you design tests, not just name tools.',
    feelsLike:
      'A technical screen with PyTest and backend depth. Expect “how would you structure this?” more than architecture lectures.',
    interviewer: {
      name: 'Vivek Mugunthan',
      focusSummary:
        'Probes backend QA depth—API validation, PyTest structure, test data, and automation that fits a PBM context.',
      watchFor: [
        'Clear test design and fixture strategy',
        'Healthcare-aware negative paths and PHI boundaries',
        'Practical automation tiers, not buzzwords',
      ],
    },
    title: 'Backend QA',
    duration: '30 minutes',
    focusAreas: [
      'APIs & backend validation',
      'PyTest & automation',
      'Test planning',
      'Test data & healthcare',
    ],
    questions: [r1Pytest, r1Cicd, r1TestData, r1Flaky],
  },
  {
    id: 'round-2',
    roundTheme: 'Debugging & Technical Reasoning',
    roundIntro:
      'CloudWatch, logs, SQL, flaky tests, CI/CD, and root-cause thinking — walk through how you investigate.',
    feelsLike:
      'A troubleshooting conversation. They want your reasoning trail, not a definition of monitoring.',
    interviewer: {
      name: 'Clinton Anderson',
      focusSummary:
        'Focuses on observability, data triage, and debugging judgment when tests or production signals disagree.',
      watchFor: [
        'Correlation IDs and log reasoning',
        'SQL ground-truth validation',
        'Root-cause fixes vs. retries and sleeps',
      ],
    },
    title: 'Debugging & Technical Reasoning',
    duration: '30 minutes',
    focusAreas: [
      'CloudWatch & logs',
      'SQL triage',
      'Flaky tests',
      'CI/CD & monitoring',
    ],
    questions: [r2Observability, r2Logs, r2SqlTriage, r2SqlClaims],
  },
  {
    id: 'round-3',
    roundTheme: 'Behavioral & Collaboration',
    roundIntro:
      'Mentoring, ownership, PM partnership, and quality decisions under pressure — STAR with specifics.',
    feelsLike:
      'A collaboration and judgment round. They probe follow-ups on what YOU did and how you worked with eng/PM.',
    interviewer: {
      name: 'Raghu Tayanna',
      focusSummary:
        'Evaluates ownership, communication, and prioritization when capacity is tight in a regulated product.',
      watchFor: [
        'Personal ownership with named examples',
        'Collaborative advocacy, not gatekeeping',
        'Clear results and lessons learned',
      ],
    },
    title: 'Behavioral & Collaboration',
    duration: '30 minutes',
    focusAreas: [
      'Mentoring & ownership',
      'PM & developer partnership',
      'Prioritization',
      'Quality decisions',
    ],
    questions: [r3ReleasePushback, r3PmScope, r3SprintPriority, r3Mentoring],
  },
];

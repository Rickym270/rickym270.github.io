import type { AnswerComparison } from '../types/answerComparison';

export const answerComparisons: AnswerComparison[] = [
  {
    id: 'backend-api-testing',
    title: 'Backend API Testing',
    weakAnswer:
      'I would hit the endpoints in Postman and check that they return 200.',
    whyWeak:
      'Only covers happy path, no auth/error cases, not repeatable in CI, and says nothing about contracts, edge cases, or PHI handling.',
    betterAnswer:
      'I layer tests: contract tests against the OpenAPI spec, integration tests with synthetic member data covering auth and error codes, and smoke E2E after deploy. I assert idempotency, pagination, and that PHI never appears in logs or error responses.',
    whyStronger:
      'Shows a structured strategy, names specific techniques, covers negative paths, and addresses healthcare-specific concerns—exactly what a senior QA engineer would deliver.',
  },
  {
    id: 'test-data-strategy',
    title: 'Test Data Strategy',
    weakAnswer:
      'I ask a developer to create test accounts when I need them.',
    whyWeak:
      'Depends on others, not reproducible, no shared personas, and creates bottlenecks—interviewer hears "I don\'t own test data."',
    betterAnswer:
      'I maintain a small set of documented personas with deterministic IDs—active member, COB, high-deductible—seeded via fixtures and version-controlled. Destructive tests get isolated records; staging refreshes on a schedule.',
    whyStronger:
      'Demonstrates ownership, reproducibility, team scalability, and awareness of data lifecycle—key for a PBM platform with complex eligibility scenarios.',
  },
  {
    id: 'eligibility-rules-engine',
    title: 'Eligibility / Rules Engine Testing',
    weakAnswer:
      'I test a few members and drugs to make sure eligibility works.',
    whyWeak:
      'Vague sample size, no decision-table thinking, ignores rule versions and boundary dates, and cannot catch regressions when plans change.',
    betterAnswer:
      'I build a decision table mapping inputs—member status, effective date, plan tier, NDC—to expected outcomes. Parameterized tests tie to rule version IDs so config changes trigger targeted regression, with boundary tests on coverage dates and plan year rollovers.',
    whyStronger:
      'Shows systematic coverage of combinatorial logic, traceability to rule changes, and prioritization—critical for a rules-heavy PBM system.',
  },
  {
    id: 'pytest-prep',
    title: 'PyTest Prep',
    weakAnswer:
      'PyTest is basically the same as any other test framework—I write tests and run them.',
    whyWeak:
      'Misses fixtures, parametrize, markers, and conftest—signals surface-level familiarity, not hands-on depth.',
    betterAnswer:
      'I organize suites by domain with conftest.py for shared auth and base URLs. Session-scoped fixtures for expensive setup, @pytest.mark.parametrize for data-driven cases, and markers to split fast PR checks from full integration runs.',
    whyStronger:
      'Names concrete PyTest features and explains how they map to real CI workflow—shows you can be productive on day one.',
  },
  {
    id: 'flaky-test-debugging',
    title: 'Flaky Test Debugging',
    weakAnswer:
      'Flaky tests happen— I usually just re-run the pipeline until it passes.',
    whyWeak:
      'Normalizes unreliability, erodes CI trust, and shows no root-cause methodology—red flag for a quality role.',
    betterAnswer:
      'I collect failure patterns from CI logs, reproduce in isolation vs. full suite, and look for shared state, race conditions, or data collisions. I fix root cause—explicit waits, unique IDs, proper fixture scoping—not retry decorators.',
    whyStronger:
      'Demonstrates systematic debugging, distaste for masking flakiness, and concrete fixes—interviewer trusts you to stabilize a suite.',
  },
  {
    id: 'cicd-automation-architecture',
    title: 'CI/CD',
    weakAnswer:
      'We should automate everything so we never need manual testing.',
    whyWeak:
      'Unrealistic, ignores ROI and maintenance cost, and dismisses exploratory testing—sounds junior and dogmatic.',
    betterAnswer:
      'I tier the pipeline: unit on every commit, integration at PR gate, smoke E2E after deploy, full regression nightly. Parallelize by domain to keep PR feedback under 15 minutes. Block deploy on critical-path failures with clear artifacts.',
    whyStronger:
      'Balanced, pragmatic, and names specific stages with timing goals—shows you can design pipelines that teams actually follow.',
  },
  {
    id: 'logging-monitoring',
    title: 'Logging / Monitoring',
    weakAnswer:
      'If a test fails, I look at the error message and try again locally.',
    whyWeak:
      'No correlation with server-side logs, no trace IDs, slow feedback loop—cannot debug production-like failures efficiently.',
    betterAnswer:
      'I capture correlation IDs from API responses and search CloudWatch for that request window. I redact PHI from logged payloads and compare expected vs. actual server behavior. Good instrumentation means CI failures are diagnosable in minutes.',
    whyStronger:
      'Connects test failures to observability tooling, mentions PHI redaction, and emphasizes speed—directly relevant to AWS-heavy healthcare stacks.',
  },
  {
    id: 'behavioral-leadership',
    title: 'Behavioral / Leadership',
    weakAnswer:
      'I always make sure quality is good and I never let bugs slip through.',
    whyWeak:
      'Generic, no specific story, no measurable outcome, and no collaboration—interviewer learns nothing about how you actually behave.',
    betterAnswer:
      'Before a formulary release, regression showed eligibility failures for three plan types. I documented impact, presented risk to PM and eng lead, and we delayed 48 hours to fix rule config. Release went clean—zero production incidents.',
    whyStronger:
      'STAR structure with concrete stakes, collaborative approach, quantified result, and shows quality advocacy without being adversarial.',
  },
  {
    id: 'sql-data-triage',
    title: 'SQL & Data Triage',
    weakAnswer:
      'I would open the database and look around until I find something wrong.',
    whyWeak:
      'No methodology, risks unbounded queries and PHI exposure, and shows no ability to tie SQL to test failures or PBM data models.',
    betterAnswer:
      'I start from the test failure—member ID, timestamp, expected API fields. I run a targeted query with WHERE on synthetic member ID and effective date, JOIN eligibility and plan tables, compare DB state to the API response, and redact results before sharing.',
    whyStronger:
      'Shows systematic triage, safe querying habits, healthcare data awareness, and closes the loop between automated tests and database truth.',
  },
  {
    id: 'scrum-product-collaboration',
    title: 'Scrum, Product & Collaboration',
    weakAnswer:
      'QA should sign off on every story before it can move to Done.',
    whyWeak:
      'Gatekeeper mindset, slows delivery, and ignores risk-based trade-offs—signals poor cross-functional partnership.',
    betterAnswer:
      'I join refinement to make ACs testable, propose risk-based coverage when scope is tight, and document deferred scenarios with residual risk. Bug priority uses impact × severity with clear repro steps for eng and PM.',
    whyStronger:
      'Demonstrates Scrum partnership, pragmatic prioritization, and communication skills expected in a Level II cross-functional role.',
  },
];

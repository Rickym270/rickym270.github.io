import type { StrongAnswer } from '../types/strongAnswer';

export const strongAnswers: StrongAnswer[] = [
  {
    id: 'test-api',
    question: 'How would you test an API?',
    answer:
      'I\'d start with the highest-risk API flows and learn how the team structures tests today. I layer contract tests against the OpenAPI spec, then integration tests with synthetic data for auth, business logic, and edge cases. I cover negative paths (401, 403, 404, 422), idempotency, and pagination. For a PBM platform I assert PHI never leaks into logs or error responses. I\'d automate at the API layer first and partner with devs on fast PR feedback plus a smaller smoke suite after deploy.',
  },
  {
    id: 'test-eligibility-rules',
    question: 'How would you test a large eligibility rules engine?',
    answer:
      'I map rules to a decision table: input conditions (member status, effective date, plan tier, drug attributes) → expected outcome (eligible, PA required, not covered). Parameterized tests run each row automatically and are tied to rule version IDs so config changes trigger targeted regression. I focus on boundary cases—coverage start/end dates, plan year rollovers, and COB scenarios. When the rule set is too large for exhaustive coverage, I prioritize by business impact and change frequency, then expand over time.',
  },
  {
    id: 'maintainable-test-data',
    question: 'How do you create maintainable test data?',
    answer:
      'I\'d partner with the team on a small set of reusable personas with deterministic IDs—active member, COB, high-deductible—each documented for which cases it covers. Data is seeded via fixtures, version-controlled alongside tests, and never copied from production. Destructive tests get isolated records; staging refreshes on a schedule. New tests reuse existing personas instead of inventing data every time.',
  },
  {
    id: 'debug-flaky-tests',
    question: 'How do you debug flaky tests?',
    answer:
      'First I check whether the failure is environmental—CI vs local, parallel vs isolated run, time of day. I collect logs and timestamps from multiple failures to spot patterns. Then I look for shared state, race conditions, hard-coded sleeps, and test data collisions. I reproduce in isolation before changing anything. The fix targets root cause: explicit waits on conditions, unique IDs per test, proper fixture scoping—not retry decorators or longer timeouts. If I cannot fix immediately, I quarantine the test and track it so it does not erode CI trust.',
  },
  {
    id: 'cloudwatch-logs',
    question: 'How do you use CloudWatch/logs to investigate failures?',
    answer:
      'When a test fails, I grab the correlation or trace ID from the API response and search CloudWatch log groups for that request window. I filter by service, environment, and log level to narrow noise. I compare the test\'s expected payload against what the service actually logged—redacting any PHI. If the failure is intermittent, I look for upstream dependency errors, throttling, or deployment timing. Good test instrumentation means I can go from a CI failure to the exact server-side error in minutes without re-running the full suite locally.',
  },
  {
    id: 'what-not-to-automate',
    question: 'How do you decide what not to automate?',
    answer:
      'I automate what is repeatable, stable, and high-value—regression on core flows, contract checks, and data-driven rule validation. I skip or keep manual: exploratory testing, one-off investigations, UI that changes every sprint, and scenarios where setup cost exceeds run frequency. I also avoid automating before requirements stabilize. The question is ROI: will this test catch real bugs often enough to justify maintenance? Exploratory and usability testing stay human; stable backend and eligibility paths get automated first.',
  },
  {
    id: 'robot-playwright-to-pytest',
    question:
      'How do you translate Robot Framework/Playwright experience into PyTest?',
    answer:
      'I\'d first learn the team\'s existing PyTest and CI conventions. The testing mindset transfers—Page Object patterns become fixtures, data tables become @pytest.mark.parametrize, suite tags become markers. I bring discipline around isolation, clear assertions, and readable names. For a backend-heavy PBM platform I lean into API and rules-engine tests in Python where PyTest integrates tightly with the stack.',
  },
  {
    id: 'review-dev-unit-tests',
    question: 'How do you review developer unit tests?',
    answer:
      'I check that tests assert behavior, not implementation—if a refactor breaks the test but not the feature, the test is too brittle. I look for meaningful coverage of edge cases and error paths, not just happy-path smoke. Tests should be independent, fast, and named so a failure tells you what broke. I flag missing negative cases, over-mocking that hides integration bugs, and duplicated setup that belongs in fixtures. My feedback is collaborative: I ask questions ("what happens when coverage is expired?") rather than rewriting their tests for them.',
  },
  {
    id: 'sql-validate-results',
    question: 'How do you use SQL to validate test results?',
    answer:
      'I start from the failing test context—synthetic member ID, timestamp, and expected API fields. I run targeted queries against eligibility or claims tables with WHERE filters on that member and effective date, never unbounded SELECT on large tables. I JOIN plan and member tables when needed, compare DB state to the API response, and check rule version IDs. Results are redacted before sharing in tickets. This closes the loop when an API assertion passes but seed data is wrong, or vice versa.',
  },
  {
    id: 'pm-scrum-priorities',
    question: 'How do you collaborate with PM and Scrum on sprint priorities?',
    answer:
      'I participate in refinement to make acceptance criteria testable before dev starts. In sprint planning I estimate QA effort, flag data and environment dependencies, and propose risk-based coverage when scope is tight. For bugs, I triage with eng and PM using impact and severity—eligibility errors for active plans are P1; cosmetic issues defer. I document deferred test scope and residual risk in writing so product makes informed trade-offs, and I escalate blockers like staging outages early in standup.',
  },
];

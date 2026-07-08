import type { Topic } from '../../types/topic';

export const sqlDataTriage: Topic = {
  id: 'sql-data-triage',
  title: 'SQL & Data Triage',
  flashcards: [
    {
      front: 'Why would QA use SQL on a PBM platform?',
      back: 'Validate test seed data, reconcile API responses vs. database state, investigate data discrepancies, and confirm eligibility/claims records after rule changes.',
    },
    {
      front: 'What is a safe pattern for querying member data in lower environments?',
      back: 'Use synthetic member IDs only, SELECT specific columns (never SELECT *), filter by test persona IDs, and never export results with PHI to shared channels.',
    },
    {
      front: 'How do effective dates affect eligibility SQL queries?',
      back: 'Eligibility depends on coverage start/end and plan year boundaries—queries must filter WHERE effective_date <= @as_of_date AND (term_date IS NULL OR term_date > @as_of_date).',
    },
    {
      front: 'How do you reconcile an API test failure with database state?',
      back: 'Capture member ID and request timestamp from the test, query the relevant eligibility or claims tables, compare DB values to API response fields, and note rule version IDs.',
    },
  ],
  mockQuestions: [
    'How do you use SQL to validate test results or investigate data discrepancies?',
    'An API test says a member is eligible but staging data looks wrong. Walk me through your SQL triage.',
    'How would you write a query to find members with conflicting eligibility records after a plan year rollover?',
    'How do you reconcile automated test output with what is actually stored in the database?',
  ],
  strongAnswerBullets: [
    'Start from the test failure context: member ID, timestamp, API response fields',
    'Query specific tables with targeted WHERE clauses—never unbounded SELECT on large tables',
    'JOIN member, plan, and eligibility tables; filter by synthetic test persona IDs',
    'Check effective/termination dates, rule version IDs, and NULL handling',
    'Compare row counts and aggregates when investigating batch discrepancies',
    'Redact or avoid exporting PHI; use read-only access in staging',
    'Document the query and findings in the ticket for eng handoff',
  ],
  commonPitfalls: [
    'Running SELECT * on production or large staging tables without filters',
    'Ignoring effective dates, timezones, or plan year boundaries in eligibility queries',
    'Pasting query results with member PHI into Slack or tickets',
    'Assuming API is wrong without verifying seed data or rule version in the DB',
  ],
  followUpQuestions: [
    'How would you find duplicate or orphaned eligibility rows for a test member?',
    'What indexes or columns would you ask developers to expose for easier QA debugging?',
    'How do you validate that test seed scripts actually created the data your API tests expect?',
  ],
  sampleAnswers: [
    'I start from the failing test—member ID, timestamp, expected vs. actual API fields. I run a targeted query against eligibility and plan tables with WHERE on the synthetic member ID and effective date. I compare DB state to the API response and check rule version ID. I never SELECT * on large tables and redact results before sharing.',
    'I grab the member ID and as-of date from the test, query eligibility with effective/term date filters, and compare active_plan_id and coverage_status to the API payload. If they differ, I check whether seed data was refreshed or a rule version changed. I attach the query and row snapshot—redacted—to the ticket.',
    'I JOIN members to plan_assignments and eligibility_rules on member_id and plan_id, filter WHERE effective_date <= rollover_date AND (term_date IS NULL OR term_date > rollover_date), then GROUP BY member_id HAVING COUNT(*) > 1 to find duplicates. I prioritize synthetic test personas first before widening the search.',
    'After an API assertion, I query the same member_id and claim_id in the claims table and diff status, amount, and last_updated against the response JSON. If the test passed but DB is stale, I flag a seed refresh issue; if DB is correct, I escalate to the service layer.',
  ],
  sampleAnswerBullets: [
    [
      'I start from the failing test—member ID, timestamp, expected vs. actual API fields.',
      'I run a targeted query against eligibility and plan tables with WHERE on the synthetic member ID and effective date.',
      'I compare DB state to the API response and check rule version ID.',
      'I never SELECT * on large tables and redact results before sharing.',
    ],
    [
      'I grab the member ID and as-of date from the test and query eligibility with effective/term date filters.',
      'I compare active_plan_id and coverage_status to the API payload.',
      'If they differ, I check whether seed data was refreshed or a rule version changed.',
      'I attach the query and row snapshot—redacted—to the ticket.',
    ],
    [
      'I JOIN members to plan_assignments and eligibility_rules on member_id and plan_id.',
      'I filter WHERE effective_date <= rollover_date AND term_date is null or after rollover_date.',
      'I GROUP BY member_id HAVING COUNT greater than one to find duplicates.',
      'I prioritize synthetic test personas first before widening the search.',
    ],
    [
      'After an API assertion, I query the same member_id and claim_id in the claims table.',
      'I diff status, amount, and last_updated against the response JSON.',
      'If the test passed but DB is stale, I flag a seed refresh issue; if DB is correct, I escalate to the service layer.',
    ],
  ],
  followUpSampleAnswers: [
    'SELECT member_id, plan_id, COUNT(*) FROM eligibility WHERE member_id = @test_id GROUP BY member_id, plan_id HAVING COUNT(*) > 1. For orphans, LEFT JOIN plan_assignments and find rows with no matching active plan.',
    'I ask for member_id_hash, rule_version_id, effective_date, and decision_outcome columns indexed for lookup. That lets me triage without full table scans or reading raw PHI.',
    'After seed scripts run, I run a smoke query per persona—active member, COB, high-deductible—and assert row counts and key fields match the fixture documentation before API tests execute.',
  ],
};

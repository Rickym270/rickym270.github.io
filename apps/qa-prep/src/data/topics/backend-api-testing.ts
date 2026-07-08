import type { Topic } from '../../types/topic';

export const backendApiTesting: Topic = {
  id: 'backend-api-testing',
  title: 'Backend API Testing',
  flashcards: [
    {
      front: 'What three layers should you test in a pharmacy benefits API?',
      back: 'Contract (schema/status codes), integration (auth + business logic), and end-to-end flows (eligibility → claim adjudication).',
    },
    {
      front: 'What HTTP status codes must you test beyond 200 OK?',
      back: '401/403 (auth), 404 (not found), 422 (validation), 429 (rate limit), 500 (server error)—each with expected error body shape.',
    },
    {
      front: 'Why is idempotency important in API testing?',
      back: 'Repeated POST/PUT calls should not duplicate claims or side effects—critical for pharmacy claim submissions and retries.',
    },
    {
      front: 'What PHI rules apply when logging API test failures?',
      back: 'Never log member names, DOB, or Rx details—use synthetic IDs and redact payloads in CI artifacts.',
    },
  ],
  mockQuestions: [
    'How would you test a REST API that returns member eligibility for a prescription benefit?',
    'Walk me through your approach to contract testing vs. integration testing for our backend services.',
    'How do you test API authentication and authorization without using production credentials?',
    'What edge cases would you cover for a pharmacy claims submission API?',
  ],
  strongAnswerBullets: [
    'Layer tests: contract (OpenAPI spec), integration (auth + business logic), E2E smoke after deploy',
    'Validate status codes, required fields, error shapes, and pagination',
    'Use synthetic member IDs—never real PHI in fixtures or logs',
    'Cover edge cases: inactive member, terminated coverage, missing NDC/formulary data',
    'Assert idempotency on repeated calls and test 401/403/404/422 paths',
    'Publish CI artifacts (request/response redacted, correlation IDs) for async debugging',
  ],
  commonPitfalls: [
    'Testing only the happy path with a single fixture',
    'Ignoring auth error responses and rate-limit behavior',
    'Logging full response bodies containing member PII',
    'Mocking so aggressively that real integration bugs never surface',
  ],
  followUpQuestions: [
    'How would you mock downstream services like a formulary or claims engine without hiding real integration bugs?',
    'How do you decide what belongs in contract tests vs. integration tests?',
    'What would you do if the OpenAPI spec is out of date with the actual API?',
  ],
  sampleAnswers: [
    'I\'d start with the highest-risk endpoints and learn the team\'s test patterns. I layer contract tests against the OpenAPI spec, then integration tests with synthetic member IDs for auth, plan lookup, and eligibility. I cover inactive members, terminated coverage, missing NDC data, and assert PHI never appears in logs.',
    'Contract tests validate the API surface—schema, status codes, and error body shapes—without needing full business logic running. Integration tests exercise auth, database lookups, and real eligibility decisions with synthetic data. Contract tests are fast and catch breaking changes early; integration tests catch logic bugs contract tests cannot see.',
    'I use service accounts or OAuth client credentials scoped to a test environment, stored in CI secrets—not production credentials. I rotate test tokens regularly and use synthetic member IDs that mirror production patterns without real PHI. Auth tests cover 401, 403, and expired token scenarios explicitly.',
    'For claims submission I would test inactive members, terminated coverage, invalid or missing NDC codes, duplicate submissions for idempotency, and formulary mismatches. I would also cover 422 validation errors, rate limiting at 429, and verify error responses never leak member PII.',
  ],
  sampleAnswerBullets: [
    [
      "I'd start with the highest-risk endpoints and learn the team's test patterns.",
      'I layer contract tests against the OpenAPI spec, then integration tests with synthetic member IDs for auth, plan lookup, and eligibility.',
      'I cover inactive members, terminated coverage, and missing NDC data.',
      'I assert PHI never appears in logs or CI artifacts.',
    ],
    [
      'Contract tests validate the API surface—schema, status codes, and error body shapes—without needing full business logic running.',
      'Integration tests exercise auth, database lookups, and real eligibility decisions with synthetic data.',
      'Contract tests are fast and catch breaking changes early.',
      'Integration tests catch logic bugs that contract tests cannot see.',
    ],
    [
      'I use service accounts or OAuth client credentials scoped to a test environment, stored in CI secrets—not production credentials.',
      'I rotate test tokens regularly and use synthetic member IDs that mirror production patterns without real PHI.',
      'Auth tests cover 401, 403, and expired token scenarios explicitly.',
    ],
    [
      'For claims submission I test inactive members, terminated coverage, and invalid or missing NDC codes.',
      'I test duplicate submissions for idempotency and formulary mismatches.',
      'I cover 422 validation errors and rate limiting at 429.',
      'I verify error responses never leak member PII.',
    ],
  ],
  followUpSampleAnswers: [
    'I mock at the HTTP boundary with tools like WireMock or responses fixtures, but run a smaller set of real integration tests against staging on a schedule. That way fast PR tests do not hide wiring bugs, but we still catch contract drift without depending on every downstream service in CI.',
    'Contract tests own request/response shape and documented error codes. Integration tests own business outcomes—eligibility flags, copay tiers, auth enforcement. If a test only checks JSON fields, it belongs in contract; if it checks whether a terminated member is rejected, it is integration.',
    'I would run contract tests against the live staging API and file a defect when the spec drifts. Short term I update the spec with eng agreement and add a regression test. Long term I advocate for spec-first development so the OpenAPI file is the source of truth.',
  ],
};

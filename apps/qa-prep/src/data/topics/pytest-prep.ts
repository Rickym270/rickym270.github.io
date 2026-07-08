import type { Topic } from '../../types/topic';

export const pytestPrep: Topic = {
  id: 'pytest-prep',
  title: 'PyTest Prep',
  flashcards: [
    {
      front: 'What are the three PyTest features you reach for most in API test suites?',
      back: 'Fixtures for setup/teardown, @pytest.mark.parametrize for data-driven cases, and conftest.py for shared config across modules.',
    },
    {
      front: 'What is the difference between function-scoped and session-scoped fixtures?',
      back: 'Function: fresh setup per test (isolation). Session: once per run (expensive setup like auth token or DB seed).',
    },
    {
      front: 'How do PyTest markers help CI?',
      back: 'Tag tests (@pytest.mark.integration) so CI runs fast unit checks on PR and full integration suite on merge.',
    },
    {
      front: 'What belongs in conftest.py?',
      back: 'Shared fixtures (base URL, auth token, HTTP client), hooks, and markers—loaded automatically by PyTest.',
    },
  ],
  mockQuestions: [
    'How would you structure a PyTest suite for testing pharmacy benefit API endpoints?',
    'Explain how you use fixtures and parametrize together for eligibility test cases.',
    'How do you organize conftest.py files in a multi-service test repo?',
    'How would you migrate tests from Robot Framework to PyTest?',
  ],
  strongAnswerBullets: [
    'Organize by domain (eligibility, claims, formulary) with root conftest for auth and base URLs',
    'Session-scoped fixtures for expensive setup; function-scoped for test isolation',
    'Use @pytest.mark.parametrize for data-driven edge cases (invalid NDC, expired coverage)',
    'Markers to split fast PR checks (@pytest.mark.unit) from staging integration tests',
    'Plain Python helper modules replace Robot keywords; Page Objects become fixtures for UI',
    'Readable test names that describe the scenario, not the implementation',
  ],
  commonPitfalls: [
    'Putting all setup in test functions instead of fixtures—duplicated boilerplate',
    'Over-scoping fixtures (session when function needed)—causes test interdependence',
    'No markers—CI runs everything on every commit, slowing feedback',
    'Test names like test_1, test_2 with no scenario description',
  ],
  followUpQuestions: [
    'How do you handle test dependencies on external services—mock at HTTP layer or test container?',
    'How would you share fixtures across multiple test packages in a monorepo?',
    'What is your approach to test data setup in PyTest for HIPAA-sensitive APIs?',
  ],
  sampleAnswers: [
    'I organize by domain—eligibility, claims, formulary—with a root conftest.py for auth tokens and base URLs. Session-scoped fixtures handle expensive setup; function-scoped fixtures keep tests isolated. I use @pytest.mark.parametrize for edge cases and markers to split fast PR checks from staging integration tests.',
    'I define a fixture that returns member ID, plan type, and expected eligibility outcome as a tuple, then parametrize over a list of cases. The fixture handles API client setup; each param row is one eligibility scenario. That keeps tests readable and data-driven.',
    'Root conftest.py holds shared auth and URLs; each service package has its own conftest for domain fixtures. Packages import shared helpers from a test_utils module. Markers at the root define CI tiers so monorepo packages run the right subset per pipeline stage.',
    'Robot keywords become plain Python helper functions; test data tables become parametrize lists. Page Object patterns become fixtures for UI tests. I migrate one domain at a time, keep both frameworks running in CI until parity, then cut over.',
  ],
  followUpSampleAnswers: [
    'I mock at the HTTP layer for fast PR feedback—WireMock or pytest-httpx—but keep a staging integration tier that hits real services. Test containers are useful for databases; for external APIs I prefer contract tests plus periodic real integration runs.',
    'Shared fixtures live in a top-level conftest or a dedicated test_fixtures package installed as a dev dependency. Session-scoped fixtures for auth; function-scoped for data. Each service conftest imports from the shared package to avoid duplication.',
    'Synthetic member IDs only—never real PHI. Fixtures create and tear down test records in staging. Logged payloads are redacted in conftest hooks. I document which fixtures touch PII-like fields so reviewers know what is safe.',
  ],
};

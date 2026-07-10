import type { TopicMentorProfile } from '../../types/mentorContent';

const backendApiTesting: TopicMentorProfile = {
  topicId: 'backend-api-testing',
  isStub: false,
  memoryAnchor: {
    phrase: 'Check the contract before you trust the response.',
    storyId: 'hipaa-api-validation',
  },
  learnTheWhy: {
    plainEnglish:
      'Testing a pharmacy API is like checking a pharmacy counter workflow: first confirm the window is open and the forms are right (contract), then run real scenarios with fake patients (integration), and finally walk a member through eligibility to claim (end-to-end smoke). You are not just hunting for 200 OK—you are proving the system handles wrong IDs, expired coverage, and missing drug codes without leaking member details.',
    technical: {
      what: 'Backend API testing validates HTTP services across contract (schema, status codes, error shapes), integration (auth, business logic, data lookups), and selective end-to-end flows.',
      why: 'PBM platforms expose eligibility, formulary, and claims APIs where a silent schema drift or auth gap can block members from getting medication—or expose PHI in error payloads.',
      how: 'Layer tests: OpenAPI contract checks, integration tests with synthetic member IDs, negative paths (401/403/404/422/429), idempotency on claim submissions, and redacted CI artifacts with correlation IDs.',
      whenUse: 'Every release touching eligibility, claims, or member lookup services; after OpenAPI spec changes; when onboarding new downstream consumers.',
      whenNot: 'Do not replace unit tests inside the service; do not mock so aggressively that wiring bugs never surface; do not run full E2E on every PR if contract + integration already cover the risk.',
      asciiDiagram: `Contract → Integration → E2E smoke
   |            |              |
 schema      auth + logic    happy path only
 status      real DB         post-deploy`,
    },
    interviewAnswer: {
      script60s:
        'I layer API tests starting with contract validation against the OpenAPI spec—status codes, required fields, and error body shapes. Then integration tests with synthetic member IDs cover auth, plan lookup, and eligibility decisions. I always test negative paths—inactive members, terminated coverage, missing NDC—and verify PHI never appears in logs or CI artifacts. For claims APIs I assert idempotency on retries because duplicate submissions are a real PBM risk.',
      whatTheyEvaluate:
        'Whether you think in layers, understand healthcare-specific edge cases, and treat PHI and auth as first-class test concerns—not afterthoughts.',
      whyItScores:
        'Shows practical depth without over-architecting: contract vs integration tradeoff, concrete PBM scenarios, and compliance awareness in one concise answer.',
    },
    myExperience: {
      connections: [
        'At Medidata I built automated backend tests for HIPAA-regulated APIs—positive and negative paths, auth enforcement, schema validation, and verifying unauthorized callers never received PHI.',
        'I learned to separate "JSON shape is correct" from "business outcome is correct," which maps directly to contract vs integration ownership.',
        'When OpenAPI specs drifted from staging, I ran contract tests against live endpoints and filed defects instead of silently updating tests.',
      ],
      storyIds: ['hipaa-api-validation', 'production-api-investigation'],
      projectIds: ['medidata'],
    },
  },
  costBenefit: {
    benefits: [
      'Layered suites catch API drift early; synthetic IDs avoid HIPAA risk',
      'Contract on PR + integration on merge balances speed and confidence',
    ],
    costs: [
      'Integration needs stable staging, rotating auth secrets, and current OpenAPI specs',
      'Negative paths (401/403/422, idempotency) cost more than one happy-path fixture',
    ],
    tradeoffs: [
      'Heavy mocking speeds CI but hides wiring bugs',
      'Fewer E2E flows = faster pipelines but gaps in cross-service journeys',
    ],
    commonMistakes: [
      'Testing only 200 OK with a single golden member',
      'Logging full response bodies with PHI in CI',
    ],
    performance: [
      'Contract every PR; gate integration on merge or nightly',
      'Reuse session-scoped tokens; parallelize by domain (eligibility, claims)',
    ],
    maintainability: [
      'Organize by API domain; shared conftest for auth and base URL',
      'Name tests after business scenarios; version-control fixture personas',
    ],
  },
  decisionTrees: [
    {
      question: 'Does the test only validate JSON field names and status codes?',
      yes: 'Classify as contract test—fast, run on every PR',
      no: {
        question: 'Does it assert a business outcome (eligible, rejected, copay tier)?',
        yes: 'Classify as integration test—needs staging data and auth',
        no: 'Revisit the assertion—you may be testing nothing meaningful',
      },
    },
    {
      question: 'Did the failure include a correlation or trace ID?',
      yes: 'Pull redacted request/response from CI artifact and search logs by that ID',
      no: 'Add correlation ID capture to the test client before re-running',
    },
  ],
  healthcareContext: [
    'Eligibility APIs must handle terminated coverage, COB, and formulary mismatches without returning member diagnoses in error bodies.',
    'Claims submission endpoints need idempotency tests—retries after network blips must not duplicate adjudication.',
    'Never use real member IDs or Rx details in fixtures; synthetic personas mirror plan tiers and NDC patterns only.',
    '401/403 tests prove authorization boundaries—a core HIPAA expectation for pharmacy benefit APIs.',
  ],
  interviewExpectations: {
    junior:
      'Can name HTTP methods, status codes, and describe a happy-path API test with Postman or similar.',
    mid:
      'Explains contract vs integration, lists negative paths, and mentions synthetic test data without production dumps.',
    analystII:
      'Layers tests deliberately, cites PBM edge cases (inactive member, missing NDC, idempotency), ties failures to correlation IDs, and states PHI redaction rules—without claiming to own org-wide API strategy.',
    senior:
      'Discusses consumer-driven contracts, staging parity, and cross-team spec ownership—optional stretch, not required for Analyst II.',
  },
  interviewerMind: {
    whyAsking:
      'Backend APIs are the daily work surface for a PBM QA role—eligibility, claims, and member lookup all ride on them.',
    whatTheyLearn:
      'Whether you test like an engineer (layers, negative paths) or a script recorder (one happy path).',
    tooJunior:
      'Only mentions manual Postman checks or "I click send and see 200."',
    overqualified:
      'Dives into enterprise service mesh, custom API gateways, or company-wide contract-testing RFCs before answering the practical question.',
    strongAnalystII:
      'Clear layering, healthcare-specific edge cases, PHI awareness, and a concrete debugging hook like correlation IDs—grounded in squad-level work.',
  },
  relatedConceptIds: ['api-testing', 'test-data', 'pytest'],
};

const testDataStrategy: TopicMentorProfile = {
  topicId: 'test-data-strategy',
  isStub: false,
  memoryAnchor: {
    phrase: 'Prepare once, reuse everywhere.',
    storyId: 'test-data-management',
  },
  learnTheWhy: {
    plainEnglish:
      'Think of test data like a well-stocked kitchen. You do not cook from scratch for every meal—you prep ingredients once (personas, seed scripts), label the containers (deterministic IDs, documented scenarios), and anyone on the team can make the same dish tomorrow. In healthcare QA you never borrow ingredients from a real patient\'s fridge—synthetic personas mirror plan types and copay tiers without PHI.',
    technical: {
      what: 'Test data strategy defines how synthetic personas, factories, fixtures, and seed scripts create reproducible, isolated data for manual and automated testing.',
      why: 'PBM eligibility and claims tests need realistic combinations—COB, high-deductible, terminated coverage—without copying production dumps that violate HIPAA and rot unpredictably.',
      how: 'Define a small persona catalog with deterministic IDs, version-control seed scripts, use factories for edge-case extensions, isolate destructive tests per run, and schedule staging refreshes from known baselines.',
      whenUse: 'Starting a new squad, onboarding QA, when parallel CI jobs collide on shared member IDs, or when "works on my machine" traces back to mystery database state.',
      whenNot: 'Do not over-build a data factory before you know which scenarios matter; do not refresh staging mid-sprint without coordinating the team; do not create one-off records that live only in someone\'s local DB.',
      asciiDiagram: `Persona catalog → Seed script → Staging
       |                  |              |
  active/COB/term    version-controlled  refresh schedule
  deterministic IDs    alongside tests     isolated destructive runs`,
    },
    interviewAnswer: {
      script60s:
        'I treat test data like a shared kitchen—prep once, reuse everywhere. I maintain a small set of synthetic personas with deterministic IDs: active member, COB, high-deductible, terminated. Each persona is documented for which eligibility scenarios it covers. Data is seeded via version-controlled scripts or PyTest fixtures, never production dumps. Destructive tests get isolated records so parallel CI jobs do not collide, and we refresh staging on a schedule from those seeds.',
      whatTheyEvaluate:
        'Whether you can make testing reproducible for a team, respect HIPAA boundaries, and think beyond "I made a record in staging yesterday."',
      whyItScores:
        'Combines compliance, maintainability, and CI practicality—the three things that break healthcare test environments most often.',
    },
    myExperience: {
      connections: [
        'At Medidata I built synthetic datasets with reusable Python fixtures and parameterized generation—reusing seeded data instead of creating new DB records every run kept staging stable.',
        'I documented which persona covered which scenario so new QA engineers did not reinvent one-off members for every test.',
        'When developers asked for "more realistic" data, I extended the persona library rather than importing production—realistic patterns, not real PHI.',
        'Pairing onboarding with the persona catalog cut "can you make me a test member?" requests within the first week.',
      ],
      storyIds: ['test-data-management'],
      projectIds: ['medidata'],
    },
  },
  costBenefit: {
    benefits: [
      'Version-controlled seeds let anyone reproduce the same PBM scenario',
      'Synthetic personas eliminate HIPAA risk from production dumps',
    ],
    costs: [
      'Upfront persona design and seed scripts before feature tests land',
      'Persona docs must stay in sync when plan rules change',
    ],
    tradeoffs: [
      'Small CI persona set vs rich perf datasets—split pipelines',
      'Shared staging vs isolated per-run data—parallel CI needs isolation',
    ],
    commonMistakes: [
      'Copying production dumps or one-off members nobody can recreate',
      'Same member ID mutated by parallel CI jobs',
    ],
    performance: [
      'Keep PR personas to 5–10 core profiles for fast setup',
      'Generate large volumes on demand for perf runs only',
    ],
    maintainability: [
      'Name personas by scenario (cob-secondary, termed-mid-month)',
      'Review persona changes in PRs; refresh staging from seeds on a schedule',
    ],
  },
  decisionTrees: [
    {
      question: 'Will another engineer need this exact scenario next month?',
      yes: {
        question: 'Does a persona or factory already cover it?',
        yes: 'Extend the existing persona—do not create a one-off',
        no: 'Add a new documented persona or factory function to the catalog',
      },
      no: 'Use an isolated fixture with a clear name—but still avoid production data',
    },
    {
      question: 'Is the test destructive (updates claims, terminates coverage)?',
      yes: 'Dedicated record per test run + teardown fixture',
      no: 'Shared read-only persona is acceptable if IDs are not mutated',
    },
    {
      question: 'Did a developer ask for "realistic" data?',
      yes: 'Extend synthetic personas with richer plan/NDC patterns—never import PHI',
      no: 'Point them to the persona catalog and seed script README',
    },
  ],
  healthcareContext: [
    'Personas must cover PBM-specific paths: COB, prior auth flags, formulary tier, and coverage termination mid-month.',
    'NDC and GPI codes in fixtures should be valid-format synthetic values tied to documented scenarios.',
    'HIPAA means no production member names, DOB, or Rx history—even in "lower" environments.',
    'Eligibility effective/termination dates are high-risk boundaries—personas should include explicit date edges.',
  ],
  interviewExpectations: {
    junior:
      'Knows not to use production data and can describe creating a single test member manually.',
    mid:
      'Mentions reusable fixtures, basic personas, and staging refresh when data goes stale.',
    analystII:
      'Articulates persona catalog, deterministic IDs, version-controlled seeds, parallel CI isolation, HIPAA-compliant synthetic patterns, and onboarding others to the catalog—squad-level ownership.',
    senior:
      'May discuss org-wide data masking pipelines or test data as a platform—optional, not expected day one.',
  },
  interviewerMind: {
    whyAsking:
      'Bad test data causes more "flaky" bugs than timing issues—interviewers want to see you prevent chaos before debugging it.',
    whatTheyLearn:
      'Whether you build for the team or for yourself, and if you understand regulated healthcare constraints.',
    tooJunior:
      'Creates ad hoc records in staging with no documentation or reuse plan.',
    overqualified:
      'Proposes enterprise test-data virtualization platform before describing personas and seed scripts.',
    strongAnalystII:
      'Kitchen analogy lands, personas are concrete, HIPAA is explicit, parallel CI isolation is mentioned, and maintainability is team-focused.',
  },
  relatedConceptIds: ['test-data', 'fixtures', 'parametrize', 'sql'],
};

const eligibilityRulesEngine: TopicMentorProfile = {
  topicId: 'eligibility-rules-engine',
  isStub: false,
  memoryAnchor: {
    phrase: 'Same inputs, same decision—every time.',
    storyId: 'hipaa-api-validation',
  },
  learnTheWhy: {
    plainEnglish:
      'A rules engine is like a pharmacy benefits decision desk with a thick policy manual. You are not just checking that the desk answered the phone—you are verifying that every combination of member status, plan tier, drug code, and effective date produces the right yes/no/prior-auth answer. When the manual updates mid-year, you need to know which test cases page numbers changed.',
    technical: {
      what: 'Rules engine testing validates decision logic across combinatorial inputs—plan configuration, member status, drug attributes, and dates—mapped to expected outcomes via decision tables and parameterized tests.',
      why: 'Eligibility mistakes deny covered medication or approve drugs that should require prior auth—high business and compliance impact in PBM systems.',
      how: 'Build decision tables (inputs → outcome), automate with @pytest.mark.parametrize, tie cases to rule version IDs, test boundary dates, prioritize by change frequency and business risk.',
      whenUse: 'Formulary updates, plan year rollovers, new COB rules, or any config-driven eligibility change.',
      whenNot: 'Do not attempt exhaustive combinatorial coverage—prioritize; do not test rules in isolation if API contract around the engine is also broken.',
      asciiDiagram: `Inputs (plan, member, NDC, date)
           ↓
    Rules engine / config version
           ↓
    Expected: eligible | PA | not covered`,
    },
    interviewAnswer: {
      script60s:
        'I test eligibility rules with decision tables—member status, plan tier, drug attributes, and effective dates mapped to expected outcomes. I automate rows with parametrize and tag tests to rule version IDs so when plan config changes I know what to update. I prioritize boundary dates like coverage termination and plan year rollover, and focus on high-impact paths like COB and prior auth before chasing exhaustive combinations.',
      whatTheyEvaluate:
        'Whether you understand config-driven logic testing—not just API happy paths—and can manage combinatorial scope realistically.',
      whyItScores:
        'Shows structured thinking (decision tables, versioning) and PBM domain awareness without pretending you will test every permutation.',
    },
    myExperience: {
      connections: [
        'HIPAA API work at Medidata included validating that authorization rules blocked PHI for unauthorized callers—rules testing and API testing overlap on outcomes.',
        'Parameterized eligibility cases let me add a new plan tier by extending a data table instead of copying test functions.',
        'When staging plan config drifted, tying tests to rule version IDs made regression scope obvious.',
      ],
      storyIds: ['hipaa-api-validation', 'test-data-management'],
      projectIds: ['medidata'],
    },
  },
  costBenefit: {
    benefits: [
      'Decision tables make expected outcomes visible to product and dev',
      'Parametrize + rule version tags narrow regression when config changes',
    ],
    costs: [
      'Tables need maintenance when business rules are poorly documented',
      'Staging config drift invalidates otherwise correct tests',
    ],
    tradeoffs: [
      'Risk-based sampling beats exhaustive combinatorial coverage',
      'API integration tests catch wiring; direct rules tests catch logic',
    ],
    commonMistakes: [
      'Only testing the default active-member happy path',
      'Ignoring effective/termination dates or rule version links',
    ],
    performance: [
      'Run critical decision rows on PR; full table on merge',
      'Group parametrize rows by rule version for targeted runs',
    ],
    maintainability: [
      'Store tables in CSV/YAML or Python lists—not scattered strings',
      'Name cases after business scenario (cob-secondary-rejects)',
    ],
  },
  decisionTrees: [
    {
      question: 'Did a plan or formulary config change?',
      yes: {
        question: 'Do you know the new rule version ID?',
        yes: 'Diff config, update tagged parametrize rows, run targeted suite',
        no: 'Get version from dev or staging metadata before updating tests blindly',
      },
      no: 'Investigate data persona or API contract drift first',
    },
  ],
  healthcareContext: [
    'COB scenarios require primary/secondary payer ordering—decision tables should encode both payers explicitly.',
    'Prior auth flags differ by NDC, plan tier, and step therapy history—personas must carry drug attributes.',
    'Mid-year formulary updates change eligibility without member status changing—date boundaries are critical.',
    'Wrong eligibility decisions can expose wrong copay amounts tied to member financial data—treat outcomes as sensitive.',
  ],
  interviewExpectations: {
    junior:
      'Understands that eligibility depends on member and plan inputs; can describe one positive and one negative case.',
    mid:
      'Mentions data-driven tests and a few edge cases like terminated coverage.',
    analystII:
      'Decision tables, parametrize, rule version traceability, boundary dates, COB/PA paths, and realistic prioritization when combinations explode.',
    senior:
      'May discuss rules-engine ownership across squads or config deployment pipelines—stretch only.',
  },
  interviewerMind: {
    whyAsking:
      'PBM QA spends significant time on eligibility—interviewers want structured logic testing, not guesswork.',
    whatTheyLearn:
      'Can you tame combinatorial complexity and connect tests to changing business config?',
    tooJunior:
      'Only describes manual checking of one member in a UI.',
    overqualified:
      'Talks about building a custom rules DSL or company-wide rules simulation platform unprompted.',
    strongAnalystII:
      'Decision table mindset, version tagging, boundary dates, and humbled scope—"I prioritize by impact."',
  },
  relatedConceptIds: ['api-testing', 'test-data', 'parametrize'],
};

const pytestPrep: TopicMentorProfile = {
  topicId: 'pytest-prep',
  isStub: false,
  memoryAnchor: {
    phrase: 'Prepare once, reuse everywhere.',
    storyId: 'test-data-management',
  },
  learnTheWhy: {
    plainEnglish:
      'PyTest fixtures are like kitchen prep stations. You chop the onions once (session-scoped auth token), set out measuring cups (HTTP client with base URL), and every recipe (test function) grabs what it needs from the counter instead of starting from zero. Parametrize is your menu of variations—same dish, different spice levels (invalid NDC, expired coverage). conftest.py is the shared pantry everyone in the project can open.',
    technical: {
      what: 'PyTest is a Python test framework using fixtures for setup/teardown, markers for CI tiers, parametrize for data-driven cases, and conftest.py for shared configuration.',
      why: 'Pharmacy benefit API suites grow fast—fixtures and markers keep tests isolated, composable, and split between fast PR checks and staging integration runs.',
      how: 'Organize by domain (eligibility, claims, formulary); root conftest for auth and URLs; session scope for expensive setup, function scope for isolation; @pytest.mark.parametrize for edge cases; markers (@pytest.mark.integration) for pipeline stages.',
      whenUse: 'New API automation, migrating from Robot Framework, or when duplicated setup bloated every test file.',
      whenNot: 'Do not session-scope mutable state; do not skip markers and run 200 tests on every commit; do not hide all setup in fixtures so tests read like magic.',
      asciiDiagram: `conftest.py (pantry)
    ├── session: auth token
    ├── function: api_client
    └── markers: unit | integration

test_eligibility.py
    └── parametrize(rows) + fixtures`,
    },
    interviewAnswer: {
      script60s:
        'I structure PyTest suites by domain—eligibility, claims, formulary—with a root conftest for auth and base URLs. Fixtures are my kitchen prep: session-scoped for expensive setup like tokens, function-scoped for isolation. I use parametrize for data-driven edge cases—invalid NDC, terminated coverage—and markers so CI runs fast unit checks on PR and full integration on merge. When I migrated from Robot, keywords became plain Python helpers and shared setup moved into fixtures instead of duplicated boilerplate.',
      whatTheyEvaluate:
        'Practical PyTest fluency—fixtures, scopes, parametrize, markers—and whether you can structure a maintainable healthcare API suite.',
      whyItScores:
        'Demonstrates hands-on framework knowledge tied to CI speed and healthcare scenarios, not abstract trivia.',
    },
    myExperience: {
      connections: [
        'Reusable Python fixtures at Medidata backed synthetic test data—same pattern I use for API clients and member personas.',
        'Session-scoped readiness fixtures (after Lambda cold-start debugging) replaced arbitrary sleeps in integration tests.',
        'Mentoring developers on unit tests meant explaining fixture boundaries and what belongs in conftest vs test files.',
        'Domain folders (eligibility vs claims) kept conftest hierarchies understandable in a multi-service repo.',
      ],
      storyIds: ['test-data-management', 'lambda-cold-start', 'mentoring-developers'],
      projectIds: ['medidata'],
    },
  },
  costBenefit: {
    benefits: [
      'Fixtures and conftest eliminate duplicated setup across API suites',
      'Markers split fast PR checks from staging integration runs',
    ],
    costs: [
      'Wrong fixture scope causes order-dependent failures',
      'Markers need team discipline—or tests run everywhere',
    ],
    tradeoffs: [
      'Session scope = speed; function scope = isolation',
      'HTTP mocks on PR vs real staging on merge',
    ],
    commonMistakes: [
      'Session fixtures mutating shared state between tests',
      'No markers—full integration suite on every push',
    ],
    performance: [
      '@pytest.mark.unit on PR; integration on merge or nightly',
      'Session-scope tokens; parametrize only high-value edge rows on PR',
    ],
    maintainability: [
      'Name tests after scenario: test_eligibility_rejects_terminated_member',
      'Document markers and env vars in root conftest',
    ],
  },
  decisionTrees: [
    {
      question: 'Is setup expensive (login, DB seed, token exchange)?',
      yes: {
        question: 'Does any test mutate that state?',
        yes: 'Function-scoped fixture or fresh seed per test',
        no: 'Session-scoped fixture is appropriate',
      },
      no: 'Function-scoped fixture—keep tests isolated',
    },
    {
      question: 'Should this test run on every PR?',
      yes: 'Mark unit or contract; no external staging dependency',
      no: 'Mark integration; run on merge or scheduled pipeline',
    },
    {
      question: 'Are you repeating the same test with different input rows?',
      yes: 'Use @pytest.mark.parametrize with a fixture for client setup',
      no: 'Single test function with explicit arrange-act-assert',
    },
  ],
  healthcareContext: [
    'Fixtures should load synthetic member personas—never wire real PHI into conftest defaults.',
    'Parametrize rows for eligibility should include terminated coverage, COB, and missing NDC without real Rx data.',
    'conftest hooks can redact logged payloads before CI artifacts upload.',
    'Integration markers prevent staging eligibility tests from blocking every developer push.',
  ],
  interviewExpectations: {
    junior:
      'Can write a basic test and describe what a fixture does.',
    mid:
      'Explains conftest, parametrize, and difference between function and session scope.',
    analystII:
      'Domain structure, marker strategy for CI tiers, fixture scope tradeoffs, healthcare-safe logging hooks, and Robot-to-PyTest migration pattern—hands-on squad lead energy without principal posturing.',
    senior:
      'May discuss custom plugins or org-wide pytest conventions—optional depth.',
  },
  interviewerMind: {
    whyAsking:
      'Capital Rx likely uses Python API automation—PyTest fluency is a direct job skill, not trivia.',
    whatTheyLearn:
      'Do you write maintainable suites or a pile of scripts that only you can run?',
    tooJunior:
      'Has only used record-and-playback tools; cannot explain fixture scope.',
    overqualified:
      'Leads with building a custom test framework instead of answering how they structure PyTest today.',
    strongAnalystII:
      'Kitchen analogy for fixtures, clear CI marker strategy, parametrize for PBM edge cases, and mentoring others on readable tests.',
  },
  relatedConceptIds: ['pytest', 'fixtures', 'parametrize', 'test-data'],
};

const flakyTestDebugging: TopicMentorProfile = {
  topicId: 'flaky-test-debugging',
  isStub: false,
  memoryAnchor: {
    phrase: "The service wasn't awake yet.",
    storyId: 'lambda-cold-start',
  },
  learnTheWhy: {
    plainEnglish:
      'A flaky test is like a store that sometimes opens late. You show up at 9:00, the door is locked, you fail—but at 9:05 everything works. The fix is not to wait an hour every morning; it is to check if the store is actually open before you try to buy something. Same with APIs: readiness checks and bounded retries beat random sleeps and blind re-runs.',
    technical: {
      what: 'Flaky test debugging finds non-deterministic failures—timing, shared state, order dependency, infrastructure cold starts—and fixes root cause instead of masking with retries.',
      why: 'Flaky CI erodes trust; teams ignore red builds and real defects slip through—especially painful for regulated healthcare releases.',
      how: 'Correlate CI logs (shard, timestamp, parallel vs isolated), reproduce in isolation vs full suite, inspect fixture scope and shared data, replace sleeps with condition waits, quarantine with tracked ticket if fix cannot ship same day.',
      whenUse: 'Intermittent failures, pass-local fail-CI patterns, spikes after parallelization or new infrastructure.',
      whenNot: 'Do not add @pytest.mark.flaky as first move; do not re-run until green without investigation; do not quarantine without an owner and ticket.',
      asciiDiagram: `Fail in CI → same env? → isolated pass?
                    |              |
                 infra/timing    order dependency
                    |              |
              readiness wait    fixture scope / unique IDs`,
    },
    interviewAnswer: {
      script60s:
        'When a test flakes I start with CI artifacts—timestamps, shard, correlation IDs—and compare isolated run vs full suite. At Medidata intermittent API failures traced to Lambda cold starts; I replaced arbitrary sleeps with a readiness fixture and bounded retries. I fix root cause—unique test data, proper fixture scope, explicit waits—before adding retry plugins. If I cannot fix same day I quarantine with a ticket so CI stays trustworthy.',
      whatTheyEvaluate:
        'Systematic debugging discipline and whether you protect CI trust—not just "I re-ran it."',
      whyItScores:
        'Concrete cold-start story, clear process, and quarantine policy show mature Analyst II judgment.',
    },
    myExperience: {
      connections: [
        'Lambda cold-start investigation: CloudWatch timestamps showed 400/500s only during warm-up—readiness fixture fixed it without masking real bugs.',
        'Bounded retry with configurable timeout waited only as long as needed—not blanket sleep(30).',
        'Distinguishing automation timing from application defects preserved confidence in remaining failures.',
      ],
      storyIds: ['lambda-cold-start', 'production-api-investigation'],
      projectIds: ['medidata'],
    },
  },
  costBenefit: {
    benefits: [
      'Reliable CI means red builds get immediate attention',
      'Root-cause fixes often remove unnecessary waits and speed the suite',
    ],
    costs: [
      'Debugging intermittent failures takes longer than re-running',
      'Quarantine queues need owners or debt silently grows',
    ],
    tradeoffs: [
      'Bounded retry only after confirming transient infra (cold start)',
      'Parallel CI speed vs shared-state collisions—fix isolation first',
    ],
    commonMistakes: [
      'Increasing timeout or adding retries without investigation',
      'Shared member IDs across parallel workers',
    ],
    performance: [
      'Readiness polls beat one long sleep(30)',
      'Unique IDs per test under pytest-xdist',
    ],
    maintainability: [
      'Track quarantined tests with owner and ticket',
      'Add shard and timestamp to CI failure output',
    ],
  },
  decisionTrees: [
    {
      question: 'Does the test pass when run alone but fail in the full suite?',
      yes: 'Suspect order dependency or shared mutable state—check fixture scope and data collisions',
      no: {
        question: 'Do failures cluster right after deploy or on first request?',
        yes: 'Suspect cold start / readiness—add health check fixture',
        no: 'Compare CI vs local env vars, clocks, and dependency versions',
      },
    },
  ],
  healthcareContext: [
    'Eligibility API flakes during deploy windows can block formulary releases—quarantine policy must be visible to release managers.',
    'Never mask data-related flakes with retries if wrong eligibility could ship—confirm application vs test issue first.',
    'Correlation IDs link flaky CI failures to CloudWatch without logging PHI.',
    'Parallel claim tests colliding on the same synthetic member ID mimic production race conditions—fix data isolation.',
  ],
  interviewExpectations: {
    junior:
      'Recognizes flaky means intermittent; might suggest re-running.',
    mid:
      'Mentions isolation, logs, and avoiding blind retries.',
    analystII:
      'Structured triage (CI metadata, isolation, readiness, fixture scope), cold-start example, quarantine with ticket, and flaky-rate awareness.',
    senior:
      'May discuss org-wide flaky budgets or infrastructure investment—optional.',
  },
  interviewerMind: {
    whyAsking:
      'Every QA team fights flakes—process separates hires who deepen trust from those who erode it.',
    whatTheyLearn:
      'Debugging temperament and respect for CI as a team signal.',
    tooJunior:
      'Says "just run it again" or adds sleep without analysis.',
    overqualified:
      'Proposes rebuilding the entire CI platform before describing one flake fix.',
    strongAnalystII:
      'Cold-start story, readiness over sleep, quarantine policy, and correlation with logs.',
  },
  relatedConceptIds: ['flaky', 'cloudwatch', 'cicd', 'pytest'],
};

const sqlDataTriage: TopicMentorProfile = {
  topicId: 'sql-data-triage',
  isStub: false,
  memoryAnchor: {
    phrase: 'Let the data tell you if the API lied.',
    storyId: 'test-data-management',
  },
  learnTheWhy: {
    plainEnglish:
      'When an eligibility API says "covered" but the member still gets rejected at the pharmacy, SQL is how you open the ledger and see what the database actually believes about that member\'s plan. You are cross-checking the story the API told against the source of truth—without exporting patient names to your notebook.',
    technical: {
      what: 'SQL data triage uses targeted read-only queries to validate backend state—member coverage, claim status, adjudication flags—when API or UI results look wrong.',
      why: 'API responses can be cached, mapped wrong, or stale; database truth helps separate test bugs from application bugs in PBM workflows.',
      how: 'Use synthetic member IDs, read-only staging access, JOIN plan and member tables, compare API payload fields to DB columns, document queries in tickets with redacted IDs.',
      whenUse: 'Failed eligibility assertion, claim stuck in pending, suspected test data seed issue, reconciling after staging refresh.',
      whenNot: 'Do not run wide SELECT * on production; do not paste query results with PHI into Slack; do not mutate data without coordinating seed script updates.',
      asciiDiagram: `API says X → SQL confirms member_plan row
                         → claim status table
                         → mismatch = bug or bad test data`,
    },
    interviewAnswer: {
      script60s:
        'When an API result does not match expectations I triage with read-only SQL against staging—member coverage, plan effective dates, claim status—using synthetic IDs only. I compare the API JSON fields to the columns the service should have read. If DB and API agree but the test expected wrong, I fix the persona or assertion; if they disagree, I file a defect with redacted query output. I never run ad hoc writes without updating our version-controlled seed scripts.',
      whatTheyEvaluate:
        'Whether you can validate outcomes beyond the response body and handle data responsibly in healthcare.',
      whyItScores:
        'Bridges API testing and data debugging—exactly what Analyst II does when automation fails mysteriously.',
    },
    myExperience: {
      connections: [
        'Test data management at Medidata required knowing which tables backed eligibility personas—SQL confirmed seeds applied correctly after refresh.',
        'Reconciling claim status in DB vs API response isolated whether failure was automation assertion or adjudication logic.',
      ],
      storyIds: ['test-data-management'],
      projectIds: ['medidata'],
    },
  },
  costBenefit: {
    benefits: [
      'SQL evidence speeds triage when API and expected outcome diverge',
      'Read-only queries on synthetic IDs build credibility with devs',
    ],
    costs: [
      'Needs safe staging access and schema familiarity',
      'Easy to pull wide columns with sensitive fields',
    ],
    tradeoffs: [
      'Self-serve triage vs asking dev—faster when you know the schema',
      'Saved snippets vs ad hoc—maintain lookups for common personas',
    ],
    commonMistakes: [
      'SELECT * including member name or DOB into tickets',
      'Assuming API field names match DB columns one-to-one',
    ],
    performance: [
      'Filter by indexed synthetic member ID; limit result sets',
      'Save common eligibility lookups as documented snippets',
    ],
    maintainability: [
      'Store redacted example queries linked to personas',
      'Note schema version when plan tables change',
    ],
  },
  decisionTrees: [
    {
      question: 'Does the API response match what SQL shows for the same synthetic member ID?',
      yes: 'Likely wrong test expectation or outdated persona—fix assertion or seed',
      no: 'File application defect with redacted API + SQL evidence',
    },
  ],
  healthcareContext: [
    'Member, plan, and claim tables often live in separate schemas—know which adjudication table is source of truth.',
    'Coverage effective dates in SQL must align with eligibility API date boundaries.',
    'Never export result sets with PHI to local files or chat—use IDs and flags only.',
    'COB rows require checking secondary payer columns, not just primary eligibility.',
  ],
  interviewExpectations: {
    junior:
      'Can run a basic SELECT with a WHERE clause.',
    mid:
      'Uses JOINs to verify member-plan relationship; knows to use staging and synthetic IDs.',
    analystII:
      'Read-only triage workflow, API-to-DB field mapping, redacted evidence in tickets, seed script discipline when data is wrong.',
    senior:
      'May discuss data warehouse analytics—optional for this role.',
  },
  interviewerMind: {
    whyAsking:
      'API testers who cannot inspect data depend entirely on devs—Analyst II should show some independence.',
    whatTheyLearn:
      'Practical data skills with compliance awareness.',
    tooJunior:
      'Only tests via UI or API with no idea where data lives.',
    overqualified:
      'Dives into DBA indexing strategy before answering triage workflow.',
    strongAnalystII:
      'Synthetic IDs, read-only staging, compare API to DB, redacted tickets, fix seeds not mystery patches.',
  },
  relatedConceptIds: ['sql', 'test-data', 'api-testing'],
};

const loggingMonitoring: TopicMentorProfile = {
  topicId: 'logging-monitoring',
  isStub: false,
  memoryAnchor: {
    phrase: 'The dashboard told us before people did.',
    storyId: 'splunk-dashboard',
  },
  learnTheWhy: {
    plainEnglish:
      'Good logging is like a store security camera that records transaction IDs instead of customer faces. When a test fails at 2:13 PM you do not guess—you search CloudWatch or Splunk for that correlation ID and watch what the service did. Splunk dashboards at Tradeweb meant engineers saw routing problems on the wall before anyone got paged. In healthcare you redact the faces (PHI) but keep the receipt number (trace ID).',
    technical: {
      what: 'Logging and monitoring for QA means capturing correlation/trace IDs in test output, searching centralized logs (CloudWatch, Splunk), redacting PHI, and tracking CI health metrics (failure rate, duration, flaky count).',
      why: 'Async API failures in CI are undebuggable without linking test assertions to server logs—MTTD drops when dashboards surface spikes before humans notice.',
      how: 'Assert correlation IDs in API responses, publish redacted request/response in CI artifacts, search by ID + timestamp window, build dashboards for error rate and test duration, alert on CI failure spikes.',
      whenUse: 'CI failure investigation, post-deploy smoke issues, correlating staging failures with production error patterns.',
      whenNot: 'Do not log full payloads with member PII; do not rely on verbose DEBUG in production; do not skip IDs because "the test usually passes."',
      asciiDiagram: `Test fails → capture trace ID
       ↓
CloudWatch / Splunk search (time window)
       ↓
Redacted artifact → ticket / Slack`,
    },
    interviewAnswer: {
      script60s:
        'I treat logs as the bridge between a failed test and the server truth. Tests capture correlation IDs from API responses; I search CloudWatch or Splunk in that job\'s time window. All logged payloads are redacted—synthetic member IDs only. I publish enough context in CI artifacts to debug async without re-running. At Tradeweb Splunk dashboards surfaced infrastructure issues before manual checks; same mindset applies to CI dashboards for failure rate and flaky-test spikes.',
      whatTheyEvaluate:
        'Whether you close the loop between automation failure and observability—not just rerun locally.',
      whyItScores:
        'Splunk dashboard story plus CloudWatch triage and PHI redaction shows full Analyst II observability literacy.',
    },
    myExperience: {
      connections: [
        'Tradeweb: automated networking checks fed Splunk dashboards—engineers saw abnormal routing on monitors before manual investigation.',
        'Medidata: CloudWatch correlation tied intermittent API test failures to Lambda warm-up windows.',
        'Production API investigation used trace IDs instead of re-running blind—same workflow for CI failures.',
        'I ask devs for correlation ID, rule version, and hashed member reference—not raw PHI—in error logs.',
      ],
      storyIds: ['splunk-dashboard', 'lambda-cold-start', 'production-api-investigation'],
      projectIds: ['tradeweb', 'medidata'],
    },
  },
  costBenefit: {
    benefits: [
      'Correlation IDs cut mean time to debug CI and staging failures',
      'Redacted artifacts enable async handoff without pairing sessions',
    ],
    costs: [
      'APIs must return traceable IDs; dashboards need upkeep',
      'Redaction hooks in test frameworks require upfront setup',
    ],
    tradeoffs: [
      'Structured INFO logs vs DEBUG payloads—redact PHI always',
      'CI artifacts vs re-run cost—artifacts win for intermittent failures',
    ],
    commonMistakes: [
      'Logging full JSON responses with member names in CI',
      'Searching logs without time-bounding to the job window',
    ],
    performance: [
      'Capture IDs in assertion messages—zero extra API calls',
      'Alert on rolling failure-rate spikes, not single flakes',
    ],
    maintainability: [
      'conftest hook redacts known PHI fields before log upload',
      'Document standard query templates per service (Splunk/CloudWatch)',
    ],
  },
  decisionTrees: [
    {
      question: 'Did the failed test output include a correlation or trace ID?',
      yes: {
        question: 'Can you find matching server logs in the CI job time window?',
        yes: 'Compare server error to assertion—app bug vs wrong expectation',
        no: 'Escalate missing logging to dev; widen search to adjacent services',
      },
      no: 'Add ID capture to test client before next debug cycle',
    },
    {
      question: 'Are similar errors appearing on production dashboards?',
      yes: 'Treat as potential real defect—not test-only issue',
      no: 'Focus on staging data, test timing, or environment drift',
    },
  ],
  healthcareContext: [
    'HIPAA: CI and shared logs must not contain member names, DOB, or Rx details—use synthetic IDs and redaction hooks.',
    'Eligibility errors should log rule version and decision code—not diagnosis text.',
    'PBM on-call may use Splunk while APIs live in AWS—learn both search paths your squad uses.',
    'Correlating staging test failures with production error rates catches issues before members hit the pharmacy.',
  ],
  interviewExpectations: {
    junior:
      'Knows tests can print output; might look at console logs.',
    mid:
      'Mentions correlation IDs and searching logs for a failed request.',
    analystII:
      'End-to-end triage workflow, CloudWatch and Splunk awareness, redacted CI artifacts, dashboard metrics for flaky rate and duration, Splunk or CloudWatch story—operational credibility without SRE principal scope.',
    senior:
      'May design observability standards org-wide—optional stretch.',
  },
  interviewerMind: {
    whyAsking:
      'QA who cannot use logs becomes a bottleneck—especially for API-heavy PBM systems.',
    whatTheyLearn:
      'Independence in failure investigation and compliance instinct.',
    tooJunior:
      'Only reruns locally; no concept of centralized logging.',
    overqualified:
      'Designs entire observability stack before answering how they debug one CI failure.',
    strongAnalystII:
      'Dashboard-before-people Splunk story, correlation ID workflow, PHI redaction, and CI health metrics.',
  },
  relatedConceptIds: ['cloudwatch', 'splunk', 'flaky', 'api-testing'],
};

const behavioralLeadership: TopicMentorProfile = {
  topicId: 'behavioral-leadership',
  isStub: false,
  memoryAnchor: {
    phrase: 'Teach the fisherman, do not catch every fish.',
    storyId: 'mentoring-developers',
  },
  learnTheWhy: {
    plainEnglish:
      'Behavioral leadership in QA is not about being the boss—it is about making the team better at catching bugs before you see them. Like teaching someone to cook instead of making every meal yourself: you review their recipe (unit tests), suggest better ingredients (fixtures), and soon the kitchen handles more orders without you as the only chef.',
    technical: {
      what: 'QA behavioral leadership covers mentoring developers on tests, constructive PR review, sharing testing strategy, and reducing QA bottlenecks without formal management authority.',
      why: 'One QA engineer cannot write every test for multiple squads—raising dev test quality shifts left and speeds delivery in agile PBM teams.',
      how: 'Pair on PR reviews, explain what to assert vs mock, share conftest patterns, celebrate good unit tests, set clear "ready for QA" expectations.',
      whenUse: 'Dev tests are weak, QA is overloaded, new hires need testing culture, cross-team eligibility features need shared standards.',
      whenNot: 'Do not gatekeep or shame; do not rewrite every PR yourself; do not skip QA on risky eligibility changes because dev added one test.',
    },
    interviewAnswer: {
      script60s:
        'As a senior QA on multiple teams I could not own every automated test. I mentored developers in PR reviews—what to unit test, what to mock, when integration matters. I shared PyTest fixture patterns and explained coverage expectations before features reached QA. Developers got more comfortable writing tests, which reduced my bottleneck and improved quality earlier in the sprint.',
      whatTheyEvaluate:
        'Collaboration, influence without authority, and practical shift-left mindset.',
      whyItScores:
        'STAR-friendly mentoring story with measurable team outcome—not vague "I\'m a people person."',
    },
    myExperience: {
      connections: [
        'Medidata: supported multiple dev teams—PR review coaching on unit tests and coverage before QA handoff.',
        'Shared testing strategies in Slack and pairing sessions—not lectures.',
        'Reduced QA bottleneck while keeping accountability for eligibility risk areas.',
      ],
      storyIds: ['mentoring-developers'],
      projectIds: ['medidata'],
    },
  },
  costBenefit: {
    benefits: [
      'Shift-left catches eligibility bugs cheaper; devs own unit layer',
      'Mentoring spreads test knowledge—bus factor drops',
    ],
    costs: [
      'Mentoring time competes with your own automation work',
      'Inconsistent dev test quality until habits form',
    ],
    tradeoffs: [
      'Deep pair session vs async review—use both',
      'Strict merge bar vs velocity—risk-based for claims paths',
    ],
    commonMistakes: [
      'Rewriting dev tests silently instead of teaching',
      'Skipping QA on "dev tested it" for high-risk eligibility changes',
    ],
    performance: [
      'Mentor high-change services first',
      'Template good PR test examples devs can copy',
    ],
    maintainability: [
      'Document squad testing checklist (unit + integration expectations)',
      'Celebrate merged PRs with solid tests in team channels',
    ],
  },
  decisionTrees: [
    {
      question: 'Did the PR include tests for the changed eligibility logic?',
      yes: 'Review quality—assertions, mocks, edge cases—and approve or suggest',
      no: {
        question: 'Is the change high risk (claims, auth, PHI)?',
        yes: 'Request tests before merge—pair if needed',
        no: 'Negotiate follow-up ticket with clear scope',
      },
    },
  ],
  healthcareContext: [
    'Teach devs never to assert against real PHI in unit tests.',
    'Eligibility changes need boundary cases—coach devs on date edges, not only happy path.',
    'HIPAA-aware logging should be part of review checklist for API changes.',
  ],
  interviewExpectations: {
    junior:
      'Describes teamwork positively; limited mentoring examples.',
    mid:
      'Gives one collaboration example from school or work.',
    analystII:
      'Concrete mentoring story, PR review influence, shift-left outcomes, balanced tone—not claiming people management.',
    senior:
      'May discuss leading QA guilds—optional.',
  },
  interviewerMind: {
    whyAsking:
      'Analyst II works across squads—influence matters as much as automation skill.',
    whatTheyLearn:
      'Emotional intelligence and whether you multiply team output.',
    tooJunior:
      'Only says "I work well with others" with no example.',
    overqualified:
      'Talks about managing managers or org redesign.',
    strongAnalystII:
      'Mentoring-developers story, specific actions, reduced bottleneck, still hands-on.',
  },
  relatedConceptIds: ['pytest', 'fixtures'],
};

const scrumProductCollaboration: TopicMentorProfile = {
  topicId: 'scrum-product-collaboration',
  isStub: false,
  memoryAnchor: {
    phrase: 'Understand the ride before you build the app.',
    storyId: 'xpress-transit-requirements',
  },
  learnTheWhy: {
    plainEnglish:
      'Building software without clear requirements is like designing a transit app before you know how drivers dispatch rides. On XPress Transit I sat with stakeholders first—who requests rides, what gets captured, how dispatch works—then translated that into schema and tests. In scrum, QA adds value early by asking "what does done mean for eligibility?" before the sprint ends.',
    technical: {
      what: 'Scrum/product collaboration for QA means refining acceptance criteria, clarifying ambiguous stories, prioritizing test risk with PM, and representing quality in sprint ceremonies without owning the backlog.',
      why: 'Late clarification causes rework—especially for PBM rules where edge cases (COB, termination) hide in vague stories.',
      how: 'Ask probing questions in refinement, write testable AC, flag dependencies on formulary data, negotiate scope when risk exceeds sprint capacity.',
      whenUse: 'Ambiguous eligibility stories, cross-team dependencies, sprint planning when QA capacity is tight.',
      whenNot: 'Do not become the product owner; do not block sprint without alternatives; do not accept untestable AC silently.',
    },
    interviewAnswer: {
      script60s:
        'On XPress Transit the business idea was clear but details were not. I met stakeholders first to understand operations—users, data captured, dispatch flow—before building. That translated into requirements, schema, and better tests later. In scrum I bring that same habit: refine acceptance criteria until eligibility edge cases are explicit, flag dependencies early, and align with PM on what "done" means for pharmacy benefit stories.',
      whatTheyEvaluate:
        'Communication, comfort with ambiguity, and ability to represent quality in agile rituals.',
      whyItScores:
        'Real project story plus scrum application—shows Analyst II bridges business and technical.',
    },
    myExperience: {
      connections: [
        'XPress Transit: stakeholder conversations before code defined what to test.',
        'Requirements evolved—I refined tests as business rules clarified.',
        'Demonstrated that QA input in refinement saves rework on integration tests.',
      ],
      storyIds: ['xpress-transit-requirements'],
      projectIds: ['xpress-transit'],
    },
  },
  costBenefit: {
    benefits: [
      'Clear AC reduces mid-sprint surprises on eligibility scenarios',
      'Early dependency flags prevent blocked testing days',
    ],
    costs: [
      'Ceremony time vs automation time—balance sprint commitments',
      'Over-specifying AC can slow discovery',
    ],
    tradeoffs: [
      'Test everything in sprint vs negotiate stretch goals',
      'Blocking release vs documented risk acceptance—escalate clearly',
    ],
    commonMistakes: [
      'Only appearing at end of sprint to say "cannot test"',
      'Ignoring formulary dependency until staging is empty',
    ],
    performance: [
      'Bring top three risk questions to every refinement',
      'Track untestable stories visibly on the sprint board',
    ],
    maintainability: [
      'Link test cases to AC IDs in PR descriptions',
      'Retro notes on recurring ambiguity feed better templates',
    ],
  },
  decisionTrees: [
    {
      question: 'Are acceptance criteria testable for eligibility edge cases?',
      yes: 'Proceed—build parametrize rows from AC',
      no: {
        question: 'Can PM clarify in this refinement session?',
        yes: 'Capture updated AC before sprint commit',
        no: 'Split story or pull into spike—do not guess coverage',
      },
    },
  ],
  healthcareContext: [
    'Stories must spell out COB, termination, and PA behavior—not just "member is eligible."',
    'Formulary update stories need effective dates in AC.',
    'PHI constraints should appear in AC for any new logging or export feature.',
  ],
  interviewExpectations: {
    junior:
      'Knows scrum roles at a high level.',
    mid:
      'Participates in standup; may write basic AC.',
    analystII:
      'Refinement examples, testable AC, dependency flagging, XPress-style ambiguity story, balanced squad partner tone.',
    senior:
      'May own multi-squad release planning—optional.',
  },
  interviewerMind: {
    whyAsking:
      'Capital Rx QA works with product on benefits logic—communication is daily work.',
    whatTheyLearn:
      'Whether you prevent ambiguity from becoming production defects.',
    tooJunior:
      'Only describes ceremonies by name without examples.',
    overqualified:
      'Positions as product director instead of QA partner.',
    strongAnalystII:
      'Stakeholder-first requirements story, testable AC habit, healthcare edge cases in refinement.',
  },
  relatedConceptIds: ['test-data', 'api-testing'],
};

const cicdAutomationArchitecture: TopicMentorProfile = {
  topicId: 'cicd-automation-architecture',
  isStub: false,
  memoryAnchor: {
    phrase: '20 minutes became 2.',
    storyId: 'playwright-ci-optimization',
  },
  learnTheWhy: {
    plainEnglish:
      'Running every test on one machine is like asking one student to grade the whole class homework pile. Sharding splits the pile across runners—same total work, finished faster. My Playwright suite went from 20 minutes to about 2 by parallel shards in GitHub Actions. The trick is balancing shards so no runner gets all the slow eligibility tests.',
    technical: {
      what: 'CI/CD automation architecture for QA covers pipeline stages, test markers, parallel sharding, secrets management, artifacts, and feedback loops between PR checks and merge/nightly suites.',
      why: 'Slow CI discourages commits; fast reliable pipelines keep healthcare releases moving without skipping regression.',
      how: 'Marker tiers (unit on PR, integration on merge), shard by timing balance, cache dependencies, publish redacted artifacts, alert on failure spikes.',
      whenUse: 'Suite exceeds ~10 minutes, parallel collisions appear, or teams skip CI because it is too slow.',
      whenNot: 'Do not shard before tests are independent; do not parallelize shared mutable staging data without isolation.',
      asciiDiagram: `PR → unit/contract (fast)
merge → integration shards (1..N)
nightly → full + perf`,
    },
    interviewAnswer: {
      script60s:
        'I design CI in tiers—fast contract and unit tests on every PR, integration on merge with parallel shards. On my Playwright project ~200 tests took 10–20 minutes until I sharded across GitHub Actions runners; runtime dropped to about 1–2 minutes with balanced workload. I use PyTest markers to select tiers, store secrets for staging auth in CI vault, and publish redacted artifacts for async debug. Sharding only works when tests have isolated data—otherwise parallel jobs collide.',
      whatTheyEvaluate:
        'Whether you understand pipeline design as a QA enabler—not black-box DevOps.',
      whyItScores:
        'Concrete 20→2 story plus markers, secrets, and data isolation shows Analyst II CI literacy.',
    },
    myExperience: {
      connections: [
        'Playwright CI: sharding across runners cut feedback from ~20 minutes to ~2 without dropping coverage.',
        'Balanced shards by test duration—not just count—avoided one slow runner.',
        'Markers from PyTest prep map directly to pipeline stages I configure in GitHub Actions.',
      ],
      storyIds: ['playwright-ci-optimization'],
      projectIds: ['personal-website'],
    },
  },
  costBenefit: {
    benefits: [
      'Tiered pipelines balance fast PR feedback with merge confidence',
      'Artifacts and sharding make failures actionable as suites grow',
    ],
    costs: [
      'Runner minutes multiply with parallel shards',
      'Pipeline YAML and secret rotation need ongoing upkeep',
    ],
    tradeoffs: [
      'More shards vs runner cost—profile slow tests first',
      'Merge gate vs nightly integration—risk-based',
    ],
    commonMistakes: [
      'Sharding before fixing shared test data collisions',
      'No markers—everything runs on every push',
    ],
    performance: [
      'Balance shards by duration; fail fast on contract tier',
      'Cache pip/npm and browser binaries',
    ],
    maintainability: [
      'Document pipeline stages with marker names in README',
      'Keep workflow files small—reusable composite actions',
    ],
  },
  decisionTrees: [
    {
      question: 'Does the full suite take more than ~10 minutes on PR?',
      yes: {
        question: 'Are tests independent with isolated data?',
        yes: 'Introduce markers + parallel shards on merge',
        no: 'Fix data isolation and flakes before sharding',
      },
      no: 'Optimize slow tests first—shard may be premature',
    },
  ],
  healthcareContext: [
    'Staging auth secrets in CI must rotate and never appear in logs.',
    'Integration tiers hitting eligibility APIs should use synthetic personas per shard.',
    'Redacted artifacts are mandatory—CI logs are widely visible.',
    'Release pipelines may need manual approval gates for formulary prod—know where QA suite fits.',
  ],
  interviewExpectations: {
    junior:
      'Knows CI runs tests on commit.',
    mid:
      'Describes PR vs main branch runs; heard of parallel jobs.',
    analystII:
      'Marker tiers, sharding story, secrets, artifacts, data isolation prerequisite—squad pipeline owner mindset.',
    senior:
      'Org-wide pipeline standards—optional.',
  },
  interviewerMind: {
    whyAsking:
      'QA often owns test jobs in CI—slow or flaky pipelines are your problem too.',
    whatTheyLearn:
      'Practical speed improvements vs buzzword DevOps.',
    tooJunior:
      'Never looked at a workflow file.',
    overqualified:
      'Designs enterprise CI platform before describing one optimization.',
    strongAnalystII:
      '20 minutes became 2, homework-shard analogy, markers, isolation caveat.',
  },
  relatedConceptIds: ['cicd', 'flaky', 'pytest'],
};

export const topicMentorProfiles: TopicMentorProfile[] = [
  backendApiTesting,
  testDataStrategy,
  eligibilityRulesEngine,
  pytestPrep,
  flakyTestDebugging,
  sqlDataTriage,
  loggingMonitoring,
  behavioralLeadership,
  scrumProductCollaboration,
  cicdAutomationArchitecture,
];

export function getMentorProfile(topicId: string): TopicMentorProfile | undefined {
  return topicMentorProfiles.find((p) => p.topicId === topicId);
}

import type { StretchConcept } from '../types/stretchConcept';

export const stretchConcepts: StretchConcept[] = [
  {
    id: 'why-fixtures',
    title: 'Why fixtures matter',
    whyItMatters:
      'Fixtures centralize setup—auth tokens, base URLs, browser sessions—so tests stay readable and failures point to behavior, not copy-pasted boilerplate. Without them, every test reimplements setup and drift creeps in when APIs change.',
    practicalTakeaway:
      'As an experienced IC, I explain fixtures as shared setup with clear scope: function-scoped for isolation, session-scoped only when the cost is high. I learn the team\'s existing conftest patterns before adding new ones.',
    relatedTopicIds: ['pytest-prep', 'backend-api-testing'],
  },
  {
    id: 'why-parameterization',
    title: 'Why parameterization matters',
    whyItMatters:
      'Eligibility and rules engines have combinatorial inputs—plan type, effective date, member status. Parameterization lets one test function cover many rows from a decision table instead of duplicating nearly identical tests.',
    practicalTakeaway:
      'I describe parametrize as "one test, many scenarios" tied to documented test data. It shows I think in tables and boundaries, not one-off happy paths.',
    relatedTopicIds: ['pytest-prep', 'eligibility-rules-engine'],
  },
  {
    id: 'why-sharding',
    title: 'Why sharding/parallelization matters',
    whyItMatters:
      'Long CI runs kill PR feedback. Sharding splits a suite across parallel jobs so wall-clock time drops without skipping coverage—developers actually wait for results.',
    practicalTakeaway:
      'I frame sharding as an incremental improvement when a suite slows down—not a day-one architecture project. Start with smoke on PR, shard the heavy suite on merge.',
    relatedTopicIds: ['cicd-automation-architecture', 'flaky-test-debugging'],
  },
  {
    id: 'why-eventual-consistency',
    title: 'Why eventual consistency causes flaky tests',
    whyItMatters:
      'Distributed systems—claims processing, eligibility updates—may not reflect writes immediately. Tests that assert too fast see intermittent failures that look like bugs but are timing issues.',
    practicalTakeaway:
      'I explain that I wait on observable conditions (status field, correlation ID in logs), not arbitrary sleeps. That shows root-cause thinking, not "rerun until green."',
    relatedTopicIds: ['flaky-test-debugging', 'logging-monitoring'],
  },
  {
    id: 'why-retry-timeouts',
    title: 'Why retries need timeouts',
    whyItMatters:
      'Retries without bounded timeouts can mask real failures or hang CI. A retry should mean "this condition may take a moment," not "run forever until it passes."',
    practicalTakeaway:
      'I use short, explicit timeouts on polling helpers and prefer fixing data or waits over retry decorators. Retries are a last resort with a ticket, not the default strategy.',
    relatedTopicIds: ['flaky-test-debugging', 'pytest-prep'],
  },
  {
    id: 'why-api-over-ui',
    title: 'Why API-level validation beats UI-only',
    whyItMatters:
      'API tests are faster, more stable, and closer to business logic—eligibility outcomes, claim status. UI tests are valuable for critical journeys but expensive to maintain when the backend is where risk lives.',
    practicalTakeaway:
      'I\'d automate at the API layer first for PBM workflows, then add UI smoke for what users actually see. That\'s practical coverage, not dismissing UI entirely.',
    relatedTopicIds: ['backend-api-testing', 'cicd-automation-architecture'],
  },
  {
    id: 'why-synthetic-data',
    title: 'Why synthetic data matters in healthcare',
    whyItMatters:
      'Production dumps expose PHI and create compliance risk. Synthetic personas with realistic plan patterns let teams reproduce scenarios reproducibly without legal or operational baggage.',
    practicalTakeaway:
      'I partner with devs on fixture libraries—deterministic IDs, documented personas—so nobody blocks on "can someone make me a test member?"',
    relatedTopicIds: ['test-data-strategy', 'sql-data-triage'],
  },
  {
    id: 'why-phi-safe',
    title: 'Why PHI-safe testing matters',
    whyItMatters:
      'CI logs, tickets, and Slack threads persist. A single unredacted member record in test output can become a HIPAA incident. Safe testing is part of quality, not overhead.',
    practicalTakeaway:
      'I redact by default, use synthetic IDs in assertions, and flag unredacted payloads in CI when the team supports it. I learn their sanitization conventions on day one.',
    relatedTopicIds: ['test-data-strategy', 'logging-monitoring', 'backend-api-testing'],
  },
  {
    id: 'why-test-tiers',
    title: 'Why test tiers matter in CI/CD',
    whyItMatters:
      'Not every test belongs on every commit. Tiers—unit, integration, smoke E2E, nightly—balance speed and confidence. Running a 45-minute suite on every push trains people to ignore CI.',
    practicalTakeaway:
      'I\'d map tiers to what each gate protects: PR speed vs. release confidence. I work within the existing pipeline and propose incremental tier splits where feedback is slow.',
    relatedTopicIds: ['cicd-automation-architecture', 'flaky-test-debugging'],
  },
];

import type { TechComparison } from '../../types/mentorContent';

export const techComparisons: TechComparison[] = [
  {
    id: 'fixture-vs-setup',
    title: 'Fixture vs setup()',
    left: 'PyTest Fixture',
    right: 'setup() / beforeEach',
    purpose: 'Both prepare test state — fixtures are PyTest-native and composable.',
    leftAdvantages: [
      'Composable via conftest.py',
      'Scoped (function/session/module)',
      'Discoverable by name in test signature',
    ],
    rightAdvantages: [
      'Familiar from xUnit frameworks',
      'Explicit in test file',
    ],
    leftDisadvantages: ['Hidden setup if overused', 'Learning curve for scopes'],
    rightDisadvantages: [
      'Copy-paste across files',
      'Harder to share across modules',
    ],
    whenToChooseLeft:
      'PyTest projects — especially shared auth, API clients, and test data.',
    whenToChooseRight:
      'Legacy suites already using setup hooks; migrate to fixtures incrementally.',
    relatedTopicIds: ['pytest-prep'],
  },
  {
    id: 'cloudwatch-vs-splunk',
    title: 'CloudWatch vs Splunk',
    left: 'CloudWatch',
    right: 'Splunk',
    purpose: 'Both investigate production and CI failures — different ecosystems.',
    leftAdvantages: [
      'Native on AWS',
      'Correlation IDs in Lambda/API logs',
      'Low friction for cloud-native teams',
    ],
    rightAdvantages: [
      'Rich dashboards across hybrid infra',
      'Powerful search for ops teams',
    ],
    leftDisadvantages: ['AWS-centric', 'Query learning curve'],
    rightDisadvantages: ['Licensing cost', 'Heavier for simple API triage'],
    whenToChooseLeft:
      'AWS-hosted APIs, Lambda debugging, CI artifacts with trace IDs.',
    whenToChooseRight:
      'Enterprise monitoring where ops already lives in Splunk dashboards.',
    relatedTopicIds: ['logging-monitoring'],
  },
  {
    id: 'playwright-vs-selenium',
    title: 'Playwright vs Selenium',
    left: 'Playwright',
    right: 'Selenium',
    purpose: 'Browser automation for UI tests — different maturity and CI fit.',
    leftAdvantages: [
      'Auto-waiting reduces flakiness',
      'Fast parallel sharding',
      'Modern API',
    ],
    rightAdvantages: [
      'Ubiquitous, large community',
      'Works with many language bindings',
    ],
    leftDisadvantages: ['Newer in enterprise', 'Team may need upskilling'],
    rightDisadvantages: [
      'More explicit waits needed',
      'Slower grids without careful tuning',
    ],
    whenToChooseLeft:
      'Greenfield UI automation, personal projects, CI speed matters.',
    whenToChooseRight:
      'Existing Selenium Grid investment — improve stability before rewriting.',
    relatedTopicIds: ['cicd-automation-architecture'],
  },
  {
    id: 'integration-vs-e2e',
    title: 'Integration vs End-to-End',
    left: 'Integration (API)',
    right: 'End-to-End (UI)',
    purpose: 'Different layers catch different bugs — QA Analyst II should articulate both.',
    leftAdvantages: [
      'Faster feedback',
      'Easier to stabilize',
      'Better for contract and auth testing',
    ],
    rightAdvantages: [
      'Validates full user journey',
      'Catches UI integration issues',
    ],
    leftDisadvantages: ['May miss UI-only bugs'],
    rightDisadvantages: ['Slower', 'Flakier', 'Harder to maintain'],
    whenToChooseLeft:
      'API-heavy PBM flows — eligibility, claims, auth — automate here first.',
    whenToChooseRight:
      'Critical member-facing journeys after API coverage exists.',
    relatedTopicIds: ['backend-api-testing', 'cicd-automation-architecture'],
  },
];

export function getTechComparisonsForTopic(topicId: string): TechComparison[] {
  return techComparisons.filter((c) => c.relatedTopicIds.includes(topicId));
}

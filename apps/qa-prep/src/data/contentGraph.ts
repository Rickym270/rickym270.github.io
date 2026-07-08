export const PROJECTS = [
  'medidata',
  'tradeweb',
  'personal-website',
  'xpress-transit',
  'other',
] as const;

export type ProjectId = (typeof PROJECTS)[number];

export const PROJECT_LABELS: Record<ProjectId, string> = {
  medidata: 'Medidata',
  tradeweb: 'Tradeweb',
  'personal-website': 'Personal Website',
  'xpress-transit': 'XPress Transit',
  other: 'Other',
};

export const topicStoryLinks: Record<string, string[]> = {
  'backend-api-testing': ['hipaa-api-validation', 'production-api-investigation'],
  'test-data-strategy': ['test-data-management'],
  'eligibility-rules-engine': ['test-data-management', 'hipaa-api-validation'],
  'pytest-prep': ['lambda-cold-start'],
  'flaky-test-debugging': ['lambda-cold-start', 'production-api-investigation'],
  'sql-data-triage': ['test-data-management', 'sql-claims-reconciliation'],
  'logging-monitoring': [
    'lambda-cold-start',
    'production-api-investigation',
    'splunk-dashboard',
  ],
  'behavioral-leadership': ['mentoring-developers', 'sole-qa-medidata'],
  'scrum-product-collaboration': [
    'xpress-transit-requirements',
    'formulary-sprint-coordination',
  ],
  'cicd-automation-architecture': [
    'playwright-ci-optimization',
    'tradeweb-networking-automation',
  ],
};

export function getStoriesForTopic(topicId: string): string[] {
  return topicStoryLinks[topicId] ?? [];
}

export function getMemorizeFirstStoryIds(): string[] {
  return [
    'lambda-cold-start',
    'test-data-management',
    'hipaa-api-validation',
    'playwright-ci-optimization',
    'xpress-transit-requirements',
    'mentoring-developers',
  ];
}

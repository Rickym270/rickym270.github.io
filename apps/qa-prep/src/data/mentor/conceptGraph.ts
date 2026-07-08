import type { ConceptGraphEdge, ConceptGraphNode } from '../../types/mentorContent';

export const conceptGraphNodes: ConceptGraphNode[] = [
  { id: 'fixtures', label: 'Fixtures', topicId: 'pytest-prep' },
  { id: 'parametrize', label: 'Parameterization', topicId: 'pytest-prep' },
  { id: 'pytest', label: 'PyTest', topicId: 'pytest-prep' },
  { id: 'test-data', label: 'Test Data', topicId: 'test-data-strategy' },
  { id: 'cicd', label: 'CI/CD', topicId: 'cicd-automation-architecture' },
  { id: 'flaky', label: 'Flaky Tests', topicId: 'flaky-test-debugging' },
  { id: 'cloudwatch', label: 'CloudWatch', topicId: 'logging-monitoring' },
  { id: 'splunk', label: 'Splunk', topicId: 'logging-monitoring' },
  { id: 'api-testing', label: 'API Testing', topicId: 'backend-api-testing' },
  { id: 'sql', label: 'SQL Triage', topicId: 'sql-data-triage' },
];

export const conceptGraphEdges: ConceptGraphEdge[] = [
  { from: 'fixtures', to: 'parametrize' },
  { from: 'parametrize', to: 'pytest' },
  { from: 'pytest', to: 'test-data' },
  { from: 'test-data', to: 'cicd' },
  { from: 'cicd', to: 'flaky' },
  { from: 'flaky', to: 'cloudwatch' },
  { from: 'cloudwatch', to: 'splunk' },
];

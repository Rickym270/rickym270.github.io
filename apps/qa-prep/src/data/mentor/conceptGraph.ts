import type { ConceptGraphEdge, ConceptGraphNode } from '../../types/mentorContent';

export const conceptGraphNodes: ConceptGraphNode[] = [
  { id: 'fixtures', label: 'Fixtures', topicId: 'pytest-prep' },
  { id: 'parametrize', label: 'Parameterization', topicId: 'pytest-prep' },
  { id: 'pytest', label: 'PyTest', topicId: 'pytest-prep' },
  { id: 'api-testing', label: 'API Testing', topicId: 'backend-api-testing' },
  { id: 'test-data', label: 'Test Data', topicId: 'test-data-strategy' },
  { id: 'eligibility', label: 'Eligibility Rules', topicId: 'eligibility-rules-engine' },
  { id: 'cicd', label: 'CI/CD', topicId: 'cicd-automation-architecture' },
  { id: 'flaky', label: 'Flaky Tests', topicId: 'flaky-test-debugging' },
  { id: 'cloudwatch', label: 'CloudWatch', topicId: 'logging-monitoring' },
  { id: 'splunk', label: 'Splunk', topicId: 'logging-monitoring' },
  { id: 'sql', label: 'SQL Triage', topicId: 'sql-data-triage' },
  { id: 'behavioral', label: 'Behavioral STAR', topicId: 'behavioral-leadership' },
  { id: 'scrum', label: 'Scrum & PM', topicId: 'scrum-product-collaboration' },
];

export const conceptGraphEdges: ConceptGraphEdge[] = [
  { from: 'fixtures', to: 'parametrize' },
  { from: 'parametrize', to: 'pytest' },
  { from: 'pytest', to: 'api-testing' },
  { from: 'api-testing', to: 'test-data' },
  { from: 'test-data', to: 'eligibility' },
  { from: 'test-data', to: 'cicd' },
  { from: 'cicd', to: 'flaky' },
  { from: 'flaky', to: 'cloudwatch' },
  { from: 'cloudwatch', to: 'splunk' },
  { from: 'sql', to: 'test-data' },
  { from: 'behavioral', to: 'scrum' },
  { from: 'scrum', to: 'test-data' },
];

export function getRelatedConceptIds(topicId: string): string[] {
  const node = conceptGraphNodes.find((n) => n.topicId === topicId);
  if (!node) return [topicId];

  const related = new Set<string>([node.id, topicId]);
  for (const edge of conceptGraphEdges) {
    if (edge.from === node.id) related.add(edge.to);
    if (edge.to === node.id) related.add(edge.from);
  }
  return [...related];
}

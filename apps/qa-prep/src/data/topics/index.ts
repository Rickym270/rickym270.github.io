import { backendApiTesting } from './backend-api-testing';
import { testDataStrategy } from './test-data-strategy';
import { eligibilityRulesEngine } from './eligibility-rules-engine';
import { pytestPrep } from './pytest-prep';
import { flakyTestDebugging } from './flaky-test-debugging';
import { sqlDataTriage } from './sql-data-triage';
import { loggingMonitoring } from './logging-monitoring';
import { behavioralLeadership } from './behavioral-leadership';
import { scrumProductCollaboration } from './scrum-product-collaboration';
import { cicdAutomationArchitecture } from './cicd-automation-architecture';
import type { Topic } from '../../types/topic';
import { CORE_TOPIC_IDS } from '../prepCatalog';

const topicMap: Record<string, Topic> = {
  'backend-api-testing': backendApiTesting,
  'test-data-strategy': testDataStrategy,
  'eligibility-rules-engine': eligibilityRulesEngine,
  'pytest-prep': pytestPrep,
  'flaky-test-debugging': flakyTestDebugging,
  'sql-data-triage': sqlDataTriage,
  'logging-monitoring': loggingMonitoring,
  'behavioral-leadership': behavioralLeadership,
  'scrum-product-collaboration': scrumProductCollaboration,
  'cicd-automation-architecture': cicdAutomationArchitecture,
};

export const topics = CORE_TOPIC_IDS.map((id) => topicMap[id]);

export {
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
};

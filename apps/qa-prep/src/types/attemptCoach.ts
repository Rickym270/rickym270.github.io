export type AttemptCoachAction = 'hint' | 'evaluate' | 'model-answer';

export type AttemptScoreBlock = {
  technicalAccuracy: number;
  qaReasoning: number;
  riskAnalysis: number;
  completeness: number;
  communication: number;
  healthcareDomainAwareness: number;
};

export type AttemptConceptItem = {
  concept: string;
  whyItMatters: string;
};

export type AttemptModelAnswerPackage = {
  concise60to90: string;
  detailedStrategy: string;
  conceptChecklist: AttemptConceptItem[];
};

export type AttemptComparisonRow = {
  area: string;
  myAnswer: string;
  modelAnswer: string;
  gap: string;
};

export type AttemptReinforcementQuestion = {
  question: string;
  referenceAnswer: string;
};

export type AttemptCoachContext = {
  topicId: string;
  topicTitle: string;
  referenceAnswer: string;
  compareBullets: string[];
  pitfalls: string[];
  solutionViewedBeforeAttempt: boolean;
};

export type AttemptCoachRequest = {
  action: AttemptCoachAction;
  question: string;
  userAnswer?: string;
  context: AttemptCoachContext;
};

export type AttemptCoachResponse = {
  hint?: string | null;
  scores?: AttemptScoreBlock | null;
  strengths?: string[] | null;
  missed?: string[] | null;
  inaccuracies?: string[] | null;
  structureTips?: string | null;
  lengthFeedback?: string | null;
  comparison?: AttemptComparisonRow[] | null;
  modelAnswer?: AttemptModelAnswerPackage | null;
  reinforcement?: AttemptReinforcementQuestion | null;
  technicallyCorrect?: boolean;
  highRiskCovered?: boolean;
  masteryEligible?: boolean;
};

export type AttemptCoachError = {
  status: number;
  message: string;
};

export const ATTEMPT_SCORE_LABELS: {
  key: keyof AttemptScoreBlock;
  label: string;
}[] = [
  { key: 'technicalAccuracy', label: 'Technical Accuracy' },
  { key: 'qaReasoning', label: 'QA Reasoning' },
  { key: 'riskAnalysis', label: 'Risk Analysis' },
  { key: 'completeness', label: 'Completeness' },
  { key: 'communication', label: 'Communication' },
  { key: 'healthcareDomainAwareness', label: 'Healthcare Domain Awareness' },
];

export function averageAttemptScore(scores: AttemptScoreBlock): number {
  const values = ATTEMPT_SCORE_LABELS.map(({ key }) => scores[key]);
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

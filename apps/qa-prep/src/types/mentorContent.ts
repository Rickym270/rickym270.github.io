import type { ProjectId } from '../data/contentGraph';

export type DecisionTreeNode = {
  question: string;
  yes: DecisionTreeNode | string;
  no: DecisionTreeNode | string;
};

export type LearnTheWhy = {
  plainEnglish: string;
  technical: {
    what: string;
    why: string;
    how: string;
    whenUse: string;
    whenNot: string;
    asciiDiagram?: string;
  };
  interviewAnswer: {
    script60s: string;
    whatTheyEvaluate: string;
    whyItScores: string;
  };
  myExperience: {
    connections: string[];
    storyIds?: string[];
    projectIds?: ProjectId[];
  };
};

export type CostBenefit = {
  benefits: string[];
  costs: string[];
  tradeoffs: string[];
  commonMistakes: string[];
  performance: string[];
  maintainability: string[];
};

export type InterviewExpectations = {
  junior: string;
  mid: string;
  analystII: string;
  senior: string;
};

export type InterviewerMind = {
  whyAsking: string;
  whatTheyLearn: string;
  tooJunior: string;
  overqualified: string;
  strongAnalystII: string;
};

export type MemoryAnchor = {
  phrase: string;
  storyId?: string;
};

export type TopicMentorProfile = {
  topicId: string;
  memoryAnchor: MemoryAnchor;
  learnTheWhy: LearnTheWhy;
  costBenefit: CostBenefit;
  decisionTrees: DecisionTreeNode[];
  healthcareContext: string[];
  interviewExpectations: InterviewExpectations;
  interviewerMind: InterviewerMind;
  relatedConceptIds: string[];
  isStub?: boolean;
};

export type ConceptGraphNode = {
  id: string;
  label: string;
  topicId?: string;
};

export type ConceptGraphEdge = {
  from: string;
  to: string;
};

export type TechComparison = {
  id: string;
  title: string;
  left: string;
  right: string;
  purpose: string;
  leftAdvantages: string[];
  rightAdvantages: string[];
  leftDisadvantages: string[];
  rightDisadvantages: string[];
  whenToChooseLeft: string;
  whenToChooseRight: string;
  relatedTopicIds: string[];
};

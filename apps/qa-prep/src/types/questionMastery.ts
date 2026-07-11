export type QuestionMasteryRecord = {
  questionKey: string;
  topicId: string;
  mastered: boolean;
  solutionViewedBeforeAttempt: boolean;
  lastScoreAvg?: number;
  reinforcementPassed?: boolean;
  updatedAt: number;
};

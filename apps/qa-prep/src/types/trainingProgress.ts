export type ConfidenceLevel =
  | 'cold'
  | 'with-hints'
  | 'reasoned-through'
  | 'needs-review';

export type CommunicationClarity =
  | 'clear'
  | 'too-technical'
  | 'too-vague'
  | 'too-long'
  | 'too-short'
  | 'rambling';

export type AttemptRecord = {
  questionKey: string;
  topicId: string;
  confidence: ConfidenceLevel;
  rubricAvg?: number;
  elapsedSec?: number;
  answeredQuestion?: 'yes' | 'partially' | 'no';
  communication?: CommunicationClarity;
  selectedProject?: string;
  timestamp: number;
};

export type TrainingProgress = {
  attempts: AttemptRecord[];
};

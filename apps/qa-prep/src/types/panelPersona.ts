export type PanelQuestion = {
  id: string;
  topicId: string;
  question: string;
  followUps: string[];
  strongAnswerIncludes: string[];
  sampleAnswer: string;
  followUpSampleAnswer?: string;
  stretchFollowUp?: { question: string; sampleAnswer: string };
  advancedProbe?: { question: string; sampleAnswer: string };
};

export type PanelInterviewer = {
  name: string;
  focusSummary: string;
  watchFor: string[];
};

export type InterviewRound = {
  id: 'round-1' | 'round-2' | 'round-3';
  interviewer: PanelInterviewer;
  title: string;
  duration: string;
  focusAreas: string[];
  questions: PanelQuestion[];
};

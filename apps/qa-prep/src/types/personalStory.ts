export type ProjectId =
  | 'medidata'
  | 'tradeweb'
  | 'personal-website'
  | 'xpress-transit'
  | 'other';

export type PersonalStory = {
  id: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  bestQuestionFor: string;
  projectId?: ProjectId;
  relatedTopicIds?: string[];
  memorizePriority?: number;
  isBonus?: boolean;
  lessonsLearned?: string;
  judiHealthRelevance?: string;
  likelyFollowUps?: string[];
};

export type RubricLevel = 1 | 3 | 5;

export type RubricCategoryCriteria = {
  category: string;
  score1: string;
  score3: string;
  score5: string;
};

export type ScoringRubric = {
  topicId: string;
  categories: RubricCategoryCriteria[];
};

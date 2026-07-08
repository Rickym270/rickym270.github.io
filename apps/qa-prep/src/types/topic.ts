export type Flashcard = {
  front: string;
  back: string;
};

export type Topic = {
  id: string;
  title: string;
  flashcards: Flashcard[];
  mockQuestions: string[];
  sampleAnswers: string[];
  strongAnswerBullets: string[];
  commonPitfalls: string[];
  followUpQuestions: string[];
  followUpSampleAnswers: string[];
};

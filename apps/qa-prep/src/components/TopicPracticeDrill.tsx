import { useState } from 'react';
import type { Topic } from '../types/topic';
import type { ScoringRubric as RubricData } from '../types/scoringRubric';
import { RetrievalDrill } from './retrieval/RetrievalDrill';

type TopicPracticeDrillProps = {
  topic: Topic;
  rubric?: RubricData;
};

export function TopicPracticeDrill({ topic, rubric }: TopicPracticeDrillProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [drillKey, setDrillKey] = useState(0);

  const mockQuestion = topic.mockQuestions[questionIndex] ?? '';
  const sampleAnswer = topic.sampleAnswers[questionIndex] ?? '';
  const followUpIndex = questionIndex % topic.followUpQuestions.length;
  const stretchQ = topic.followUpQuestions[followUpIndex];
  const stretchA = topic.followUpSampleAnswers[followUpIndex];

  return (
    <RetrievalDrill
      key={drillKey}
      questionKey={`topic:${topic.id}:q${questionIndex}`}
      topicId={topic.id}
      question={mockQuestion}
      modelAnswer={sampleAnswer}
      compareBullets={topic.strongAnswerBullets}
      pitfalls={topic.commonPitfalls}
      rubric={rubric}
      stretchQuestion={stretchQ}
      stretchAnswer={stretchA}
      questionNum={questionIndex + 1}
      totalQuestions={topic.mockQuestions.length}
      onNext={() => {
        if (questionIndex < topic.mockQuestions.length - 1) {
          setQuestionIndex((i) => i + 1);
          setDrillKey((k) => k + 1);
        }
      }}
      onPrev={() => {
        if (questionIndex > 0) {
          setQuestionIndex((i) => i - 1);
          setDrillKey((k) => k + 1);
        }
      }}
      canPrev={questionIndex > 0}
      isLast={questionIndex >= topic.mockQuestions.length - 1}
      completeMessage="You finished all questions for this topic. Switch to Study mode to review, or pick another topic."
    />
  );
}

import { useState } from 'react';
import type { Topic } from '../types/topic';
import type { ScoringRubric as RubricData } from '../types/scoringRubric';
import { AttemptFirstDrill } from './attempt-first/AttemptFirstDrill';

type TopicPracticeDrillProps = {
  topic: Topic;
  rubric?: RubricData;
};

export function TopicPracticeDrill({ topic, rubric: _rubric }: TopicPracticeDrillProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [drillKey, setDrillKey] = useState(0);

  const mockQuestion = topic.mockQuestions[questionIndex] ?? '';
  const sampleAnswer = topic.sampleAnswers[questionIndex] ?? '';
  const answerBullets =
    topic.sampleAnswerBullets[questionIndex] ?? topic.strongAnswerBullets;

  return (
    <AttemptFirstDrill
      key={drillKey}
      questionKey={`topic:${topic.id}:q${questionIndex}`}
      topicId={topic.id}
      topicTitle={topic.title}
      question={mockQuestion}
      referenceAnswer={sampleAnswer}
      compareBullets={answerBullets}
      pitfalls={topic.commonPitfalls}
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

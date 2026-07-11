import { useState } from 'react';
import { AttemptFirstDrill } from './AttemptFirstDrill';

type AttemptFirstQuestionCardProps = {
  questionKey: string;
  topicId: string;
  topicTitle: string;
  question: string;
  referenceAnswer: string;
  compareBullets?: string[];
  pitfalls?: string[];
  label?: string;
};

export function AttemptFirstQuestionCard({
  questionKey,
  topicId,
  topicTitle,
  question,
  referenceAnswer,
  compareBullets = [],
  pitfalls = [],
  label,
}: AttemptFirstQuestionCardProps) {
  const [drillKey, setDrillKey] = useState(0);

  return (
    <div className="attempt-first-card">
      {label && <p className="attempt-first-card__label">{label}</p>}
      <AttemptFirstDrill
        key={drillKey}
        questionKey={questionKey}
        topicId={topicId}
        topicTitle={topicTitle}
        question={question}
        referenceAnswer={referenceAnswer}
        compareBullets={compareBullets}
        pitfalls={pitfalls}
        compact
        isLast
        onNext={() => setDrillKey((k) => k + 1)}
        completeMessage="Question complete. Try another or switch to Train for the full flow."
      />
    </div>
  );
}

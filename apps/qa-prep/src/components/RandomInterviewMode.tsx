import { useState } from 'react';
import { shufflePool } from '../data/questionPool';
import { AttemptFirstDrill } from './attempt-first/AttemptFirstDrill';

type RandomInterviewModeProps = {
  onExit?: () => void;
  topicFilter?: string[];
};

export function RandomInterviewMode({
  onExit,
  topicFilter,
}: RandomInterviewModeProps) {
  const [pool] = useState(() => shufflePool(undefined, topicFilter));
  const [index, setIndex] = useState(0);
  const [drillKey, setDrillKey] = useState(0);
  const [started, setStarted] = useState(false);

  const question = pool[index];

  if (!started) {
    return (
      <article className="topic-detail random-interview">
        <div className="random-interview__header">
          <h2 className="topic-detail__title">
            {topicFilter?.length ? 'Review Session' : 'Random Interview'}
          </h2>
          {onExit && (
            <button type="button" className="panel-mode__exit" onClick={onExit}>
              Exit
            </button>
          )}
        </div>
        <p className="random-interview__intro">
          {topicFilter?.length
            ? 'Focused shuffle across your weak or due topics. Story recommendations and follow-up chains run before reveal.'
            : 'Cross-topic shuffle across backend, behavioral, SQL, CloudWatch, CI/CD, PyTest, healthcare, and flaky-test questions.'}
        </p>
        <p className="random-interview__count">
          {pool.length} questions in this session
        </p>
        <button
          type="button"
          className="practice-cta"
          onClick={() => setStarted(true)}
          disabled={pool.length === 0}
        >
          {pool.length === 0 ? 'No questions for selected topics' : 'Start session'}
        </button>
      </article>
    );
  }

  if (!question) return null;

  return (
    <div className="random-interview">
      <div className="random-interview__header">
        <span className="random-interview__category">{question.category}</span>
        {onExit && (
          <button type="button" className="panel-mode__exit" onClick={onExit}>
            Exit
          </button>
        )}
      </div>
      <AttemptFirstDrill
        key={drillKey}
        questionKey={question.id}
        topicId={question.topicId}
        topicTitle={question.category}
        question={question.question}
        referenceAnswer={question.modelAnswer}
        compareBullets={question.compareBullets}
        pitfalls={question.pitfalls}
        questionNum={index + 1}
        totalQuestions={pool.length}
        onNext={() => {
          if (index < pool.length - 1) {
            setIndex((i) => i + 1);
            setDrillKey((k) => k + 1);
          }
        }}
        onPrev={() => {
          if (index > 0) {
            setIndex((i) => i - 1);
            setDrillKey((k) => k + 1);
          }
        }}
        canPrev={index > 0}
        isLast={index >= pool.length - 1}
        completeMessage="Session complete. Review weak spots or run another round."
      />
    </div>
  );
}

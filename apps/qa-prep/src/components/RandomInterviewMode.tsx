import { useMemo, useState } from 'react';
import { shufflePool } from '../data/questionPool';
import { scoringRubrics } from '../data/scoringRubrics';
import { RetrievalDrill } from './retrieval/RetrievalDrill';

type RandomInterviewModeProps = {
  onExit?: () => void;
};

export function RandomInterviewMode({ onExit }: RandomInterviewModeProps) {
  const [pool] = useState(() => shufflePool());
  const [index, setIndex] = useState(0);
  const [drillKey, setDrillKey] = useState(0);
  const [started, setStarted] = useState(false);

  const question = pool[index];
  const rubric = useMemo(
    () =>
      question
        ? scoringRubrics.find((r) => r.topicId === question.topicId)
        : undefined,
    [question]
  );

  if (!started) {
    return (
      <article className="topic-detail random-interview">
        <div className="random-interview__header">
          <h2 className="topic-detail__title">Random Interview</h2>
          {onExit && (
            <button type="button" className="panel-mode__exit" onClick={onExit}>
              Exit
            </button>
          )}
        </div>
        <p className="random-interview__intro">
          Cross-topic shuffle across backend, behavioral, SQL, CloudWatch,
          CI/CD, PyTest, healthcare, and flaky-test questions. Answer together
          first — no hints until reveal.
        </p>
        <p className="random-interview__count">
          {pool.length} questions in this session
        </p>
        <button
          type="button"
          className="practice-cta"
          onClick={() => setStarted(true)}
        >
          Start random interview
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
      <RetrievalDrill
        key={drillKey}
        questionKey={question.id}
        topicId={question.topicId}
        question={question.question}
        modelAnswer={question.modelAnswer}
        compareBullets={question.compareBullets}
        pitfalls={question.pitfalls}
        rubric={rubric}
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
        completeMessage="Random interview complete. Run again for a new shuffle or review weak spots."
      />
    </div>
  );
}

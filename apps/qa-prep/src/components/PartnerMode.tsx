import { useEffect, useState } from 'react';
import { buildPartnerSession } from '../data/questionPool';
import { ContentSection } from './ContentSection';
import { PartnerPointChecklist } from './PartnerPointChecklist';

type PartnerModeProps = {
  onExit?: () => void;
};

function emptyChecked(length: number): boolean[] {
  return Array.from({ length }, () => false);
}

export function PartnerMode({ onExit }: PartnerModeProps) {
  const [sessionPool, setSessionPool] = useState(() => buildPartnerSession());
  const [index, setIndex] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [checked, setChecked] = useState<boolean[]>([]);

  const question = sessionPool[index];
  const total = sessionPool.length;

  useEffect(() => {
    if (!question) return;
    setChecked(emptyChecked(question.answerBullets.length));
  }, [question?.id, question?.answerBullets.length]);

  if (!question) {
    return (
      <article className="partner-mode">
        <p>No questions available.</p>
      </article>
    );
  }

  const checkedForQuestion =
    checked.length === question.answerBullets.length
      ? checked
      : emptyChecked(question.answerBullets.length);

  function togglePoint(pointIndex: number) {
    setChecked((prev) => {
      const base =
        prev.length === question.answerBullets.length
          ? prev
          : emptyChecked(question.answerBullets.length);
      return base.map((value, i) => (i === pointIndex ? !value : value));
    });
  }

  function clearPoints() {
    setChecked(emptyChecked(question.answerBullets.length));
  }

  function reshuffle() {
    setSessionPool(buildPartnerSession());
    setIndex(0);
  }

  function goPrev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  function goNext() {
    setIndex((i) => Math.min(total - 1, i + 1));
  }

  return (
    <article className="partner-mode">
      <div className="partner-mode__header">
        <div>
          <h2 className="partner-mode__title">Partner Mode</h2>
          <p className="partner-mode__meta">
            <span className="partner-mode__progress">
              Question {index + 1} of {total}
            </span>
            <span className="partner-mode__category">{question.category}</span>
          </p>
        </div>
        <div className="partner-mode__controls">
          <label className="partner-mode__toggle">
            <input
              type="checkbox"
              checked={showAnswers}
              onChange={(e) => setShowAnswers(e.target.checked)}
            />
            Show answers
          </label>
          <button
            type="button"
            className="practice-drill__secondary"
            onClick={reshuffle}
          >
            Shuffle
          </button>
          {onExit && (
            <button type="button" className="panel-mode__exit" onClick={onExit}>
              Exit
            </button>
          )}
        </div>
      </div>

      <ContentSection title="Question">
        <p className="partner-mode__question">{question.question}</p>
      </ContentSection>

      {showAnswers ? (
        <ContentSection title="Answer — grade points covered">
          <PartnerPointChecklist
            bullets={question.answerBullets}
            checked={checkedForQuestion}
            onToggle={togglePoint}
            onClear={clearPoints}
          />
        </ContentSection>
      ) : (
        <p className="partner-mode__hidden-hint">
          Answers are hidden. Turn on &ldquo;Show answers&rdquo; to read the
          bullet script aloud and check off points you covered.
        </p>
      )}

      <div className="partner-mode__nav">
        <button
          type="button"
          className="practice-drill__secondary"
          onClick={goPrev}
          disabled={index === 0}
        >
          Previous
        </button>
        <button
          type="button"
          className="practice-cta"
          onClick={goNext}
          disabled={index >= total - 1}
        >
          Next
        </button>
      </div>
    </article>
  );
}

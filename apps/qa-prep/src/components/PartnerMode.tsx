import { useState } from 'react';
import { questionPool } from '../data/questionPool';
import { ContentSection } from './ContentSection';

type PartnerModeProps = {
  onExit?: () => void;
};

export function PartnerMode({ onExit }: PartnerModeProps) {
  const [index, setIndex] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);

  const question = questionPool[index];
  const total = questionPool.length;

  if (!question) {
    return (
      <article className="partner-mode">
        <p>No questions available.</p>
      </article>
    );
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
            Question {index + 1} of {total} · {question.category}
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
        <ContentSection title="Answer">
          <ol className="partner-mode__bullets topic-list-styled">
            {question.answerBullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ol>
        </ContentSection>
      ) : (
        <p className="partner-mode__hidden-hint">
          Answers are hidden. Turn on &ldquo;Show answers&rdquo; to read the
          bullet script aloud.
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

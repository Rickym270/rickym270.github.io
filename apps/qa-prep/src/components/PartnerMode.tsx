import { useEffect, useState } from 'react';
import { buildPartnerSession } from '../data/questionPool';
import { useIsMobile } from '../hooks/useIsMobile';
import { useStudyHelper } from '../context/StudyHelperContext';
import { ContentSection } from './ContentSection';
import { PartnerPointChecklist } from './PartnerPointChecklist';
import {
  PartnerSessionNav,
  truncateQuestionPreview,
} from './PartnerSessionNav';

type PartnerModeProps = {
  onExit?: () => void;
};

function emptyChecked(length: number): boolean[] {
  return Array.from({ length }, () => false);
}

export function PartnerMode({ onExit }: PartnerModeProps) {
  const isMobile = useIsMobile();
  const { setStudyFocus } = useStudyHelper();
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

  useEffect(() => {
    if (!question) return;
    setStudyFocus({
      topicId: question.topicId,
      topicTitle: question.category,
      mode: 'partner',
      currentQuestion: question.question,
    });
  }, [question, setStudyFocus]);

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

  function selectQuestion(nextIndex: number) {
    setIndex(nextIndex);
  }

  function toggleGradingScript() {
    setShowAnswers((value) => !value);
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

      <div className="partner-mode__body">
        <PartnerSessionNav
          sessionPool={sessionPool}
          currentIndex={index}
          onSelect={selectQuestion}
          variant={isMobile ? 'collapsible' : 'rail'}
        />

        <div className="partner-mode__main">
          {showAnswers && (
            <div className="partner-mode__question-sticky" aria-live="polite">
              Question {index + 1} of {total} ·{' '}
              {truncateQuestionPreview(question.question)}
            </div>
          )}

          <div className="partner-mode__columns">
            <div className="partner-mode__question-col">
              <ContentSection title="Question">
                <p className="partner-mode__question">{question.question}</p>
              </ContentSection>

              <button
                type="button"
                className="practice-cta partner-mode__grading-toggle"
                onClick={toggleGradingScript}
                aria-pressed={showAnswers}
              >
                {showAnswers ? 'Hide grading script' : 'Show grading script'}
              </button>

              {!showAnswers && (
                <p className="partner-mode__hidden-hint">
                  Tap <strong>Show grading script</strong> to read bullet points
                  aloud and check off points covered.
                </p>
              )}
            </div>

            {showAnswers && (
              <div className="partner-mode__answers-col">
                <ContentSection title="Answer — grade points covered">
                  <PartnerPointChecklist
                    bullets={question.answerBullets}
                    checked={checkedForQuestion}
                    onToggle={togglePoint}
                    onClear={clearPoints}
                  />
                </ContentSection>
              </div>
            )}
          </div>

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
        </div>
      </div>
    </article>
  );
}

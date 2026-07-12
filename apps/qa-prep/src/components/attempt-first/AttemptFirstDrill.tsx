import { useCallback, useMemo, useState } from 'react';
import { callAttemptCoach } from '../../data/attemptCoachApi';
import type {
  AttemptCoachError,
  AttemptCoachResponse,
  AttemptModelAnswerPackage,
  AttemptReinforcementQuestion,
} from '../../types/attemptCoach';
import { averageAttemptScore } from '../../types/attemptCoach';
import { useQuestionMastery } from '../../hooks/useQuestionMastery';
import { useTrainingProgress } from '../../hooks/useTrainingProgress';
import { ContentSection } from '../ContentSection';
import { WhyButton } from '../mentor/WhyButton';
import { AttemptFeedbackPanel } from './AttemptFeedbackPanel';
import { AttemptModelAnswerReveal } from './AttemptModelAnswerReveal';

export type AttemptFirstDrillProps = {
  questionKey: string;
  topicId: string;
  topicTitle: string;
  question: string;
  referenceAnswer: string;
  compareBullets?: string[];
  pitfalls?: string[];
  questionNum?: number;
  totalQuestions?: number;
  onNext?: () => void;
  onPrev?: () => void;
  canPrev?: boolean;
  isLast?: boolean;
  completeMessage?: string;
  compact?: boolean;
};

type Phase =
  | 'attempt'
  | 'evaluating'
  | 'feedback'
  | 'explain-own-words'
  | 'reinforcement';

function buildCoachContext(
  topicId: string,
  topicTitle: string,
  referenceAnswer: string,
  compareBullets: string[],
  pitfalls: string[],
  solutionViewedBeforeAttempt: boolean
) {
  return {
    topicId,
    topicTitle,
    referenceAnswer,
    compareBullets,
    pitfalls,
    solutionViewedBeforeAttempt,
  };
}

function buildLocalModelAnswer(
  referenceAnswer: string,
  compareBullets: string[]
): AttemptModelAnswerPackage {
  const concise = referenceAnswer.trim();
  return {
    concise60to90: concise,
    detailedStrategy: concise,
    conceptChecklist: compareBullets.map((bullet) => ({
      concept: bullet,
      whyItMatters: 'Key point interviewers listen for in your answer.',
    })),
  };
}

export function AttemptFirstDrill({
  questionKey,
  topicId,
  topicTitle,
  question,
  referenceAnswer,
  compareBullets = [],
  pitfalls = [],
  questionNum,
  totalQuestions,
  onNext,
  onPrev,
  canPrev = false,
  isLast = false,
  completeMessage,
  compact = false,
}: AttemptFirstDrillProps) {
  const { recordAttempt } = useTrainingProgress();
  const { getMastery, updateMastery } = useQuestionMastery();

  const [phase, setPhase] = useState<Phase>('attempt');
  const [activeQuestion, setActiveQuestion] = useState(question);
  const [activeReference, setActiveReference] = useState(referenceAnswer);
  const [activeQuestionKey, setActiveQuestionKey] = useState(questionKey);
  const [isReinforcement, setIsReinforcement] = useState(false);

  const [userAnswer, setUserAnswer] = useState('');
  const [ownWordsAnswer, setOwnWordsAnswer] = useState('');
  const [hints, setHints] = useState<string[]>([]);
  const [solutionViewedBeforeAttempt, setSolutionViewedBeforeAttempt] =
    useState(false);
  const [modelAnswer, setModelAnswer] = useState<AttemptModelAnswerPackage | null>(
    null
  );
  const [modelAnswerOpen, setModelAnswerOpen] = useState(false);
  const [evaluation, setEvaluation] = useState<AttemptCoachResponse | null>(null);
  const [reinforcement, setReinforcement] =
    useState<AttemptReinforcementQuestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<'hint' | 'submit' | 'skip' | 'reveal' | null>(
    null
  );

  const mastery = getMastery(activeQuestionKey);

  const coachContext = useMemo(
    () =>
      buildCoachContext(
        topicId,
        topicTitle,
        activeReference,
        compareBullets,
        pitfalls,
        solutionViewedBeforeAttempt
      ),
    [
      topicId,
      topicTitle,
      activeReference,
      compareBullets,
      pitfalls,
      solutionViewedBeforeAttempt,
    ]
  );

  const resetForReinforcement = useCallback(
    (next: AttemptReinforcementQuestion) => {
      setActiveQuestion(next.question);
      setActiveReference(next.referenceAnswer);
      setActiveQuestionKey(`${questionKey}:reinforcement`);
      setIsReinforcement(true);
      setPhase('attempt');
      setUserAnswer('');
      setOwnWordsAnswer('');
      setHints([]);
      setSolutionViewedBeforeAttempt(false);
      setModelAnswer(null);
      setModelAnswerOpen(false);
      setEvaluation(null);
      setError(null);
      setBusy(null);
    },
    [questionKey]
  );

  function applyLocalModelAnswer(): AttemptModelAnswerPackage | null {
    if (!activeReference.trim()) {
      return null;
    }
    const local = buildLocalModelAnswer(activeReference, compareBullets);
    setModelAnswer(local);
    return local;
  }

  async function fetchModelAnswer() {
    try {
      const response = await callAttemptCoach({
        action: 'model-answer',
        question: activeQuestion,
        context: coachContext,
      });
      if (response.modelAnswer) {
        setModelAnswer(response.modelAnswer);
        return response.modelAnswer;
      }
    } catch {
      // Fall through to bundled answer.
    }

    return applyLocalModelAnswer();
  }

  async function upgradeModelAnswerFromApi() {
    try {
      const response = await callAttemptCoach({
        action: 'model-answer',
        question: activeQuestion,
        context: coachContext,
      });
      if (response.modelAnswer) {
        setModelAnswer(response.modelAnswer);
      }
    } catch {
      // Bundled answer already visible.
    }
  }

  async function handleHint() {
    if (busy) return;
    setBusy('hint');
    setError(null);
    try {
      const response = await callAttemptCoach({
        action: 'hint',
        question: activeQuestion,
        context: coachContext,
      });
      if (response.hint) {
        setHints((prev) => [...prev, response.hint!]);
      }
    } catch (err) {
      const coachError = err as AttemptCoachError;
      setError(coachError.message || 'Could not fetch a hint.');
    } finally {
      setBusy(null);
    }
  }

  async function handleRevealModelAnswer() {
    if (busy) return;
    if (!solutionViewedBeforeAttempt && phase === 'attempt' && !evaluation) {
      setSolutionViewedBeforeAttempt(true);
      updateMastery(activeQuestionKey, topicId, {
        solutionViewedBeforeAttempt: true,
      });
    }
    setModelAnswerOpen(true);
    setError(null);

    const local = applyLocalModelAnswer();

    if (!local) {
      setBusy('reveal');
      try {
        const result = await fetchModelAnswer();
        if (!result) {
          setError('Could not load model answer.');
        }
      } catch (err) {
        const coachError = err as AttemptCoachError;
        setError(coachError.message || 'Could not load model answer.');
      } finally {
        setBusy(null);
      }
      return;
    }

    setBusy('reveal');
    try {
      await upgradeModelAnswerFromApi();
    } finally {
      setBusy(null);
    }
  }

  async function handleSkip() {
    if (busy) return;
    setSolutionViewedBeforeAttempt(true);
    setModelAnswerOpen(true);
    updateMastery(activeQuestionKey, topicId, {
      solutionViewedBeforeAttempt: true,
    });
    setError(null);

    const local = applyLocalModelAnswer();
    if (!local) {
      setBusy('skip');
      try {
        const result = await fetchModelAnswer();
        if (!result) {
          setError('Could not load model answer.');
        }
      } catch (err) {
        const coachError = err as AttemptCoachError;
        setError(coachError.message || 'Could not load model answer.');
      } finally {
        setBusy(null);
      }
      return;
    }

    setBusy('skip');
    try {
      await upgradeModelAnswerFromApi();
    } finally {
      setBusy(null);
    }
  }

  async function handleSubmit() {
    if (busy || !userAnswer.trim()) return;
    setPhase('evaluating');
    setBusy('submit');
    setError(null);

    try {
      const response = await callAttemptCoach({
        action: 'evaluate',
        question: activeQuestion,
        userAnswer: userAnswer.trim(),
        context: coachContext,
      });
      setEvaluation(response);
      if (response.modelAnswer) {
        setModelAnswer(response.modelAnswer);
      }
      if (response.reinforcement) {
        setReinforcement(response.reinforcement);
      }

      const scoreAvg = response.scores
        ? averageAttemptScore(response.scores)
        : undefined;

      recordAttempt({
        questionKey: activeQuestionKey,
        topicId,
        confidence: solutionViewedBeforeAttempt
          ? 'with-hints'
          : scoreAvg && scoreAvg >= 7
            ? 'reasoned-through'
            : 'needs-review',
        rubricAvg: scoreAvg ? scoreAvg / 2 : undefined,
        userAnswer: userAnswer.trim(),
        attemptScores: response.scores ?? undefined,
        solutionViewedBeforeAttempt,
        mastered: false,
      });

      updateMastery(activeQuestionKey, topicId, {
        solutionViewedBeforeAttempt,
        lastScoreAvg: scoreAvg,
        reinforcementPassed: false,
        mastered:
          !solutionViewedBeforeAttempt &&
          !isReinforcement &&
          Boolean(response.masteryEligible),
      });

      if (solutionViewedBeforeAttempt) {
        setPhase('explain-own-words');
      } else {
        setPhase('feedback');
      }
    } catch (err) {
      const coachError = err as AttemptCoachError;
      setError(coachError.message || 'Could not evaluate your answer.');
      setPhase('attempt');
    } finally {
      setBusy(null);
    }
  }

  function handleContinueFromFeedback() {
    if (reinforcement && !isReinforcement) {
      resetForReinforcement(reinforcement);
      return;
    }
    if (onNext && !isLast) {
      onNext();
    }
  }

  function handleGoToNext() {
    if (onNext && !isLast) {
      onNext();
    }
  }

  const canGoNext = Boolean(onNext && !isLast);

  async function handleReinforcementSubmit() {
    if (busy || !userAnswer.trim()) return;
    setPhase('evaluating');
    setBusy('submit');
    setError(null);

    try {
      const response = await callAttemptCoach({
        action: 'evaluate',
        question: activeQuestion,
        userAnswer: userAnswer.trim(),
        context: buildCoachContext(
          topicId,
          topicTitle,
          activeReference,
          compareBullets,
          pitfalls,
          solutionViewedBeforeAttempt
        ),
      });

      const passed =
        !solutionViewedBeforeAttempt &&
        Boolean(response.technicallyCorrect) &&
        Boolean(response.highRiskCovered);

      if (passed) {
        updateMastery(questionKey, topicId, {
          mastered: true,
          reinforcementPassed: true,
          solutionViewedBeforeAttempt: false,
        });
        recordAttempt({
          questionKey,
          topicId,
          confidence: 'reasoned-through',
          rubricAvg: response.scores
            ? averageAttemptScore(response.scores) / 2
            : undefined,
          userAnswer: userAnswer.trim(),
          attemptScores: response.scores ?? undefined,
          solutionViewedBeforeAttempt: false,
          mastered: true,
        });
      }

      setEvaluation(response);
      setPhase('feedback');
    } catch (err) {
      const coachError = err as AttemptCoachError;
      setError(coachError.message || 'Could not evaluate reinforcement answer.');
      setPhase('attempt');
    } finally {
      setBusy(null);
    }
  }

  const primaryDisabled =
    busy !== null ||
    (phase === 'attempt' && !userAnswer.trim()) ||
    (phase === 'explain-own-words' && !ownWordsAnswer.trim());

  const primaryLabel =
    phase === 'attempt'
      ? isReinforcement
        ? 'Submit reinforcement answer'
        : 'Submit Answer'
      : phase === 'explain-own-words'
        ? 'Continue to reinforcement'
        : phase === 'feedback'
          ? reinforcement && !isReinforcement
            ? 'Try reinforcement question'
            : isLast
              ? 'Done'
              : 'Next question'
          : 'Continue';

  function handlePrimary() {
    if (phase === 'attempt') {
      if (isReinforcement) {
        void handleReinforcementSubmit();
      } else {
        void handleSubmit();
      }
      return;
    }
    if (phase === 'explain-own-words') {
      if (reinforcement) {
        resetForReinforcement(reinforcement);
      } else {
        handleContinueFromFeedback();
      }
      return;
    }
    if (phase === 'feedback') {
      handleContinueFromFeedback();
    }
  }

  return (
    <div
      className={`attempt-first ${compact ? 'attempt-first--compact' : ''}`}
    >
      {questionNum !== undefined && totalQuestions !== undefined && (
        <div className="practice-drill__meta">
          Question {questionNum} of {totalQuestions}
          {isReinforcement && ' · Reinforcement'}
        </div>
      )}

      {mastery?.mastered && (
        <p className="attempt-first__badge attempt-first__badge--success">
          Mastered — answered without revealing the solution first.
        </p>
      )}

      {(phase === 'attempt' || phase === 'evaluating') && (
        <ContentSection title="Interview Question">
          <p className="practice-drill__question">{activeQuestion}</p>
          {!compact && (
            <WhyButton
              topicId={topicId}
              questionKey={activeQuestionKey}
              question={activeQuestion}
            />
          )}

          {solutionViewedBeforeAttempt && (
            <p className="attempt-first__badge attempt-first__badge--warning">
              Solution viewed before attempt
            </p>
          )}

          {hints.length > 0 && (
            <div className="attempt-first__hints">
              {hints.map((hint, index) => (
                <p key={`${hint}-${index}`} className="attempt-first__hint">
                  <strong>Hint {index + 1}:</strong> {hint}
                </p>
              ))}
            </div>
          )}

          <label className="attempt-first__label" htmlFor={`${activeQuestionKey}-answer`}>
            Your answer
          </label>
          <textarea
            id={`${activeQuestionKey}-answer`}
            className="attempt-first__textarea"
            rows={compact ? 4 : 6}
            value={userAnswer}
            onChange={(event) => setUserAnswer(event.target.value)}
            placeholder="Type your answer before revealing the model response…"
            disabled={phase === 'evaluating'}
          />

          <div className="attempt-first__attempt-actions">
            <button
              type="button"
              className="practice-cta"
              onClick={handlePrimary}
              disabled={primaryDisabled}
            >
              {phase === 'evaluating' ? 'Evaluating…' : primaryLabel}
            </button>
            <button
              type="button"
              className="practice-drill__secondary"
              onClick={() => void handleHint()}
              disabled={busy !== null || phase === 'evaluating'}
            >
              {busy === 'hint' ? 'Loading hint…' : 'Give Me One Hint'}
            </button>
            <button
              type="button"
              className="practice-drill__secondary"
              onClick={() => void handleRevealModelAnswer()}
              disabled={busy !== null || phase === 'evaluating'}
            >
              {busy === 'reveal' ? 'Loading…' : 'Reveal Model Answer'}
            </button>
            <button
              type="button"
              className="practice-drill__secondary attempt-first__skip"
              onClick={() => void handleSkip()}
              disabled={busy !== null || phase === 'evaluating'}
            >
              {busy === 'skip' ? 'Loading…' : 'Skip and Show Solution'}
            </button>
            {(canGoNext || (canPrev && onPrev)) && (
              <div className="attempt-first__nav-pair">
                {canPrev && onPrev && (
                  <button
                    type="button"
                    className="practice-drill__secondary"
                    onClick={onPrev}
                    disabled={busy !== null || phase === 'evaluating'}
                  >
                    Previous question
                  </button>
                )}
                {canGoNext && (
                  <button
                    type="button"
                    className="practice-drill__secondary"
                    onClick={handleGoToNext}
                    disabled={busy !== null || phase === 'evaluating'}
                  >
                    Next question
                  </button>
                )}
              </div>
            )}
          </div>

          {!modelAnswerOpen && (
            <p className="attempt-first__muted">
              Model answer hidden until you reveal or submit.
            </p>
          )}

          {modelAnswerOpen && (
            <AttemptModelAnswerReveal
              modelAnswer={modelAnswer}
              defaultOpen
              badge={
                solutionViewedBeforeAttempt
                  ? 'Solution Viewed Before Attempt'
                  : undefined
              }
            />
          )}
        </ContentSection>
      )}

      {phase === 'explain-own-words' && (
        <ContentSection title="Explain in your own words">
          <p>
            You viewed the solution before attempting. Summarize the core QA
            approach in your own words before the reinforcement question.
          </p>
          <textarea
            className="attempt-first__textarea"
            rows={5}
            value={ownWordsAnswer}
            onChange={(event) => setOwnWordsAnswer(event.target.value)}
            placeholder="Explain the testing strategy without copying the model answer verbatim…"
          />
          <div className="attempt-first__attempt-actions">
            <button
              type="button"
              className="practice-cta"
              onClick={handlePrimary}
              disabled={primaryDisabled}
            >
              {primaryLabel}
            </button>
            {canGoNext && (
              <div className="attempt-first__nav-pair">
                <button
                  type="button"
                  className="practice-drill__secondary"
                  onClick={handleGoToNext}
                >
                  Next question
                </button>
              </div>
            )}
          </div>
        </ContentSection>
      )}

      {phase === 'feedback' && evaluation && (
        <>
          <AttemptFeedbackPanel
            evaluation={evaluation}
            solutionViewedBeforeAttempt={solutionViewedBeforeAttempt}
            modelAnswerOpen={modelAnswerOpen || Boolean(evaluation.modelAnswer)}
          />
          <div className="attempt-first__attempt-actions">
            <button
              type="button"
              className="practice-cta"
              onClick={handlePrimary}
            >
              {primaryLabel}
            </button>
            {canGoNext && reinforcement && !isReinforcement && (
              <button
                type="button"
                className="practice-drill__secondary"
                onClick={handleGoToNext}
              >
                Skip reinforcement
              </button>
            )}
            {canGoNext && (!reinforcement || isReinforcement) && (
              <div className="attempt-first__nav-pair">
                <button
                  type="button"
                  className="practice-drill__secondary"
                  onClick={handleGoToNext}
                >
                  Next question
                </button>
              </div>
            )}
            {isLast && !onNext && (
              <p className="attempt-first__muted">
                {completeMessage ??
                  'Session complete. Review weak spots or run another round.'}
              </p>
            )}
          </div>
        </>
      )}

      {error && <p className="attempt-first__error">{error}</p>}
    </div>
  );
}

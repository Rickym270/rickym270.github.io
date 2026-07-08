import { useState } from 'react';
import type { ScoringRubric as RubricData } from '../../types/scoringRubric';
import {
  useRetrievalDrill,
  type RetrievalFeatures,
  type RetrievalStepId,
} from '../../hooks/useRetrievalDrill';
import {
  useTrainingProgress,
  type ConfidenceLevel,
  type CommunicationClarity,
} from '../../hooks/useTrainingProgress';
import type { ProjectId } from '../../data/contentGraph';
import { ContentSection } from '../ContentSection';
import { PracticeTimer } from '../practice/PracticeTimer';
import { SelfScoreRubric } from '../practice/SelfScoreRubric';
import { RevealSampleAnswer } from '../RevealSampleAnswer';
import { RetrievalStepBar } from './RetrievalStepBar';
import { ConfidencePicker, CommunicationCoach } from './ConfidencePicker';
import { ExperienceMapper } from './ExperienceMapper';
import { AnswerCoachFramework } from './AnswerCoachFramework';
import { ChallengeMeStep } from './ChallengeMeStep';

const REFLECT_PROMPTS = [
  'What was your direct answer in one sentence?',
  'What key detail might you have missed?',
  'Did you use a real example from your experience?',
];

const STEP_PROMPTS: Record<RetrievalStepId, string> = {
  answer: 'Answer together before continuing. No hints visible yet.',
  reflect: 'Reflect on what you covered and what you missed.',
  socratic: 'Work through follow-up questions together.',
  reveal: 'Compare your answer to the model below.',
  compare: 'Check strong points and common traps.',
  experience: 'Connect this question to a real project story.',
  coach: 'Map your answer to the coaching framework.',
  confidence: 'Rate your confidence and communication.',
  challenge: 'Answer the senior follow-up probe together.',
  next: 'Ready for the next question?',
};

export type RetrievalDrillProps = {
  questionKey: string;
  topicId: string;
  question: string;
  modelAnswer: string;
  compareBullets?: string[];
  pitfalls?: string[];
  rubric?: RubricData;
  stretchQuestion?: string;
  stretchAnswer?: string;
  questionNum?: number;
  totalQuestions?: number;
  onNext?: () => void;
  onPrev?: () => void;
  canPrev?: boolean;
  isLast?: boolean;
  completeMessage?: string;
  features?: Partial<RetrievalFeatures>;
  questionBadge?: string;
};

export function RetrievalDrill({
  questionKey,
  topicId,
  question,
  modelAnswer,
  compareBullets = [],
  pitfalls = [],
  rubric,
  stretchQuestion,
  stretchAnswer,
  questionNum,
  totalQuestions,
  onNext,
  onPrev,
  canPrev = false,
  isLast = false,
  completeMessage,
  features,
  questionBadge,
}: RetrievalDrillProps) {
  const categories = rubric?.categories.map((c) => c.category) ?? [];
  const drill = useRetrievalDrill(1, categories, features);
  const { recordAttempt } = useTrainingProgress();

  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null);
  const [answeredQuestion, setAnsweredQuestion] = useState<
    'yes' | 'partially' | 'no' | null
  >(null);
  const [communication, setCommunication] =
    useState<CommunicationClarity | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectId | null>(
    null
  );

  const step = drill.currentStep;

  function resetSessionState() {
    setConfidence(null);
    setAnsweredQuestion(null);
    setCommunication(null);
    setSelectedProject(null);
  }

  function saveAttempt() {
    if (!confidence) return;
    const rubricValues = Object.values(drill.scores).filter(
      (v): v is NonNullable<typeof v> => v !== null
    );
    const rubricAvg =
      rubricValues.length > 0
        ? rubricValues.reduce((a, b) => a + b, 0) / rubricValues.length
        : undefined;
    recordAttempt({
      questionKey,
      topicId,
      confidence,
      rubricAvg,
      answeredQuestion: answeredQuestion ?? undefined,
      communication: communication ?? undefined,
      selectedProject: selectedProject ?? undefined,
    });
  }

  function handlePrimaryAction() {
    if (step === 'compare' && rubric && !drill.allScored) return;
    if (step === 'confidence' && !confidence) return;

    if (step === 'next') {
      saveAttempt();
      if (onNext && !isLast) {
        onNext();
        resetSessionState();
      }
      return;
    }

    drill.advanceStep();
  }

  const primaryLabel =
    step === 'next'
      ? isLast
        ? 'Done'
        : 'Next question'
      : step === 'answer'
        ? "We've answered"
        : 'Continue';

  const primaryDisabled =
    (step === 'compare' && rubric !== undefined && !drill.allScored) ||
    (step === 'confidence' && !confidence) ||
    (step === 'next' && isLast && !onNext);

  return (
    <div className="practice-drill retrieval-drill">
      {questionNum !== undefined && totalQuestions !== undefined && (
        <div className="practice-drill__meta">
          Question {questionNum} of {totalQuestions}
        </div>
      )}

      <RetrievalStepBar
        activeSteps={drill.activeSteps}
        currentStep={step}
      />

      <div className="practice-prompt">
        <strong>Your move:</strong> {STEP_PROMPTS[step]}
      </div>

      {step === 'answer' && <PracticeTimer />}

      {step === 'answer' && (
        <ContentSection title="Interview Question">
          {questionBadge && (
            <span
              className={`prep-level-badge prep-level-badge--${questionBadge.toLowerCase()}`}
            >
              {questionBadge}
            </span>
          )}
          <p className="practice-drill__question">{question}</p>
          <p className="retrieval-drill__hint">
            No sample answer yet — recall from memory first.
          </p>
        </ContentSection>
      )}

      {step === 'reflect' && (
        <ContentSection title="Self-Reflection">
          <ul className="topic-list-styled">
            {REFLECT_PROMPTS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </ContentSection>
      )}

      {step === 'reveal' && (
        <ContentSection title="Model Answer">
          <RevealSampleAnswer answer={modelAnswer} defaultRevealed />
        </ContentSection>
      )}

      {step === 'compare' && (
        <>
          {compareBullets.length > 0 && (
            <ContentSection title="Strong Answer Should Include">
              <ul className="topic-list-styled">
                {compareBullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </ContentSection>
          )}
          {pitfalls.length > 0 && (
            <ContentSection title="Common Trap" variant="mistake">
              <ul className="topic-list-styled">
                {pitfalls.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </ContentSection>
          )}
          {rubric && (
            <ContentSection title="Self-Score Your Answer">
              <SelfScoreRubric
                rubric={rubric}
                scores={drill.scores}
                onScore={drill.setScore}
              />
            </ContentSection>
          )}
        </>
      )}

      {step === 'experience' && (
        <ContentSection title="Experience Mapping">
          <ExperienceMapper
            topicId={topicId}
            selectedProject={selectedProject}
            onSelect={setSelectedProject}
          />
        </ContentSection>
      )}

      {step === 'coach' && (
        <details className="retrieval-accordion" open>
          <summary>Answer Coach</summary>
          <AnswerCoachFramework modelAnswer={modelAnswer} />
        </details>
      )}

      {step === 'confidence' && (
        <>
          <details className="retrieval-accordion" open>
            <summary>How confident were you?</summary>
            <ConfidencePicker value={confidence} onChange={setConfidence} />
          </details>
          <details className="retrieval-accordion">
            <summary>Communication Coach</summary>
            <CommunicationCoach
              answeredQuestion={answeredQuestion}
              clarity={communication}
              onAnsweredChange={setAnsweredQuestion}
              onClarityChange={setCommunication}
            />
          </details>
        </>
      )}

      {step === 'challenge' && (
        <ContentSection title="Challenge Me">
          <ChallengeMeStep
            stretchQuestion={stretchQuestion}
            stretchAnswer={stretchAnswer}
          />
        </ContentSection>
      )}

      {step === 'next' && (
        <ContentSection title="Question Complete">
          <p>
            {isLast
              ? (completeMessage ??
                'Session complete. Review weak spots or run another round.')
              : 'Click below for the next question.'}
          </p>
        </ContentSection>
      )}

      <div className="practice-drill__actions">
        <button
          type="button"
          className="practice-cta"
          onClick={handlePrimaryAction}
          disabled={primaryDisabled}
        >
          {primaryLabel}
        </button>
        {canPrev && step === 'answer' && onPrev && (
          <button
            type="button"
            className="practice-drill__secondary"
            onClick={onPrev}
          >
            Previous question
          </button>
        )}
        {step === 'challenge' && (
          <button
            type="button"
            className="practice-drill__secondary"
            onClick={() => drill.advanceStep()}
          >
            Skip challenge
          </button>
        )}
      </div>
    </div>
  );
}

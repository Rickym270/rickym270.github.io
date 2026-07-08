import type { RetrievalStepId } from '../../hooks/useRetrievalDrill';
import { useIsMobile } from '../../hooks/useIsMobile';

const STEP_LABELS: Record<RetrievalStepId, string> = {
  answer: 'Answer',
  reflect: 'Reflect',
  socratic: 'Reason',
  reveal: 'Reveal',
  compare: 'Compare',
  experience: 'Connect',
  coach: 'Coach',
  confidence: 'Rate',
  challenge: 'Challenge',
  next: 'Next',
};

type RetrievalStepBarProps = {
  activeSteps: RetrievalStepId[];
  currentStep: RetrievalStepId;
};

export function RetrievalStepBar({
  activeSteps,
  currentStep,
}: RetrievalStepBarProps) {
  const isMobile = useIsMobile();
  const currentIdx = activeSteps.indexOf(currentStep);

  if (isMobile) {
    return (
      <p className="practice-step-compact" aria-live="polite">
        Step {currentIdx + 1} of {activeSteps.length}:{' '}
        <strong>{STEP_LABELS[currentStep]}</strong>
      </p>
    );
  }

  return (
    <ol className="practice-step-bar">
      {activeSteps.map((step, i) => (
        <li
          key={step}
          className={`practice-step ${
            step === currentStep
              ? 'practice-step--active'
              : i < currentIdx
                ? 'practice-step--done'
                : ''
          }`}
        >
          <span className="practice-step__num">{i + 1}</span>
          <span className="practice-step__label">{STEP_LABELS[step]}</span>
        </li>
      ))}
    </ol>
  );
}

import type { PracticeStep } from '../../hooks/usePracticeDrill';

const STEPS: { step: PracticeStep; label: string }[] = [
  { step: 1, label: 'Your turn' },
  { step: 2, label: 'Follow-up' },
  { step: 3, label: 'Compare' },
  { step: 4, label: 'Self-score' },
  { step: 5, label: 'Next' },
];

type PracticeStepBarProps = {
  currentStep: PracticeStep;
};

export function PracticeStepBar({ currentStep }: PracticeStepBarProps) {
  return (
    <ol className="practice-step-bar">
      {STEPS.map(({ step, label }) => (
        <li
          key={step}
          className={`practice-step ${
            step === currentStep
              ? 'practice-step--active'
              : step < currentStep
                ? 'practice-step--done'
                : ''
          }`}
        >
          <span className="practice-step__num">{step}</span>
          <span className="practice-step__label">{label}</span>
        </li>
      ))}
    </ol>
  );
}

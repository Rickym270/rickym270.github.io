import type { PracticeStep } from '../../hooks/usePracticeDrill';

const PROMPTS: Record<PracticeStep, string> = {
  1: 'Give your full answer together before clicking next. Aim for 2 minutes.',
  2: 'The interviewer pushes back. Answer this follow-up together.',
  3: 'Compare what you said to the strong answer bullets below.',
  4: 'Be honest—tap 1, 3, or 5 for each category based on your answer.',
  5: 'Ready for the next question? Review your scores and move on.',
};

type PracticePromptProps = {
  step: PracticeStep;
};

export function PracticePrompt({ step }: PracticePromptProps) {
  return (
    <div className="practice-prompt">
      <strong>Your move:</strong> {PROMPTS[step]}
    </div>
  );
}

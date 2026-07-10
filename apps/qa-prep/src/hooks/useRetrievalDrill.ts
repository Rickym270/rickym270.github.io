import { useCallback, useMemo, useState } from 'react';
import type { RubricLevel } from '../types/scoringRubric';

export type RetrievalStepId =
  | 'answer'
  | 'reflect'
  | 'socratic'
  | 'reveal'
  | 'compare'
  | 'experience'
  | 'coach'
  | 'confidence'
  | 'challenge'
  | 'next';

export type RetrievalFeatures = {
  experience: boolean;
  coach: boolean;
  confidence: boolean;
  challenge: boolean;
  socratic: boolean;
};

const DEFAULT_FEATURES: RetrievalFeatures = {
  experience: false,
  coach: true,
  confidence: true,
  challenge: true,
  socratic: true,
};

const STEP_ORDER: RetrievalStepId[] = [
  'answer',
  'socratic',
  'reflect',
  'reveal',
  'compare',
  'coach',
  'confidence',
  'challenge',
  'next',
];

export function useRetrievalDrill(
  totalQuestions: number,
  categories: string[],
  features: Partial<RetrievalFeatures> = {}
) {
  const enabled = { ...DEFAULT_FEATURES, ...features };

  const activeSteps = useMemo(() => {
    return STEP_ORDER.filter((id) => {
      if (id === 'experience') return enabled.experience;
      if (id === 'coach') return enabled.coach;
      if (id === 'confidence') return enabled.confidence;
      if (id === 'challenge') return enabled.challenge;
      if (id === 'socratic') return enabled.socratic;
      return true;
    });
  }, [enabled]);

  const [stepIndex, setStepIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, RubricLevel | null>>(() =>
    Object.fromEntries(categories.map((c) => [c, null]))
  );

  const currentStep = activeSteps[stepIndex] ?? 'answer';
  const isLastStep = stepIndex >= activeSteps.length - 1;

  const resetScores = useCallback(() => {
    setScores(Object.fromEntries(categories.map((c) => [c, null])));
  }, [categories]);

  const advanceStep = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, activeSteps.length - 1));
  }, [activeSteps.length]);

  const nextQuestion = useCallback(() => {
    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex((i) => i + 1);
      setStepIndex(0);
      resetScores();
    }
  }, [questionIndex, totalQuestions, resetScores]);

  const prevQuestion = useCallback(() => {
    if (questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
      setStepIndex(0);
      resetScores();
    }
  }, [questionIndex, resetScores]);

  const setScore = useCallback((category: string, score: RubricLevel) => {
    setScores((prev) => ({ ...prev, [category]: score }));
  }, []);

  const reset = useCallback(() => {
    setStepIndex(0);
    setQuestionIndex(0);
    resetScores();
  }, [resetScores]);

  const allScored =
    categories.length > 0 && categories.every((c) => scores[c] !== null);

  return {
    currentStep,
    stepIndex,
    activeSteps,
    enabled,
    questionIndex,
    scores,
    advanceStep,
    nextQuestion,
    prevQuestion,
    setScore,
    reset,
    allScored,
    isLastStep,
    isLastQuestion: questionIndex >= totalQuestions - 1,
  };
}

import { useState, useCallback } from 'react';
import type { RubricLevel } from '../types/scoringRubric';

export type PracticeStep = 1 | 2 | 3 | 4 | 5;

export function usePracticeDrill(totalQuestions: number, categories: string[]) {
  const [step, setStep] = useState<PracticeStep>(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, RubricLevel | null>>(() =>
    Object.fromEntries(categories.map((c) => [c, null]))
  );

  const resetScores = useCallback(() => {
    setScores(Object.fromEntries(categories.map((c) => [c, null])));
  }, [categories]);

  const advanceStep = useCallback(() => {
    setStep((s) => (s < 5 ? ((s + 1) as PracticeStep) : s));
  }, []);

  const nextQuestion = useCallback(() => {
    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex((i) => i + 1);
      setStep(1);
      resetScores();
    }
  }, [questionIndex, totalQuestions, resetScores]);

  const prevQuestion = useCallback(() => {
    if (questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
      setStep(1);
      resetScores();
    }
  }, [questionIndex, resetScores]);

  const setScore = useCallback((category: string, score: RubricLevel) => {
    setScores((prev) => ({ ...prev, [category]: score }));
  }, []);

  const reset = useCallback(() => {
    setStep(1);
    setQuestionIndex(0);
    resetScores();
  }, [resetScores]);

  const allScored =
    categories.length > 0 && categories.every((c) => scores[c] !== null);

  return {
    step,
    questionIndex,
    scores,
    advanceStep,
    nextQuestion,
    prevQuestion,
    setScore,
    reset,
    allScored,
    isLastQuestion: questionIndex >= totalQuestions - 1,
  };
}

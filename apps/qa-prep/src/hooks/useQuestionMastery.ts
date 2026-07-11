import { useCallback, useEffect, useState } from 'react';
import type { QuestionMasteryRecord } from '../types/questionMastery';

const STORAGE_KEY = 'qa-prep-question-mastery';

function loadMastery(): QuestionMasteryRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QuestionMasteryRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMastery(records: QuestionMasteryRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function useQuestionMastery() {
  const [records, setRecords] = useState<QuestionMasteryRecord[]>(loadMastery);

  useEffect(() => {
    saveMastery(records);
  }, [records]);

  const getMastery = useCallback(
    (questionKey: string) =>
      records.find((record) => record.questionKey === questionKey) ?? null,
    [records]
  );

  const updateMastery = useCallback(
    (
      questionKey: string,
      topicId: string,
      patch: Partial<
        Pick<
          QuestionMasteryRecord,
          | 'mastered'
          | 'solutionViewedBeforeAttempt'
          | 'lastScoreAvg'
          | 'reinforcementPassed'
        >
      >
    ) => {
      setRecords((prev) => {
        const existing = prev.find((record) => record.questionKey === questionKey);
        const next: QuestionMasteryRecord = {
          questionKey,
          topicId,
          mastered: patch.mastered ?? existing?.mastered ?? false,
          solutionViewedBeforeAttempt:
            patch.solutionViewedBeforeAttempt ??
            existing?.solutionViewedBeforeAttempt ??
            false,
          lastScoreAvg: patch.lastScoreAvg ?? existing?.lastScoreAvg,
          reinforcementPassed:
            patch.reinforcementPassed ?? existing?.reinforcementPassed ?? false,
          updatedAt: Date.now(),
        };
        const without = prev.filter((record) => record.questionKey !== questionKey);
        return [...without, next];
      });
    },
    []
  );

  const getMasteredCountForTopic = useCallback(
    (topicId: string) =>
      records.filter((record) => record.topicId === topicId && record.mastered)
        .length,
    [records]
  );

  return {
    records,
    getMastery,
    updateMastery,
    getMasteredCountForTopic,
  };
}

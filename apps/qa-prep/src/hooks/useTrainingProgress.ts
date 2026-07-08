import { useCallback, useEffect, useState } from 'react';
import type {
  AttemptRecord,
  CommunicationClarity,
  ConfidenceLevel,
  TrainingProgress,
} from '../types/trainingProgress';

const STORAGE_KEY = 'rubihealth-training-progress';

function loadProgress(): TrainingProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { attempts: [] };
    return JSON.parse(raw) as TrainingProgress;
  } catch {
    return { attempts: [] };
  }
}

function saveProgress(progress: TrainingProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useTrainingProgress() {
  const [progress, setProgress] = useState<TrainingProgress>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const recordAttempt = useCallback((record: Omit<AttemptRecord, 'timestamp'>) => {
    setProgress((prev) => ({
      attempts: [
        ...prev.attempts,
        { ...record, timestamp: Date.now() },
      ],
    }));
  }, []);

  const getWeakTopics = useCallback(
    (limit = 3): string[] => {
      const byTopic = new Map<
        string,
        { score: number; count: number; coldCount: number }
      >();

      for (const attempt of progress.attempts) {
        const confScore =
          attempt.confidence === 'cold'
            ? 4
            : attempt.confidence === 'needs-review'
              ? 3
              : attempt.confidence === 'reasoned-through'
                ? 2
                : 1;
        const rubricPenalty = attempt.rubricAvg
          ? (5 - attempt.rubricAvg) * 0.5
          : 0;
        const existing = byTopic.get(attempt.topicId) ?? {
          score: 0,
          count: 0,
          coldCount: 0,
        };
        byTopic.set(attempt.topicId, {
          score: existing.score + confScore + rubricPenalty,
          count: existing.count + 1,
          coldCount:
            existing.coldCount + (attempt.confidence === 'cold' ? 1 : 0),
        });
      }

      return [...byTopic.entries()]
        .filter(([, v]) => v.coldCount < 2)
        .sort((a, b) => b[1].score / b[1].count - a[1].score / a[1].count)
        .slice(0, limit)
        .map(([id]) => id);
    },
    [progress.attempts]
  );

  const getLastPracticed = useCallback(
    (topicId: string): number | null => {
      const matches = progress.attempts
        .filter((a) => a.topicId === topicId)
        .map((a) => a.timestamp);
      return matches.length ? Math.max(...matches) : null;
    },
    [progress.attempts]
  );

  return {
    progress,
    recordAttempt,
    getWeakTopics,
    getLastPracticed,
  };
}

export type { ConfidenceLevel, CommunicationClarity };

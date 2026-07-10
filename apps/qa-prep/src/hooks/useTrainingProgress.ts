import { useCallback, useEffect, useState } from 'react';
import type {
  AttemptRecord,
  CommunicationClarity,
  ConfidenceLevel,
  CoachDimensionScores,
  TrainingProgress,
} from '../types/trainingProgress';
import { isTopicDue } from '../data/reviewSchedule';

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
        { score: number; count: number }
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
        const dimPenalty = attempt.coachDimensions
          ? Object.values(attempt.coachDimensions).reduce((sum, v) => {
              if (v === undefined) return sum;
              return sum + (5 - v) * 0.15;
            }, 0)
          : 0;
        const existing = byTopic.get(attempt.topicId) ?? {
          score: 0,
          count: 0,
        };
        byTopic.set(attempt.topicId, {
          score: existing.score + confScore + rubricPenalty + dimPenalty,
          count: existing.count + 1,
        });
      }

      return [...byTopic.entries()]
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

  const getLatestAttemptForTopic = useCallback(
    (topicId: string): AttemptRecord | null => {
      const matches = progress.attempts.filter((a) => a.topicId === topicId);
      if (matches.length === 0) return null;
      return matches.reduce((a, b) => (a.timestamp > b.timestamp ? a : b));
    },
    [progress.attempts]
  );

  const getWeakDimension = useCallback(
    (topicId: string): keyof CoachDimensionScores | null => {
      const latest = getLatestAttemptForTopic(topicId);
      if (!latest?.coachDimensions) return null;
      const entries = Object.entries(latest.coachDimensions).filter(
        ([, v]) => v !== undefined
      ) as [keyof CoachDimensionScores, number][];
      if (entries.length === 0) return null;
      entries.sort((a, b) => a[1] - b[1]);
      return entries[0]![0];
    },
    [getLatestAttemptForTopic]
  );

  const getReviewQueue = useCallback(
    (limit = 5): string[] => {
      const topicIds = [...new Set(progress.attempts.map((a) => a.topicId))];
      const due = topicIds
        .map((topicId) => {
          const latest = getLatestAttemptForTopic(topicId);
          const last = getLastPracticed(topicId);
          if (!latest || !last) return null;
          return isTopicDue(last, latest.confidence)
            ? { topicId, last }
            : null;
        })
        .filter((x): x is { topicId: string; last: number } => x !== null)
        .sort((a, b) => a.last - b.last);

      const weak = getWeakTopics(limit);
      const merged = [...new Set([...due.map((d) => d.topicId), ...weak])];
      return merged.slice(0, limit);
    },
    [progress.attempts, getLatestAttemptForTopic, getLastPracticed, getWeakTopics]
  );

  return {
    progress,
    recordAttempt,
    getWeakTopics,
    getLastPracticed,
    getWeakDimension,
    getReviewQueue,
  };
}

export type { ConfidenceLevel, CommunicationClarity };

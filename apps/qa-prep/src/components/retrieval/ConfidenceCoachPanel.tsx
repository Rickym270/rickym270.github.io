import type { CoachDimensionScores } from '../../types/trainingProgress';
import { DIMENSION_LABELS } from '../../data/coachFeedback';

type CoachDimensionPickerProps = {
  scores: Partial<CoachDimensionScores>;
  onScore: (dimension: keyof CoachDimensionScores, score: number) => void;
};

const DIMENSIONS = Object.keys(DIMENSION_LABELS) as (keyof CoachDimensionScores)[];

export function CoachDimensionPicker({
  scores,
  onScore,
}: CoachDimensionPickerProps) {
  return (
    <div className="coach-dimension-picker">
      <p className="coach-dimension-picker__intro">
        Rate each dimension (1 = weak, 3 = okay, 5 = strong):
      </p>
      {DIMENSIONS.map((dim) => {
        const selected = scores[dim];
        return (
          <div key={dim} className="self-score-category">
            <p className="self-score-category__title">{DIMENSION_LABELS[dim]}</p>
            <div className="self-score-btns">
              {([1, 3, 5] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`self-score-btn ${selected === level ? 'self-score-btn--selected' : ''}`}
                  onClick={() => onScore(dim, level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

type ConfidenceCoachPanelProps = {
  feedback: string;
};

export function ConfidenceCoachPanel({ feedback }: ConfidenceCoachPanelProps) {
  return (
    <div className="confidence-coach-panel">
      <p className="confidence-coach-panel__label">Coach feedback</p>
      <p className="confidence-coach-panel__text">{feedback}</p>
    </div>
  );
}

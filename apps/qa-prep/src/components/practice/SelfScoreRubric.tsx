import type { ScoringRubric as RubricData } from '../../types/scoringRubric';
import type { RubricLevel } from '../../types/scoringRubric';
import { RUBRIC_SCALE } from '../../data/rubricScale';

type SelfScoreRubricProps = {
  rubric: RubricData;
  scores: Record<string, RubricLevel | null>;
  onScore: (category: string, score: RubricLevel) => void;
};

export function SelfScoreRubric({
  rubric,
  scores,
  onScore,
}: SelfScoreRubricProps) {
  return (
    <div className="self-score-rubric">
      <ul className="rubric-legend">
        {RUBRIC_SCALE.map(({ score, label }) => (
          <li key={score} className="rubric-legend__item">
            <span className="rubric-legend__score">{score}</span>
            <span className="rubric-legend__label">{label}</span>
          </li>
        ))}
      </ul>

      {rubric.categories.map((cat) => {
        const selected = scores[cat.category];
        const criteria =
          selected === 1
            ? cat.score1
            : selected === 3
              ? cat.score3
              : selected === 5
                ? cat.score5
                : null;

        return (
          <div key={cat.category} className="self-score-category">
            <p className="self-score-category__title">{cat.category}</p>
            <div className="self-score-btns">
              {([1, 3, 5] as RubricLevel[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`self-score-btn ${selected === level ? 'self-score-btn--selected' : ''}`}
                  onClick={() => onScore(cat.category, level)}
                >
                  {level}
                </button>
              ))}
            </div>
            {criteria && (
              <p className="self-score-criteria">{criteria}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

import type { ScoringRubric as RubricData } from '../types/scoringRubric';
import { RUBRIC_SCALE } from '../data/rubricScale';
import { ContentSection } from './ContentSection';

type ScoringRubricProps = {
  rubric: RubricData;
};

export function ScoringRubric({ rubric }: ScoringRubricProps) {
  return (
    <ContentSection title="Scoring Rubric">
      <ul className="rubric-legend">
        {RUBRIC_SCALE.map(({ score, label }) => (
          <li key={score} className="rubric-legend__item">
            <span className="rubric-legend__score">{score}</span>
            <span className="rubric-legend__label">{label}</span>
          </li>
        ))}
      </ul>

      {rubric.categories.map((cat) => (
        <div key={cat.category} className="rubric-category">
          <h4 className="rubric-category__title">{cat.category}</h4>
          <div className="rubric-level rubric-level--1">
            <span className="rubric-level__score">1</span>
            <p className="rubric-level__text">{cat.score1}</p>
          </div>
          <div className="rubric-level rubric-level--3">
            <span className="rubric-level__score">3</span>
            <p className="rubric-level__text">{cat.score3}</p>
          </div>
          <div className="rubric-level rubric-level--5">
            <span className="rubric-level__score">5</span>
            <p className="rubric-level__text">{cat.score5}</p>
          </div>
        </div>
      ))}
    </ContentSection>
  );
}

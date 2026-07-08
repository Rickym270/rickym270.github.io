import type { TechComparison } from '../../types/mentorContent';
import { ExplainedBlock } from './ExplainedBlock';

type TechComparisonCardProps = {
  comparison: TechComparison;
};

export function TechComparisonCard({ comparison }: TechComparisonCardProps) {
  const text = [
    comparison.purpose,
    ...comparison.leftAdvantages,
    ...comparison.rightAdvantages,
    comparison.whenToChooseLeft,
    comparison.whenToChooseRight,
  ].join(' ');

  return (
    <article className="tech-comparison-card">
      <h4 className="tech-comparison-card__title">{comparison.title}</h4>
      <ExplainedBlock text={text} label={comparison.title}>
        <p>{comparison.purpose}</p>
        <div className="tech-comparison-card__grid">
          <div>
            <h5>{comparison.left}</h5>
            <p><strong>Advantages:</strong></p>
            <ul className="topic-list-styled">
              {comparison.leftAdvantages.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <p><strong>Disadvantages:</strong></p>
            <ul className="topic-list-styled">
              {comparison.leftDisadvantages.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <p><em>Choose when:</em> {comparison.whenToChooseLeft}</p>
          </div>
          <div>
            <h5>{comparison.right}</h5>
            <p><strong>Advantages:</strong></p>
            <ul className="topic-list-styled">
              {comparison.rightAdvantages.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <p><strong>Disadvantages:</strong></p>
            <ul className="topic-list-styled">
              {comparison.rightDisadvantages.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <p><em>Choose when:</em> {comparison.whenToChooseRight}</p>
          </div>
        </div>
      </ExplainedBlock>
    </article>
  );
}

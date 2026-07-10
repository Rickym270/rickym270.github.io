import type { CostBenefit } from '../../types/mentorContent';
import { ContentSection } from '../ContentSection';
import { ExplainedBlock } from './ExplainedBlock';

type CostBenefitSectionProps = {
  content: CostBenefit;
  embedded?: boolean;
};

function flatten(cb: CostBenefit): string {
  return [
    ...cb.benefits,
    ...cb.costs,
    ...cb.tradeoffs,
    ...cb.commonMistakes,
    ...cb.performance,
    ...cb.maintainability,
  ].join(' ');
}

export function CostBenefitSection({
  content,
  embedded = false,
}: CostBenefitSectionProps) {
  const body = (
    <ExplainedBlock text={flatten(content)} label="cost benefit">
      <div className="cost-benefit-grid">
        <div>
          <h4>Benefits</h4>
          <ul className="topic-list-styled">
            {content.benefits.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Costs</h4>
          <ul className="topic-list-styled">
            {content.costs.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Tradeoffs</h4>
          <ul className="topic-list-styled">
            {content.tradeoffs.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Common mistakes</h4>
          <ul className="topic-list-styled">
            {content.commonMistakes.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Performance</h4>
          <ul className="topic-list-styled">
            {content.performance.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Maintainability</h4>
          <ul className="topic-list-styled">
            {content.maintainability.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      </div>
    </ExplainedBlock>
  );

  if (embedded) {
    return body;
  }

  return (
    <ContentSection title="Cost / Benefit Analysis">
      {body}
    </ContentSection>
  );
}

import type { AnswerComparison } from '../types/answerComparison';
import { ContentSection } from './ContentSection';

type AnswerComparisonDetailProps = {
  comparison: AnswerComparison;
};

export function AnswerComparisonDetail({
  comparison,
}: AnswerComparisonDetailProps) {
  return (
    <article className="topic-detail">
      <h2 className="topic-detail__title">{comparison.title}</h2>

      <ContentSection title="Weak Answer" variant="mistake">
        <p>{comparison.weakAnswer}</p>
      </ContentSection>

      <ContentSection title="Why It Is Weak" variant="mistake">
        <p>{comparison.whyWeak}</p>
      </ContentSection>

      <ContentSection title="Better Answer">
        <p>{comparison.betterAnswer}</p>
      </ContentSection>

      <ContentSection title="Why It Is Stronger">
        <p>{comparison.whyStronger}</p>
      </ContentSection>
    </article>
  );
}

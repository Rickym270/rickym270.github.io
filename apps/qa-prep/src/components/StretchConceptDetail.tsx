import type { StretchConcept } from '../types/stretchConcept';
import { topics } from '../data/topics';
import { ContentSection } from './ContentSection';

type StretchConceptDetailProps = {
  concept: StretchConcept;
};

export function StretchConceptDetail({ concept }: StretchConceptDetailProps) {
  return (
    <article className="topic-detail">
      <div className="topic-detail__header">
        <h2 className="topic-detail__title">{concept.title}</h2>
        <span className="prep-level-badge prep-level-badge--stretch">Stretch</span>
      </div>

      <ContentSection title="Why it matters">
        <p>{concept.whyItMatters}</p>
      </ContentSection>

      <ContentSection title="How to explain it as an experienced IC">
        <p>{concept.practicalTakeaway}</p>
      </ContentSection>

      {concept.relatedTopicIds.length > 0 && (
        <ContentSection title="Related core topics">
          <ul className="topic-list-styled">
            {concept.relatedTopicIds.map((id) => {
              const topic = topics.find((t) => t.id === id);
              return <li key={id}>{topic?.title ?? id}</li>;
            })}
          </ul>
        </ContentSection>
      )}
    </article>
  );
}

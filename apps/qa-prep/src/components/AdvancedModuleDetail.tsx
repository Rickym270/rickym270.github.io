import type { AdvancedModule } from '../types/advancedModule';
import { ContentSection } from './ContentSection';

type AdvancedModuleDetailProps = {
  module: AdvancedModule;
};

export function AdvancedModuleDetail({ module }: AdvancedModuleDetailProps) {
  return (
    <article className="topic-detail">
      <div className="topic-detail__header">
        <h2 className="topic-detail__title">{module.title}</h2>
        <span className="prep-level-badge prep-level-badge--advanced">
          Advanced / Optional
        </span>
      </div>

      <ContentSection title="Summary">
        <p>{module.summary}</p>
      </ContentSection>

      <ContentSection title="Key points">
        <ul className="topic-list-styled">
          {module.keyPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection title="When to use this">
        <p>{module.whenToUse}</p>
      </ContentSection>
    </article>
  );
}

import type { StretchConcept } from '../types/stretchConcept';
import { TopicCard } from './TopicCard';

type StretchConceptListProps = {
  concepts: StretchConcept[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  compact?: boolean;
};

export function StretchConceptList({
  concepts,
  selectedId,
  onSelect,
  compact = false,
}: StretchConceptListProps) {
  return (
    <nav
      className={`sidebar-section ${compact ? 'sidebar-section--compact' : ''}`}
      aria-label="Stretch concepts"
    >
      <div className={`topic-list ${compact ? 'topic-list--compact' : ''}`}>
        {concepts.map((concept) => (
          <TopicCard
            key={concept.id}
            id={concept.id}
            label={concept.title}
            selected={concept.id === selectedId}
            onSelect={onSelect}
            compact={compact}
          />
        ))}
      </div>
    </nav>
  );
}

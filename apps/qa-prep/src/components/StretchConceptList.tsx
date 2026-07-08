import type { StretchConcept } from '../types/stretchConcept';
import { TopicCard } from './TopicCard';

type StretchConceptListProps = {
  concepts: StretchConcept[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function StretchConceptList({
  concepts,
  selectedId,
  onSelect,
}: StretchConceptListProps) {
  return (
    <nav className="sidebar-section" aria-label="Stretch concepts">
      <div className="topic-list">
        {concepts.map((concept) => (
          <TopicCard
            key={concept.id}
            id={concept.id}
            label={concept.title}
            selected={concept.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </nav>
  );
}

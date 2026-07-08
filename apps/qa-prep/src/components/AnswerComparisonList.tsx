import type { AnswerComparison } from '../types/answerComparison';
import { TopicCard } from './TopicCard';

type AnswerComparisonListProps = {
  comparisons: AnswerComparison[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  heading?: string;
};

export function AnswerComparisonList({
  comparisons,
  selectedId,
  onSelect,
  heading = 'Bad Answer vs Better Answer',
}: AnswerComparisonListProps) {
  return (
    <nav className="sidebar-section" aria-label={heading}>
      <h3 className="sidebar-section__subheading">{heading}</h3>
      <div className="topic-list">
        {comparisons.map((comparison) => (
          <TopicCard
            key={comparison.id}
            id={comparison.id}
            label={comparison.title}
            selected={comparison.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </nav>
  );
}

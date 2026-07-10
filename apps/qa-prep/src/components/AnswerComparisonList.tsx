import type { AnswerComparison } from '../types/answerComparison';
import { TopicCard } from './TopicCard';

type AnswerComparisonListProps = {
  comparisons: AnswerComparison[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  heading?: string;
  hideHeading?: boolean;
  compact?: boolean;
};

export function AnswerComparisonList({
  comparisons,
  selectedId,
  onSelect,
  heading = 'Bad Answer vs Better Answer',
  hideHeading = false,
  compact = false,
}: AnswerComparisonListProps) {
  return (
    <nav
      className={`sidebar-section ${compact ? 'sidebar-section--compact' : ''}`}
      aria-label={heading}
    >
      {!hideHeading && (
        <h3 className="sidebar-section__subheading">{heading}</h3>
      )}
      <div className={`topic-list ${compact ? 'topic-list--compact' : ''}`}>
        {comparisons.map((comparison) => (
          <TopicCard
            key={comparison.id}
            id={comparison.id}
            label={comparison.title}
            selected={comparison.id === selectedId}
            onSelect={onSelect}
            compact={compact}
          />
        ))}
      </div>
    </nav>
  );
}

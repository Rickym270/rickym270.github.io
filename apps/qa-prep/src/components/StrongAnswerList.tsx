import type { StrongAnswer } from '../types/strongAnswer';
import { truncateNavLabel } from '../utils/truncateNavLabel';
import { TopicCard } from './TopicCard';

type StrongAnswerListProps = {
  answers: StrongAnswer[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  heading?: string;
  hideHeading?: boolean;
  compact?: boolean;
};

export function StrongAnswerList({
  answers,
  selectedId,
  onSelect,
  heading = 'Strong Answer Library',
  hideHeading = false,
  compact = false,
}: StrongAnswerListProps) {
  return (
    <nav
      className={`sidebar-section ${compact ? 'sidebar-section--compact' : ''}`}
      aria-label={heading}
    >
      {!hideHeading && (
        <h3 className="sidebar-section__subheading">{heading}</h3>
      )}
      <div className={`topic-list ${compact ? 'topic-list--compact' : ''}`}>
        {answers.map((answer) => (
          <TopicCard
            key={answer.id}
            id={answer.id}
            label={
              compact ? truncateNavLabel(answer.question) : answer.question
            }
            titleAttr={compact ? answer.question : undefined}
            selected={answer.id === selectedId}
            onSelect={onSelect}
            compact={compact}
          />
        ))}
      </div>
    </nav>
  );
}

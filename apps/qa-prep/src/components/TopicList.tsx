import type { Topic } from '../types/topic';
import { TopicCard } from './TopicCard';

type TopicListProps = {
  topics: Topic[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  heading?: string;
  hideHeading?: boolean;
  compact?: boolean;
};

export function TopicList({
  topics,
  selectedId,
  onSelect,
  heading = 'Interview Topics',
  hideHeading = false,
  compact = false,
}: TopicListProps) {
  return (
    <nav
      className={`sidebar-section ${compact ? 'sidebar-section--compact' : ''}`}
      aria-label={heading}
    >
      {!hideHeading && (
        <h3 className="sidebar-section__subheading">{heading}</h3>
      )}
      <div className={`topic-list ${compact ? 'topic-list--compact' : ''}`}>
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            id={topic.id}
            label={topic.title}
            selected={topic.id === selectedId}
            onSelect={onSelect}
            compact={compact}
          />
        ))}
      </div>
    </nav>
  );
}

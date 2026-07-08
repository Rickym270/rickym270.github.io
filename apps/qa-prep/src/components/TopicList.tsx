import type { Topic } from '../types/topic';
import { TopicCard } from './TopicCard';

type TopicListProps = {
  topics: Topic[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  heading?: string;
};

export function TopicList({ topics, selectedId, onSelect, heading = 'Interview Topics' }: TopicListProps) {
  return (
    <nav className="sidebar-section" aria-label={heading}>
      <h3 className="sidebar-section__subheading">{heading}</h3>
      <div className="topic-list">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            id={topic.id}
            label={topic.title}
            selected={topic.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </nav>
  );
}

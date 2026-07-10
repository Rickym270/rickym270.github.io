import type { PersonalStory } from '../types/personalStory';
import { truncateNavLabel } from '../utils/truncateNavLabel';
import { TopicCard } from './TopicCard';

type StoryBankListProps = {
  stories: PersonalStory[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  heading?: string;
  hideHeading?: boolean;
  compact?: boolean;
};

export function StoryBankList({
  stories,
  selectedId,
  onSelect,
  heading = 'Personal Story Bank',
  hideHeading = false,
  compact = false,
}: StoryBankListProps) {
  return (
    <nav
      className={`sidebar-section ${compact ? 'sidebar-section--compact' : ''}`}
      aria-label={heading}
    >
      {!hideHeading && (
        <h3 className="sidebar-section__subheading">{heading}</h3>
      )}
      <div className={`topic-list ${compact ? 'topic-list--compact' : ''}`}>
        {stories.map((story) => (
          <TopicCard
            key={story.id}
            id={story.id}
            label={compact ? truncateNavLabel(story.title, 44) : story.title}
            titleAttr={compact ? story.title : undefined}
            selected={story.id === selectedId}
            onSelect={onSelect}
            compact={compact}
          />
        ))}
      </div>
    </nav>
  );
}

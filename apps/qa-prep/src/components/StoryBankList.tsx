import type { PersonalStory } from '../types/personalStory';
import { TopicCard } from './TopicCard';

type StoryBankListProps = {
  stories: PersonalStory[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  heading?: string;
};

export function StoryBankList({
  stories,
  selectedId,
  onSelect,
  heading = 'Personal Story Bank',
}: StoryBankListProps) {
  return (
    <nav className="sidebar-section" aria-label={heading}>
      <h3 className="sidebar-section__subheading">{heading}</h3>
      <div className="topic-list">
        {stories.map((story) => (
          <TopicCard
            key={story.id}
            id={story.id}
            label={story.title}
            selected={story.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </nav>
  );
}

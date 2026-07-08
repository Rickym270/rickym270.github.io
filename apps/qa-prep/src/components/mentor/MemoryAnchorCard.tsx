import type { MemoryAnchor } from '../../types/mentorContent';
import { personalStories } from '../../data/personalStories';
import { ExplainedBlock } from './ExplainedBlock';

type MemoryAnchorCardProps = {
  anchor: MemoryAnchor;
};

export function MemoryAnchorCard({ anchor }: MemoryAnchorCardProps) {
  const story = anchor.storyId
    ? personalStories.find((s) => s.id === anchor.storyId)
    : undefined;

  const text = story
    ? `${anchor.phrase} — connects to: ${story.title}`
    : anchor.phrase;

  return (
    <div className="memory-anchor-card">
      <ExplainedBlock text={text} label="memory anchor">
        <p className="memory-anchor-card__phrase">"{anchor.phrase}"</p>
        {story && (
          <p className="memory-anchor-card__story">
            Story: <strong>{story.title}</strong>
          </p>
        )}
      </ExplainedBlock>
    </div>
  );
}

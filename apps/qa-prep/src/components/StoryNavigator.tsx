import { useState } from 'react';
import type { PersonalStory } from '../types/personalStory';
import { personalStories } from '../data/personalStories';
import { topics } from '../data/topics';
import { topicStoryLinks, getMemorizeFirstStoryIds } from '../data/contentGraph';
import { StoryBankDetail } from './StoryBankDetail';
import { RetrievalDrill } from './retrieval/RetrievalDrill';
import { ContentSection } from './ContentSection';

type StoryNavigatorProps = {
  onExit?: () => void;
};

export function StoryNavigator({ onExit }: StoryNavigatorProps) {
  const [selectedStory, setSelectedStory] = useState<PersonalStory | null>(null);
  const [retellStory, setRetellStory] = useState<PersonalStory | null>(null);
  const [drillKey, setDrillKey] = useState(0);

  const memorizeIds = getMemorizeFirstStoryIds();
  const memorizeStories = memorizeIds
    .map((id) => personalStories.find((s) => s.id === id))
    .filter((s): s is PersonalStory => s !== undefined);

  if (retellStory) {
    const starPrompt = `Tell me the "${retellStory.title}" story using STAR. Do not read — recall from memory.`;
    const modelAnswer = [
      `Situation: ${retellStory.situation}`,
      `Task: ${retellStory.task}`,
      `Action: ${retellStory.action}`,
      `Result: ${retellStory.result}`,
    ].join('\n\n');

    return (
      <div className="story-navigator">
        <div className="story-navigator__header">
          <button
            type="button"
            className="practice-drill__secondary"
            onClick={() => setRetellStory(null)}
          >
            Back to stories
          </button>
        </div>
        <RetrievalDrill
          key={drillKey}
          questionKey={`story:${retellStory.id}`}
          topicId={retellStory.relatedTopicIds?.[0] ?? 'behavioral-leadership'}
          question={starPrompt}
          modelAnswer={modelAnswer}
          compareBullets={[
            'Clear Situation with context',
            'Specific Task you owned',
            'Concrete Actions you took',
            'Measurable or qualitative Result',
          ]}
          features={{ experience: false, coach: true, confidence: true, challenge: false }}
          onNext={() => {
            setRetellStory(null);
            setDrillKey((k) => k + 1);
          }}
          isLast
          completeMessage="Story retell complete. Pick another story or review in Study mode."
        />
      </div>
    );
  }

  if (selectedStory) {
    return (
      <div className="story-navigator">
        <div className="story-navigator__header">
          <button
            type="button"
            className="practice-drill__secondary"
            onClick={() => setSelectedStory(null)}
          >
            Back to stories
          </button>
          <button
            type="button"
            className="practice-cta"
            onClick={() => setRetellStory(selectedStory)}
          >
            Retell this story
          </button>
        </div>
        <StoryBankDetail story={selectedStory} />
      </div>
    );
  }

  return (
    <article className="topic-detail story-navigator">
      <div className="story-navigator__header">
        <h2 className="topic-detail__title">Story Navigator</h2>
        {onExit && (
          <button type="button" className="panel-mode__exit" onClick={onExit}>
            Exit
          </button>
        )}
      </div>
      <p className="story-navigator__intro">
        Master the six priority stories first, then drill by topic. Use Retell
        to practice active recall — no reading allowed.
      </p>

      <ContentSection title="Memorize first">
        <ul className="story-nav-list">
          {memorizeStories.map((story, i) => (
            <li key={story.id}>
              <button
                type="button"
                className="story-nav-list__btn"
                onClick={() => setSelectedStory(story)}
              >
                <span className="story-nav-list__priority">{i + 1}</span>
                <span>{story.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </ContentSection>

      {topics.map((topic) => {
        const storyIds = topicStoryLinks[topic.id] ?? [];
        if (storyIds.length === 0) return null;
        const linked = storyIds
          .map((id) => personalStories.find((s) => s.id === id))
          .filter((s): s is PersonalStory => s !== undefined);
        if (linked.length === 0) return null;

        return (
          <ContentSection key={topic.id} title={topic.title}>
            <ul className="story-nav-list">
              {linked.map((story) => (
                <li key={story.id}>
                  <button
                    type="button"
                    className="story-nav-list__btn"
                    onClick={() => setSelectedStory(story)}
                  >
                    {story.title}
                  </button>
                </li>
              ))}
            </ul>
          </ContentSection>
        );
      })}
    </article>
  );
}

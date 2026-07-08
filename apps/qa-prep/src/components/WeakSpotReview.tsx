import { useTrainingProgress } from '../hooks/useTrainingProgress';
import { topics } from '../data/topics';
import { getMemorizeFirstStoryIds, topicStoryLinks } from '../data/contentGraph';
import { personalStories } from '../data/personalStories';
import { ContentSection } from './ContentSection';

type WeakSpotReviewProps = {
  onSelectTopic: (topicId: string) => void;
  onSelectStory: (storyId: string) => void;
};

function formatDaysAgo(timestamp: number): string {
  const days = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

export function WeakSpotReview({
  onSelectTopic,
  onSelectStory,
}: WeakSpotReviewProps) {
  const { progress, getWeakTopics, getLastPracticed } = useTrainingProgress();
  const weakTopics = getWeakTopics(3);
  const memorizeIds = getMemorizeFirstStoryIds();

  const staleTopics = topics
    .map((t) => ({ topic: t, last: getLastPracticed(t.id) }))
    .filter((x) => x.last !== null)
    .sort((a, b) => (a.last ?? 0) - (b.last ?? 0))
    .slice(0, 3);

  const recommendedStoryIds = [
    ...new Set(
      weakTopics.flatMap((tid) =>
        (topicStoryLinks[tid] ?? []).filter((id) => memorizeIds.includes(id))
      )
    ),
  ].slice(0, 4);

  const coldAttempts = progress.attempts
    .filter((a) => a.confidence === 'cold' || a.confidence === 'needs-review')
    .slice(-5)
    .reverse();

  return (
    <article className="topic-detail weak-spot-review">
      <h2 className="topic-detail__title">Review Next</h2>
      <p className="weak-spot-review__intro">
        Topics ranked by lowest confidence and rubric scores. Practice these
        before your next mock panel.
      </p>

      {weakTopics.length > 0 ? (
        <ContentSection title="Weak spots">
          <ul className="weak-spot-list">
            {weakTopics.map((id) => {
              const topic = topics.find((t) => t.id === id);
              const last = getLastPracticed(id);
              return (
                <li key={id}>
                  <button
                    type="button"
                    className="weak-spot-list__btn"
                    onClick={() => onSelectTopic(id)}
                  >
                    <span>{topic?.title ?? id}</span>
                    {last && (
                      <span className="weak-spot-list__meta">
                        Last practiced {formatDaysAgo(last)}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </ContentSection>
      ) : (
        <ContentSection title="Weak spots">
          <p>
            No weak spots yet — complete a few Train sessions to build your
            review list.
          </p>
        </ContentSection>
      )}

      {staleTopics.length > 0 && (
        <ContentSection title="Spaced repetition">
          <ul className="weak-spot-list">
            {staleTopics.map(({ topic, last }) => (
              <li key={topic.id}>
                <button
                  type="button"
                  className="weak-spot-list__btn"
                  onClick={() => onSelectTopic(topic.id)}
                >
                  <span>{topic.title}</span>
                  <span className="weak-spot-list__meta">
                    Last practiced {formatDaysAgo(last!)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </ContentSection>
      )}

      {recommendedStoryIds.length > 0 && (
        <ContentSection title="Stories to retell">
          <ul className="weak-spot-list">
            {recommendedStoryIds.map((id) => {
              const story = personalStories.find((s) => s.id === id);
              return story ? (
                <li key={id}>
                  <button
                    type="button"
                    className="weak-spot-list__btn"
                    onClick={() => onSelectStory(id)}
                  >
                    {story.title}
                  </button>
                </li>
              ) : null;
            })}
          </ul>
        </ContentSection>
      )}

      {coldAttempts.length > 0 && (
        <ContentSection title="Recent low-confidence answers">
          <ul className="topic-list-styled">
            {coldAttempts.map((a, i) => (
              <li key={i}>
                {topics.find((t) => t.id === a.topicId)?.title ?? a.topicId} —{' '}
                {a.confidence}
              </li>
            ))}
          </ul>
        </ContentSection>
      )}
    </article>
  );
}

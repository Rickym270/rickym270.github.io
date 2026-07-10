import type { StoryRecommendation } from '../../data/storyRecommendations';
import { ContentSection } from '../ContentSection';

type StoryRecommendationCardProps = {
  recommendation: StoryRecommendation;
};

export function StoryRecommendationCard({
  recommendation,
}: StoryRecommendationCardProps) {
  return (
    <ContentSection title="Recommended story — lead with this">
      <div className="story-recommendation">
        <p className="story-recommendation__title">{recommendation.title}</p>
        <p className="story-recommendation__reason">{recommendation.reason}</p>
        <p className="story-recommendation__lead">
          <strong>Lead with:</strong> {recommendation.leadWith}
        </p>
        <p className="story-recommendation__hint">
          STAR details stay hidden until you reveal the model answer.
        </p>
      </div>
    </ContentSection>
  );
}

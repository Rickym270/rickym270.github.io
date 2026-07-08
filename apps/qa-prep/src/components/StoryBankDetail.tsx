import type { PersonalStory } from '../types/personalStory';
import { ContentSection } from './ContentSection';

type StoryBankDetailProps = {
  story: PersonalStory;
};

export function StoryBankDetail({ story }: StoryBankDetailProps) {
  return (
    <article className="topic-detail">
      <h2 className="topic-detail__title">{story.title}</h2>

      <ContentSection title="Situation">
        <p>{story.situation}</p>
      </ContentSection>

      <ContentSection title="Task">
        <p>{story.task}</p>
      </ContentSection>

      <ContentSection title="Action">
        <p>{story.action}</p>
      </ContentSection>

      <ContentSection title="Result">
        <p>{story.result}</p>
      </ContentSection>

      <ContentSection title="Best Interview Question">
        <p>{story.bestQuestionFor}</p>
      </ContentSection>
    </article>
  );
}

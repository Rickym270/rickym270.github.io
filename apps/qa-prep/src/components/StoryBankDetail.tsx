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

      {story.lessonsLearned && (
        <ContentSection title="Lessons Learned">
          <p>{story.lessonsLearned}</p>
        </ContentSection>
      )}

      {story.judiHealthRelevance && (
        <ContentSection title="How this applies to Judi Health">
          <p>{story.judiHealthRelevance}</p>
        </ContentSection>
      )}

      {story.likelyFollowUps && story.likelyFollowUps.length > 0 && (
        <ContentSection title="Likely follow-up questions">
          <ul className="topic-list-styled">
            {story.likelyFollowUps.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </ContentSection>
      )}

      <ContentSection title="Best Interview Question">
        <p>{story.bestQuestionFor}</p>
      </ContentSection>
    </article>
  );
}
